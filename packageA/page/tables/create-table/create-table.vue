<template>
  <page-meta :page-style="'overflow:'+(isOpenedAddModal ? 'hidden':'visible')"/>
  <view class="create-table">
    <NavBar title="创建标签" left-icon="left"/>
    <view class="create-table-list">
      <view class="create-table-list-item"
            @click="updateTable(item)"
            v-for="item in tablesList" :key="item._id">
        <uni-icons custom-prefix="iconfont" :type="item.icon" size="50rpx"/>
        <view class="create-table-list-text">{{ item.name }}</view>
      </view>
      <view class="create-table-list-item"
            @click="createTable">
        <uni-icons type="plus-filled" size="50rpx" color="#9B9B9B"/>
        <view class="create-table-list-text">新建标签</view>
      </view>
    </view>
    <view class="recommend-view"/>
    <RecommendTables :selected-index.sync="selectedIndex"
                     @recommendItem="recommendItem"/>
    <CreateTableModal :is-opened.sync="isOpenedAddModal"
                      :is-edit.sync="isEdit"
                      :select-table.sync="selectTable"
                      :table-icon.sync="tableIcon"
                      :table-name.sync="tableName"
                      @createSuccess="createSuccess"
                      @updateSuccess="updateSuccess"/>
  </view>
</template>

<script>
import NavBar from "../../../../components/nav-bar";
import RecommendTables from "../components/recommend-tables/recommend-tables";
import CreateTableModal from "../components/create-table-modal/create-table-modal";
import {getWxOpenId} from "../../../../helpers";

export default {
  components: {
    NavBar,
    RecommendTables,
    CreateTableModal
  },
  onLoad(options) {
    if (options.selectedId) {
      this.selectedId = options.selectedId
    }
  },
  onShow() {
    this.loadTableList()
  },
  onReachBottom() {
    if (!this.loading && this.hasMore) {
      this.loadTableList(false)
    }
  },
  computed: {
  },
  data() {
    return {
      isOpenedAddModal: false,
      selectedIndex: 0,
      tableIcon: '',
      tableName: '',
      selectTable: null,
      isEdit: false,
      selectedId: null,
      tablesList: [],
      size: 40,
      page: 1,
      loading: false,
      hasMore: true,
      firstLoad: true
    }
  },
  methods: {
    loadTableList(reLoad = true) {
      if (this.loading) {
        return;
      }
      this.loading = true
      if (reLoad) {
        this.page = 1
        this.firstLoad = true
        this.hasMore = true
      }
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      uniCloud.callFunction({
        name: 'tables',
        data: {
          action: 'get',
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
              this.tablesList = res.result.dataList
            } else {
              this.tablesList = this.tablesList.concat(res.result.dataList)
            }
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
    loadListSuccess() {
      this.loading = false
      this.firstLoad = false
    },
    createTable() {
      this.isOpenedAddModal = true
    },
    createSuccess() {
      this.loadTableList(true)
    },
    updateSuccess() {
      const tabIndex = this.tablesList.findIndex(item => item._id === this.selectTable._id)
      this.tablesList[tabIndex] = {
        ...this.tablesList[tabIndex],
        name: this.tableName,
        icon: this.tableIcon
      }
    },
    updateTable(item) {
      if (this.selectedId && this.selectedId === item._id) {
        uni.showToast({
          title: '标签已选中，无法修改',
          icon: 'none'
        })
        return
      }
      this.isOpenedAddModal = true
      this.tableName = item.name
      this.tableIcon = item.icon
      this.selectTable = item
      this.isEdit = true
    },
    recommendItem(item) {
      this.tableName = item.text
      this.tableIcon = item.icon
      this.isOpenedAddModal = true
    },
    showToast(title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../../../static/icons/iconfont.css";
page {
  background: #FFFFFF;
}
.create-table {

  &-list {
    display: flex;
    flex-wrap: wrap;
    margin-left: 26rpx;

    &-item {
      width: max-content;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 22rpx 0 6rpx;
      height: 62rpx;
      border: 1px solid rgba(220, 220, 220, 0.3);
      border-radius: 32rpx;
      margin: 24rpx 24rpx 0 0;
      text-align: center;
    }

    &-text {
      font-size: 26rpx;
      color: #9B9B9B;
      margin-left: 12rpx;
    }
  }

  .recommend-view {
    height: 600rpx;
  }
}
</style>
