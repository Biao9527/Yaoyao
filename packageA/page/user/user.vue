<template>
  <view>
    <NavBar title="我的"/>
    <view class="user">

    </view>
    <CustomTabBar :active-index="4"
                  :operation-height="operationHeight"/>
  </view>
</template>

<script>
import CustomTabBar from "../../../components/custom-tab-bar";
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
    ])
  },
}
</script>

<style lang="scss">

</style>