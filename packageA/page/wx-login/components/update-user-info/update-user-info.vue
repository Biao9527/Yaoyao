<template>
  <view class='update-user'>
    <view class='update-user-content'>
      <view class='update-user-title'>
        个人资料
      </view>

      <view class='update-user_avatar_box'>
        <button class='update-user_avatar_wrapper'
                open-type='chooseAvatar'
                @chooseavatar="onChooseAvatar">
          <view class='update-user_avatar'>
            <image mode='aspectFill' :src="avatar"/>
          </view>
          <view class='update-user_avatar_text'>请点击上传头像或生成</view>
        </button>
      </view>

      <view class='update-user_input'>
        <view class='update-user_input_title'>昵称</view>
        <view class='update-user_input_content'>
          <input class='update-user_input_value'
                 type='nickname'
                 maxlength='10'
                 placeholder='请填写'
                 placeholder-class='update-user_input_placeholder'
                 :value='nickName'
                 @input="onNickNameChange"/>
          <uni-icons type="right" size="40rpx" color="#c7c7cc"/>
        </view>
      </view>

      <picker :range="genderList"
              range-key="text"
              :value="gender ? gender - 1 : 0"
              @change="onGenderChange">
        <view class='update-user_input'
              :style="'border-bottom: 1rpx solid #f2f2f2'">
          <view class='update-user_input_title'>性别</view>
          <view class='update-user_input_content'>
            <view class="update-user_input_text"
                  :class="gender ? 'active' : ''">
              {{ genderText }}
            </view>
            <uni-icons type="right" size="40rpx" color="#c7c7cc"/>
          </view>
        </view>
      </picker>

      <view class="update-user_button"
            :style="buttonDisabled"
            @click="onSubmitClick">
        注册并登陆
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['onSubmit'],
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
      genderList: [{text: '男', value: 1}, {text: '女', value: 2}]
    }
  },
  methods: {
    onChooseAvatar(value) {
      this.avatar = value.detail.avatarUrl
    },
    onNickNameChange(value) {
      this.nickName = value.detail.value
    },
    onGenderChange(value) {
      this.gender = this.genderList[value.detail.value].value
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
      const userInfo = {
        nickName: this.nickName,
        avatarUrl: this.avatar,
        gender: this.gender
      }
      this.$emit('onSubmit', userInfo)
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

<style lang="scss">
.update-user {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: #FFFFFF;

  &-content {
    margin: 228rpx 26rpx 0;
    background: #FFFFFF;
    box-shadow: 0 0 12rpx 3rpx rgba(223, 223, 223, 0.5);
    border-radius: 42rpx;
    overflow: hidden;
  }

  &-title {
    height: 156rpx;
    padding-left: 28rpx;
    background-image: linear-gradient(-37deg, #EAE9E9 0%, #CCCCCC 100%);
    display: flex;
    align-items: center;
    font-size: 48rpx;
    color: #131C38;
    font-weight: bold;
  }

  &_avatar_box {
    display: flex;
  }

  &_avatar_wrapper {
    padding: 0;
    background: transparent;
    overflow: visible;
    display: flex;
    align-items: center;
    margin: 40rpx 0 56rpx 38rpx;
  }

  &_avatar_wrapper::after {
    border: none;
  }

  &_avatar {
    position: relative;
    background: rgba(0, 0, 0, 0.1);
    width: 124rpx;
    height: 124rpx;
    border-radius: 50%;

    image {
      border-radius: 50%;
      width: 124rpx;
      height: 124rpx;
    }

    &_text {
      margin-left: 30rpx;
      font-size: 24rpx;
      color: #9B9B9B;
      line-height: 38rpx;
    }
  }

  &_input {
    margin-left: 38rpx;
    padding: 32rpx 0;
    border-top: 1rpx solid #f2f2f2;
    display: flex;
    justify-content: space-between;

    &_title {
      font-size: 30rpx;
      color: #131C38;
    }

    &_text {
      margin-right: 5rpx;
      color: #DCDCDC;
    }

    .active {
      color: #454C63;
    }

    &_content {
      color: #DCDCDC;
      font-size: 30rpx;
      margin-right: 40rpx;
      display: flex;
      align-items: center;
    }

    &_value {
      margin-right: 5rpx;
      color: #131C38;
      text-align: right;
    }

    &_placeholder {
      text-align: right;
      font-size: 30rpx;
      color: #DCDCDC;
    }
  }

  &_button {
    height: 84rpx;
    background: #00B518;
    border-radius: 100rpx;
    font-size: 36rpx;
    color: #FFFFFF;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 170rpx 38rpx 164rpx;
  }
}
</style>