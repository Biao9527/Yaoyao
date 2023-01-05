<template>
  <view class="create-table">
    <NavBar title="创建标签" left-icon="left"/>
    <view class="create-table-list">
      <view class="create-table-list-item"
            @click="updateTable(item)"
            v-for="item in getMyTableList" :key="item.id">
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
                      :table-name.sync="tableName"/>
  </view>
</template>

<script>
import NavBar from "../../../../components/nav-bar";
import RecommendTables from "../components/recommend-tables/recommend-tables";
import CreateTableModal from "../components/create-table-modal/create-table-modal";
import {mapGetters, mapMutations} from 'vuex'

export default {
  components: {
    NavBar,
    RecommendTables,
    CreateTableModal
  },
  onLoad(options) {
    if (options.selectedId) {
      this.selectedId = parseInt(options.selectedId)
    }
  },
  computed: {
    ...mapGetters([
      'getMyTableList'
    ])
  },
  data() {
    return {
      isOpenedAddModal: false,
      selectedIndex: 0,
      tableIcon: '',
      tableName: '',
      selectTable: null,
      isEdit: false,
      selectedId: null
    }
  },
  methods: {
    ...mapMutations(['addTable', 'updateTable']),
    createTable() {
      this.isOpenedAddModal = true
    },
    updateTable(item) {
      if (this.selectedId && this.selectedId === item.id) {
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
