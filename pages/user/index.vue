<template>
  <view class="discover">
    <!-- 顶部状态栏 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 标题栏 -->
    <view class="header">
      <text class="title">USER</text>
      <view class="indicators">
        <view class="dot"></view>
        <view class="line"></view>
      </view>
    </view>
    <template>
      <div :style="{height:'60vh',overflow: 'auto'}">
        <!--用户头像-->
        <div
            :style="{width: '100%',height: '40%',backgroundImage: 'url('+`${userInfo.avatarUrl!=null? userInfo.avatarUrl:defaultAvatarUrl}`+')',backgroundPosition:'center',backgroundSize:'cover'}">
          <div
              style="height: 100%;width: 100%;backdrop-filter: blur(5px);display: flex;justify-content: center;align-items: center;text-align: center">
            <!-- 左侧标签区域 -->
            <view class="tag-area left-tags">
              <view
                  v-for="(tag, index) in tags"
                  :key="index"
                  class="tag"
                  :style="{
                    backgroundColor: tag.color,
                    left: `${tag.left}%`, // 随机水平位置
                    top: `${tag.top}%`, // 随机垂直位置
                  }"
                  @click="clickTag(tag)"
              >
                {{ tag.text }}
              </view>
            </view>
            <van-image
                round
                width="6.5rem"
                height="6.5rem"
                style="z-index: 2;position: absolute; top: 10%;"
                :src="userInfo.avatarUrl!=''?userInfo.avatarUrl:'http://121.40.231.89:4443/i/static/avatar1.jpg'"
            />
          </div>
        </div>
        <div style="color:white">
          <van-tabs v-model:active="contextActive" swipeable @change="onChange">
            <van-tab v-for="item in contextInfo" :title="item.title" :key="item.title">
              <team-card-list @reloadPage="delReloadPage" :team-list="teamList" :listProp="listProp"/>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </template>
    <BottomNavBar :current-tab="4"/>

  </view>
</template>

<script>
import GCard from '@/components/GCard.vue'
import BottomNavBar from '@/components/BottomNavBar.vue'
import GWaterFall from "@/components/GWaterFall.vue";

