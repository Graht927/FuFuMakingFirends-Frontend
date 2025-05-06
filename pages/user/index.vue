<template>
  <view class="discover">
    <!-- 顶部状态栏 -->
    <!--    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>-->

    <!--    <view class="header">
      <text class="title">USER</text>
      <view class="indicators">
        <view class="dot"></view>
        <view class="line"></view>
      </view>
        </view>-->
    <div class="user-profile-container">
      <!-- 背景图区域 -->
      <div class="profile-background"
           :style="{backgroundImage: 'url('+`${userInfo.avatarUrl!=null? userInfo.avatarUrl:defaultAvatarUrl}`+')'}">
        <div class="background-overlay">
          <!-- 用户基本信息区 -->
          <div class="user-info-section">
            <!-- 用户基本信息区域 -->
            <div class="user-basic-info">
              <!-- 左侧头像 -->
              <van-image
                  round
                  width="5rem"
                  height="5rem"
                  class="avatar"
                  :src="userInfo.avatarUrl!=''? userInfo.avatarUrl :BASEURL +'/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg'"
              />
              <!-- 右侧信息 -->
              <div class="user-details">
                <span class="nickname">{{ userInfo.nickname }}</span>

                <div class="user-tags">
                  <span v-if="userInfo.age" class="tag-item">{{ userInfo.age }}岁</span>
                  <span v-if="userInfo.gender" class="tag-item">
                    {{ userInfo.gender === 1 ? '男' : '女' }}
                  </span>
                  <span v-if="userInfo.addr" class="tag-item">
                    {{ userInfo.addr }}
              </span>
                </div>

                <div class="description">
                  {{ userInfo.profile || '这个人很懒，什么都没写~' }}
                </div>
              </div>
            </div>
            <!-- 底部操作栏 -->
            <div class="action-bar">
              <div class="stats-and-edit">
                <div class="stat-group">
                  <div class="stat-item">
                    <span class="stat-value">{{ focusCount || 0 }}</span>
                    <span class="stat-label" @click="goToFocusList">关注</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ fansCount || 0 }}</span>
                    <span class="stat-label" @click="goToFansList">粉丝</span>
                  </div>
                </div>
                <view class="edit-btn" @click="handleEdit">
                  编辑主页
                </view>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改 content-section 的结构 -->
    <div class="content-section">
      <!-- 标签栏保持不变 -->
      <div class="tab-bar">
        <div class="tab-item"
             :class="{ active: clickTag === '动态' }"
             @click="handleTagChange('动态')">
          <span class="tab-text">动态</span>
          <div class="tab-line" v-show="clickTag === '动态'"></div>
        </div>
        <div class="tab-item"
             :class="{ active: clickTag === '活动' }"
             @click="handleTagChange('活动')">
          <span class="tab-text">活动</span>
          <div class="tab-line" v-show="clickTag === '活动'"></div>
        </div>
        <div class="tab-item"
             :class="{ active: clickTag === '已加入' }"
             @click="handleTagChange('已加入')">
          <span class="tab-text">已加入</span>
          <div class="tab-line" v-show="clickTag === '已加入'"></div>
        </div>
      </div>

      <!-- 修改滚动区域结构 -->
      <scroll-view
          class="content-scroll"
          scroll-y="true"
          @scroll="handlerScroll"
          :scroll-top="scrollTop"
          :refresher-enabled="false"
          :show-scrollbar="false"
          :enhanced="true"
          :bounce="false">
        <div class="content-wrapper">
          <!-- 动态列表 -->
          <block v-if="clickTag === '动态'">
            <water-fall
                :list="dynamics"
                @itemClick="handleItemClick"
                @imageLoad="handleImageLoad"
                ref="waterfall"
                class="waterfall-container"/>
            <!-- 加载提示 -->
            <view class="loading-tip" v-if="loading">
              <text>加载中...</text>
            </view>
            <view class="loading-tip" v-if="!hasMore && dynamics.length > 0">
              <text>没有更多数据了</text>
            </view>
            <view class="empty-tip" v-if="!loading && dynamics.length === 0">
              <text>暂无动态</text>
            </view>
          </block>

          <!-- 活动列表 -->
          <block v-else-if="clickTag === '活动' || clickTag === '已加入'">
            <water-fall
                :list="clickTag === '活动' ? groups : joinedGroups"
                @itemClick="handleItemClick"
                @imageLoad="handleImageLoad"
                ref="waterfallGroup"
                class="waterfall-container">
              <template #default="{ item }">
                <div class="group-item">
                  <div class="group-cover">
                    <img :src="item.image" :alt="item.title"/>
                    <div class="distance" v-if="item.distance">{{ item.distance }}km</div>
                  </div>
                  <div class="group-content">
                    <div class="group-title">{{ item.title }}</div>
                    <div class="group-info">
                      <div class="member-avatars">
                        <img
                            v-for="(avatar, index) in item.userAvatars"
                            :key="index"
                            :src="avatar"
                            class="avatar"
                            :style="{ zIndex: item.userAvatars.length - index }"
                        />
                      </div>
                      <div class="member-count">
                        <span class="count">{{ item.currentCount }}/{{ item.userCount }}</span>
                        <span>人</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </water-fall>
            <!-- 加载提示 -->
            <view class="loading-tip" v-if="loading">
              <text>加载中...</text>
            </view>
            <view class="loading-tip"
                  v-if="!hasMore && (clickTag === '活动' ? groups.length > 0 : joinedGroups.length > 0)">
              <text>没有更多数据了</text>
            </view>
            <view class="empty-tip"
                  v-if="!loading && (clickTag === '活动' ? groups.length === 0 : joinedGroups.length === 0)">
              <text>暂无活动</text>
            </view>
          </block>
        </div>
      </scroll-view>
    </div>

    <!-- 返回顶部按钮 -->
    <view v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
      <image src="/static/icon/back-to-top.png" mode="aspectFit" class="back-to-top-icon"/>
    </view>
    <!-- 发布按钮 -->
    <view
        v-if="clickTag !== '已加入'"
        class="publish-btn"
        @click="handlePublish"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        :style="{ top: `${buttonPosition.top}px`, left: `${buttonPosition.left}px` }"
    >
      <view class="inner-circle">
        <view class="plus-icon">
          <view class="plus-icon-before"></view>
          <view class="plus-icon-after"></view>
        </view>
      </view>
    </view>
    <BottomNavBar :current-tab="4"/>
  </view>
