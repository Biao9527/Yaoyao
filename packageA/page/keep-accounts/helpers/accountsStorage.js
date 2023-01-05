export async function updateAccountsStorage (data) {
    return new Promise(resolve => {
        try {
            let tallyList = uni.getStorageSync('tally')
            if (tallyList) {
                tallyList.push(data)
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

export function verificationTallyForm (data) {
    if (!data.type) {
        this.showToast('请选择账单类型')
        return true
    } else if (!data.table) {
        this.showToast('请绑定标签')
        return true
    } else if (!data.date) {
        this.showToast('请选择时间')
        return true
    } else if (!data.money && data.money !== 0) {
        this.showToast('请输入金额')
        return true
    } else if (!data.notes) {
        this.showToast('请输入备注')
        return true
    }
}