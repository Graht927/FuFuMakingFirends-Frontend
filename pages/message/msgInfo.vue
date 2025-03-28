<template>
  <view class="chat-container">
    <!-- 顶部导航栏 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="nav-bar">
      <view class="back-btn" @click="handleBack">
        <text class="back-icon">&#x2190;</text>
      </view>
      <view class="title">{{ chatTitle }}</view>
    </view>

    <!-- 聊天消息列表 -->
    <scroll-view
        class="chat-list"
        scroll-y="true"
        :scroll-top="scrollTop"
        :scroll-with-animation="true"
        :refresher-enabled="hasMore"
        :refresher-triggered="isLoading"
        refresher-default-style="none"
        @refresherrefresh="onRefresh"
    >
      <!-- 加载状态 -->
      <view class="loading" v-if="isLoading">
        <text>加载中...</text>
      </view>

      <!-- 消息列表 -->
      <view
          v-for="(message, index) in messages"
          :key="index"
          :class="['message-item', message.isSelf ? 'message-self' : 'message-other']"
      >
        <image class="avatar" :src="message.senderAvatar" mode="aspectFill"/>
        <view class="message-content">
          {{ message.message }}
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入栏 -->
    <view class="input-bar">
      <!--      <view class="input-left">
              <uni-icons type="mic-filled" size="24" color="#666"></uni-icons>
            </view>-->
      <view class="input-center">
        <uni-icons type="emotion" size="24" color="#666" style="margin-right: 20rpx;"></uni-icons>
        <input
            style="color: white"
            :value="inputMessage"
            placeholder="请输入消息..."
            @input="handleInput"
            @confirm="sendMessage"
            confirm-type="send"
        />
      </view>
      <view class="input-right" v-if="!enter">
        <uni-icons type="camera-filled" size="24" color="#666"></uni-icons>
      </view>
      <view class="input-right" @click="sendMessage">
        <uni-icons type="paperplane-filled" size="24" color="#666"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
import {getUserInfoByUId} from "@/pages/utils/apis/user";
import {BASEURL} from "@/pages/utils/apiconf/image-api";
import {getMessageList, getSessionInfo} from "@/pages/utils/apis/socializing/privateChat";
import {host} from "@/pages/utils/apiconf";
import {getMessageSessionAll, getSession} from "@/pages/utils/apis/socializing/groupChat";

