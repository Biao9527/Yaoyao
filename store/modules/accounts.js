export default {
    state: {
        accountList: []
    },
    getters: {
        getAccountList: state => {
            try {
                state.accountList = uni.getStorageSync('tally')
                return state.accountList
            } catch (e) {

            }
        }
    },
    mutations: {
        addAccount(state, data) {
            if (Array.isArray(state.accountList) && state.accountList.length > 0) {
                state.accountList.push(data)
            } else {
                state.accountList = [data]
            }
        },
    },
    actions: {}
}