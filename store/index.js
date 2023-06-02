import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

//Vuex.Store 构造器选项
const store = new Vuex.Store({
    modules: {
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