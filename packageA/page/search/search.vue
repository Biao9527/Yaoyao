<template>
  <view class="search">
    <NavBar left-icon="left" title="摇摇晃摇"/>
    <PostScreenTab :selected-index.sync="selectedTabIndex"
                   @onTabsClick="onTabsClick"
                   @onTabsSearch="onTabsSearch"/>
    <SearchFilter :is-opened.sync="showFilter"
                  :selected-index.sync="selectFilterIndex"
                  :filter-type="selectedTabIndex"
                  :sort-value="sortValue"
                  @onFilterTabClick="onFilterTabClick"
                  @onFilterItem="onFilterItemClick"
                  @onFilterDateClick="onFilterDate"/>
    <view class="search-content">
      <SearchTips :sort-value="sortValue"
                  :date-list="filterDateList"
                  :table-ids="filterTableId"
                  @onFilterDateClick="onFilterDate"
                  @onClearDate="onClearFilterDate"
                  @onSortType="onSortType"/>
      <AccountList v-if="Array.isArray(dataList) && dataList.length > 0"
                   :account-list="dataList"
                   :table-list="getMyTableList"/>
      <view class="search-nothing" v-else>
        <Nothing text="这里什么都没有~"/>
      </view>
    </view>
    <SelectedTable :multi-select="true"
                   :is-opened.sync="isOpenedTable"
                   :table-list.sync="getMyTableList"
                   :selected-table.sync="filterTableId"
                   :nav-bar-height="statusBarHeight + 44"
                   :operation-height="operationHeight"
                   @onConfirm="filterAccountList"/>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import AccountList from "../../../components/account-list/account-list";
import Nothing from "../../../components/nothing/nothing";
import PostScreenTab from "../../../pages/index/post-screen-tab/post-screen-tab";
import SearchFilter from "./search-filter/search-filter";
import SelectedTable from "../keep-accounts/components/selected-table/selected-table";
import SearchTips from "./search-tips/search-tips";
import {mapGetters, mapState} from 'vuex'
import {TYPE_HASH} from "./helper";

export default {
  components: {
    NavBar,
    AccountList,
    Nothing,
    PostScreenTab,
    SearchFilter,
    SelectedTable,
    SearchTips
  },
  onReady() {
    const {statusBarHeight} = uni.getSystemInfoSync()
    this.statusBarHeight = statusBarHeight ? statusBarHeight : 44
  },
  onShow() {
    this.filterAccountList()
  },
  computed: {
    ...mapState([
      'operationHeight'
    ]),
    ...mapGetters([
      'getAccountList',
      'getMyTableList'
    ])
  },
  data() {
    return {
      selectedTabIndex: 0,
      selectFilterIndex: 0,
      dataList: [],
      filterTableId: [],
      filterDateList: [],
      showFilter: false,
      isOpenedTable: false,
      sortValue: 'time_down',
      statusBarHeight: 44
    }
  },
  methods: {
    onTabsClick(id) {
      this.selectedTabIndex = id
      this.filterAccountList()
    },
    onTabsSearch() {
      this.showFilter = !this.showFilter
    },
    onSortType() {
      this.selectFilterIndex = 1
      this.showFilter = true
    },
    onFilterTabClick(id) {
      if (id === 2) {
        this.showFilter = false
        this.isOpenedTable = true
        return
      }
      this.selectFilterIndex = id
    },
    onFilterDate(date) {
      this.filterDateList = date
      this.filterAccountList()
    },
    onClearFilterDate() {
      this.filterDateList = []
      this.filterAccountList()
    },
    onFilterItemClick(item) {
      this.showFilter = false
      switch (this.selectFilterIndex) {
        case 0:
          this.selectedTabIndex = item.value
          break
        case 1:
          this.sortValue = item.value
          break
        default:
          break
      }
      this.filterAccountList()
    },
    filterAccountList() {
      this.dataList = this.getAccountList
      //筛选类型
      if (this.selectedTabIndex !== 0) {
        this.dataList = this.dataList.filter(item => item.type === TYPE_HASH[this.selectedTabIndex])
      }
      //筛选标签
      if (this.filterTableId.length > 0) {
        let list = []
        this.filterTableId.map(item => {
          list = list.concat(this.dataList.filter(i => i.tableId === item))
        })
        this.dataList = list
      }
      //筛选日期
      if (this.filterDateList.length === 2) {
        this.dataList = this.dataList.filter(i => i.date >= this.filterDateList[0] && i.date <= this.filterDateList[1])
      }
      //筛选排序方式
      switch (this.sortValue) {
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
@import "../../../static/icons/iconfont.css";

.search {

  &-nothing {
    margin-top: 40%;
  }
}
</style>