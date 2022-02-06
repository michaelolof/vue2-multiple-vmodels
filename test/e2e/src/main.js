import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vue2MultipleVModels from "../../../dist"

Vue.config.productionTip = false
Vue.use(Vue2MultipleVModels);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
