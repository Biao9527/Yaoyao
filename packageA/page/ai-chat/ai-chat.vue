<template>
  <view>
    <NavBar title="AI聊天" left-icon="left"/>
    <ChatList :chat-list="chatList"
              :user-info="userInfo"/>
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
import {getWxOpenId} from "../../../helpers";

export default {
  components: {
    NavBar,
    SendBox,
    ChatList
  },
  onLoad() {
    this.loadUserInfo()
  },
  onUnload() {
    this.closeSSEChannel()
  },
  computed: {
    ...mapState([
      'operationHeight'
    ]),
  },
  data() {
    return {
      chatList: [{role: 'assistant', content: '你好，有什么问题都可以向我提问。'}],
      loading: false,
      userInfo: null,
      channel: null,
      messageText: ''
    }
  },
  methods: {
    loadUserInfo() {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      uniCloud.callFunction({
        name: 'user',
        data: {
          action: 'getUser',
          open_id: wx_openid
        },
        success: (res) => {
          if (res.result) {
            this.userInfo = res.result
          } else {
            this.showToast('获取用户资料失败！')
          }
        },
        fail: () => {
          this.showToast('获取用户资料失败！')
        }
      })
    },
    showToast(title) {
      uni.showToast({
        title,
        icon: 'none'
      })
    },
    onSendMessage(value) {
      this.chatList.push({role: 'user', content: value})
      this.onLoadAIChat(value)
    },
    async onLoadAIChat() {
      const that = this
      if (this.channel) {
        this.closeSSEChannel()
      }
      this.channel = new uniCloud.SSEChannel() // 创建消息通道
      this.channel.on('message', (message) => { // 监听message事件
        that.addChatList(message)
      })
      this.channel.on('end', (message) => { // 监听end事件，如果云端执行end时传了message，会在客户端end事件内收到传递的消息
        that.messageText = ''
        that.loading = false
      })
      await this.channel.open() // 等待通道开启

      this.loading = true
      this.chatList.push({role: 'assistant', content: '正在思考中...'})
      this.onScrollToBottom()
      const messages = this.chatList.slice(1, this.chatList.length - 1)
      await uniCloud.callFunction({
        name: "uni-ai",
        data: {
          messages,
          channel: this.channel
        }
      }).then().catch(() => {
        this.chatList.pop()
        this.loading = false
        uni.showToast({
          title: '出现异常，稍后重试！',
          icon: 'none'
        })
      })
    },
    addChatList(message) {
      this.messageText = this.messageText.concat(message)
      this.chatList[this.chatList.length - 1] = {
        role: 'assistant',
        content: this.messageText
      }
      this.onScrollToBottom()
    },
    closeSSEChannel() {
      if (this.channel) {
        this.channel.close()
        this.channel = null
      }
    },
    onScrollToBottom() {
      this.$nextTick(() => {
        uni.pageScrollTo({
          scrollTop: 2000000,
          duration: 0
        })
      })
    }
  }
}
</script>

<style lang="scss">

</style>