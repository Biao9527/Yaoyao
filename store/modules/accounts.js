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
        removeAccount(state, data) {
            data.map(items => {
                const index = state.accountList.findIndex(item => item.id === items.id)
                if (index >= 0) {
                    state.accountList.splice(index, 1)
                }
            })
        }
    },
    actions: {}
}