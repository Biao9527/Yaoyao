<template>
  <view>
    <uni-nav-bar title="follow" :border="false" :statusBar="true"/>
    <CustomTabBar :active-index="2"/>
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
  }
}
</script>

<style lang="scss">

</style>
