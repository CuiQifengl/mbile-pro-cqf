import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 是为了rem适配,基准值
import 'amfe-flexible'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'
// 引入全局样式
import '@/styles/Index.less'

// 引入自定义插件
import plugin from '@/utils/plugins'

// 注册使用
Vue.use(plugin)

Vue.use(Vant)
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
