# How do game modes work?

ab-server/src/modes/{type}

- `manifest.ts` appears to set definition

## Adding a new game mode

Thoughts:

- First, copy e.g. ctf to a new folder
- Start to modify manifest.ts
  - Is imported/used in src/core/bootstrap.ts
  - Type added to GAME_TYPES in @airbattle/protocol/dist/types/server.d.ts
  - Add info to src/constants/upgrades.ts
  - Ensure server.typeId is set in src\config\config.ts @ ~600

### Infection Mode Thoughts

- Enable player-to-player collision, listen on PLAYER_BOUNCE event
  - Collisions appear to be in src\server\maintenance\collisions.ts
  -
