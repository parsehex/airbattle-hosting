Player count is loaded from the `game.backendHost` which normally is data.airmash.online/games

Patched frontend in src/js/(Games.js,GamesData.js) to only use the default (static) games data defined in GamesData.js, with 1 server.

ab-server already gives a player+bot count when you GET / on the same address as ws
just update endpoint to return the expected data
