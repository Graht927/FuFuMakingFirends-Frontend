<template>
  <view class="create-dynamic">
    <!-- 顶部导航栏 -->
    <view class="nav-bar"></view>
    <view class="nav-bar"></view>
    <view class="nav-bar">
      <view class="left" @click="goBack">
        <text class="iconfont">×</text>
      </view>
      <view class="title">发布动态</view>
      <view class="right" @click="publishDynamic">
        <text :class="['publish-btn', canPublish ? 'active' : '']">发布</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 标题输入区 -->
      <input
          class="title-input"
          v-model="title"
          placeholder="输入标题..."
          :maxlength="30"
          @input="handleInput"
      />

      <!-- 文本输入区 -->
      <textarea
          class="input-area"
          v-model="content"
          placeholder="分享你的故事..."
          :maxlength="500"
          @input="handleInput"
      />

      <!-- 图片上传区 -->
      <view class="image-upload">
        <view class="image-list">
          <view
              v-for="(image, index) in images"
              :key="index"
              class="image-item"
          >
            <image :src="image" mode="aspectFill"/>
            <view class="delete-btn" @click="deleteImage(index)">×</view>
          </view>

          <view
              class="upload-btn"
              @click="chooseImage"
              v-if="images.length < 9"
          >
            <text class="plus">+</text>
            <text class="text">添加图片</text>
          </view>
        </view>
      </view>
      <!-- 底部发布按钮 -->
      <view class="bottom-btn" @click="publishDynamic" :class="{ active: canPublish }">
        发布动态
      </view>
    </view>
  </view>
</template>

<script>
import {imagePrefix} from "@/pages/utils/apiconf/image-api";
import {createDynamic} from "@/pages/utils/apis/user/dynamic";

export default {
  data() {
    return {
      content: '', // 动态文本内容
      title: '', // 标题
      images: [], // 图片列表
      location: '', // 位置信息
      canPublish: false, // 是否可以发布
      userId: ''
    };
  },
  onLoad() {
    const userId = uni.getStorageSync("fufu-app-userId");
    if (!userId) {
      uni.redirectTo({
        url: '/pages/Login'
      });
    }
    this.userId = userId
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },

    // 处理输入
    handleInput() {
      this.checkCanPublish();
    },

    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 9 - this.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.images = [...this.images, ...res.tempFilePaths];
          this.checkCanPublish();
        }
      });
    },

    // 删除图片
    deleteImage(index) {
      this.images.splice(index, 1);
      this.checkCanPublish();
    },

    // 选择位置
    chooseLocation() {
      uni.chooseLocation({
        success: (res) => {
          this.location = res.name;
        }
      });
    },

    // 检查是否可以发布
    checkCanPublish() {
      this.canPublish = (this.content.trim().length > 0 || this.images.length > 0) && this.title.trim().length > 0;
    },

    // 上传单个图片
    async uploadImage(filePath) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: imagePrefix + 'uploads',
          filePath: filePath,
          name: 'uploadFiles',
          success: (uploadRes) => {
            const result = JSON.parse(JSON.parse(uploadRes.data).data)[0];
            console.log('文件上传成功', result);
            resolve(result);
          },
          fail: (error) => {
            console.error('文件上传失败', error);
            reject(error);
          }
        });
      });
    },

    // 发布动态方法相应修改
    async publishDynamic() {
      if (!this.canPublish) return;

      uni.showLoading({
        title: '发布中...'
      });

      try {
        // 循环上传所有图片
        const imageUrls = [];
        for (const image of this.images) {
          const result = await this.uploadImage(image);
          imageUrls.push(result);
        }

        console.log('所有图片上传完成，地址：', imageUrls);

        // 处理返回的图片URL
        const processedUrls = imageUrls.map(imageUrl => '/' + imageUrl);
        console.log('处理后的图片地址：', processedUrls);

        const data = {
          userId: this.userId,
          content: this.content,
          images: processedUrls,
          coverImages: processedUrls[0],
          title: this.title.trim()
        };
        const res = await createDynamic(data);
        if (res.code === 20000) {
          uni.showToast({
            title: '发布成功',
            icon: 'success'
          });

          // 触发 publishSuccess 事件，传递新动态数据
          const eventChannel = this.getOpenerEventChannel();
          eventChannel.emit('publishSuccess', res.data);

          // 返回上一页
          uni.navigateBack();
        }
      } catch (error) {
        console.error('上传失败：', error);
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
  }
}
</script>

<style lang="scss">
.create-dynamic {
  min-height: 100vh;
  background-color: #1E1E1E;

  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    background-color: #2D2D2D;

    .left {
      .iconfont {
        font-size: 48rpx;
        color: #FFFFFF;
      }
    }

    .title {
      color: #FFFFFF;
      font-size: 32rpx;
    }

    .publish-btn {
      padding: 10rpx 30rpx;
      border-radius: 30rpx;
      font-size: 28rpx;
      color: #666;
      background-color: #3D3D3D;

      &.active {
        color: #FFFFFF;
        background: linear-gradient(135deg, #7F7FD5, #86A8E7, #91EAE4);
      }
    }
  }

  .content {
    padding: 30rpx;
    padding-bottom: 120rpx;

    .title-input {
      width: 100%;
      height: 80rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
      box-sizing: border-box;
      background-color: #2D2D2D;
      border-radius: 20rpx;
      color: #FFFFFF;
      font-size: 32rpx;
      font-weight: 500;
    }

    .input-area {
      width: 100%;
      height: 300rpx;
      padding: 20rpx;
      box-sizing: border-box;
      background-color: #2D2D2D;
      border-radius: 20rpx;
      color: #FFFFFF;
      font-size: 28rpx;
    }

    .image-upload {
      margin-top: 30rpx;

      .image-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;

        .image-item {
          position: relative;
          width: 220rpx;
          height: 220rpx;

          image {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }

          .delete-btn {
            position: absolute;
            top: -20rpx;
            right: -20rpx;
            width: 40rpx;
            height: 40rpx;
            line-height: 40rpx;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.5);
            color: #FFFFFF;
            border-radius: 50%;
          }
        }

        .upload-btn {
          width: 220rpx;
          height: 220rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #2D2D2D;
          border-radius: 10rpx;

          .plus {
            font-size: 60rpx;
            color: #666;
          }

          .text {
            margin-top: 10rpx;
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }

    .location-section {
      margin-top: 30rpx;
      display: flex;
      align-items: center;
      padding: 20rpx;
      background-color: #2D2D2D;
      border-radius: 20rpx;

      .location-icon {
        margin-right: 10rpx;
      }

      .location-text {
        color: #666;
        font-size: 28rpx;
      }
    }

    .bottom-btn {
      position: fixed;
      bottom: 30rpx;
      left: 30rpx;
      right: 30rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background-color: #333333;
      color: #BBBBBB;
      border-radius: 40rpx;
      font-size: 32rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);

      &.active {
        background: linear-gradient(135deg, #8A8AFF, #96C7FF, #91EAE4);
        color: #FFFFFF;
        box-shadow: 0 4rpx 16rpx rgba(138, 138, 255, 0.4);
      }
    }
  }
}
</style>
