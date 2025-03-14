<template>
  <view class="discover">
    <!-- 顶部状态栏 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 标题栏 -->
    <view class="header">
      <view style="display:flex;">
        <view>
          <text class="title">GROUP</text>
          <view class="indicators">
            <view class="dot"></view>
            <view class="line"></view>
          </view>
        </view>
        <view class="calendar-icon">
          <tm-sheet :shadow="0">
            <tm-calendar black @confirm="commitCalendar">
              <view>
                <image src="/static/icon/calendar.png"
                       style="width: 2rem; height: 2rem;margin-left: 1rem;"/>
              </view>
            </tm-calendar>
          </tm-sheet>
        </view>
      </view>
    </view>

    <!-- 优化后的日期选择 -->
    <scroll-view class="date-scroll">
      <view class="date-list">
        <view
            v-for="(item, index) in dates"
            :key="index"
            class="date-item"
            :class="{ active: activeDateIndex === index }"
            @click="changeDate(index)">
          <text class="date">{{ item.date }}</text>
          <text class="day">{{ item.day }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 内容区域 -->
    <view class="content" style="height: 70vh;">
      <view v-if="teamList == null|| teamList.length > 0">
        <view v-for="event in teamList" :key="event.id">
          <EventCard @goto="toInfoPage()" :event="event"/>
        </view>
      </view>
      <view v-else class="no-data">
        <image src="/static/icon/empty.png" mode="aspectFit" class="no-data-image"/>
      </view>
    </view>

    <!-- 返回顶部按钮 -->
    <view v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
      <image src="/static/icon/back-to-top.png" mode="aspectFit" class="back-to-top-icon"/>
    </view>
    <BottomNavBar :current-tab="2"/>


  </view>
</template>

<script>
import BottomNavBar from '@/components/BottomNavBar.vue'
import EventCard from '@/components/EventCard.vue'
import TmSheet from "@/tm-vuetify/components/tm-sheet/tm-sheet.vue";
import TmCalendar from "@/tm-vuetify/components/tm-calendar/tm-calendar.vue";

export default {
  components: {
    TmCalendar,
    TmSheet,
    BottomNavBar,
    EventCard
  },
  data() {
    return {
      statusBarHeight: 0,
      currentTab: 0,
      activeDateIndex: 0,
      dates: [],
      selectedDate: new Date(),
      calendar: '',
      teamList: [],
      showBackToTop: false
    }
  },
   onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    this.generateWeekDates(this.selectedDate);
    this.teamList = [
      {
        id: 1,
        name: 'OT决战到天亮',
        date: '2025-03-01',
        image: 'https://ai-public.mastergo.com/ai/img_res/4fb989600a93c5945f94095e5b008728.jpg',
        location: 'One Third PH-工体店',
        price: '门票¥300/人 全场AA',
        memberCount: '8/8 已加入',
        avatars: [
          'https://ai-public.mastergo.com/ai/img_res/bf8d2a39801d1dbd00b4c9aa1ee5350a.jpg',
          'https://ai-public.com/ai/img_res/f9869b817159649afb67a5e66aeef17c.jpg',
          'https://ai-public.mastergo.com/ai/img_res/ad56cbdcd4396d4c0812662fcf842dbf.jpg',
          'https://ai-public.mastergo.com/ai/img_res/e1a277d3a3d12ce0bda6a569d1271103.jpg',
          'https://ai-public.mastergo.com/ai/img_res/c67f282f0d04c7a58fb612775e4811e0.jpg',
          'https://ai-public.mastergo.com/ai/img_res/c99f9a496d6b56b67a7dcafc873035df.jpg'
        ]
      }, {
        id: 2,
        name: 'OT决战到天亮',
        date: '2025-03-01',
        image: 'https://ai-public.mastergo.com/ai/img_res/4fb989600a93c5945f94095e5b008728.jpg',
        location: 'One Third PH-工体店',
        price: '门票¥300/人 全场AA',
        memberCount: '8/8 已加入',
        avatars: [
          'https://ai-public.mastergo.com/ai/img_res/bf8d2a39801d1dbd00b4c9aa1ee5350a.jpg',
          'https://ai-public.com/ai/img_res/f9869b817159649afb67a5e66aeef17c.jpg',
          'https://ai-public.mastergo.com/ai/img_res/ad56cbdcd4396d4c0812662fcf842dbf.jpg',
          'https://ai-public.mastergo.com/ai/img_res/e1a277d3a3d12ce0bda6a569d1271103.jpg',
          'https://ai-public.mastergo.com/ai/img_res/c67f282f0d04c7a58fb612775e4811e0.jpg',
          'https://ai-public.mastergo.com/ai/img_res/c99f9a496d6b56b67a7dcafc873035df.jpg'
        ]
      }, {
        id: 3,
        name: 'OT决战到天亮',
        date: '2025-03-01',
        image: 'https://ai-public.mastergo.com/ai/img_res/4fb989600a93c5945f94095e5b008728.jpg',
        location: 'One Third PH-工体店',
        price: '门票¥300/人 全场AA',
        memberCount: '8/8 已加入',
        avatars: [
          'https://ai-public.mastergo.com/ai/img_res/bf8d2a39801d1dbd00b4c9aa1ee5350a.jpg',
          'https://ai-public.com/ai/img_res/f9869b817159649afb67a5e66aeef17c.jpg',
          'https://ai-public.mastergo.com/ai/img_res/ad56cbdcd4396d4c0812662fcf842dbf.jpg',
          'https://ai-public.mastergo.com/ai/img_res/e1a277d3a3d12ce0bda6a569d1271103.jpg',
          'https://ai-public.mastergo.com/ai/img_res/c67f282f0d04c7a58fb612775e4811e0.jpg',
          'https://ai-public.mastergo.com/ai/img_res/c99f9a496d6b56b67a7dcafc873035df.jpg'
        ]
      }
    ]
  },
  methods: {
    toInfoPage(dataId){
      uni.navigateTo({
        url: '/pages/group/GroupInfo?dataId=' + dataId
      })
    },
    commitCalendar(e) {
      console.log(e);
      const year = e.year
      const month = e.month
      const day = e.day
      this.generateWeekDates(new Date(year, month - 1, day))
    },
    switchTab(index) {
      this.currentTab = index;
    },
    changeDate(index) {
      this.activeDateIndex = index;
      console.log(this.dates[index])
    },
    generateWeekDates(date) {
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const selectedDate = date || new Date();

      // 生成所选周的日期
      this.dates = Array.from({length: 7}).map((_, i) => {
        const date = new Date(selectedDate);
        date.setDate(selectedDate.getDate() + i);
        // 使用本地日期格式
        const currentDateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        return {
          date: `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
          year: date.getFullYear(),
          day: days[date.getDay()]
        };
      });
      // 默认选中当天
      this.activeDateIndex = 0;
      uni.showToast({
        title: '周数据已更新',
        icon: 'success',
        duration: 1000
      });
    },
    onReachBottom() {
      console.log("触底了");
      const newEvents = [];
      for (let i = this.teamList.length; i < this.teamList.length + 10; i++) {
        const id = this.teamList.length + i + 1;
        newEvents.push({
          id: id,
          name: '新活动 ' + id,
          date: '2025-03-01',
          image: 'https://ai-public.mastergo.com/ai/img_res/4fb989600a93c5945f94095e5b008728.jpg',
          location: 'One Third PH-工体店',
          price: '门票¥300/人 全场AA',
          memberCount: '8/8 已加入',
          avatars: [
            'https://ai-public.mastergo.com/ai/img_res/bf8d2a39801d1dbd00b4c9aa1ee5350a.jpg',
            'https://ai-public.com/ai/img_res/f9869b817159649afb67a5e66aeef17c.jpg',
            'https://ai-public.mastergo.com/ai/img_res/ad56cbdcd4396d4c0812662fcf842dbf.jpg',
            'https://ai-public.mastergo.com/ai/img_res/e1a277d3a3d12ce0bda6a569d1271103.jpg',
            'https://ai-public.mastergo.com/ai/img_res/c67f282f0d04c7a58fb612775e4811e0.jpg',
            'https://ai-public.mastergo.com/ai/img_res/c99f9a496d6b56b67a7dcafc873035df.jpg'
          ]

        });
      }
      this.teamList = this.teamList.concat(newEvents); // 使用 concat 更新 teamList
      console.log('teamList:', this.teamList);
    },
    scrollToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },
  onPageScroll(e) {
    // 当页面滚动超过一定距离时显示按钮
    this.showBackToTop = e.scrollTop > 3000;
  }
}
</script>

<style lang="scss">
.discover {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%);
  display: flex;
  flex-direction: column;
  position: relative;

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

  .date-scroll {
    flex-shrink: 0;
    height: 120rpx;
    width: 100%;
  }

  .date-list {
    display: flex;
    padding: 0 20rpx;
  }

  .date-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120rpx;
    height: 120rpx;
  }

  .date {
    font-size: 14px;
    color: #999;
  }

  .day {
    font-size: 12px;
    color: #666;
    margin-top: 8rpx;
  }

  .date-item.active {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12rpx;
  }

  .active .date,
  .active .day {
    color: #fff;
  }

  .content {
    flex: 1;
    overflow: auto;
    padding-bottom: 120rpx;
  }

  .bottom-nav-bar-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 100rpx;

    .no-data-image {
      width: 90vw;
      height: 50vh;
      opacity: 1;
      filter: brightness(1.2);
    }
  }

  .back-to-top {
    position: fixed;
    right: 20rpx;
    bottom: 18vh; // 避免与底部导航栏重叠
    width: 80rpx;
    height: 80rpx;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    z-index: 1000;

    .back-to-top-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }
}

.white {
  background: transparent !important;
}

.my-32, .mx-32 {
  margin: 0;
}

.py-32, .px-32 {
  padding: 0;
}
</style>
