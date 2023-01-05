<template>
  <view class="selected-table" @click="onMaskClick"
        v-if="isOpened">
    <view class="selected-table-content"
          :style="topHeight"
          @click.stop="">
      <view v-if="Array.isArray(tableList) && tableList.length > 0">
        <view class="selected-table-header">
          <view class="selected-table-title">我的标签</view>
          <view class="selected-table-create" @click="goCreateTable">创建</view>
        </view>
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
      <view class="selected-table-nothing" v-else>
        <Nothing text="这里什么都没有~"/>
        <view class="selected-table-none-button"
              @click="goCreateTable">
          去创建
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Nothing from "../../../../../components/nothing/nothing";
import {navigateToPage} from "../../../../../helpers/navigateTo";

export default {
  components: {
    Nothing
  },
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
      if (this.selectedTable && item.id === this.selectedTable.id) return
      this.$emit('update:selectedTable', item)
      this.onMaskClick()
    },
    goCreateTable() {
      navigateToPage('createTable', this.selectedTable ? `?selectedId=${this.selectedTable.id}` : '')
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

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 26rpx 16rpx;
  }

  &-create {
    font-size: 24rpx;
    color: #FFFFFF;
    font-weight: bold;
    height: 44rpx;
    border-radius: 100rpx;
    padding: 0 28rpx;
    background: #4cd964;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-title {
    font-size: 32rpx;
    color: #181818;
    font-weight: bold;
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

  &-nothing {
    margin-top: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-none-button {
    font-size: 26rpx;
    color: #FFFFFF;
    font-weight: bold;
    border-radius: 100rpx;
    background: #4cd964;
    height: 60rpx;
    margin-top: 40rpx;
    padding: 0 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>