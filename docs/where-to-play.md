# Where to Play

## <a href="https://airmash.rocks" class="play-link" target="_blank">AIRMASH.ROCKS</a> <span class="subtitle">— the main game</span>

The best place to find other players. Multiple servers across United States and Europe.

<div class="server-grid main-game">

<a href="https://airmash.rocks/#us-ffa1" class="server-card" target="_blank">
  <div class="server-region">🇺🇸 US</div>
  <div class="server-mode">Free For All</div>
</a>

<a href="https://airmash.rocks/#us-ctf1" class="server-card" target="_blank">
  <div class="server-region">🇺🇸 US</div>
  <div class="server-mode">Capture the Flag</div>
</a>

<a href="https://airmash.rocks/#us-btr1" class="server-card" target="_blank">
  <div class="server-region">🇺🇸 US</div>
  <div class="server-mode">Battle Royale</div>
</a>

<a href="https://airmash.rocks/#eu-ffa1" class="server-card" target="_blank">
  <div class="server-region">🇪🇺 EU</div>
  <div class="server-mode">Free For All</div>
</a>

<a href="https://airmash.rocks/#eu-btr1" class="server-card" target="_blank">
  <div class="server-region">🇪🇺 EU</div>
  <div class="server-mode">Battle Royale</div>
</a>

</div>

## Air-Battle <span class="subtitle">— this place</span>

I host only a CTF server with some [differences](/differences).

<div class="server-grid ab-game">

<a href="https://game.air-battle.net" class="server-card ab" target="_blank">
  <div class="server-mode">Capture the Flag</div>
</a>

</div>

::: tip Want to run your own?
Check out the [setup guide](/setup) to host a server for friends or just yourself.
:::

<style>
.subtitle {
  font-weight: 400;
  font-size: 0.6em;
  opacity: 0.6;
}

.server-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.server-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.15);
  text-decoration: none !important;
  color: inherit !important;
  transition: all 0.2s ease;
  text-align: center;
}

.server-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.main-game .server-card:hover {
  background: rgba(100, 160, 255, 0.1);
  border-color: rgba(100, 160, 255, 0.4);
}

.ab-game .server-card:hover {
  background: rgba(107, 189, 107, 0.1);
  border-color: var(--vp-c-brand-1);
}

.server-region {
  font-size: 0.85rem;
}

.server-mode {
  font-weight: 600;
  font-size: 1rem;
}

.server-note {
  font-size: 0.8rem;
  opacity: 0.5;
}

.play-link {
  font-weight: 700;
  color: inherit !important;
  text-decoration: none;
}

.play-link:hover {
  color: var(--vp-c-brand-1) !important;
}
</style>
