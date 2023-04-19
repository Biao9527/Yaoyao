<template>
  <view class="about-popup"
        v-if="isOpen"
        @click="onClose">
    <view class="about-popup-view"
          :style="contentTop">
      <view class="about-popup-close"
            @click.stop="onClose()">
        <uni-icons type="closeempty" size="46rpx" color="#BBBBBB"/>
      </view>
      <view class="about-popup-title">关于我们</view>
      <view class="about-popup-content">
        <view class="about-popup-tips">⚠️ 小程序使用本地缓存（Storage）存储数据，删除小程序会导致数据全部清空！</view>
        <view class="about-popup-text">·本小程序属于个人学习的开源项目。</view>
        <view class="about-popup-text">·本项目基于 uni-app / Vue2 / JavaScript / Scss 开发的记账类型微信小程序</view>
        <view class="about-popup-text">·用到的扩展组件：
          <text class="und"
                @click.stop="onCopyText('uni-ui')">
            uni-ui
          </text>
          {{ ' / ' }}
          <text class="und"
                @click.stop="onCopyText('uCharts')">
            uCharts
          </text>
        </view>
        <view class="about-popup-text">·GitHub：
          <text class="und"
                @click.stop="onCopyText('GitHub')">
            https://github.com
          </text>
        </view>
      </view>
      <view class="about-popup-button"
            :style="buttonStyle"
            @click.stop="onLiked">
        <uni-icons :type="isLike ? 'hand-up-filled' : 'hand-up'" size="56rpx" color="#FFFFFF"/>
        <view>{{ isLike ? '已点赞' : '赞一个' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['isOpen'],
  mounted() {
    this.initIsLike()
    uni.getSystemInfo({
      success: (res) => {
        const pxToRpx = 750 / res.windowWidth
        this.height = 353 * pxToRpx
        console.log(this.height);
      }
    })
  },
  computed: {
    buttonStyle() {
      return `background: ${this.isLike ? '#F0F0F2' : '#FFE14D'}`
    },
    contentTop() {
      return `top: calc(50% - ${this.height / 2}rpx)`
    }
  },
  data() {
    return {
      isLike: false,
      height: 0
    }
  },
  methods: {
    initIsLike() {
      try {
        let liked = uni.getStorageSync('liked')
        if (liked) {
          this.isLike = liked
        }
      } catch (e) {
      }
    },
    onCopyText(value) {
      const url = {
        'uni-ui': 'https://ext.dcloud.net.cn/plugin?id=55',
        'uCharts': 'https://ext.dcloud.net.cn/plugin?id=271',
        'GitHub': 'https://github.com/Biao9527/Yaoyao'
      }
      uni.setClipboardData({
        data: url[value],
        showToast: false,
        success: () => {
          uni.showToast({
            title: `${value}的URL已复制`,
            icon: 'none'
          })
        }
      })
    },
    onLiked() {
      try {
        this.isLike = !this.isLike
        uni.setStorageSync('liked', this.isLike)
      } catch (e) {
      }
    },
    onClose() {
      this.$emit('update:isOpen', false)
    }
  }
}
</script>

<style lang="scss">
.about-popup {
  z-index: 5000;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);

  &-close {
    position: absolute;
    right: 0;
    top: 0;
    padding: 10rpx;
  }

  &-view {
    margin: 0 40rpx;
    position: absolute;
    background: #FFFFFF;
    border-radius: 18rpx;
  }

  &-title {
    font-size: 32rpx;
    color: #131C38;
    text-align: center;
    font-weight: bold;
    padding: 46rpx 0 40rpx 0;
  }

  &-tips {
    font-size: 28rpx;
    color: #f0ad4e;
    margin-bottom: 40rpx;
  }

  &-text {
    font-size: 26rpx;
    color: #454C63;
    line-height: 36rpx;
    margin-bottom: 18rpx;
  }

  &-content {
    margin: 0 24rpx;

    .und {
      text-decoration: underline;
    }
  }

  &-button {
    height: 74rpx;
    width: max-content;
    margin: 80rpx auto 62rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 52rpx;
    border-radius: 100rpx;
    font-size: 30rpx;
    color: #FFFFFF;
    text-align: center;
  }
}
</style>