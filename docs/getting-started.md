# Getting Started

Welcome to Air-Battle! Choose what you're looking for:

<div class="path-grid">

<a href="/where-to-play" class="path-card">
  <div class="path-icon">🎮</div>
  <div class="path-info">
    <h3>Jump Into a Game</h3>
    <p>Find a server and start playing right now</p>
  </div>
</a>

<a href="/setup" class="path-card">
  <div class="path-icon">🏠</div>
  <div class="path-info">
    <h3>Run a Server for Friends</h3>
    <p>Set up a private server on your own machine</p>
  </div>
</a>

<a href="/setup#play-solo" class="path-card">
  <div class="path-icon">🕹️</div>
  <div class="path-info">
    <h3>Play by Yourself</h3>
    <p>Play solo with bots</p>
  </div>
</a>

<a href="/hosting" class="path-card">
  <div class="path-icon">🌐</div>
  <div class="path-info">
    <h3>Host a Public Server</h3>
    <p>Deploy on a VPS with TLS, reverse proxy, and more</p>
  </div>
</a>

</div>

Already running a server? Check out the [Server Reference](/server/options) for configuration, or the [Management](/server/management) page for day-to-day operations.

<style>
.path-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 24px 0;
}

@media (max-width: 640px) {
  .path-grid {
    grid-template-columns: 1fr;
  }
}

.path-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(100, 100, 100, 0.25);
  text-decoration: none !important;
  color: inherit !important;
  transition: all 0.2s ease;
}

.path-card:hover {
  background: rgba(107, 189, 107, 0.08);
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.path-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
}

.path-info h3 {
  margin: 0 0 4px 0 !important;
  font-size: 1.05rem;
  border: none !important;
  padding: 0 !important;
}

.path-info p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
