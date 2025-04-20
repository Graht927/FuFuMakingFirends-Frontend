<template>
  <view class="dynamic-info">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @click="goBack">
          <uni-icons type="left" size="20" color="#FFFFFF"/>
        </view>
        <text class="title">动态详情</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="main-content"
                 scroll-y="true"
                 @scrolltolower="loadMoreParentComments"
                 :style="{ top: `${statusBarHeight + 88}rpx` }">
      <!-- 作者信息 -->
      <view class="author-section">
        <image :src="dynamicInfo.author.avatar" class="avatar"/>
        <view class="author-info">
          <text class="name">{{ dynamicInfo.author.name }}</text>
          <text class="time">{{ formatTime(dynamicInfo.createTime) }}</text>
        </view>
      </view>

      <!-- 动态内容 -->
      <view class="dynamic-content">
        <text class="title">{{ dynamicInfo.title }}</text>
        <text class="text">{{ dynamicInfo.content }}</text>
        <!-- 图片网格 -->
        <view class="image-grid" :class="[`grid-${dynamicInfo.images.length}`]">
          <image v-for="(img, index) in dynamicInfo.images"
                 :key="index"
                 :src="img"
                 mode="aspectFill"
                 @click="previewImage(index)"/>
        </view>
      </view>

      <!-- 互动信息 -->
      <view class="interaction-bar">
        <view class="interaction-btn like-btn"
              :class="{ active: dynamicInfo.isLiked }"
              @click="handleLike">
          <image :src="dynamicInfo.isLike ? '/static/icon/click_like.png' : '/static/icon/like.png'"
                 mode="aspectFit"/>
          <text>{{ dynamicInfo.likeCount }}</text>
        </view>
        <!-- 删除按钮 -->
        <view class="delete-btn" @click="handleDelete" v-if="isOwner">
          <uni-icons type="trash" size="20" color="#FFFFFF"/>
        </view>
      </view>

      <!-- 评论区 -->
      <view class="comments-section">
        <view class="section-header">
          <text class="title">评论</text>
        </view>

        <!-- 评论列表 -->
        <view class="comment-list">
          <view v-for="comment in comments"
                :key="comment.id"
                class="comment-item">
            <!-- 左侧头像 -->
            <image :src="BASEURL() + comment.avatarUrl"
                   class="avatar"
                   mode="aspectFill"/>

            <!-- 右侧内容区 -->
            <view class="content">
              <!-- 用户信息 -->
              <view class="user-info">
                <text class="nickname">{{ comment.nickname }}</text>
                <text class="time">{{ formatTime(comment.createTime) }}</text>
              </view>

              <!-- 评论内容 -->
              <text class="comment-text">{{ comment.content }}</text>

              <!-- 操作按钮 -->
              <view class="actions">
                <view class="action-btn reply"
                      @click="showReplyInput(comment)">
                  <uni-icons type="chat"
                             size="14"
                             color="rgba(255,255,255,0.6)"/>
                  <text>回复</text>
                </view>

                <!-- 展示子评论数量和展开按钮 -->
                <view v-if="comment.childrenCount > 0"
                      class="action-btn replies"
                      @click="loadReplies(comment)">
                  <text>{{ comment.isExpanded ? '收起' : `${comment.childrenCount}条回复` }}</text>
                  <uni-icons :type="comment.isExpanded ? 'top' : 'bottom'"
                             size="14"
                             color="rgba(255,255,255,0.6)"/>
                </view>
              </view>

              <!-- 子评论列表 -->
              <view v-if="comment.isExpanded && comment.replies"
                    class="replies-list">
                <view v-for="reply in comment.replies"
                      :key="reply.id"
                      class="reply-item">
                  <image :src="BASEURL() + reply.avatarUrl"
                         class="avatar"
                         mode="aspectFill"/>
                  <view class="reply-content">
                    <view class="user-info">
                      <text class="nickname">{{ reply.nickname }}</text>
                      <text class="time">{{ formatTime(reply.createTime) }}</text>
                    </view>
                    <text class="comment-text">{{ reply.content }}</text>
                  </view>
                </view>

                <!-- 加载更多回复 -->
                <view v-if="comment.hasMoreReplies"
                      class="load-more"
                      @click="loadMoreReplies(comment)">
                  查看更多回复
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多评论 -->
        <view v-if="hasMore"
              class="load-more"
              @click="loadMoreComments">
          加载更多评论
        </view>

        <!-- 评论输入框 -->
        <view class="comment-input">
          <input v-model="commentText"
                 :placeholder="replyPlaceholder"
                 :focus="isInputFocused"
                 @focus="onInputFocus"
                 @blur="onInputBlur"/>
          <button :disabled="!commentText.trim()"
                  @click="submitComment">
            发送
          </button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import {deleteDynamic, getDynamicsByUid} from "@/pages/utils/apis/user/dynamic";
