<template>
  <view class="load-more">
    <uni-load-more :status="computedStatus"
                   iconType="circle"
                   color="#bbbbbb"
                   :contentText="contentText"/>
  </view>
</template>

<script>
export default {
  props: ['firstLoad', 'loading', 'hasMore'],
  computed: {
    computedStatus() {
      if (!this.firstLoad && this.loading) {
        return 'loading'
      }
      if (!this.hasMore) {
        return 'noMore'
      }
      return 'more'
    }
  },
  data() {
    return {
      contentText: {
        contentdown: '上拉加载更多',
        contentrefresh: '正在加载...',
        contentnomore: '- 这是我的底线 -'
      }
    }
  }
}
</script>

<style lang="scss">
.load-more {
  height: 200rpx;
}
</style>