<template>
  <view>
    <NavBar title="AI聊天" left-icon="left"/>
    <view v-if="chatList.length > 0">
      <view v-for="item in chatList">
        {{ item.value }}
      </view>
    </view>
    <SendBox :operation-height="operationHeight"
             :disabled="loading"
             @onSend="onSendMessage"/>
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
  },
  data() {
    return {
      chatList: [],
      loading: false
    }
  },
  methods: {
    onSendMessage(value) {
      this.chatList.push({type: 'my', value: value})
      this.onLoadAIChat(value)
    },
    async onLoadAIChat(content) {
      this.loading = true
      await uniCloud.callFunction({
        name: "uni-ai",
        data: {
          messages: [{
            role: 'user',
            content
          }],
        }
      }).then(res => {
        this.chatList.push({type: 'ai', value: res.result.reply})
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">

</style>