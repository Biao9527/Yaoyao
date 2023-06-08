<template>
  <view class="user-header">
    <view class="user-header-avatar">
      <image mode="aspectFill" :src="userInfo.avatarUrl"/>
    </view>
    <view class="user-header-name">
      <view>{{ userInfo && userInfo.nickName ? userInfo.nickName : '' }}</view>
      <image v-if="userInfo && userInfo.gender"
             class="user-header-gender"
             :src="genderHash[userInfo.gender]"/>
      <view v-if="userInfo && userInfo._id"
            class="user-header-id">
        ID：{{ userInfo._id.slice(0, 10) }}
      </view>
    </view>
  </view>
</template>

<script>
import men from "../../assets/men.svg";
import women from "../../assets/women.svg";

export default {
  props: ['userInfo'],
  data() {
    return {
      genderHash: {
        1: men,
        2: women
      }
    }
  }
}
</script>

<style lang="scss">
.user-header {
  padding-top: 110rpx;
  width: 100%;
  position: relative;
  background: #FFFFFF;
  border-radius: 28rpx 28rpx 0 0;

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
    margin-left: 16rpx;
    padding: 0 16rpx;
    height: 32rpx;
    border-radius: 100rpx;
    background: #F6F6F6;
    font-size: 20rpx;
    color: #BBBBBB;
  }
}
</style>