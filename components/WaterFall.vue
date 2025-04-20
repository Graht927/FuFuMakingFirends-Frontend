<template>
  <view class="waterfall">
    <!-- 左列 -->
    <view class="waterfall-column">
      <template v-for="item in leftList">
        <!-- 动态卡片 -->
        <view v-if="item.model === 'dynamic'"
              class="waterfall-item"
              @click="navigateToDynamicInfo(item)">
          <image :src="item.image"
                 class="dynamic-image"
                 :style="{height: item.size + 'vh'}"
                 mode="aspectFill"/>
          <view class="dynamic-info">
            <view class="dynamic-title">{{ item.title }}</view>
          </view>
        </view>

        <!-- 活动卡片 -->
        <view v-else-if="item.model === 'group'"
              class="group-card"
              @click="navigateToGroupInfo(item)">
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

    <!-- 右列 -->
    <view class="waterfall-column">
      <template v-for="item in rightList">
        <!-- 动态卡片 -->
        <view v-if="item.model === 'dynamic'"
              class="waterfall-item"
              @click="navigateToDynamicInfo(item)">
          <image :src="item.image"
                 class="dynamic-image"
                 :style="{height: item.size + 'vh'}"
                 mode="aspectFill"/>
          <view class="dynamic-info">
            <view class="dynamic-title">{{ item.title }}</view>
          </view>
        </view>

        <!-- 活动卡片 -->
        <view v-else-if="item.model === 'group'"
              class="group-card"
              @click="navigateToGroupInfo(item)">
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
</template>

<script>
export default {
  name: 'WaterFall',
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
      immediate: true,
      handler(newList) {
        this.distributeItems(newList);
      }
    }
  },
  methods: {
    distributeItems(items) {
      this.leftList = [];
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
      if (item.id) {
        uni.navigateTo({
          url: `/pages/dynamicInfo/dynamicInfo?id=${item.id}`
        });
      }
    },
    navigateToGroupInfo(item) {
      if (item.id) {
        uni.navigateTo({
          url: `/pages/group/GroupInfo?id=${item.id}`
        });
      }
    },
    addItems(newItems) {
      newItems.forEach((item) => {
        if (this.leftList.length <= this.rightList.length) {
          this.leftList.unshift(item);
        } else {
          this.rightList.unshift(item);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.waterfall {
  display: flex;
  padding: 10rpx;
  box-sizing: border-box;
}

.waterfall-column {
  flex: 1;
  margin: 0 5rpx;
}

// 保持原有的动态卡片样式
.waterfall-item {
  position: relative;
  margin-bottom: 10rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #2d2d2d;
}

.dynamic-image {
  width: 100%;
  display: block;
  border-radius: 12rpx;
}

.dynamic-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}

.dynamic-title {
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
}

// 新的活动卡片样式
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
