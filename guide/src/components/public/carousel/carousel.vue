/*
 *轮播图公用组件
 * @Author: rex 
 * @Date: 2018-04-11 08:54:34 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-11 18:18:16
 */

<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <!-- slides -->
    <swiper-slide v-for="(item,index) in carouselList" :key="item.id">
    <div class="dot"></div>
    {{item.nickname}}{{item.goodsname}}
    </swiper-slide>

    <!-- Optional controls -->
    <div class="swiper-pagination" slot="pagination"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
    <div class="swiper-scrollbar" slot="scrollbar"></div>
  </swiper>
</template>
  
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'carrousel',
  data() {
    return {
      swiperOption: {
        //以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
        notNextTick: false,
        autoplay: {
          disableOnInteraction: false //手动滑动后不停止
        },
        direction: 'vertical',
        grabCursor: true,
        setWrapperSize: true,
        autoHeight: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        prevButton: '.swiper-button-prev', //上一张
        nextButton: '.swiper-button-next', //下一张
        scrollbar: '.swiper-scrollbar', //滚动条
        mousewheelControl: true,
        observeParents: true,
        loop: true, //衔接
        height: this.heightValue //接收父组件传来的高度
      }
    }
  },
  props: ['heightValue', 'carouselList'], //父组件传过来的高度和数组
  components: {
    swiper,
    swiperSlide
  }
}
</script>
<style lang="less" scoped>
@import '../../../common/css/defult.less';
/* 轮播图滑动 */
.swiper-wrapper {
  width: 90%;
  height: 42/@rem;
  text-align: left !important;
}
.swiper-slide-active {
  width: 100%;
  height: 42/@rem;
  line-height: 42/@rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}
.dot{
  width:16/@rem;
  height:16/@rem;
  background:#222;
  margin-right:10/@rem; 
  left: 20/@rem;
  border-radius:100%;
  display: inline-block;
}
</style>
