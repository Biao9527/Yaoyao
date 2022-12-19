<template>
  <view class="tables">
    <uni-nav-bar title="标签" :border="false" :statusBar="true"/>
    <view class="tables-add"
          @click="onAddTableClick">
      <uni-icons type="plus-filled" size="60" color="#4cd964"/>
    </view>
    <CustomTabBar :active-index="2"/>
  </view>
</template>

<script>
import CustomTabBar from '../../../components/custom-tab-bar'
import {navigateToPage} from "../../../helpers/navigateTo";

export default {
    components: {
      CustomTabBar
    },
  data() {
    return {

    };
  },
  methods: {
      onAddTableClick() {
        navigateToPage('createTable')
      }
  }
}
</script>

<style lang="scss">
.tables {
  position: relative;

  &-add {
    position: fixed;
    bottom: 118rpx;
    left: calc(50% - 30px);
  }
}
</style>
