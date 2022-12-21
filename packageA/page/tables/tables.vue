<template>
  <view class="tables">
    <NavBar title="标签"/>
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
    bottom: 200rpx;
    left: calc(50% - 30px);
  }
}
</style>
