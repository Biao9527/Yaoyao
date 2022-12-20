<template>
  <view class="create-table">
    <NavBar title="创建标签" left-icon="left"/>
    <RecommendTables :selected-index.sync="selectedIndex"/>
  </view>
</template>

<script>
import NavBar from "../../../../components/nav-bar";
import RecommendTables from "../components/recommend-tables/recommend-tables";
export default {
  components: {
    NavBar,
    RecommendTables
  },
  data() {
    return {
      selectedIndex: 0
    }
  }
}
</script>

<style lang="scss">
@import "../../../../static/icons/iconfont.css";
page {
  background: #FFFFFF;
}
.create-table {


}
</style>
