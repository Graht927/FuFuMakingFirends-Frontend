<template>
  <view class="waterfall">
    <view class="waterfall-column" v-for="(list, columnIndex) in [leftList, rightList]" :key="columnIndex">
      <view v-for="(item, index) in list"
            :key="index"
            class="waterfall-item"
            @click="handleClick(item)">
        <!-- 动态卡片 -->
        <template v-if="item.model === 'dynamic'">
          <view class="dynamic-card" :style="{height: item.size + 'vh'}" @click="navigateToDynamicInfo(item)">
            <view class="image-wrapper">
              <image :src="item.image"
                     class="dynamic-image"
                     mode="aspectFill"/>
              <!-- 渐变遮罩 -->
              <view class="image-overlay"></view>
            </view>
            <view class="dynamic-info">
              <view class="dynamic-title">{{ item.title }}</view>
              <view class="dynamic-author">
                <view class="author-info">
                  <image :src="item.author.avatar" class="author-avatar"/>
                  <text class="author-name">{{ item.author.name }}</text>
                </view>
                <view class="like-btn" :class="{ 'liked': item.isLike }" @click.stop="handleLike(item)">
                  <image :src="item.isLike ? '/static/icon/click_like.png' : '/static/icon/like.png'"
                         class="like-icon"/>
                </view>
              </view>
            </view>
          </view>
        </template>

        <!-- 活动卡片 -->
        <template v-if="item.model === 'group'">
          <view class="group-card" @click="navigateToGroupInfo(item)">
            <view class="group-content">
              <view class="image-container">
                <image :src="item.image"
                       class="group-image"
                       mode="aspectFill"/>
                <view v-if="item.distance" class="distance">{{ item.distance }}</view>
              </view>
              <view class="group-info">
                <view class="group-title">{{ item.title }}</view>
                <view class="member-info">
                  <view class="member-avatars">
                    <image v-for="(avatar, idx) in item.userAvatars.slice(0, 3)"
                           :key="idx"
                           :src="avatar"
                           class="member-avatar"
                           :style="{ zIndex: item.userAvatars.length - idx }"/>
                  </view>
                  <view class="member-count">
                    <text class="count">{{ item.currentCount }}/{{ item.userCount }}</text>
                    <text>人</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import {addThumbsUp, deleteThumbsUp} from "@/pages/utils/apis/socializing/thumbsUp";

export default {
  name: 'DiscoverWaterFall',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      leftList: [],
      rightList: []
    }
  },
  watch: {
    list: {
      handler(newList) {
        this.distributeItems(newList);
      },
      immediate: true
    }
  },
  methods: {
    distributeItems(items) {
      this.leftList = [];  // 清空原有数据
      this.rightList = [];
      items.forEach((item, index) => {
        if (index % 2 === 0) {
          this.leftList.push(item);
        } else {
          this.rightList.push(item);
        }
      });
    },
    handleClick(item) {
      this.$emit('itemClick', item);
    },
    navigateToDynamicInfo(item) {
        uni.navigateTo({
        url: `/pages/dynamicInfo/dynamicInfo?id=${item.id}`
      });
    },
    navigateToGroupInfo(item) {
      uni.navigateTo({
        url: `/pages/group/GroupInfo?id=${item.id}`
      });
    },
    async likes(item){
      try {
        let res;
        if (item.isLike) {
          // 调用取消点赞的API
          res = await deleteThumbsUp(uni.getStorageSync('fufu-app-userId'),item.id);
        } else {
          // 调用点赞的API
          const  data = {
            userId: uni.getStorageSync('fufu-app-userId'),
            dynamicId: item.id
          }
          res = await addThumbsUp(data);
        }
        if (res.code === 20000) {
          // 更新点赞状态
          item.isLike = !item.isLike;
          // 更新点赞数量
          item.likeCount += item.isLike ? 1 : -1;

          uni.showToast({
            title: item.isLike ? '点赞成功' : '已取消点赞',
            icon: 'none'
          });
          return true
        }
      } catch (error) {
        console.log(error)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
        return false
      }
    },
    handleLike(item) {
      this.$emit('likeClick', item);
      // const res = this.likes(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.waterfall {
  display: flex;
  padding: 20rpx;
  gap: 20rpx;

  .waterfall-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }
}

// 动态卡片样式
.dynamic-card {
  border-radius: 24rpx;
  overflow: hidden;
  background: #1a1a1a;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.2);
  transform: translateZ(0);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;

  &:active {
    transform: scale(0.98);
  }

  .image-wrapper {
    position: relative;
    flex: 1;

    .dynamic-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 120rpx;
      background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
    }
  }

  .dynamic-info {
    padding: 24rpx;
    background: #1a1a1a;

    .dynamic-title {
      font-size: 28rpx;
      color: #ffffff;
      font-weight: 600;
      margin-bottom: 16rpx;
      line-height: 1.4;
    }

    .dynamic-author {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .author-info {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .author-avatar {
          width: 48rpx;
          height: 48rpx;
          border-radius: 50%;
          border: 2rpx solid rgba(255,255,255,0.2);
        }

        .author-name {
          font-size: 24rpx;
          color: rgba(255,255,255,0.8);
        }
      }

      .like-btn {
        width: 56rpx;
        height: 56rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.9);
        }

        &.liked {
          background: rgba(255,99,99,0.2);
        }

        .like-icon {
          width: 32rpx;
          height: 32rpx;
        }
      }
    }
  }
}

// 活动卡片样式
.group-card {
  margin-bottom: 10rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #1A1A1A;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.2);

  .group-content {
    .image-container {
      position: relative;
      width: 100%;
      padding-bottom: 100%; // 1:1 比例

      .group-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .distance {
        position: absolute;
        top: 12rpx;
        right: 12rpx;
        padding: 8rpx 16rpx;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 100rpx;
        color: #ffffff;
        font-size: 24rpx;
        backdrop-filter: blur(4px);
        z-index: 2;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60rpx;
        background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
        pointer-events: none;
      }
    }

    .group-info {
      padding: 24rpx;

      .group-title {
        font-size: 28rpx;
        color: #ffffff;
        font-weight: 600;
        margin-bottom: 16rpx;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .member-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .member-avatars {
          display: flex;
          align-items: center;

          .member-avatar {
            width: 48rpx;
            height: 48rpx;
            border-radius: 50%;
            border: 2rpx solid #1A1A1A;
            margin-left: -12rpx;
            object-fit: cover;
            box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.1);

            &:first-child {
              margin-left: 0;
            }
          }
        }

        .member-count {
          display: flex;
          align-items: center;
          padding: 6rpx 16rpx;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100rpx;
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.8);

          .count {
            color: #86A8E7;
            margin-right: 4rpx;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
