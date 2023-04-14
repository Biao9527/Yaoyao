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
        },
        getTableItem: state => {
            return (tableId) => {
                state.tableList = uni.getStorageSync('tables')
                return state.tableList.filter(item => item.id === tableId)[0]
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
        },
        removeTable(state, data) {
            const tabIndex = state.tableList.findIndex(item => item.id === data.id)
            state.tableList.splice(tabIndex, 1)
        }
    },
    actions: {

    }
}