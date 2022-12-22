<template>
  <view class="custom-tab-wrapper"
        :class="setOperationHeight">
    <view class="custom-tab"
          :class="setOperationHeight">
      <view v-for="item in tabList"
            :key="item.id"
            class="custom-tab-items "
            @click="onItemClick(item)">
        <uni-icons :type="item.icon" :color="item.color" size="54rpx"/>
        <view class="custom-tab-items-text"
              :class="item.id === activeIndex ? 'active' : ''">
          {{ item.text }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['activeIndex', 'operationHeight'],
  beforeMount() {
    this.changeItemIcon()
  },
  computed: {
    setOperationHeight() {
      return this.operationHeight !== '96rpx' ? 'set-height' : ''
    }
  },
  data() {
    return {
      tabList: [
        {id: 2, text: '标签', icon: 'flag', color: '#454C63'},
        {id: 1, text: '记账', icon: 'home', color: '#454C63'},
        {id: 3, text: '记录', icon: 'person', color: '#454C63'},
      ]
    }
  },
  methods: {
    changeItemIcon() {
      this.tabList.map((item, index) => {
        if (this.activeIndex === item.id) {
          this.tabList[index].icon = this.tabList[index].icon + '-filled'
          this.tabList[index].color = '#007aff'
        }
      })
    },
    onItemClick(item) {
      if (item.id === this.$props.activeIndex) return
      switch (item.id) {
        case 1:
          uni.redirectTo({
            url: '/pages/index/index'
          })
          break
        case 2:
          uni.redirectTo({
            url: '/packageA/page/tables/tables'
          })
          break
        case 3:
          uni.redirectTo({
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
.custom-tab-wrapper {
  height: 112rpx;
}

.custom-tab {
  background: #FFFFFF;
  width: 100vw;
  z-index: 900;
  height: 112rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  box-shadow: 6rpx 0 16rpx 0 rgba(0, 0, 0, 0.04);

  &-items {
    height: 112rpx;
    width: 33.333%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &-text {
      font-size: 20rpx;
      margin-top: 6rpx;
    }
  }

  .active {
    color: #007aff;
  }
}

.set-height {
  padding-bottom: 45rpx;
}
</style>