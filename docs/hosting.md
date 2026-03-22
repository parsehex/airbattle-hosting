# Hosting a Public Server

Guide for running Air-Battle on a public-facing server.

::: tip Prerequisites
Complete the [setup guide](/setup) first to make sure everything builds and runs locally.
:::

## VPS Setup

Any Linux VPS with at least **1 GB RAM** and **1 vCPU** should work fine. Providers like Hetzner, DigitalOcean, or Linode all work well.

1. Provision a server running **Ubuntu 22.04+** (or similar).
2. SSH in and follow the [setup guide](/setup) to install NVM, Node, and clone the repo.

## Running as a Service

Use `systemd` to keep the server running and auto-restart on crashes/reboots.

Create `/etc/systemd/system/airbattle.service`:

```ini
[Unit]
Description=Air-Battle Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/airbattle-hosting
ExecStart=/home/your-user/.nvm/versions/node/v22.x.x/bin/node ab-server/dist/app.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

::: warning Node path
The `ExecStart` path needs to point to your actual Node binary. Run `which node` to find it.
:::

Enable and start the service:

```bash
sudo systemctl enable airbattle
sudo systemctl start airbattle
```

You can create a similar service for the bots.

## Reverse Proxy with Nginx

For TLS (HTTPS/WSS) and proper domain support, put Nginx in front of the game server.

Install Nginx:

```bash
sudo apt install nginx
```

Create a config at `/etc/nginx/sites-available/airbattle`:

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3501;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }
}
```

Enable it and get a TLS certificate with Certbot:

```bash
sudo ln -s /etc/nginx/sites-available/airbattle /etc/nginx/sites-enabled/
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
sudo systemctl reload nginx
```

## Domain & DNS

Point your domain to your VPS IP with an **A record**. If you want a subdomain like `game.your-domain.com`, create an A record for that subdomain.

## Environment for Production

In `.env.server`, consider setting:

```bash
NODE_ENV=production
HOST=0.0.0.0
LOG_LEVEL=info
LOG_TO_CONSOLE=false
SU_PASSWORD="something-secure"
```

See [Server Options](/server/options) for the full list.
