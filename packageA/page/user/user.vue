<template>
  <view>
    <NavBar title="我的"/>
    <view class="user">
      <view class="user-header">
        <view class="user-avatar">
          <image mode="aspectFill" :src="userInfo.avatarUrl"/>
        </view>
        <view class="user-name">
          <view>{{userInfo && userInfo.nickName ? userInfo.nickName : ''}}</view>
          <image v-if="userInfo && userInfo.gender"
                 class="user-gender"
                 :src="genderHash[userInfo.gender]" />
          <view v-if="userInfo && userInfo._id"
                class="user-id">
            ID：{{ userInfo._id.slice(0, 10) }}
          </view>
        </view>
      </view>
    </view>
    <CustomTabBar :active-index="4"
                  :operation-height="operationHeight"/>
  </view>
</template>

<script>
import CustomTabBar from "../../../components/custom-tab-bar";
import NavBar from "../../../components/nav-bar";
import {mapState} from 'vuex'
import {getWxOpenId} from "../../../helpers";
import women from './assets/women.svg'
import men from './assets/men.svg'

export default {
  components: {
    CustomTabBar,
    NavBar
  },
  onShow() {
    this.loadUserInfo()
  },
  computed: {
    ...mapState([
      'operationHeight'
    ])
  },
  data() {
    return {
      userInfo: null,
      genderHash: {
        1: men,
        2: women
      }
    }
  },
  methods: {
    loadUserInfo() {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      uniCloud.callFunction({
        name: 'user',
        data: {
          action: 'getUser',
          open_id: wx_openid
        },
        success: (res) => {
          if (res.result.status === 200) {
            this.userInfo = res.result.userInfo
          } else {
            this.showToast('获取用户资料失败！')
          }
        },
        fail: () => {
          this.showToast('获取用户资料失败！')
        }
      })
    },
    showToast(title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss">
.user {

  &-header {
    padding-top: 110rpx;
    width: 100%;
    position: relative;
    margin-top: 200rpx;
    background: #FFFFFF;
  }

  &-avatar {
    position: absolute;
    left: 48rpx;
    top: -76rpx;
    overflow: hidden;
    background: #FFFFFF;
    width: 152rpx;
    height: 152rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 144rpx;
      height: 144rpx;
      border-radius: 50%;

    }
  }

  &-name {
    margin-left: 60rpx;
    display: flex;
    align-items: center;
    font-size: 30rpx;
    color: #131C38;
    font-weight: bold;
  }

  &-gender {
    margin-left: 16rpx;
    width: 28rpx;
    height: 28rpx;
  }

  &-id {
    margin-left: 16rpx;
    padding: 0 12rpx;
    height: 32rpx;
    border-radius: 100rpx;
    background: #F6F6F6;
    font-size: 20rpx;
    color: #BBBBBB;
  }
}
</style>