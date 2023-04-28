<template>
  <view class="send-box-wrapper"
        :class="setOperationHeight">
    <view class="send-box"
          :class="setOperationHeight"
          :style="setKeyBoardHeight">
      <view class="send-box-content">
        <uni-icons type="trash" size="60rpx" color="#9b9b9b"/>
        <view class="send-box-input">
          <textarea auto-height
                    :adjust-position="false"
                    :show-confirm-bar="false"
                    @keyboardheightchange="setInputHeight"/>
        </view>
        <button class="send-box-ok">发送</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['operationHeight'],
  mounted() {
    uni.getSystemInfo({
      success: (res) => {
        this.pxToRpx = 750 / res.windowWidth
      }
    })
  },
  computed: {
    setOperationHeight() {
      return this.operationHeight !== '96rpx' ? 'set-height' : ''
    },
    setKeyBoardHeight() {
      return this.keyboardHeight > 0 && this.pxToRpx ? `bottom: ${this.keyboardHeight * this.pxToRpx}rpx;` : ''
    }
  },
  data() {
    return {
      keyboardHeight: 0,
      pxToRpx: null
    }
  },
  methods: {
    setInputHeight(e) {
      this.keyboardHeight = e.detail.height
    }
  }
}
</script>

<style lang="scss">
.send-box-wrapper {
}

.send-box {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #FFFFFF;

  &-content {
    padding: 28rpx 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-input {
    margin: 0 20rpx 0 8rpx;
    padding: 12rpx 40rpx;
    min-height: 58rpx;
    background: #f2f2f2;
    flex-grow: 1;
    border-radius: 12rpx;
    display: flex;
    align-items: center;

    textarea {
      max-height: 154rpx;
      width: 100%;
    }
  }

  &-ok {
    height: 78rpx;
    white-space: nowrap;
    background: #4cd964;
    color: #FFFFFF;
    font-size: 28rpx;
    padding: 0 26rpx;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button::after {
    border: none;
  }
}

.set-height {
  padding-bottom: 45rpx;
}
</style>