export default {
  data() {
    return {
      statusBarHeight: 0,
      chatTitle: '聊天',
      inputMessage: '',
      scrollTop: 0,
      messages: [],
      channelId: '',
      socketTask: null, // WebSocket 实例
      isConnected: false, // 连接状态
      userId: '',// 假设这是用户的 ID，实际应从用户数据中获取
      sessionId: '',
      userInfo: {},
      host: host,
      sessionInfo: {},
      enter: false,
      pageSize: 10,
      pageNum: 1,
      isLoading: false,
      hasMore: true, // 是否还有更多消息
    }
  },
  onLoad(e) {
    // 重置 scrollTop
    this.scrollTop = 0;

    // 从本地获取消息
    this.getMessagesFromLocal();
    this.userId = uni.getStorageSync("fufu-app-userId")
    this.sessionId = e.sessionId
    this.type = e.type
    console.log(e)
    console.log(this.sessionId)
    console.log(this.userId)
    if ("private" === this.type) {
      getSessionInfo(this.sessionId).then(res => {
        if (res.code === 20000) {
          this.sessionInfo = res.data
          console.log(this.userId === res.data.userId1)
          if (this.userId === res.data.userId1) {
            getUserInfoByUId(res.data.userId2).then(res => {
              if (res.code === 20000) {
                this.chatTitle = res.data.nickname
              }
            })
            // 初始加载消息
            const data = {
              pageSize: this.pageSize,
              pageNum: this.pageNum
            }
            getMessageList(this.sessionId, data).then(res => {
              if (res.code === 20000) {
                if (res.data && res.data.length > 0) {
                  var temp = res.data;
                  temp = temp.map(item => ({
                    ...item,
                    senderAvatar: BASEURL + item.senderAvatar
                  }));

                  // 对消息列表进行反序
                  temp = temp.reverse();

                  // 将反序后的消息添加到现有消息列表
                  this.messages = [...this.messages, ...temp];

                  // 保存消息到本地
                  this.saveMessagesToLocal();

                  // 确保在消息渲染完成后滚动到底部
                  this.$nextTick(() => {
                    setTimeout(() => {
                      this.scrollToBottom();
                    }, 100);
                  });

                  // 如果返回的消息数量小于页大小，说明没有更多消息了
                  if (res.data.length < this.pageSize) {
                    this.hasMore = false;
                  }
                }
              }
            })
          }
          if (this.userId === res.data.userId2) {
            getUserInfoByUId(res.data.userId1).then(res => {
              if (res.code === 20000) {
                this.chatTitle = res.data.nickname
              }
            })
            // 初始加载消息
            const data = {
              pageSize: this.pageSize,
              pageNum: this.pageNum
            }
            getMessageList(this.sessionId, data).then(res => {
              if (res.code === 20000) {
                if (res.data && res.data.length > 0) {
                  var temp = res.data;
                  temp = temp.map(item => ({
                    ...item,
                    senderAvatar: BASEURL + item.senderAvatar
                  }));

                  // 对消息列表进行反序
                  temp = temp.reverse();

                  // 将反序后的消息添加到现有消息列表
                  this.messages = [...this.messages, ...temp];

                  // 保存消息到本地
                  this.saveMessagesToLocal();

                  // 确保在消息渲染完成后滚动到底部
                  this.$nextTick(() => {
                    setTimeout(() => {
                      this.scrollToBottom();
                    }, 100);
                  });

                  // 如果返回的消息数量小于页大小，说明没有更多消息了
                  if (res.data.length < this.pageSize) {
                    this.hasMore = false;
                  }
                }
              }
            })
          }
        }
      })
    }
    if ("group" === this.type) {
      getSession(this.sessionId).then(res => {
        if (res.code === 20000) {
          this.sessionInfo = res.data
          this.chatTitle = res.data.name
          // 初始加载消息
          const data = {
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }
          getMessageSessionAll(this.sessionId, data).then(res => {
            if (res.code === 20000) {
              if (res.data && res.data.length > 0) {
                var temp = res.data;
                temp = temp.map(item => ({
                  ...item,
                  senderAvatar: BASEURL + item.senderAvatar
                }));
                temp = temp.reverse();
                this.messages = [...this.messages, ...temp];
                this.saveMessagesToLocal();
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.scrollToBottom();
                  }, 100);
                });
                if (res.data.length < this.pageSize) {
                  this.hasMore = false;
                }
              }
            }
          })
        }
      })
    }
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    var userId = uni.getStorageSync("fufu-app-userId");
    if (!userId) {
      uni.redirectTo({
        url: '/pages/Login'
      })
    } else this.userId = userId
    // 初始化 WebSocket 连接
    this.initWebSocket();
    getUserInfoByUId(userId).then(res => {
      if (res.code === 20000) {
        this.userInfo = res.data
      }
    })

    // 确保在消息渲染完成后滚动到底部
    this.$nextTick(() => {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });
  },
  onUnload() {
    // 页面卸载时关闭 WebSocket 连接
    this.closeWebSocket();

    // 清理本地存储（可选）
    uni.removeStorageSync(`chatMessages_${this.sessionId}`);
  },
  onShow() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });
  },
  methods: {
    // 初始化 WebSocket 连接
    initWebSocket() {
      // 创建 WebSocket 连接，将 userId 作为查询参数
      this.socketTask = uni.connectSocket({
        url: "ws://" + this.host + ":29999/ws", // 将 userId 作为查询参数
        success: (e) => {
          console.log('WebSocket 连接成功', e);
        },
        fail: (err) => {
          console.error('WebSocket 连接失败:', err);
        }
      });
      // 监听 WebSocket 连接打开事件
      this.socketTask.onOpen((e) => {
        this.isConnected = true;
        // 在连接建立后发送在线状态消息
      });

      // 监听 WebSocket 消息事件
      this.socketTask.onMessage((res) => {
        try {
          const message = JSON.parse(res.data);
          if (message.id === "-1") {
            console.log("已经建立连接 channel的id为", message.content)
            this.channelId = message.content;
            this.sendOnlineStatus();
            return
          }
          if (message) {
            console.log(res)
            console.log(message)
            message.senderAvatar = BASEURL + message.senderAvatar
            this.messages.push(message);
            // 滚动到底部
            this.$nextTick(() => {
              setTimeout(() => {
                this.scrollToBottom();
              }, 100);
            });
          } else {
            console.warn('消息格式不正确:', message);
          }
        } catch (error) {
          console.error('解析消息失败:', error);
        }
      });

      // 监听 WebSocket 连接关闭事件
      this.socketTask.onClose(() => {
        this.isConnected = false;
        console.log('WebSocket 连接已关闭');
      });

      // 监听 WebSocket 错误事件
      this.socketTask.onError((err) => {
        console.error('WebSocket 连接错误:', err);
      });
    },

// 发送在线状态消息
    sendOnlineStatus() {
      console.log(this.socketTask)
      if (this.socketTask && this.socketTask.OPEN === 1) { // 1 表示 OPEN
        this.socketTask.send({
          data: "online:" + this.userId + ":" + this.channelId,
          success: (e) => {
            console.log('在线状态消息发送成功', e);
          },
          fail: (err) => {
            console.error('在线状态消息发送失败:', err);
          }
        });
      } else {
        console.warn('WebSocket 连接尚未建立，稍后重试');
      }
    },

// 关闭 WebSocket 连接
    closeWebSocket() {
      if (this.socketTask) {
        this.socketTask.close({
          success: () => {
            console.log('WebSocket 连接已关闭');
          },
          fail: (err) => {
            console.error('关闭 WebSocket 连接失败:', err);
          }
        });
      }
    },
    handleBack() {
      this.closeWebSocket();
      console.log(this.socketTask)
      uni.navigateBack();
    },
    handleInput(event) {
      this.inputMessage = event.target.value;
      this.enter == false ? this.enter = true : null
      if (this.inputMessage.length == 0) this.enter = false
    },

    sendMessage() {
      this.enter = false
      if (!this.inputMessage.trim()) return;

      // 创建新消息
      const msg = this.userId + ":" + 1 + ":" + this.sessionId + ":" + this.inputMessage;
      const newMessage = {
        message: this.inputMessage,
        isSelf: true,
        senderAvatar: BASEURL + this.userInfo.avatarUrl,
      };
      // 添加到消息列表的末尾
      this.messages.push(newMessage);

      // 保存消息到本地
      this.saveMessagesToLocal();

      // 清空输入框
      this.inputMessage = '';

      // 滚动到底部
      this.scrollToBottom();

      // 通过 WebSocket 发送消息
      if (this.isConnected) {
        this.socketTask.send({
          data: msg,
          success: () => {
            console.log('消息发送成功');
          },
          fail: (err) => {
            console.error('消息发送失败:', err);
          }
        });
      } else {
        uni.showToast({
          title: '连接已断开，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.chat-list').boundingClientRect(data => {
          if (data) {
            this.scrollTop = data.height * 2; // 使用一个足够大的值确保滚动到底部
          }
        }).exec();
      });
    },

    async onRefresh() {
      if (!this.hasMore || this.isLoading) {
        uni.stopPullDownRefresh();
        return;
      }

      try {
        this.isLoading = true;
        this.pageNum++; // 更新分页参数

        // 获取当前滚动位置
        const oldScrollHeight = await this.getScrollViewHeight();

        const data = {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        };

        // 获取更多消息
        const res = await getMessageList(this.sessionId, data);
        if (res.code === 20000) {
          if (res.data && res.data.length > 0) {
            // 处理头像URL
            const moreMessages = res.data.map(item => ({
              ...item,
              senderAvatar: BASEURL + item.senderAvatar
            }));

            // 将新消息添加到数组开头
            this.messages = [...moreMessages, ...this.messages];

            // 维持滚动位置
            this.$nextTick(async () => {
              const newScrollHeight = await this.getScrollViewHeight();
              const heightDiff = newScrollHeight - oldScrollHeight;
              this.scrollTop = heightDiff;
            });

            // 如果返回的消息数量小于页大小，说明没有更多消息了
            if (res.data.length < this.pageSize) {
              this.hasMore = false;
              uni.showToast({
                title: '已经到顶了',
                icon: 'none'
              });
            }
          } else {
            this.hasMore = false;
            uni.showToast({
              title: '已经到顶了',
              icon: 'none'
            });
          }
        } else {
          // 处理后端返回的错误
          uni.showToast({
            title: res.message || '加载失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('加载更多消息失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.isLoading = false;
        uni.stopPullDownRefresh();
      }
    },

    // 获取滚动视图高度
    getScrollViewHeight() {
      return new Promise(resolve => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.chat-list').boundingClientRect(data => {
          resolve(data ? data.height : 0);
        }).exec();
      });
    },

    // 保存消息到本地
    saveMessagesToLocal() {
      uni.setStorageSync(`chatMessages_${this.sessionId}`, this.messages);
    },

    // 从本地获取消息
    getMessagesFromLocal() {
      const messages = uni.getStorageSync(`chatMessages_${this.sessionId}`);
      if (messages && messages.length > 0) {
        this.messages = messages;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });
  }
}
</script>

