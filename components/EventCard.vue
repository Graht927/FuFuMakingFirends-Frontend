<template>
  <view class="event-card" @click="toPage">
    <image class="event-image" :src="event.image" mode="aspectFill"/>
    <view class="event-info">
      <view class="event-title">
        <text class="event-name">{{ event.name }}</text>
        <text class="event-date">{{ event.date }}{{ getDayOfWeek(event.date) }}</text>
      </view>
      <view class="info-item">
        <img src="/static/icon/addr.png" style="width: 1rem;height: 1rem;"/>
        <text class="info-text">{{ event.location }}</text>
      </view>
      <view class="info-item">
        <img src="/static/icon/ticket.png" style="width: 1rem;height: 1rem;"/>
        <text class="info-text">{{ event.price }}</text>
      </view>
      <view class="event-members">
        <view class="info-item">
          <img src="/static/icon/UserCount.png" style="width: 1rem;height: 1rem;"/>
          <text class="info-text" style="line-height: 1rem;">{{ event.memberCount }} 已参加</text>
        </view>
        <view class="member-avatars">
          <image
            v-for="(avatar, i) in event.avatars"
            :key="i"
            class="avatar"
            :src="avatar"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  events:["goto"],
  props: {
    event: {
      type: Object,
      required: true
    }
  },methods:{
    getDayOfWeek(dateString) {
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const date = new Date(dateString);
      return days[date.getDay()]; // 返回对应的周几
    },
    toPage(){
      this.$emit("goto",this.event.id)
    }
  }
}
</script>

<style scoped lang="scss">
.event-card {
    margin: 20rpx;
    background: #1a1a1a;
    border-radius: 20rpx;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
}

.event-card:hover {
    transform: translateY(-4px);
}

.event-image {
    width: 100%;
    height: 400rpx;
    object-fit: cover;
}

.event-info {
    padding: 24rpx;
}

.event-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.event-name {
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    max-width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.event-date {
    font-size: 13px;
    color: #999;
    padding-left: 10rpx;
}

.info-item {
    display: flex;
    align-items: center;
    padding: 8rpx 0;

    & .info-text {
        font-size: 14px;
        color: #ccc;
        margin-left: 12rpx;
    }
}

.event-members {
    margin-top: 10rpx;
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.member-info {
    display: flex;
    align-items: center;
}

.member-avatars {
    display: flex;
    align-items: center;
    margin-left: 0;
}

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #f0f0f0;
    object-fit: cover;
    border: 2px solid #1a1a1a;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
    margin-left: -10px;

    &:first-child {
        margin-left: 0;
    }

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        z-index: 1;
    }
}
</style>
