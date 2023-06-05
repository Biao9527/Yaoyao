<template>
  <view class="selected-table"
        @click="onMaskClick"
        catchtouchmove="return"
        v-if="isOpened">
    <view class="selected-table-content"
          :style="topHeight"
          @click.stop="">
      <view v-if="firstLoad"
            class="selected-table-loading">
        <uni-load-more status="loading"
                       iconSize="40"
                       color="#bbbbbb"
                       :showText="false"/>
      </view>
      <view v-else>
        <view v-if="Array.isArray(tableList) && tableList.length > 0">
          <view class="selected-table-header">
            <view class="selected-table-title">我的标签</view>
            <view class="selected-table-create" @click="goCreateTable">创建</view>
          </view>
          <scroll-view scroll-y :style="scrollHeight"
                       @scrolltolower="tableScrollToLower">
            <view class="selected-table-list"
                  :style="footerHeight">
              <view class="selected-table-list-item"
                    :class="((multiSelect && selectedTable.findIndex(i => i._id === item._id) >= 0) ||
                  (selectedTable && item._id === selectedTable._id)) ? 'selected' : ''"
                    v-for="item in tableList" :key="item._id"
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
    <view class="selected-table-buttons"
          :class="setOperationHeight" v-if="multiSelect">
      <view class="selected-table-buttons-item cancel"
            @click="onMaskClick">取消
      </view>
      <view class="selected-table-buttons-item confirm"
            @click="onConfirmClick">确定
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
    },
    footerHeight() {
      return this.multiSelect ? `padding-bottom: ${this.operationHeight !== '96rpx' ? 98 + 45 : 98}rpx` : ''
    },
    setOperationHeight() {
      return this.operationHeight !== '96rpx' ? 'set-height' : ''
    }
  },
  props: [
    'isOpened',
    'multiSelect',
    'selectedTable',
    'lastSelectTable',
    'tableList',
    'navBarHeight',
    'operationHeight',
    'onConfirm',
    'scrollToLower',
    'firstLoad'
  ],
  data() {
    return {}
  },
  methods: {
    onMaskClick() {
      if (!this.isOpened) return
      if (this.multiSelect && Array.isArray(this.selectedTable)) {
        this.$emit('update:selectedTable', this.lastSelectTable)
      }
      this.$emit('update:isOpened', false)
    },
    onConfirmClick() {
      this.$emit('onConfirm')
      this.$emit('update:isOpened', false)
    },
    onTableItem(item) {
      if (this.multiSelect && Array.isArray(this.selectedTable)) {
        const filterId = this.selectedTable.findIndex(i => i._id === item._id)
        const idList = this.selectedTable
        if (filterId >= 0) {
          idList.splice(filterId, 1)
          this.$emit('update:selectedTable', idList)
        } else {
          idList.push(item)
          this.$emit('update:selectedTable', idList)
        }
        return;
      }
      if (this.selectedTable && item._id === this.selectedTable._id) return
      this.$emit('update:selectedTable', item)
      this.onMaskClick()
    },
    goCreateTable() {
      navigateToPage('createTable', this.selectedTable ? `?selectedId=${this.selectedTable._id}` : '')
    },
    tableScrollToLower() {
      this.$emit('scrollToLower')
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

  &-loading {
    margin-top: 50%;
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

  &-buttons {
    width: 70%;
    height: 98rpx;
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    background: linear-gradient(90deg, rgba(255, 255, 255, 1) 40%, rgba(76, 217, 100, 1) 40%);

    &-item {
      font-size: 30rpx;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cancel {
      width: 40%;
      color: #9b9b9b;
    }

    .confirm {
      width: 60%;
      background: #4cd964;
      color: #FFFFFF;
    }
  }

  .set-height {
    padding-bottom: 45rpx;
  }
}
</style>