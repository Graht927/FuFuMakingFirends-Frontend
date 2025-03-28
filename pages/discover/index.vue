<template>
  <view class="discover">
    <!-- 顶部状态栏 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 标题栏 -->
    <view class="header">
      <text class="title">DISCOVER</text>
      <view class="indicators">
        <view class="dot"></view>
        <view class="line"></view>
      </view>
    </view>

    <!-- 内容区域 -->
            <view class="content">
              <!-- 轮播图 -->
      <view style="margin-bottom: 1rem">
              <swiper class="banner-swiper"
                      circular
                      autoplay
                      interval="3000"
                      duration="500"
                      indicator-dots
                      indicator-color="rgba(255, 255, 255, 0.3)"
                      indicator-active-color="#ffffff">
                <swiper-item v-for="(banner, index) in banners" :key="index">
                  <image :src="banner.image" mode="aspectFill"></image>
                </swiper-item>
              </swiper>
            </view>

      <!--      瀑布流-->
      <view style="padding:0 2%;margin-bottom: 10vh">
        <tm-flowLayout @click="itemClick" ref="wafll">
          <template v-slot:left="{hdata}" >
            <view class="round-3 shadow-2 overflow" >
              <block v-if="hdata.item.model==='dynamic'"  >
                <image :src="hdata.item.image" style="border-radius: 1rem;width: 50vw" :style="{height:hdata.item.size+'vh'}"/>
                <!--底部-->
                <view style="color: white;background: #1E1E1E">
                  <view class="text-overflow-2">
                    <text style="font-size: 0.9rem;">OT | 喝野格的小姐姐</text>
                  </view>
                  <view style="margin: 1vh 0;display: flex;justify-content: space-between;">
                    <view style="display: flex;margin-left: 3%">
                      <image :src="hdata.item.author.avatar"
                             style="width: 1.6rem;height: 1.6rem;border-radius: 50%"/>
                      <view class="text-overflow"
                            style="line-height: 1.6rem;font-size: 0.8rem;padding-left: 0.2rem;width: 28vw">FuFu测试账号1
                      </view>
                    </view>
                    <view style="margin-right: 5%;margin-top: 0.1rem">
                      <image src="/static/icon/like.png" style="width: 1.4rem;height: 1.4rem"></image>
                    </view>
                  </view>
                </view>
              </block>
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
                          <image src="/static/icon/tip.png" style="width: 1.5rem; height: 1.5rem; margin-right: 0.2rem;"></image>
                        <text style="color: white; font-size: 1rem; display: block;">OT十人局</text>
                        </view>
                      <text style="font-size: 0.8rem; display: block;color: #ccc">距离您{{ hdata.item.distance }}km | 正在报名
                      </text>
                      <view style="display: flex;justify-content: space-around; align-items: center; margin: 0.5rem auto 0; background-color: rgba(0,0,0,.5);height: 2.2rem;width: 80%;border-radius: 2.2rem">
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
            <view class="round-3 shadow-2 overflow" >
              <block v-if="hdata.item.model==='dynamic'" >
                <image :src="hdata.item.image" style="border-radius: 1rem;width: 50vw" :style="{height:hdata.item.size+'vh'}"/>
                <!--底部-->
                <view style="color: white;background: #1E1E1E">
                  <view class="text-overflow-2">
                    <text style="font-size: 0.9rem;">OT | 喝野格的小姐姐</text>
                  </view>
                  <view style="margin: 1vh 0;display: flex;justify-content: space-between;">
                    <view style="display: flex;margin-left: 3%">
                      <image :src="hdata.item.author.avatar"
                             style="width: 1.6rem;height: 1.6rem;border-radius: 50%"/>
                      <view class="text-overflow"
                            style="line-height: 1.6rem;font-size: 0.8rem;padding-left: 0.2rem;width: 28vw">FuFu测试账号1
                      </view>
                    </view>
                    <view style="margin-right: 5%;margin-top: 0.1rem">
                      <image v-if="!hdata.item.isLike" src="/static/icon/like.png" style="width: 1.4rem;height: 1.4rem"></image>
                      <image v-else src="/static/icon/click_like.png" style="width: 1.4rem;height: 1.4rem"></image>
                    </view>
                  </view>
                </view>
              </block>
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
                          <image src="/static/icon/tip.png" style="width: 1.5rem; height: 1.5rem; margin-right: 0.2rem;"></image>
                        <text style="color: white; font-size: 1rem; display: block;">OT十人局</text>
                        </view>
                      <text style="font-size: 0.8rem; display: block;color: #ccc">距离您{{ hdata.item.distance }}km | 正在报名
                      </text>
                      <view style="display: flex;justify-content: space-around; align-items: center; margin: 0.5rem auto 0; background-color: rgba(0,0,0,.5);height: 2.2rem;width: 80%;border-radius: 2.2rem">
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
      </view>
    </view>
    <!-- 发布按钮 -->
    <view
        class="publish-btn"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        :style="{ top: `${buttonPosition.top}px`, left: `${buttonPosition.left}px` }"
    >
      <view class="inner-circle">
        <view class="plus-icon"></view>
      </view>
    </view>

    <BottomNavBar :current-tab="0"/>
  </view>
