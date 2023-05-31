<template>
  <view class="login">
    <NavBar title=""/>
    <button @click="getUserInfo">
      微信登陆
    </button>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import {updateIsLoginStorage, updateTokenStorage} from "../../../helpers/login";

export default {
  components: {
    NavBar
  },
  data() {
    return {
      userInfo: null
    }
  },
  methods: {
    getUserInfo() {
      uni.showLoading({
        title: '登陆中...'
      });
      const _this = this
      uni.getUserProfile({
        desc: '用于完善会员资料',
        success: (result) => {
          _this.userInfo = result.userInfo
          _this.wxLogin()
        }, fail: () => {
          updateTokenStorage()
          updateIsLoginStorage()
          uni.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          })
        }
      })
    },
    wxLogin() {
      const _this = this
      uni.login({
        provider: 'weixin',
        success: (res) => {
          if (res.code) {
            uniCloud.callFunction({
              name: 'user',
              data: {
                action: 'code2Session',
                js_code: res.code,
                user_info: _this.userInfo
              },
              success: (res) => {
                uni.hideLoading();
                if (res.result.result.result._id) {
                  const data = {
                    _id: res.result.result.result._id,
                    mp_wx_openid: res.result.result.result.mp_wx_openid,
                    register_date: res.result.result.result.register_date
                  }
                  updateTokenStorage(data)
                  updateIsLoginStorage(true)
                  uni.navigateBack()
                }
              },
              fail: () => {
                updateTokenStorage()
                updateIsLoginStorage()
                uni.hideLoading();
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>