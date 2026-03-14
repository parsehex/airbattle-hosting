import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const HOST = process.env.BOT_LOG_STREAM_HOST || '127.0.0.1';
const PORT = Number(process.env.BOT_LOG_STREAM_PORT || 3901);
const LOG_FILE = process.env.BOT_LOG_FILE || path.join(process.cwd(), 'logs', 'bots.log');
const POLL_INTERVAL_MS = Number(process.env.BOT_LOG_STREAM_POLL_MS || 500);

const clients = new Set();
let fileOffset = 0;
let trailingChunk = '';

function sendSse(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function classifyEventType(message) {
  const msg = String(message || '').toLowerCase();
  if (msg.includes('target:') || msg.includes('ffa target:') || msg.includes('ctf target:')) return 'target-change';
  if (msg.includes('my role is')) return 'role-change';
  if (msg.includes('i spawned')) return 'spawn';
  if (msg.includes('i was killed')) return 'death';
  if (msg.includes('i killed')) return 'kill';
  if (msg.includes('restarting bot')) return 'restart';
  if (msg.includes('delay between ticks')) return 'tick-delay';
  if (msg.includes('pathfinding')) return 'pathfinding';
  if (msg.includes('received command')) return 'team-command';
  if (msg.includes('worker')) return 'worker';
  return 'generic';
}

function toEvent(line) {
  const raw = line.trim();
  if (!raw) return null;

  try {
    const obj = JSON.parse(raw);
    const event = {
      time: obj.time || Date.now(),
      level: obj.level,
      bot: obj.bot || 'unknown',
      eventType: classifyEventType(obj.msg),
      message: obj.msg || raw
    };

    const extra = {};
    for (const key of Object.keys(obj)) {
      if (['time', 'level', 'msg', 'bot', 'pid', 'hostname', 'v'].includes(key)) continue;
      extra[key] = obj[key];
    }
    if (Object.keys(extra).length > 0) {
      event.context = extra;
    }

    return event;
  } catch {
    return {
      time: Date.now(),
      level: 'info',
      bot: 'raw',
      eventType: 'raw',
      message: raw
    };
  }
}

function broadcast(event) {
  if (!event) return;
  for (const res of clients) {
    sendSse(res, event);
  }
}

function processChunk(chunk) {
  trailingChunk += chunk;
  const lines = trailingChunk.split('\n');
  trailingChunk = lines.pop() || '';

  for (const line of lines) {
    broadcast(toEvent(line));
  }
}

function readNewContent() {
  fs.stat(LOG_FILE, (statErr, stats) => {
    if (statErr) {
      return;
    }

    if (stats.size < fileOffset) {
      fileOffset = 0;
      trailingChunk = '';
    }

    if (stats.size === fileOffset) {
      return;
    }

    const stream = fs.createReadStream(LOG_FILE, {
      encoding: 'utf8',
      start: fileOffset,
      end: stats.size - 1
    });

    stream.on('data', processChunk);
    stream.on('end', () => {
      fileOffset = stats.size;
    });
    stream.on('error', () => {
      // Ignore transient read errors and retry on next poll.
    });
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, clients: clients.size, logFile: LOG_FILE }));
    return;
  }

  if (req.url === '/stream') {
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'access-control-allow-origin': '*'
    });

    res.write(': connected\n\n');
    clients.add(res);

    req.on('close', () => {
      clients.delete(res);
    });

    return;
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, HOST, () => {
  console.log(`[bot-log-stream] listening on http://${HOST}:${PORT}`);
  console.log(`[bot-log-stream] reading ${LOG_FILE}`);
});

setInterval(readNewContent, POLL_INTERVAL_MS);
