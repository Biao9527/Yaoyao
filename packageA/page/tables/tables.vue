<template>
  <page-meta :page-style="'overflow:'+(isOpenedAddModal ? 'hidden':'visible')"/>
  <view class="tables">
    <NavBar title="标签"/>
    <view class="tables-list"
          v-if="Array.isArray(tablesList) && tablesList.length > 0">
      <uni-swipe-action>
        <uni-swipe-action-item v-for="(item) in tablesList" :key="item._id"
                               :right-options="options"
                               @click="bindClick"
                               @change="swipeChange($event, item)">
          <view class="tables-list-item"
                @click="goSearchPage(item.id)">
            <view class="tables-list-item-right">
              <uni-icons custom-prefix="iconfont" :type="item.icon" size="88rpx"/>
              <view class="tables-list-item-text">{{ item.name }}</view>
              <view @click.stop="showToast('向左滑动即可操作标签')">
                <uni-icons type="help" size="40rpx" color="#dd524d"/>
              </view>
            </view>
            <view class="tables-list-item-left"
                  @click.stop="goKeepAccounts(item.id)">
              <view class="left_text">去记账</view>
              <uni-icons type="right" size="34rpx" color="#BBBBBB"/>
            </view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
    <view class="tables-nothing" v-else>
      <Nothing text="这里什么都没有~"/>
    </view>
    <view class="tables-add"
          @click="onAddTableClick">
      <uni-icons type="plus-filled" size="120rpx" color="#4cd964"/>
    </view>
    <CustomTabBar :active-index="2"
                  :operation-height="operationHeight"/>
    <CreateTableModal :is-opened.sync="isOpenedAddModal"
                      :is-edit.sync="isEdit"
                      :select-table.sync="selectTableItem"
                      :table-icon.sync="tableIcon"
                      :table-name.sync="tableName"/>
  </view>
</template>

<script>
import CustomTabBar from '../../../components/custom-tab-bar'
import NavBar from "../../../components/nav-bar";
import Nothing from "../../../components/nothing/nothing";
import {navigateToPage} from "../../../helpers/navigateTo";
import {mapState} from 'vuex'
import CreateTableModal from "./components/create-table-modal/create-table-modal";
import {getWxOpenId} from "../../../helpers";

export default {
  components: {
    CustomTabBar,
    NavBar,
    CreateTableModal,
    Nothing
  },
  computed: {
    ...mapState([
      'operationHeight'
    ])
  },
  onShow() {
    this.loadTableList()
  },
  data() {
    return {
      options: [
        {
          text: '编辑',
          style: {
            backgroundColor: '#007aff'
          }
        }, {
          text: '删除',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ],
      tablesList: [],
      selectTableItem: null,
      tableIcon: '',
      tableName: '',
      isOpenedAddModal: false,
      isEdit: false
    };
  },
  methods: {
    onAddTableClick() {
      navigateToPage('createTable')
    },
    loadTableList() {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      uniCloud.callFunction({
        name: 'tables',
        data: {
          action: 'get',
          wx_openid: wx_openid
        },
        success: (res) => {
          this.tablesList = res.result
        },
        fail: () => {
        }
      })
    },
    bindClick(e) {
      if (e.index === 0) {
        this.isOpenedAddModal = true
        this.tableName = this.selectTableItem.name
        this.tableIcon = this.selectTableItem.icon
        this.isEdit = true
      }
      if (e.index === 1) {
        this.removeTableModal()
      }
    },
    swipeChange(e, item) {
      this.selectTableItem = item
    },
    removeTableModal() {
      this.deleteTable()
    },
    deleteTable() {
      const wx_openid = getWxOpenId()
      uni.showModal({
        title: '确定删除标签',
        success: async (res) => {
          if (res.confirm) {
            uniCloud.callFunction({
              name: 'tables',
              data: {
                action: 'delete',
                tablesId: this.selectTableItem._id,
                wx_openid: wx_openid
              },
              success: (res) => {
                if (res.result.status === 200) {
                  const tabIndex = this.tablesList.findIndex(item => item._id === this.selectTableItem._id)
                  this.tablesList.splice(tabIndex, 1)
                  this.showToast('删除成功')
                } else {
                  this.showToast('删除失败')
                }
              },
              fail: () => {
              }
            })
          }
        }
      })
    },
    goKeepAccounts(id) {
      navigateToPage('keepAccounts', `?tableId=${id}`)
    },
    goSearchPage(id) {
      navigateToPage('search', `?tableId=${id}`)
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
@import "../../../static/icons/iconfont.css";

.tables {
  position: relative;

  .tables-list {
    margin-top: 16rpx;
    background: #FFFFFF;

    &-item {
      display: flex;
      margin-left: 26rpx;
      height: 120rpx;
      background: #FFFFFF;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1rpx solid #f2f2f2;

      &-right {
        display: flex;
        align-items: center;
      }

      &-left {
        height: 48rpx;
        display: flex;
        align-items: center;
        background: #F6F6F6;
        padding: 0 16rpx 0 26rpx;
        margin-right: 26rpx;
        border-radius: 8rpx;

        .left_text {
          color: #bbbbbb;
          font-size: 26rpx;
          margin-right: 4rpx;
        }
      }

      &-text {
        margin-left: 44rpx;
        margin-right: 8rpx;
        font-size: 32rpx;
        color: #030303;
      }
    }
  }

  &-add {
    position: fixed;
    bottom: 200rpx;
    left: calc(50% - 30px);
  }

  &-nothing {
    margin-top: 40%;
  }
}
</style>
