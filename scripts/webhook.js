import http from 'http';
import crypto from 'crypto';
import { runCommandOutput } from './lib.js';

const PORT = process.env.WEBHOOK_PORT || 8081;
const SECRET = process.env.WEBHOOK_SECRET || 'secret';
const SERVER_ADMIN_PORT = process.env.SERVER_ADMIN_PORT || 3501;

const server = http.createServer((req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method Not Allowed');
      return;
    }

    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
      res.writeHead(400);
      res.end('Missing signature');
      return;
    }

    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = `sha256=${hmac.update(body).digest('hex')}`;

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
      console.log('Valid GitHub webhook payload received. Notifying ab-server...');

      try {
        // Hit the internal ab-server endpoint to set the flag
        await runCommandOutput('curl', ['-s', `http://127.0.0.1:${SERVER_ADMIN_PORT}/update-available`]);
        console.log('ab-server notified successfully.');

        res.writeHead(200);
        res.end('OK');
      } catch (err) {
        console.error('Failed to notify ab-server:', err);
        res.writeHead(500);
        res.end('Internal Server Error');
      }
    } else {
      console.error('Invalid signature');
      res.writeHead(401);
      res.end('Invalid signature');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Webhook listener running on port ${PORT}`);
});
