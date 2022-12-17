<template>
  <view class="custom-tab">
    <view v-for="item in tabList"
          :key="item.id"
          class="custom-tab-items "
          :class="item.id === activeIndex ? 'active' : ''"
          @click="onItemClick(item)">
      {{ item.text }}
    </view>
  </view>
</template>

<script>
export default {
  props: ['activeIndex'],
  computed: {
  },
  data() {
    return {
      tabList: [
        {id: 1, text: '首页'},
        {id: 2, text: '关注'},
        {id: 3, text: '我的'},
      ]
    }
  },
  methods: {
    onItemClick(item) {
      if (item.id === this.$props.activeIndex) return
      switch (item.id) {
        case 1:
          uni.reLaunch({
            url: '/pages/index/index'
          })
          break
        case 2:
          uni.reLaunch({
            url: '/packageA/page/followed/followed'
          })
          break
        case 3:
          uni.reLaunch({
            url: '/packageA/page/user/user'
          })
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
.custom-tab {
  width: 100%;
  height: 88rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  margin-bottom: 30rpx;

  &-items {
    width: 33.333%;
    text-align: center;
  }

  .active {
    font-weight: bold;
    color: red;
  }
}
</style>