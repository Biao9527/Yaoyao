<template>
  <view class="statistics">
    <NavBar title="统计"/>
    <Header :type-index.sync="selectType"
            :total-money="computedMoney"
            :select-date="selectDate"
            @onTypeClick="onTypeClick"
            @onDate="onDateClick"/>
    <view class="statistics-content"
          v-if="dataList && dataList.length > 0">
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
        <PostList :list="computedTopTen"
                  :table-list="getMyTableList"
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
    <DatePopup :is-opened.sync="isOpenMonth"
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
import {mapState, mapGetters} from 'vuex'
import {TYPE_HASH, TYPE_TEXT} from "../search/helper";
import DatePopup from "./date-popup/date-popup";
import BarCharts from "./bar-charts/bar-charts";
import PostList from "../../../components/post-list/post-list";
import {navigateToPage} from "../../../helpers/navigateTo";

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
    this.filterAccountList();
  },
  computed: {
    ...mapState([
      'operationHeight'
    ]),
    ...mapGetters([
      'getAccountList',
      'getMyTableList'
    ]),
    computedMoney() {
      if (Array.isArray(this.dataList) && this.dataList.length > 0) {
        let money = 0
        this.dataList.map(items => {
          money += Number(items.money)
        })
        return Number(money.toFixed(2))
      }
      return 0
    },
    typeText() {
      return TYPE_TEXT[this.selectType]
    },
    computedTopTen() {
      if (Array.isArray(this.dataList) && this.dataList.length > 0) {
        return this.dataList.sort((a, b) => Number(a.money) < Number(b.money) ? 1 : -1).slice(0, 10)
      }
      return []
    }
  },
  data() {
    return {
      chartData: {},
      charList: [],
      dataList: [],
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
    getServerData() {
      const data = []
      const arr = []
      let sumMoney = 0
      this.dataList.map(items => {
        sumMoney += Number(items.money)
      })
      sumMoney = Number(sumMoney.toFixed(2))
      this.getMyTableList.map(item => {
        const list = this.dataList.filter(i => i.tableId === item.id)
        if (list && list.length > 0) {
          let money = 0
          list.map(items => {
            money += Number(items.money)
          })
          money = Number(money.toFixed(2))
          const sliceName = item.name.length > 3 ? item.name.slice(0, 3) + '...' : item.name
          data.push({
            "name": item.name,
            "value": money,
            'labelText': ` ${sliceName} :${(money / sumMoney * 100).toFixed(1)}% `
          })
          arr.push({id: item.id, icon: item.icon, name: item.name, money: money})
        }
      })
      let res = {
        series: [{data: data}]
      };
      const sortList = arr.sort((a, b) => a.money < b.money ? 1 : -1)
      for (let i = 0; i < sortList.length; i++) {
        sortList[i].width = (sortList[i].money / sortList[0].money * 100).toFixed(2)
      }
      this.charList = sortList
      this.chartData = JSON.parse(JSON.stringify(res));
    },
    setNowDate() {
      const nowYear = new Date().getFullYear()
      const nowMonth = new Date().getMonth()
      this.selectDate = [nowYear, nowMonth]
    },
    filterAccountList() {
      this.dataList = this.getAccountList
      if (!Array.isArray(this.dataList) || this.dataList.length <= 0) return
      //筛选类型
      this.dataList = this.dataList.filter(item => item.type === TYPE_HASH[this.selectType])
      //筛选日期
      this.dataList = this.dataList.filter(item => {
        const year = new Date(item.date).getFullYear()
        const month = new Date(item.date).getMonth()
        return year === this.selectDate[0] && month === this.selectDate[1]
      })
      this.getServerData()
    },
    goRankingPage(item) {
      navigateToPage('ranking', `?tableId=${item.id}&type=${this.selectType}&year=${this.selectDate[0]}&month=${this.selectDate[1]}`)
    },
    goAllTop() {
      navigateToPage('ranking', `?type=${this.selectType}&year=${this.selectDate[0]}&month=${this.selectDate[1]}`)
    },
    onSelectDate(date) {
      this.selectDate = date
      this.filterAccountList()
    },
    onTypeClick(type) {
      if (type === this.selectType) return
      this.selectType = type
      this.filterAccountList()
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
