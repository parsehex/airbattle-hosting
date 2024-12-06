# airbattle-docker

This is a repo to be able to easily run an instance of the game AIRMASH. It uses the following repos:

- [ab-frontend](https://github.com/parsehex/ab-frontend) - fork of [airmash-frontend](https://github.com/airmash-refugees/airmash-frontend)
- [ab-server](https://github.com/parsehex/ab-server) - fork of [ab-server](https://github.com/wight-airmash/ab-server)
- [ab-bot](https://github.com/parsehex/ab-bot) - fork of [AB-bot](https://github.com/spatiebot/ab-bot)

## Setup

<!-- requirements: nvm, node 12 -->

1. Clone this repo + submodules and cd into it

```bash
git clone https://github.com/parsehex/ab-docker --recursive-submodules
cd ab-docker
```

3. Copy the environment files, `games.json` and `start-bots.sh` and make any necessary changes

```bash
cp .env.server.example .env.server
cp .env.bots.example .env.bots
cp games.json.example games.json
cp start-bots.sh.example start-bots.sh
```

4. Build the docker image

```bash
docker-compose build
```

5. Run the docker image

```bash
docker-compose up
```

To run the server in the background, use the `-d` flag

```bash
docker-compose up -d
```

### Making Changes

After you change the code or environment file(s), stop the server and rebuild the image, then run it again:

```bash
docker-compose down
docker-compose build
docker-compose up
```
