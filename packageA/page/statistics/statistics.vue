<template>
  <view class="statistics">
    <NavBar title="统计"/>
    <Header :type-index.sync="selectType"
            :total-money="totalMoney"
            :select-date="selectDate"
            @onTypeClick="onTypeClick"
            @onDate="onDateClick"/>
    <view v-if="postLoading || chartLoading"
          class="statistics-loading">
      <uni-load-more status="loading"
                     iconSize="40"
                     color="#bbbbbb"
                     :showText="false"/>
    </view>
    <view v-else>
      <view class="statistics-content"
            v-if="Array.isArray(topTenPostList) && topTenPostList.length > 0">
        <view class="statistics-title">{{ typeText }}构成</view>
        <view class="charts-box">
          <qiun-data-charts
              :canvas2d="true"
              canvasId="dateCanvas"
              :tooltipShow="false"
              type="pie"
              :opts="opts"
              :chartData="chartData"
          />
        </view>
        <BarCharts :char-list="charList"
                   @onBarItem="goRankingPage"/>
        <view class="statistics-title">{{ typeText }}排行</view>
        <view class="statistics-top">
          <PostList :list="topTenPostList"
                    :show-index="true"/>
          <view class="statistics-top-more"
                @click="goAllTop">
            <view>全部排行</view>
            <uni-icons type="forward" size="32rpx" color="#9b9b9b"/>
          </view>
        </view>
      </view>
      <view class="statistics-nothing" v-else>
        <Nothing text="暂无数据"/>
      </view>
    </view>
    <DatePopup v-if="isOpenMonth"
               :is-opened.sync="isOpenMonth"
               :operation-height="operationHeight"
               :select-month="selectDate"
               @onSelectDate="onSelectDate"/>
    <CustomTabBar :active-index="3"
                  :operation-height="operationHeight"/>
  </view>
</template>

<script>
import CustomTabBar from '../../../components/custom-tab-bar'
import NavBar from "../../../components/nav-bar";
import Header from "./header/header";
import Nothing from "../../../components/nothing/nothing";
import {mapState} from 'vuex'
import {TYPE_HASH, TYPE_TEXT} from "../search/helper";
import DatePopup from "./date-popup/date-popup";
import BarCharts from "./bar-charts/bar-charts";
import PostList from "../../../components/post-list/post-list";
import {navigateToPage} from "../../../helpers/navigateTo";
import {getWxOpenId} from "../../../helpers";

export default {
  components: {
    CustomTabBar,
    NavBar,
    Header,
    Nothing,
    DatePopup,
    BarCharts,
    PostList
  },
  onShow() {
    this.setNowDate()
    this.onDataInit()
  },
  computed: {
    ...mapState([
      'operationHeight'
    ]),
    typeText() {
      return TYPE_TEXT[this.selectType]
    },
  },
  data() {
    return {
      totalMoney: 0,
      chartData: {},
      charList: [],
      chartLoading: false,
      topTenPostList: [],
      postLoading: false,
      selectType: 1,
      isOpenMonth: false,
      selectDate: [],
      opts: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [10, 10, 10, 10],
        enableScroll: false,
        fontSize: 12,
        legend: {
          show: false
        },
        extra: {
          tooltip: {
            showBox: false
          },
          pie: {
            activeOpacity: 0.5,
            activeRadius: 5,
            offsetAngle: 0,
            labelWidth: 10,
            border: true,
            borderWidth: 1,
            borderColor: "#FFFFFF",
            linearType: "custom"
          }
        }
      }
    };
  },
  methods: {
    onDataInit() {
      this.loadStatisticsData()
      this.loadTopTenList()
    },
    loadStatisticsData() {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      this.chartLoading = true
      uniCloud.callFunction({
        name: 'account',
        data: {
          action: 'statistics',
          monthList: this.selectDate,
          type: TYPE_HASH[this.selectType],
          wx_openid: wx_openid
        },
        success: (res) => {
          this.totalMoney = res.result.data.sumMoney
          this.chartData = {
            series: [{data: res.result.data.chartData}]
          }
          this.charList = res.result.data.barChartList
          this.chartLoading = false
        },
        fail: () => {
          this.chartLoading = false
          uni.showToast({title: '获取数据失败！', icon: 'none'})
        }
      })
    },
    loadTopTenList() {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      this.postLoading = true
      uniCloud.callFunction({
        name: 'account',
        data: {
          action: 'get',
          type: TYPE_HASH[this.selectType],
          monthList: this.selectDate,
          sortKey: 'money',
          sortValue: 'desc',
          getSize: 10,
          getPage: 1,
          wx_openid: wx_openid
        },
        success: (res) => {
          this.topTenPostList = res.result.dataList
          this.postLoading = false
        },
        fail: () => {
          this.postLoading = false
          uni.showToast({title: '获取数据失败！', icon: 'none'})
        }
      })
    },
    setNowDate() {
      const nowYear = new Date().getFullYear()
      const nowMonth = new Date().getMonth()
      this.selectDate = [nowYear, nowMonth]
    },
    goRankingPage(item) {
      navigateToPage('ranking', `?tableId=${item.table._id}&type=${this.selectType}&year=${this.selectDate[0]}&month=${this.selectDate[1]}`)
    },
    goAllTop() {
      navigateToPage('ranking', `?type=${this.selectType}&year=${this.selectDate[0]}&month=${this.selectDate[1]}`)
    },
    onSelectDate(date) {
      this.selectDate = date
      this.onDataInit()
    },
    onTypeClick(type) {
      if (type === this.selectType) return
      this.selectType = type
      this.onDataInit()
    },
    onDateClick() {
      this.isOpenMonth = true
    }
  }
}
</script>

<style lang="scss">
@import "../../../static/icons/iconfont.css";

page {
  background: #FFFFFF;
}

.statistics {

  &-loading {
    margin-top: 30%;
  }

  &-content {
    margin-top: 30rpx;

    .charts-box {
      width: 100%;
      height: 220px;
    }
  }

  &-title {
    font-size: 32rpx;
    color: #131c38;
    margin: 0 0 26rpx 26rpx;
  }

  &-top {
    border-top: 1rpx solid #f2f2f2;

    &-more {
      margin: 40rpx 0 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;
      color: #9b9b9b;
    }
  }

  &-nothing {
    margin-top: 20%;
  }
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
