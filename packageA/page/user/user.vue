<template>
	<view>
    <NavBar title="我的"/>
  <CustomTabBar :active-index="3"
                :operation-height="operationHeight"/>
	</view>
</template>

<script>
import CustomTabBar from '../../../components/custom-tab-bar'
import NavBar from "../../../components/nav-bar";
import {mapState} from 'vuex'

	export default {
    components: {
      CustomTabBar,
      NavBar
    },
    computed: {
      ...mapState([
        'operationHeight'
      ]),
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