</template>


<script>
import GCard from '@/components/GCard.vue'
import BottomNavBar from '@/components/BottomNavBar.vue'
import {getUserInfoByUId} from "@/pages/utils/apis/user";
import tmFullView from "@/tm-vuetify/components/tm-fullView/tm-fullView.vue";
import tmMenubars from "@/tm-vuetify/components/tm-menubars/tm-menubars.vue";
import tmSearch from "@/tm-vuetify/components/tm-search/tm-search.vue";
import tmActionSheet from "@/tm-vuetify/components/tm-actionSheet/tm-actionSheet.vue";
import tmButton from "@/tm-vuetify/components/tm-button/tm-button.vue";
import tmFlotbutton from "@/tm-vuetify/components/tm-flotbutton/tm-flotbutton.vue";
import tmFlowLayout from "@/tm-vuetify/components/tm-flowLayout/tm-flowLayout.vue";
import tmIcons from "@/tm-vuetify/components/tm-icons/tm-icons.vue";
import tmLoadding from "@/tm-vuetify/components/tm-loadding/tm-loadding.vue";
import tmTags from "@/tm-vuetify/components/tm-tags/tm-tags.vue";
import tmMenu from "@/tm-vuetify/components/tm-menu/tm-menu.vue";
import tmImages from "@/tm-vuetify/components/tm-images/tm-images.vue";
import tmSwiper from "@/tm-vuetify/components/tm-swiper/tm-swiper.vue";
import {BASEURL} from "@/pages/utils/apiconf/image-api";
import {getDynamicsByUserId} from "@/pages/utils/apis/user/dynamic";
import WaterFall from '@/components/WaterFall.vue'
import {getCreateActivity, joinActivityList} from "@/pages/utils/apis/organizeBureau/activity";
import {getFansCount, getFocusCount} from "@/pages/utils/apis/socializing/focus";

