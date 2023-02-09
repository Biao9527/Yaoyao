<template>
  <view class="bar-charts">
    <view class="bar-charts-item"
          @click="goRankingPage(item)"
          v-for="item in charList" :key="item.id">
      <view class="bar-charts-left">
        <uni-icons custom-prefix="iconfont" :type="item.icon" size="50rpx"/>
        <view class="left-text">{{ item.name }}</view>
      </view>
      <view class="bar-charts-right">
        <view class="bar-charts-progress">
          <view class="progress-bar"
                :style="{width: `${item.width}%`}"/>
        </view>
        <view class="bar-charts-right-text">
          <view class="money-text">￥{{ Number(item.money) }}</view>
          <uni-icons type="forward" size="32rpx" color="#9B9B9B"/>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['charList', 'onBarItem'],
  methods: {
    goRankingPage(item) {
      this.$emit('onBarItem', item)
    }
  }
}
</script>

<style lang="scss">
.bar-charts {
  margin: 40rpx 26rpx;

  &-item {
    margin: 20rpx 0;
    height: 60rpx;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  &-left {
    width: 27%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    margin-right: 16rpx;
    overflow: hidden;

    .left-text {
      margin-left: 16rpx;
      white-space: nowrap;
      font-size: 30rpx;
      color: #9B9B9B;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &-right {
    width: 73%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    overflow: hidden;

    &-text {
      width: 37%;
      margin-left: 20rpx;
      display: flex;
      justify-content: flex-end;
      flex-wrap: nowrap;
      overflow: hidden;
      flex-grow: 1;

      .money-text {
        font-size: 30rpx;
        color: #9B9B9B;
        overflow: hidden;
        text-overflow: clip;
      }
    }
  }

  &-progress {
    width: 63%;
    height: 16rpx;

    .progress-bar {
      height: 100%;
      border-radius: 100rpx;
      background: #4cd964;
    }
  }
}
</style>