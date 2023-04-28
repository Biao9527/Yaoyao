<template>
  <view>
    <NavBar title="AI聊天" left-icon="left"/>
    <view>
    </view>
    <SendBox :operation-height="operationHeight"/>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import SendBox from "./components/send-box/send-box";
import {mapState} from 'vuex'

export default {
  components: {
    NavBar,
    SendBox
  },
  computed: {
    ...mapState([
      'operationHeight'
    ]),
  }
}
</script>

<style lang="scss">

</style>