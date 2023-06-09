<template>
  <view class="user-header">
    <view class="user-header-avatar">
      <image mode="aspectFill" :src="userInfo.avatarUrl"/>
    </view>
    <view class="user-header-buttons"
          @click="onEditUserInfo">
      <image :src="editSvg"/>
      <view>编辑资料</view>
    </view>
    <view class="user-header-name">
      <view>{{ userInfo && userInfo.nickName ? userInfo.nickName : '' }}</view>
      <image v-if="userInfo && userInfo.gender"
             class="user-header-gender"
             :src="genderHash[userInfo.gender]"/>
    </view>
    <view v-if="userInfo && userInfo._id"
          class="user-header-id"
          @click="onCopyText(userInfo._id)">
      ID：{{ userInfo._id.slice(0, 16) }}
    </view>
    <view class="user-header-personalize">
      {{ userInfo && userInfo.personalize ? userInfo.personalize : '你还没有填写个性签名～' }}
    </view>
  </view>
</template>

<script>
import men from "../../assets/men.svg";
import women from "../../assets/women.svg";
import editSvg from '../../assets/edit.svg'
import bgSvg from '../../assets/bg.svg'
import {navigateToPage} from "../../../../../helpers/navigateTo";

export default {
  props: ['userInfo'],
  data() {
    return {
      genderHash: {
        1: men,
        2: women
      },
      editSvg,
      bgSvg
    }
  },
  methods: {
    onEditUserInfo() {
      navigateToPage('updateUser')
    },
    onCopyText(id) {
      uni.setClipboardData({
        data: id,
        showToast: false,
        success: () => {
          uni.showToast({
            title: '用户ID已复制',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.user-header {
  padding: 110rpx 0 40rpx;
  width: 100%;
  position: relative;
  background: #FFFFFF;
  border-radius: 28rpx 28rpx 0 0;

  &-buttons {
    position: absolute;
    right: 40rpx;
    top: 26rpx;
    padding: 0 24rpx;
    border: 1rpx solid gainsboro;
    border-radius: 100rpx;
    height: 58rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    color: #9b9b9b;

    image {
      margin-right: 8rpx;
      width: 28rpx;
      height: 28rpx;
    }
  }

  &-avatar {
    position: absolute;
    left: 48rpx;
    top: -76rpx;
    overflow: hidden;
    background: #FFFFFF;
    width: 152rpx;
    height: 152rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 144rpx;
      height: 144rpx;
      border-radius: 50%;

    }
  }

  &-name {
    margin-left: 60rpx;
    display: flex;
    align-items: center;
    font-size: 30rpx;
    color: #131C38;
    font-weight: bold;
  }

  &-gender {
    margin-left: 16rpx;
    width: 28rpx;
    height: 28rpx;
  }

  &-id {
    text-decoration: underline;
    width: max-content;
    margin: 8rpx 60rpx 0;
    height: 32rpx;
    border-radius: 100rpx;
    font-size: 22rpx;
    color: #BBBBBB;
  }

  &-personalize {
    margin: 16rpx 60rpx 0;
    opacity: 0.65;
    font-size: 22rpx;
    color: #9B9B9B;
  }
}
</style>