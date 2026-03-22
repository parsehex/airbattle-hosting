<template>
  <div class="landing">
    <!-- Background layer: tiled forest texture -->
    <div class="bg-terrain"></div>

    <!-- Dark overlay -->
    <div class="bg-overlay"></div>

    <!-- Scattered aircraft sprites (behind content) -->
    <div class="bg-aircraft">
      <img src="/assets/aircraft/raptor.png" class="plane plane-1" alt="" aria-hidden="true" />
      <img src="/assets/aircraft/tornado.png" class="plane plane-2" alt="" aria-hidden="true" />
      <img src="/assets/aircraft/prowler.png" class="plane plane-3" alt="" aria-hidden="true" />
      <img src="/assets/aircraft/spirit.png" class="plane plane-4" alt="" aria-hidden="true" />

      <div class="comanche-container plane-5">
        <img src="/assets/aircraft/comanche.png" class="comanche-body" alt="" aria-hidden="true" />
        <div class="comanche-rotor"></div>
      </div>

      <img src="/assets/aircraft/tornado.png" class="plane plane-6" alt="" aria-hidden="true" />
      <img src="/assets/aircraft/raptor.png" class="plane plane-7" alt="" aria-hidden="true" />

      <!-- Spritesheet items (powerups, crates, missiles) -->
      <div class="sprite-item item-upgrade" style="top: 25%; right: 15%; transform: rotate(15deg) scale(0.6);"></div>
      <div class="sprite-item item-shield" style="bottom: 20%; right: 25%; transform: rotate(-10deg) scale(0.6);"></div>
      <div class="sprite-item item-crate-rampage" style="top: 70%; left: 8%; transform: rotate(25deg) scale(0.6);"></div>
      <div class="sprite-item item-missile" style="top: 40%; right: 30%; transform: rotate(-135deg) scale(0.8);"></div>
      <div class="sprite-item item-crate-shield" style="bottom: 35%; left: 20%; transform: rotate(5deg) scale(0.6);"></div>
    </div>

    <!-- Content layer -->
    <div class="content">
      <div class="card">
        <div class="callout main-game">
          <h4>Play on the battle-tested arena:</h4>
          <a href="https://airmash.rocks" class="airmash-link">
            <img src="/assets/airmash_logo.png" alt="Airmash" class="airmash-logo" />
            <span>airmash.rocks</span>
          </a>
        </div>

        <main class="main-content">
          <Content />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Content } from 'vitepress'
</script>

<style>
/* Reset VitePress defaults for the landing page */
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

ul {
  list-style-type: disc;
}

/* Montserrat font from game assets */
@font-face {
  font-family: 'Montserrat';
  src: url('/assets/montserrat-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Montserrat';
  src: url('/assets/montserrat-extrabold.woff2') format('woff2');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Montserrat';
  src: url('/assets/montserrat-semibold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 60px 0;
  flex-wrap: wrap;

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 16px 0;
  }
}

.btn {
  padding: 12px 28px;
  border-radius: 6px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-primary {
  background: #6bbd6b;
  color: #000 !important;
  border: none;
  box-shadow: 0 4px 14px rgba(107, 189, 107, 0.4);
}

.btn-primary:hover {
  background: #8ed98e;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 189, 107, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #fff !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.airmash-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(107, 189, 107, 0.1);
  border: 2px solid rgba(107, 189, 107, 0.3);
  border-radius: 8px;
  text-decoration: none;
  color: #6bbd6b;
  font-weight: 700;
  transition: all 0.3s ease;
}

.airmash-link:hover {
  background: rgba(107, 189, 107, 0.2);
  border-color: #6bbd6b;
  box-shadow: 0 0 20px rgba(107, 189, 107, 0.4);
  transform: scale(1.05);
}

.airmash-logo {
  height: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* Hero / Header */
.hero {
  text-align: center;
  padding-top: 80px;
}

.logo {
  width: 320px;
  max-width: 80%;
  margin-bottom: 16px;
  filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.6));
}

.tagline {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.05em;
  margin: 0;
}

@media (max-width: 640px) {
  .hero {
    padding: 48px 0 24px;
  }
}
</style>

<style scoped>
.landing {
  position: relative;
  min-height: 100vh;
  font-family: 'Montserrat', sans-serif;
  color: #e0e0e0;
}

/* Tiled forest background */
.bg-terrain {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/assets/map_forest.jpg');
  background-repeat: repeat;
  background-size: 512px 512px;
}

/* Dark overlay for readability */
.bg-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.45);
}

/* Aircraft sprites layer */
.bg-aircraft {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.plane {
  position: absolute;
  opacity: 0.68;
  filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.45));
}

.plane-1 {
  top: 8%;
  left: 5%;
  width: 120px;
  transform: rotate(-30deg);
}
.plane-2 {
  top: 15%;
  right: 8%;
  width: 100px;
  transform: rotate(45deg);
}
.plane-3 {
  top: 45%;
  left: 3%;
  width: 80px;
  transform: rotate(-60deg);
}
.plane-4 {
  bottom: 25%;
  right: 5%;
  width: 110px;
  transform: rotate(20deg);
}

