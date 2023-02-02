<template>
  <view class="search">
    <NavBar left-icon="left" title="摇摇晃摇"/>
    <PostScreenTab :selected-index.sync="selectedTabIndex"
                   @onTabsClick="onTabsClick"
                   @onTabsSearch="onTabsSearch"/>
    <SearchFilter :is-opened="showFilter"
                  :selected-index.sync="selectFilterIndex"/>
    <view class="search-content">
      <AccountList v-if="Array.isArray(dataList) && dataList.length > 0"
                   :account-list="dataList"
                   :table-list="getMyTableList"/>
      <view class="post-nothing" v-else>
        <Nothing text="这里什么都没有~"/>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import AccountList from "../../../components/account-list/account-list";
import Nothing from "../../../components/nothing/nothing";
import PostScreenTab from "../../../pages/index/post-screen-tab/post-screen-tab";
import SearchFilter from "./search-filter/search-filter";
import {mapGetters} from 'vuex'
import {TYPE_HASH} from "./helper";

export default {
  components: {
    NavBar,
    AccountList,
    Nothing,
    PostScreenTab,
    SearchFilter
  },
  onShow() {
    this.filterAccountList()
  },
  computed: {
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
      showFilter: false,
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
    filterAccountList() {
      if (this.selectedTabIndex !== 0) {
        this.dataList = this.getAccountList.filter(item => item.type === TYPE_HASH[this.selectedTabIndex])
      } else {
        this.dataList = this.getAccountList
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../../static/icons/iconfont.css";

.search {
}
</style>