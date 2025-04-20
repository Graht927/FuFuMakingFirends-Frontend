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

    <view class="message">
      <scroll-view class="message-list" scroll-y>
        <uni-swipe-action>
          <uni-swipe-action-item
              v-for="(item, index) in messageList"
              :key="index"
              :right-options="options"
              @click="handleClick($event, item, index)"
          >
            <view class="message-item" @click="handleClickItme(item)">
              <view class="avatar">
                <image :src="item.avatarUrl" mode="aspectFill"></image>
                <view v-if="item.unread" class="unread-badge"></view>
              </view>
              <view class="content">
                <view class="top-line">
                  <text class="name">{{ item.name }}</text>
                  <text class="time">{{ item.lastMessageTime }}</text>
                </view>
                <text class="preview">{{ item.lastMessageContent }}</text>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </scroll-view>
    </view>

    <BottomNavBar :current-tab="3"/>
  </view>
</template>


<script>
import GCard from '@/components/GCard.vue'
import BottomNavBar from '@/components/BottomNavBar.vue'
import GWaterFall from "@/components/GWaterFall.vue";
import {getUserAllGroupChat} from "@/pages/utils/apis/socializing/groupChat";
import {getUserAllChat} from "@/pages/utils/apis/socializing/privateChat";
import {BASEURL} from "@/pages/utils/apiconf/image-api";

export default {
  components: {
    GWaterFall,
    GCard,
    BottomNavBar,
  },
  data() {
    return {
      statusBarHeight: 0,
      screenWidth: 0,
      screenHeight: 0,
      systemInfo: uni.getSystemInfoSync(),
      messageList: [],
      timer: null,
      options: [
        {
          text: '删除',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ]
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    this.screenWidth = systemInfo.windowWidth;
    this.screenHeight = systemInfo.windowHeight;
  },
  computed: {},
  onShow() {
    const userId = uni.getStorageSync("fufu-app-userId");
      if (!userId) {
        uni.redirectTo({
          url: '/pages/Login'
        });
      }
    this.getNewMsg()
    this.timer = setInterval(() => {
      this.getNewMsg()
    }, 10000)
  },
  mounted() {
    this.getNewMsg()
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    async getNewMsg() {
      let res = [{
        avatarUrl: BASEURL + '/2025/03/25/78ae6ff5-6373-48c8-af91-14732d85e827.jpg',
        name: '通知',
        lastMessageTime: '',
        type: 'dynamicNotice'
      }]
      let tempList = res
      tempList = tempList.concat(await this.getData())
      console.log(tempList)
      tempList = tempList.concat(this.messageList).filter((item, index, self) =>
          index === self.findIndex((t) => t.id === item.id)
      )
      console.log(tempList)
      this.messageList = tempList
    },
    handleClickItme(item) {
      if (item.type === 'dynamicNotice') {
        clearInterval(this.timer)
        this.toNoticePage()
      } else {
        clearInterval(this.timer)
        this.toSession(item)
      }
    },
    toSession(item) {
      uni.navigateTo({
        url: '/pages/message/msgInfo?sessionId=' + item.id+"&type="+ item.sessionType
      })
    },
    toNoticePage() {
      clearInterval(this.timer)
      // 可以在这里添加跳转逻辑
      uni.navigateTo({
        url: '/pages/message/NoticePage'
      })
    },
    handleClick(e, item, index) {
      console.log(e)
      if (e.content.text === '删除') {
        uni.showModal({
          title: '提示',
          content: '确定要删除这条消息吗？',
          success: (res) => {
            if (res.confirm) {
              this.deleteMessage(index);
            }
          }
        });
      }
    },
    deleteMessage(index) {
      this.messageList.splice(index, 1);
    },
    async getData() {
      const userId = uni.getStorageSync("fufu-app-userId");
      if (!userId) {
        clearInterval(this.timer)
        uni.redirectTo({
          url: '/pages/Login'
        });
        return []; // 确保返回值类型一致
      }
      let tempList = [];
      try {
        const groupChatRes = await getUserAllGroupChat(userId);
        if (groupChatRes.code === 20000 && groupChatRes.data.length > 0) {
          const newData = groupChatRes.data.map(item => {
            item.avatarUrl = BASEURL + item.avatarUrl;
            if (item.lastMessageTime == null) {
              item.lastMessageTime = '';
            } else {
              // 直接使用格式化后的时间
              var strings = item.lastMessageTime.split("T")[1].split(".")[0].split(":");
              item.lastMessageTime = strings[0] + ":" + strings[1];
            }
            if (item.lastMessageContent == null) {
              item.lastMessageContent = '';
            }
            return item;
          });
          tempList.push(...newData);
        }
        console.log(groupChatRes);
        const chatRes = await getUserAllChat(userId);
        if (chatRes.code === 20000 && chatRes.data.length > 0) {
          const newData = chatRes.data.map(item => {
            item.avatarUrl = BASEURL + item.avatarUrl;
            if (item.lastMessageTime == null) {
              item.lastMessageTime = '';
            } else {
              // 直接使用格式化后的时间
              var strings = item.lastMessageTime.split("T")[1].split(".")[0].split(":");
              item.lastMessageTime = strings[0] + ":" + strings[1];
            }
            if (item.lastMessageContent == null) {
              item.lastMessageContent = '';
            }
            return item;
          });
          tempList.push(...newData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      return tempList;
    }
  },
  onReachBottom() {
    console.log("触底了")
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
}

.message-list {
  flex: 1;
  overflow: auto;
}

.message-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background-color: #151515;
  border-bottom: 1px solid #444444;
}

.avatar {
  position: relative;
  width: 88rpx;
  height: 88rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.avatar image {
  width: 100%;
  height: 100%;
  border-radius: 44rpx;
}

.unread-badge {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: #ff3b30;
  border-radius: 8rpx;
}

.content {
  flex: 1;
  min-width: 0;
}

.top-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.name {
  font-size: 16px;
  font-weight: 500;
  color: white;
}

.time {
  font-size: 12px;
  color: #999999;
}

.preview {
  font-size: 14px;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

