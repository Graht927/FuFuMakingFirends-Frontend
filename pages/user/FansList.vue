<template>
  <view class="member-list-container">
    <!-- 自定义导航栏 -->
    <view class="custom-nav-bar">
      <!-- 左侧返回按钮 -->
      <view class="back-btn" @click="back">
        <img src="/static/icon/back.png" style="width: 1rem;height: 1rem;"/>
      </view>
      <!-- 中间标题 -->
      <text class="nav-title">粉丝列表</text>
    </view>
    <!-- 内容区域 -->
    <scroll-view scroll-y class="content-area">
      <view v-for="(member, index) in members" :key="index" class="member-item">
        <!-- 左侧头像 -->
        <image class="member-avatar" :src="member.avatarUrl" mode="aspectFill"/>
        <!-- 中间昵称和地区 -->
        <view class="member-info">
          <text class="member-name">{{ member.nickname }}</text>
          <text class="member-location">{{ member.addr }}</text>
        </view>
        <!-- 右侧操作按钮 -->
        <view class="member-action" @click="createPrivateSession(member.id)">
          <text class="action-text">私聊</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {getActivityById} from "@/pages/utils/apis/organizeBureau/activity";
import {BASEURL} from "@/pages/utils/apiconf/image-api";
import {getFans, getFocus} from "@/pages/utils/apis/socializing/focus";
import {createSessionP} from "@/pages/utils/apis/socializing/privateChat";

export default {
  data() {
    return {
      groupId: '',
      members: [],
      pageSize: 10,
      pageNum: 1,
      userId: "",
      focusId: ""
    };
  },
  onLoad(dataId) {
    this.userId = uni.getStorageSync('fufu-app-userId');
    this.focusId = this.userId
    this.groupId = dataId.id;
    this.fetchMembers();
  },
  methods: {
    async createPrivateSession(uid) {
      console.log(uid)
      const data = {
        userId1: this.userId,
        userId2: uid
      }
      const res = createSessionP(data);
      if (res.code === 20000){
        uni.switchTab({
          url: '/pages/message/index'
        })
      }
    },
    async fetchMembers() {
      const res = await getFans({
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        userId: this.userId,
        focusId: this.focusId
      });
      if (res.code === 20000) {
        this.members = res.data.map(user => ({
          avatarUrl: BASEURL + user.avatarUrl,
          nickname: user.nickname,
          addr: user.addr,
          id:user.id
        }));
        this.pageNum++
      }

    },
    back() {
      uni.navigateBack();
    },
    goUserInfo(userId){
      //todo 跳转到用户详情页面
    }
  }
}
</script>

<style>
page {
  height: 100%;
  background-color: #000; /* 页面背景设置为黑色 */
}

.member-list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #000; /* 容器背景设置为黑色 */
}

/* 自定义导航栏样式 */
.custom-nav-bar {
  display: flex;
  align-items: center;
  padding:50rpx 20rpx 20rpx;
  background-color: #1E1E1E; /* 导航栏背景设置为深灰色 */
  border-bottom: 1rpx solid #333; /* 导航栏底部边框 */
  height: 100rpx; /* 设置导航栏高度 */
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.back-btn {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-title {
  font-size: 1rem;
  color: #fff; /* 导航栏标题文字颜色为白色 */
  margin-left: 20rpx;
  flex: 1; /* 标题占据剩余空间 */
  text-align: center; /* 标题居中 */
}

/* 内容区域样式 */
.content-area {
  width: 96%;
  margin: 0 auto;
  overflow-y: auto; /* 允许内容区域滚动 */
}

.member-item {
  display: flex;
  align-items: center;
  background-color: #1E1E1E; /* 成员项背景设置为深灰色 */
  padding: 20rpx;
  margin-top: 10rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* 左侧头像 */
.member-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx; /* 头像与昵称之间的间距 */
}

/* 中间昵称和地区 */
.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 10rpx; /* 调整上边距 */
}

.member-name {
  font-size: 18px;
  color: #fff; /* 成员名字文字颜色为白色 */
}

.member-location {
  font-size: 14px;
  color: #999; /* 成员地址文字颜色为灰色 */
}

/* 右侧操作按钮 */
.member-action {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 14rpx;
  background-color: #007aff; /* 操作按钮背景设置为蓝色 */
  border-radius: 8rpx;
}

.action-text {
  font-size: 14px;
  color: #fff; /* 操作按钮文字颜色为白色 */
}
</style>
