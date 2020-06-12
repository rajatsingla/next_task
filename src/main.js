import Vue from 'vue'
import App from './App.vue'
import store from './store'
const fb = require('./firebaseConfig.js')
import routes from './routes';
import './assets/scss/app.scss'
import { Button, Modal, Field, Input, Message, Navbar, Toast } from 'buefy'

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Modal)
Vue.use(Field)
Vue.use(Input)
Vue.use(Message)
Vue.use(Navbar)
Vue.use(Toast)

const router = routes
let app
fb.auth.onAuthStateChanged(() => {
    if (!app && store.state.currentUser) {
    app = new Vue({
      render: h => h(App),
      router,
      store,
    }).$mount('#app')
  }
})

