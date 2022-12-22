<template>
	<view>
    <NavBar/>
    <view class="content">
    <image class="logo" src="/static/logo.jpg"></image>
		<view class="text-area">
			<text class="title">{{title + value}}</text>
		</view>
    </view>
  <CustomTabBar :active-index="activeIndex"
                :operation-height="operationHeight"/>
	</view>
</template>

<script>
import CustomTabBar from "../../components/custom-tab-bar";
import NavBar from "../../components/nav-bar";
import {mapState} from 'vuex'

	export default {
    computed: {
      ...mapState([
        'operationHeight'
      ]),
    },
		data() {
			return {
				title: 'Hello',
				value: 'Wrold',
        activeIndex: 1
			}
		},
    components: {
      CustomTabBar,
      NavBar
    },
		onLoad() {

		},
    onShareAppMessage(res) {
      if (res.from === 'button') {// 来自页面内分享按钮
      }
      return {
        title: '摇摇晃摇',
        path: '/pages/index/index'
      }
    },
		methods: {
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
    border-radius: 50%;
		height: 200rpx;
		width: 200rpx;
    margin: 200rpx auto 50rpx;
  }

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
