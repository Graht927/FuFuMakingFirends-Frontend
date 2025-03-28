<template>
  <view class="login-container">
    <view class="header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"/>
    </view>
    <view class="content">
      <text class="title">设置密码</text>
      <view class="form">
        <view class="input-group">
          <uni-icons type="locked" size="20" color="#ffffff"/>
          <input
              type="password"
              class="input"
              placeholder="请输入密码"
              placeholder-style="color: rgba(255,255,255,0.5)"
              :value="password"
              @input="handlerPwd"
          />
        </view>
        <view class="input-group">
          <uni-icons type="locked" size="20" color="#ffffff"/>
          <input
              type="password"
              class="input"
              placeholder="请再次输入密码"
              placeholder-style="color: rgba(255,255,255,0.5)"
              :value="newPassword"
              @input="handlerNewPwd"
          />
        </view>
        <button class="login-btn" @click="enterBtn">注册</button>
      </view>
    </view>
    <view class="footer">
      <text class="policy">密码由8-16位字母、数字、常见字符组成[各包含一个]</text>
    </view>
  </view>
</template>
<script>
import register from "@/pages/Register.vue";
import {registry} from "@/pages/utils/apis/user";

export default {
  components: {},
  data() {
    return {
      password: '',
      newPassword: '',
      address: '',
      nickname: '',
      phoneCode: '',
      phone: '',
      birthday: ''
    }
  },
  onLoad(e) {
    this.nickname = e.nickname
    this.phoneCode = e.phoneCode
    this.phone = e.phone
    this.birthday = e.birthday
    let that = this
    uni.getLocation({
      type: 'wgs84',
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.address = latitude + "," + longitude
      },
      fail: (err) => {
        console.error('获取位置失败:', err);
      }
    });
  },
  methods: {
    handlerPwd(e) {
      console.log(e)
      this.password = e.detail.value
    },
    handlerNewPwd(e) {
      this.newPassword = e.detail.value
    },
    enterBtn() {
      // 1. 检查手机号是否为空
      if (!this.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (!this.newPassword) {
        uni.showToast({
          title: '请输入二次密码',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (this.password !== this.newPassword) {
        uni.showToast({
          title: '二次密码不一致',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 2. 正则表达式校验手机号格式
      const pwdRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&_.])[A-Za-z\d@$!%*?&_.]{8,16}$/;
      if (!pwdRegex.test(this.password) || !pwdRegex.test(this.newPassword)) {
        uni.showToast({
          title: '请输入正确的密码',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      console.log(this.birthday)
      console.log(new Date(this.birthday))
      const data = {
        phone: this.phone,
        phoneCode: this.phoneCode,
        userPassword: this.password,
        nickname: this.nickname,
        checkPassword: this.newPassword,
        birthday: new Date()
      }
      console.log(data)
      //todo 调用接口
      registry(data,this.address).then(res => {
        if (res.code === 20000) {
          uni.showToast({
            title: '注册成功',
            icon: 'none',
            mask: true
          })
          console.log(res)
          uni.redirectTo({
            url: '/pages/Login'
          })
        }
      })
    },
  }
}
</script>
<style>
page {
  height: 100%;
}

.login-container {
  height: 100%;
  background: linear-gradient(to bottom, #1a1a1a, #2d2d2d);
  display: flex;
  flex-direction: column;
  padding: 0 40rpx;
}

.header {
  margin-top: 10vh;
}

.logo {
  width: 10rem;
  height: 8rem;
}

.language {
  width: 24px;
  height: 24px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 120rpx;
}

.title {
  font-size: 32px;
  color: #ffffff;
  margin-bottom: 80rpx;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.input-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  gap: 20rpx;
}

.input {
  flex: 1;
  height: 44rpx;
  color: #ffffff;
  font-size: 16px;
}

.forget-pwd {
  align-self: flex-end;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.login-btn {
  width: 36vw;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 48rpx;
  background-image: linear-gradient(90deg, #51f5f5, #FFC0CB);
  color: #ffffff;
  font-size: 16px;
  margin-top: 60rpx;
}

.footer {
  padding: 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.register {
  color: #ff6b6b;
  font-size: 14px;
}

.policy {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}
</style>
