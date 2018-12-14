/*
    数据结构Tab切换:
    [
        {tit: '品牌成就', img: 'https://uvpt.uvanart.com/upload/static/home/intoUV/1.jpg'},
        {tit: '品牌简介', img: 'https://uvpt.uvanart.com/upload/static/home/intoUV/2.jpg'},
        {tit: '创始人心声', img: 'https://uvpt.uvanart.com/upload/static/home/intoUV/3.jpg'}
    ]
*/

<template>
  <div id="swiperTab">
        <div class="hd">
          <span 
            class="item" 
            v-for="(item, index) in data" 
            :key="index" 
            :class="{active: index === active}"
            @click="_selItem(index, item.pathName)"
          >{{item.tit}}</span>
        </div>

        <swiper 
            height="5.33333333rem"
            v-model="active"
            :show-dots="false" 
            :show-desc-mask="false" 
            @on-index-change="_swiperIndex"
        >
        <swiper-item  v-for="(item, index) in data" :key="index"><img class="img" :src="item.img"/></swiper-item>
        </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "vux";
export default {
    props:{
        data:{
            type: Array,
            default(){
                return []
            }
        }
    },
    data(){
        return{
            active: 0
        }
    },
    methods:{
        _swiperIndex(index){
            this.active = index
        },
        _selItem(index, pathName){
            this.active = index
            console.log(pathName)
            this.$router.push({name: pathName})
        }
    },
    components:{
        Swiper,
        SwiperItem
    }
}
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";
#swiperTab{
    .hd{
      display: flex;
      font-size: 30/@rem;
      text-align: center;
      line-height: 65/@rem;
      span{flex: 1;background-color: #e5e5e5e5;color: #333}
      span.active{color: #fff;background-color: #8f8f8f}
    }
    .img{height: 400/@rem;}
  }
</style>
