<template>
  <view>
    <NavBar left-icon="left"/>
    <view class="ranking">
      <view class="ranking-header">
        <view class="ranking-header-title">
          <view>{{ headerMonthText }}</view>
          <view class="ranking-header-table">
            <uni-icons custom-prefix="iconfont" :type="filterTable(filterTableId).icon" size="50rpx"/>
            <view class="ranking-header-table-text">{{ filterTable(filterTableId).name }}</view>
          </view>
          <view>共{{ headerTypeText }}</view>
        </view>
        <view class="ranking-header-money">
          ￥<text class="money-count">{{computedMoney}}</text>
        </view>
      </view>
      <view class="ranking-list">
        <view class="ranking-list-item" v-for="item in dataList">
          <view class="ranking-list-icon">
            <uni-icons custom-prefix="iconfont" :type="filterTable(item.tableId).icon" size="84rpx"/>
            <view class="ranking-list-icon-text">{{ filterTable(item.tableId).name }}</view>
          </view>
          <view class="ranking-list-money">￥{{item.money}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../../components/nav-bar";
import {month_text} from "../helper";
import {mapGetters} from 'vuex'
import {TYPE_HASH, TYPE_TEXT} from "../../search/helper";

export default {
  components: {
    NavBar
  },
  onLoad(options) {
    if (options.tableId) {
      this.filterTableId = JSON.parse(options.tableId)
    }
    if (options.year && options.month) {
      this.filterDate = [JSON.parse(options.year), JSON.parse(options.month)]
    }
    if (options.type) {
      this.selectType = JSON.parse(options.type)
    }
    this.filterAccountList()
  },
  computed: {
    ...mapGetters([
      'getAccountList',
      'getMyTableList'
    ]),
    headerMonthText() {
      return month_text[this.filterDate[1]]
    },
    headerTypeText() {
      return TYPE_TEXT[this.selectType]
    },
    filterTable() {
      return function (id) {
        return this.getMyTableList.filter(item => item.id === id)[0]
      }
    },
    computedMoney() {
      let money = 0
      this.dataList.map(items => {
        money += Number(items.money)
      })
      return Number(money.toFixed(2))
    },
  },
  data() {
    return {
      dataList: [],
      filterDate: [],
      filterTableId: null,
      selectType: null
    }
  },
  methods: {
    filterAccountList() {
      this.dataList = this.getAccountList
      //筛选类型
      if (this.selectType) {
        this.dataList = this.dataList.filter(item => item.type === TYPE_HASH[this.selectType])
      }
      //筛选日期
      this.dataList = this.dataList.filter(item => {
        const year = new Date(item.date).getFullYear()
        const month = new Date(item.date).getMonth()
        return year === this.filterDate[0] && month === this.filterDate[1]
      })
      //筛选标签
      if (this.filterTableId) {
        this.dataList = this.dataList.filter(item => item.tableId === this.filterTableId)
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../../../static/icons/iconfont.css";

.ranking {

  &-header {
    background: #FFFFFF;
    padding: 80rpx 0 60rpx 0;

    &-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: #9B9B9B;
    }

    &-table {
      height: 60rpx;
      width: max-content;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1rpx solid #dcdcdc;
      border-radius: 100rpx;
      padding: 0 22rpx 0 5rpx;
      margin: 0 8rpx;
      text-align: center;

      &-text {
        margin-left: 12rpx;
        font-size: 26rpx;
        color: #9b9b9b;
      }
    }

    &-money {
      margin-top: 20rpx;
      font-size: 36rpx;
      color: #dd524d;
      font-weight: bold;
      text-align: center;

      .money-count {
        font-size: 50rpx;
      }
    }
  }

  &-list {
    margin-top: 20rpx;

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

      &-text {
        margin-left: 20rpx;
        font-size: 30rpx;
        color: #454C63;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &-money {
      text-align: right;
      flex-grow: 1;
      margin-left: 20rpx;
      font-size: 32rpx;
      color: #dd524d;
      font-weight: bold;
    }
  }
}
</style>