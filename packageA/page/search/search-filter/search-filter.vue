<template>
  <view>
    <view class="search-filter-mask"
          v-if="isOpened"
          catchtouchmove="return"
          @click="onMaskClose"/>
    <view class="search-filter" v-if="isOpened">
      <view class="search-filter-tabs">
        <view class="search-filter-tabs-item"
              :class="selectedIndex === items.id ? 'active' : ''"
              @click="onTabsItem(items)"
              v-for="items in filterList" :key="items.id">
          <uni-datetime-picker v-if="items.id === 3"
                               type="datetimerange"
                               return-type="timestamp"
                               hide-second
                               :end="Date.now()"
                               @change="onDateChange">
            {{ items.title }}
          </uni-datetime-picker>
          <view v-else>
            {{ items.title }}
          </view>
        </view>
      </view>
      <view class="search-filter-title"
            v-if="filterList[selectedIndex].name">
        {{ filterList[selectedIndex].name }}
      </view>
      <scroll-view scroll-x>
        <view class="search-filter-list"
              v-if="filterList[selectedIndex].list">
          <view class="search-filter-list-item"
                :class="(filterType === item.value || sortValue === item.value) ? 'active' : ''"
                v-for="(item, index) in filterList[selectedIndex].list"
                v-if="['money_up', 'money_down'].indexOf(item.value) < 0 || listType !== 'list'"
                :key="index" @click="onFilterItemClick(item)">
            {{ item.text }}
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import {FILTER_LIST} from "../helper";

export default {
  props: ['isOpened', 'listType', 'selectedIndex', 'filterType', 'sortValue', 'onFilterItem', 'onFilterTabClick', 'onFilterDateClick'],
  data() {
    return {
      filterList: FILTER_LIST
    }
  },
  methods: {
    onMaskClose() {
      if (this.isOpened) {
        this.$emit('update:isOpened', false)
      }
    },
    onDateChange(e) {
      this.$emit('onFilterDateClick', e)
      this.onMaskClose()
    },
    onTabsItem(item) {
      if (item.id === 3) return
      this.$emit('onFilterTabClick', item.id)
    },
    onFilterItemClick(item) {
      this.$emit('onFilterItem', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-filter-mask {
  z-index: 300;
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.search-filter {
  padding: 12rpx 0;
  position: fixed;
  width: 100%;
  background: #FFFFFF;
  border-top: 1PX solid #f2f2f2;
  z-index: 800;

  &-tabs {
    height: 68rpx;
    width: 100%;
    display: flex;

    &-item {
      width: 25%;
      height: 100%;
      white-space: nowrap;
      margin-right: 44rpx;
      font-size: 28rpx;
      color: #9B9B9B;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .active {
      position: relative;
      font-weight: bold;
      color: #007aff;
    }
  }

  &-title {
    font-size: 32rpx;
    color: #131c38;
    font-weight: bold;
    margin: 26rpx;
  }

  &-list {
    width: max-content;
    display: flex;
    padding: 0 26rpx 40rpx;

    &-item {
      white-space: nowrap;
      color: #7f7f7f;
      font-size: 28rpx;
      border: 1PX solid #f2f2f2;
      height: 64rpx;
      padding: 0 28rpx;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      text-align: center;
      border-radius: 100rpx;
      margin-right: 42rpx;
    }

    .active {
      color: #007aff;
      border: 1PX solid #007aff;
    }
  }
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>