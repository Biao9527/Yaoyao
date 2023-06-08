<template>
  <view class="date-popup-mask"
        catchtouchmove="return"
        @click="onClose"
        v-if="isOpened">
    <view class="date-popup">
      <view class="date-popup-close" @click="onClose">
        <uni-icons type="closeempty" size="46rpx" color="#9B9B9B"/>
      </view>
      <view class="date-popup-header">
        <view class="date-popup-title">请选择月份</view>
      </view>
      <view class="date-popup-content">
        <scroll-view class="date-popup-scroll" scroll-y>
          <view v-if="loading"
                class="date-popup-loading">
            <uni-load-more status="loading"
                           iconSize="40"
                           color="#bbbbbb"
                           :showText="false"/>
          </view>
          <view v-else
                class="date-popup-list"
                :class="setOperationHeight">
            <view class="date-popup-list-item"
                  v-for="items in dateList" :key="items">
              <view class="year-text">{{items.year + '年'}}</view>
              <view class="date-popup-month">
                <view class="date-popup-month-item"
                      :class="selectMonth[0] === items.year && selectMonth[1] === item ? 'active' : ''"
                      v-for="item in items.monthList" :key="item"
                      @click.stop="onMonthClick(items.year, item)">
                  {{computedMonthText(item)}}
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import {month_text} from "../helper";
import {getWxOpenId} from "../../../../helpers";

export default {
  props: ['isOpened', 'operationHeight', 'selectMonth', 'onSelectDate'],
  beforeMount() {
    this.loadDateList()
  },
  computed: {
    computedMonthText() {
      return (month) => month_text[month]
    },
    setOperationHeight() {
      return this.operationHeight !== '96rpx' ? 'set-height' : ''
    }
  },
  data() {
    return {
      dateList: [],
      loading: false
    }
  },
  methods: {
    loadDateList() {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      this.loading = true
      uniCloud.callFunction({
        name: 'account',
        data: {
          action: 'statistics_date',
          wx_openid: wx_openid
        },
        success: (res) => {
          this.dateList = res.result.dateList
          this.loading = false
        },
        fail: () => {
          uni.showToast({title: '获取数据失败！', icon: 'none'})
          this.loading = false
        }
      })
    },
    onClose() {
      this.$emit('update:isOpened', false)
    },
    onMonthClick(year, month) {
      if (year === this.selectMonth[0] && month === this.selectMonth[1]) return
      this.$emit('onSelectDate', [year, month])
      this.onClose()
    }
  }
}
</script>

<style scoped lang="scss">
.date-popup-mask {
  z-index: 910;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.date-popup {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #F6F6F6;
  border-radius: 18rpx 18rpx 0 0;

  &-loading {
    height: 600rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 20rpx;
  }

  &-header {
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1PX solid #E5E5E5;
  }

  &-title {
    text-align: center;
    font-size: 32rpx;
    color: #131c38;
    font-weight: bold;
  }

  &-content {
    margin: 0 26rpx;
  }

  &-scroll {
    height: 600rpx;
  }

  &-list {
    height: max-content;
    padding-bottom: 40rpx;

    &-item {
    margin-top: 40rpx;

      .year-text {
        margin-bottom: 26rpx;
        font-size: 30rpx;
        color: #454C63;
        text-align: center;
      }
    }
  }

  .set-height {
    padding-bottom: 80rpx;
  }

  &-month {
    display: flex;
    flex-wrap: wrap;
    margin-right: -16rpx;

    &-item {
      background: #FFFFFF;
      width: 162.5rpx;
      height: 90rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #454C63;
      margin-right: 16rpx;
      margin-bottom: 16rpx;
    }

    .active {
      background: #4cd964;
      color: #FFFFFF;
    }
  }
}
</style>