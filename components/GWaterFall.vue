<template>
  <div class="waterfall-container">
    <div class="waterfall-content" ref="contentRef">
      <div class="waterfall-items">
        <div class="waterfall-item" v-for="(item,index) in itemList" :key="item.id"
             :style="{
          width: itemWidth+'px',
          height: item.height+'vh',
          transform: `translate3d(${ItemPos[index].x}px, ${ItemPos[index].y}px, 0)`
        }">

          <slot name="content" :itemData="item" :index="index"></slot>
        </div>
      </div>
      <div>
        <van-loading v-if="isLoading" vertical>
          <template #icon>
            <GIcon name="loading"/>
          </template>
          加载中~等着吧小屁孩...
        </van-loading>
        <div v-if="isLoadingOver">
          <div style="text-align: center;font-size: 0.9rem"
               :style="{color:fontColor2}">
            加载到底了
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GWaterFall',
  props: {
    params: {
      type: Function,
      required: true
    },
    gap: {
      type: Number,
      default: 10
    },
    column: {
      type: Number,
      default: 2
    },
    systemInfo: {
      type: Object
    }
  },
  data() {
    return {
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
      waterfallContentWidth: null
    }
  },
  computed: {
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
    }
  },

  methods: {
    getItemList(nums, isFirst) {
      if (!this.isfinish) {
        this.loading = true
        const users = this.params(nums)

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
        })
        this.computedItemPosition(newUsers, isFirst)
        this.loading = false
        return [...this.itemList, ...newUsers]
      }
    }
    ,
    async init() {
      const that = this
      this.itemWidth = (this.waterfallContentWidth - (this.column - 1) * this.gap) / this.column
      this.itemList = this.getItemList(20, true);
    },
    computedItemPosition(list, isFirst) {
      list.forEach((item, index) => {
        const itemHeight = Math.floor((item.height * this.itemWidth) / item.width)
        if (isFirst && index < this.column) {
          //第一行
          this.ItemPos.push({
            y: 0,
            x: index % this.column !== 0 ? index * this.itemWidth + this.gap * index : index * this.itemWidth,
          })
          this.columnHeight.push(itemHeight + this.gap)
        } else {
          const {minIndex, minHeight} = this.min;
          this.ItemPos.push({
            x: minIndex % this.column !== 0 ? minIndex * this.itemWidth + this.gap * minIndex : minIndex * this.itemWidth,
            y: minHeight
          });
          this.columnHeight[minIndex] += itemHeight + this.gap;
        }
      })
    },
    onReachBottom() {
      if (!this.isLoading) {
        if (clientHeight + this.scrollTop >= scrollHeight) {
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
    onBottom() {
      // 获取可视高度
      const clientHeight = this.systemInfo.windowHeight
      // 获取滚动高度
      const query = uni.createSelectorQuery().in(this)
      query.select('.waterfall-content').boundingClientRect(data => {
        if (data) {
          const scrollHeight = data.height

        }
      }).exec()
    }
  },
  mounted() {
    // 获取系统信息
    console.log(this.systemInfo)
    this.waterfallContentWidth = this.systemInfo.windowWidth - Math.floor(20 / 750 * this.systemInfo.windowWidth) * 2
    this.init()
    console.log(this.itemList)
    // 监听滚动
    setInterval(() => {
      const query = uni.createSelectorQuery().in(this)
      query.select('.waterfall-content').scrollOffset(data => {
        if (data) {
          this.scrollTop = data.scrollTop
        }
      }).exec()
    }, 100)
  },
  watch: {
    scrollTop() {
      this.onBottom()
    }
  }
}
</script>

<style scoped lang="scss">
.waterfall {
  &-container {
    width: 100%;
    height: 100%;
  }

  &-content {
    width: 100%;
    height: 100%;
    margin-bottom: 12vh;
    overflow-y: scroll;
  }

  &-items {
    width: 100%;
    position: relative;
  }

  &-item {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
  }
}
</style>
