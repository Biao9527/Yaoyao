<template>
  <page-meta :page-style="'overflow:'+(isOpenAbout ? 'hidden':'visible')"/>
  <view class="post">
    <NavBar title="摇摇晃摇"/>
    <PostScreenTab :selected-index.sync="selectedTab"
                   @onTabsClick="onTabsClick"
                   @onTabsSearch="onTabsSearch"/>
    <view v-if="firstLoad" class="post-loading">
      <uni-load-more status="loading"
                     iconSize="40"
                     color="#bbbbbb"
                     :showText="false"/>
    </view>
    <view class="post-content" v-else>
      <view v-if="list.length > 0 && cardList.length > 0">
        <AccountList v-if="listType === 'card' && Array.isArray(cardList) && cardList.length > 0"
                     :account-list="cardList"
                     @onTableClick="onTabsSearch"/>
        <StatisticsPostList v-else-if="listType === 'list' && Array.isArray(list) && list.length > 0"
                            :list="list"
                            :type="selectedTab"
                            @onTable="onTabsSearch"/>
        <LoadMore :first-load="firstLoad"
                  :has-more="hasMore"
                  :loading="loading"/>
      </view>
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
import {mapState} from 'vuex'
import {navigateToPage} from "../../helpers/navigateTo";
import {TYPE_HASH} from "../../packageA/page/search/helper";
import Sidebar from "../../components/sidebar/sidebar";
import StatisticsPostList from "../../components/statistics-post-list/statistics-post-list";
import AboutPopup from "../../components/about-popup/about-popup";
import LoadMore from "../../components/load-more/load-more";
import {getWxOpenId} from "../../helpers";

export default {
  components: {
    AboutPopup,
    Sidebar,
    CustomTabBar,
    NavBar,
    AccountList,
    Nothing,
    PostScreenTab,
    StatisticsPostList,
    LoadMore
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
    this.loadPostList()
  },
  onPullDownRefresh() {
    this.loadPostList()
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
      selectedTab: 0,
      cardList: [],
      list: [],
      listType: 'list',
      isOpenAbout: false,
      size: 15,
      page: 1,
      loading: false,
      hasMore: true,
      firstLoad: true
    }
  },
  methods: {
    goKeepAccounts() {
      navigateToPage('keepAccounts')
    },
    loadPostList(reLoad = true) {
      if (this.loading) {return;}

      this.loading = true
      if (reLoad) {
        this.page = 1
        this.firstLoad = true
        this.hasMore = true
      }
      const wx_openid = getWxOpenId()
      if (!wx_openid) {return}
      const filter = {}
      if (TYPE_HASH[this.selectedTab]) {
        filter.type = TYPE_HASH[this.selectedTab]
      }
      uniCloud.callFunction({
        name: 'account',
        data: {
          action: 'get',
          getSize: this.size,
          getPage: this.page,
          filterData: filter,
          wx_openid: wx_openid
        },
        success: (res) => {
          if (res.result.status === 200) {
            if (res.result.dataList.length < this.size) {
              this.hasMore = false
            }
            this.page += 1
            if (reLoad) {
              this.cardList = res.result.dataList
            } else {
              this.cardList = this.cardList.concat(res.result.dataList)
            }
            this.list = this.dataResort(this.cardList)
            this.loadListSuccess()
          } else {
            this.loadListSuccess()
            this.showToast('获取列表失败')
          }
        },
        fail: () => {
        }
      })
    },
    loadListSuccess() {
      this.loading = false
      this.firstLoad = false
      uni.stopPullDownRefresh()
    },
    onTabsClick(id) {
      this.selectedTab = id
      this.loadPostList()
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
  &-loading {
    margin-top: 60%;
  }

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
