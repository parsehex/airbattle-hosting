# airbattle-hosting

This is a repo to be able to easily run a modified instance of the game AIRMASH using community-remade components. I've made changes to the components to address issues and add features that I wanted.

This uses the following repos:

- [ab-frontend](https://github.com/parsehex/ab-frontend) - fork of [airmash-frontend](https://github.com/airmash-refugees/airmash-frontend) created by [airmash-refugees](https://github.com/airmash-refugees) with other [contributors](https://github.com/airmash-refugees/airmash-frontend/graphs/contributors)
- [ab-server](https://github.com/parsehex/ab-server) - fork of [ab-server](https://github.com/wight-airmash/ab-server) created by [wight-airmash](https://github.com/wight-airmash) with other [contributors](https://github.com/wight-airmash/ab-server/graphs/contributors)
- [ab-bot](https://github.com/parsehex/ab-bot) - fork of [AB-bot](https://github.com/spatiebot/ab-bot) created by [spatiebot](https://github.com/spatiebot)

## Setup

> Please also see the [Getting Started](https://docs.air-battle.net/getting-started) page for the most up-to-date instructions.

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

You can edit the sym-linked `.env.*` files to customize the server / bots, or change `games.json` which is loaded by the frontend for the games list (for changes to take effect, run `npm run build:frontend`).

## Thoughts / TODO (old)

- Provide definitions for server/etc options within JSON files
  - Organize by type (server, frontend, bot)
  - Include name, description, config location, key name, value type, value options
    - Value options can be a list, or an object with min/max and/or default keys
  - Load the files to display in the docs
  - Use the files to populate a CLI tool to change config options

## License

This repository has a [LICENSE](./LICENSE) status notice.

In short:

- No license is granted for this project as a whole.
- Unless a component explicitly states otherwise, all rights are reserved by the respective rights holder(s).
- Some components do include their own licenses.
- Using or redistributing material from this repository may involve legal risk due to the mixed ownership status of AIRMASH as a game.
- No trademark rights are granted.
- Where licensing is unclear, no additional rights are granted.

Please read [LICENSE](./LICENSE) for full details.
