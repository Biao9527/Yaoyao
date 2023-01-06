<template>
  <view class="account-list">
    <view class="account-list-item"
          v-for="items in accountList" :key="items.id">
      <view class="account-list-item-header">
        <view class="account-list-item-table">
          <uni-icons custom-prefix="iconfont" :type="filterTable(items).icon" size="68rpx"/>
          <view class="table-name">{{ filterTable(items).name }}</view>
        </view>
        <view class="account-list-item-money">{{items.type}}￥{{ items.money }}</view>
      </view>
      <view class="account-list-item-notes">{{ items.notes }}</view>
      <view class="account-list-item-footer">
        <view class="account-list-item-bottom location"
              v-if="items.address">
          <uni-icons type="location" size="40rpx" color="#FFFFFF"/>
          <view class="bottom-text location-text">{{items.address.name}}</view>
        </view>
        <view v-else/>
        <view class="account-list-item-bottom">
          <uni-icons type="calendar" size="40rpx" color="#FFFFFF"/>
          <view class="bottom-text">
            <uni-dateformat :date="items.date" format="yyyy年M月d日 hh:mm"/>
          </view>
        </view>
      </view>
    </view>
    <view class="account-list-none">
      - 没有更多 -
    </view>
  </view>
</template>

<script>
export default {
  props: ['accountList', 'tableList'],
  computed: {
    filterTable() {
      return function (data) {
        return this.tableList.filter(item => item.id === data.tableId)[0]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.account-list {

  &-none {
    height: 140rpx;
    text-align: center;
    font-size: 26rpx;
    color: #bbbbbb;
  }

  &-item {
    margin: 20rpx 26rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    padding: 12rpx 24rpx 20rpx 24rpx;
    box-shadow: 0 0 10rpx 2rpx rgba(0, 0, 0, 0.03);

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-money {
      flex-grow: 1;
      font-size: 32rpx;
      color: #dd524d;
      font-weight: bold;
      text-align: right;
      white-space: nowrap;
    }

    &-table {
      margin-right: 26rpx;
      display: flex;
      align-items: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .table-name {
        margin-left: 20rpx;
        font-size: 30rpx;
        color: #131C38;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &-notes {
      background: #F6F6F6;
      margin: 26rpx 0;
      padding: 16rpx;
      font-size: 28rpx;
      color: #454C63;
      border-radius: 10rpx;
    }

    &-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-bottom {
      height: 52rpx;
      padding: 0 14rpx 0 12rpx;
      background: rgba(0, 0, 0, 0.16);
      border-radius: 9rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;

      .bottom-text {
        margin-left: 6rpx;
        font-size: 26rpx;
        color: #FFFFFF;
      }
    }

    .location-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .location {
      margin-right: 32rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>