<template>
  <div id="tab">
    <router-link
      to="/reception"
      class="item"
      :class="{active:$route.path === $route.to}"
    >
      <i class="iconImg"></i>
      <p class="tx">接待</p>
    </router-link>
    <router-link
      to="/activing"
      class="item activing"
      :class="{active:$route.path === $route.to}"
    >
      <i class="iconImg"></i>
      <i
        class="dot" :id="newInformation" v-if="newInformation"></i>
      <p class="tx">活动</p>
    </router-link>
    <router-link
      to="/productlist"
      class="item"
      :class="{active:$route.path === $route.to}"
    >
      <i class="iconImg"></i>
      <p class="tx">商品</p>
    </router-link>

    <router-link
      to="/shoppingCart"
      class="item"
      :class="{active:$route.path === $route.to}"
    >
      <i class="iconImg"></i>
      <p class="tx">购物车</p>
    </router-link>

    <router-link
      to="/mine"
      class="item"
      :class="{active:$route.path === $route.to}"
    >
      <i class="iconImg"></i>
      <p class="tx">我的</p>
    </router-link>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import { setTimeout } from 'timers';
import bus from '@/common/js/bus.js'
export default {
  data() {
    return {
      newInformation: false
    };
  },

  mounted() {
    console.log('tab页面')
    bus.$on("haveToSee",(msg)=>{
      console.log(msg)
      if(msg=='seen'){
        this.newInformation = false
      }
    })
    this.newCreateTime()
   
  },
  computed: {
    ...mapGetters(["sid","role_type", "token"])
  },
  methods:{
     // 获取活动列表最新事件与本地缓存时间做对比
    newCreateTime(){
      let url = "a/guide/guideActivity/newCreateTime?__sid="+this.sid
      this.$api.get(url).then(res=>{
        console.log(res)
         if(res.data==window.localStorage.getItem('createTime')){
           console.log('匹配成功')
           this.newInformation = false
         }else{
           console.log('匹配失败,有新消息')
           this.newInformation = true
         }
      })
    },
  }
};
</script>


<style lang="less" scoped>
@import "~common/css/defult.less";
#tab {
  width: 100%;
  background-color: #fafafa;
  position: fixed;
  border-bottom: #eee 1 / @rem solid;
  border-top: #eee 1 / @rem solid;
  bottom: 0 / @rem;
  height: 98 / @rem;
  display: flex;
  box-sizing: border-box;
  padding: 16 / @rem 0;
  z-index: 101;
  .iconImg {
    display: block;
    width: 40 / @rem;
    height: 37 / @rem;
    margin: 0 auto;
  }
  .tx {
    color: #c0c0c0;
    font-size: 18 / @rem;
    margin-top: 5 / @rem;
  }
  .item.active .tx {
    color: #222;
    font-size: 18 / @rem;
    margin-top: 5 / @rem;
  }
  .item {
    flex: 1;
    margin-top: 2 / @rem;
    text-align: center;
  }
  .item.activing {
    position: relative;
  }
  .item .dot {
    position: absolute;
    right: 46 / @rem;
    top: -6 / @rem;
    width: 12 / @rem;
    height: 12 / @rem;
    border-radius: 100%;
    background-color: #d91d1d;
  }
  .item .changeClass{
      background-color: #fff;
  }
  .item:nth-of-type(1) .iconImg {
    background: url("~common/images/index/reception1.png") center center
      no-repeat;
    background-size: contain;
  }
  .item:nth-of-type(2) .iconImg {
    background: url("~common/images/index/activing1.png") center center
      no-repeat;
    background-size: contain;
  }
  .item:nth-of-type(3) .iconImg {
    background: url("~common/images/index/classification1.png") center center
      no-repeat;
    background-size: contain;
  }
  .item:nth-of-type(4) .iconImg {
    background: url("~common/images/index/shopping1.png") center center
      no-repeat;
    background-size: contain;
  }
  .item:nth-of-type(5) .iconImg {
    background: url("~common/images/index/mine1.png") center center no-repeat;
    background-size: contain;
  }
  .item.active:nth-of-type(1) .iconImg {
    background: url("~common/images/index/reception.png") center center
      no-repeat;
    background-size: contain;
    color: #222;
  }
  .item.active:nth-of-type(2) .iconImg {
    background: url("~common/images/index/activing.png") center center no-repeat;
    background-size: contain;
    color: #222;
  }
  .item.active:nth-of-type(3) .iconImg {
    background: url("~common/images/index/classification.png") center center
      no-repeat;
    background-size: contain;
    color: #222;
  }
  .item.active:nth-of-type(4) .iconImg {
    background: url("~common/images/index/shopping.png") center center no-repeat;
    background-size: contain;
    color: #222;
  }
  .item.active:nth-of-type(5) .iconImg {
    background: url("~common/images/index/mine.png") center center no-repeat;
    background-size: contain;
    color: #222;
  }
}
</style>

