<template>
  <view class="user-list">
    <button class="user-list-item"
            v-for="item in list" :key="item.id"
            :open-type="item.value === 'contact' ? 'contact' : undefined"
            @click="onItemClick(item.value)">
      <view class="user-list-item-left">
        <image :src="item.img"/>
        <view>{{ item.text }}</view>
      </view>
      <view class="user-list-item-right">
        <view v-if="userInfo && userInfo.background && item.value === 'bg'"
              class="user-list-bg-name">
          {{userInfo.background.name}}
        </view>
        <uni-icons type="right" size="36rpx" color="#131C38"/>
      </view>
    </button>
  </view>
</template>

<script>
import about from "../../assets/about.svg";
import massage from "../../assets/message.svg";
import contact from "../../assets/contact.svg";
import bg from "../../assets/bg.svg"

export default {
  props: ['onItem', 'userInfo'],
  data() {
    return {
      list: [
        {id: 4, text: '背景图片', value: 'bg', img: bg},
        {id: 1, text: 'AI聊天室', value: 'chat', img: massage},
        {id: 2, text: '联系客服', value: 'contact', img: contact},
        {id: 3, text: '关于我们', value: 'warn', img: about}
      ]
    }
  },
  methods: {
    onItemClick(value) {
      this.$emit('onItem', value)
    }
  }
}
</script>

<style lang="scss">
.user-list {
  margin-top: 12rpx;
  background: #FFFFFF;

  &-item {
    background: #FFFFFF;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 38rpx;
    padding: 0 38rpx 0 0;
    border-bottom: 1rpx solid #f2f2f2;

    &-right {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-left {
      display: flex;
      align-items: center;
      font-size: 30rpx;
      color: #131C38;

      image {
        margin-right: 26rpx;
        width: 60rpx;
        height: 60rpx;
      }
    }
  }

  &-bg-name {
    margin-right: 12rpx;
    font-size: 30rpx;
    color: #9b9b9b;
  }

  button::after {
    border: none;
  }
}
</style>