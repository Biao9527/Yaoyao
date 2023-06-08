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
                  :table-list="filterTable"
                  @onFilterDateClick="onFilterDate"
                  @onClearDate="onClearFilterDate"
                  @onSortType="onSortType"
                  @removeFilterTable="removeFilterTable"
                  @openTableList="openTableList"
                  @onReset="onReset"/>
      <view v-if="firstLoad"
            class="search-loading">
        <uni-load-more status="loading"
                       iconSize="40"
                       color="#bbbbbb"
                       :showText="false"/>
      </view>
      <view v-else>
        <view v-if="list.length > 0 && dataList.length > 0">
          <AccountList v-if="listType === 'card' && Array.isArray(dataList) && dataList.length > 0"
                       :account-list="dataList"/>
          <StatisticsPostList v-else-if="listType === 'list' && Array.isArray(list) && list.length > 0"
                              :list="list"
                              :type="selectedTabIndex"
                              @onTable="onTabsSearch"/>
          <LoadMore :first-load="firstLoad"
                    :has-more="hasMore"
                    :loading="loading"/>
        </view>
        <view class="search-nothing" v-else>
          <Nothing text="这里什么都没有~"/>
        </view>
      </view>
    </view>
    <Sidebar :list-type="selectedTabIndex"
             @onSidebarItem="onSidebarItem"/>
    <AboutPopup :is-open.sync="isOpenAbout"/>
    <SelectedTable :multi-select="true"
                   :is-opened.sync="isOpenedTable"
                   :first-load="tagFirstLoad"
                   :table-list.sync="tablesList"
                   :selected-table.sync="filterTable"
                   :last-select-table="lastFilterTableId"
                   :nav-bar-height="statusBarHeight + 44"
                   :operation-height="operationHeight"
                   @scrollToLower="onTableScrollToLower"
                   @onConfirm="loadPostList"/>
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
import LoadMore from "../../../components/load-more/load-more";
import {mapState} from 'vuex'
import {SORT_TYPE_OBJ, TYPE_HASH} from "./helper";
import {navigateToPage} from "../../../helpers/navigateTo";
import {getWxOpenId} from "../../../helpers";

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
    StatisticsPostList,
    LoadMore
  },
  onReady() {
    const {statusBarHeight} = uni.getSystemInfoSync()
    this.statusBarHeight = statusBarHeight ? statusBarHeight : 44
  },
  onShow() {
    this.loadPostList()
    if (this.filterTable && this.filterTable.length > 0) {
      this.loadTableItem(this.filterTable[0]._id)
    }
  },
  onLoad(options) {
    if (options.openFilter) {
      this.showFilter = true
    }
    if (options.tableId) {
      this.filterTable = [{_id: options.tableId}]
    }
  },
  onReachBottom() {
    if (!this.loading && this.hasMore) {
      this.loadPostList(false)
    }
  },
  computed: {
    ...mapState([
      'operationHeight'
    ])
  },
  data() {
    return {
      selectedTabIndex: 0,
      selectFilterIndex: 0,
      dataList: [],
      list: [],
      filterTable: [],
      lastFilterTableId: [],
      filterDateList: [],
      showFilter: false,
      isOpenedTable: false,
      sortValue: 'time_down',
      isOpenAbout: false,
      listType: 'list',
      statusBarHeight: 44,
      size: 15,
      page: 1,
      loading: false,
      hasMore: true,
      firstLoad: true,
      tablesList: [],
      tagLoading: false,
      tagHasMore: true,
      tagFirstLoad: true,
      tagPage: 1,
      tagSize: 40,
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
            this.filterTable = [res.result.table]
          } else {
            this.showToast('标签查找失败，请重新选择')
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
          type: TYPE_HASH[this.selectedTabIndex],
          tables: this.filterTable.map(item => item._id),
          dateList: this.filterDateList,
          sortKey: SORT_TYPE_OBJ[this.sortValue].key,
          sortValue: SORT_TYPE_OBJ[this.sortValue].value,
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
            this.list = this.dataResort(this.dataList)
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
    loadTableList(reLoad = true) {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      if (this.tagLoading) {
        return;
      }
      this.tagLoading = true
      if (reLoad) {
        this.tagPage = 1
        this.tagFirstLoad = true
        this.tagHasMore = true
      }
      uniCloud.callFunction({
        name: 'tables',
        data: {
          action: 'get',
          getSize: this.tagSize,
          getPage: this.tagPage,
          wx_openid: wx_openid
        },
        success: (res) => {
          if (res.result.status === 200) {
            if (res.result.dataList.length < this.tagSize) {
              this.tagHasMore = false
            }
            this.tagPage += 1
            if (reLoad) {
              this.tablesList = res.result.dataList
            } else {
              this.tablesList = this.tablesList.concat(res.result.dataList)
            }
            this.loadTablesSuccess()
          } else {
            this.loadTablesSuccess()
            this.showToast('获取列表失败')
          }
        },
        fail: () => {
          this.loadTablesSuccess()
          this.showToast('获取列表失败')
        }
      })
    },
    loadListSuccess() {
      this.loading = false
      this.firstLoad = false
      uni.stopPullDownRefresh()
    },
    loadTablesSuccess() {
      this.tagLoading = false
      this.tagFirstLoad = false
    },
    onTableScrollToLower() {
      if (!this.tagLoading && this.tagHasMore) {
        this.loadTableList(false)
      }
    },
    onReset() {
      this.selectedTabIndex = 0
      this.filterTable = []
      this.sortValue = 'time_down'
      this.filterDateList = []
      this.loadPostList()
    },
    onTabsClick(id) {
      this.selectedTabIndex = id
      this.loadPostList()
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
      this.loadPostList()
    },
    onClearFilterDate() {
      this.filterDateList = []
      this.loadPostList()
    },
    openTableList() {
      this.loadTableList()
      this.showFilter = false
      this.lastFilterTableId = this.filterTable
      this.isOpenedTable = true
    },
    removeFilterTable(id) {
      const index = this.filterTable.findIndex(item => item._id === id)
      this.filterTable.splice(index, 1)
      this.loadPostList()
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
      this.loadPostList()
    },
    onSidebarItem(item) {
      switch (item.value) {
        case 'list':
          this.listType = this.listType === 'list' ? 'card' : 'list'
          if (['money_up', 'money_down'].indexOf(this.sortValue) >= 0 && this.listType === 'list') {
            this.sortValue = 'time_down'
          }
          this.loadPostList()
          break
        case 'kefu':
          break
        case 'warn':
          this.isOpenAbout = true
          break
        case 'ai':
          navigateToPage('aiChat')
          break
        default:
          break
      }
    },
    dataResort(arr) {
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
          const res = [];
          res.push(oldData);
          newArr.push({
            date: oldData.date,
            list: res
          });
        } else {
          newArr[index].list.push(oldData);
        }
      });
      if (this.sortValue === 'time_down') {
        newArr = newArr.sort((a, b) => a.date < b.date ? 1 : -1)
      }
      if (this.sortValue === 'time_up') {
        newArr = newArr.sort((a, b) => a.date > b.date ? 1 : -1)
      }
      return newArr;    }
  }
}
</script>

<style lang="scss">
@import "../../../static/icons/iconfont.css";

.search {

  &-loading {
    margin-top: 60%;
  }

  &-nothing {
    margin-top: 40%;
  }
}
</style>