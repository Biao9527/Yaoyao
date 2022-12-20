<template>
  <view class="create-table">
    <NavBar title="创建标签" left-icon="left"/>
    <view @click="createTable">
      新建标签
    </view>
    <RecommendTables :selected-index.sync="selectedIndex"/>
    <CreateTableModal :is-opened.sync="isOpenedAddModal"
                      :table-icon.sync="tableIcon"
                      :table-name.sync="tableName"
                      :onConfirm="onConfirm"/>
  </view>
</template>

<script>
import NavBar from "../../../../components/nav-bar";
import RecommendTables from "../components/recommend-tables/recommend-tables";
import CreateTableModal from "../components/create-table-modal/create-table-modal";
export default {
  components: {
    NavBar,
    RecommendTables,
    CreateTableModal
  },
  data() {
    return {
      isOpenedAddModal: false,
      selectedIndex: 0,
      tableIcon: '',
      tableName: ''
    }
  },
  methods: {
    createTable() {
      this.isOpenedAddModal = true
    },
    onConfirm() {
      this.isOpenedAddModal = false
      console.log(this.tableIcon, this.tableName);
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
