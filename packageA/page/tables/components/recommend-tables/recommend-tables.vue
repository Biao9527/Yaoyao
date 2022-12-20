<template>
  <view class="recommend-tables">
    <scroll-view scroll-x class="recommend-tables-scroll">
      <view class="recommend-tables-tabs">
        <view class="recommend-tables-tabs-item"
              :class="selectedIndex === items.id ? 'active' : ''"
              @click="onTabsItem(items)"
              v-for="items in recommendTables" :key="items.id">
          {{items.title}}
        </view>
      </view>
    </scroll-view>
    <view class="recommend-tables-list">
      <view class="recommend-tables-list-item" v-for="item in recommendTables[selectedIndex].tables">
        <uni-icons custom-prefix="iconfont" :type="item.icon" size="50rpx"/>
        <view class="recommend-tables-list-text">{{item.text}}</view>
      </view>
    </view>
  </view>
</template>

<script>
import {recommend_tables} from '../../helper/index'
export default {
  props: ['selectedIndex'],
  data() {
    return {
      recommendTables: recommend_tables,
    }
  },
  methods: {
    onTabsItem(items) {
      this.$emit('update:selectedIndex', items.id)
    }
  }
}
</script>

<style lang="scss">
@import "../../../../../static/icons/iconfont.css";
.recommend-tables {
  width: 100%;
  min-height: 40%;
  position: fixed;
  bottom: 0;
  left: 0;

  &-list {
    display: flex;
    flex-wrap: wrap;
    margin-left: 26rpx;

    &-text {
      font-size: 26rpx;
      color: #9B9B9B;
      margin-left: 12rpx;
    }

    &-item {
      width: max-content;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 22rpx 0 6rpx;
      height: 62rpx;
      border: 1px solid rgba(220, 220, 220, 0.3);
      border-radius: 32rpx;
      margin: 24rpx 24rpx 0 0;
      text-align: center;
    }
  }

  &-scroll {
    height: 80rpx;
    overflow: visible;
  }

  &-tabs {
    width: max-content;
    display: flex;
    padding-left: 26rpx;

    &-item {
      white-space: nowrap;
      margin-right: 44rpx;
      font-size: 32rpx;
      color: #9B9B9B;
      text-align: center;
    }

    .active {
      position: relative;
      font-weight: bold;
      color: #131C38;
    }

    .active::after {
      content: "";
      height: 4rpx;
      background: #007aff;
      width: 40rpx;
      position: absolute;
      bottom: -12rpx;
      left: calc(50% - 20rpx);
    }
  }
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>