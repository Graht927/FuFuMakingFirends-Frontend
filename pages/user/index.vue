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
    <div :style="{height:'30vh',overflow: 'auto'}">
        <!--用户头像-->
      <div
          :style="{width: '100%',height: '100%',backgroundImage:
          'url('+`${userInfo.avatarUrl!=null? userInfo.avatarUrl:defaultAvatarUrl}`+')',backgroundPosition:'center',backgroundSize:'cover'}">
        <div
            style="height: 100%;width: 100%;backdrop-filter: blur(5px);">
          <div style="padding-top: 10%;display: flex">
            <van-image
                round
                width="6rem"
                height="6rem"
                style="padding-left: 2rem"
                :src="userInfo.avatarUrl!=''? userInfo.avatarUrl :this.BASEURL +'/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg'"
            />
            <div style="margin-left: 1.2rem">
              <span
                  style="display:inline-block;color:white;font-size: 1.2rem;font-weight: 400;width: 30vw;line-height: 6rem">
                {{ userInfo.nickname }}
              </span>
            </div>
          </div>
          <!--            底部-->
          <div style="width: 100%;height: 10vh;position: absolute;bottom: 0;overflow: hidden">
            <div style="padding: 0 1rem;">
              <div v-for="tag in tags" :key="tag.text"
                   style="display:inline-block;height: 1.2rem;color: #f5e9e9;border: 1px solid #312f2f;
                    border-radius: 1.2rem;padding: 0.2rem 0.5rem;font-size: 0.8rem;background:#59483d;opacity: 0.7;
                    margin: 0.4rem">
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="color:white;max-height: 70vh;">
      <div style="display: flex;padding-left: 1rem;padding-top: 0.5rem;padding-bottom: 0.5rem">
        <div
            style="width: 3rem;height: 1.2rem;padding: 0.2rem 0.5rem;border-radius: 0.3rem;background:#2d2d2d;margin: 0.4rem;text-align: center"
            :style="{color: '#c0bebe' }" v-if="clickTag != '动态'" @click="clickTag = '动态'">
          动态
        </div>
        <div
            style="width: 3rem;height: 1.2rem;padding: 0.2rem 0.5rem;border-radius: 0.3rem;background:#e3e3e3;margin: 0.4rem;text-align: center"
            :style="{color: '#414040' }" v-if="clickTag === '动态'">
          动态
        </div>
        <div
            style="width: 3rem;height: 1.2rem;padding: 0.2rem 0.5rem;border-radius: 0.3rem;background:#2d2d2d;margin: 0.4rem;text-align: center"
            :style="{color: '#c0bebe'}" v-if="clickTag != '活动'" @click="clickTag = '活动'">
          活动
        </div>
        <div
            style="width: 3rem;height: 1.2rem;padding: 0.2rem 0.5rem;border-radius: 0.3rem;background:#e3e3e3;margin: 0.4rem;text-align: center"
            :style="{color: '#414040' }" v-if="clickTag === '活动'">
          活动
        </div>
      </div>
      <scroll-view style="max-height: 52vh;overflow-y: scroll"
                   id="contentScrollView" class="content" scroll-y="true"
                   @scrolltolower="ReachBottom()" @scroll="handlerScroll"
                   enable-back-to-top="true" :scroll-top="scrollTop"
      >
        <tm-flowLayout v-show="clickTag === '动态'" @click="itemClick" ref="wafll1">
          <template v-slot:left="{hdata}">
            <view class="shadow-2 overflow">
              <block v-if="hdata && hdata.item && hdata.item.model === 'dynamic'">
                <image :src="hdata.item.image" style="border-radius: 0.5rem;width: 100%"
                       :style="{height: hdata.item.size + 'vh'}"/>
              </block>
            </view>
          </template>
          <template v-slot:right="{hdata}">
            <view class="shadow-2 overflow">
              <block v-if="hdata && hdata.item && hdata.item.model === 'dynamic'">
                <image :src="hdata.item.image" style="border-radius: 0.5rem;width: 100%"
                       :style="{height: hdata.item.size+ 'vh'}"/>
              </block>
            </view>
          </template>
        </tm-flowLayout>
        <tm-flowLayout v-show="clickTag === '活动'" @click="itemClick" ref="wafll2">
          <template v-slot:left="{hdata}">
            <view class="round-3 shadow-2 overflow">
              <block v-if="hdata.item.model==='group'">
                <view style="position:relative;" :style="{height:hdata.item.size+'vh'}">
                  <view
                      :style="{backgroundImage:`url(${hdata.item.image})`,filter:'blur(10px)'
                      ,height:`${hdata.item.height}px`,backgroundSize:'cover',backgroundPosition:'center'}">
                  </view>
                  <view
                      style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; justify-content: flex-end;">
                    <view
                        style="padding:1rem 1.2rem;border-radius: 1rem;">
                      <image :src="hdata.item.image"
                             style="width: 8rem; height: 8rem; border: 2px solid #dadada;border-radius: 1rem;
                              position: absolute;z-index: 1;top: 2rem;left: 1.3rem"/>
                      <image :src="hdata.item.image"
                             style="width: 7rem; height: 7rem; border: 2px solid #dadada;border-radius: 1rem;position: relative;left: 1.7rem;top: -2.5rem;
                          "/>
                    </view>
                    <view style="text-align: center;position:relative;top: -1.4rem">
                      <view style="display: flex;justify-content: center">
                        <image src="/static/icon/tip.png"
                               style="width: 1.5rem; height: 1.5rem; margin-right: 0.2rem;"></image>
                        <text style="color: white; font-size: 1rem; display: block;">OT十人局</text>
                      </view>
                      <text style="font-size: 0.8rem; display: block;color: #ccc">距离您{{ hdata.item.distance }}km |
                        正在报名
                      </text>
                      <view
                          style="display: flex;justify-content: space-around; align-items: center; margin: 0.5rem auto 0; background-color: rgba(0,0,0,.5);height: 2.2rem;width: 80%;border-radius: 2.2rem">
                        <view style="display: flex; align-items: center;">
                          <image v-for="(participant, index) in hdata.item.userAvatars" :key="index" :src="participant"
                                 style="width: 1.3rem; height: 1.3rem; border-radius: 50%; margin-right: -0.2rem;"/>
                        </view>
                        <span style="color: white; font-size: 0.8rem;">{{ hdata.item.currentCount }}人参与</span>
                      </view>
                    </view>
                  </view>
                </view>
              </block>
            </view>
          </template>
          <template v-slot:right="{hdata}">
            <view class="round-3 shadow-2 overflow">
              <block v-if="hdata.item.model==='group'">
                <view style="position:relative;" :style="{height:hdata.item.size+'vh'}">
                  <view
                      :style="{backgroundImage:`url(${hdata.item.image})`,filter:'blur(10px)'
                      ,height:`${hdata.item.height}px`,backgroundSize:'cover',backgroundPosition:'center'}">
                  </view>
                  <view
                      style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; justify-content: flex-end;">
                    <view
                        style="padding:1rem 1.2rem;border-radius: 1rem;">
                      <image :src="hdata.item.image"
                             style="width: 8rem; height: 8rem; border: 2px solid #dadada;border-radius: 1rem;
                              position: absolute;z-index: 1;top: 2rem;left: 1.3rem"/>
                      <image :src="hdata.item.image"
                             style="width: 7rem; height: 7rem; border: 2px solid #dadada;border-radius: 1rem;position: relative;left: 1.7rem;top: -2.5rem;
                          "/>
                    </view>
                    <view style="text-align: center;position:relative;top: -1.4rem">
                      <view style="display: flex;justify-content: center">
                        <image src="/static/icon/tip.png"
                               style="width: 1.5rem; height: 1.5rem; margin-right: 0.2rem;"></image>
                        <text style="color: white; font-size: 1rem; display: block;">OT十人局</text>
                      </view>
                      <text style="font-size: 0.8rem; display: block;color: #ccc">距离您{{ hdata.item.distance }}km |
                        正在报名
                      </text>
                      <view
                          style="display: flex;justify-content: space-around; align-items: center; margin: 0.5rem auto 0; background-color: rgba(0,0,0,.5);height: 2.2rem;width: 80%;border-radius: 2.2rem">
                        <view style="display: flex; align-items: center;">
                          <image v-for="(participant, index) in hdata.item.userAvatars" :key="index" :src="participant"
                                 style="width: 1.3rem; height: 1.3rem; border-radius: 50%; margin-right: -0.2rem;"/>
                        </view>
                        <span style="color: white; font-size: 0.8rem;">{{ hdata.item.currentCount }}人参与</span>
                      </view>
                    </view>
                  </view>
                </view>
              </block>
            </view>
    </template>
        </tm-flowLayout>
      </scroll-view>
    </div>
    <!-- 返回顶部按钮 -->
    <view v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
      <image src="/static/icon/back-to-top.png" mode="aspectFit" class="back-to-top-icon"/>
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
import Random from "@/tm-vuetify/tool/function/random";
import random from "@/tm-vuetify/tool/function/random";

