export function updateTokenStorage(data = null) {
    if (data) {
        const expiresTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        data = {...data, expiresTime: expiresTime}
    }
    uni.setStorageSync('user', data)
}

export function updateIsLoginStorage(data = null) {
    uni.setStorageSync('isLogin', data)
}

//判断是否登陆
export function isLogin() {
    try {
        const user = uni.getStorageSync('user')
        const isLogin = uni.getStorageSync('isLogin')
        const nowTime = new Date().getTime()
        return !!(isLogin && user && user._id && user.expiresTime > nowTime);
    } catch (error) {

    }
}