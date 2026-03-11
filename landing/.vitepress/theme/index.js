import Landing from './Landing.vue'
import ServerStatus from './components/ServerStatus.vue'

export default {
  Layout: Landing,
  enhanceApp({ app }) {
    app.component('ServerStatus', ServerStatus)
  },
}