<style lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%);
  overflow: hidden;
}

.status-bar {
  background-color: #1E1E1E;
}

.nav-bar {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #1E1E1E;
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  padding: 10rpx 20rpx;
}

.back-icon {
  font-size: 40rpx;
  color: #ffffff;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
}

.chat-list {
  flex: 1;
  height: calc(100vh - 200rpx);
  position: relative;
  overflow: hidden;
  padding-bottom: 60rpx;
}

.messages-container {
  padding: 40rpx 20rpx 20rpx;
  height: 100%;
  overflow-y: auto;
}

.message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 40rpx;
  padding: 0 3.5%;
}

.message-self {
  flex-direction: row-reverse;

  .message-content {
    background: linear-gradient(135deg, #7F7FD5, #86A8E7, #91EAE4);
    color: #ffffff;
    margin-right: 10rpx;
  }
}

.message-other {
  .message-content {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    margin-left: 10rpx;
  }
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.message-content {
  max-width: 60%;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  word-break: break-all;
}

.input-area {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #1E1E1E;
  border-top: 1rpx solid rgba(255, 255, 255, 0.1);

  input {
    flex: 1;
    height: 70rpx;
    padding: 0 20rpx;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 35rpx;
    font-size: 28rpx;
    color: #ffffff;

    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .send-btn {
    margin-left: 20rpx;
    padding: 0 30rpx;
    height: 70rpx;
    line-height: 70rpx;
    background: linear-gradient(135deg, #7F7FD5, #86A8E7, #91EAE4);
    color: #ffffff;
    border-radius: 35rpx;
    font-size: 28rpx;
  }
}

.input-bar {
  height: 100rpx;
  background-color: #2c2c2c;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  gap: 20rpx;
}

.input-left {
  width: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-center {
  flex: 1;
  height: 72rpx;
  background-color: #3d3d3d;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
}

.input-right {
  width: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  padding: 20rpx;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24rpx;
}
</style>
