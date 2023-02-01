<template>
<view class="search">
  <NavBar left-icon="left" title="摇摇晃摇"/>
  <PostScreenTab :selected-index.sync="selectedTabIndex"
                 @onTabsClick="onTabsClick"/>
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
import {mapGetters} from 'vuex'

export default {
  components: {
    NavBar,
    AccountList,
    Nothing,
    PostScreenTab
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
      dataList: []
    }
  },
  methods: {
    onTabsClick(id) {
      this.selectedTabIndex = id
      this.filterAccountList()
    },
    filterAccountList() {
      const typeHash = {
        1: '-',
        2: '+'
      }
      if (this.selectedTabIndex !== 0) {
        this.dataList = this.getAccountList.filter(item => item.type === typeHash[this.selectedTabIndex])
      } else {
        this.dataList = this.getAccountList
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../../static/icons/iconfont.css";

</style>