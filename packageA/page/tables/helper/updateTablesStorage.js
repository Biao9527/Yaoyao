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
            resolve(false)
        }
    })
}

export async function removeTableStorage(data) {
    return new Promise(resolve => {
        try {
            let tables = uni.getStorageSync('tables')
            if (!tables) {
                resolve(false)
                return
            }
            const index = tables.findIndex(item => item.id === data.id)
            if (index < 0) {
                resolve(false)
                return;
            }
            tables.splice(index, 1)
            uni.setStorageSync('tables', tables)
            resolve(true)
        } catch (e) {
            resolve(false)
        }
    })
}