export default {
  components: {
    GWaterFall,
    GCard,
    BottomNavBar
  },
  data() {
    return {
      contextActive: 0,
      contextInfo: [
        {title: '动态'},
        {title: '已加入房间'},
        {title: '已创建房间'},
        {title: '过期房间'}
      ],
      defaultAvatarUrl: 'http://121.40.231.89:4443/i/static/avatar1.jpg',
      userInfo: {
        avatarUrl: 'http://121.40.231.89:4443/i/static/avatar1.jpg'
      },
      tags: [], // 初始化空标签数组
      teamList: [],
      listProp: 0,
      gap: 12,
      column: 2,
      loading: false,
      isfinish: false,
      itemWidth: 0,
      itemList: [],
      contentRef: null,
      columnHeight: [],
      ItemPos: [],
      scrollTop: 0,
      isLoading: false,
      isLoadingOver: false,
      testW: null,
      waterfallContentWidth: null,
      statusBarHeight: 0,
      currentTab: 0,
      buttonPosition: {top: 500, left: 0},
      startTouch: {x: 0, y: 0},
      screenWidth: 0,
      screenHeight: 0,
      systemInfo: uni.getSystemInfoSync(),
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    this.screenWidth = systemInfo.windowWidth;
    this.screenHeight = systemInfo.windowHeight;
    // 设置初始位置在屏幕右侧边缘
    this.buttonPosition = {
      top: 500, // 可以根据需要调整初始的垂直位置
      left: this.screenWidth - 60  // 按钮宽度
    };
    // 生成随机标签位置
    this.generateTags(12);
  },
  computed: {},
  mounted() {
    // 获取系统信息
    console.log(this.systemInfo)
    this.waterfallContentWidth = this.systemInfo.windowWidth - 30
    this.init()
    console.log(this.itemList)
    // 监听滚动
  },
  watch: {
    scrollTop() {
      this.onBottom()
    }
  },
  methods: {
    // 生成固定标签位置（凌乱风格）
    generateTags(count) {
      const maxTags = 6; // 最多显示6个标签
      const fixedPositions = [
        // 左侧位置
        { left: 5, top: 15 },   // 更靠近左侧，稍微偏上
        { left: 15, top: 40 },  // 稍微偏右，中间偏上
        { left: 10, top: 65 },  // 中间偏左，稍微偏下
        // 右侧位置
        { left: 75, top: 20 },  // 更靠近右侧，稍微偏上
        { left: 70, top: 45 },  // 稍微偏右，中间偏上
        { left: 67, top: 70 },  // 中间偏右，稍微偏下
      ];

      // 限制标签数量
      count = Math.min(count, maxTags);

      const tags = fixedPositions.slice(0, count).map((pos, index) => ({
        text: `标签${index + 1}大苏打的`,
        color: this.getRandomColor(),
        left: pos.left,
        top: pos.top,
      }));

      this.tags = tags;
    },

    // 获取随机颜色
    getRandomColor() {
      const colors = ["#ffcc00", "#00ccff", "#ff6666", "#66cc66", "#cc66ff", "#ff9966"];
      return colors[Math.floor(Math.random() * colors.length)];
    },
    // 处理标签点击事件
    clickTag(tag) {
      console.log('点击了标签:', tag.text);
      uni.showToast({
        title: `点击了: ${tag.text}`,
        icon: 'none'
      });
    },
    async onChange(v) {
      if (v == 0) {
        //todo 动态
        teamList.value = []
      }
      if (v == 1) {
        const res = await getAddTeamList();
        if (res.code === 20000) {
          teamList.value = res.data
          listProp.value = 1
        }
      }
      if (v == 2) {
        const res = await getCreateTeamList();
        if (res.code === 20000) {
          teamList.value = res.data
          listProp.value = 2
        }
      }
      if (v == 3) {
        const res = await getExpireTeamList();
        if (res.code === 20000) {
          teamList.value = res.data
          listProp.value = 3
        }
      }
    },
    async delReloadPage(data) {
      if (data == 0) {
        //todo 动态
      }
      if (data == 1) {
        const res = await getAddTeamList();
        if (res.code === 20000) {
          teamList.value = res.data
          listProp.value = 1
        }
      }
      if (data == 2) {
        const res = await getCreateTeamList();
        if (res.code === 20000) {
          teamList.value = res.data
          listProp.value = 2
        }
      }
      if (data == 3) {
        const res = await getExpireTeamList();
        if (res.code === 20000) {
          teamList.value = res.data
          listProp.value = 3
        }
      }
    },
    min() {
      let minIndex = -1, minHeight = Infinity;
      for (let i = 0; i < this.columnHeight.length; i++) {
        const h = this.columnHeight[i]
        if (h < minHeight) {
          minIndex = i
          minHeight = h
        }
      }
      return {minIndex, minHeight}
    },
    getItemList(nums, isFirst) {
      if (!this.isfinish) {
        this.loading = true
        let users = null;
        if (nums === 20) users = this.getData(nums)
        else users = [
          {
            id: 4,
            width: 40,
            height: 32,
            avatarUrl: '/static/avatars/avatar2.jpg',
            title: '音乐分享',
            description: '来听听我的歌'
          },
          {
            id: 5,
            width: 40,
            height: 32,
            avatarUrl: '/static/avatars/avatar2.jpg',
            title: '音乐分享',
            description: '来听听我的歌'
          }]
        const newUsers = users.filter(user => {
          return !this.itemList.some(item => item.id === user.id)
        })

        if (!newUsers.length) {
          this.isfinish = true
          return
        }
        newUsers.forEach((user) => {
          const domWidth = this.systemInfo.windowWidth
          const domHeight = this.systemInfo.windowHeight
          user.width = (user.width / 100) * domWidth
          user.height = (user.height / 100) * domHeight
          console.log(user)
        })
        this.computedItemPosition(newUsers, isFirst)
        this.loading = false
        this.itemList = [...this.itemList, ...newUsers]
      }
    },
    async init() {
      const that = this
      this.itemWidth = (this.waterfallContentWidth - (this.column - 1) * this.gap) / this.column
      this.getItemList(20, true);
    },
    computedItemPosition(list, isFirst) {
      list.forEach((item, index) => {
        const itemHeight = Math.floor((item.height * this.itemWidth) / item.width)
        if (isFirst && index < this.column) {
          //第一行
          this.ItemPos.push({
            y: 200,
            x: index % this.column !== 0 ? index * this.itemWidth + this.gap * index : index * this.itemWidth,
          })
          this.columnHeight.push(itemHeight + 180 + this.gap)
        } else {
          const {minIndex, minHeight} = this.min();
          this.ItemPos.push({
            x: minIndex % this.column !== 0 ? minIndex * this.itemWidth + this.gap * minIndex : minIndex * this.itemWidth,
            y: minHeight
          });
          this.columnHeight[minIndex] += itemHeight + this.gap;
        }
      })
    },

    onBottom() {
      console.log("触底逻辑")
      if (!this.isLoading) {
        this.isLoading = true
        console.log('触底了')
        //todo 触底逻辑
        this.getItemList(15, false)
        this.isLoading = false
        setTimeout(() => {
          this.isLoadingOver = true
        }, 1000)
      }
    },
    onTouchStart(e) {
      this.startTouch = {
        x: e.touches[0].pageX - this.buttonPosition.left,
        y: e.touches[0].pageY - this.buttonPosition.top
      };
    },
    onTouchMove(e) {
      const newLeft = e.touches[0].pageX - this.startTouch.x;
      const newTop = e.touches[0].pageY - this.startTouch.y;

      // 限制按钮在屏幕内
      const maxLeft = this.screenWidth - 60; // 按钮宽度
      const maxTop = this.screenHeight - 60; // 按钮高度

      this.buttonPosition.left = Math.max(0, Math.min(newLeft, maxLeft));
      this.buttonPosition.top = Math.max(0, Math.min(newTop, maxTop));
    },
    onTouchEnd() {
      console.log('Touch End');
      // 可以在这里添加其他逻辑
    },
    switchTab(index) {
      this.currentTab = index;
    },
    getData(nums) {
      return [{
        id: 1,
        width: 40,  // 宽度百分比
        height: 32, // 高度百分比
        avatarUrl: '/static/avatars/avatar1.jpg',
        title: 'OT十人局',
        description: '距离5.2km | 在线播放'
      },
        {
          id: 2,
          width: 40,
          height: 32,
          avatarUrl: '/static/avatars/avatar2.jpg',
          title: '音乐分享',
          description: '来听听我的歌'
        },
        {
          id: 3,
          width: 40,
          height: 32,
          avatarUrl: '/static/avatars/avatar2.jpg',
          title: '音乐分享',
          description: '来听听我的歌'
        },
        {
          id: 6,
          width: 40,
          height: 32,
          avatarUrl: '/static/avatars/avatar2.jpg',
          title: '音乐分享',
          description: '来听听我的歌'
        },
        {
          id: 7,
          width: 40,
          height: 32,
          avatarUrl: '/static/avatars/avatar2.jpg',
          title: '音乐分享',
          description: '来听听我的歌'
        }]
    },
    fetchWaterfallData(nums) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 20000,
            data: this.waterfallData
          })
        }, 500)
      })
    },
    handleTagClick(tag) {
      // 处理标签点击事件
      console.log('Tag clicked:', tag);
    }
  }
  , onReachBottom() {
    console.log("触底了")
    if (!this.isLoading) {
      console.log(this.systemInfo.clientHeight + this.scrollTop >= this.systemInfo.scrollHeight)
      console.log(this.systemInfo.clientHeight)
      console.log(this.scrollTop)
      console.log(this.systemInfo.scrollHeight)
      if (this.systemInfo.clientHeight + this.scrollTop >= this.systemInfo.scrollHeight) {
        this.isLoading = true
        console.log('触底了')
        //todo触底逻辑
        console.log("触底逻辑")
        this.getItemList(15, false)
        this.isLoading = false
        setTimeout(() => {
          this.isLoadingOver = true
        }, 1000)
      }
    }
  },
}
</script>

