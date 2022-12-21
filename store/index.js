import Vue from 'vue'
import Vuex from 'vuex'
import tables from './modules/tables'

Vue.use(Vuex);

//Vuex.Store 构造器选项
const store = new Vuex.Store({
    modules: {
        tables
    },
    state: {}
})
export default store