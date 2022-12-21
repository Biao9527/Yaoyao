<template>
  <uni-nav-bar :border="false"
               :statusBar="true"
               :fixed="true"
               :leftText="leftText"
               :leftIcon="leftIcon"
               @clickLeft="onLeftClick"
               :backgroundColor="backgroundColor">
    <view class="nav-bar-title">{{title ? title : ''}}</view>
  </uni-nav-bar>
</template>

<script>
export default {
  props: ['title', 'leftText', 'leftIcon', 'backgroundColor', 'onBack'],
  methods: {
    onLeftClick() {
      const {onBack, leftIcon, leftText} = this.$props
      if (!leftIcon && !leftText) return;
      if (onBack) {
        onBack()
        return
      }
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style lang="scss">
.nav-bar-title {
  width: 100%;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>