export default {
  components: {
    GCard,
    BottomNavBar,
    tmFullView, tmMenubars, tmSearch, tmActionSheet, tmButton,
    tmFlotbutton, tmFlowLayout, tmIcons, tmLoadding, tmTags, tmMenu, tmImages, tmSwiper, WaterFall
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
      defaultAvatarUrl: BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
      userInfo: {},
      dynamics: [],
      groups: [],
      joinedGroups: [],
      BASEURL: BASEURL,
      listProp: 0,
      statusBarHeight: 0,
      systemInfo: uni.getSystemInfoSync(),
      clickTag: "动态",
      // ====================================
      pageSize: 10,
      pageCount: 1,
      loading: false,
      hasMore: true,
      oldScrollTop: 0,
      scrollTop: 0,
      showBackToTop: false,
      buttonPosition: {top: 500, left: 0},
      startTouch: {x: 0, y: 0},
      screenWidth: 0,
      screenHeight: 0,
      scrollTimer: null, // 添加一个用于防抖的计时器
      fansCount: 0,
      focusCount: 0,
    }
  },
  onShow (){
     getFansCount().then(res => {
      this.focusCount = res.data;
    })
    getFocusCount().then(res => {
      this.fansCount = res.data;
    })
  },
  onLoad() {
    this.getUserInfo();
    if (this.clickTag === '动态') {
      this.getDynamicData();
    } else if (this.clickTag === '活动') {
      this.getGroupData();
    }
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    this.screenWidth = systemInfo.windowWidth;
    this.screenHeight = systemInfo.windowHeight;
  },
  computed: {},
  mounted() {
    // 获取系统信息
    console.log(this.systemInfo)
    // 监听滚动
  },
  async onReachBottom() {
    await this.ReachBottom()
  },
  methods: {
    // 修改触底加载方法
    async ReachBottom() {
      console.log('触底加载', this.loading, this.hasMore);
      if (this.loading || !this.hasMore) return;

      try {
        if (this.clickTag === '动态') {
          console.log("触底加载动态")
          await this.getDynamicData();
        } else if (this.clickTag === '活动') {
          console.log("触底加载活动")
          await this.getGroupData();
        } else if (this.clickTag === '已加入') {
          console.log("触底加载已加入活动")
          await this.getJoinedGroupData();
        }
      } catch (error) {
        console.error('加载失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    },

    // 修改滚动处理方法
    handlerScroll(e) {
      // 只在滚动超过一定距离时显示返回顶部按钮
      this.showBackToTop = e.detail.scrollTop > 500;
      this.oldScrollTop = e.detail.scrollTop;
    },

    // 修改数据加载方法
    async getDynamicData() {
      if (this.loading || !this.hasMore) return;

      this.loading = true; // 设置加载状态
      try {
        const data = {
          pageSize: this.pageSize,
          pageNum: this.pageCount,
          uid: uni.getStorageSync("fufu-app-userId")
        };

        const res = await getDynamicsByUserId(data);
        if (res.code === 20000) {
          if (res.data.length === 0) this.dynamics = [];
          if (res.data && res.data.length > 0) {
            const dynamics = res.data.map(item => ({
              ...item,
              size: 26,
              image: this.BASEURL + item.image,
              day: item.images[0].split('/')[3],
              month: item.images[0].split('/')[2],
              userId: item.userId
            }));
            if (this.pageCount === 1) {
              this.dynamics = dynamics;
            } else
                // 追加新数据
              this.dynamics = [...this.dynamics, ...dynamics];

            // 更新页码和加载状态
            this.pageCount++;
            this.hasMore = res.data.length >= this.pageSize;

            // 等待数据更新完成后再更新瀑布流布局
            await this.$nextTick();
            if (this.$refs.waterfall) {
              await this.$refs.waterfall.distributeItems(this.dynamics);
            }
          } else {
            this.hasMore = false;
            if (this.dynamics.length > 0) {
              uni.showToast({
                title: '没有更多数据了',
                icon: 'none'
              });
            }
          }
        }
      } catch (error) {
        console.error('加载动态数据失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false; // 无论成功失败都要关闭加载状态
      }
    },
    itemClick(e) {
      console.log(e);
      uni.$tm.toast(e.dirIndex + ':' + e.childrenIndex)
    },
    //模拟数据，添加到列表中。
    async randouh() {
      let dynamics = [
        {
          size: 26,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户1"
          },
          isLike: false,
          title: "OT | 爱喝野格的小姐姐"
        }, {
          size: 26,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户2"
          },
          isLike: false,
          title: "OT | 爱抽瑞克五代的顶针"

        }, {
          size: 26,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户2"
          },
          isLike: false,
          title: "OT | 爱抽瑞克五代的顶针"

        }, {
          size: 26,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户2"
          },
          isLike: false,
          title: "OT | 爱抽瑞克五代的顶针"

        }, {
          size: 26,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户2"
          },
          isLike: false,
          title: "OT | 爱抽瑞克五代的顶针"
        }, {
          size: 26,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户2"
          },
          isLike: false,
          title: "OT | 爱抽瑞克五代的顶针"
        }
      ];
      let groups = [
        {
          size: 36,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "group",
          distance: 1.5,
          title: "OT十人局",
          //todo 限制长度为3
          userAvatars: [
            this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg'
          ],
          userCount: 5,
          currentCount: 3
        }, {
          size: 36,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "group",
          distance: 1.5,
          title: "OT十人局",
          //todo 限制长度为3
          userAvatars: [
            this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg'
          ],
          userCount: 5,
          currentCount: 3
        },
      ]
      this.$nextTick(() => {
        if (this.clickTag === '动态' && this.$refs.waterfall) {
          this.$refs.waterfall.addItems(dynamics);
        }
        if (this.clickTag === '活动' && this.$refs.waterfallGroup) {
          this.$refs.waterfallGroup.addItems(groups);
        }
      });
    },
    getUserInfo() {
      var uid = uni.getStorageSync("fufu-app-userId");
      if (uid === "") {
        uni.redirectTo({
          url: '/pages/Login'
        })
      }
      getUserInfoByUId(uid).then(res => {
        console.log(res)
        if (res.code === 20000) {
          this.userInfo = {
            ...res.data,
            followCount: res.data.followCount || 0,
            fansCount: res.data.fansCount || 0,
            description: res.data.description || '',
            age: res.data.age || '',
            gender: res.data.gender || '',
            addr: res.data.addr || ''
          }
          this.userInfo.avatarUrl = this.BASEURL + this.userInfo.avatarUrl
        } else {
          uni.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          })
          uni.redirectTo({
            url: '/pages/Login'
          })
        }
      })
    },
    scrollToTop() {
      this.scrollTop = this.oldScrollTop
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
    onTouchStart(e) {
      // 记录触摸开始时的位置
      this.startTouch = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
    },
    onTouchMove(e) {
      // 计算手指移动的偏移量
      const deltaX = e.touches[0].pageX - this.startTouch.x;
      const deltaY = e.touches[0].pageY - this.startTouch.y;

      // 更新按钮的位置
      const newLeft = this.buttonPosition.left + deltaX;
      const newTop = this.buttonPosition.top + deltaY;

      // 限制按钮在屏幕内
      const maxLeft = this.screenWidth - 60; // 按钮宽度为 60px
      const maxTop = this.screenHeight - 60; // 按钮高度为 60px

      this.buttonPosition.left = Math.max(0, Math.min(newLeft, maxLeft));
      this.buttonPosition.top = Math.max(0, Math.min(newTop, maxTop));

      // 更新触摸起始位置，以便下一次移动计算
      this.startTouch = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
    },
    onTouchEnd() {
      // 不需要在 touchend 时做任何操作
    },
    handlePublish() {
      if (this.clickTag === '动态') {
        uni.navigateTo({
          url: '/pages/createDynamic/createDynamic',
          success: (res) => {
            res.eventChannel.on('publishSuccess', (newDynamic) => {
              newDynamic.image = this.BASEURL + newDynamic.images[0]
              this.dynamics = [newDynamic, ...this.dynamics];
              this.$nextTick(() => {
                this.$refs.waterfall?.distributeItems(this.dynamics);
              });
            });
          }
        });
      } else if (this.clickTag === '活动') {
        uni.navigateTo({
          url: '/pages/createActivity/createActivity'
        });
      }
    },
    handleItemClick(item) {
      console.log('点击项目:', item);
    },

    handleImageLoad(data) {
      console.log('图片加载完成:', data);
    },

    handleEdit() {
      uni.navigateTo({
        url: '/pages/user/EditProfile'
      })
    },
    async handleTagChange(tag) {
      if (this.clickTag === tag) return;

      this.clickTag = tag;
      this.resetData(); // 重置数据状态

      // 清空数据并重新加载
      if (tag === '动态') {
        await this.getDynamicData();
      } else if (tag === '活动') {
        await this.getGroupData();
      } else if (tag === '已加入') {
        await this.getJoinedGroupData();
      }
    },
    resetData() {
      this.pageCount = 1;
      this.hasMore = true;
      this.loading = false;
      this.dynamics = [];
      this.groups = [];
      this.joinedGroups = [];
      this.scrollTop = 0;

      // 清除瀑布流布局
      this.$nextTick(() => {
        if (this.$refs.waterfall) {
          this.$refs.waterfall.distributeItems([]);
        }
        if (this.$refs.waterfallGroup) {
          this.$refs.waterfallGroup.distributeItems([]);
        }
      });
    },
    async getGroupData() {
      if (this.pageCount !== 1) if (this.loading || !this.hasMore) return;
      this.loading = true;
      try {
        const res = await getCreateActivity({
          pageSize: this.pageSize,
          pageNum: this.pageCount
        });

        if (res.code === 20000) {
            const groups = res.data.map(item => ({
              ...item,
              id: item.id,
              size: 36,
              image: this.BASEURL + item.teamImage,
              model: "group",
              title: item.name,
              distance: item.address,
              userAvatars: (item.teamUserInfos || []).slice(0, 3).map(avatar => this.BASEURL + avatar.avatarUrl),
              userCount: item.maxNum,
              currentCount: item.currentNum,
              group: {
                ...item,
                coverImage: this.BASEURL + item.teamImage
              }
            }));
            if (this.pageCount === 1) {
          if (res.data.length === 0) this.groups = [];else
              this.groups = groups;
            } else {
              this.groups = [...this.groups, ...groups];
            }
            // 更新页码和加载状态
            this.pageCount++;
            this.hasMore = res.data.length >= this.pageSize;

            // 等待数据更新完成后再更新瀑布流布局
            await this.$nextTick();
            if (this.$refs.waterfallGroup) {
              await this.$refs.waterfallGroup.distributeItems(this.groups);
            }
        }
      } catch (error) {
        console.error('加载活动数据失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    async getJoinedGroupData() {
      if (this.pageCount !== 1) if (this.loading || !this.hasMore) return;

      this.loading = true;
      try {
        const res = await joinActivityList({
          pageSize: this.pageSize,
          pageNum: this.pageCount
        });

        if (res.code === 20000) {
          if (res.data.length === 0) this.joinedGroups = [];
            const groups = res.data.map(item => ({
              ...item,
              id: item.id,
              size: 36,
              image: this.BASEURL + item.teamImage,
              model: "group",
              title: item.name,
              distance: item.address,
              userAvatars: (item.teamUserInfos || []).slice(0, 3).map(avatar => this.BASEURL + avatar.avatarUrl),
              userCount: item.maxNum,
              currentCount: item.currentNum,
              group: {
                ...item,
                coverImage: this.BASEURL + item.teamImage
              }
            }));
            if (this.pageCount === 1) {
              this.joinedGroups = groups;
            } else {
              this.joinedGroups = [...this.joinedGroups, ...groups];
            }

            // 更新页码和加载状态
            this.pageCount++;
            this.hasMore = res.data.length >= this.pageSize;

            // 等待数据更新完成后再更新瀑布流布局
            await this.$nextTick();
            if (this.$refs.waterfallGroup) {
              await this.$refs.waterfallGroup.distributeItems(this.joinedGroups);
            }
          }
      } catch (error) {
        console.error('加载已加入活动数据失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    goToFocusList() {
      uni.navigateTo({
        url: '/pages/user/FocusList' // 确保路径正确
      });
    },

    goToFansList() {
      uni.navigateTo({
        url: '/pages/user/FansList' // 确保路径正确
      });
    }
  },
  beforeDestroy() {
    // 清理防抖计时器
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }
  },
  watch: {
    dynamics: {
      handler(newVal) {
        console.log('动态数据更新，当前数量:', newVal.length);
        this.$nextTick(() => {
          if (this.$refs.waterfall) {
            this.$refs.waterfall.distributeItems(newVal);
          }
        });
      },
      deep: true
    }
  },
  onUnload() {
    // 组件卸载时重置数据
    this.resetData();
  },
}
</script>

<style lang="scss" scoped>
.discover {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%);
  display: flex;
  flex-direction: column;
}

.user-profile-container {
  position: relative;
  height: 28vh;
}

.profile-background {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}

.background-overlay {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8));
  backdrop-filter: blur(10px);
  display: flex;
  padding: 0 1.5rem 0;
  flex-direction: column;
  justify-content: flex-end;
}

