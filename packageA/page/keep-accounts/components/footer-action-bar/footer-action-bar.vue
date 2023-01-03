<template>
  <view class="action-bar-wrapper"
        :class="setOperationHeight">
    <view class="action-bar"
          :class="setOperationHeight">
      <view class="action-bar-list">
        <view class="action-bar-list-item"
              v-for="items in actionList" :key="items.id">
          <image :src="items.svg"/>
          <view>{{ items.text }}</view>
        </view>
      </view>
      <button class="action-bar-button">
        保存
      </button>
    </view>
  </view>
</template>

<script>
import mapSvg from '../../assets/map.svg'
import timeSvg from '../../assets/time.svg'
import tableSvg from '../../assets/table.svg'

export default {
  props: ['operationHeight'],
  computed: {
    setOperationHeight() {
      return this.operationHeight !== '96rpx' ? 'set-height' : ''
    }
  },
  data() {
    return {
      actionList: [
        {id: 0, svg: mapSvg, text: '位置'},
        {id: 1, svg: timeSvg, text: '日期'},
        {id: 2, svg: tableSvg, text: '标签'}
      ]
    }
  }
}
</script>

<style lang="scss">
.action-bar-wrapper {
  height: 136rpx;
}

.action-bar {
  width: 100%;
  height: 136rpx;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 6rpx 0 16rpx 0 rgba(0, 0, 0, 0.04);

  &-list {
    display: flex;
    align-items: center;
    justify-content: center;

    &-item {
      height: max-content;
      font-size: 22rpx;
      color: #454c63;
      text-align: center;
      margin-left: 50rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      image {
        width: 54rpx;
        height: 54rpx;
      }
    }
  }

  &-button {
    height: 78rpx;
    margin: 0 26rpx;
    padding: 0 66rpx;
    background: #4cd964;
    border-radius: 100rpx;
    font-size: 30rpx;
    color: #FFFFFF;
    font-weight: bold;
  }

  &-button::after {
    border: none;
  }
}

.set-height {
  padding-bottom: 45rpx;
}
</style>