<template>
  <view class="login-container">
    <view class="header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"/>
    </view>
    <view class="content">
      <text class="title">注册账号</text>
      <view class="form">
        <view class="input-group">
          <uni-icons type="person" size="20" color="#ffffff"/>
          <input
              class="input"
              maxlength="8"
              placeholder="请输入用户名称"
              placeholder-style="color: rgba(255,255,255,0.5)"
              :value="nickname"
              @input="handleInputNikeName"
          />
        </view>
        <view class="input-group">
          <uni-icons type="person" size="20" color="#ffffff"/>
          <input
              class="input"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              placeholder-style="color: rgba(255,255,255,0.5)"
              :value="phoneNumber"
              @input="handleInput"
          />
        </view>
        <view class="input-group">

          <tm-calendar black @confirm="commitCalendar">
            <view style="display: flex">
              <uni-icons type="person" size="20" color="#ffffff"/>
              <input style="padding-left: 0.5rem"
                  class="input"
                  type="date"
                  placeholder="请选择生日"
                     disabled="true"
                  placeholder-style="color: rgba(255,255,255,0.5)"
                  :value="birthday"
                  @click="selectDate"
              />
            </view>
          </tm-calendar>
        </view>
        <button :disabled="ifClick" class="login-btn" @click="handleGetCode">获取验证码</button>
      </view>
      <view class="footer">
        <text class="register" @click="toLogin()">已有账号？立即登录</text>
      </view>
    </view>
  </view>
</template>
<script>

import TmCalendar from "@/tm-vuetify/components/tm-calendar/tm-calendar.vue";

export default {
  components: {TmCalendar},
  data() {
    return {
      phoneNumber: '',
      ifClick: true,
      phoneQueue: [],
      nickname: '',
      birthday: ''
    }
  },
  onLoad() {

  },
  methods: {
    toLogin() {
      uni.redirectTo({
        url: '/pages/Login'
      })
    },
    handleGetCode() {
      // 1. 检查手机号是否为空
      if (!this.phoneNumber) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (!this.nickname) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (this.nickname.length < 3 || this.nickname.length > 8) {
        uni.showToast({
          title: '用户名 3~8位',
          icon: 'none',
          duration: 2000
        });
        return;
      }


      // 2. 正则表达式校验手机号格式
      const phoneRegex = /^(13[0-9]|14[5-9]|15[0-9]|166|17[0-8]|18[0-9]|19[8-9])\d{8}$/; // 以1开头，第二位为3-9，后面9位数字
      if (!phoneRegex.test(this.phoneNumber)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 3. 检查手机号是否在队列中
      const phoneEntry = this.phoneQueue.find(entry => entry.phone === this.phoneNumber);
      if (phoneEntry) {
        uni.showToast({
          title: '请稍后再试',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 4. 手机号验证通过，跳转到验证码页面
      uni.navigateTo({
        url: `/pages/PhoneCodePage?phone=${this.phoneNumber}` + "&t=register&nickname=" + this.nickname + "&birthday=" + this.birthday
      });

      // 设置60秒倒计时
      let countdown = 60;
      this.ifClick = true;

      const timer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(timer);
          this.ifClick = false;
          // 从队列中移除第一个元素
          if (this.phoneQueue.length > 0) {
            this.phoneQueue.shift();
          }
        }
      }, 1000);

      // 将手机号和计时器添加到队列中
      this.phoneQueue.push({phone: this.phoneNumber, timer});
    },
    // 处理输入事件，过滤非数字字符
    handleInput(event) {
      const newValue = event.target.value.replace(/\D/g, ''); // 只保留数字
      this.phoneNumber = newValue;
      event.target.value = newValue;
    },
    handleInputNikeName(event) {
      this.nickname = event.detail.value.trim();
    },
    commitCalendar(event) {
        this.birthday = event.year + '-' + event.month + '-' + event.day;
    }
  },
  watch: {
    phoneNumber(newVal) {
      // 只保留数字
      this.phoneNumber = newVal.replace(/\D/g, '');
      if (newVal.length !== 11 || this.phoneQueue.some(entry => entry.phone === newVal)) {
        this.ifClick = true;
      } else {
        this.ifClick = false;
      }
    }
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
  padding-top: 30rpx;
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
</style>
