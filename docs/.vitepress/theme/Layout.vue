<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
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
    </template>
  </Layout>
</template>

<style scoped>
/* Aircraft sprites layer */
.bg-aircraft {
  position: fixed;
  inset: 0;
  z-index: 1; /* Below content but above terrain/overlay */
  pointer-events: none;
  overflow: hidden;
}

.plane {
  position: absolute;
  opacity: 0.25; /* Dialed down for docs readability */
  filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.45));
}

.plane-1 { top: 8%; left: 5%; width: 120px; transform: rotate(-30deg); }
.plane-2 { top: 15%; right: 8%; width: 100px; transform: rotate(45deg); }
.plane-3 { top: 45%; left: 3%; width: 80px; transform: rotate(-60deg); }
.plane-4 { bottom: 25%; right: 5%; width: 110px; transform: rotate(20deg); }

.comanche-container {
  position: absolute;
  opacity: 0.25;
  filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.45));
}
.comanche-body { width: 100%; display: block; }
.comanche-rotor {
  position: absolute;
  top: 50%; left: 50%;
  width: 100%; aspect-ratio: 1;
  transform: translate(-50%, -50%);
  background-image: url('/assets/aircraft.png');
  background-position: -1452px -4px;
  background-repeat: no-repeat;
  will-change: transform;
  animation: spin 0.4s linear infinite;
}

@keyframes spin {
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.plane-5 { bottom: 10%; left: 15%; width: 70px; transform: rotate(-15deg); }
.plane-6 { top: 60%; right: 18%; width: 90px; transform: rotate(70deg); }
.plane-7 { top: 30%; left: 25%; width: 85px; transform: rotate(-45deg) scaleX(-1); }

.sprite-item {
  position: absolute;
  opacity: 0.2;
  filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.5));
  background-image: url('/assets/items.png');
  background-repeat: no-repeat;
}

.item-upgrade { width: 128px; height: 128px; background-position: -4px -268px; }
.item-shield { width: 128px; height: 128px; background-position: -268px -4px; }
.item-crate-rampage { width: 128px; height: 128px; background-position: -276px -268px; }
.item-crate-shield { width: 128px; height: 128px; background-position: -140px -268px; }
.item-missile { width: 64px; height: 128px; background-position: -548px -268px; }

@media (max-width: 640px) {
  .plane { opacity: 0.05; }
  .comanche-container { opacity: 0.05; }
  .sprite-item { opacity: 0.05; }
}
</style>

<style>
/* Global background styles */
.bg-terrain {
  position: fixed;
  inset: 0;
  z-index: -2;
  background-image: url('/assets/map_forest.jpg');
  background-repeat: repeat;
  background-size: 512px 512px;
}

.bg-overlay {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: rgba(0, 0, 0, 0.65); /* Darker for docs */
  backdrop-filter: blur(2px);
}

/* Ensure the layout is transparent enough to see the background */
:root {
  --vp-c-bg: transparent !important;
  --vp-c-bg-alt: rgba(255, 255, 255, 0.03) !important;
  --vp-c-bg-soft: rgba(255, 255, 255, 0.05) !important;
  --vp-c-bg-mute: rgba(255, 255, 255, 0.07) !important;
}

/* Montserrat font */
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

body {
  font-family: 'Montserrat', var(--vp-font-family-base);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', var(--vp-font-family-base);
  font-weight: 700;
}
</style>
