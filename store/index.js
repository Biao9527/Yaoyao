import Vue from 'vue'
import Vuex from 'vuex'
import tables from './modules/tables'
import accounts from "./modules/accounts";

Vue.use(Vuex);

//Vuex.Store 构造器选项
const store = new Vuex.Store({
    modules: {
        tables,
        accounts
    },
    state: {
        operationHeight: ''
    },
    mutations: {
        setOperationHeight(state, payload) {
            state.operationHeight = payload
        }
    }
})
export default store