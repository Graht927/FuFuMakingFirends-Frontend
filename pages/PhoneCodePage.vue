<template>
  <view class="login-container">
    <view class="header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"/>
    </view>
    <view class="content">
      <text class="title">请输入验证码</text>
      <view class="form">
        <tm-password v-model="phoneCode" :code-length="6" :show-val="true" noval="round" model="box"
                     @confirm="enterBtn"></tm-password>
      </view>
    </view>

  </view>
</template>
<script>

import TmPassword from "@/tm-vuetify/components/tm-password/tm-password.vue";
import {sendMsg} from "@/pages/utils/apis/sms/sms";
import {checkPhoneCode, login} from "@/pages/utils/apis/user";

export default {
  components: {
    TmPassword
  },
  data() {
    return {
      phoneCode: '',
      isSend: false,
      phoneNumber: '',
      address: '',
      nickname: '',
      birthday: '',
      type: '',
      isEnter: false
    }
  },
  methods: {
    enterBtn(e) {
      let val = e;
      if (val.length != 6) {
        uni.showToast({
          title: '请正确输入验证码',
          icon: 'none',
          mask: true
        })
        return;
      }
      if (this.isEnter) {
        return;
      }
      const data = {
        phone: this.phoneNumber,
        phoneCode: val
      }
      checkPhoneCode(data, this.type).then(res => {
        if (res.code === 20000) {
          if ("login" === this.type) {
            console.log(this.address)
            login({
              phone: this.phoneNumber,
              phoneCode: this.phoneCode
            }, this.address).then(res => {
              if (res.code === 20000 && res.data) {
                uni.setStorageSync("fufu-app-token", res.data.tokenValue)
                uni.setStorageSync("fufu-app-userId", res.data.loginId)

                uni.showToast({
                  title: '登录成功',
                  icon: 'none',
                  mask: true
                })
                uni.switchTab({
                  url: '/pages/discover/index'
                })
              }else {
                uni.showToast({
                  title: res.msg,
                  icon: 'none',
                  mask: true
                })
                uni.redirectTo({
                  url: '/pages/Login'
                })
              }
            })
          } else {
            //跳转注册密码页面
            uni.navigateTo({
              url: "/pages/RegistryPwdPage?phone=" + this.phoneNumber + "&phoneCode=" + this.phoneCode + "&nickname=" + this.nickname + "&birthday=" + this.birthday
            })
          }
          this.isEnter = true
        } else {
          uni.showToast({
            title: '验证码错误',
            icon: 'none',
            mask: true
          })
          this.isEnter = false
        }
        this.phoneCode = ''
      })
    }
  },
  onLoad(e) {
    let that = this
    uni.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        that.address = latitude + "," + longitude
      },
      fail: (err) => {
        console.error('获取位置失败:', err);
      }
    });

    let phoneNumber = e.phone;
    let birthday = e.birthday;
    let type = e.t
    this.phoneNumber = phoneNumber
    this.nickname = e.nickname
    this.type = type
    const templateCode = () => {
      return this.type === 'login' ? 'login' : 'register'
    }
    if (!this.isSend) {
      sendMsg({
        phone: phoneNumber,
        templateCodeStr: templateCode()
      }).then(res => {
        this.isSend = true
      })
    }
    uni.showToast({
      title: '验证码已发送 注意查收',
      icon: 'none',
      mask: true
    })
  },
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
  padding-top: 30rpx;
}

.title {
  font-size: 28px;
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
  margin-top: 6rem;
  width: 40vw;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 48rpx;
  background-image: linear-gradient(90deg, #51f5f5, #FFC0CB);
  color: #ffffff;
  font-size: 16px;
}

.other-login {
  margin-top: 160rpx;
}

.divider {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 20rpx;
}

.social-icons {
  display: flex;
  justify-content: center;
  margin-top: 60rpx;
}

.icon-item {
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
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

.text-grey-darken-3 {
  color: white !important;

}

.grey-darken-3 {
  background-color: #d0cfcf !important;
}

</style>
