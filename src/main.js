import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Http from './tools/http.js'

Vue.prototype.$http = Http
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
