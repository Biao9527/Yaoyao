<template>
  <page-meta :page-style="'background:#FFFFFF'"/>
  <view>
    <NavBar title="编辑资料" left-icon="left"/>
    <view class="update-user-header"/>
    <view class="update-user">
      <button class="update-user-avatar"
              open-type='chooseAvatar'
              @chooseavatar="onChooseAvatar">
        <image mode="aspectFill" :src="avatar"/>
      </button>

      <view class="update-user-content">
        <view class="update-user-title">个人资料</view>

        <view class='update-user-input'>
          <view class='update-user-input-title'>昵称</view>
          <view class='update-user-input-content'>
            <input class='update-user-input-value'
                   type='nickname'
                   maxlength='10'
                   placeholder='请填写'
                   placeholder-class='update-user-input-placeholder'
                   :value='nickName'
                   @input="onNickNameChange"/>
            <uni-icons type="right" size="40rpx" color="#c7c7cc"/>
          </view>
        </view>

        <picker :range="genderList"
                range-key="text"
                :value="gender ? gender - 1 : 0"
                @change="onGenderChange">
          <view class='update-user-input'>
            <view class='update-user-input-title'>性别</view>
            <view class='update-user-input-content'>
              <view class="update-user-input-text"
                    :class="gender ? 'active' : ''">
                {{ genderText }}
              </view>
              <uni-icons type="right" size="40rpx" color="#c7c7cc"/>
            </view>
          </view>
        </picker>

        <view class='update-user-textarea'>
          <view class='update-user-input-title'>个性签名</view>
          <view class='update-user-textarea-content'>
             <textarea class="update-user-textarea-value"
                       placeholder-class="update-user-textarea-placeholder"
                       :value="personalize"
                       type="textarea"
                       placeholder="你还没有填写个性签名~"
                       :maxlength="50"
                       :show-confirm-bar="false"
                       @input="onPersonalizeInput"/>
          </view>
        </view>

        <view class="update-user-submit"
              :style="buttonDisabled"
              @click="onSubmitClick">
          保存
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "../../../../components/nav-bar";
import {getWxOpenId, uploadImage} from "../../../../helpers";

export default {
  components: {
    NavBar
  },
  onLoad() {
    this.loadUserInfo()
  },
  computed: {
    genderText() {
      const genderHash = {
        1: '男',
        2: '女'
      }
      return this.gender ? genderHash[this.gender] : '请选择'
    },
    buttonDisabled() {
      return this.gender && this.nickName && this.avatar ? '' : 'background: rgba(0,181,24,0.4)'
    }
  },
  data() {
    return {
      avatar: null,
      nickName: null,
      gender: null,
      personalize: null,
      genderList: [{text: '男', value: 1}, {text: '女', value: 2}],
      userInfo: null
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
            this.avatar = res.result.avatarUrl
            this.nickName = res.result.nickName
            this.gender = res.result.gender
            this.personalize = res.result.personalize
          } else {
            this.showToast('获取用户资料失败！')
          }
        },
        fail: () => {
          this.showToast('获取用户资料失败！')
        }
      })
    },
    onNickNameChange(value) {
      this.nickName = value.detail.value
    },
    onGenderChange(value) {
      this.gender = this.genderList[value.detail.value].value
    },
    onPersonalizeInput(e) {
      this.personalize = e.detail.value
    },
    onChooseAvatar(value) {
      this.avatar = value.detail.avatarUrl
    },
    onSubmitClick() {
      if (!this.avatar) {
        this.showToast('请上传头像')
        return;
      }
      if (!this.nickName) {
        this.showToast('请填写昵称')
        return
      }
      if (this.gender === null) {
        this.showToast('请选择性别')
        return;
      }
      this.updateUserInfo()
    },
    async updateUserInfo() {
      const wx_openid = getWxOpenId()
      if (!wx_openid) {
        return
      }
      if (this.userInfo.avatarUrl !== this.avatar) {
        uni.showLoading({
          title: '正在上传图片...',
          mask: true
        });
        const url = await uploadImage(this.avatar)
        if (!url) {
          return
        }
        this.avatar = url.fileID
      }
      uni.showLoading({
        title: '正在保存资料...',
        mask: true
      })
      uniCloud.callFunction({
        name: 'user',
        data: {
          action: 'update',
          _id: this.userInfo._id,
          info: {
            nickName: this.nickName,
            avatarUrl: this.avatar,
            gender: this.gender,
            personalize: this.personalize
          }
        },
        success: (res) => {
          if (res.result.status === 200) {
            this.loadUserInfo()
            this.showToast('保存成功')
          } else {
            this.showToast('保存失败！')
          }
        },
        fail: () => {
          this.showToast('保存失败！')
        }
      })
    },
    showToast(title) {
      uni.showToast({
        title: title,
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.update-user-header {
  background: #F6F6F6;
  height: 200rpx;
}

.update-user {
  background: #FFFFFF;
  position: relative;

  &-avatar {
    padding: 0;
    position: absolute;
    left: calc(50% - 76rpx);
    top: -76rpx;
    overflow: hidden;
    background: #FFFFFF;
    width: 152rpx;
    height: 152rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 144rpx;
      height: 144rpx;
      border-radius: 50%;
    }
  }

  button::after {
    border: none;
  }

  &-content {
    padding: 160rpx 0;
  }

  &-title {
    margin-left: 38rpx;
    font-size: 34rpx;
    color: #000000;
    font-weight: bold;
    margin-bottom: 16rpx;
  }

  &-textarea {
    border-top: 1rpx solid #f2f2f2;
    padding: 32rpx 38rpx;

    &-content {
      margin-top: 16rpx;
      height: 220rpx;
      background: #F6F6F6;
      border-radius: 13rpx;
      padding: 26rpx;
    }

    &-value {
      width: 100%;
      height: 100%;
    }

    &-placeholder {
      font-size: 30rpx;
      color: #D6D6D6
    }
  }

  &-input {
    margin-left: 38rpx;
    padding: 32rpx 0;
    border-top: 1rpx solid #f2f2f2;
    display: flex;
    justify-content: space-between;

    &-title {
      font-size: 30rpx;
      color: #131C38;
    }

    &-text {
      margin-right: 12rpx;
      color: #DCDCDC;
    }

    .active {
      color: #454C63;
    }

    &-content {
      height: 100%;
      color: #DCDCDC;
      font-size: 30rpx;
      margin-right: 40rpx;
      display: flex;
      align-items: center;
    }

    &-placeholder {
      text-align: right;
      font-size: 30rpx;
      color: #DCDCDC;
    }

    &-value {
      margin-right: 12rpx;
      color: #131C38;
      text-align: right;
    }
  }

  &-submit {
    height: 84rpx;
    background: #00B518;
    border-radius: 100rpx;
    font-size: 36rpx;
    color: #FFFFFF;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 90rpx 38rpx 0;
  }
}
</style>