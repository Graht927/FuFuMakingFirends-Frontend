<template>
  <view class="page-container">
    <!-- 顶部图片区域 -->
    <view class="header-section">
      <image class="bg-image" :src="eventInfo.bgImage" mode="aspectFill"/>
      <view class="close-btn" @click="back">
        <img src="/static/icon/close.png" style="width: 1rem;height: 1rem;"/>
      </view>
      <view class="event-info">
        <text class="event-time">{{ eventInfo.time }}</text>
        <text class="event-title">{{ eventInfo.title }}</text>
      </view>
    </view>
    <!-- 底部信息区域 -->
    <view class="content-section">
      <view class="location-info">
        <view class="location-left">
          <img src="/static/icon/addr.png" style="width: 1rem;height: 1rem;"/>
          <text class="location-name">{{ eventInfo.location }}</text>
        </view>
        <button class="members-btn">
          <img src="/static/icon/UserCount.png" style="width: 1rem;height: 1rem;"/>
          <text class="members-text">{{ eventInfo.members.current }}/{{ eventInfo.members.total }} 已加入</text>
        </button>
      </view>
      <view class="ticket-info">
        <img src="/static/icon/ticket.png" style="width: 1rem;height: 1rem;"/>
        <text class="ticket-text">{{ eventInfo.ticket }}</text>
      </view>
      <!-- 女神专区 -->
      <view class="member-section">
        <view class="section-header">
          <text class="section-title">{{ eventInfo.goddessSection.title }}</text>
          <text class="member-count">{{ eventInfo.goddessSection.members.current }}/{{ eventInfo.goddessSection.members.total }}</text>
        </view>
        <scroll-view class="avatar-list" scroll-x>
          <view class="avatar-container">
            <image
              v-for="(avatar, index) in eventInfo.goddessSection.avatars.slice(0, maxAvatars)"
              :key="index"
              class="avatar"
              :src="avatar"
              mode="aspectFill"
            />
            <view v-if="eventInfo.goddessSection.members.current === eventInfo.goddessSection.members.total && eventInfo.goddessSection.avatars.length > maxAvatars" class="avatar">
              <image class="avatar" :src="eventInfo.goddessSection.avatars[maxAvatars]" mode="aspectFill"/>
            </view>
            <view v-else class="add-avatar">
              <img src="/static/icon/plus.png" style="width: 2rem;height: 2rem;opacity: 0.5"/>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 男神专区 -->
      <view class="member-section">
        <view class="section-header">
          <text class="section-title">{{ eventInfo.godSection.title }}</text>
          <text class="member-count">{{ eventInfo.godSection.members.current }}/{{ eventInfo.godSection.members.total }}</text>
        </view>
        <scroll-view class="avatar-list" scroll-x>
          <view class="avatar-container">
            <image
              v-for="(avatar, index) in eventInfo.godSection.avatars.slice(0, maxAvatars)"
              :key="index"
              class="avatar"
              :src="avatar"
              mode="aspectFill"
            />
            <view v-if="eventInfo.godSection.members.current === eventInfo.godSection.members.total && eventInfo.godSection.avatars.length > maxAvatars" class="avatar">
              <image :src="eventInfo.godSection.avatars[maxAvatars]" mode="aspectFill"/>
            </view>
            <view v-else class="add-avatar">
              <img src="/static/icon/plus.png" style="width: 2rem;height: 2rem;opacity: 0.5"/>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 底部操作栏 -->
      <view class="bottom-bar">
        <view class="collect-btn">
           <img src="/static/icon/earthstars.png" style="width: 2.2rem;height: 2.2rem;"/>
        </view>
        <view class="price-info">
          <text class="price-label">{{ eventInfo.price.label }}</text>
          <text class="price-value">{{ eventInfo.price.value }}</text>
        </view>
        <view class="signup-btn">
          报名
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      maxAvatars: 4, // 每行最多展示的头像数量
      eventInfo: {},
      groupId: ''
    };
  },
  onLoad(dataId) {
    console.log(dataId);
    this.groupId = dataId;
    this.initData();
  },
  methods: {
    initData() {
      this.eventInfo =
          {
        bgImage: 'https://ai-public.mastergo.com/ai/img_res/85eb2329b4d51dd956a2591848aa5f9d.jpg',
        time: '2021-04-30 周三 22:00-06:00',
        title: 'OT决战到天亮',
        location: 'One Third PH-工体店',
        members: {
          current: 8,
          total: 10
        },
        ticket: '门票 ¥500/人 男生AA',
        goddessSection: {
          title: '女神专区',
          members: {
            current: 5,
            total: 5
          },
          avatars: [
            'https://ai-public.mastergo.com/ai/img_res/be1a6edae83ae246e580180187a77dbb.jpg',
            'https://ai-public.mastergo.com/ai/img_res/87c4005e8d5d3f6222fa080cd5f3fe68.jpg',
            'https://ai-public.mastergo.com/ai/img_res/87c4005e8d5d3f6222fa080cd5f3fe68.jpg',
            'https://ai-public.mastergo.com/ai/img_res/8507d9120b1353995d8696e3f252f95f.jpg',
            'https://ai-public.mastergo.com/ai/img_res/8507d9120b1353995d8696e3f252f95f.jpg',
          ]
        },
        godSection: {
          title: '男神专区',
          members: {
            current: 3,
            total: 5
          },
          avatars: [
            'https://ai-public.mastergo.com/ai/img_res/be1a6edae83ae246e580180187a77dbb.jpg',
            'https://ai-public.mastergo.com/ai/img_res/87c4005e8d5d3f6222fa080cd5f3fe68.jpg',
            'https://ai-public.mastergo.com/ai/img_res/8507d9120b1353995d8696e3f252f95f.jpg',
          ]
        },
        price: {
          label: '此局为男生AA局',
          value: '¥ 500.00 元/人'
        }
      }
    },
    back() {
      uni.switchTab({
        url: '/pages/group/index'
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
}

.event-time {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8rpx;
}

.event-title {
  display: block;
  font-size: 20px;
  color: #fff;
  font-weight: 600;
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

.location-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14rpx;
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
  margin-bottom: 40rpx;
}

.ticket-text {
  font-size: 14px;
  color: #d9d7d7;
}

.member-section {
  margin-bottom: 40rpx;
  border: 2px dashed #666;
  border-radius: 16rpx;
  padding: 24rpx;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  margin-right: 16rpx;
}

.member-count {
  font-size: 14px;
  color: #999;
}

.avatar-list {
  width: 100%;
}

.avatar-container {
  display: flex;
  gap: 24rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
}

.add-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  border: 2px dashed #666;
  display: flex;
  align-items: center;
  justify-content: center;
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
  border-radius:  0 36rpx 36rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}
</style>
