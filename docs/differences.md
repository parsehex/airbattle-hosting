# What's Different in Air-Battle

Air-Battle is built from community-made components. Here's a summary of what's been changed in each one.

## Frontend <span class="component-sub"><a href="https://github.com/parsehex/ab-frontend" target="_blank">ab-frontend</a></span>

Fork of [airmash-frontend](https://github.com/airmash-refugees/airmash-frontend) by [airmash-refugees](https://github.com/airmash-refugees) and other [contributors](https://github.com/airmash-refugees/airmash-frontend/graphs/contributors).

- **Quick Respawn** — press `Shift` + `1`–`5` to instantly respawn as a specific ship
- **Click to spectate** — click players, the minimap, or carrier names to switch who you're watching
- **SuperUser badge** — admins are tagged visually for all players
- **Better reconnecting** — past chat messages are kept; can retry reconnect after 3s
- **Ship icons on scoreboard** — press `Tab` to see what ships each player is using
- **Free Camera** — press `C` while spectating to pan around the map freely
- **Extra spawn lines** — See where you / the enemy will respawn when using the alternate spawns

<a href="https://github.com/parsehex/ab-frontend/commits/main" class="commits-link" target="_blank">
  📜 Full commit history
</a>

---

## Server <span class="component-sub"><a href="https://github.com/parsehex/ab-server" target="_blank">ab-server</a></span>

Fork of [ab-server](https://github.com/wight-airmash/ab-server) by [wight-airmash](https://github.com/wight-airmash) and other [contributors](https://github.com/wight-airmash/ab-server/graphs/contributors).

- **Node.js v20+ support** — based on work by [Nebulous-Narwhal-48](https://github.com/Nebulous-Narwhal-48)
- **`/update` command** — admins can update the server + restart from in-game
- **`/bots` command** — admins can change bot count and settings from in-game
- Too many powerups

<a href="https://github.com/parsehex/ab-server/commits/main" class="commits-link" target="_blank">
  📜 Full commit history
</a>

---

## Bots <span class="component-sub"><a href="https://github.com/parsehex/ab-bot" target="_blank">ab-bot</a> (Spatie Bot)</span>

Fork of [AB-bot](https://github.com/spatiebot/ab-bot) by [spatiebot](https://github.com/spatiebot)

- **Flag strategy** — bots strategize between `#capture` and `#defend` depending on Score
- **Flag passing** — bot carriers pass the flag to teammates
  - Heli bots seek and drop to a Goliath
  - Non-Goliath carriers drop to nearby players

<a href="https://github.com/parsehex/ab-bot/commits/main" class="commits-link" target="_blank">
  📜 Full commit history
</a>

---

## Hosting Repo <span class="component-sub"><a href="https://github.com/parsehex/airbattle-hosting" target="_blank">airbattle-hosting</a></span>

Duct tape bringing all three pieces together.

- **One-command setup** — `npm run setup` installs and builds everything
- **Unified start** — `npm run start` for the server + frontend, `npm run bots` for bots
- **Electron wrapper** (experimental) — play the game as a desktop app with bots
- **Documentation site** — this site, at [docs.air-battle.net](https://docs.air-battle.net)

<a href="https://github.com/parsehex/airbattle-hosting/commits/main" class="commits-link" target="_blank">
  📜 Full commit history
</a>

<style>
.component-sub {
  font-weight: 400;
  font-size: 0.55em;
  opacity: 0.6;
  font-family: monospace;
}

.commits-link {
  display: inline-block;
  margin-top: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.commits-link:hover {
  opacity: 1;
}
</style>
