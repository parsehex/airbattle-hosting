# airbattle-docker

This is a repo to be able to easily run a modified instance of the game AIRMASH using community-remade components. I've made changes to the components to address issues and add features that I wanted.

This uses the following repos:

- [ab-frontend](https://github.com/parsehex/ab-frontend) - fork of [airmash-frontend](https://github.com/airmash-refugees/airmash-frontend)
- [ab-server](https://github.com/parsehex/ab-server) - fork of [ab-server](https://github.com/wight-airmash/ab-server)
- [ab-bot](https://github.com/parsehex/ab-bot) - fork of [AB-bot](https://github.com/spatiebot/ab-bot)

## Setup

> Please also see the [Getting Started](https://parsehex.github.io/airbattle-hosting/getting-started) page for the most up-to-date instructions.

1. Install nvm and node 22
   - Windows: Download and run the latest `nvm-setup.exe` from [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
   - For Linux/macOS: See [this page](https://github.com/nvm-sh/nvm#install--update-script)
2. Install Node v22 by running:

```bash
nvm install 22
```

3. Clone this repo + submodules, cd into it, install and run the setup script.

```bash
git clone https://github.com/parsehex/airbattle-hosting --recursive
cd airbattle-hosting
npm install
npm run setup
```

Expect this to take some time, but eventually you should have built copies of `ab-bot`, `ab-frontend`, and `ab-server`.

You can edit the sym-linked file `.env.server` to customize the server, or change `games.json` which is loaded by the frontend for the games list (for changes to take effect, run `npm run build:frontend`).

## Electron wrapper (experimental)

There is an early version of an electron wrapper which runs the server/frontend + bots with a single command and window. This is something I've personally wanted for a while and it wouldn't be possible without **Node v20+ support** in `ab-server` which was accomplished by [Nebulous-Narwhal-48](https://github.com/Nebulous-Narwhal-48) on [their fork](https://github.com/Nebulous-Narwhal-48/ab-server).

To try this yourself:

1. Follow the [Setup](#setup) instructions.
2. Create binaries for the server and bots:

```bash
# from within airbattle-hosting/
npm run build-bins
```

3. Now run the electron app:

```bash
npm run electron
```

The window should open after a few seconds and now you can play the game single player with bots!

You can use the control at the top right corner to change the number of bots -- click Apply to restart the bots.

## Thoughts / TODO

- Provide definitions for server/etc options within JSON files
  - Organize by type (server, frontend, bot)
  - Include name, description, config location, key name, value type, value options
    - Value options can be a list, or an object with min/max and/or default keys
  - Load the files to display in the docs
  - Use the files to populate a CLI tool to change config options

## License

Since this project is based on unlicensed code recreating or duplicating the original AIRMASH game, this project also has no license.
