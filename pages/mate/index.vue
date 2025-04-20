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
      <view class="cards-stack">
        <view
            v-for="(profile, index) in profiles"
            :key="profile.id"
            class="profile-container"
            :class="{
              'is-active': currentIndex === index,
              'fade-out': index === currentIndex && isLeaving && moveX < 0,
              'fade-out-right': index === currentIndex && isLeaving && moveX > 0
            }"
            :style="index === currentIndex ? containerStyle : ''"
            @touchstart.stop="index === currentIndex && touchStart($event)"
            @touchmove.stop="index === currentIndex && touchMove($event)"
            @touchend.stop="index === currentIndex && touchEnd()"
        >
          <!-- 喜欢/不喜欢的提示标签 -->
          <view v-if="index === currentIndex" class="action-hint like" :style="{ opacity: rightSwipeProgress }">
            <uni-icons type="heart-filled" size="40" color="#FF69B4"/>
            <text>喜欢</text>
          </view>
          <view v-if="index === currentIndex" class="action-hint dislike" :style="{ opacity: leftSwipeProgress }">
            <uni-icons type="close" size="40" color="#FFFFFF"/>
            <text>不喜欢</text>
          </view>

          <image class="profile-image" :src="profile.image" mode="aspectFill"/>
          <view class="profile-info">
            <view class="user-basic">
              <text class="username">{{ profile.name }}</text>
              <text class="user-meta">{{ profile.gender }} / {{ profile.age }}</text>
            </view>
            <view class="tag-container">
              <uni-tag v-for="(tag, tagIndex) in (profile.tags || []).slice(0, 3)"
                       :key="tagIndex"
                       :text="tag.substring(1,tag.length-1)"
                       size="small"
                       inverted="true"
                       circle="true"
                       type="default"
                       class="profile-tag"/>
            </view>
          </view>
        </view>
      </view>
    </view>
    <BottomNavBar :current-tab="1"/>

  </view>
</template>

<script>
import BottomNavBar from '@/components/BottomNavBar.vue'
import {getMate} from "@/pages/utils/apis/search/mate";
import {BASEURL} from "@/pages/utils/apiconf/image-api";
import {addFocus} from "@/pages/utils/apis/socializing/focus";

