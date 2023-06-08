<template>
  <view class="user">
    <NavBar background-color="rgba(0, 0, 0, 0)"/>
    <view class="user-bg">
      <image mode="aspectFill" :src="randomBg"/>
    </view>
    <view class="user-content">
      <UserHeader :user-info="userInfo"/>
    </view>
    <CustomTabBar :active-index="4"
                  :operation-height="operationHeight"/>
  </view>
</template>

<script>
import CustomTabBar from "../../../components/custom-tab-bar";
import NavBar from "../../../components/nav-bar";
import UserHeader from "./components/user-header/user-header";
import {mapState} from 'vuex'
import {getWxOpenId} from "../../../helpers";

export default {
  components: {
    CustomTabBar,
    NavBar,
    UserHeader
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
      randomBg: 'https://api.isoyu.com/bing_images.php' || 'https://www.dmoe.cc/random.php'
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
  position: relative;

  &-bg {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 500rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  &-content {
    margin-top: 280rpx;
  }
}
</style>