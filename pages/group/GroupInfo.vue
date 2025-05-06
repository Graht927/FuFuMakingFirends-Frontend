<template>
  <view class="page-container">
    <!-- 顶部图片区域 -->
    <view class="header-section">
      <image class="bg-image" :src="eventInfo.bgImage" mode="aspectFill"/>
      <view class="close-btn" @click="back">
        <img src="/static/icon/close.png" style="width: 1rem;height: 1rem;"/>
      </view>
      <view class="event-info">
        <text class="event-title">{{ eventInfo.title }}</text>
        <text class="event-time">{{ eventInfo.time }}</text>
      </view>
    </view>
    <!-- 底部信息区域 -->
    <view class="content-section">
      <!-- 活动信息区域 -->
      <view class="info-section">
        <text class="section-title">活动信息</text>
        <view class="location-info">
          <view class="location-left">
            <img src="/static/icon/addr.png" style="width: 1rem;height: 1rem;"/>
            <text class="location-name">{{ eventInfo.location }}</text>
          </view>
          <button class="members-btn" @click="goToMemberList">
            <img src="/static/icon/UserCount.png" style="width: 1rem;height: 1rem;"/>
            <text class="members-text">{{ eventInfo.members.current }}/{{ eventInfo.members.total }} 已加入</text>
          </button>
        </view>
        <view class="location-info">
          <view class="ticket-info">
            <img src="/static/icon/ticket.png" style="width: 1rem;height: 1rem;"/>
            <text class="ticket-text">{{ eventInfo.ticket }}</text>
          </view>
          <!-- 删除按钮 -->
          <view  @click="handleDelete" v-if="isOwner" style="margin-top: 40rpx;">
            <uni-icons type="trash" size="20" color="#FFFFFF"/>
          </view>
          <!-- 退出按钮 -->
          <view  @click="handleLeave" v-if="hasJoined" style="margin-top: 20rpx;">
            <text class="leave-text">退出队伍</text>
          </view>
        </view>

      </view>
      <!-- 描述区域 -->
      <view class="description-section">
        <text class="section-title">活动描述</text>
        <text class="description-content">{{ eventInfo.description }}</text>
      </view>
      <!-- 队长信息区域 -->
      <view class="leader-section">
        <text class="section-title">队长信息</text>
        <view class="leader-details">
          <image class="leader-avatar" :src="eventInfo.leaderInfo.avatarUrl" mode="aspectFill"/>
          <view class="leader-text">
            <text class="leader-name">{{ eventInfo.leaderInfo.nickname }}</text>
            <text class="leader-location">{{ eventInfo.leaderInfo.addr }}</text>
          </view>
        </view>
      </view>
      <!-- 底部操作栏 -->
      <view class="bottom-bar" v-if="!isJoin">
        <view class="collect-btn">
          <img src="/static/icon/earthstars.png" style="width: 2.2rem;height: 2.2rem;"/>
        </view>
        <view class="price-info">
          <text class="price-label">{{ eventInfo.price.label }}</text>
          <text class="price-value">{{ eventInfo.price.value }}</text>
        </view>
        <view
            class="signup-btn"
            :class="{ 'signup-btn-disabled': isSigningUp }"
            @click="handleSignup"
        >
          {{ isSigningUp ? '申请中...' : '报名' }}
        </view>
      </view>

    </view>
  </view>
</template>

<script>
import {
  deleteActivity,
  getActivityById,
  quitActivity,
  sendJoinActivity,
} from "@/pages/utils/apis/organizeBureau/activity";
import {BASEURL} from "@/pages/utils/apiconf/image-api";


