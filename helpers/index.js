// 根据机型设置操作栏高度
import {navigateToPage} from "./navigateTo";
import {isLogin} from "./login";

export const BING_IMAGE_URL = 'https://cn.bing.com/th?id=OHR.SwiftcurrentLake_ZH-CN1513761894_1920x1080.webp&qlt=50%22'
export const CARTOON_IMAGE_URL = 'https://www.dmoe.cc/random.php'

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

export function getWxOpenId() {
    const user = uni.getStorageSync('user')
    if (isLogin() && user) {
        return user.mp_wx_openid
    } else {
        navigateToPage('wxLogin')
        return false
    }
}

/**
 * 上传图片至云存储
 */
export async function uploadImage(url) {
    const fileName = url.split('/')
    return new Promise(resolve => {
        uniCloud.uploadFile({
            filePath: url,
            cloudPath: fileName[fileName.length - 1],
            success(res) {
                resolve(res)
            },
            fail() {
                uni.showToast({
                    title: '图片上传失败！',
                    icon: 'none'
                })
                resolve(false)
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
    const reg = new RegExp('^(\\+)?\\d+(\\.\\d+)?$', 'g')
    return reg.test(text)
}