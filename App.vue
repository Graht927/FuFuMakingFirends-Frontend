<script>
export default {
  onLaunch: function () {
    const configStyle = 'dark'
    uni.setStorageSync('configStyle', configStyle)
  },
  onShow: function () {
    console.log('App Show')
    let item = uni.getStorageSync("fufu-app-token");
    console.log(item)
    if (!item){
      uni.redirectTo({
        url: 'pages/Login'
      })
    }
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import "./tm-vuetify/mian.min.css";
@import "./tm-vuetify/scss/theme.css";

.uni-app--showtabbar uni-page-wrapper:after {
  height: 80rpx;
  height: calc(80rpx + constant(safe-area-inset-bottom));
  height: calc(80rpx + env(safe-area-inset-bottom));
}

  .uni-tabbar { // tab 背景
    background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%) !important;
    .uni-tabbar-border { // tabBar 上边框
      background-color: #e54d42 !important; // tabBar 上边框的颜色
    }

    .uni-tabbar__bd { // tabBar 单项
      height: 80px !important;

      .uni-tabbar__icon { // tabBar 图标
        width: 40px !important;
        height: 40px !important;
      }

      .uni-tabbar__label { // tabBar 文字
        font-size: 14px !important;
      }
    }
  }
  .uni-tabbar ~ .uni-placeholder {
    height: 80rpx;
  }
</style>
