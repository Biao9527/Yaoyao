<template>
  <view class="post-tabs-view">
    <view class="post-tabs">
      <view class="post-tabs-list">
        <view class="post-tabs-item"
              :class="selectedIndex === item.id ? 'active' : ''"
              @click="onTabsItem(item.id)"
              v-for="item in tabList" :key="item.id">
          {{ item.name }}
        </view>
      </view>
      <view class="post-tabs-screen" @click="onSearch">
        <uni-icons type="bars" size="36rpx" color="#131C38"/>
        <view class="post-tabs-screen-text">筛选</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['selectedIndex', 'onTabsClick', 'onTabsSearch'],
  data() {
    return {
      tabList: [
        {id: 0, name: '全部'},
        {id: 1, name: '支出'},
        {id: 2, name: '收入'}
      ]
    }
  },
  methods: {
    onTabsItem(id) {
      this.$emit('onTabsClick', id)
    },
    onSearch() {
      this.$emit('onTabsSearch')
    }
  }
}
</script>

<style lang="scss" scoped>
.post-tabs-view {
  height: 84rpx;
}

.post-tabs {
  z-index: 800;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  width: 100vw;
  height: 84rpx;

  &-list {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: 26rpx;
  }

  &-item {
    font-size: 32rpx;
    color: #9B9B9B;
    margin-right: 52rpx;
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

  &-screen {
    height: 60rpx;
    padding: 0 28rpx;
    margin-right: 26rpx;
    background: rgba(240, 240, 242, 0.8);
    border-radius: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;

    &-text {
      font-size: 28rpx;
      color: #131C38;
      margin-left: 6rpx;
    }
  }
}
</style>