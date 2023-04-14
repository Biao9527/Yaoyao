<template>
  <view>
    <NavBar left-icon="left"/>
    <view class="order">
      <view class="order-header">
        <uni-icons custom-prefix="iconfont" :type="tableInfo.icon" size="84rpx"/>
        <view class="order-table">{{tableInfo.name}}</view>
        <view class="order-money">{{orderInfo.type}}{{orderInfo.money}}</view>
      </view>
      <view class="order-info">
        <view class="order-info-item">
          <view class="left-text">记录类型：</view>
          <view class="right-text"
                v-if="orderInfo && orderInfo.type">
            {{onTypeText(orderInfo.type)}}
          </view>
        </view>
        <view class="order-info-item">
          <view class="left-text">记录时间：</view>
          <view class="right-text">
            <uni-dateformat :date="orderInfo.date" format="yyyy年M月d日 hh:mm"/>
          </view>
        </view>
        <view class="order-info-item"
              v-if="orderInfo && orderInfo.address">
          <view class="left-text">记录地点：</view>
          <view class="right-text">{{orderInfo.address.name}}</view>
        </view>
        <view class="order-info-item">
          <viwe class="left-text">备注：</viwe>
          <view class="right-text">{{orderInfo.notes}}</view>
        </view>
      </view>
      <view class="order-footer">
        <view class="order-footer-item"
              @click="onDelete">
          <uni-icons type="trash" size="40rpx" color="#dd524d"/>
          <view class="footer-text delete">删除</view>
        </view>
        <view class="order-footer-item" @click="onEdit">
          <uni-icons type="compose" size="40rpx" color="#9b9b9b"/>
          <view class="footer-text">编辑</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import {mapGetters, mapMutations} from 'vuex'
import {removeAccountsStorage} from "../keep-accounts/helpers/accountsStorage";
import {navigateToPage} from "../../../helpers/navigateTo";

export default {
  components: {
    NavBar
  },
  onLoad(options) {
    if (options.id) {
      this.orderId = parseInt(options.id)
    }
  },
  onShow() {
    if (this.orderId) {
      this.orderInfo = this.getAccountItem(this.orderId)
      this.tableInfo = this.getTableItem(this.orderInfo.tableId)
    }
  },
  computed: {
    ...mapGetters([
      'getAccountItem',
      'getTableItem'
    ]),
    onTypeText() {
      const typeHash = {
        '-': '支出',
        '+': '收入'
      }
      return (type) => type ? typeHash[type] : ''
    }
  },
  data() {
    return {
      orderId: null,
      orderInfo: null,
      tableInfo: null
    }
  },
  methods: {
    ...mapMutations(['removeAccount']),
    onEdit() {
      navigateToPage('keepAccounts', `?edit=true&id=${this.orderId}`)
    },
    onDelete() {
      uni.showModal({
        title: '删除后无法恢复，是否删除？',
        confirmText: '继续删除',
        confirmColor: '#dd524d',
        success: res => {
          if (res.confirm) {
            const success = removeAccountsStorage([this.orderInfo])
            if (!success) {
              this.showToast('删除失败')
              return
            }
            this.removeAccount([this.orderInfo])
            uni.navigateBack()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../../static/icons/iconfont.css";

.order {
  background: #FFFFFF;
  border-radius: 32rpx;
  margin: 16rpx 26rpx;

  &-header {
    padding: 72rpx 0 28rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-table {
    margin: 10rpx 0 32rpx;
    font-size: 30rpx;
    color: #9B9B9B;
  }

  &-money {
    font-family: ArialRoundedMTBold;
    font-size: 72rpx;
    color: #131C38;
    font-weight: bold;
  }

  &-info {
    margin-left: 26rpx;
    padding: 28rpx 26rpx 52rpx 0;
    font-size: 30rpx;
    color: #9B9B9B;

    &-item {
      display: flex;
      white-space: nowrap;
      margin-top: 12rpx;

      .left-text {
        min-width: 180rpx;
      }

      .right-text {
        white-space: pre-wrap;
        color: #131C38;
      }
    }
  }

  &-footer {
    margin: 0 26rpx;
    display: flex;
    border-top: 1px solid #D8D8D8;
    position: relative;

    ::after {
      content: '';
      position: absolute;
      left: calc(50% - 0.5rpx);
      top: calc(50% - 24rpx);
      width: 1rpx;
      height: 48rpx;
      background: #D8D8D8;
    }

    &-item {
      width: 50%;
      height: 98rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .footer-text {
        margin-left: 4rpx;
        font-size: 30rpx;
        color: #131C38;
      }

      .delete {
        color: #dd524d;
      }
    }
  }
}
</style>