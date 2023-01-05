<template>
  <view class="nothing">
    <image :src="noneSvg"/>
    <view class="nothing-text">{{ text }}</view>
  </view>
</template>

<script>
import noneSvg from '../../static/noneSvg.svg'

export default {
  props: ['text'],
  data() {
    return {
      noneSvg
    }
  }
}
</script>

<style scoped lang="scss">
.nothing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  image {
    width: 260rpx;
    height: 260rpx;
  }

  &-text {
    margin-top: 24rpx;
    font-size: 32rpx;
    color: #DCDCDC;
    font-weight: 400;
  }
}
</style>