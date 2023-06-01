<template>
  <view class="login">
    <NavBar/>
    <button @click="wxLogin">
      微信登陆
    </button>
    <view v-if="showUserInfo">
      <update-user-info @onSubmit="onUpdateUserInfo"/>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import UpdateUserInfo from "./components/update-user-info/update-user-info";
import {updateIsLoginStorage, updateTokenStorage} from "../../../helpers/login";

export default {
  components: {
    NavBar,
    UpdateUserInfo
  },
  data() {
    return {
      userInfo: null,
      showUserInfo: false
    }
  },
  methods: {
    onUpdateUserInfo(userInfo) {
      this.showUserInfo = false
      this.userInfo = userInfo
      this.wxLogin()
    },
    wxLogin() {
      uni.showLoading({
        title: '登陆中...'
      });
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
                if (res.result.result.result.register) {
                  _this.showUserInfo = true
                  return
                }
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