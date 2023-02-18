<template>
  <view>
    <NavBar left-icon="left"/>
    <view class="ranking">
      <view class="ranking-header">
        <view class="ranking-header-title">
          <view>{{ headerMonthText }}</view>
          <view class="ranking-header-table"
                v-if="filterTableId">
            <uni-icons custom-prefix="iconfont" :type="filterTable(filterTableId).icon" size="50rpx"/>
            <view class="ranking-header-table-text">{{ filterTable(filterTableId).name }}</view>
          </view>
          <view>共{{ headerTypeText }}</view>
        </view>
        <view class="ranking-header-money">
          ￥
          <text class="money-count">{{ computedMoney }}</text>
        </view>
      </view>
      <view v-if="Array.isArray(dataList) && dataList.length > 0"
            class="ranking-list">
        <view class="ranking-tabs">
          <view class="ranking-tabs-item"
                :class="sortText === 'money_down' || sortText === 'money_up' ? 'active' : ''"
                @click="onMoneyFilter">
            {{ moneySortText }}
          </view>
          <view class="ranking-tabs-item"
                :class="sortText === 'time_up' || sortText === 'time_down' ? 'active' : ''"
                @click="onTimeFilter">
            {{ timeSortText }}
          </view>
        </view>
        <PostList :list="dataList"
                  :table-list="getMyTableList"/>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../../components/nav-bar";
import {month_text} from "../helper";
import {mapGetters} from 'vuex'
import {MONEY_SORT_TEXT, TIME_SORT_TEXT, TYPE_HASH, TYPE_TEXT} from "../../search/helper";
import PostList from "../../../../components/post-list/post-list";

export default {
  components: {
    NavBar,
    PostList
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
    moneySortText() {
      return this.sortText === 'money_up' || this.sortText === 'money_down' ? MONEY_SORT_TEXT[this.sortText] : '金额'
    },
    timeSortText() {
      return this.sortText === 'time_up' || this.sortText === 'time_down' ? TIME_SORT_TEXT[this.sortText] : '时间'
    },
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
      selectType: null,
      sortText: 'money_down'
    }
  },
  methods: {
    onMoneyFilter() {
      if (this.sortText !== 'money_down' && this.sortText !== 'money_up') {
        this.sortText = 'money_down'
      } else {
        this.sortText = this.sortText === 'money_down' ? 'money_up' : 'money_down'
      }
      this.filterAccountList()
    },
    onTimeFilter() {
      if (this.sortText !== 'time_up' && this.sortText !== 'time_down') {
        this.sortText = 'time_down'
      } else {
        this.sortText = this.sortText === 'time_down' ? 'time_up' : 'time_down'
      }
      this.filterAccountList()
    },
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
      //筛选排序方式
      switch (this.sortText) {
        case "time_up":
          this.dataList = this.dataList.sort((a, b) => {
            return a.date > b.date ? 1 : -1
          })
          break
        case "time_down":
          break
        case "money_up":
          this.dataList = this.dataList.sort((a, b) => {
            return Number(a.money) > Number(b.money) ? 1 : -1
          })
          break
        case "money_down":
          this.dataList = this.dataList.sort((a, b) => {
            return Number(a.money) < Number(b.money) ? 1 : -1
          })
          break
        default:
          break
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
    background: #FFFFFF;
  }

  &-tabs {
    padding: 20rpx 26rpx;
    display: flex;
    align-items: center;

    &-item {
      margin-right: 26rpx;
      background: #F6F6F6;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 70rpx;
      border-radius: 12rpx;
      padding: 0 30rpx;
      color: #9b9b9b;
      font-size: 30rpx;
    }

    .active {
      background: rgba(24, 144, 255, 0.1);
      color: #1890FF;
    }
  }
}
</style>