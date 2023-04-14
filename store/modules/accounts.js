export default {
    state: {
        accountList: []
    },
    getters: {
        getAccountList: state => {
            try {
                let list = uni.getStorageSync('tally')
                if (list && list.length >= 0) {
                    list = list.sort((a, b) => {
                        return a.date < b.date ? 1 : -1
                    })
                }
                state.accountList = list
                return state.accountList
            } catch (e) {

            }
        },
        getAccountItem : state => {
            return (id) => {
                let list = uni.getStorageSync('tally')
                return list.filter(item => item.id === id)[0]
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