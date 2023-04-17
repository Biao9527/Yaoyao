<template>
  <view class="sidebar"
        :class="isOpen">
    <view class="sidebar-more"
          @click="onMoreClick">
      <image :src="moreSvg"/>
    </view>
    <view class="sidebar-list">
      <view class="sidebar-list-item"
            v-for="item in moreList" :key="item.id">
        <image :src="item.img"/>
        <view>{{ item.text }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import moreSvg from '../../static/more.svg'
import kefu from '../../static/kefu.svg'
import warn from '../../static/warn.svg'
import card from '../../static/card.svg'
import list from '../../static/list.svg'


export default {
  data() {
    return {
      moreSvg,
      moreList: [
        {id: 1, text: '切换', value: 'list', img: list, img2: card},
        {id: 3, text: '客服', value: 'list', img: kefu},
        {id: 2, text: '须知', value: 'user', img: warn}
      ],
      rpxWidth: 0,
      isOpen: ''
    }
  },
  methods: {
    onMoreClick() {
      if (!this.isOpen || this.isOpen === 'set_down') {
        this.isOpen = 'set_up'
      } else {
        this.isOpen = 'set_down'
      }
    }
  }
}
</script>

<style lang="scss">
.sidebar {
  background: #FFFFFF;
  border-radius: 100rpx 0 0 100rpx;
  position: fixed;
  bottom: 400rpx;
  right: calc(-332rpx + 100rpx);
  width: max-content;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  &-more {
    margin: 0 10rpx;
    width: 80rpx;
    height: 80rpx;

    image {
      width: 80rpx;
      height: 80rpx;
    }
  }

  &-list {
    margin-left: 10rpx;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &-item {
      font-size: 20rpx;
      text-align: center;
      line-height: 20rpx;
      color: #9b9b9b;
      margin-right: 26rpx;

      image {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }
}

.set_up {
  animation: onceShow linear 300ms forwards;
}

.set_down {
  animation: onceHidden linear 300ms forwards;
}

@keyframes onceShow {
  0% {
    right: calc(-332rpx + 100rpx);
  }
  100% {
    right: 0;
  }
}

@keyframes onceHidden {
  0% {
    right: 0;
  }
  100% {
    right: calc(-332rpx + 100rpx);
  }
}
</style>