/*
 * 商品列表公用组件
 * @Author: rex
 * @Date: 2018-04-10 14:20:12 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-11 17:42:47
 */

<template>
  <div class="goodsList">
    <div class="goods" :class="index==0||index==1?'':'marginTop'" v-for="(item,index) in goods" :key="item.id" :id="index">
      <div class="goodsImage">
        <img :src="item.images" />
      </div>
      <div class="goodsInfo">
        <div class="up">
          <div class="goodsName">
            {{item.goodsName}}
          </div>
        </div>
        <div class="dowm">
          <div class="price">
            <span class="beanPrice">{{item.price}}</span>
            <span class="beanText">梵豆</span>
          </div>
          <div class="duihuan" hover-class='highLight'>立即兑换</div>
        </div>
      </div>
    </div>
    <divider v-show="showDivider" class="base">我也是有底线的</divider>
  </div>
</template>
<script>
import { Divider } from 'vux'
export default {
  data() {
    return {
      msg: '我是首页'
    }
  },
  props: ['goods','showDivider'],
  components:{
     Divider
  }
}
</script>
<style lang="less" scoped>
@import '../../../common/css/defult.less';
.goodsList {
  display: flex;
  flex-wrap: wrap;
  padding: 30 / @rem 30 / @rem 100/@rem 30/@rem;
  background-color: #f6f6f6;
  position: relative;
}
.goods {
  color: #424242;
  width: 330 / @rem;
  box-sizing: border-box;
  background-color: #fff;
}
.goods:nth-child(2n + 1) {
  margin-right: 30 / @rem;
}

.goods .goodsImage {
  width: 100%;
  height: 330 / @rem;
  margin-bottom: 20 / @rem;
}
.goods .goodsImage image {
  width: 100%;
  height: 330 / @rem;
}
.goodsInfo .up .goodsName {
  height: 76 / @rem;
  font-size: 28 / @rem;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding: 0 20 / @rem;
}

.goodsInfo .dowm {
  padding: 30 / @rem 20 / @rem 30 / @rem 15 / @rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dowm .price{
  white-space: nowrap;
}
.dowm .price .beanPrice {
  font-size: 30 / @rem;
  font-weight: 600;
  color: #e8364c;
}

.dowm .price .beanText {
  font-size: 26 / @rem;
  color: #888;
}

.goodsInfo .dowm .duihuan {
  width: 158 / @rem;
  height: 46 / @rem;
  line-height: 46 / @rem;
  color: #fff;
  font-size: 26 / @rem;
  text-align: center;
  border-radius: 50 / @rem;
  background-color: #e8364c;
}

.marginTop {
  margin-top: 30 / @rem;
}

/*未登录提示 */

.notLoginTips {
  opacity: 0;
  position: fixed;
  top: 30%;
  width: 100%;
  text-align: center;
  padding: 0 120 / @rem;
  box-sizing: border-box;
}

.tipsContent {
  font-size: 28 / @rem;
  color: #fff;
  padding: 40 / @rem 0 60 / @rem 0;
  border-radius: 10 / @rem;
  background-color: rgba(0, 0, 0, 0.7);
}

.tipsContent .title {
  font-size: 32 / @rem;
  margin-bottom: 30 / @rem;
}
.base{
  margin-top: 20/@rem;
}
</style>

