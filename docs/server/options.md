# Server Options

Use this page as a practical reference for configuring a server quickly.

## Which env file is used?

The server process reads env values from its own directory at [`ab-server/.env`](ab-server/.env).

In this repo, [`.env.server`](.env.server) at the root is a symlink to that file, so editing either path updates the same config.

## Quick Copy Default

Start with this baseline and tune from there:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3501

SERVER_TYPE=ffa
SERVER_ROOM=ab-ffa
SCALE_FACTOR=5500

LOG_LEVEL=info
LOG_TO_CONSOLE=false

SU_PASSWORD=change-me

WELCOME_MESSAGES="Hello, %username%!%split%Welcome to this Air-Battle server."
```

## Commonly Changed Options

### Identity and mode

- `SERVER_TYPE`: Choose ffa, ctf, or btr.
- `SERVER_ROOM`: Room ID exposed to clients.
- `SCALE_FACTOR`: Max client zoom limit.
- `SERVER_BOT_NAME` and `SERVER_BOT_FLAG`: Name/flag used by server whispers.

### Join-time messaging

- `WELCOME_MESSAGES`: Multiple messages are supported with %split%.
  - %username% in message text is replaced per player.

Example:

```env
WELCOME_MESSAGES="Hello, %username%!%split%Type /help for commands.%split%Have fun."
```

### Security and moderation

- `SU_PASSWORD`: Required for privileged in-game commands.
- `MODERATION_PANEL`: Enable or disable web moderation panel.
- `MODERATION_PANEL_URL_ROUTE`: Route for moderation panel.
- `ADMIN_PASSWORDS_PATH`: Path to moderator password file.

### Network and deployment

- `HOST` and `PORT`: Bind address and service port.
- `BASE_PATH`: Prefix path when serving behind a reverse proxy.
- `ENDPOINTS_TLS` and `CERTS_PATH`: Enable TLS and set certificate path.

### Logging and operations

- `LOG_LEVEL`: debug, info, warn, error, fatal, silent.
- `LOG_FILE` and `LOG_CHAT_FILE`: Log file paths.
- `LOG_TO_CONSOLE`: Useful with systemd/journal logging.

