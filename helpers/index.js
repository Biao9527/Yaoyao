// 根据机型设置操作栏高度
import {verificationTallyForm} from "../packageA/page/keep-accounts/helpers/accountsStorage";

export function byModelsSetAction() {
    return new Promise(resolve => {
        uni.getSystemInfo({
            success: (res) => {
                const type = [
                    'Android', 'Windows', 'iPad', 'iPhone 5', 'iPhone 5s',
                    'iPhone 5c', 'iPhone 6', 'iPhone 6 Plus', 'iPhone 6s', 'iPhone 6s Plus',
                    'iPhone SE', 'iPhone 7', 'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus'
                ]
                const platform = ['mac', 'windows']
                if (res.platform.indexOf(platform) > -1) {
                    resolve('96rpx')
                    return
                }
                for (let i = 0; i < type.length; i++) {
                    if (res.system.indexOf(type[i]) !== -1 || res.model.indexOf(type[i]) !== -1) {
                        resolve('96rpx')
                        break
                    }
                }
            }
        })
    })
}

/**
 * ID自增生成器
 * @param key
 * @returns string
 */
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

/**
 * 校验是否为正数、负数、和小数
 * @param text string
 * @returns boolean
 */
export function verificationIsNumber(text) {
    const reg = new RegExp('^(\\-|\\+)?\\d+(\\.\\d+)?$','g')
    return reg.test(text)
}