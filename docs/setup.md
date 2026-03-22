# Setting Up Air-Battle

## Install NVM / Node.js

First, install NVM if you haven't already:

::: details Windows
Download and run the latest `nvm-setup.exe` from [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).
:::

::: details Linux / macOS
Install NVM using the first command under `Install & Update Script` on [this page](https://github.com/nvm-sh/nvm#install--update-script).
:::

Then install Node.js v22:

```bash
nvm install 22
nvm use 22
```

## Clone and Build

Clone the repository with submodules and run the setup:

```bash
git clone --recursive https://github.com/parsehex/airbattle-hosting
cd airbattle-hosting
npm install
npm run setup
```

This will install and build all three components (`ab-server`, `ab-frontend`, `ab-bot`). Expect it to take a few minutes.

## Start the Server

```bash
npm run start
```

Open [`127.0.0.1:3501`](http://127.0.0.1:3501) in your browser — you're in!

### Add Bots

In a separate terminal, navigate to the `airbattle-hosting` directory and run:

```bash
npm run bots              # 1 bot
npm run bots -- --num=10  # 10 bots
```

## Configuration

You can customize the server by editing `.env.server`. See [Server Options](/server/options) for a full list of environment variables.

To change the games list shown in the frontend, edit `games.json` and rebuild:

```bash
npm run build:frontend
```

## Play Solo {#play-solo}

There are two ways to play by yourself:

### Option 1: Local Server + Bots

Follow the setup above and run bots alongside the server. This gives you the full game experience locally.

### Option 2: Electron Wrapper (Experimental)

There's an early desktop app that runs everything in a single window:

1. Follow the [setup instructions](#clone-and-build) above.
2. Build binaries for the server and bots:

```bash
npm run build-bins
```

3. Launch the desktop app:

```bash
npm run electron
```

The game opens in its own window. Use the control in the top right to adjust bot count — click Apply to restart them.

## Troubleshooting

### `EADDRINUSE`

If you see `EADDRINUSE: address already in use`, there's likely an old instance running.

::: details Windows
```powershell
Get-NetTCPConnection -LocalPort 3501 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```
:::

::: details Linux / macOS
```bash
kill -9 $(lsof -t -i:3501)
```
:::
