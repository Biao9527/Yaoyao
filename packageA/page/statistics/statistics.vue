<template>
  <view class="statistics">
    <NavBar title="统计"/>
    <Header :type-index.sync="selectType"
            :total-money="computedMoney"
            :select-date="selectDate"
            @onTypeClick="onTypeClick"
            @onDate="onDateClick"/>
    <view v-if="dataList && dataList.length > 0">
      <view class="charts-box">
        <qiun-data-charts
            type="pie"
            :opts="opts"
            :chartData="chartData"
        />
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
import {TYPE_HASH} from "../search/helper";
import DatePopup from "./date-popup/date-popup";

export default {
  components: {
    CustomTabBar,
    NavBar,
    Header,
    Nothing,
    DatePopup
  },
  onReady() {
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
      let money = 0
      this.dataList.map(items => {
        money += Number(items.money)
      })
      return money
    }
  },
  data() {
    return {
      chartData: {},
      dataList: [],
      selectType: 1,
      isOpenMonth: false,
      selectDate: [],
      opts: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [5, 5, 5, 5],
        enableScroll: false,
        extra: {
          pie: {
            activeOpacity: 0.5,
            activeRadius: 10,
            offsetAngle: 0,
            labelWidth: 15,
            border: true,
            borderWidth: 3,
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
      this.getMyTableList.map(item => {
        const list = this.dataList.filter(i => i.tableId === item.id)
        if (list && list.length > 0) {
          let money = 0
          list.map(items => {
            money += Number(items.money)
          })
          data.push({"name": item.name, "value": money})
        }
      })
      let res = {
        series: [{data: data}]
      };
      this.chartData = JSON.parse(JSON.stringify(res));
    },
    setNowDate() {
      const nowYear = new Date().getFullYear()
      const nowMonth = new Date().getMonth()
      this.selectDate = [nowYear, nowMonth]
    },
    filterAccountList() {
      this.dataList = this.getAccountList
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
.statistics {

  &-nothing {
    margin-top: 20%;
  }
}

.charts-box {
  width: 100%;
  height: 300px;
}
</style>
