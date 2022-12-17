<template>
	<view>
    <uni-nav-bar title="user" :border="false" :statusBar="true"/>
  <CustomTabBar :active-index="3"/>
	</view>
</template>

<script>
import CustomTabBar from '../../../components/custom-tab-bar'

	export default {
    components: {
      CustomTabBar
    },
		data() {
			return {
				
			};
		},
    onShow: function () {
    }
	}
</script>

<style lang="scss">

</style>
