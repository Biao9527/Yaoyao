<template>
	<view>
    <NavBar title="我的"/>
  <CustomTabBar :active-index="3"/>
	</view>
</template>

<script>
import CustomTabBar from '../../../components/custom-tab-bar'
import NavBar from "../../../components/nav-bar";

	export default {
    components: {
      CustomTabBar,
      NavBar
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
