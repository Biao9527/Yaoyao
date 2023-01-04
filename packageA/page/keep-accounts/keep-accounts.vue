<template>
  <view class="accounts">
    <NavBar title="记一笔" left-icon="left"/>
    <view class="accounts-content">
      <view class="accounts-type-tabs">
        <view class="accounts-type-items"
              :class="tallyType === '-' ? 'active' : ''"
              @click="tallyType = '-'">支出
        </view>
        <view class="accounts-type-items"
              :class="tallyType === '+' ? 'active' : ''"
              @click="tallyType = '+'">收入
        </view>
      </view>
      <view class="accounts-table"
            v-if="selectedTable">
        <view class="accounts-table-title">绑定标签</view>
        <view class="accounts-table-wrapper" @click="openedTable">
          <uni-icons custom-prefix="iconfont" :type="selectedTable.icon" size="80rpx"/>
          <view class="accounts-table-name">{{ selectedTable.name }}</view>
        </view>
      </view>
      <view class="accounts-money">
        <view>金额：</view>
        <view class="accounts-money-input-wrapper">
          <view>￥</view>
          <input class="accounts-money-input"
                 :value="money"
                 type="digit"
                 placeholder="请输入金额~"
                 placeholderStyle="color:#D6D6D6"
                 @input="onMoneyInput"/>
        </view>
      </view>
      <view class="accounts-notes">
        <view>备注</view>
        <view class="accounts-notes-textarea-wrapper">
          <textarea class="accounts-notes-textarea"
                    placeholder-class="accounts-notes-placeholder"
                    :value="notes"
                    type="textarea"
                    placeholder="请输入账单备注~"
                    :maxlength="100"
                    @input="onNotesInput"/>
        </view>
      </view>
    </view>
    <FooterActionBar :operation-height="operationHeight"
                     @onTableItemClick="openedTable"/>
    <SelectedTable :is-opened.sync="isOpenedTable"
                   :table-list.sync="getMyTableList"
                   :selected-table.sync="selectedTable"
                   :nav-bar-height="statusBarHeight + 44"/>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import FooterActionBar from "./components/footer-action-bar/footer-action-bar";
import SelectedTable from "./components/selected-table/selected-table";
import {mapState, mapGetters} from 'vuex'

export default {
  components: {
    NavBar,
    FooterActionBar,
    SelectedTable
  },
  onReady() {
    const {statusBarHeight} = uni.getSystemInfoSync()
    this.statusBarHeight = statusBarHeight ? statusBarHeight : 44
  },
  computed: {
    ...mapState([
      'operationHeight'
    ]),
    ...mapGetters([
      'getMyTableList'
    ])
  },
  data() {
    return {
      tallyType: '-',
      notes: '',
      money: null,
      selectedTable: null,
      isOpenedTable: false,
      statusBarHeight: 44
    }
  },
  methods: {
    onNotesInput(e) {
      this.notes = e.detail.value
    },
    onMoneyInput(e) {
      this.money = e.detail.value
    },
    openedTable() {
      this.isOpenedTable = true
    }
  }
}
</script>

<style lang="scss">
@import "../../../static/icons/iconfont.css";

page {
  background: #FFFFFF;
}

.accounts {

  &-content {
    margin: 32rpx 0 32rpx 26rpx;
  }

  &-table {
    margin-right: 26rpx;
    margin-bottom: 50rpx;

    &-title {
      font-size: 32rpx;
      color: #131C38;
      margin-bottom: 16rpx;
    }

    &-wrapper {
      padding: 0 20rpx;
      height: 110rpx;
      display: flex;
      align-items: center;
      border: 1px solid #e5e5e5;
      border-radius: 26rpx;
    }

    &-name {
      font-size: 32rpx;
      color: #454c63;
      margin-left: 32rpx;
    }
  }

  &-type-tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 80rpx;

    .active {
      background: #007aff;
      border: 1rpx solid #007aff;
      color: #FFFFFF;
    }
  }

  &-type-items {
    height: 58rpx;
    width: 112rpx;
    border: 1rpx solid #e8e8e8;
    font-size: 28rpx;
    color: #454c63;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100rpx;
    margin-right: 26rpx;
  }

  &-money {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 32rpx;
    color: #131c38;
    height: 76rpx;
    margin: 0 26rpx 26rpx 0;

    &-input-wrapper {
      display: flex;
      align-items: center;
      flex-grow: 1;
      height: 100%;
      border: 1px solid #e5e5e5;
      padding: 0 26rpx;
      margin-left: 32rpx;
      border-radius: 13rpx;
    }

    &-input {
      margin: 0 50rpx;
      width: 100%;
      text-align: right;
    }
  }

  &-notes {
    border-top: 1rpx solid #f2f2f2;
    padding: 26rpx 26rpx 0 0;
    font-size: 32rpx;
    color: #131C38;

    &-textarea-wrapper {
      margin-top: 16rpx;
      height: 220rpx;
      background: #F6F6F6;
      border-radius: 13rpx;
      padding: 26rpx;
    }

    &-textarea {
      width: 100%;
      height: 100%;
    }

    &-placeholder {
      color: #D6D6D6
    }
  }
}
</style>