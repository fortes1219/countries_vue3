import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import request from '@/api/request'
import store from './store'
import ElementPlus from 'element-plus'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'element-plus/lib/theme-chalk/index.css'
import '@/styles/style.scss'

const app = createApp(App)
app.config.globalProperties.$request = request
app.use(VueAxios, axios)
app.use(store)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
