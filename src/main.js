// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueResource from 'vue-resource'
Vue.use(Mint);
Vue.use(VueResource);
Vue.config.productionTip = false

Vue.prototype.$imgPrefix = 'http://ww3.sinaimg.cn/mw600/';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
