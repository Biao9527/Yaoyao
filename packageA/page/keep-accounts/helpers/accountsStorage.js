export async function updateAccountsStorage(data, isEdit = false) {
    return new Promise(resolve => {
        try {
            let tallyList = uni.getStorageSync('tally')
            if (tallyList) {
                if (isEdit) {
                    const tabIndex = tallyList.findIndex(item => item.id === data.id)
                    tallyList[tabIndex] = data
                } else {
                    tallyList.push(data)
                }
            } else {
                tallyList = [data]
            }
            uni.setStorageSync('tally', tallyList)
            resolve(true)
        } catch (e) {
            resolve(false)
        }
    })
}

export async function removeAccountsStorage(data) {
    return new Promise(resolve => {
        try {
            let tallyList = uni.getStorageSync('tally')
            if (!tallyList) {
                resolve(false)
                return
            }
            data.map(items => {
                const index = tallyList.findIndex(item => item.id === items.id)
                if (index >= 0) {
                    tallyList.splice(index, 1)
                }
            })
            uni.setStorageSync('tally', tallyList)
            resolve(true)
        } catch (e) {
            resolve(false)
        }
    })
}

export function verificationTallyForm(data) {
    if (!data.type) {
        this.showToast('请选择账单类型')
        return true
    } else if (!data.table) {
        this.showToast('请绑定标签')
        return true
    } else if (!data.date) {
        this.showToast('请选择时间')
        return true
    } else if (!data.money) {
        this.showToast('请输入金额')
        return true
    } else if (!data.notes) {
        this.showToast('请输入备注')
        return true
    }
}