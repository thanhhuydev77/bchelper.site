/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import { SpeedInsights} from "@vercel/speed-insights/next"
// Components
import App from './App.vue'
import router from './router'

// Styles
import 'unfonts.css'

const app = createApp(App)

registerPlugins(app)
app.use(router)
app.mount('#app')
