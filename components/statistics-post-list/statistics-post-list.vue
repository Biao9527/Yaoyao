<template>
  <view class="statistics-list">
    <view class="statistics-list-item"
          v-for="(items, index) in list"
          :key="index">
      <view class="statistics-list-header">
        <view class="statistics-list-title">
          <uni-dateformat :date="items.date" :format="beautifyDate(items.date)"/>
        </view>
        <view class="statistics-list-total">
          <view v-if="type === 0 || type === 2">
            收入：+{{ countMoney(items.list).payIn }}
          </view>
          <view v-if="type === 0 || type === 1">
            支出：-{{ countMoney(items.list).payOut }}
          </view>
        </view>
      </view>
      <PostList :list="items.list"
                :table-list="tableList"
                @onTable="onTableClick"/>
    </view>
    <view class="statistics-list-none">
      - 没有更多 -
    </view>
  </view>
</template>

<script>
import PostList from "../post-list/post-list";

export default {
  props: ['list', 'type', 'tableList', 'onTable'],
  components: {
    PostList
  },
  computed: {
    countMoney() {
      return (list) => {
        let payIn = 0
        let payOut = 0
        list.map(item => {
          if (item.type === '+') {
            payIn += Number(item.money)
          }
          if (item.type === '-') {
            payOut += Number(item.money)
          }
        })
        return {payIn: Number(payIn.toFixed(2)), payOut: Number(payOut.toFixed(2))}
      }
    },
    beautifyDate() {
      return (date) => {
        const weekHash = {
          0: '日',
          1: '一',
          2: '二',
          3: '三',
          4: '四',
          5: '五',
          6: '六'
        }
        const nowDate = new Date()
        const oldDate = new Date(date)
        if (nowDate.getFullYear() !== oldDate.getFullYear()) {
          return 'yyyy年M月d日'
        }
        if (nowDate.getDate() === oldDate.getDate()) {
          return 'M月d日 (今天)'
        }
        if (oldDate.getDate() === nowDate.getDate() - 1) {
          return 'M月d日 (昨天)'
        }
        if (oldDate.getDate() === nowDate.getDate() - 2) {
          return 'M月d日 (前天)'
        }
        return `M月d日 (星期${weekHash[oldDate.getDay()]})`
      }
    }
  },
  methods: {
    onTableClick(id) {
      this.$emit('onTable', id)
    }
  }
}
</script>

<style lang="scss">
.statistics-list {

  &-item {
    margin: 16rpx;
    border-radius: 16rpx;
    overflow: hidden;
  }

  &-header {
    padding: 0 26rpx;
    background: #c8c7cc;
    height: 110rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #FFFFFF;
    font-weight: bold;
  }

  &-title {
    font-size: 32rpx;
  }

  &-total {
    font-size: 24rpx;
  }

  &-none {
    height: 140rpx;
    text-align: center;
    font-size: 26rpx;
    color: #bbbbbb;
  }
}
</style>