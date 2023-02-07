<template>
  <view class="statistics-header">
    <view class="statistics-header-tabs">
      <view class="statistics-header-date">
        <uni-icons type="calendar" size="46rpx" color="#9B9B9B"/>
        <view class="date-text">2022年12月</view>
      </view>
      <view class="statistics-header-type">
        <view class="statistics-header-type-item left"
              :class="typeIndex === 1 ? 'active' : ''"
              @click="onType(1)">支出
        </view>
        <view class="statistics-header-type-item right"
              :class="typeIndex === 2 ? 'active' : ''"
              @click="onType(2)">收入
        </view>
      </view>
    </view>
    <view class="statistics-header-money">
      <view>总{{typeText}}：</view>
      <view class="money-text">
        ￥
        <text class="money-count">{{totalMoney}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import {TYPE_TEXT} from "../../search/helper";

export default {
  props: ['typeIndex', 'totalMoney', 'onTypeClick'],
  computed: {
    typeText() {
      return TYPE_TEXT[this.typeIndex]
    }
  },
  methods: {
    onType(type) {
      this.$emit('onTypeClick', type)
    }
  }
}
</script>

<style scoped lang="scss">
.statistics-header {
  background: #FFFFFF;

  &-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40rpx 26rpx;
  }

  &-type {
    display: flex;
    height: 60rpx;
    position: relative;

    ::after {
      content: '';
      position: absolute;
      top: calc(50% - 30rpx);
      left: calc(50% - 0.5px);
      height: 60rpx;
      width: 1px;
      background: #1890FF;
    }

    .active {
      color: #1890FF;
      border: 1rpx solid #1890FF;
      font-weight: bold;
    }

    .left {
      border-right: none;
      border-radius: 13rpx 0 0 13rpx;
    }

    .right {
      border-left: none;
      border-radius: 0 13rpx 13rpx 0;
    }

    &-item {
      display: flex;
      align-items: center;
      border: 1rpx solid gainsboro;
      font-size: 28rpx;
      color: #9B9B9B;
      padding: 0 26rpx;
    }
  }

  &-date {
    display: flex;
    align-items: center;
    border: 1rpx solid gainsboro;
    border-radius: 13rpx;
    height: 58rpx;
    padding: 0 20rpx;

    .date-text {
      margin-left: 8rpx;
      font-size: 28rpx;
      color: #9B9B9B;
    }
  }

  &-money {
    padding: 0 26rpx 40rpx;
    font-size: 30rpx;
    color: #9B9B9B;

    .money-text {
      margin: 10rpx 0 0 26rpx;
      font-size: 36rpx;
      color: #dd524d;
      font-weight: bold;
    }

    .money-count {
      font-size: 50rpx;
    }
  }
}
</style>