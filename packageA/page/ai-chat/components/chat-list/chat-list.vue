<template>
  <view class="chat-list">
    <view v-for="(item, index) in chatList"
          :key="index">
      <view class="chat-list-item"
            :class="item.role === 'user' ? 'item-right' : ''">
        <image :src="renderAvatar(item.role)"/>
        <view class="chat-list-content"
              :class="item.role === 'user' ? 'right-content' : ''">
          <view class="chat-list-name">{{ renderName(item.role) }}</view>
          <view class="chat-list-text">
            <view class="radius"
                  :class="item.role === 'user' ? 'right-radius' : ''"/>
            <zero-markdown-view :markdown="item.content"/>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import AI from '../../../../../static/AI.svg'
import avatar from '../../../../../static/avatar.svg'

export default {
  props: ['chatList', 'loading', 'userInfo'],
  computed: {
    renderName() {
      return (name) => {
        const nameHash = {
          'user': this.userInfo && this.userInfo.nickName ? this.userInfo.nickName : '用户',
          'assistant': 'AI机器人'
        }
        return nameHash[name]
      }
    },
    renderAvatar() {
      return (name) => {
        const avatarHash = {
          'user': this.userInfo && this.userInfo.avatarUrl ? this.userInfo.avatarUrl : avatar,
          'assistant': AI
        }
        return avatarHash[name]
      }
    }
  },
  data() {
    return {
      AI,
      avatar
    }
  }
}
</script>

<style lang="scss">
.chat-list {
  margin: 26rpx 24rpx 0;

  .item-right {
    flex-direction: row-reverse;
  }

  .right-content {
    margin-left: 0;
    margin-right: 18rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .chat-list-text {
      background: #4cd964;
    }
  }

  &-item {
    display: flex;
    margin-bottom: 20rpx;

    image {
      background: rgba(0, 0, 0, 0.1);
      height: 92rpx;
      width: 92rpx;
      min-height: 92rpx;
      min-width: 92rpx;
      border-radius: 50%;
    }
  }

  &-name {
    font-size: 24rpx;
    color: #9b9b9b;
    margin-bottom: 2rpx;
  }

  &-text {
    z-index: 2;
    position: relative;
    font-size: 32rpx;
    color: #131C38;
    max-width: 480rpx;
    background: #FFFFFF;
    border-radius: 14rpx;

    .radius {
      position: absolute;
      z-index: -1;
      top: 20rpx;
      left: -8rpx;
      width: 16rpx;
      height: 16rpx;
      background: #FFFFFF;
      transform: rotateZ(-45deg);
    }

    .right-radius {
      left: calc(100% - 8rpx);
      background: #4cd964;
    }
  }

  &-content {
    margin-left: 18rpx;
    height: max-content;
  }
}
</style>