<template>
  <view class="accounts">
    <NavBar title="记一笔" left-icon="left"/>
    <view class="accounts-content">
      <view class="accounts-type-tabs">
        <view class="accounts-type-items"
              :class="tallyType === '-' ? 'active' : ''"
              @click="tallyType = '-'">支出
        </view>
        <view class="accounts-type-items"
              :class="tallyType === '+' ? 'active' : ''"
              @click="tallyType = '+'">收入
        </view>
      </view>
      <view class="accounts-table"
            v-if="selectedTable">
        <view class="accounts-table-title">绑定标签</view>
        <view class="accounts-table-wrapper" @click="openedTable">
          <uni-icons custom-prefix="iconfont" :type="selectedTable.icon" size="80rpx"/>
          <view class="accounts-table-name">{{ selectedTable.name }}</view>
        </view>
      </view>
      <view class="accounts-date"
            v-if="selectedDate">
        <view class="accounts-date-title">时间：</view>
          <uni-datetime-picker :value="selectedDate"
                               return-type="timestamp"
                               :end="Date.now()"
                               hide-second
                               @change="onDateChange">
            <view class="accounts-date-wrapper">
              <uni-icons type="calendar" size="46rpx" color="#c0c4cc"/>
              <view class="accounts-date-wrapper-text">
                <uni-dateformat :date="selectedDate" format="yyyy-M-d hh:mm"/>
              </view>
              <view class="accounts-date-wrapper-clear"
                    @click="onClearDate">
                <uni-icons type="clear" size="50rpx" color="#c0c4cc"/>
              </view>
            </view>
          </uni-datetime-picker>
      </view>
      <view class="accounts-money">
        <view>金额：</view>
        <view class="accounts-money-input-wrapper">
          <view>￥</view>
          <view class="accounts-money-input"
                v-if="!showMoneyInput"
                :style="inputPlaceholderStyle"
                @click="onMoneyFocus">
            {{money ? money : '请输入金额~'}}
          </view>
          <input class="accounts-money-input"
                 v-else
                 :value="money"
                 :focus="showMoneyInput"
                 type="digit"
                 placeholder="请输入金额~"
                 placeholderStyle="color:#D6D6D6"
                 @input="onMoneyInput"
                 @focus="onMoneyFocus"
                 @blur="onMoneyBlur"/>
        </view>
      </view>
      <view class="accounts-notes">
        <view>备注</view>
        <view class="accounts-notes-textarea-wrapper">
          <view class="accounts-notes-textarea"
                :style="textareaPlaceholderStyle"
                @click="onNotesFocus"
                v-if="!showNotesInput">
            {{notes ? notes : '请输入账单备注~'}}
          </view>
          <textarea class="accounts-notes-textarea"
                    v-else
                    placeholder-class="accounts-notes-placeholder"
                    :value="notes"
                    :focus="showNotesInput"
                    type="textarea"
                    placeholder="请输入账单备注~"
                    :maxlength="100"
                    @input="onNotesInput"
                    @focus="onNotesFocus"
                    @blur="onNotesBlur"/>
        </view>
      </view>
      <view v-if="address"
            class="accounts-map">
        <view class="accounts-map-title">位置信息</view>
        <view class="accounts-map-info"
              v-if="address.name && address.address"
              @click="onChooseLocation">
          <image :src="locationSvg"/>
          <view class="accounts-map-address">
            <view class="accounts-map-name">{{address.name}}</view>
            <view class="accounts-map-text">{{address.address}}</view>
          </view>
        </view>
        <view class="accounts-map-wrapper">
          <view class="accounts-map-wrapper-mask"
                @click="openMapClick"/>
          <map class="select-map"
               :markers="[{
             latitude: address.latitude,
             longitude: address.longitude,
             width: 20,
             height: 30,
             iconPath: location
             }]"
               :longitude="address.longitude"
               :latitude="address.latitude"
               :enable-zoom="false"
               :enable-scroll="false"/>
        </view>
      </view>
    </view>
    <FooterActionBar :operation-height="operationHeight"
                     :selected-date.sync="selectedDate"
                     @onLocationClick="onChooseLocation"
                     @onTableItemClick="openedTable"
                     @onSubmit="onSubmit"/>
    <SelectedTable :is-opened.sync="isOpenedTable"
                   :table-list.sync="getMyTableList"
                   :selected-table.sync="selectedTable"
                   :nav-bar-height="statusBarHeight + 44"/>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import FooterActionBar from "./components/footer-action-bar/footer-action-bar";
import SelectedTable from "./components/selected-table/selected-table";
import {mapGetters, mapState, mapMutations} from 'vuex'
import locationSvg from './assets/locationSvg.svg'
import {updateAccountsStorage, verificationTallyForm} from "./helpers/accountsStorage";
import {autoIncrementId} from "../../../helpers";

