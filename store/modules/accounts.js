export default {
    state: {
        accountList: []
    },
    getters: {
        getAccountList: state => {
            try {
                const list = uni.getStorageSync('tally')
                state.accountList = list.sort((a, b) => {
                    return a.date < b.date ? 1 : -1
                })
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