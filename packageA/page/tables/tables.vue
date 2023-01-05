<template>
  <view class="tables">
    <NavBar title="标签"/>
    <view class="tables-list"
          v-if="Array.isArray(getMyTableList) && getMyTableList.length > 0">
      <uni-swipe-action>
        <uni-swipe-action-item v-for="(item) in getMyTableList" :key="item.id"
                               :right-options="options"
                               @click="bindClick"
                               @change="swipeChange($event, item)">
          <view class="tables-list-item">
            <uni-icons custom-prefix="iconfont" :type="item.icon" size="88rpx"/>
            <view class="tables-list-item-text">{{ item.name }}</view>
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
import {mapState, mapGetters, mapMutations} from 'vuex'
import CreateTableModal from "./components/create-table-modal/create-table-modal";
import {removeTableStorage} from "./helper/updateTablesStorage";

export default {
  components: {
    CustomTabBar,
    NavBar,
    CreateTableModal,
    Nothing
  },
  computed: {
    ...mapState([
      'tableList',
      'operationHeight'
    ]),
    ...mapGetters([
      'getMyTableList'
    ])
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
      selectTableItem: null,
      tableIcon: '',
      tableName: '',
      isOpenedAddModal: false,
      isEdit: false
    };
  },
  methods: {
    ...mapMutations(['removeTable']),
    onAddTableClick() {
      navigateToPage('createTable')
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
      uni.showModal({
        title: '确定删除标签',
        success: async (res) => {
          if (res.confirm) {
            const success = await removeTableStorage(this.selectTableItem)
            if (!success) {
              this.showToast('删除失败')
              return
            }
            this.removeTable(this.selectTableItem)
            this.showToast('删除成功')
          }
        }
      })
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
      border-bottom: 1rpx solid #f2f2f2;

      &-text {
        margin-left: 44rpx;
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
