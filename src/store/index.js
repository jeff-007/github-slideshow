import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import actions from './actions'
import mutations from './mutations'

import demo from './modules/demo'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    demo
  },
  actions,
  mutations,
  getters
});

export default store
