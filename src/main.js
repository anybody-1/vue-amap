import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap'
import Vant from 'vant'
import { Button, Select, Steps, Step } from 'element-ui'
import 'vant/lib/index.css'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(VueAMap)
Vue.use(Vant)
Vue.use(Button)
  .use(Select)
  .use(Steps)
  .use(Step)
VueAMap.initAMapApiLoader({
  key: '5d2e3b9f9ab5939629c47d71e554a549',
  // key: 'c91607badc2777c98085643173b9c1ef',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Geolocation',
    'AMap.CitySearch'
  ],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
