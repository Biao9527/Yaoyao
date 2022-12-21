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
        addTable(state, data) {
            if (Array.isArray(state.tableList) && state.tableList.length > 0) {
                state.tableList.push(data.data)
            } else {
                state.tableList = [data.data]
            }
        },
        updateTable(state, data) {
            const tabIndex = state.tableList.findIndex(item => item.id === data.data.id)
            state.tableList[tabIndex].icon = data.data.icon
            state.tableList[tabIndex].name = data.data.name
        }
    },
    actions: {

    }
}