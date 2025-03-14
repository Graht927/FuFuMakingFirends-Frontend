<template>
  <div class="item"
       :style="{
    backgroundImage: `url(${this.item.avatarUrl!=='' ? this.item.avatarUrl :'http://121.40.231.89:4443/i/static/avatarUrl.jpg'})`,
       height: column == 0? '30vh':'32vh',
       backgroundSize:'cover',backgroundRepeat:'no-repeat',backdropFilter:'blur(4px)',backgroundPosition:'center auto',
       boxShadow:  this.configStyle === 'dark'?'8px 7px 7px -8px rgba(255,255,255,0.2)': 'inset 14px 13px 7px -8px rgba(0,0,0,0.2)'
  }">
    <div class="card" :style="{height:  column ==0 ? CardHeight1:CardHeight2 }" :id="'dynamicId'+index">
      <div style="padding: 10px;position: relative" class="textUseFontByFuLuBangShu textContext">
        <div style="width: 100%;">
          <slot name="content" :item="item" :index="index">
          </slot>
        </div>
      </div>
    </div>
    <div class="footer" :style="{height: column==0? FooterHeight1:FooterHeight2,
     backgroundColor: bgColor,
      }">
      <slot name="footer" :item="item" :index="index">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GCard',
  props: {
    item: {
      type: Object,
    },
    index: {
      type: Number,
      default: 0
    },
    column: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      configStyle: uni.getStorageSync("configStyle"),
      bgColor: 'rgba(126,232,232,0.9)',
      fontColor: 'black',
      borderColor: 'black',
      CardHeight1: '25.5vh',
      CardHeight2: '27.2vh',
      FooterHeight1: '4.5vh',
      FooterHeight2: '4.8vh'
    }
  },
  created() {
    switch (this.configStyle) {
      case 'dark':
        this.bgColor = 'rgba(0,0,0,.85)';
        this.fontColor = 'white';
        this.borderColor = 'white';
        break;
      default:
        this.bgColor = 'rgba(189,186,186,0.9)';
        this.fontColor = 'black';
        this.borderColor = 'black';
        break;
    }
    if (this.$props.index === 30) {
      let tempHeight = this.CardHeight1
      this.CardHeight1 = this.CardHeight2
      this.CardHeight2 = tempHeight
      tempHeight = this.FooterHeight1
      this.FooterHeight1 = this.FooterHeight2
      this.FooterHeight2 = tempHeight
    }
    var dynamicId = "dynamicId" + this.index

  }
}
</script>

<style scoped>
.item {
  width: 100%;
  border-radius: 1rem;
}

.item .card {
  width: 100%;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  background: rgba(0, 0, 0, .2);
  backdrop-filter: blur(6px);
}

.footer {
  width: 100%;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