</template>

<script>
import BottomNavBar from '@/components/BottomNavBar.vue'
import tmFlowLayout from '@/tm-vuetify/components/tm-flowLayout/tm-flowLayout.vue'
import {BASEURL} from "@/pages/utils/apiconf/image-api";

export default {
  components: {
    BottomNavBar, tmFlowLayout
  },
  data() {
    return {
      statusBarHeight: 0,
      buttonPosition: {top: 500, left: 0},
      startTouch: {x: 0, y: 0},
      screenWidth: 0,
      screenHeight: 0,
      banners: [
        {
          image: '/static/banner/banner1.jpg',
          title: 'Banner 1'
        },
        {
          image: '/static/banner/banner2.jpg',
          title: 'Banner 2'
        },
        {
          image: '/static/banner/banner3.jpg',
          title: 'Banner 3'
        }
      ],
      BASEURL:BASEURL,
      // --------------------------
      keyword: ''
    }
  },
  onLoad() {
    this.randouh();
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
    this.screenWidth = systemInfo.windowWidth;
    this.screenHeight = systemInfo.windowHeight;
    // 设置初始位置在屏幕右侧边缘
    this.buttonPosition = {
      top: 500,
      left: this.screenWidth - 60
    };

    /*this.$nextTick(function () {
      //向瀑布流添加相关列表数据。
      this.$refs.wafll.pushData([
        {image: 'https://picsum.photos/200/100'},
        {image: 'https://picsum.photos/200/200'},
        {image: 'https://picsum.photos/200/150'},
        {image: 'https://picsum.photos/200/50'},
        {image: 'https://picsum.photos/200/100'},
      ])
    })*/
  },
  methods: {
    onBottom() {
      console.log("触底逻辑")
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
      const maxLeft = this.screenWidth - 60;
      const maxTop = this.screenHeight - 60;

      this.buttonPosition.left = Math.max(0, Math.min(newLeft, maxLeft));
      this.buttonPosition.top = Math.max(0, Math.min(newTop, maxTop));
    },
    onTouchEnd() {
      console.log('Touch End');
    },
    itemClick(e) {
      console.log(e);
      uni.$tm.toast(e.dirIndex + ':' + e.childrenIndex)
    },
    del(e) {
      this.$refs.wafll.delItemData(e.dirIndex, e.childrenIndex)
    },
    //模拟数据，添加到列表中。
    randouh() {
      let list2 = [
        {
          size: 20,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户1"
          },
          isLike: false,
          title: "OT | 爱喝野格的小姐姐"
        }, {
          size: 20,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic"

        }, {
          size: 20,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户2"
          },
          isLike: false,
          title: "OT | 爱抽瑞克五代的顶针"

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
        }, {
          size: 20,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户2"
          },
          isLike: false,
          title: "OT | 爱抽瑞克五代的顶针"

        }, {
          size: 20,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户2"
          },
          isLike: false,
          title: "OT | 爱抽瑞克五代的顶针"

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
        }, {
          size: 20,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户2"
          },
          isLike: false,
          title: "OT | 爱抽瑞克五代的顶针"

        }, {
          size: 20,
          image: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
          model: "dynamic",
          author: {
            avatar: this.BASEURL + '/2025/03/23/f7afe779-8cf0-4253-a1a5-a918f4e61256.jpg',
            name: "测试用户2"
          },
          isLike: false,
          title: "OT | 爱抽瑞克五代的顶针"

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
        }
      ];
      this.$nextTick(function () {
        this.$refs.wafll.pushData(list2)
      })
    },
  }
}
</script>

<style lang="scss">
.discover {
  min-height: 100vh;
  background: linear-gradient(180deg, #1E1E1E 0%, #141414 100%);
  display: flex;
  flex-direction: column;

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

  .content {
    flex: 1;
    margin: 20rpx auto;
    width: 100%;

    .banner-swiper {
      width: 96%;
      margin: auto;
      height: 360rpx;
      border-radius: 20rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }

      :deep(.uni-swiper-dots) {
        bottom: 20rpx;
      }
    }
  }

  .publish-btn {
    position: fixed;
    right: 40rpx;
    top: 65vh;
    width: 110rpx;
    height: 110rpx;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(10px);
    touch-action: none;

    .inner-circle {
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #7F7FD5, #86A8E7, #91EAE4);
      display: flex;
      align-items: center;
      justify-content: center;

      .plus-icon {
        position: relative;
        width: 40rpx;
        height: 40rpx;

        &::before,
        &::after {
          content: '';
          position: absolute;
          background-color: #ffffff;
        }

        &::before {
          width: 40rpx;
          height: 4rpx;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }

        &::after {
          width: 4rpx;
          height: 40rpx;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