export default {
  components: {
    GCard,
    BottomNavBar,
    tmFullView, tmMenubars, tmSearch, tmActionSheet, tmButton,
    tmFlotbutton, tmFlowLayout, tmIcons, tmLoadding, tmTags, tmMenu, tmImages, tmSwiper
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
      defaultAvatarUrl: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
      userInfo: {},
      tags: [], // 初始化空标签数组
      dynamics: [],
      groups: [],
      BASEURL: BASEURL,
      listProp: 0,
      statusBarHeight: 0,
      systemInfo: uni.getSystemInfoSync(),
      clickTag: "动态",
      // ====================================
      pageSize: 10,
      pageCount: 1,
      oldScrollTop: 0,
      scrollTop: 0,
      showBackToTop: false,
    }
  },
  onLoad() {
    this.getUserInfo()
    // this.randouh()
    this.getDynamicData()
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
  methods: {
    ReachBottom() {
      if (this.clickTag === '动态') {
        console.log("动态")
        this.getDynamicData()
      }
    },
    baseUrl(e) {
      console.log(e)
      return BASEURL + e
    },
    random(min, max) {
      return Math.random() * (max - min) + min;
    },
    handlerScroll(e) {
      this.showBackToTop = e.detail.scrollTop > 1000;
      this.oldScrollTop = e.detail.scrollTop;
    },
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getDynamicData() {
      const data = {
        pageSize: this.pageSize,
        pageNum: this.pageCount,
        uid: uni.getStorageSync("fufu-app-userId")
      }
      const that = this
      getDynamicsByUserId(data).then(res => {
        if (res.code === 20000) {
          if (res.data.length > 0) {
            let dynamics = res.data
            /*[
              {
                size: 26,
                image: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                model: "dynamic",
                author: {
                  avatar: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                  name: "测试用户1"
                },
                isLike: false,
                title: "OT | 爱喝野格的小姐姐"
              }, {
                size: 26,
                image: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                model: "dynamic",
                author: {
                  avatar: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                  name: "测试用户2"
                },
                isLike: false,
                title: "OT | 爱抽瑞克五代的顶针"

              }, {
                size: 26,
                image: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                model: "dynamic",
                author: {
                  avatar: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                  name: "测试用户2"
                },
                isLike: false,
                title: "OT | 爱抽瑞克五代的顶针"

              }, {
                size: 26,
                image: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                model: "dynamic",
                author: {
                  avatar: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                  name: "测试用户2"
                },
                isLike: false,
                title: "OT | 爱抽瑞克五代的顶针"

              }, {
                size: 26,
                image: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                model: "dynamic",
                author: {
                  avatar: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                  name: "测试用户2"
                },
                isLike: false,
                title: "OT | 爱抽瑞克五代的顶针"
              }, {
                size: 26,
                image: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                model: "dynamic",
                author: {
                  avatar: '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
                  name: "测试用户2"
                },
                isLike: false,
                title: "OT | 爱抽瑞克五代的顶针"
              }
            ];*/
            dynamics.map((item, index) => {
              item.size = item.size + this.randomInt(-1, 4)
              item.image = this.BASEURL + item.image
              item.author.avatar = this.BASEURL + item.author.avatar
            })
            this.$nextTick(function () {
              this.$refs.wafll1.pushData(dynamics)
            })
          }
          this.pageCount++
        }
      })
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
      this.$nextTick(function () {
        this.$refs.wafll1.pushData(dynamics)
        this.$refs.wafll2.pushData(groups)
      })
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
          this.userInfo = res.data
          if (res.data.tags) {
            console.log(res.data.tags)
            this.tags = res.data.tags.slice(2, -2).toString().split(',').map(tag => tag.trim().replace(/"/g, ''))
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
    }
  }
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
