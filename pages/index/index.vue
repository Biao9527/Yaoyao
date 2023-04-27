<template>
  <page-meta :page-style="'overflow:'+(isOpenAbout ? 'hidden':'visible')"/>
  <view class="post">
    <NavBar title="摇摇晃摇"/>
    <PostScreenTab :selected-index.sync="selectedTab"
                   @onTabsClick="onTabsClick"
                   @onTabsSearch="onTabsSearch"/>
    <view class="post-content">
      <AccountList v-if="listType === 'card' && Array.isArray(cardList) && cardList.length > 0"
                   :account-list="cardList"
                   :table-list="getMyTableList"
                   @onTableClick="onTabsSearch"/>
      <StatisticsPostList v-else-if="listType === 'list' && Array.isArray(list) && list.length > 0"
                          :list="list"
                          :type="selectedTab"
                          :table-list="getMyTableList"
                          @onTable="onTabsSearch"/>
      <view class="post-nothing" v-else>
        <Nothing text="这里什么都没有~"/>
      </view>
    </view>
    <view class="post-add-account" @click="goKeepAccounts">
      <uni-icons type="paperplane-filled" size="60rpx" color="#FFFFFF"/>
      <view class="post-add-account-text">记一笔</view>
    </view>
    <Sidebar :list-type="listType"
             @onSidebarItem="onSidebarItem"/>
    <AboutPopup :is-open.sync="isOpenAbout"/>
    <CustomTabBar :active-index="1"
                  :operation-height="operationHeight"/>
  </view>
</template>

<script>
import CustomTabBar from "../../components/custom-tab-bar";
import NavBar from "../../components/nav-bar";
import AccountList from "../../components/account-list/account-list";
import Nothing from "../../components/nothing/nothing";
import PostScreenTab from "./post-screen-tab/post-screen-tab";
import {mapState, mapGetters} from 'vuex'
import {navigateToPage} from "../../helpers/navigateTo";
import {TYPE_HASH} from "../../packageA/page/search/helper";
import Sidebar from "../../components/sidebar/sidebar";
import StatisticsPostList from "../../components/statistics-post-list/statistics-post-list";
import AboutPopup from "../../components/about-popup/about-popup";

export default {
  components: {
    AboutPopup,
    Sidebar,
    CustomTabBar,
    NavBar,
    AccountList,
    Nothing,
    PostScreenTab,
    StatisticsPostList
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {// 来自页面内分享按钮
    }
    return {
      title: '摇摇晃摇',
      path: '/pages/index/index'
    }
  },
  onShow() {
    this.filterAccountList()
  },
  computed: {
    ...mapState([
      'operationHeight',
      'accountList'
    ]),
    ...mapGetters([
      'getAccountList',
      'getMyTableList'
    ])
  },
  data() {
    return {
      selectedTab: 0,
      cardList: [],
      list: [],
      listType: 'list',
      isOpenAbout: false
    }
  },
  methods: {
    goKeepAccounts() {
      navigateToPage('keepAccounts')
    },
    onTabsClick(id) {
      this.selectedTab = id
      this.filterAccountList()
    },
    onTabsSearch(id) {
      let params = '?openFilter=true'
      if (id) {
        params = `?tableId=${id}`
      }
      navigateToPage('search', params)
    },
    onSidebarItem(item) {
      switch (item.value) {
        case 'list':
          this.listType = this.listType === 'list' ? 'card' : 'list'
          this.filterAccountList()
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
    filterAccountList() {
      if (this.selectedTab !== 0) {
        this.cardList = this.getAccountList.filter(item => item.type === TYPE_HASH[this.selectedTab])
      } else {
        this.cardList = this.getAccountList
      }
      if (this.listType === 'list') {
        this.list = this.dataResort(this.cardList)
      }
    },
    dataResort(arr) {
      const newArr = [];
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
      return newArr.sort((a, b) => a.date < b.date ? 1 : -1);
    }
  }
}
</script>

<style lang="scss">
@import "../../static/icons/iconfont.css";

.post {

  &-content {
  }

  &-nothing {
    margin-top: 40%;
  }

  &-add-account {
    width: 120rpx;
    height: 120rpx;
    z-index: 500;
    position: fixed;
    bottom: 200rpx;
    right: 32rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #4cd964;

    &-text {
      font-size: 20rpx;
      color: #FFFFFF;
    }
  }
}
</style>
