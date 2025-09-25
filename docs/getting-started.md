# Setting Up Airbattle

(Work in progress)

## Install NVM / Node.js

First, install NVM if you haven't already. See the instructions for your operating system below:

::: details Windows
Download and run the latest `nvm-setup.exe` from [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).
:::

::: details Linux/macOS
Run <code>curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash</code> in your terminal.

See full/updated instructions on [this page](https://github.com/nvm-sh/nvm#install--update-script)
:::

Now, install Node.js v22 by running the following commands:

```bash
nvm install 22
nvm use 22
```

## Clone the Repository and Setup

Clone this repository and its submodules, then navigate into the directory and begin setting up the environment:

```bash
git clone --recursive https://github.com/parsehex/airbattle-hosting
cd airbattle-hosting
npm install
```

Now, run the setup script to copy the needed files and proceed with the setup:

```bash
npm run setup
```

## Start the Server

To start the server, run:

```bash
npm run start
```

### Access the Game

You should be able to access the game at [`127.0.0.1:3501`](http://127.0.0.1:3501) in your browser.

To let others join your server, see the [external sharing](./external-sharing.md) guide for more information.

## Running Spatie Bots

You must run the bots separately for now. To start 1 bot, open a new terminal, navigate to the `airbattle-hosting` directory, and run:

```bash
npm run bots
```

To join more than 1 bot, add `-- --num=` after the above command. For example, **to run 10 bots**:

```bash
npm run bots -- --num=10
```

## Troubleshooting

### `EADDRINUSE`

If you see an error like `EADDRINUSE: address already in use`, there might be instance(s) running in the background.

You can kill them by running one of the following commands:

::: details Windows
```powershell
Get-NetTCPConnection -LocalPort 3501 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```
:::

::: details Linux/macOS
```bash
kill -9 $(lsof -t -i:3501)
```
:::
