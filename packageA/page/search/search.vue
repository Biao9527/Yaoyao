<template>
  <page-meta :page-style="'overflow:'+(isOpenedTable || showFilter ? 'hidden':'visible')"/>
  <view class="search">
    <NavBar left-icon="left" title="摇摇晃摇"/>
    <PostScreenTab :selected-index.sync="selectedTabIndex"
                   @onTabsClick="onTabsClick"
                   @onTabsSearch="onTabsSearch"/>
    <SearchFilter :is-opened.sync="showFilter"
                  :list-type="listType"
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
                  @onSortType="onSortType"
                  @removeFilterTable="removeFilterTable"
                  @openTableList="openTableList"
                  @onReset="onReset"/>
      <AccountList v-if="listType === 'card' && Array.isArray(dataList) && dataList.length > 0"
                   :account-list="dataList"
                   :table-list="getMyTableList"/>
      <StatisticsPostList v-else-if="listType === 'list' && Array.isArray(list) && list.length > 0"
                          :list="list"
                          :type="selectedTabIndex"
                          :table-list="getMyTableList"
                          @onTable="onTabsSearch"/>
      <view class="search-nothing" v-else>
        <Nothing text="这里什么都没有~"/>
      </view>
    </view>
    <Sidebar :list-type="selectedTabIndex"
             @onSidebarItem="onSidebarItem"/>
    <AboutPopup :is-open.sync="isOpenAbout"/>
    <SelectedTable :multi-select="true"
                   :is-opened.sync="isOpenedTable"
                   :table-list.sync="getMyTableList"
                   :selected-table.sync="filterTableId"
                   :last-select-table="lastFilterTableId"
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
import Sidebar from "../../../components/sidebar/sidebar";
import AboutPopup from "../../../components/about-popup/about-popup";
import StatisticsPostList from "../../../components/statistics-post-list/statistics-post-list";
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
    SearchTips,
    Sidebar,
    AboutPopup,
    StatisticsPostList
  },
  onReady() {
    const {statusBarHeight} = uni.getSystemInfoSync()
    this.statusBarHeight = statusBarHeight ? statusBarHeight : 44
  },
  onShow() {
    this.filterAccountList()
  },
  onLoad(options) {
    if (options.openFilter) {
      this.showFilter = true
    }
    if (options.tableId) {
      this.filterTableId = [Number(options.tableId)]
    }
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
      list: [],
      filterTableId: [],
      lastFilterTableId: [],
      filterDateList: [],
      showFilter: false,
      isOpenedTable: false,
      sortValue: 'time_down',
      isOpenAbout: false,
      listType: 'list',
      statusBarHeight: 44
    }
  },
  methods: {
    onReset() {
      this.selectedTabIndex = 0
      this.filterTableId = []
      this.sortValue = 'time_down'
      this.filterDateList = []
      this.filterAccountList()
    },
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
        this.openTableList()
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
    openTableList() {
      this.showFilter = false
      this.lastFilterTableId = this.filterTableId
      this.isOpenedTable = true
    },
    removeFilterTable(id) {
      this.filterTableId.splice(this.filterTableId.indexOf(id), 1)
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
    onSidebarItem(item) {
      switch (item.value) {
        case 'list':
          this.listType = this.listType === 'list' ? 'card' : 'list'
          if (['money_up', 'money_down'].indexOf(this.sortValue) >= 0 && this.listType === 'list') {
            this.sortValue = 'time_down'
          }
          this.filterAccountList()
          break
        case 'kefu':
          break
        case 'warn':
          this.isOpenAbout = true
          break
        default:
          break
      }
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
      if (this.listType === 'list') {
        this.list = this.dataResort(this.dataList, this.sortValue)
      }
      //筛选排序方式
      if (this.listType === 'card') {
        this.dataList = this.onSortList(this.dataList, this.sortValue)
      }
    },
    onSortList(list, sortValue) {
      let sortList = list
      switch (sortValue) {
        case "time_up":
          sortList = sortList.sort((a, b) => a.date > b.date ? 1 : -1)
          break
        case "time_down":
          break
        case "money_up":
          sortList = sortList.sort((a, b) => Number(a.money) > Number(b.money) ? 1 : -1)
          break
        case "money_down":
          sortList = sortList.sort((a, b) => Number(a.money) < Number(b.money) ? 1 : -1)
          break
        default:
          break
      }
      return sortList
    },
    dataResort(arr, sortValue) {
      let newArr = [];
      if (!Array.isArray(arr) || arr.length <= 0) return newArr
      arr.forEach((oldData) => {
        let index = -1;
        const alreadyExists = newArr.some((newData, j) => {
          if (new Date(oldData.date).toLocaleDateString() === new Date(newData.date).toLocaleDateString()) {
            index = j;
            return true;
          }
        });
        if (!alreadyExists) {
          let res = [];
          res.push(oldData)
          newArr.push({
            date: oldData.date,
            list: res
          });
        } else {
          newArr[index].list.push(oldData);
        }
      });
      if (sortValue === 'time_down') {
        newArr = newArr.sort((a, b) => a.date < b.date ? 1 : -1)
      }
      if (sortValue === 'time_up') {
        newArr = newArr.sort((a, b) => a.date > b.date ? 1 : -1)
      }
      return newArr;
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