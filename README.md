# airbattle-docker

This is a repo to be able to easily run a modified instance of the game AIRMASH using community-remade components. I've made changes to the components to address issues and add features that I wanted.

This uses the following repos:

- [ab-frontend](https://github.com/parsehex/ab-frontend) - fork of [airmash-frontend](https://github.com/airmash-refugees/airmash-frontend)
- [ab-server](https://github.com/parsehex/ab-server) - fork of [ab-server](https://github.com/wight-airmash/ab-server)
- [ab-bot](https://github.com/parsehex/ab-bot) - fork of [AB-bot](https://github.com/spatiebot/ab-bot)

## Setup

1. Install nvm and node 12
   - Windows: Download and run the latest `nvm-setup.exe` from [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
   - For Linux/macOS: See [this page](https://github.com/nvm-sh/nvm#install--update-script)
2. Install node v12 by running:

```bash
nvm install 12
nvm use 12
```

3. Clone this repo + submodules and cd into it

```bash
git clone https://github.com/parsehex/airbattle-hosting --recursive
cd ab-hosting
```

4. Copy the environment and `games.json` files

```bash
cp .env.server.example .env.server
cp games.json.example games.json
```

Edit the files as needed.

## Thoughts

- Only have 1 copy of config files (in the repo that uses i), symlink to them in root during setup
- Provide definitions for server/etc options within JSON files
  - Organize by type (server, frontend, bot)
  - Include name, description, config location, key name, value type, value options
    - Value options can be a list, or an object with min/max and/or default keys
  - Load the files to display in the docs
  - Use the files to populate a CLI tool to change config options
