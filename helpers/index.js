// 根据机型设置操作栏高度
export const byModelsSetAction = () => {
    uni.getSystemInfo({
        success: (res) => {
            const type = [
                'Android', 'Windows', 'iPad', 'iPhone 5', 'iPhone 5s',
                'iPhone 5c', 'iPhone 6', 'iPhone 6 Plus', 'iPhone 6s', 'iPhone 6s Plus',
                'iPhone SE', 'iPhone 7', 'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus'
            ]
            const platform = ['mac', 'windows']
            if (res.platform.indexOf(platform) > -1) {
                this.operationHeight = '96rpx'
                return
            }
            for (let i = 0; i < type.length; i++) {
                if (res.system.indexOf(type[i]) !== -1 || res.model.indexOf(type[i]) !== -1) {
                    this.operationHeight = '96rpx'
                    break
                }
            }
        }
    })
}