export default {
  data() {
    return {
      eventInfo: {},
      groupId: '',
      hasJoined: false,
      currentUserId: '',
      isSigningUp: false,
      isOwner: false,
      isJoin: false
    };
  },
  onLoad(dataId) {
    console.log(dataId);
    this.groupId = dataId.id;
    this.currentUserId = uni.getStorageSync("fufu-app-userId");
    this.initData();
  },
  methods: {
    async initData() {
      const res = await getActivityById(this.groupId);
      console.log(res);

      this.checkUserJoinStatus(res.data);

      this.eventInfo = {
        date: res.data.startTime.split('.')[0].replace('T', ' '),
        bgImage: BASEURL + res.data.teamImage,
        time: this.formatDate(new Date(res.data.startTime)),
        title: res.data.name,
        location: res.data.address,
        members: {
          current: res.data.currentNum,
          total: res.data.maxNum
        },
        ticket: '门票 ¥' + res.data.deposit + '/人',
        description: res.data.description,
        leaderInfo: {
          avatarUrl: BASEURL + res.data.leaderInfo.avatarUrl,
          nickname: res.data.leaderInfo.nickname,
          addr: res.data.leaderInfo.addr
        },
        price: {
          label: '门票信息',
          value: '¥ ' + res.data.deposit + ' 元/人'
        }
      }
    },
    checkUserJoinStatus(activityData) {
      this.isJoin = activityData.teamUserInfos.some(user => user.id === this.currentUserId);
      if (activityData.userId === this.currentUserId) {
        this.isOwner = true;
        return;
      }
      if (activityData.teamUserInfos && Array.isArray(activityData.teamUserInfos)) {
        this.hasJoined = activityData.teamUserInfos.some(member => member.id === this.currentUserId);
      }
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    back() {
      uni.navigateBack()
    },
    goToMemberList() {
      uni.navigateTo({
        url: '/pages/group/MemberList?id=' + this.groupId
      })
    },
    async handleSignup() {
      if (this.isSigningUp) {
        return;
      }

      try {
        this.isSigningUp = true;

        const res = await sendJoinActivity({
          teamId: this.groupId,
          userId: this.currentUserId
        });

        if (res.code === 20000) {
          // 显示成功提示
          uni.showToast({
            title: '申请已提交',
            icon: 'success',
            duration: 2000
          });

          // 更新当前页面状态
          this.hasJoined = true;
          await this.initData();

          // 方法1：设置全局刷新标记
          getApp().globalData.needRefreshGroupList = true;

          // 方法2：发送事件通知
          uni.$emit('updateGroupList');

          // 返回上一页并确保数据刷新
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/group/index',
              success: () => {
                // 获取当前页面栈
                const pages = getCurrentPages();
                // 获取上一个页面实例
                const prevPage = pages[pages.length - 2];
                if (prevPage && prevPage.$vm) {
                  // 调用上一页的刷新方法
                  prevPage.$vm.initData && prevPage.$vm.initData();
                }
              }
            });
          }, 1500); // 延迟1.5秒后返回，让用户看到成功提示

        } else {
          throw new Error(res.message || '申请失败');
        }
      } catch (error) {
        uni.showToast({
          title: error.message || '申请失败，请稍后重试',
          icon: 'none',
          duration: 2000
        });
      } finally {
        this.isSigningUp = false;
      }
    },
    async handleDelete() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该活动吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '删除中...'
            });

            try {
              const res = await deleteActivity(this.groupId); // 假设你有一个删除活动的 API
              if (res.code === 20000) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                // 返回上一页
                uni.navigateBack({
                  delta: 1,
                  success: () => {
                    const pages = getCurrentPages();
                    const prevPage = pages[pages.length - 1];
                    if (prevPage && prevPage.$vm && prevPage.$vm.getGroupData()) {
                      // 重置页码为1并重新加载数据
                      prevPage.$vm.pageCount = 1;
                      prevPage.$vm.getGroupData();
                    }
                  }
                });
              } else {
                throw new Error(res.message || '删除失败');
              }
            } catch (error) {
              uni.showToast({
                title: error.message || '删除失败',
                icon: 'none'
              });
            } finally {
              uni.hideLoading();
            }
          }
        }
      });
    },
    async handleLeave() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出该队伍吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '退出中...'
            });

            try {
              const res = await quitActivity({ // 假设你有一个退出活动的 API
                teamId: this.groupId,
                userId: this.currentUserId
              });
              if (res.code === 20000) {
                uni.showToast({
                  title: '已成功退出',
                  icon: 'success'
                });
                uni.navigateBack({
                  delta: 1,
                  success: () => {
                    const pages = getCurrentPages();
                    const prevPage = pages[pages.length - 1];
                    if (prevPage && prevPage.$vm && prevPage.$vm.getJoinedGroupData()) {
                      // 重置页码为1并重新加载数据
                      prevPage.$vm.pageCount = 1;
                      prevPage.$vm.getJoinedGroupData();
                    }
                  }
                });
                // 更新当前页面状态
                this.hasJoined = false;
                await this.initData(); // 重新加载数据
              } else {
                throw new Error(res.message || '退出失败');
              }
            } catch (error) {
              uni.showToast({
                title: error.message || '退出失败',
                icon: 'none'
              });
            } finally {
              uni.hideLoading();
            }
          }
        }
      });
    }
  }
}
</script>

