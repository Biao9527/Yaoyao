<template>
  <view class="tables">
    <NavBar title="标签"/>
    <view class="tables-list">
      <uni-swipe-action>
        <uni-swipe-action-item v-for="(item) in getMyTableList" :key="item.id"
                               :right-options="options"
                               @click="bindClick"
                               @change="swipeChange($event, item)">
          <view class="tables-list-item">
            <uni-icons custom-prefix="iconfont" :type="item.icon" size="88rpx"/>
            <view class="tables-list-item-text">{{item.name}}</view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
    <view class="tables-add"
          @click="onAddTableClick">
      <uni-icons type="plus-filled" size="60" color="#4cd964"/>
    </view>
    <CustomTabBar :active-index="2"/>
  </view>
</template>

<script>
import CustomTabBar from '../../../components/custom-tab-bar'
import NavBar from "../../../components/nav-bar";
import {navigateToPage} from "../../../helpers/navigateTo";
import {mapState,mapGetters} from 'vuex'

export default {
    components: {
      CustomTabBar,
      NavBar
    },
  computed: {
    ...mapState({
      tableList: state => state.tables.tableList
    }),
    ...mapGetters([
      'getMyTableList'
    ])
  },
  data() {
    return {
      options:[
        {
          text: '取消',
          style: {
            backgroundColor: '#007aff'
          }
        }, {
          text: '确认',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ]
    };
  },
  methods: {
      onAddTableClick() {
        navigateToPage('createTable')
      },
    bindClick(e){
      console.log('点击了'+(e.position === 'left' ? '左侧' : '右侧') + e.content.text + '按钮')
    },
    swipeChange(e,index){
      console.log('当前状态：'+ e +'，下标：' + index)
    }
  }
}
</script>

<style lang="scss">
@import "../../../static/icons/iconfont.css";
.tables {
  position: relative;

  .tables-list {
    margin-top: 16rpx;
    background: #FFFFFF;

    &-item {
      display: flex;
      margin-left: 26rpx;
      height: 120rpx;
      background: #FFFFFF;
      align-items: center;
      border-bottom: 1rpx solid #f2f2f2;

      &-text {
        margin-left: 44rpx;
        font-size: 32rpx;
        color: #030303;
      }
    }
  }

  &-add {
    position: fixed;
    bottom: 200rpx;
    left: calc(50% - 30px);
  }
}
</style>
