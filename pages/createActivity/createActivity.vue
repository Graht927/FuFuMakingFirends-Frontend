<template>
  <view class="create-activity">
    <!-- 顶部导航栏 -->
    <view class="nav-bar"></view>
    <view class="nav-bar"></view>
    <view class="nav-bar">
      <view class="left" @click="goBack">
        <text class="iconfont">×</text>
      </view>
      <view class="title">创建活动</view>
      <view class="right" @click="handleSubmit">
        <text :class="['publish-btn', canPublish ? 'active' : '']">发布</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 封面图片上传 -->
      <view class="form-item">
        <view class="upload-image" style="width: 92vw" @tap="chooseImage" v-if="!teamImage">
          <uni-icons type="camera-filled" size="40" color="#666"></uni-icons>
          <text>上传封面图片</text>
        </view>
        <image v-else :src="teamImage" mode="aspectFill" class="preview-image" @tap="chooseImage"></image>
      </view>

      <!-- 活动信息表单 -->
      <view class="form-container">
        <view class="form-item">
          <text class="label">活动名称</text>
          <input type="text" v-model="formData.name" placeholder="请输入活动名称" class="input"/>
        </view>

        <view class="form-item">
          <text class="label">活动描述</text>
          <textarea v-model="formData.description" placeholder="请输入活动描述" class="textarea"/>
        </view>

        <view class="form-item">
          <text class="label">人数上限</text>
          <input type="number" v-model="formData.maxNum" placeholder="请输入人数上限" class="input"/>
        </view>

        <view class="form-item">
          <text class="label">开始时间</text>
          <picker mode="date" :value="formData.startTime" @change="onStartTimeChange" class="picker">
            <view class="picker-text">{{ formData.startTime || '请选择开始时间' }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">截止时间</text>
          <picker mode="date" :value="formData.expireTime" @change="onExpireTimeChange" class="picker">
            <view class="picker-text">{{ formData.expireTime || '请选择截止时间' }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">活动地点</text>
          <input type="text" v-model="formData.address" placeholder="请输入活动地点" class="input"/>
        </view>

        <view class="form-item">
          <text class="label">门票(元)</text>
          <input type="digit" v-model="formData.deposit" placeholder="请输入门票金额" class="input"/>
        </view>
      </view>

      <!-- 底部发布按钮 -->
      <view class="bottom-btn" @click="handleSubmit" :class="{ active: canPublish }">
        发布活动
      </view>
    </view>
  </view>
</template>

<script>
import { imagePrefix } from "@/pages/utils/apiconf/image-api"
import { createActivity } from "@/pages/utils/apis/organizeBureau/activity"

export default {
  data() {
    return {
      statusBarHeight: 0,
      teamImage: '',
      formData: {
        name: '',
        description: '',
        maxNum: '',
        expireTime: '',
        startTime: '',
        address: '',
        deposit: ''
      },
      userId: '',
      canPublish: false
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight

    const userId = uni.getStorageSync("fufu-app-userId")
    if (!userId) {
      uni.redirectTo({
        url: '/pages/Login'
      })
      return
    }
    this.userId = userId
  },
  methods: {
    // 添加返回方法
    goBack() {
      uni.navigateBack()
    },

    // 添加检查是否可以发布的方法
    checkCanPublish() {
      this.canPublish = this.formData.name &&
                       this.formData.description &&
                       this.formData.maxNum &&
                       this.formData.startTime &&
                       this.formData.expireTime &&
                       this.formData.address &&
                       this.teamImage
    },

    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.teamImage = res.tempFilePaths[0]
          this.checkCanPublish() // 检查状态
        }
      })
    },

    // 上传单个图片
    async uploadImage(filePath) {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: imagePrefix + 'uploads',
          filePath: filePath,
          name: 'uploadFiles',
          success: (uploadRes) => {
            const result = JSON.parse(JSON.parse(uploadRes.data).data)[0]
            console.log('文件上传成功', result)
            resolve(result)
          },
          fail: (error) => {
            console.error('文件上传失败', error)
            reject(error)
          }
        })
      })
    },

    // 开始时间选择
    onStartTimeChange(e) {
      this.formData.startTime = e.detail.value
      this.checkCanPublish()
    },

    // 截止时间选择
    onExpireTimeChange(e) {
      this.formData.expireTime = e.detail.value
      this.checkCanPublish()
    },

    // 表单验证
    validateForm() {
      if (!this.teamImage) {
        uni.showToast({
          title: '请上传封面图片',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.name) {
        uni.showToast({
          title: '请输入活动名称',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.description) {
        uni.showToast({
          title: '请输入活动描述',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.maxNum || this.formData.maxNum <= 0) {
        uni.showToast({
          title: '请输入有效的人数上限',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.startTime) {
        uni.showToast({
          title: '请选择开始时间',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.expireTime) {
        uni.showToast({
          title: '请选择截止时间',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.address) {
        uni.showToast({
          title: '请输入活动地点',
          icon: 'none'
        })
        return false
      }
      return true
    },

    // 提交表单
    async handleSubmit() {
      if (!this.validateForm()) return

      uni.showLoading({
        title: '发布中...'
      })

      try {
        const imageUrl = await this.uploadImage(this.teamImage)
        const processedUrl = '/' + imageUrl

        const submitData = {
          ...this.formData,
          maxNum: parseInt(this.formData.maxNum),
          deposit: parseFloat(this.formData.deposit),
          teamImage: processedUrl,
          userId: this.userId
        }

        const res = await createActivity(submitData)
        if (res.code === 20000) {
          uni.showToast({
            title: '创建成功',
            icon: 'success'
          })


          // 确保在 showToast 完成后返回
            uni.navigateBack({
               success: () => {
                    const pages = getCurrentPages();
                    const prevPage = pages[pages.length - 1];
                    if (prevPage && prevPage.$vm && prevPage.$vm.getGroupData()) {
                      // 重置页码为1并重新加载数据
                      prevPage.$vm.pageCount = 1;
                      prevPage.$vm.getGroupData();
                    }
                  },
              fail: (err) => {
                console.error('返回失败:', err)
              }
            })
        } else {
          throw new Error(res.message || '创建失败')
        }
      } catch (error) {
        console.error('创建活动失败:', error)
        uni.showToast({
          title: error.message || '创建失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },

    onActivityCreated(newActivity) {
      // 在这里处理新创建的活动
      // 例如更新列表数据
      this.activityList.unshift(newActivity)
    }
  },
  // 添加监听器以检查表单变化
  watch: {
    'formData': {
      handler() {
        this.checkCanPublish()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.create-activity {
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
    background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%);
    padding-bottom: 120rpx;

    .upload-image {
      width: 100%;
      height: 400rpx;
      background: #2C2C2C;
      border-radius: 16rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20rpx;

      text {
        color: #666;
        font-size: 28rpx;
      }
    }

    .preview-image {
      width: 100%;
      height: 400rpx;
      border-radius: 16rpx;
      object-fit: cover;
    }

    .form-container {
      margin-top: 30rpx;
    }

    .form-item {
      width: 96%;
      margin-bottom: 30rpx;

      .label {
        display: block;
        color: #FFFFFF;
        font-size: 28rpx;
        margin-bottom: 16rpx;
      }

      .input, .textarea, .picker {
        width: 98%;
        background: #2C2C2C;
        border-radius: 12rpx;
        padding: 20rpx;
        color: #FFFFFF;
        font-size: 28rpx;
      }

      .textarea {
        height: 200rpx;
      }

      .picker-text {
        color: #FFFFFF;
      }
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
    transition: all 0.3s ease;

    &.active {
      background: linear-gradient(135deg, #8A8AFF, #96C7FF, #91EAE4);
      color: #FFFFFF;
      box-shadow: 0 4rpx 16rpx rgba(138, 138, 255, 0.4);
    }
  }
}
</style>