/* Comanche requires a wrapper for the rotor */
.comanche-container {
  position: absolute;
  opacity: 0.68;
  filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.45));
}
.comanche-body {
  width: 100%;
  display: block;
}
.comanche-rotor {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  background-image: url('/assets/aircraft.png');
  background-position: -1452px -4px;
  background-repeat: no-repeat;
  will-change: transform;
  /* Animate the rotor */
  animation: spin 0.4s linear infinite;
}

@keyframes spin {
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.plane-5 {
  bottom: 10%;
  left: 15%;
  width: 70px;
  transform: rotate(-15deg);
}
.plane-6 {
  top: 60%;
  right: 18%;
  width: 90px;
  transform: rotate(70deg);
}
.plane-7 {
  top: 30%;
  left: 25%;
  width: 85px;
  transform: rotate(-45deg) scaleX(-1);
}

/* Items from spritesheet */
.sprite-item {
  position: absolute;
  opacity: 0.68;
  filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.5));
  background-image: url('/assets/items.png');
  background-repeat: no-repeat;
}

.item-upgrade {
  width: 128px;
  height: 128px;
  background-position: -4px -268px;
}
.item-shield {
  width: 128px;
  height: 128px;
  background-position: -268px -4px;
}
.item-crate-rampage {
  width: 128px;
  height: 128px;
  background-position: -276px -268px;
}
.item-crate-shield {
  width: 128px;
  height: 128px;
  background-position: -140px -268px;
}
.item-missile {
  width: 64px;
  height: 128px;
  background-position: -548px -268px;
}

/* Content on top */
.content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 24px;
}

/* Dark card (like the game's login dialog) */
.card {
  width: 100%;
  max-width: 800px;
  background: rgba(14, 14, 14, 0.72);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0 40px 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
}

/* Main markdown content area */
.main-content {
  flex: 1;
}

.main-content :deep(h1),
.main-content :deep(h2),
.main-content :deep(h3) {
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  margin-top: 2em;
  margin-bottom: 0.5em;
}

.main-content :deep(h1) {
  font-size: 1.8rem;
  font-weight: 800;
}

.main-content :deep(h2) {
  font-size: 1.4rem;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.main-content :deep(p) {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.8em 0;
}

.main-content :deep(a) {
  color: #6bbd6b;
  text-decoration: none;
  border-bottom: 1px solid rgba(107, 189, 107, 0.3);
  transition: border-color 0.2s;
}

.main-content :deep(a:hover) {
  border-color: #6bbd6b;
}

.main-content :deep(ul),
.main-content :deep(ol) {
  color: rgba(255, 255, 255, 0.8);
  padding-left: 1.5em;
}

.main-content :deep(li) {
  margin: 0.4em 0;
  line-height: 1.6;
}

.main-content :deep(blockquote) {
  border-left: 3px solid rgba(107, 189, 107, 0.5);
  margin: 1.5em 0;
  padding: 0.5em 1em;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0 6px 6px 0;
}

.main-content :deep(code) {
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}



/* 2-Column Layout */
.main-content :deep(.info-grid) {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 20px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .main-content :deep(.info-grid) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Details / Summary Styling */
.main-content :deep(details) {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.main-content :deep(details[open]) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.main-content :deep(summary) {
  padding: 16px 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
}

.main-content :deep(summary::-webkit-details-marker) {
  display: none;
}

.main-content :deep(summary::before) {
  content: '▶';
  display: inline-block;
  margin-right: 12px;
  font-size: 0.7em;
  transition: transform 0.2s;
  color: #6bbd6b;
}

.main-content :deep(details[open] summary::before) {
  transform: rotate(90deg);
}

.main-content :deep(details > div),
.main-content :deep(details > p),
.main-content :deep(details > ul) {
  padding: 0 20px 20px 48px;
  margin: 0;
}

/* Alert / Custom Blockquote Styling */
.main-content :deep(blockquote) {
  border: 1px solid rgba(255, 100, 100, 0.2);
  background: rgba(255, 50, 50, 0.05);
  border-left: 4px solid #ff4d4d;
  color: #ffcccc;
}

.main-content :deep(blockquote strong) {
  color: #ff6666;
}

/* Callout Section */
.content .card :deep(.callout) {
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 32px;
  text-align: center;
}

.content .card :deep(.callout h4) {
  margin: 0 0 16px;
  color: #fff;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
}

.content .card :deep(.callout .btn) {
  display: inline-block;
}

/* Footer */
.landing-footer {
  padding: 40px 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
}

.footer-link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #fff;
}

.play-link {
  color: #6bbd6b;
}

.play-link:hover {
  color: #8ed98e;
}

/* Responsive */
@media (max-width: 640px) {
  .logo {
    width: 240px;
  }
  .tagline {
    font-size: 0.95rem;
  }
  .plane {
    opacity: 0.1;
  }
  .footer-links {
    gap: 20px;
  }
}
</style>
