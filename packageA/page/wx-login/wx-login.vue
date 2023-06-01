<template>
  <page-meta :page-style="'background: #FFFFFF'"/>
  <view class="login">
    <NavBar/>
    <view class="login-content">
      <image class="login-logo" :src="logo"/>
      <view class="login-title">
        摇摇晃摇
      </view>
      <view class="login-text">个人 · 记账 · 学习</view>
      <view class="login-button"
            @click="wxLogin">
        <image :src="weixin"/>
        <view>微信授权登陆</view>
      </view>
    </view>
    <update-user-info v-if="showUserInfo"
                      @onSubmit="onUpdateUserInfo"/>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import UpdateUserInfo from "./components/update-user-info/update-user-info";
import {updateIsLoginStorage, updateTokenStorage} from "../../../helpers/login";
import logo from '../../../static/logo.svg'
import weixin from '../../../static/weixin.svg'
import {uploadImage} from "../../../helpers";


export default {
  components: {
    NavBar,
    UpdateUserInfo
  },
  data() {
    return {
      logo,
      weixin,
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
    async wxLogin() {
      if (this.userInfo && this.userInfo.avatarUrl) {
        uni.showLoading({
          title: '正在上传图片...',
          mask: true
        });
        const imageUrl = await uploadImage(this.userInfo.avatarUrl)
        if (!imageUrl) {
          return
        }
        this.userInfo = {...this.userInfo, avatarUrl: imageUrl.fileID}
      }
      uni.showLoading({
        title: '登陆中...',
        mask: true
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
                if (res.result.result.result.register) {
                  _this.showUserInfo = true
                  uni.hideLoading();
                  return
                }
                if (res.result.result.result._id) {
                  const data = {
                    _id: res.result.result.result._id,
                    mp_wx_openid: res.result.result.result.mp_wx_openid,
                    register_date: res.result.result.result.register_date
                  }
                  this.loginSuccess(data)
                }
              },
              fail: () => {
                this.loginFail()
              }
            })
          }
        }
      })
    },
    loginSuccess(data) {
      updateTokenStorage(data)
      updateIsLoginStorage(true)
      uni.showToast({
        title: '登陆成功！',
        icon: 'none'
      });
      uni.navigateBack()
    },
    loginFail() {
      updateTokenStorage()
      updateIsLoginStorage()
      uni.showToast({
        title: '登陆失败！',
        icon: 'none'
      });
    }
  }
}
</script>

<style lang="scss">
.login {

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 100rpx 38rpx 0;
  }

  &-logo {
    margin: 95rpx 0 38rpx;
    width: 160rpx;
    height: 160rpx;
  }

  &-title {
    text-align: center;
    font-size: 60rpx;
    color: #333333;
    font-weight: bold;
  }

  &-text {
    margin-top: 20rpx;
    text-align: center;
    font-size: 32rpx;
    color: #808080;
  }

  &-button {
    width: 100%;
    background: #4cd964;
    font-size: 32rpx;
    color: #FFFFFF;
    border-radius: 100rpx;
    height: 88rpx;
    margin-top: 180rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      margin-right: 16rpx;
      width: 58rpx;
      height: 58rpx;
    }
  }
}
</style>