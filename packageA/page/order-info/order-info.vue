<template>
  <view>
    <NavBar left-icon="left"/>
    <view class="order">
      <view v-if="loading"
            class="order-loading">
        <uni-load-more status="loading"
                       iconSize="40"
                       color="#bbbbbb"
                       :showText="false"/>
      </view>
      <view class="order-content"  v-else>
        <view class="order-header">
          <uni-icons custom-prefix="iconfont" :type="orderInfo.table.icon" size="84rpx"/>
          <view class="order-table">{{ orderInfo.table.name }}</view>
          <view class="order-money">{{ orderInfo.type }}{{ orderInfo.money }}</view>
        </view>
        <view class="order-info">
          <view class="order-info-item">
            <view class="left-text">记录类型：</view>
            <view class="right-text"
                  v-if="orderInfo && orderInfo.type">
              {{ onTypeText(orderInfo.type) }}
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
            <view class="right-text">{{ orderInfo.address.name }}</view>
          </view>
          <view class="order-info-item">
            <viwe class="left-text">备注：</viwe>
            <view class="right-text">{{ orderInfo.notes }}</view>
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
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import {navigateToPage} from "../../../helpers/navigateTo";
import {getWxOpenId} from "../../../helpers";

export default {
  components: {
    NavBar
  },
  onLoad(options) {
    if (options.id) {
      this.orderId = options.id
    }
  },
  onShow() {
    if (this.orderId) {
      this.loadAccount(this.orderId)
    }
  },
  computed: {
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
      loading: false,
    }
  },
  methods: {
    loadAccount(id) {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      this.loading = true
      uniCloud.callFunction({
        name: 'account',
        data: {
          action: 'getItem',
          accountId: id,
          wx_openid: wx_openid
        },
        success: (res) => {
          if (res.result.status === 200) {
            this.orderInfo = res.result.account
            this.loading = false
          } else {
            this.loading = false
            this.showToast('账单获取失败，请稍后重试！')
          }
        },
        fail: () => {
          this.showToast('账单获取失败，请稍后重试！')
          this.loading = false
        }
      })
    },
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
            this.removeAccount()
          }
        }
      })
    },
    removeAccount() {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      uniCloud.callFunction({
        name: 'account',
        data: {
          action: 'delete',
          accountId: this.orderId,
          wx_openid: wx_openid
        },
        success: (res) => {
          if (res.result.status === 200) {
            uni.navigateBack()
          } else {
            this.showToast('删除失败！')
          }
        },
        fail: () => {
          this.showToast('删除失败！')
        }
      })
    },
    showToast(title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../../static/icons/iconfont.css";

.order {
  min-height: 600rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border-radius: 32rpx;
  margin: 16rpx 26rpx;

  &-content {
    width: 100%;
  }

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