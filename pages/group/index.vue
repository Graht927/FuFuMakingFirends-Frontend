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
        <view class="calendar-icon" @click="showCalendarPicker">
          <tm-sheet :shadow="0">
            <tm-calendar black @confirm="commitCalendar" @input="this.hiddenTabBar = !this.hiddenTabBar">
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
    <view class="date-scroll">
      <scroll-view scroll-x class="date-list">
        <view
            v-for="(item, index) in dates"
            :key="index"
            class="date-item"
            :class="{ active: activeDateIndex === index }"
            @click="changeDate(index)"
        >
          <text class="date">{{ item.date }}</text>
          <text class="day">{{ item.day }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content" @scrolltolower="onScrollToBottom">
      <view v-if="dates[activeDateIndex].events.length === 0" class="empty-state">
    <image src="/static/icon/empty.png" class="empty-image" />
  </view>
      <EventCard
        v-for="(event, i) in dates[activeDateIndex].events"
        :key="i"
        @goto="toInfo"
        :event="event"
      />
    </scroll-view>

    <!-- 底部导航栏 -->
    <BottomNavBar v-if="hiddenTabBar" :current-tab="currentTab" @switch-tab="switchTab(2)"/>
  </view>
</template>

<script>
import BottomNavBar from '@/components/BottomNavBar.vue'
import EventCard from '@/components/EventCard.vue'
import TmSheet from "@/tm-vuetify/components/tm-sheet/tm-sheet.vue";
import TmCalendar from "@/tm-vuetify/components/tm-calendar/tm-calendar.vue";
import {getTeamList} from "@/pages/utils/apis/organizeBureau/activity";
import {BASEURL} from "@/pages/utils/apiconf/image-api";

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
      currentTab: 2,
      activeDateIndex: 0,
      dates: [],
      selectedDate: new Date(),
      calendar: '',
      hiddenTabBar: true,
      page: 1,
      pageSize: 10,
      loading: false,
      hasMore: true,
      currentEvent: null
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    this.generateWeekDates(this.selectedDate);
    this.fetchEventsForDate(this.selectedDate);
    uni.$on('updateGroupList', this.handleUpdateGroupList);
  },
  onShow() {
    const app = getApp();
    if (app.globalData.needRefreshGroupList) {
      this.handleUpdateGroupList();
      app.globalData.needRefreshGroupList = false;
    }
  },
  onUnload() {
    uni.$off('updateGroupList', this.handleUpdateGroupList);
  },
  methods: {
    toInfo(e) {
      uni.navigateTo({
        url: '/pages/group/GroupInfo?id=' + e
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
      this.page = 1;
      this.hasMore = true;

      // 清空当前日期的 events 数据
      this.dates[index].events = [];
      this.currentEvent = null; // 清空当前显示的活动

      const selectedDate = this.dates[index].date; // 获取选中的日期
      const formattedDate = this.parseDate(selectedDate); // 将 MM-DD 转换为 Date 对象
      this.fetchEventsForDate(formattedDate); // 调用接口更新数据
    },
    showCalendarPicker() {
      console.log('showCalendarPicker')
      this.hiddenTabBar = false;
      uni.showDatePicker({
        mode: 'date',
        currentDate: this.selectedDate,
        success: (res) => {
          this.hiddenTabBar = true;
          this.selectedDate = new Date(res.date);
          this.generateWeekDates(this.selectedDate);
        },
        fail: (err) => {
          console.error('日期选择失败:', err);
          uni.showToast({
            title: '选择日期失败',
            icon: 'none',
            duration: 2000
          });
          this.hiddenTabBar = true;
        }
      });
    },
    async fetchEventsForDate(date) {
      if (this.loading || !this.hasMore) return;
      this.loading = true;
      console.log(this.formatDate(date))
      try {
        let startTime;
        const today = new Date();
        const isToday = this.formatDate(date) === this.formatDate(today); // 判断是否为当天

        if (isToday) {
          startTime = new Date(); // 如果是当天，使用当前时间
        } else {
          startTime = new Date(date);
          startTime.setHours(0, 0, 0, 0); // 如果不是当天，设置为选择日期的 0 点
        }
        // startTime.setHours(startTime.getHours() + 8); // 加上 8 小时偏移
        console.log(startTime)

        const res = await getTeamList({
          startTime: startTime,
          pageNum: this.page,
          pageSize: this.pageSize
        });
        if (res.code === 20000) {
          res.data.forEach(item => {
            item.location = item.address;
            item.image = BASEURL + item.teamImage;
            item.date = item.startTime.split('.')[0].replace('T', ' ');
            item.price = '门票¥' + item.deposit + '/人';
            item.memberCount = item.currentNum + '/' + item.maxNum + ' 已加入';
            item.avatars = item.teamUserInfos.map(user => BASEURL + user.avatarUrl);
          });
        }
        const index = this.dates.findIndex(d => {
          const formattedDate = this.formatDate(date).split('-').slice(1).join('-'); // 提取 MM-DD
          return formattedDate === d.date;
        });
        if (index !== -1) {
          if (this.page === 1) {
            this.dates[index].events = res.data; // 如果是第一页，直接替换数据
          } else {
            this.dates[index].events = this.dates[index].events.concat(res.data); // 否则追加数据
          }
        }
        this.hasMore = res.data.length >= this.pageSize; // 判断是否还有更多数据
      } catch (error) {
        console.error('获取事件数据失败:', error);
        uni.showToast({
          title: '获取数据失败',
          icon: 'none',
          duration: 2000
        });
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    generateWeekDates(date) {
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const selectedDate = date || new Date();
      const currentDay = selectedDate.getDay();

      // 生成所选周的日期，当前日期放在第一个位置
      this.dates = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(selectedDate);
        date.setDate(selectedDate.getDate() + i);
        return {
          date: `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
          day: days[date.getDay()],
          events: []
        };
      });

      // 默认选中当天
      this.activeDateIndex = 0;

      // 只显示提示，不在这里调用 fetchEventsForDate
      uni.showToast({
        title: '数据更新中...',
        icon: 'loading',
        duration: 1000
      });
    },
    onScrollToBottom() {
      if (this.hasMore && !this.loading) {
        this.page += 1; // 增加页码
        this.fetchEventsForDate(this.selectedDate); // 加载更多数据
      }
    },
    parseDate(dateString) {
      const [month, day] = dateString.split('-');
      const year = new Date().getFullYear(); // 使用当前年份
      return new Date(year, month - 1, day); // 返回 Date 对象
    },
    async handleUpdateGroupList() {
      try {
        uni.showLoading({
          title: '刷新数据中...'
        });
        await this.initData();
      } catch (error) {
        console.error('更新数据失败:', error);
        uni.showToast({
          title: '更新失败，请重试',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    async initData() {
      // 重置分页数据
      this.page = 1;
      this.hasMore = true;

      // 如果当前有选中的日期索引，清空该日期的事件数据
      if (this.dates[this.activeDateIndex]) {
        this.dates[this.activeDateIndex].events = [];
      }

      // 重新生成日期数据
      this.generateWeekDates(this.selectedDate);

      // 确保在生成日期后立即获取数据
      await this.fetchEventsForDate(this.selectedDate);
    }
  }
}
</script>

<style lang="scss">
.discover {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%);

  .status-bar {
    flex-shrink: 0;
  }

  .header {
    flex-shrink: 0;
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
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12rpx;
    margin: 20rpx 0;

    .date-list {
      display: flex;
      flex-direction: row;
      padding: 0 20rpx;
      gap: 10rpx;
      overflow-x: auto;
      white-space: nowrap;
    }
  }

  .date-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
    transition: background 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
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

    &.active {
      background: rgba(255, 255, 255, 0.1);

      .date,
      .day {
        color: #fff;
      }
    }
  }

  .content {
    flex: 1;
    overflow: auto;
    margin-bottom: 10vh;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
  padding: 20rpx;

  .empty-image {
    margin: auto;
  }

  .empty-text {
    font-size: 14px;
    color: #999;
  }
}
</style>
