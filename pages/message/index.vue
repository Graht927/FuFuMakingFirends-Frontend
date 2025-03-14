<template>
  <view class="discover">
    <!-- 顶部状态栏 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 标题栏 -->
    <view class="header">
      <text class="title">MESSAGE</text>
      <view class="indicators">
        <view class="dot"></view>
        <view class="line"></view>
      </view>
    </view>

    消息中心


    <BottomNavBar :current-tab="3"/>

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
      gap: 12,
      column: 2,
      loading: false,
      isfinish: false,
      itemWidth: 0,
      itemList: [],
      contentRef: null,
      columnHeight: [],
      ItemPos: [],
      scrollTop: 0,
      isLoading: false,
      isLoadingOver: false,
      testW: null,
      waterfallContentWidth: null,
      statusBarHeight: 0,
      currentTab: 0,
      buttonPosition: {top: 500, left: 0},
      startTouch: {x: 0, y: 0},
      screenWidth: 0,
      screenHeight: 0,
      systemInfo: uni.getSystemInfoSync(),
      banners: [
        {
          image: '/static/banner/banner1.jpg',
          title: 'Banner 1'
        },
        {
          image: '/static/banner/banner2.jpg',
          title: 'Banner 2'
        },
        {
          image: '/static/banner/banner3.jpg',
          title: 'Banner 3'
        }
      ],
      // cardList: [
      //   {
      //     avatarUrl: '/static/avatars/avatar1.jpg',
      //     title: 'OT十人局',
      //     description: '距离5.2km | 在线播放',
      //     userAvatar: '/static/avatars/user1.jpg',
      //     userName: 'OT | 嗨野格的小姐姐',
      //     likes: '315'
      //   },
      //   {
      //     avatarUrl: '/static/avatars/avatar2.jpg',
      //     title: '音乐分享',
      //     description: '来听听我的歌',
      //     userAvatar: '/static/avatars/user2.jpg',
      //     userName: 'Fyuan方圆',
      //     likes: '208'
      //   }
      // ]
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    this.screenWidth = systemInfo.windowWidth;
    this.screenHeight = systemInfo.windowHeight;

    // 设置初始位置在屏幕右侧边缘
    this.buttonPosition = {
      top: 500, // 可以根据需要调整初始的垂直位置
      left: this.screenWidth - 60  // 按钮宽度
    };
  },
  computed: {
  },
  mounted() {
    // 获取系统信息
    console.log(this.systemInfo)
    this.waterfallContentWidth = this.systemInfo.windowWidth - 30
    this.init()
    console.log(this.itemList)
    // 监听滚动
  },
  watch: {
    scrollTop() {
      this.onBottom()
    }
  },
  methods: {
    min() {
      let minIndex = -1, minHeight = Infinity;
      for (let i = 0; i < this.columnHeight.length; i++) {
        const h = this.columnHeight[i]
        if (h < minHeight) {
          minIndex = i
          minHeight = h
        }
      }
      return {minIndex, minHeight}
    },
    getItemList(nums, isFirst) {
      if (!this.isfinish) {
        this.loading = true
        let users = null;
        if (nums === 20) users = this.getData(nums)
        else users = [
        {
          id: 4,
          width: 40,
          height: 32,
          avatarUrl: '/static/avatars/avatar2.jpg',
          title: '音乐分享',
          description: '来听听我的歌'
        },
        {
          id: 5,
          width: 40,
          height: 32,
          avatarUrl: '/static/avatars/avatar2.jpg',
          title: '音乐分享',
          description: '来听听我的歌'
        }]
        const newUsers = users.filter(user => {
          return !this.itemList.some(item => item.id === user.id)
        })

        if (!newUsers.length) {
          this.isfinish = true
          return
        }
        newUsers.forEach((user) => {
          const domWidth = this.systemInfo.windowWidth
          const domHeight = this.systemInfo.windowHeight
          user.width = (user.width / 100) * domWidth
          user.height = (user.height / 100) * domHeight
          console.log(user)
        })
        this.computedItemPosition(newUsers, isFirst)
        this.loading = false
        this.itemList = [...this.itemList, ...newUsers]
      }
    }
    ,
    async init() {
      const that = this
      this.itemWidth = (this.waterfallContentWidth - (this.column - 1) * this.gap) / this.column
      this.getItemList(20, true);
    },
    computedItemPosition(list, isFirst) {
      list.forEach((item, index) => {
        const itemHeight = Math.floor((item.height * this.itemWidth) / item.width)
        if (isFirst && index < this.column) {
          //第一行
          this.ItemPos.push({
            y: 200,
            x: index % this.column !== 0 ? index * this.itemWidth + this.gap * index : index * this.itemWidth,
          })
          this.columnHeight.push(itemHeight + 180 + this.gap)
        } else {
          const {minIndex, minHeight} = this.min();
          this.ItemPos.push({
            x: minIndex % this.column !== 0 ? minIndex * this.itemWidth + this.gap * minIndex : minIndex * this.itemWidth,
            y: minHeight
          });
          this.columnHeight[minIndex] += itemHeight + this.gap;
        }
      })
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
    onTouchStart(e) {
      this.startTouch = {
        x: e.touches[0].pageX - this.buttonPosition.left,
        y: e.touches[0].pageY - this.buttonPosition.top
      };
    },
    onTouchMove(e) {
      const newLeft = e.touches[0].pageX - this.startTouch.x;
      const newTop = e.touches[0].pageY - this.startTouch.y;

      // 限制按钮在屏幕内
      const maxLeft = this.screenWidth - 60; // 按钮宽度
      const maxTop = this.screenHeight - 60; // 按钮高度

      this.buttonPosition.left = Math.max(0, Math.min(newLeft, maxLeft));
      this.buttonPosition.top = Math.max(0, Math.min(newTop, maxTop));
    },
    onTouchEnd() {
      console.log('Touch End');
      // 可以在这里添加其他逻辑
    },
    switchTab(index) {
      this.currentTab = index;
    },
    getData(nums) {
      return [{
        id: 1,
        width: 40,  // 宽度百分比
        height: 32, // 高度百分比
        avatarUrl: '/static/avatars/avatar1.jpg',
        title: 'OT十人局',
        description: '距离5.2km | 在线播放'
      },
        {
          id: 2,
          width: 40,
          height: 32,
          avatarUrl: '/static/avatars/avatar2.jpg',
          title: '音乐分享',
          description: '来听听我的歌'
        },
        {
          id: 3,
          width: 40,
          height: 32,
          avatarUrl: '/static/avatars/avatar2.jpg',
          title: '音乐分享',
          description: '来听听我的歌'
        },
        {
          id: 6,
          width: 40,
          height: 32,
          avatarUrl: '/static/avatars/avatar2.jpg',
          title: '音乐分享',
          description: '来听听我的歌'
        },
        {
          id: 7,
          width: 40,
          height: 32,
          avatarUrl: '/static/avatars/avatar2.jpg',
          title: '音乐分享',
          description: '来听听我的歌'
        }]

    },
    fetchWaterfallData(nums) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 20000,
            data: this.waterfallData
          })
        }, 500)
      })
    }
  }
  , onReachBottom() {
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
    },
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
