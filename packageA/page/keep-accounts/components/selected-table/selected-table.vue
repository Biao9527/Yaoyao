<template>
  <view class="selected-table" @click="onMaskClick"
        v-if="isOpened">
    <view class="selected-table-content"
          :style="topHeight"
          @click.stop="">
      <view class="selected-table-title">我的标签</view>
      <scroll-view scroll-y :style="scrollHeight">
        <view class="selected-table-list">
          <view class="selected-table-list-item"
                :class="item.id === selectedTable.id ? 'selected' : ''"
                v-for="item in tableList" :key="item.id"
                @click="onTableItem(item)">
            <uni-icons custom-prefix="iconfont" :type="item.icon" size="50rpx"/>
            <view class="selected-table-list-item-text">{{ item.name }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  computed: {
    topHeight() {
      return `padding-top: calc(${this.navBarHeight}px + 26rpx)`
    },
    scrollHeight() {
      return `height: calc(100vh - ${this.navBarHeight + 80}px)`
    }
  },
  props: ['isOpened', 'selectedTable', 'tableList', 'navBarHeight'],
  data() {
    return {}
  },
  methods: {
    onMaskClick() {
      if (!this.isOpened) return
      this.$emit('update:isOpened', false)
    },
    onTableItem(item) {
      this.$emit('update:selectedTable', item)
      this.onMaskClick()
    }
  }
}
</script>

<style lang="scss">
.selected-table {
  width: 100%;
  height: 100%;
  z-index: 900;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);

  &-content {
    background: #FFFFFF;
    width: 70%;
    height: 100vh;
    position: absolute;
    right: 0;
    top: 0;
  }

  &-title {
    font-size: 32rpx;
    color: #181818;
    font-weight: bold;
    margin-left: 26rpx;
    margin-bottom: 16rpx;
  }

  &-list {
    padding: 0 10rpx 80rpx 26rpx;
    display: flex;
    flex-wrap: wrap;

    &-item {
      height: 62rpx;
      width: max-content;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1rpx solid #dcdcdc;
      border-radius: 100rpx;
      padding: 0 22rpx 0 6rpx;
      margin: 18rpx 18rpx 0 0;
      text-align: center;

      &-text {
        margin-left: 12rpx;
        font-size: 26rpx;
        color: #9b9b9b;
      }
    }

    .selected {
      border-color: #dcdcdc;
      background: #F0F0F2;

      .selected-table-list-item-text {
        color: #131C38;
      }
    }
  }
}
</style>