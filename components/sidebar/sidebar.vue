<template>
  <movable-area class="movableArea">
    <movable-view class="sidebar"
                  :style="borderRadiusStyle"
                  :x="x"
                  :y="y"
                  direction="all"
                  :animation="false"
                  @change="onChange"
                  @touchstart.prevent="onTouchStart"
                  @touchend.prevent="onTouchend">
      <view class="sidebar-list left-list"
            v-if="showList && direction === 'left'">
        <view class="sidebar-list-item left-item"
              v-for="item in moreList" :key="item.id"
              @click.stop="onItemClick(item)">
          <image :src="item.value === 'list' && listType === 'list' ? item.img2 : item.img"/>
          <view>{{item.value === 'list' && listType === 'list' ? item.text2 : item.text}}</view>
        </view>
      </view>
      <view class="sidebar-more">
        <image :src="moreSvg"/>
      </view>
      <view class="sidebar-list"
            v-if="showList && direction === 'right'">
        <view class="sidebar-list-item"
              v-for="item in moreList" :key="item.id"
              @click.stop="onItemClick(item)">
          <image :src="item.value === 'list' && listType === 'list' ? item.img2 : item.img"/>
          <view>{{item.value === 'list' && listType === 'list' ? item.text2 : item.text}}</view>
        </view>
      </view>
    </movable-view>
  </movable-area>
</template>

<script>
import moreSvg from '../../static/more.svg'
import kefu from '../../static/kefu.svg'
import warn from '../../static/warn.svg'
import card from '../../static/card.svg'
import list from '../../static/list.svg'

export default {
  props: ['listType', 'onSidebarItem'],
  mounted() {
    //初始位置
    uni.getSystemInfo({
      success: (res) => {
        const pxToRpx = 750 / res.windowWidth
        this.x1 = 0;
        this.x2 = Number(res.windowWidth) - 100 / pxToRpx;
        this.y1 = 0;
        this.y2 = Number(res.windowHeight) - 40 / pxToRpx;
        this.$nextTick(() => {
          this.y = Number(this.y2 * 0.6);
          this.x = Number(this.x2);
          this.move.x = this.x;
          this.move.y = this.y;
        })
      }
    })
  },
  computed: {
    borderRadiusStyle() {
      if (this.isTouch) {
        return 'border-radius: 100rpx;'
      }
      if (this.direction === 'right') {
        return 'border-radius: 100rpx 0 0 100rpx;'
      }
      if (this.direction === 'left') {
        return 'border-radius: 0 100rpx 100rpx 0;'
      }
      return ''
    }
  },
  data() {
    return {
      moreSvg,
      moreList: [
        {id: 1, text: '列表', text2: '卡片', value: 'list', img: list, img2: card},
        {id: 3, text: '客服', value: 'kefu', img: kefu},
        {id: 2, text: '须知', value: 'warn', img: warn}
      ],
      isTouch: false,
      showList: false,
      direction: 'right',
      x: 0,
      y: 0,
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
      move: {
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    onMoreClick() {
      const query = uni.createSelectorQuery().in(this);
      const isShow = this.showList
      if (!isShow) this.showList = true
      this.$nextTick(() => {
        query.select('.sidebar-list').boundingClientRect(data => {
          if (isShow) {
            if (this.direction === "right") {
              this.x += data.width
            }
            if (this.direction === "left") {
              this.x = 0
              this.showList = false
              return
            }
            setTimeout(() => {
              this.showList = false
            }, 500)
          } else {
            if (this.direction === "right") {
              this.x -= data.width
            }
            if (this.direction === "left") {
              this.x = 0
            }
          }
        }).exec();
      })
    },
    onItemClick(item) {
      this.$emit('onSidebarItem', item)
    },
    onChange(e) {
      if (e.detail.source === "touch") {
        this.isTouch = true
        this.move.x = e.detail.x;
        this.move.y = e.detail.y;
      }
    },
    onTouchStart() {
      clearTimeout(this.loop)// 再次清空定时器，防止重复注册定时器（会把点击事件也阻止掉）
      this.isTouch = false // 关键
      this.loop = setTimeout(() => {
        this.isTouch = true  // 关键
      }, 600)
    },
    onTouchend() {
      clearTimeout(this.loop) // 清空定时器，防止重复注册定时器
      if (!this.isTouch) {
        this.onMoreClick()
        return
      }
      this.showList = false
      this.x = this.move.x;
      this.y = this.move.y;
      setTimeout(() => {
        if (this.move.x < this.x2 / 2) {
          this.x = this.x1;
          this.direction = 'left'
        } else {
          this.x = this.x2;
          this.direction = 'right'
        }
        this.isTouch = false
      }, 100)
    }
  }
}
</script>

<style lang="scss">
.movableArea {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素
  z-index: 999;
}

.sidebar {
  pointer-events: auto; //可以点击
  height: 100rpx;
  width: max-content;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2rpx 4rpx 12rpx 4rpx rgba(0, 0, 0, 0.04);

  &-more {
    margin: 0 10rpx;
    width: 80rpx;
    height: 80rpx;

    image {
      width: 80rpx;
      height: 80rpx;
    }
  }

  .left-list {
    flex-direction: row-reverse;
  }

  &-list {
    padding: 0 10rpx;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .left-item {
      margin-right: 0;
      margin-left: 26rpx;
    }

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
</style>