<style lang="scss">
.discover {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%);

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

}

.contentNav {
  display: flex;
}

.contentNav li {
  margin: 0.7rem 0 0.7rem 0.7rem;
  border-radius: 1rem;
  width: 3.6rem;
  height: 1.7rem;
  line-height: 1.7rem;
  text-align: center;
  background: rgba(255, 255, 255, .4);
  color: rgba(0, 0, 0, .9);
}

.contentNav li:first-child {
  background: rgba(255, 255, 255, 1);
}

.van-tabs__nav {
  background: #000;
}

.van-ellipsis {
  color: white;
}

.van-tabs__line {
  background: #fff !important;
}

.user-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
}

.tag-area {
  display: flex;
  flex-direction: column-reverse; // 从下往上排列
  width: 100vw; // 标签区域宽度
  height: 200px; // 限制高度
  overflow: hidden; // 隐藏超出部分
  position: relative;
}

.left-tags {
  align-items: flex-start; // 左对齐
}

.right-tags {
  align-items: flex-end; // 右对齐
}

.tag {
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 15px;
  min-width: 200rpx;
  height: 30px;
  line-height: 30px;
  color: white;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: absolute;
  cursor: pointer;
}

.tag:hover {
  opacity: 0.7;
}

@keyframes bubble-up {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 0.2;
  }
  20% {
    opacity: 0.4;
  }
  30% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
  60% {
    opacity: 1;
  }
  70% {
    opacity: 0.8;
  }
  80% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    transform: translateY(-350px);
    opacity: 0;
  }
}
</style>