export default {
  components: {
    BottomNavBar
  },
  data() {
    return {
      currentTab: 0,
      statusBarHeight: 0,
      profiles: [],
      currentIndex: 0,
      startX: 0,
      moveX: 0,
      leftSwipeProgress: 0,
      rightSwipeProgress: 0,
      isMoving: false,
      isLeaving: false,
      pageNum: 1,
      pageSize: 10,
      hasMore: true,
    };
  },
  computed: {
    containerStyle() {
      const rotation = this.moveX / 20
      return {
        transform: `translateX(${this.moveX}rpx) rotate(${rotation}deg)`,
        transition: this.isMoving ? 'none' : 'all 0.3s ease',
      }
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
  },
  mounted() {
    this.getData()
  },
  watch: {
    profiles: {
      handler(newProfiles) {
        if (newProfiles.length <= 3 && this.hasMore) {
          this.getData()
        }
      },
      deep: true
    }
  },
  methods: {
    async getData() {
      if (!this.hasMore) {
        return;
      }

      const res = await getMate({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })

      if (res.code === 20000) {
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            item.image = BASEURL + item.avatarUrl
            item.name = item.nickname
            item.gender = item.gender === 1 ? '男' : '女'
            item.age = new Date().getFullYear() - item.birthday.split('-')[0]
            item.tags = item.tags.substring(1, item.tags.length - 1).split(',')
          })

          this.profiles = [...this.profiles, ...res.data]
          this.pageNum++

          this.hasMore = res.data.length >= this.pageSize
        } else {
          this.hasMore = false

          if (this.profiles.length === 0) {
            uni.showToast({
              title: '暂无推荐',
              icon: 'none'
            })
          }
        }
      } else {
        uni.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
      }
    },
    touchStart(e) {
      this.startX = e.touches[0].clientX
      this.isMoving = true
    },

    touchMove(e) {
      if (!this.isMoving) return

      const currentX = e.touches[0].clientX
      const moveX = currentX - this.startX
      const maxMove = 150 // 最大移动距离（rpx）

      // 限制移动距离
      this.moveX = Math.min(Math.max(moveX, -maxMove), maxMove)

      // 计算滑动进度
      this.leftSwipeProgress = this.moveX < 0 ? Math.min(Math.abs(this.moveX) / maxMove, 1) : 0
      this.rightSwipeProgress = this.moveX > 0 ? Math.min(this.moveX / maxMove, 1) : 0
    },

    touchEnd() {
      this.isMoving = false
      const threshold = 100 // 触发操作的阈值

      if (Math.abs(this.moveX) > threshold) {
        if (this.moveX > 0) {
          this.handleLike()
        } else {
          this.handleDislike()
        }
      } else {
        this.resetPosition()
      }
    },

    async handleLike() {
      this.moveX = uni.getSystemInfoSync().windowWidth * 2
      this.isMoving = false
      this.isLeaving = true

      // 立即显示关注成功提示
      uni.showToast({
        title: '关注成功',
        icon: 'none'
      })

      // 获取当前用户的 ID 和被关注用户的 ID
      const userId = uni.getStorageSync("fufu-app-userId")
      const focusUserId = this.profiles[this.currentIndex].id

      // 先执行动画和UI更新
      setTimeout(() => {
        // 删除当前卡片
        this.profiles.splice(this.currentIndex, 1)
        this.isLeaving = false

        if (this.profiles.length > 0) {
          if (this.currentIndex >= this.profiles.length) {
            this.currentIndex = 0
          }
        } else if (!this.hasMore) {
          uni.showToast({
            title: '没有更多推荐了',
            icon: 'none'
          })
        }

        // 检查是否需要加载更多数据
        if (this.profiles.length <= 3 && this.hasMore) {
          this.getData()
        }

        // 重置位置状态
        this.$nextTick(() => {
          this.moveX = 0
          this.leftSwipeProgress = 0
          this.rightSwipeProgress = 0
        })
      }, 500)

      // 在后台异步处理关注请求
      addFocus({
        userId: userId,
        focusUserId: focusUserId
      }).catch(error => {
        console.error('关注失败:', error)
      })
    },

    handleDislike() {
      this.moveX = -uni.getSystemInfoSync().windowWidth * 2
      this.isMoving = false
      this.isLeaving = true

      uni.showToast({
        title: '不喜欢',
        icon: 'none'
      })

      setTimeout(() => {
        this.profiles.splice(this.currentIndex, 1)
        this.isLeaving = false

        if (this.profiles.length > 0) {
          if (this.currentIndex >= this.profiles.length) {
            this.currentIndex = 0
          }
        } else if (!this.hasMore) {
          uni.showToast({
            title: '没有更多推荐了',
            icon: 'none'
          })
        }

        if (this.profiles.length <= 3 && this.hasMore) {
          this.getData()
        }

        this.$nextTick(() => {
          this.moveX = 0
          this.leftSwipeProgress = 0
          this.rightSwipeProgress = 0
        })
      }, 500)
    },

    resetPosition() {
      this.moveX = 0;
      this.leftSwipeProgress = 0;
      this.rightSwipeProgress = 0;
      this.isMoving = false;
    },
    // 可以添加加载更多数据的方法
    loadMoreProfiles() {
      this.getData()
    },
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

    .cards-stack {
      position: relative;
      width: 100%;
      height: 74vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .profile-container {
      position: absolute;
      width: 96%;
      max-width: 750rpx;
      opacity: 0;
      visibility: hidden;
      transition: all 0.5s ease;
      left: 50%;
      margin-left: -48%;
      transform: translateX(0) rotate(0deg);

      &.is-active {
        opacity: 1;
        visibility: visible;
        z-index: 2;
        animation: fadeIn 0.5s ease forwards;
      }

      &.fade-out {
        animation: fadeOut 0.5s ease forwards;
      }

      &.fade-out-right {
        animation: fadeOutRight 0.5s ease forwards;
      }

      &:not(.is-active) {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translateX(0) rotate(0deg);
      }
    }

    .card-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70vh;
      perspective: 1000px;
    }

    .card {
      width: 80vw;
      height: 70vh;
      max-width: 600rpx;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 30rpx;
      box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.15);
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1rpx solid rgba(255, 255, 255, 0.2);

      &:active {
        transform: scale(0.98);
      }
    }

    .card-image {
      width: 100%;
      height: 70%;
      overflow: hidden;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60%;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
      }

      .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .card-info {
      padding: 25rpx;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 1));

      .user-name {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10rpx;

        &::after {
          content: '✓';
          font-size: 24rpx;
          background: #4CAF50;
          color: white;
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .user-age {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 20rpx;
        font-weight: 500;
      }

      .user-tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12rpx;
        padding: 0 15rpx;

        .tag {
          font-size: 24rpx;
          color: #fff;
          padding: 8rpx 20rpx;
          border-radius: 20rpx;
          background: linear-gradient(135deg, #86A8E7, #91EAE4);
          box-shadow: 0 2rpx 8rpx rgba(134, 168, 231, 0.3);
          transition: all 0.3s ease;

          &:active {
            transform: scale(0.95);
            box-shadow: 0 1rpx 4rpx rgba(134, 168, 231, 0.2);
          }
        }
      }
    }

    .feedback {
      position: absolute;
      top: 40rpx;
      right: 40rpx;
      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
      padding: 15rpx 30rpx;
      border-radius: 15rpx;
      backdrop-filter: blur(5px);
      transition: all 0.3s ease;
      z-index: 10;

      &:empty {
        display: none;
      }

      .like {
        background: rgba(76, 175, 80, 0.8);
        border: 2rpx solid rgba(255, 255, 255, 0.3);
      }

      .dislike {
        background: rgba(244, 67, 54, 0.8);
        border: 2rpx solid rgba(255, 255, 255, 0.3);
      }
    }

    .swipe-hint {
      position: absolute;
      bottom: 40rpx;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
      text-align: center;

      .arrow {
        font-size: 36rpx;
        animation: bounce 1s infinite;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 10rpx 20rpx;
        border-radius: 10rpx;
        transition: opacity 0.3s ease;
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
}

.page-container {
  height: 100%;
  background-color: #F8F8F8;
  padding: 32rpx;
  box-sizing: border-box;
}

.header {
  display: none;
}

.app-name {
  font-size: 20px;
  color: #FFFFFF;
  font-weight: 600;
}

.language {
  font-size: 14px;
  color: #FFFFFF;
}

.profile-container {
  display: flex;
  flex-direction: column;
  border-radius: 32rpx;
  overflow: hidden;
  width: 96%;
  margin: auto;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  position: relative;
  transform-origin: center center;
}

.profile-image {
  width: 100%;
  height: 940rpx;
  border-top-left-radius: 32rpx;
  border-top-right-radius: 32rpx;
  flex-shrink: 0;
}

.profile-info {
  padding: 32rpx;
  background-color: #313030;
  border-bottom-left-radius: 32rpx;
  border-bottom-right-radius: 32rpx;
}

.user-basic {
  margin-bottom: 20rpx;
}

.username {
  font-size: 24px;
  color: #e7e6e6;
  font-weight: 600;
  display: block;
  margin-bottom: 8rpx;
}

.user-meta {
  font-size: 14px;
  color: #d3d3d3;
}

.tag-container {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.action-hint {
  position: absolute;
  top: 40rpx;
  padding: 20rpx 40rpx;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  z-index: 100;

  text {
    color: #FFFFFF;
    font-size: 28rpx;
    font-weight: bold;
  }

  &.like {
    right: 40rpx;
    background-color: rgba(243, 182, 212, 0.3);
    backdrop-filter: blur(5px);
  }

  &.dislike {
    left: 40rpx;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(5px);
  }
}

.action-buttons {
  display: none;
}

.action-button {
  width: 100rpx;
  height: 100rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-badge {
  display: none;
}

.uni-tag--inverted.data-v-1516016e {
  background-color: #575656 !important;
}

.uni-tag--default--inverted.data-v-1516016e {
  color: floralwhite !important;
  border: none;
}


@keyframes slideOut {
  to {
    transform: translateX(200%) rotate(20deg);
    opacity: 0;
  }
}

@keyframes slideIn {
  from {
    transform: scale(0.9) translateY(20rpx);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateX(0) rotate(0deg);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) rotate(-10deg);
  }
}

@keyframes fadeOutRight {
  from {
    opacity: 1;
    transform: translateX(0) rotate(0deg);
  }
  to {
    opacity: 0;
    transform: translateX(50%) rotate(10deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(50%) rotate(10deg);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotate(0deg);
  }
}
</style>
