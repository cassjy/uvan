<template>
  <div class="banner" ref="banner" v-if="data.length">
    <div class="bd" ref="bd">
      <a href="#" class="item" v-for="(item, index) in data" :key="item.F_Image" :class="{'current': currentPageIndex===index}"><img :src="item.F_Image"/></a>
    </div>
    <div class="hd" v-if="dot">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    dot:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  watch: {
    data(val, oval) {
      if (this.slide) this.slide.destroy();
      clearTimeout(this.watchTimes)
      this.watchTimes = setTimeout(() => {
        this._setSliderWidth();
        this._initSlider();
        if (this.autoPlay) {
          this._play();
        }
      }, 20);
    }
  },
  methods: {
    // 手动设置scroll宽度
    _setSliderWidth(isResize) {
      this.children = this.$refs.bd.children;
      let width = 0;
      let sliderWidth = this.$refs.banner.clientWidth;

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }


      if (this.loop && !isResize) width += 2 * sliderWidth;  // 无缝需要*2
      if(this.dot) this.dots = new Array(this.children.length); // 点
      
      this.$refs.bd.style.width = width + "px";
    },
    // 创建滚动条
    _initSlider() {
      this.slider = new BScroll(this.$refs.banner, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      });

      // 监听
      this.slider.on("scrollEnd", this._onScrollEnd);
      this.slider.on("touchend", () => {
        if (this.autoPlay) this._play();
      });

      this.slider.on("beforeScrollStart", () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
    },
    // 每次滚动结束
    _onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    // 自动播放
    _play() {
      clearTimeout(this.timer); 
      this.timer = setTimeout(() => {
        this.slider.next();
      }, 2000);
    }
  },
  mounted() {
    if (this.slide) this.slide.destroy();

    this.$nextTick(() => {
      if (!this.slider && this.data.length) {
        this._setSliderWidth();
        this._initSlider();
        if (this.autoPlay) {
          this._play();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (!this.slider || !this.slider.enabled) return;

      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.slider.isInTransition) {
          this._onScrollEnd();
        } else {
          if (this.autoPlay) this._play();
        }
        if (this.slider) {
          this._setSliderWidth(true);
          this.slider.refresh();
        }
      }, 60);
    });
  },// keep-alive 组件激活
  activated() {
    if (!this.slider) return;

    this.slider.enable();
    let pageIndex = this.slider.getCurrentPage().pageX;
    this.slider.goToPage(pageIndex, 0, 0);
    this.currentPageIndex = pageIndex;
    if (this.autoPlay) {
      this._play();
    }
  },
  // keep-alive 组件停用
  deactivated() {
    this.slider.disable();
    clearTimeout(this.timer);
  },
  // 实例销毁
  beforeDestroy() {
    this.slider.disable();
    clearTimeout(this.timer);
  }
};
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";
.banner {
  height: 320 / @rem;
  width: 650 / @rem;
  position: relative;
  padding-top: 40 / @rem;
  transform: translate3d(50 / @rem, 0, 0);
  .bd {
    text-align: center;
    .item {
      width: 650 / @rem;
      height: 320 / @rem;
      img {
        width: 100%;
        height: 100%;
        display: block;
        transform: scale(0.94);
        transition: all 0.4s;
        border-radius: 15 / @rem;
      }
    }
    .item.current img {
      transform: scale(1);
      box-shadow: 0 / @rem 4 / @rem 30 / @rem rgba(37, 37, 37, 0.1);
    }
    // .item:first-child img,
    // .item:last-child img {
    //   transform: scale(0.94);
    // }
    .item:first-child img,
    .item:last-child img {
      transform: scale(0.94);
    }

    a {
      display: block;
      float: left;
      border-radius: 15 / @rem;
    }
  }

  .hd {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 12 / @rem;
    left: 0;
    span {
      display: inline-block;
      margin: 0 6 / @rem;
      width: 15 / @rem;
      height: 15 / @rem;
      background-color: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
    }
    span.active {
      background-color: rgba(255, 255, 255, 0.8);
      width: 35 / @rem;
      border-radius: 15 / @rem;
    }
  }
}
</style>

