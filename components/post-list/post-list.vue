<template>
  <view class="post-list">
    <view class="post-list-item"
          v-for="(item, index) in list"
          :key="item.id"
          @click="onItemClick(item)">
      <view class="post-list-icon">
        <view class="post-list-index" v-if="showIndex">{{ index + 1 }}</view>
        <uni-icons @click.stop="onTableClick(item.tableId)"
                   custom-prefix="iconfont"
                   :type="filterTable(item.tableId).icon"
                   size="84rpx"/>
        <view class="post-list-icon-wrapper">
          <view class="post-list-icon-text"
                @click.stop="onTableClick(item.tableId)">
            {{ filterTable(item.tableId).name }}
          </view>
          <view class="post-list-icon-notes">{{ item.notes }}</view>
        </view>
      </view>
      <view class="post-list-money">
        <view class="post-list-money-text">{{item.type}}{{ item.money }}</view>
        <view class="post-list-money-date">
          <uni-dateformat :date="item.date" format="yyyy.M.d hh:mm"/>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {navigateToPage} from "../../helpers/navigateTo";

export default {
  props: ['list', 'tableList', 'showIndex', 'onTable'],
  computed: {
    filterTable() {
      return function (id) {
        return this.tableList.filter(item => item.id === id)[0]
      }
    },
  },
  methods: {
    onItemClick(item) {
      navigateToPage('orderInfo', `?id=${item.id}`)
    },
    onTableClick(id) {
      this.$emit('onTable', id)
    }
  }
}
</script>

<style scoped lang="scss">
.post-list {

  &-index {
    margin-right: 8rpx;
    text-align: center;
    width: 60rpx;
    font-size: 30rpx;
    font-weight: bold;
    color: #9b9b9b;
  }

  &-item {
    padding: 0 26rpx;
    background: #FFFFFF;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    overflow: hidden;
    border-bottom: 1rpx solid #f2f2f2;
  }

  &-icon {
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    overflow: hidden;

    &-wrapper {
      flex-wrap: nowrap;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 20rpx;
    }

    &-text {
      font-size: 30rpx;
      color: #131C38;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-notes {
      margin-top: 4rpx;
      font-size: 26rpx;
      color: #9b9b9b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &-money {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: right;
    flex-grow: 1;
    margin-left: 40rpx;

    &-text {
      font-size: 32rpx;
      color: #dd524d;
      font-weight: bold;
    }

    &-date {
      margin-top: 4rpx;
      font-size: 26rpx;
      color: #9b9b9b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>