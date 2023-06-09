<template>
  <view class="user">
    <NavBar background-color="rgba(0, 0, 0, 0)"/>
    <view class="user-bg">
      <image mode="aspectFill" :src="userInfo.background.url"/>
    </view>
    <view class="user-content">
      <UserHeader :user-info="userInfo"/>
      <UserList :user-info="userInfo"
                @onItem="onListItem"/>
    </view>
    <AboutPopup :is-open.sync="isOpenAbout"/>
    <CustomTabBar :active-index="4"
                  :operation-height="operationHeight"/>
  </view>
</template>

<script>
import CustomTabBar from "../../../components/custom-tab-bar";
import NavBar from "../../../components/nav-bar";
import UserHeader from "./components/user-header/user-header";
import UserList from "./components/user-list/user-list";
import AboutPopup from "../../../components/about-popup/about-popup";
import {mapState} from 'vuex'
import {BING_IMAGE_URL, CARTOON_IMAGE_URL, getWxOpenId, uploadImage} from "../../../helpers";
import {navigateToPage} from "../../../helpers/navigateTo";

export default {
  components: {
    CustomTabBar,
    NavBar,
    UserHeader,
    UserList,
    AboutPopup
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
      isOpenAbout: false
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
          if (res.result) {
            if (!res.result.background) {
              const bgList = [
                {name: '每日 Bing', url: BING_IMAGE_URL},
                {name: '二次元', url: CARTOON_IMAGE_URL}
              ]
              this.userInfo = {
                ...res.result,
                background: bgList[Math.round(Math.random())]
              }
              return
            }
            this.userInfo = res.result
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
    },
    onListItem(value) {
      switch (value) {
        case 'chat':
          navigateToPage('aiChat')
          break
        case 'contact':
          break
        case 'warn':
          this.isOpenAbout = true
          break
        case 'bg':
          this.onSelectBgImg()
          break
      }
    },
    onSelectBgImg() {
      uni.showActionSheet({
        title: '背景图片',
        itemList: ['每日 Bing', '随机二次元', '上传图片'],
        success: res => {
          switch (res.tapIndex) {
            case 0:
              const bing = {
                name: '每日 Bing',
                url: BING_IMAGE_URL
              }
              this.updateUserBg(bing)
              break
            case 1:
              const payload = {
                name: '二次元',
                url: CARTOON_IMAGE_URL
              }
              this.updateUserBg(payload)
              break
            case 2:
              const that = this
              uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                success: async function (res) {
                  uni.showLoading({
                    title: '正在上传图片...',
                    mask: true
                  });
                  const imageUrl = await uploadImage(res.tempFilePaths[0])
                  if (!imageUrl) {
                    that.showToast('图片上传失败！')
                    return
                  }
                  const bg = {
                    name: '自定义',
                    url: imageUrl.fileID
                  }
                  that.updateUserBg(bg)
                }
              });
              break
          }
        },
        fail: () => {
        }
      })
    },
    updateUserBg(bg) {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      if (bg.url === this.userInfo.background.url) {
        return
      }
      uni.showLoading({
        title: '正在修改背景...',
        mask: true
      })
      uniCloud.callFunction({
        name: 'user',
        data: {
          action: 'update',
          _id: this.userInfo._id,
          info: {
            background: bg
          }
        },
        success: (res) => {
          if (res.result.status === 200) {
            this.userInfo = {
              ...this.userInfo,
              background: bg
            }
            this.showToast('修改背景成功')
          } else {
            this.showToast('修改背景失败！')
          }
        },
        fail: () => {
          this.showToast('修改背景失败！')
        }
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