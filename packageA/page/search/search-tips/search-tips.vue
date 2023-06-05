<template>
  <view class="search-tips">
    <view class="search-tips-reset">
      <view class="search-tips-reset-btn" @click="onResetClick">
        <uni-icons type="loop" size="32rpx" color="#FFFFFF"/>
        <view class="search-tips-reset-text">重置</view>
      </view>
    </view>
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
            {{ ' - ' }}
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
          v-if="tableList.length > 0">
      <view class="search-tips-title title-fixed">选中标签：</view>
      <scroll-view scroll-x class="search-tips-table-scroll">
        <view class="search-tips-table-list"
              @click="onTableListClick">
          <!--此处用于占位-->
          <view class="search-tips-title hidden">选中标签：</view>
          <!--此处用于占位-->
          <view class="search-tips-table"
                v-for="tag in tableList" :key="tag._id">
            <uni-icons custom-prefix="iconfont" :type="tag.icon" size="50rpx"/>
            <view class="search-tips-table-text">{{ tag.name }}</view>
            <view class="search-tips-table-delete" @click.stop="removeTable(tag)">
              <uni-icons type="clear" size="44rpx" color="#c0c4cc"/>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import {SORT_TEXT} from "../helper";

export default {
  props: ['sortValue', 'tableList', 'dateList', 'onClearDate', 'onFilterDateClick', 'onSortType', 'removeFilterTable', 'openTableList', 'onReset'],
  computed: {
    computedSortText() {
      return SORT_TEXT[this.sortValue]
    }
  },
  methods: {
    onResetClick() {
      this.$emit('onReset')
    },
    onClearDateClick() {
      this.$emit('onClearDate')
    },
    onDateChange(e) {
      this.$emit('onFilterDateClick', e)
    },
    onSortTypeClick() {
      this.$emit('onSortType')
    },
    removeTable(tag) {
      this.$emit('removeFilterTable', tag._id)
    },
    onTableListClick() {
      this.$emit('openTableList')
    }
  }
}
</script>

<style lang="scss">
.search-tips {
  position: relative;
  background: #FFFFFF;
  border-top: 1PX solid #f2f2f2;
  padding-left: 26rpx;

  &-reset {
    z-index: 10;
    position: absolute;
    top: 0;
    right: 32rpx;
    height: 80rpx;
    display: flex;
    align-items: center;

    &-btn {
      height: 48rpx;
      display: flex;
      align-items: center;
      background: #4cd964;
      border-radius: 100rpx;
      padding: 0 16rpx 0 8rpx;
    }

    &-text {
      margin-left: 6rpx;
      color: #FFFFFF;
      font-size: 26rpx;
    }
  }

  &-item {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 80rpx;
  }

  &-title {
    white-space: nowrap;
    font-size: 30rpx;
    color: #131c38;
  }

  .hidden {
    opacity: 0;
  }

  .title-fixed {
    background: #FFFFFF;
    z-index: 10;
    display: flex;
    align-items: center;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  &-text {
    font-size: 28rpx;
    color: #7f7f7f;
  }

  &-table-scroll {
    position: absolute;
    left: 0;
    height: 100%;
  }

  &-table-list {
    height: 100%;
    width: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 26rpx;
  }

  &-table {
    height: 60rpx;
    width: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1rpx solid #dcdcdc;
    border-radius: 100rpx;
    padding: 0 16rpx 0 6rpx;
    text-align: center;
    margin-right: 16rpx;

    &-text {
      white-space: nowrap;
      margin-left: 12rpx;
      font-size: 26rpx;
      color: #9b9b9b;
    }

    &-delete {
      margin-left: 6rpx;
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

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>