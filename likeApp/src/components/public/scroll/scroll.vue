<template>
  <div id="warpper" :style="WarStyle" ref="warpper">
      <div class="scroll" :style="setStyle">
        <slot></slot>
      </div>
  </div>
</template>

<script>
import Bscroll from "better-scroll";
export default {
  data() {
    return {};
  },
  props: {
    /********** 特殊 **********/
    setStyle: {
      // div.scroll 样式
      type: Object,
      default: function() {
        return {};
      }
    },
    WarStyle: {
      // div.warpper 样式
      type: Object,
      default: function() {
        return {};
      }
    },
    datas: {
      // 监听数据是否有更新,有则更新高度
      type: Array,
      default: null
    },
    /********** 滚动条属性开启 **********/
    click: {
      // 是否允许滚动内点击事件
      type: Boolean,
      default: true
    },
    probeType: {
      // 实时派发滚动操作事件, 可选值: 0 1 2 3
      type: Number,
      default: 1
    },
    scrollX: {
      // 横轴方向初始化位置 (滚动方向)
      type: Boolean,
      default: false
    },
    scrollY: {
      // 纵轴方向初始化位置  (滚动方向)
      type: Boolean,
      default: true
    },

    /********** 事件监听 **********/
    onScroll: {
      // 监听滚动条滚动
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const _this = this;
    this.$nextTick(() => {
      setTimeout(() => {

        let Prom = new Promise(function(resolve, reject) {
          let isCreat = _this._creatScroll();
          if (isCreat) resolve();
        });

        Prom.then(() => {
          this.$emit('creatSuccess')   // 创建滚动条成功后派发事件
        })
      }, 20);
    });
  },
  methods: {
    // 创建滚动条
    _creatScroll() {
      if (!this.$refs.warpper) return;

      // 配置
      let options = {
        click: this.click,
        scrollX: this.scrollX,
        scrollY: this.scrollY
      };

      this.scroll = new Bscroll(this.$refs.warpper, options);

      /************************ 事件监听start ************************/
      const _this = this;

      // 监听滚动条滚动
      if (this.onScroll) {
        this.scroll.on("scroll", pos => {
          // 滚动时候的pos定位
          _this.$emit("scroll", pos);
        });
      }
      /************************ 事件监听end ************************/

      return true;
    },

    /************************ 方法 ************************/
    scrollToElement() {
      // 滚动到某个元素
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments); // arguments = {el, time, offsetX, offsetY, easing}
    },
    scrollTo() {
      // 滚动到某个位置
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments); // arguments = {x, y, time, easing}
    },
    next() {
      //  滚动到下一个页面
      this.scroll && this.scroll.next.apply(this.scroll, arguments); // arguments = {time, easing}
    },
    goToPage() {
      // slide组件滚动到指定的页面
      this.scroll && this.scroll.goToPage.apply(this.scroll, arguments); // arguments = {x, y, time, easing}
    },

    /************************ 方法 - 通用 ************************/
    refresh() {
      // 重置高度
      this.scroll && this.scroll.refresh();
    },
    enable() {
      // 启动better-scroll
      this.scroll && this.scroll.enable();
    },
    disable() {
      // 禁用better-scroll
      this.scroll && this.scroll.disable();
    },
    destroy() {
      // 解除销毁 better-scroll 事件
      this.scroll && this.scroll.destroy();
    },
    getCurrentPage() {
      // 获取当前页面的信息
      if (this.scroll) return this.scroll.getCurrentPage();
    }
  },
  watch: {
    data: function() {
      this.$nextTick(() => {
        this.refresh();
      });
    },
    setStyle: function() {
      this.$nextTick(() => {
        this.refresh();
      });
    }
  },
  components: {
    Bscroll
  }
};
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";
#warpper {
  height: 100%;
  overflow: hidden;
}
</style>

