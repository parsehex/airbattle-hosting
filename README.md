# ab-docker

This is a repo to be able to easily run a modified instance of the game AIRMASH.

## Setup

1. Clone this repo + submodules and cd into it

```bash
git clone https://github.com/parsehex/ab-docker --recursive-submodules
cd ab-docker
```

3. Copy the environment files and make any necessary changes

```bash
cp .env.server.example .env.server
cp .env.bots.example .env.bots
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