export default {
  components: {
    NavBar,
    FooterActionBar,
    SelectedTable
  },
  onReady() {
    const {statusBarHeight} = uni.getSystemInfoSync()
    this.statusBarHeight = statusBarHeight ? statusBarHeight : 44
  },
  computed: {
    ...mapState([
      'operationHeight'
    ]),
    ...mapGetters([
      'getMyTableList'
    ]),
    inputPlaceholderStyle() {
      return this.money ? '' : 'color: #D6D6D6'
    },
    textareaPlaceholderStyle() {
      return this.notes ? '' : 'color: #D6D6D6'
    }
  },
  data() {
    return {
      tallyType: '-',
      notes: '',
      money: null,
      selectedDate: null,
      selectedTable: null,
      isOpenedTable: false,
      statusBarHeight: 44,
      showMoneyInput: false,
      showNotesInput: false,
      address: null,
      locationSvg
    }
  },
  methods: {
    ...mapMutations(['addAccount']),
    onNotesInput(e) {
      this.notes = e.detail.value
    },
    onNotesFocus() {
      this.showNotesInput = true
    },
    onNotesBlur() {
      this.showNotesInput = false
    },
    onMoneyInput(e) {
      this.money = e.detail.value
    },
    onMoneyFocus() {
      this.showMoneyInput = true
    },
    onMoneyBlur() {
      this.showMoneyInput = false
    },
    openedTable() {
      this.isOpenedTable = true
    },
    onDateChange(e) {
      this.selectedDate = e
    },
    onClearDate() {
      this.selectedDate = null
    },
    onChooseLocation() {
      uni.chooseLocation({
        latitude: this.address ? this.address.latitude : undefined,
        longitude: this.address ? this.address.longitude : undefined,
        success: res => {
          this.address = {
            name: res.name,
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }
        }
      })
    },
    openMapClick() {
      uni.showLoading()
      uni.openLocation({
        ...this.address,
        scale: 14,
        complete: () => {
          uni.hideLoading()
        }
      })
    },
    onSubmit() {
      const payload = {
        type: this.tallyType,
        table: this.selectedTable,
        date: this.selectedDate,
        money: parseFloat(parseFloat(this.money).toFixed(2)),
        notes: this.notes,
        address: this.address
      }
      const isPass = verificationTallyForm.call(this, payload)
      if (isPass) return
      payload.id = autoIncrementId('tallyMaxId')
      const success = updateAccountsStorage(payload)
      if (!success) return
      this.addAccount(payload)
      uni.navigateBack()
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

page {
  background: #FFFFFF;
}

.accounts {

  &-content {
    margin: 32rpx 0 100rpx 26rpx;
  }

  &-table {
    margin-right: 26rpx;
    margin-bottom: 50rpx;

    &-title {
      font-size: 30rpx;
      color: #131C38;
      margin-bottom: 16rpx;
    }

    &-wrapper {
      padding: 0 20rpx;
      height: 110rpx;
      display: flex;
      align-items: center;
      border: 1px solid #e5e5e5;
      border-radius: 26rpx;
    }

    &-name {
      font-size: 32rpx;
      color: #454c63;
      margin-left: 32rpx;
    }
  }

  &-date {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 26rpx;
    border-bottom: 1rpx solid #f2f2f2;
    height: 76rpx;

    &-title {
      font-size: 30rpx;
      color: #131C38;
    }

    &-wrapper {
      display: flex;
      align-items: center;
      flex-grow: 1;
      margin: 0 26rpx 0 32rpx;
      height: 76rpx;
      border: 1px solid #e5e5e5;
      padding: 0 26rpx;
      border-radius: 13rpx;
      position: relative;

      &-text {
        font-size: 30rpx;
        color: #454c63;
        margin: 0 16rpx;
      }

      &-clear {
        padding: 0 10rpx;
        position: absolute;
        right: 0;
        top: calc(50% - 25rpx);
      }
    }
  }

  &-type-tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 80rpx;

    .active {
      background: #007aff;
      border: 1rpx solid #007aff;
      color: #FFFFFF;
    }
  }

  &-type-items {
    height: 58rpx;
    width: 112rpx;
    border: 1rpx solid #e8e8e8;
    font-size: 28rpx;
    color: #454c63;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100rpx;
    margin-right: 26rpx;
  }

  &-money {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30rpx;
    color: #131c38;
    height: 76rpx;
    margin: 26rpx 26rpx 26rpx 0;

    &-input-wrapper {
      display: flex;
      align-items: center;
      flex-grow: 1;
      height: 100%;
      border: 1px solid #e5e5e5;
      padding: 0 26rpx;
      margin-left: 32rpx;
      border-radius: 13rpx;
    }

    &-input {
      margin: 0 50rpx;
      width: 100%;
      text-align: right;
    }
  }

  &-notes {
    border-top: 1rpx solid #f2f2f2;
    padding: 26rpx 26rpx 0 0;
    font-size: 30rpx;
    color: #131C38;

    &-textarea-wrapper {
      margin-top: 16rpx;
      height: 220rpx;
      background: #F6F6F6;
      border-radius: 13rpx;
      padding: 26rpx;
    }

    &-textarea {
      width: 100%;
      height: 100%;
    }

    &-placeholder {
      color: #D6D6D6
    }
  }

  &-map {
    margin-top: 40rpx;
    padding-right: 26rpx;

    &-info {
      margin-bottom: 32rpx;
      border: 1px solid #e5e5e5;
      height: 120rpx;
      display: flex;
      align-items: center;
      border-radius: 13rpx;
      padding: 0 26rpx;

      image {
        width: 94rpx;
        height: 94rpx;
      }
    }

    &-name {
      font-size: 26rpx;
      color: #131c38;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-text {
      margin-top: 4rpx;
      font-size: 26rpx;
      color: #454c63;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-address {
      margin-left: 26rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-title {
      color: #131c38;
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 16rpx;
    }

    &-wrapper {
      width: 100%;
      height: 436rpx;
      position: relative;

      &-mask {
        position: absolute;
        width: 100%;
        height: 436rpx;
        top: 0;
        left: 0;
        z-index: 10;
      }

      .select-map {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>