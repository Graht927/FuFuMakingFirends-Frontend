<template>
  <view class="discover">
    <!-- 顶部状态栏 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 标题栏 -->
    <view class="header">
      <text class="title" @click="goBack()">{{ back }}</text>
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
            <view class="message-item" style="height: 5.5rem" v-if="item.type == 'focus'">
              <view class="avatar">
                <image :src="item.avatarUrl" mode="aspectFill"></image>
              </view>
              <view class="content">
                <view class="top-line">
                  <text class="name">{{ item.nickname }}</text>
                </view>
                <text class="preview">{{ item.content }}</text>
              </view>
            </view>
            <view class="thumbs_message-item" style="height: 6.5rem" v-if="item.type == 'thumbsUp'">
              <view class="avatar">
                <image :src="item.avatarUrl" mode="aspectFill"></image>
              </view>
              <view class="content" style="display: flex;justify-content: space-around">
                <view style="align-items: center;margin-left: -2rem">
                  <view class="top-line" style="margin-top: 1.5rem">
                    <text class="name">{{ item.nickname }}</text>
                  </view>
                  <text class="preview">{{ item.content }}</text>
                </view>
                <view @click="toDynamicInfoPage(item.dynamicId)">
                  <image :src="item.coverImage" style="width: 4.8rem;height: 5.6rem;margin: 0.3rem -1rem 0.3rem 0.1rem;border-radius: 0.4rem;" mode="aspectFill"></image>
                </view>
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
import {getNotice, getNoticeCountPage} from "@/pages/utils/apis/socializing/notice";

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
      pageSize: 20,
      pageNum: 1,
      pageCount: 0,
      back: "<<<",
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
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {

  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    toDynamicInfoPage(did){
      //跳转动态详情页
      alert(did)
    },
    async init() {
      this.getNoticePage()
      var newVar = await this.getData();
      this.messageList = this.messageList.concat(newVar);
      console.log(this.messageList)
    },
    toNoticePage() {
      // 可以在这里添加跳转逻辑
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
      //调用删除接口
    },
    async getNoticePage() {
      const userId = uni.getStorageSync("fufu-app-userId");
      if (!userId) {
        uni.redirectTo({
          url: '/pages/Login'
        });
      }
      getNoticeCountPage(userId, this.pageSize).then(res => {
        if (res.code === 20000) {
          this.pageCount = res.data
        }
      })
    },
    async getData() {
      const userId = uni.getStorageSync("fufu-app-userId");
      if (!userId) {
        uni.redirectTo({
          url: '/pages/Login'
        });
        return []; // 确保返回值类型一致
      }
      let tempList = [];
      const notices = await getNotice(userId, {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      })
      tempList = tempList.concat(notices.data);
      tempList.map(item => {
        item.avatarUrl = BASEURL + item.avatarUrl;
        if (item.type=='thumbsUp') {
          item.coverImage = BASEURL + item.coverImage;
        }
      })
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
  padding-left: 1.5rem;
  background-color: #151515;
  border-bottom: 1px solid #444444;
}
.thumbs_message-item {
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
  background-color: #151515;
  border-bottom: 1px solid #444444;
}

.avatar {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  margin-right: 30rpx;
  flex-shrink: 0;
}
.thumbs_message-item .avatar {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  margin-right: 30rpx;
  flex-shrink: 0;
}

.avatar image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
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