<style>
page {
  height: 100%;
}

.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #000;
  position: relative;
}

.header-section {
  position: relative;
  height: 50%;
  flex-shrink: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
}

.bg-image.loading {
  opacity: 0;
}

.close-btn {
  position: fixed;
  top: 40px;
  left: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  z-index: 1000;
}

.event-info {
  position: absolute;
  bottom: 40rpx;
  left: 32rpx;
  right: 32rpx;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 16rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease;
}

.event-info:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.event-title {
  display: block;
  font-size: 20px;
  color: #fff;
  font-weight: 600;
}

.event-time {
  display: block;
  font-size: 14px;
  color: #fff;
  margin-top: 8rpx;
}

.content-section {
  flex: 1;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 32rpx 32rpx 0 0;
  margin-top: -32rpx;
  padding: 32rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
}

.info-section,
.description-section,
.leader-section {
  margin-bottom: 40rpx;
}

.section-title {
  display: block;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.location-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.location-left {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.location-name {
  font-size: 14px;
  color: #fff;
}

.members-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  padding: 4rpx 41.6rpx;
  border: none;
  height: 62.4rpx;
  margin-right: -16rpx;
}

.members-text {
  font-size: 11px;
  color: #fff;
}

.ticket-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 24rpx;
}

.ticket-text {
  font-size: 14px;
  color: #d9d7d7;
}

.description-content {
  display: block;
  font-size: 14px;
  color: #b9b9b9;
}

.leader-details {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.leader-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.leader-text {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.leader-name {
  font-size: 14px;
  color: #fff;
}

.leader-location {
  font-size: 12px;
  color: #b9b9b9;
}

.bottom-bar {
  position: fixed;
  bottom: 3rem;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 25px;
  width: 86%;
  margin: auto;
  padding: 16rpx 32rpx;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.collect-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.price-info {
  width: 60%;
  padding-left: 20%;
}

.price-label {
  display: block;
  font-size: 12px;
  color: #b9b9b9;
}

.price-value {
  display: block;
  font-size: 14px;
  color: #fff;
  font-weight: 600;
}

.signup-btn {
  width: 40%;
  height: 72rpx;
  background-image: linear-gradient(90deg, #51f5f5, #FFC0CB);
  font-size: 16px;
  border-radius: 0 36rpx 36rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  transition: all 0.3s ease;
}

.signup-btn-disabled {
  opacity: 0.7;
  background-image: linear-gradient(90deg, #a8e6e6, #ffd7df);
  pointer-events: none;
}

.signup-btn:active {
  transform: scale(0.95);
}

.delete-btn {
  position: fixed;
  top: 40px;
  right: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  z-index: 1000;
}

.leave-btn {
  position: fixed;
  top: 40px;
  right: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  z-index: 1000;
}

.leave-text {
  font-size: 14px;
  color: #fff;
}
</style>
