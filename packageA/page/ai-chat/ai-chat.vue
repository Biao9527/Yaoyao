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
import {BING_IMAGE_URL, CARTOON_IMAGE_URL, getWxOpenId} from "../../../helpers";

export default {
  components: {
    NavBar,
    SendBox,
    ChatList
  },
  onLoad() {
    this.loadUserInfo()
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
    onSendMessage(value) {
      this.chatList.push({role: 'user', content: value})
      this.onLoadAIChat(value)
    },
    async onLoadAIChat() {
      this.loading = true
      this.chatList.push({role: 'assistant', content: '正在思考中...'})
      this.onScrollToBottom()
      const messages = this.chatList.slice(1, this.chatList.length - 1)
      await uniCloud.callFunction({
        name: "uni-ai",
        data: {
          messages,
        }
      }).then(res => {
        this.chatList[this.chatList.length - 1] = {role: 'assistant', content: res.result.reply}
        this.loading = false
        this.onScrollToBottom()
      }).catch(() => {
        this.chatList.pop()
        this.loading = false
        uni.showToast({
          title: '出现异常，稍后重试！',
          icon: 'none'
        })
      })
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