<template>
  <view v-if="isOpened" class="table-model" @click="onTableModelClick">
    <view class="table-model-add">
      <view class="table-model-title">
        {{ isEdit && selectTable ? '修改标签' : '创建标签' }}
      </view>
      <view class="table-model-add-content">
        <view class="table-model-add-icon"
              v-if="!tableIcon"
              @click.stop="addIcon">
          <uni-icons type="plusempty" size="50rpx" color="#FFFFFF"/>
        </view>
        <view v-else class="table-model-add-select-icon"
              @click.stop="addIcon">
          <uni-icons custom-prefix="iconfont"
                     :type="tableIcon"
                     size="100rpx"
                     color="#FFFFFF"/>
        </view>

        <uni-easyinput :value="tableName"
                       placeholder="请说点什么~"
                       :maxlength="10"
                       @input="onTableNameInput"/>
      </view>
      <view class="table-model-buttons">
        <button class="button-cancel" @click.stop="onCancel">取消</button>
        <button class="button-confirm" @click.stop="onConfirm">
          {{ isEdit && selectTable ? '修改' : '保存' }}
        </button>
      </view>
    </view>
    <view class="table-model-icons" v-if="showIcons">
      <view class="table-model-icons-item"
            v-for="items in iconList" :key="items" @click.stop="selectedIcon(items)">
        <uni-icons custom-prefix="iconfont" :type="items" size="76rpx"/>
      </view>
    </view>
  </view>
</template>

<script>
import {findTablesItem, ICON_LIST, isTablesAccounts, updateTableAccounts} from '../../helper/index'
import {getWxOpenId} from '../../../../../helpers'

export default {
  props: ['isOpened', 'tableIcon', 'tableName', 'isEdit', 'selectTable', 'createSuccess', 'updateSuccess'],
  data() {
    return {
      iconList: ICON_LIST,
      showIcons: false
    }
  },
  methods: {
    addIcon() {
      this.showIcons = !this.showIcons
    },
    selectedIcon(item) {
      this.$emit('update:tableIcon', item)
    },
    onTableModelClick() {
      if (!this.showIcons) return
      this.showIcons = false
    },
    onTableNameInput(e) {
      this.$emit('update:tableName', e)
    },
    async onConfirm() {
      const isEdit = this.isEdit && !!this.selectTable
      uni.showLoading({
        title: isEdit ? '正在修改...' : '正在创建...',
        mask: true
      })
      if (!this.tableIcon) {
        this.showToast('请选择图标')
        return
      }
      if (!this.tableName) {
        this.showToast('请输入标签名')
        return
      }
      const data = {
        icon: this.tableIcon,
        name: this.tableName
      }
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      const findItem = await findTablesItem(wx_openid, data)
      if (findItem && findItem.length > 0) {
        this.showToast('已存在相同标签！')
        return
      }
      if (isEdit) {
        const filterList = await isTablesAccounts(wx_openid, this.selectTable._id)
        if (filterList && filterList.length > 0) {
          const success = updateTableAccounts(wx_openid, this.selectTable._id, data)
          if (!success) {
            this.showToast('修改失败！')
            return
          }
        }
      }
      uniCloud.callFunction({
        name: 'tables',
        data: {
          action: isEdit ? 'update' : 'create',
          tablesId: isEdit ? this.selectTable._id : null,
          wx_openid: wx_openid,
          tableInfo: data
        },
        success: (res) => {
          if (res.result.status === 200) {
            this.$emit(isEdit ? 'updateSuccess' : 'createSuccess')
            this.showToast(isEdit ? '修改成功' : '保存成功')
            this.onCancel()
          } else {
            this.showToast(isEdit ? '修改失败' : '保存失败')
          }
        },
        fail: () => {
          this.showToast(isEdit ? '修改失败' : '保存失败')
        }
      })
    },
    onCancel() {
      this.$emit('update:tableName', '')
      this.$emit('update:isOpened', false)
      this.$emit('update:tableIcon', '')
      this.$emit('update:isEdit', false)
      this.$emit('update:selectTable', null)
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
.table-model {
  z-index: 5000;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);

  &-title {
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #131C38;
    font-weight: bold;
  }

  &-buttons {
    display: flex;
    justify-content: center;
    margin-top: 60rpx;

    .button-cancel {
      background: #9B9B9B;
    }

    .button-confirm {
      background: #FFE14D;
    }

    button {
      padding: 0 64rpx;
      border-radius: 100rpx;
      font-size: 30rpx;
      font-weight: bold;
      color: #FFFFFF;
    }

    button::after {
      border: none;
    }
  }

  &-add {
    margin: 50% auto 0;
    width: 84%;
    background: #FFFFFF;
    border-radius: 28rpx;
    padding: 0 26rpx 44rpx;

    &-icon {
      width: 100rpx;
      height: 100rpx;
      background: #c8c7cc;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 26rpx;
    }

    &-select-icon {
      width: 100rpx;
      height: 100rpx;
      margin-right: 26rpx;
    }

    &-content {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20rpx;
    }
  }

  &-icons {
    border-radius: 38rpx 38rpx 0 0;
    padding: 26rpx 0 100rpx 26rpx;
    background: #FFFFFF;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    &-item {
      margin: 16rpx 26rpx 0 0;
    }
  }
}
</style>