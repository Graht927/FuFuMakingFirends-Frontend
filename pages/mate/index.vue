<template>
  <view class="discover">
    <!-- 顶部状态栏 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 标题栏 -->
    <view class="header">
      <text class="title">MATE</text>
      <view class="indicators">
        <view class="dot"></view>
        <view class="line"></view>
      </view>
    </view>

    <view class="content">
      <!-- 匹配中心 -->
    </view>

    <BottomNavBar :current-tab="1"/>

  </view>
</template>

<script>
import GCard from '@/components/GCard.vue'
import BottomNavBar from '@/components/BottomNavBar.vue'
import GWaterFall from "@/components/GWaterFall.vue";

export default {
  components: {
    GWaterFall,
    GCard,
    BottomNavBar
  },
  data() {
    return {
      currentTab: 0,
      statusBarHeight: 0
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
  },
  computed: {},
  mounted() {

  },
  watch: {
    scrollTop() {
      this.onBottom()
    }
  },
  methods: {
     switchTab(index) {
      this.currentTab = index;
    },
    onBottom() {
      console.log("触底逻辑")
      if (!this.isLoading) {
        this.isLoading = true
        console.log('触底了')
        //todo 触底逻辑
        this.getItemList(15, false)
        this.isLoading = false
        setTimeout(() => {
          this.isLoadingOver = true
        }, 1000)
      }
    },
    onReachBottom() {
      console.log("触底了")
      if (!this.isLoading) {
        console.log(this.systemInfo.clientHeight + this.scrollTop >= this.systemInfo.scrollHeight)
        console.log(this.systemInfo.clientHeight)
        console.log(this.scrollTop)
        console.log(this.systemInfo.scrollHeight)
        if (this.systemInfo.clientHeight + this.scrollTop >= this.systemInfo.scrollHeight) {
          this.isLoading = true
          console.log('触底了')
          //todo触底逻辑
          console.log("触底逻辑")
          this.getItemList(15, false)
          this.isLoading = false
          setTimeout(() => {
            this.isLoadingOver = true
          }, 1000)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.discover {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%);

  .header {
    padding: 20rpx 30rpx;
    display: flex;
    flex-direction: column;

    .title {
      color: #ffffff;
      font-size: 44rpx;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      letter-spacing: 2px;
      font-weight: 500;
    }

    .indicators {
      margin-top: 8rpx;
      display: flex;
      align-items: center;
      gap: 8rpx;
      margin-left: 2rpx;

      .dot {
        width: 8rpx;
        height: 8rpx;
        background-color: #ffffff;
        border-radius: 50%;
      }

      .line {
        width: 24rpx;
        height: 6rpx;
        background-color: #ffffff;
        border-radius: 4rpx;
      }
    }
  }

  .content {
    margin: 20rpx auto 2vh;
    width: 100%;

    .banner-swiper {
      width: 100%;
      margin: auto;
      height: 360rpx;
      border-radius: 20rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }

      :deep(.uni-swiper-dots) {
        bottom: 20rpx;
      }
    }
  }

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

  .publish-btn {
    position: fixed;
    right: 40rpx;
    top: 65vh;
    width: 110rpx;
    height: 110rpx;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(10px);
    touch-action: none;

    .inner-circle {
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #7F7FD5, #86A8E7, #91EAE4);
      display: flex;
      align-items: center;
      justify-content: center;

      .plus-icon {
        position: relative;
        width: 40rpx;
        height: 40rpx;

        &::before,
        &::after {
          content: '';
          position: absolute;
          background-color: #ffffff;
        }

        &::before {
          width: 40rpx;
          height: 4rpx;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }

        &::after {
          width: 4rpx;
          height: 40rpx;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }
      }
    }
  }
}

.waterfall {
  &-container {
    margin: auto;
    width: 92%;
  }

  &-content {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }

  &-items {
    width: 100%;
    height: 80vh;
    margin: auto;
    position: relative;
  }

  &-item {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
  }
}
</style>
