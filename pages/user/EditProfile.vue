<template>
  <view class="edit-profile">
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @click="cancelEdit">
          <uni-icons type="left" size="20" color="#FFFFFF"/>
        </view>
        <text class="title">编辑主页</text>
        <view class="save-btn" @click="saveProfile">保存</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content" scroll-y="true">
      <view class="form">
        <view class="form-item">
          <text class="label">昵称</text>
          <input v-model="userInfo.nickname" class="input" placeholder="请输入昵称"/>
        </view>
        <view class="form-item">
          <text class="label">年龄</text>
          <input v-model="userInfo.age" class="input" placeholder="请输入年龄"/>
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <picker :range="genderOptions" @change="onGenderChange">
            <view class="picker">{{ userInfo.gender === 1 ? '男' : '女' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">个人简介</text>
          <textarea v-model="userInfo.profile" class="textarea" placeholder="请输入个人简介"/>
        </view>
        
        <!-- 标签管理 -->
        <view class="form-item">
          <text class="label">标签</text>
          <view class="tags-container">
            <view class="tag-list">
              <view v-for="(tag, index) in userInfo.tags" :key="index" class="tag-item">
                <text>{{ tag }}</text>
                <view class="delete-tag" @click="deleteTag(index)">
                  <uni-icons type="closeempty" size="12" color="#FFFFFF"/>
                </view>
              </view>
            </view>
            <view class="add-tag" @click="showAddTagModal" v-if="userInfo.tags.length < 5">
              <uni-icons type="plusempty" size="16" color="#4A90E2"/>
              <text>添加标签</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 添加标签弹窗 -->
    <uni-popup ref="addTagPopup" type="bottom">
      <view class="add-tag-popup">
        <view class="popup-header">
          <text class="title">添加标签</text>
          <view class="close-btn" @click="closeAddTagModal">
            <uni-icons type="closeempty" size="20" color="#FFFFFF"/>
          </view>
        </view>
        <view class="popup-content">
          <input v-model="newTag" class="tag-input" placeholder="请输入标签内容" maxlength="10"/>
          <view class="popup-buttons">
            <view class="cancel-btn" @click="closeAddTagModal">取消</view>
            <view class="confirm-btn" @click="addTag">确定</view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      userInfo: {
        nickname: '',
        age: '',
        gender: 1,
        addr: '',
        profile: '',
        tags: []
      },
      genderOptions: ['男', '女'],
      newTag: ''
    };
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
  },
  methods: {
    onGenderChange(e) {
      this.userInfo.gender = e.detail.value + 1;
    },
    saveProfile() {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
      uni.navigateBack();
    },
    cancelEdit() {
      uni.navigateBack();
    },
    showAddTagModal() {
      this.$refs.addTagPopup.open();
    },
    closeAddTagModal() {
      this.$refs.addTagPopup.close();
      this.newTag = '';
    },
    addTag() {
      if (!this.newTag.trim()) {
        uni.showToast({
          title: '标签内容不能为空',
          icon: 'none'
        });
        return;
      }
      if (this.userInfo.tags.length >= 5) {
        uni.showToast({
          title: '最多只能添加5个标签',
          icon: 'none'
        });
        return;
      }
      this.userInfo.tags.push(this.newTag.trim());
      this.closeAddTagModal();
    },
    deleteTag(index) {
      this.userInfo.tags.splice(index, 1);
    }
  }
};
</script>

<style lang="scss">
.edit-profile {
  min-height: 100vh;
  background: #1E1E1E;
  color: #FFFFFF;
}

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

    .save-btn {
      color: #4A90E2;
      font-size: 28rpx;
    }
  }
}

.content {
  padding-top: calc(88rpx + var(--status-bar-height));
  height: calc(100vh - 88rpx - var(--status-bar-height));
}

.form {
  padding: 30rpx;

  .form-item {
    margin-bottom: 40rpx;

    .label {
      display: block;
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 16rpx;
    }

    .input, .textarea {
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8rpx;
      color: #FFFFFF;
      font-size: 28rpx;
    }

    .input {
      height: 88rpx;
      padding: 0 24rpx;
    }

    .textarea {
      height: 240rpx;
      padding: 24rpx;
    }

    .picker {
      height: 88rpx;
      line-height: 88rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8rpx;
      padding: 0 24rpx;
      color: #FFFFFF;
      font-size: 28rpx;
    }
  }
}

.tags-container {
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 20rpx;
  }

  .tag-item {
    display: flex;
    align-items: center;
    background: rgba(74, 144, 226, 0.2);
    border-radius: 8rpx;
    padding: 12rpx 20rpx;
    font-size: 24rpx;
    color: #4A90E2;

    .delete-tag {
      margin-left: 10rpx;
      display: flex;
      align-items: center;
    }
  }

  .add-tag {
    display: flex;
    align-items: center;
    color: #4A90E2;
    font-size: 24rpx;
    padding: 12rpx 0;

    text {
      margin-left: 8rpx;
    }
  }
}

.add-tag-popup {
  background: #2C2C2C;
  border-radius: 24rpx 24rpx 0 0;
  padding: 30rpx;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .title {
      font-size: 32rpx;
      font-weight: 500;
      color: #FFFFFF;
    }

    .close-btn {
      padding: 10rpx;
    }
  }

  .popup-content {
    .tag-input {
      width: 100%;
      height: 88rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8rpx;
      color: #FFFFFF;
      font-size: 28rpx;
      padding: 0 24rpx;
      margin-bottom: 30rpx;
    }

    .popup-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 20rpx;

      .cancel-btn, .confirm-btn {
        padding: 16rpx 40rpx;
        border-radius: 8rpx;
        font-size: 28rpx;
      }

      .cancel-btn {
        background: rgba(255, 255, 255, 0.1);
        color: #FFFFFF;
      }

      .confirm-btn {
        background: #4A90E2;
        color: #FFFFFF;
      }
    }
  }
}
</style>
