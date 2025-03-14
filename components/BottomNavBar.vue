<template>
  <view class="nav-bar">
    <view
      class="nav-item"
      v-for="(item, index) in navItems"
      :key="index"
      @tap="switchTab(index)"
    >
      <image
        :src="currentTab === index ? item.activeIcon : item.icon"
        mode="aspectFit"
        class="nav-icon"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BottomNavBar',
  props: {
    currentTab: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      navItems: [
        {
          icon: '/static/tabBar/find.png',
          activeIcon: '/static/tabBar/click_find.png',
          name: '发现',
          page: "/pages/discover/index"
        },
        {
          icon: '/static/tabBar/mate.png',
          activeIcon: '/static/tabBar/click_mate.png',
          name: '匹配',
          page: "/pages/mate/index"
        },
        {
          icon: '/static/tabBar/group.png',
          activeIcon: '/static/tabBar/click_group.png',
          name: '活动',
          page: "/pages/group/index"
        },
        {
          icon: '/static/tabBar/message.png',
          activeIcon: '/static/tabBar/click_message.png',
          name: '消息',
          page: "/pages/message/index"
        },
        {
          icon: '/static/tabBar/user.png',
          activeIcon: '/static/tabBar/click_user.png',
          name: '我的',
          page: "/pages/user/index"
        }
      ]
    }
  },
  methods: {
    switchTab(index) {
      // 跳转到对应页面
      const path = this.navItems[index]
      console.log(path)
      uni.switchTab({
        url: path.page
      })
    }
  }
}
</script>

<style lang="scss">
.nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);
  .nav-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .nav-icon {
      width: 56rpx;
      height: 56rpx;
    }
  }
}
</style>