import {BASEURL} from "@/pages/utils/apiconf/image-api";
import {addComments, getCommentsByCid, getParentCommentsByCid} from "@/pages/utils/apis/socializing/comments";
import {addThumbsUp, deleteThumbsUp} from "@/pages/utils/apis/socializing/thumbsUp";

export default {
  data() {
    return {
      statusBarHeight: 0,
      dynamicId: '',
      dynamicInfo: {
        id: '',
        author: {
          avatar: '',
          name: ''
        },
        title: '',
        content: '',
        images: [],
        createTime: '',
        isLiked: false,
        likeCount: 0,
        commentCount: 0
      },
      comments: [],
      pageNum: 1,
      pageSize: 10,
      hasMore: true,
      isLoggedIn: false,
      isInputFocused: false,
      commentText: '',
      replyPlaceholder: '说点什么...',
      currentReply: null,
      isOwner: false
    }
  },
  onLoad(options) {
    if (options.id) {
      this.dynamicId = options.id;
      this.getDynamicInfo();
      this.getComments();
      this.checkLoginStatus();
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    }
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
  },
  methods: {
    BASEURL() {
      return BASEURL
    },
    checkLoginStatus() {
      const token = uni.getStorageSync('fufu-app-token');
      this.isLoggedIn = !!token;
    },
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    getDynamicInfo: async function () {
      try {
        // 调用获取动态详情的API
        const res = await getDynamicsByUid(this.dynamicId);
        if (res.code === 20000) {
          this.dynamicInfo = res.data;
          this.dynamicInfo.author.avatar = BASEURL + this.dynamicInfo.author.avatar;
          this.dynamicInfo.images = res.data.images.map(item => BASEURL + item.toString().substring(1, item.length - 1));
          console.log('获取动态信息成功', this.dynamicInfo)
        }
        this.checkIfOwner(this.dynamicInfo)
      } catch (error) {
        uni.showToast({
          title: '获取动态信息失败',
          icon: 'none'
        });
      }
    },
    getComments: async function () {
      if (!this.hasMore) return;
      try {
        // 调用获取评论列表的API
        const res = await getParentCommentsByCid(this.dynamicId, {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        });
        if (res.code === 20000) {
          const newComments = res.data.map(item => ({
            ...item,
            isExpanded: false,
            replies: [],
            replyPageNum: 1,
            hasMoreReplies: item.childrenCount > 0
          }));
          this.comments = [...this.comments, ...newComments];
          this.hasMore = res.data.length === this.pageSize;
          this.pageNum++;
          console.log(this.comments);
        }
      } catch (error) {
        uni.showToast({
          title: '获取评论失败',
          icon: 'none'
        });
      }
    },
    loadMoreComments() {
      this.getComments();
    },
    formatTime(timestamp) {
      // 实现时间格式化逻辑
      return new Date(timestamp).toLocaleString();
    },
    previewImage(index) {
      uni.previewImage({
        urls: this.dynamicInfo.images,
        current: index
      });
    },
    async handleLike() {
      if (!this.isLoggedIn) {
        this.goToLogin();
        return;
      }

      try {
        let res;
        if (this.dynamicInfo.isLiked) {
          // 调用取消点赞的API
          res = await deleteThumbsUp(uni.getStorageSync('fufu-app-userId'),this.dynamicId);
        } else {
          // 调用点赞的API
          const  data = {
            userId: uni.getStorageSync('fufu-app-userId'),
            dynamicId: this.dynamicId
          }
          res = await addThumbsUp(data);
        }

        if (res.code === 20000) {
          // 更新点赞状态
          this.dynamicInfo.isLiked = !this.dynamicInfo.isLiked;
          // 更新点赞数量
          this.dynamicInfo.likeCount += this.dynamicInfo.isLiked ? 1 : -1;

          uni.showToast({
            title: this.dynamicInfo.isLiked ? '点赞成功' : '已取消点赞',
            icon: 'none'
          });
        }
      } catch (error) {
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },
    onInputFocus() {
      this.isInputFocused = true;
    },
    onInputBlur() {
      this.isInputFocused = false;
    },
    async submitComment() {
      if (!this.commentText.trim()) {
        return;
      }

      try {
        const data = {
          userId: uni.getStorageSync('fufu-app-userId'),
          dynamicId: this.dynamicId,
          parentCommentId: this.currentReply ? this.currentReply.replyToId : 0,
          content: this.commentText
        };

        const res = await addComments(data);

        if (res.code === 20000) {
          const newComment = {
            ...res.data,
            avatarUrl: res.data.avatarUrl,
            nickname: res.data.nickname,
            createTime: new Date().toISOString(),
            childrenCount: 0,
            replies: [],
            isExpanded: false,
            hasMoreReplies: false
          };

          if (this.currentReply) {
            // 如果是回复评论
            const parentComment = this.comments.find(
                c => c.id === this.currentReply.replyToId
            );
            if (parentComment) {
              // 确保 replies 数组存在
              if (!parentComment.replies) {
                this.$set(parentComment, 'replies', []);
              }
              console.log(parentComment)

              // 更新父评论的回复列表
              parentComment.replies.unshift(newComment);
              parentComment.childrenCount++;

              // 如果父评论是展开状态，确保它保持展开
              if (!parentComment.isExpanded) {
                this.$set(parentComment, 'isExpanded', true);
              }
            }
          } else {
            // 如果是新评论
            this.comments.unshift(newComment);
          }

          // 清空输入框和当前回复信息
          this.commentText = '';
          this.currentReply = null;
          this.replyPlaceholder = '说点什么...';
          this.isInputFocused = false;

          uni.showToast({
            title: '评论成功',
            icon: 'success'
          });
        }
      } catch (error) {
        uni.showToast({
          title: '评论失败',
          icon: 'none'
        });
      }
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/Login'
      });
    },
    // 加载回复列表
    async loadReplies(comment) {
      if (comment.isExpanded) {
        this.$set(comment, 'isExpanded', false);
        return;
      }

      try {
        if (!comment.replies.length) {
          const res = await getCommentsByCid(this.dynamicId, {
            pageNum: comment.replyPageNum,
            pageSize: this.pageSize,
            dynamicId: this.dynamicId,
            pid: comment.id
          });

          if (res.code === 20000) {
            this.$set(comment, 'replies', res.data);
            this.$set(comment, 'hasMoreReplies', res.data.length === this.pageSize);
          }
        }

        this.$set(comment, 'isExpanded', true);
      } catch (error) {
        uni.showToast({
          title: '加载回复失败',
          icon: 'none'
        });
      }
    },
    // 加载更多回复
    async loadMoreReplies(comment) {
      try {
        comment.replyPageNum++;
        const res = await getCommentsByCid(this.dynamicId, {
          pageNum: comment.replyPageNum,
          pageSize: this.pageSize,
          dynamicId: this.dynamicId,
          pid: comment.id
        });

        if (res.code === 20000) {
          comment.replies.push(...res.data);
          this.$set(comment, 'hasMoreReplies', res.data.length === this.pageSize);
        }
      } catch (error) {
        comment.replyPageNum--;
        uni.showToast({
          title: '加载更多回复失败',
          icon: 'none'
        });
      }
    },
    // 显示回复输入框
    showReplyInput(comment, reply = null) {
      if (!this.isLoggedIn) {
        this.goToLogin();
        return;
      }

      this.currentReply = {
        parentId: reply ? comment.id : 0,
        replyToId: reply ? reply.id : comment.id,
        nickname: reply ? reply.nickname : comment.nickname
      };

      this.replyPlaceholder = `回复 ${this.currentReply.nickname}`;
      this.isInputFocused = true;
    },
    checkIfOwner(dynamicInfo) {
      const userId = uni.getStorageSync('fufu-app-userId');
      console.log(dynamicInfo)
      this.isOwner = dynamicInfo.userId === userId;
      console.log(this.isOwner)
    },
    async handleDelete() {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该动态吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '删除中...'
            });

            try {
              const res = await deleteDynamic(this.dynamicId);
              if (res.code === 20000) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });

                // 返回上一页并触发数据重新加载
                uni.navigateBack({
                  delta: 1,
                  success: () => {
                    const pages = getCurrentPages();
                    const prevPage = pages[pages.length - 1];
                    if (prevPage && prevPage.$vm && prevPage.$vm.getDynamicData) {
                      // 重置页码为1并重新加载数据
                      prevPage.$vm.pageCount = 1;
                      prevPage.$vm.getDynamicData();
                    }
                  }
                });
              } else {
                throw new Error(res.message || '删除失败');
              }
            } catch (error) {
              console.error('删除动态失败:', error);
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dynamic-info {
  min-height: 100vh;
  background: #1E1E1E;
  position: relative;

  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #1E1E1E;

    .nav-content {
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30rpx;

      .back-btn {
        width: 88rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        margin-left: -30rpx;
        padding: 0 30rpx;
      }

      .title {
        color: #FFFFFF;
        font-size: 32rpx;
        font-weight: 500;
      }

      .placeholder {
        width: 88rpx;
      }
    }
  }

  .main-content {
    height: 80vh;
    padding-top: 10vh;
  }

  .author-section {
    padding: 30rpx;
    display: flex;
    align-items: center;

    .avatar {
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
      border: 2rpx solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;

      &:active {
        transform: scale(0.95);
      }
    }

    .author-info {
      margin-left: 20rpx;

      .name {
        color: #FFFFFF;
        font-size: 30rpx;
        font-weight: 500;
        margin-bottom: 6rpx;
        display: block;
      }

      .time {
        color: rgba(255, 255, 255, 0.5);
        font-size: 24rpx;
      }
    }
  }

  .dynamic-content {
    padding: 0 30rpx;

    .title {
      color: #FFFFFF;
      font-size: 34rpx;
      font-weight: 600;
      margin-bottom: 20rpx;
      display: block;
    }

    .text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 28rpx;
      line-height: 1.6;
      margin-bottom: 24rpx;
      display: block;
    }

    .image-grid {
      display: grid;
      gap: 8rpx;
      margin-bottom: 30rpx;

      &.grid-1 image {
        width: 100%;
        height: 500rpx;
        border-radius: 16rpx;
      }

      &.grid-2, &.grid-4 {
        grid-template-columns: repeat(2, 1fr);

        image {
          width: 100%;
          height: 340rpx;
          border-radius: 16rpx;
        }
      }

      &.grid-3, &.grid-5, &.grid-6, &.grid-7, &.grid-8, &.grid-9 {
        grid-template-columns: repeat(3, 1fr);

        image {
          width: 100%;
          height: 220rpx;
          border-radius: 12rpx;
        }
      }
    }
  }

  .interaction-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .interaction-btn {
      display: flex;
      align-items: center;
      padding: 12rpx 24rpx;
      border-radius: 32rpx;
      background: rgba(255, 255, 255, 0.1);
      margin-right: 20rpx;
      transition: all 0.3s;

      &:active {
        transform: scale(0.95);
      }

      &.active {
        background: rgba(255, 99, 99, 0.2);
      }

      image {
        width: 36rpx;
        height: 36rpx;
        margin-right: 8rpx;
      }

      text {
        color: #FFFFFF;
        font-size: 26rpx;
      }
    }

    .delete-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12rpx;
      border-radius: 50%;
      background: rgba(255, 77, 77, 0.2);
      transition: all 0.3s;

      &:active {
        background: rgba(255, 26, 26, 0.3);
      }

      uni-icons {
        color: #FF4D4D;
      }
    }
  }

  .comments-section {
    padding: 30rpx;

    .section-header {
      margin-bottom: 30rpx;

      .title {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
      }
    }

    .comment-list {
      .comment-item {
        display: flex;
        margin-bottom: 30rpx;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
          border: 2rpx solid rgba(255, 255, 255, 0.1);
        }

        .content {
          flex: 1;

          .user-info {
            margin-bottom: 8rpx;

            .nickname {
              font-size: 28rpx;
              color: #fff;
              font-weight: 500;
              margin-right: 12rpx;
            }

            .time {
              font-size: 24rpx;
              color: rgba(255, 255, 255, 0.5);
            }
          }

          .comment-text {
            font-size: 28rpx;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.5;
            margin-bottom: 12rpx;
          }

          .actions {
            display: flex;
            align-items: center;
            gap: 16rpx;

            .action-btn {
              display: flex;
              align-items: center;
              padding: 6rpx 16rpx;
              border-radius: 28rpx;
              background: rgba(255, 255, 255, 0.08);
              transition: all 0.3s;

              &:active {
                transform: scale(0.95);
                background: rgba(255, 255, 255, 0.12);
              }

              uni-icons {
                margin-right: 6rpx;
              }

              text {
                font-size: 24rpx;
                color: rgba(255, 255, 255, 0.7);
              }
            }
          }

          .replies-list {
            margin-top: 20rpx;
            margin-left: 40rpx;
            padding-left: 20rpx;
            border-left: 4rpx solid rgba(255, 255, 255, 0.1);

            .reply-item {
              display: flex;
              margin-bottom: 20rpx;

              .avatar {
                width: 60rpx;
                height: 60rpx;
              }

              .reply-content {
                flex: 1;
              }
            }
          }
        }
      }
    }

    .load-more {
      text-align: center;
      padding: 20rpx;
      color: rgba(255, 255, 255, 0.6);
      font-size: 26rpx;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 8rpx;
      margin-top: 20rpx;

      &:active {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    .comment-input {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20rpx 30rpx;
      background: #1E1E1E;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 16rpx;

      input {
        flex: 1;
        height: 72rpx;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 36rpx;
        padding: 0 24rpx;
        color: #fff;
        font-size: 28rpx;
      }

      button {
        padding: 16rpx 32rpx;
        border-radius: 32rpx;
        background: #4A90E2;
        color: #fff;
        font-size: 28rpx;

        &:disabled {
          background: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
}
</style>
