<template>
  <view class="discover">
    <!-- 顶部状态栏 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 标题栏 -->
    <view class="header">
      <text class="title">DISCOVER</text>
      <view class="indicators">
        <view class="dot"></view>
        <view class="line"></view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content"
                 scroll-y="true"
                 :refresher-enabled="true"
                 :refresher-triggered="isRefreshing"
                 @refresherrefresh="onRefresh">
              <!-- 轮播图 -->
      <view class="banner-container">
              <swiper class="banner-swiper"
                      circular
                      autoplay
                      interval="3000"
                      duration="500"
                      indicator-dots
                      indicator-color="rgba(255, 255, 255, 0.3)"
                      indicator-active-color="#ffffff">
                <swiper-item v-for="(banner, index) in banners" :key="index">
                  <image :src="banner.image" mode="aspectFill"></image>
                </swiper-item>
              </swiper>
            </view>

      <!-- 瀑布流区域 -->
      <discover-water-fall
          :list="list"
          @likeClick="handleItemClick"
          ref="waterfall"/>
          
      <!-- 加载更多提示 -->
      <view class="loading-more" v-if="isLoading">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else-if="!hasMore && list.length > 0">
        <text>没有更多了</text>
      </view>
    </scroll-view>

    <BottomNavBar :current-tab="0"/>
  </view>
</template>

<style lang="scss">
.discover {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%);
  display: flex;
  flex-direction: column;

  .status-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: #1E1E1E;
  }

  .header {
    position: fixed;
    top: var(--status-bar-height);
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 20rpx 30rpx;
    background: #1E1E1E;

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
    flex: 1;
    margin-top: calc(var(--status-bar-height) + 88rpx);
    height: calc(100vh - var(--status-bar-height) - 88rpx - 100rpx);
    padding-bottom: 10vh;

    .banner-container {
      padding: 20rpx;

    .banner-swiper {
        width: 100%;
      height: 360rpx;
      border-radius: 20rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
      }
    }
  }

  .loading-more, .no-more {
    text-align: center;
    padding: 20rpx 0;
    color: #999;
    font-size: 24rpx;
  }
}
</style>

<script>
import BottomNavBar from '@/components/BottomNavBar.vue'
import DiscoverWaterFall from '@/components/DiscoverWaterFall.vue'
import {BASEURL} from "@/pages/utils/apiconf/image-api";
import {queueDraw} from "@/uni_modules/uv-qrcode/components/uv-qrcode/queue";
import {getDiscover} from "@/pages/utils/apis/search/discover";
import {addThumbsUp, deleteThumbsUp} from "@/pages/utils/apis/socializing/thumbsUp";

export default {
  components: {
    BottomNavBar,
    DiscoverWaterFall
  },
  data() {
    return {
      statusBarHeight: 0,
      buttonPosition: {top: 500, left: 0},
      startTouch: {x: 0, y: 0},
      screenWidth: 0,
      screenHeight: 0,
      isLoggedIn: false,
      list: [],
      pageNum: 1,
      pageSize: 8,
      hasMore: true,
      isRefreshing: false,
      isLoading: false,
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
      BASEURL: BASEURL
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    this.screenWidth = systemInfo.windowWidth;
    this.screenHeight = systemInfo.windowHeight;
    this.buttonPosition = {
      top: 500,
      left: this.screenWidth - 60
    };
    this.isLoggedIn = uni.getStorageSync('fufu-app-userId') !== null;
    // 首次加载数据
    this.loadMore();
  },
  // 添加触底加载生命周期函数
  onReachBottom() {
    console.log('触发触底加载');
    console.log('hasMore:', this.hasMore);
    console.log('isLoading:', this.isLoading);
    console.log('当前页码:', this.pageNum);
    console.log('当前列表长度:', this.list.length);

    if (!this.hasMore || this.isLoading) {
      console.log('不满足加载条件，返回');
      return;
    }

    this.isLoading = true;
    this.loadMore().finally(() => {
      this.isLoading = false;
    });
  },
  methods: {
    async onRefresh() {
      this.isRefreshing = true;
      this.pageNum = 1;
      this.hasMore = true;
      try {
        await this.loadMore();
      } finally {
        this.isRefreshing = false;
      }
    },
    async loadMore() {
      try {
        const res = await this.fetchList();
        console.log('获取到的原始数据:', res);
        if (res.code === 20000) {
          const newList = res.data || [];
          console.log('处理前的列表数据:', newList);
          // 处理数据格式
          const formattedList = newList.map(item => {
            if (item.model === 'group') {
              return {
                ...item,
                id: item.id,
                size: 30,
                image: this.BASEURL + item.teamImage,
                model: "group",
                title: item.name,
                distance: item.address,
                userAvatars: (item.teamUserInfos || []).slice(0, 3).map(avatar => this.BASEURL + avatar.avatarUrl),
                userCount: item.maxNum,
                currentCount: item.currentNum,
                group: {
                  ...item,
                  coverImage: this.BASEURL + item.teamImage
                }
              };
            } else {
              return {
                ...item,
                id: item.id,
                size: 36,
                image: this.BASEURL + item.image,
                model: "dynamic",
                title: item.title,
                isLike: item.isLike || false,
                author: {
                  avatar: this.BASEURL + item.author.avatar,
                  name: item.author.nickname
                }
              };
            }
          });
          console.log('格式化后的列表数据:', formattedList);

          if (this.pageNum === 1) {
            this.list = formattedList;
          } else {
            this.list = [...this.list, ...formattedList];
          }
          console.log('更新后的完整列表:', this.list);
          this.hasMore = formattedList.length !== 0;
          this.pageNum++;
          
          // 强制更新瀑布流组件
          this.$nextTick(() => {
            if (this.$refs.waterfall) {
              this.$refs.waterfall.distributeItems(this.list);
            }
          });
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    },
    async fetchList() {
      try {
        const res = await getDiscover({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        });
        console.log('API返回数据:', res);
        return res;
      } catch (error) {
        console.error('API请求失败:', error);
        throw error;
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
      const maxLeft = this.screenWidth - 60;
      const maxTop = this.screenHeight - 60;
      this.buttonPosition.left = Math.max(0, Math.min(newLeft, maxLeft));
      this.buttonPosition.top = Math.max(0, Math.min(newTop, maxTop));
    },
    onTouchEnd() {
      uni.navigateTo({
        url: '/pages/createDynamic/createDynamic'
      });
    },
    async handleItemClick(item) {
      if (!this.isLoggedIn) {
        this.goToLogin();
        return;
      }

      // 立即更新UI状态
      const index = this.list.findIndex(i => i.id === item.id);
      if (index !== -1) {
        // 先更新本地状态，实现即时反馈
        this.list[index].isLike = !this.list[index].isLike;

        try {
          // 在后台异步处理点赞/取消点赞请求
          if (this.list[index].isLike) {
            await addThumbsUp({
              userId: uni.getStorageSync('fufu-app-userId'),
              dynamicId: item.id
            });
          } else {
            await deleteThumbsUp({
              userId: uni.getStorageSync('fufu-app-userId'),
              dynamicId: item.id
            });
          }
        } catch (error) {
          console.error('点赞操作失败:', error);
          // 如果请求失败，回滚状态
          this.list[index].isLike = !this.list[index].isLike;
          uni.showToast({
            title: '操作失败',
            icon: 'none'
          });
        }
      }
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/Login'
      });
    },
  }
}
</script>
