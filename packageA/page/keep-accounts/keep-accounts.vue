<template>
  <view class="accounts">
    <NavBar title="记一笔" left-icon="left"/>
    <view class="accounts-content">
      <view class="accounts-type-tabs">
        <view class="accounts-type-items"
              :class="tallyType === '-' ? 'active' : ''"
              @click="tallyType = '-'">支出</view>
        <view class="accounts-type-items"
              :class="tallyType === '+' ? 'active' : ''"
              @click="tallyType = '+'">收入</view>
      </view>
      <view class="accounts-table">
        <uni-icons custom-prefix="iconfont" :type="table.icon" size="88rpx"/>
        <view>{{ table.name }}</view>
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
                    placeholder-class	="accounts-notes-placeholder"
                    :value="notes"
                    type="textarea"
                    placeholder="请输入账单备注~"
                    :maxlength="100"
                    @input="onNotesInput"/>
        </view>
      </view>
    </view>
    <FooterActionBar :operation-height="operationHeight"/>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import FooterActionBar from "./components/footer-action-bar/footer-action-bar";
import {mapState} from 'vuex'

export default {
  components: {
    NavBar,
    FooterActionBar
  },
  computed: {
    ...mapState([
      'operationHeight'
    ]),
  },
  data() {
    return {
      tallyType: '-',
      notes: '',
      table: null,
      money: null,
    }
  },
  methods: {
    onNotesInput(e) {
      this.notes = e.detail.value
    },
    onMoneyInput(e) {
      this.money = e.detail.value
    }
  }
}
</script>

<style lang="scss">
page {
  background: #FFFFFF;
}
.accounts {

  &-content {
    margin: 32rpx 0 32rpx 26rpx;
  }

  &-type-tabs {
    display: flex;
    justify-content: center;

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
    font-size: 30rpx;
    color: #131c38;
    height: 76rpx;
    margin: 80rpx 26rpx 26rpx 0;

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
    font-size: 30rpx;
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
      color:#D6D6D6
    }
  }
}
</style>