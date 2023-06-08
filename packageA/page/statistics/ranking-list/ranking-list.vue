<template>
  <view>
    <NavBar left-icon="left"/>
    <view class="ranking">
      <view class="ranking-header">
        <view class="ranking-header-title">
          <view>{{ headerMonthText }}</view>
          <view class="ranking-header-table"
                v-if="filterTableId && tableItem">
            <uni-icons custom-prefix="iconfont" :type="tableItem.icon" size="50rpx"/>
            <view class="ranking-header-table-text">{{ tableItem.name }}</view>
          </view>
          <view>共{{ headerTypeText }}</view>
        </view>
        <view class="ranking-header-money">
          ￥
          <text class="money-count">{{ moneyCounts }}</text>
        </view>
      </view>
      <view v-if="firstLoad"
            class="ranking-loading">
        <uni-load-more status="loading"
                       iconSize="40"
                       color="#bbbbbb"
                       :showText="false"/>
      </view>
      <view v-else>
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
          <PostList :list="dataList"/>
          <LoadMore :first-load="firstLoad"
                    :has-more="hasMore"
                    :loading="loading"/>
        </view>
        <view class="ranking-nothing" v-else>
          <Nothing text="暂无数据"/>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../../components/nav-bar";
import {month_text} from "../helper";
import {MONEY_SORT_TEXT, SORT_TYPE_OBJ, TIME_SORT_TEXT, TYPE_HASH, TYPE_TEXT} from "../../search/helper";
import PostList from "../../../../components/post-list/post-list";
import Nothing from "../../../../components/nothing/nothing";
import LoadMore from "../../../../components/load-more/load-more";
import {getWxOpenId} from "../../../../helpers";

export default {
  components: {
    NavBar,
    PostList,
    Nothing,
    LoadMore
  },
  onLoad(options) {
    if (options.tableId) {
      this.filterTableId = options.tableId
    }
    if (options.year && options.month) {
      this.filterDate = [JSON.parse(options.year), JSON.parse(options.month)]
    }
    if (options.type) {
      this.selectType = JSON.parse(options.type)
    }
  },
  onShow() {
    this.loadPostList()
    this.loadMoneyCounts()
    if (this.filterTableId) {
      this.loadTableItem(this.filterTableId)
    }
  },
  onReachBottom() {
    if (!this.loading && this.hasMore) {
      this.loadPostList(false)
    }
  },
  computed: {
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
  },
  data() {
    return {
      dataList: [],
      filterDate: [],
      filterTableId: null,
      tableItem: null,
      selectType: null,
      moneyCounts: 0,
      sortText: 'money_down',
      size: 15,
      page: 1,
      loading: false,
      hasMore: true,
      firstLoad: true
    }
  },
  methods: {
    loadTableItem(id) {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      uniCloud.callFunction({
        name: 'tables',
        data: {
          action: 'findItem',
          tableId: id,
          wx_openid: wx_openid
        },
        success: (res) => {
          if (res.result.status === 200) {
            this.tableItem = res.result.table
          } else {
            this.showToast('标签查找失败!')
          }
        },
        fail: () => {
          this.showToast('标签查找失败!')
        }
      })
    },
    loadPostList(reLoad = true) {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      if (this.loading) {
        return;
      }
      this.loading = true
      if (reLoad) {
        this.page = 1
        this.firstLoad = true
        this.hasMore = true
      }
      uniCloud.callFunction({
        name: 'account',
        data: {
          action: 'get',
          type: TYPE_HASH[this.selectType],
          tables: this.filterTableId ? [this.filterTableId] : null,
          monthList: this.filterDate,
          sortKey: SORT_TYPE_OBJ[this.sortText].key,
          sortValue: SORT_TYPE_OBJ[this.sortText].value,
          getSize: this.size,
          getPage: this.page,
          wx_openid: wx_openid
        },
        success: (res) => {
          if (res.result.status === 200) {
            if (res.result.dataList.length < this.size) {
              this.hasMore = false
            }
            this.page += 1
            if (reLoad) {
              this.dataList = res.result.dataList
            } else {
              this.dataList = this.dataList.concat(res.result.dataList)
            }
            this.loadListSuccess()
          } else {
            this.loadListSuccess()
            this.showToast('获取列表失败')
          }
        },
        fail: () => {
          this.loadListSuccess()
          this.showToast('获取列表失败')
        }
      })
    },
    loadListSuccess() {
      this.loading = false
      this.firstLoad = false
    },
    loadMoneyCounts() {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      uniCloud.callFunction({
        name: 'account',
        data: {
          action: 'getMoneyCount',
          type: TYPE_HASH[this.selectType],
          tables: this.filterTableId ? [this.filterTableId] : null,
          monthList: this.filterDate,
          sortKey: SORT_TYPE_OBJ[this.sortText].key,
          sortValue: SORT_TYPE_OBJ[this.sortText].value,
          getSize: this.size,
          getPage: this.page,
          wx_openid: wx_openid
        },
        success: (res) => {
            this.moneyCounts = res.result.sumMoney
        },
        fail: () => {
          this.showToast('获取金额总数失败！')
        }
      })
    },
    onMoneyFilter() {
      if (this.sortText !== 'money_down' && this.sortText !== 'money_up') {
        this.sortText = 'money_down'
      } else {
        this.sortText = this.sortText === 'money_down' ? 'money_up' : 'money_down'
      }
      this.loadPostList()
    },
    onTimeFilter() {
      if (this.sortText !== 'time_up' && this.sortText !== 'time_down') {
        this.sortText = 'time_down'
      } else {
        this.sortText = this.sortText === 'time_down' ? 'time_up' : 'time_down'
      }
      this.loadPostList()
    },
  }
}
</script>

<style lang="scss">
@import "../../../../static/icons/iconfont.css";

.ranking {

  &-loading {
    margin-top: 30%;
  }

  &-nothing {
    margin-top: 20%;
  }

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