<template>
  <div class="server-status" v-if="status">
    <span class="count-item">
      <span class="value">{{ players }}</span>
      <span class="label">players</span>
    </span>
    <span class="divider">|</span>
    <span class="count-item">
      <span class="value">{{ bots }}</span>
      <span class="label">bots</span>
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const status = ref(null)
const players = ref(0)
const bots = ref(0)

let interval = null

const fetchStatus = async () => {
  try {
    const response = await fetch('https://ctf.game.air-battle.net/', {
      headers: {
        'Accept': 'application/json'
      }
    })
    if (response.ok) {
      const data = await response.json()
      status.value = data
      bots.value = data.bots
      if (bots.value > 0 && data.players >= bots.value) data.players -= bots.value
      players.value = data.players
    }
  } catch (err) {
    console.error('Failed to fetch server status:', err)
  }
}

onMounted(() => {
  fetchStatus()
  interval = setInterval(fetchStatus, 30000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.server-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.02em;
}

.value {
  color: #6bbd6b;
  margin-right: 2px;
}

.label {
  text-transform: lowercase;
}

.divider {
  opacity: 0.3;
}
</style>
