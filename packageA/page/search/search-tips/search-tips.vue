<template>
  <view class="search-tips">
    <view class="search-tips-item">
      <view class="search-tips-title">排序方式：</view>
      <view class="search-tips-text" @click="onSortTypeClick">
        {{ computedSortText }}
      </view>
    </view>
    <view class="search-tips-item"
          v-if="dateList.length === 2">
      <view class="search-tips-title">时间范围：</view>
      <uni-datetime-picker :value="dateList"
                           type="datetimerange"
                           return-type="timestamp"
                           :border="false"
                           hide-second
                           :end="Date.now()"
                           @change="onDateChange">
        <view class="search-tips-date">
          <view class="search-tips-date-text">
            <uni-dateformat :date="dateList[0]" format="yyyy-M-d hh:mm"/>
            {{' - '}}
            <uni-dateformat :date="dateList[1]" format="yyyy-M-d hh:mm"/>
          </view>
          <view class="search-tips-date-clear"
                @click="onClearDateClick">
            <uni-icons type="clear" size="40rpx" color="#c0c4cc"/>
          </view>
        </view>
      </uni-datetime-picker>
    </view>
    <view class="search-tips-item"
          v-if="tableIds.length > 0">
      <view class="search-tips-title">选中标签：</view>
      <view class="search-tips-table"
            v-for="tag in tableIds" :key="tag">
        <uni-icons custom-prefix="iconfont" :type="filterTable(tag).icon" size="50rpx"/>
        <view class="search-tips-table-text">{{ filterTable(tag).name }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import {SORT_TEXT} from "../helper";
import {mapGetters} from 'vuex'

export default {
  props: ['sortValue', 'tableIds', 'dateList', 'onClearDate', 'onFilterDateClick', 'onSortType'],
  computed: {
    ...mapGetters([
      'getMyTableList'
    ]),
    computedSortText() {
      return SORT_TEXT[this.sortValue]
    },
    filterTable() {
      return function (data) {
        return this.getMyTableList.filter(item => item.id === data)[0]
      }
    }
  },
  methods: {
    onClearDateClick() {
      this.$emit('onClearDate')
    },
    onDateChange(e) {
      this.$emit('onFilterDateClick', e)
    },
    onSortTypeClick() {
      this.$emit('onSortType')
    }
  }
}
</script>

<style lang="scss">
.search-tips {
  background: #FFFFFF;
  border-top: 1PX solid #f2f2f2;
  padding-left: 26rpx;

  &-item {
    display: flex;
    align-items: center;
    min-height: 80rpx;
  }

  &-title {
    white-space: nowrap;
    font-size: 30rpx;
    color: #131c38;
    font-weight: bold;
  }

  &-text {
    font-size: 28rpx;
    color: #7f7f7f;
  }

  &-table {
    height: 62rpx;
    width: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1rpx solid #dcdcdc;
    border-radius: 100rpx;
    padding: 0 22rpx 0 6rpx;
    text-align: center;

    &-text {
      white-space: nowrap;
      margin-left: 12rpx;
      font-size: 26rpx;
      color: #9b9b9b;
    }
  }

  &-date {
    display: flex;
    align-items: center;
    height: 60rpx;
    width: max-content;
    border: 1px solid #e5e5e5;
    margin-right: 26rpx;
    border-radius: 13rpx;
    padding-left: 16rpx;

    &-text {
      font-size: 28rpx;
      color: #7f7f7f;
    }

    &-clear {
      padding: 16rpx;
    }
  }
}
</style>