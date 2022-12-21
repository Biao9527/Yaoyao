export async function UpdateTablesStorage(data, isEdit = false) {
    return new Promise(resolve => {
        try {
            let tables = uni.getStorageSync('tables')
            if (tables) {
                const filterTabs = tables.filter(item => item.icon === data.icon && item.name === data.name)
                if (filterTabs && filterTabs.length > 0) {
                    uni.showToast({
                        title: '标签重复',
                        icon: 'none'
                    })
                    resolve(false)
                    return
                }
                if (isEdit) {
                    const tabIndex = tables.findIndex(item => item.id === data.id)
                    tables[tabIndex].icon = data.icon
                    tables[tabIndex].name = data.name
                } else {
                    tables.push(data)
                }
            } else {
                tables = [data]
            }
            uni.setStorageSync('tables', tables)
            resolve(true)
        } catch (e) {
            resolve(true)
        }
    })
}

export function autoIncrementId(key) {
    try {
        let value = uni.getStorageSync(key)
        if (value) {
            uni.setStorageSync(key, value += 1)
            return value
        }
        uni.setStorageSync(key, 1)
        return 1
    } catch (e) {

    }
}