# Shooting Upgrade Boxes

My idea here is to let players shoot upgrade boxes, which will collide with other players and repel them (and maybe explode?)

I don't think there is anything that explodes with an AOE in the game, so instead maybe the box could shoot a few copter missiles in random directions when it despawns.

I'm trying to figure out how to allow shooting upgrades while still having normal missiles. I think we should take over the upgrade drop key so that they just shoot instead of dropping under the player.

Maybe all upgrade boxes work this way and we just force upgrade fever on.

## Snippets

### Shooting Missiles

From `ab-server\src\server\maintenance\players/update.ts` @ `line 101`

```ts
```

### Spawning Upgrade Boxes

From `ab-server\src\server\maintenance\powerups.ts` @ `line 252`

```ts
onSpawnPowerup({
	mobId,
	type,
	posX,
	posY,
	ownerId = null,
	permanent = false,
	chunkId = null,
}): void {
	const now = Date.now();
	let collitionsType = COLLISIONS_OBJECT_TYPES.INFERNO;

	if (type === MOB_TYPES.UPGRADE) {
		collitionsType = COLLISIONS_OBJECT_TYPES.UPGRADE;
	} else if (type === MOB_TYPES.SHIELD) {
		collitionsType = COLLISIONS_OBJECT_TYPES.SHIELD;
	}

	const powerup: Powerup = new Entity().attach(
		new Despawn(now + POWERUPS_DEFAULT_DESPAWN_MS),
		new Hitbox(),
		new HitCircles([...POWERUPS_COLLISIONS[type]]),
		new Id(mobId),
		new MobType(type),
		new Position(posX, posY),
		new Rotation(0)
	);

	if (ownerId !== null && type === MOB_TYPES.UPGRADE) {
		powerup.attach(new Owner(ownerId));
	}

	if (permanent) {
		powerup.despawn.permanent = true;
	}

	/**
	 * Fill grid data.
	 */
	if (chunkId !== null) {
		powerup.position.chunk = chunkId;

		const chunk = this.storage.powerupSpawns.get(chunkId);

		chunk.spawned += 1;
		chunk.last = now;
	}

	/**
	 * Hitbox init.
	 */
	const hitboxCache = this.storage.powerupHitboxesCache[type];

	powerup.hitbox.width = hitboxCache.width;
	powerup.hitbox.height = hitboxCache.height;
	powerup.hitbox.x = ~~powerup.position.x + MAP_SIZE.HALF_WIDTH + hitboxCache.x;
	powerup.hitbox.y = ~~powerup.position.y + MAP_SIZE.HALF_HEIGHT + hitboxCache.y;

	// TL, TR, BR, BL.
	const hitbox = new Circle(
		powerup.hitbox.x - hitboxCache.x,
		powerup.hitbox.y - hitboxCache.y,
		hitboxCache.width / 2
	);

	hitbox.id = powerup.id.current;
	hitbox.type = collitionsType;
	hitbox.isCollideWithViewport = true;
	hitbox.isCollideWithPlayer = true;
	hitbox.isBox = true;
	powerup.hitbox.current = hitbox;

	this.emit(COLLISIONS_ADD_OBJECT, powerup.hitbox.current);

	/**
	 * Add to storages.
	 */
	this.storage.mobList.set(mobId, powerup);

	if (type === MOB_TYPES.UPGRADE) {
		this.storage.upgradeIdList.add(mobId);
	} else if (type === MOB_TYPES.SHIELD) {
		this.storage.shieldIdList.add(mobId);
	} else {
		this.storage.infernoIdList.add(mobId);
	}
}
```

### Upgrade Box Player Collision

Allows players to pick up upgrade boxes by colliding with them. When dropping an upgrade, collisions are ignored for a short period of time to prevent the player from picking up the upgrade they just dropped.
From `ab-server\src\server\maintenance\collisions.ts`

```ts
// line 286
const collisions = player.hitbox.current.playerPotentials();

for (let ci = 0; ci < collisions.length; ci += 1) {
	const id = collisions[ci].id;
	const type = collisions[ci].type;

	if (this.isPlayerCollide(player, id)) {
		// . . .

		// line 326
		if (collisions[ci].isBox && !inactiveBoxes.has(id)) {
			if (type === COLLISIONS_OBJECT_TYPES.UPGRADE) {
				const box = this.storage.mobList.get(id) as Powerup;

				if (
					box.owner.current === player.id.current &&
					box.owner.lastDrop > this.now - UPGRADES_OWNER_INACTIVITY_TIMEOUT_MS
				) {
					continue;
				}
			}

			inactiveBoxes.add(id);
			this.delay(POWERUPS_PICKED, id, player.id.current);

			// . . .
		}
	}
}
```

### Goli repel

From `ab-server\src\server\maintenance\collisions.ts` @ `252:281`

```ts
if (player.planestate.repel) {
	const repel = this.storage.repelList.get(player.id.current);
	const collisions = repel.hitbox.current.repelPotentials();
	const repelProjectiles = [];
	const repelPlayers = [];

	for (let ci = 0; ci < collisions.length; ci += 1) {
		const id = collisions[ci].id;

		if (this.isRepelCollide(repel, id)) {
			if (collisions[ci].type === COLLISIONS_OBJECT_TYPES.PLAYER) {
				repelPlayers.push(id);
			} else {
				repelProjectiles.push(id);
			}
		}
	}

	this.emit(PLAYERS_REPEL_MOBS, player, repelPlayers, repelProjectiles);
	this.delay(BROADCAST_EVENT_REPEL, player.id.current, repelPlayers, repelProjectiles);

	this.emitDelayed();
}
```

### Missiles Applying Damage / Explosions
