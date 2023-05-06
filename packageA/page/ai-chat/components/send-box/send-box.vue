<template>
  <view class="send-box-wrapper"
        :style="setBoxHeight">
    <view class="send-box-mask"
          @click="maskClick"/>
    <view class="send-box"
          :class="setOperationHeight"
          :style="setKeyBoardHeight">
      <view class="send-box-content">
        <uni-icons type="trash" size="60rpx" color="#9b9b9b"/>
        <view class="send-box-input">
          <textarea :value="chatText"
                    auto-height
                    :adjust-position="false"
                    :show-confirm-bar="false"
                    :hold-keyboard="true"
                    :disable-default-padding="true"
                    :maxlength="100"
                    @input="onMessageInput"
                    @keyboardheightchange="setInputHeight"
                    @focus="onFocus"
                    @confirm="onSendClick"/>
        </view>
        <button class="send-box-ok"
                :disabled="disabled"
                @click="onSendClick">
          发送
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['operationHeight', 'disabled', 'onSend'],
  mounted() {
    uni.getSystemInfo({
      success: (res) => {
        this.pxToRpx = 750 / res.windowWidth
      }
    })
    this.loadBoxHeight()
  },
  computed: {
    setOperationHeight() {
      return this.operationHeight !== '96rpx' ? 'set-height' : ''
    },
    setKeyBoardHeight() {
      return this.keyboardHeight > 0 && this.pxToRpx ? `bottom: ${this.keyboardHeight * this.pxToRpx}rpx;` : ''
    },
    setBoxHeight() {
      return `height: ${(this.boxHeight + this.keyboardHeight) * this.pxToRpx}rpx`
    }
  },
  data() {
    return {
      keyboardHeight: 0,
      boxHeight: 0,
      pxToRpx: null,
      chatText: ''
    }
  },
  methods: {
    maskClick() {
      uni.hideKeyboard()
    },
    loadBoxHeight() {
      const query = uni.createSelectorQuery().in(this);
      query.select('.send-box').boundingClientRect(data => {
        this.boxHeight = data.height
      }).exec();
    },
    setInputHeight(e) {
      this.keyboardHeight = e.detail.height
    },
    onMessageInput(e) {
      this.loadBoxHeight()
      this.chatText = e.detail.value
    },
    onSendClick() {
      if (!this.chatText) return
      this.$emit('onSend', this.chatText)
      this.chatText = ''
    },
    onFocus() {
      this.$nextTick(() => {
        uni.pageScrollTo({
          scrollTop: 2000000,
          duration: 0
        })
      })
    }
  }
}
</script>

<style lang="scss">
.send-box-mask {
  z-index: 1;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.send-box {
  z-index: 2;
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