.user-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; // 增加基本信息和操作栏之间的间距
}

.user-basic-info {
  display: flex;
  gap: 1.2rem;
}

.avatar {
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.nickname {
  font-size: 1.3rem;
  color: white;
  font-weight: 500;
}

.user-tags {
  display: flex;
  gap: 0.8rem;
}

.tag-item {
  padding: 0.2rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
}

.description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.4;
}

// 底部操作栏样式
.action-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.stats-and-edit {
  display: flex;
  align-items: center;
  gap: 1rem; // 调整关注/粉丝组和编辑按钮之间的间距
}

.stat-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  padding: 0.4rem 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 0 0.8rem;
  position: relative;

  &:first-child {
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 1rem;
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .stat-value {
    color: white;
    font-size: 1.1rem;
    font-weight: bold;
    margin-right: 0.4rem;
  }

  .stat-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
}

.edit-btn {
  padding: 0.5rem 1.2rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 100px;
  color: white;
  font-size: 0.95rem;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.2);
  }
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #141414;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
  z-index: 1;
  position: relative;
  height: calc(100vh - 28vh); // 减去用户信息区域的高度
}

.tab-bar {
  display: flex;
  flex-shrink: 0;
  padding: 15px 20px;
  background: #1A1A1A;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.tab-item {
  position: relative;
  padding: 8px 24px;
  margin-right: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  .tab-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 16px;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .tab-line {
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 3px;
    background: linear-gradient(90deg, #7F7FD5, #86A8E7);
    border-radius: 3px;
    transition: all 0.3s ease;
  }

  &.active {
    .tab-text {
      color: #FFFFFF;
    }

    .tab-line {
      width: 30px;
    }
  }
}

.content-scroll {
  flex: 1;
  position: relative;
  height: 100%; // 让滚动区域填满剩余空间
}

.content-wrapper {
  padding: 10px 5px;
  padding-bottom: 100px; // 为底部导航栏留出空间
  box-sizing: border-box;
}

.waterfall-container {
  width: 100%;
  column-count: 2;
  column-gap: 10px;
  padding: 0 5px;
  min-height: calc(100vh - 28vh - 56px - 100px);
}

// 修改瀑布流项目样式
::v-deep .waterfall-container {
  // 动态项目样式
  .waterfall-item[data-type="dynamic"] {
    break-inside: avoid;
    margin-bottom: 10px;
    border-radius: 12px;
    overflow: hidden;
    background: #1A1A1A;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }

    .dynamic-content {
      padding: 12px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      line-height: 1.4;
    }
  }

  // 活动项目样式
  .group-item {
    break-inside: avoid;
    margin-bottom: 10px;
    border-radius: 12px;
    overflow: hidden;
    background: #1A1A1A;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }

    .group-cover {
      position: relative;
      width: 100%;
      padding-bottom: 100%; // 1:1 宽高比
      overflow: hidden;

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }

      .distance {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(0, 0, 0, 0.6);
        padding: 4px 8px;
        border-radius: 100px;
        color: white;
        font-size: 12px;
        backdrop-filter: blur(4px);
        z-index: 2;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
        pointer-events: none;
      }
    }

    .group-content {
      padding: 12px;
      background: #1A1A1A;
    }

    .group-title {
      color: white;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .group-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
    }

    .member-avatars {
      display: flex;
      align-items: center;

      img.avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid #1A1A1A;
        margin-left: -8px;
        object-fit: cover;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &:first-child {
          margin-left: 0;
        }
      }
    }

    .member-count {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      background: rgba(255, 255, 255, 0.1);
      padding: 4px 8px;
      border-radius: 100px;

      .count {
        color: #86A8E7;
        margin: 0 4px;
        font-weight: 500;
      }
    }
  }
}

// 优化加载提示样式
.loading-tip, .empty-tip {
  text-align: center;
  padding: 15px 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  background: transparent;
  width: 100%;
  position: relative;
  z-index: 2;
}

// 返回顶部按钮样式优化
.back-to-top {
  bottom: 80px; // 调整位置，避免与底部导航栏重叠
}

// 发布按钮样式优化
.publish-btn {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7F7FD5, #86A8E7);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  .inner-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .plus-icon {
      position: relative;
      width: 20px;
      height: 20px;

      .plus-icon-before,
      .plus-icon-after {
        content: '';
        position: absolute;
        background: white;
        border-radius: 2px;
      }

      .plus-icon-before {
        width: 20px;
        height: 2px;
        top: 9px;
      }

      .plus-icon-after {
        width: 2px;
        height: 20px;
        left: 9px;
      }
    }
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}
</style>
