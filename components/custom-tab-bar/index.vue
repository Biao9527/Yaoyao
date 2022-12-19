<template>
  <view class="custom-tab"
        :class="operationHeight !== '96rpx' ? 'set-height' : ''">
    <view v-for="item in tabList"
          :key="item.id"
          class="custom-tab-items "
          @click="onItemClick(item)">
      <view>
        <uni-icons :type="item.icon" :color="item.color" size="54rpx"/>
      </view>
      <view class="custom-tab-items-text"
            :class="item.id === activeIndex ? 'active' : ''">
        {{ item.text }}
      </view>
    </view>
  </view>
</template>

<script>
import {byModelsSetAction} from "../../helpers";

export default {
  props: ['activeIndex'],
  beforeMount() {
    this.changeItemIcon()
    byModelsSetAction.call(this)
  },
  data() {
    return {
      tabList: [
        {id: 2, text: '标签', icon: 'flag', color: '#454C63'},
        {id: 1, text: '记账', icon: 'home', color: '#454C63'},
        {id: 3, text: '记录', icon: 'person', color: '#454C63'},
      ],
      operationHeight: '10rpx'
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
          uni.reLaunch({
            url: '/pages/index/index'
          })
          break
        case 2:
          uni.reLaunch({
            url: '/packageA/page/tables/tables'
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
  background: #FFFFFF;
  width: 100%;
  min-height: 112rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &-items {
    width: 33.333%;
    text-align: center;

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