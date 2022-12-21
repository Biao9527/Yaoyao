export default {
    state: {
        tableList: []
    },
    getters: {
        getMyTableList: state => {
            try {
                state.tableList = uni.getStorageSync('tables')
                return state.tableList
            } catch (e) {

            }
        }
    },
    mutations: {

    },
    actions: {

    }
}