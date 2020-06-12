import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';
import state from './state.js';
const fb = require('../firebaseConfig.js')
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let storeObj = {
  strict: true,
  state,
  actions,
  getters,
  mutations,
  modules: [
  ],
};


export const store = new Vuex.Store(storeObj)
fb.auth.onAuthStateChanged(user => {
  console.log("i am here")
  if (user) {
    store.commit('setCurrentUser', user)
    store.dispatch('fetchUserProfile')
  }
  else {
    fb.auth.signInAnonymously().catch(function() {});
  }
})
export default store;
