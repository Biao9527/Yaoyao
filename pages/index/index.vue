<template>
  <view class="post">
    <NavBar/>
    <PostScreenTab :selected-index.sync="selectedTab"
                   @onTabsClick="onTabsClick"/>
    <view class="post-content">
      <AccountList v-if="Array.isArray(getAccountList) && getAccountList.length > 0"
                   :account-list="getAccountList"
                   :table-list="getMyTableList"/>
      <view class="post-nothing" v-else>
        <Nothing text="这里什么都没有~"/>
      </view>
    </view>
    <view class="post-add-account" @click="goKeepAccounts">
      <uni-icons type="paperplane-filled" size="60rpx" color="#FFFFFF"/>
      <view class="post-add-account-text">记一笔</view>
    </view>
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

export default {
  components: {
    CustomTabBar,
    NavBar,
    AccountList,
    Nothing,
    PostScreenTab
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {// 来自页面内分享按钮
    }
    return {
      title: '摇摇晃摇',
      path: '/pages/index/index'
    }
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
      selectedTab: 0
    }
  },
  methods: {
    goKeepAccounts() {
      navigateToPage('keepAccounts')
    },
    onTabsClick(id) {
      this.selectedTab = id
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
