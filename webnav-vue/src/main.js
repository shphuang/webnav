import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //引入持久化插件

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia).use(ElementPlus).mount('#app')
