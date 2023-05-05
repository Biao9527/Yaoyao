<template>
  <view>
    <NavBar title="AI聊天" left-icon="left"/>
    <ChatList :chat-list="chatList"/>
    <SendBox :operation-height="operationHeight"
             :disabled="loading"
             @onSend="onSendMessage"/>
  </view>
</template>

<script>
import NavBar from "../../../components/nav-bar";
import SendBox from "./components/send-box/send-box";
import ChatList from "./components/chat-list/chat-list";
import {mapState} from 'vuex'

export default {
  components: {
    NavBar,
    SendBox,
    ChatList
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
      this.chatList.push({role: 'user', content: value})
      this.onLoadAIChat(value)
    },
    async onLoadAIChat() {
      this.loading = true
      this.chatList.push({role: 'assistant', content: '正在思考中。。。'})
      const messages = this.chatList.slice(0,this.chatList.length - 1)
      await uniCloud.callFunction({
        name: "uni-ai",
        data: {
          messages,
        }
      }).then(res => {
        this.chatList[this.chatList.length - 1] = {role: 'assistant', content: res.result.reply}
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">

</style>