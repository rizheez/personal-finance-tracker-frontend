import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import 'vue-toast-notification/dist/theme-sugar.css'
import 'vuetify/styles'
// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
