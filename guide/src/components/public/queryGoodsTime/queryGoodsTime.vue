<template>
    <div>
        <!-- 查货期 -->
        <div class="query-goods-time" @click="updataState(1)" v-if="isDetailPage">
            <span>查货期</span>
        </div>
        <!-- 货期详情 -->
        <div class="goods-time-detail" v-if="showGoodsDetail">
            <div class="detail-header">
                <span>货期详情</span>
                <div class="close-btn" @click="updataState(2)">
                    <i class="icon-cha iconfont"></i>
                </div>
            </div>
            <div class="detail-body">
                <div class="wrapper">
                    <div class="material">物料编码：<span>{{goodsTimeDetail.outerId}}</span></div>
                    <h3>{{goodsTimeDetail.materialName}}</h3>
                    <div class="marketabilityNum">可销售数：<span>{{goodsTimeDetail.canSaleQty}}</span></div>
                    <div class="estimated-date-delivery">预计交期：<span>{{goodsTimeDetail.expectedDate|textFltering}}</span></div>
                    <div class="purchasing-cycle">采购周期：<span>{{goodsTimeDetail.purchaseCycle}}</span></div>
                    <!-- <div class="goods-state">
                        <div class="left">
                            <p>物料编码：<span>{{goodsTimeDetail.outerId}}</span></p>
                        </div>
                        <div class="right">
                            <p>可销售数：<span>{{goodsTimeDetail.canSaleQty}}</span></p>
                        </div>
                    </div> -->
                    <!-- <div class="goods-procurement">
                         <p>采购周期：<span>{{goodsTimeDetail.purchaseCycle}}</span></p>
                         <p class="p">预计交期：<span>{{goodsTimeDetail.expectedDate}}</span></p>
                    </div> -->
                </div>
            </div>
            <div class="detail-footer" @click="updataState(2)">
                <span>确定</span>
            </div>
        </div>
        <!-- 遮罩层 -->
        <div class="shadow" v-if="showGoodsDetail"></div>
    </div>
</template>
<script>
import {textFltering} from '@/common/js/common.js'
export default {
     props: ['showGoodsDetail','isDetailPage','goodsTimeDetail'],
     filters:{
         textFltering
     },
     methods:{
         updataState(value){
             console.log('441')
             this.$emit('updateChildState',value)
         }
     }
}
</script>

<style lang="less">
@import "~common/css/defult.less";
.query-goods-time {
  position: fixed;
  right: 30 / @rem;
  bottom: 200 / @rem;
  width: 100 / @rem;
  height: 100 / @rem;
  line-height: 100 / @rem;
  color: #424242;
  font-size: 22 / @rem;
  text-align: center;
  background-color: #fff;
  border-radius: 100%;
  letter-spacing: 1 / @rem;
  box-shadow: 0 0 2 / @rem 4 / @rem #eee;
  z-index: 200;
}
.query-goods-time:active{
    background-color: #f4f4f4;
}
.goods-time-detail {
  position: fixed;
  top: 350 / @rem;
  left: 35 / @rem;
  width: 680 / @rem;
  height: 640 / @rem;
  font-size: 28 / @rem;
  background-color: #fff;
  border-radius: 6 / @rem;
  z-index: 201;
  .detail-header {
    width: 100%;
    height: 110 / @rem;
    line-height: 110 / @rem;
    text-align: center;
    color: #aaaaaa;
    font-size: 28 / @rem;
    font-weight: bold;
    letter-spacing: 4 / @rem;
    position: relative;
    .close-btn {
      position: absolute;
      right: 0;
      top: 0;
      width: 110 / @rem;
      height: 110 / @rem;
      .icon-cha {
        font-size: 28 / @rem;
      }
    }
  }
  .detail-body {
    width: 100%;
    height: 420 / @rem;
    padding: 0 40 / @rem;
    box-sizing: border-box;
    .wrapper {
      width: 100%;
      color: #424242;
      font-size: 28 / @rem;
    //   padding-top: 35 / @rem;
      border-top: 1px solid #eee;
      .material{
        height: 102/@rem;
        line-height: 102/@rem;
        span {
          color: #aaaaaa;
        }
      }
      h3 {
        color: #424242;
        font-weight: bold;
        line-height: 44 / @rem;
      }
      .marketabilityNum,.estimated-date-delivery,.purchasing-cycle{
        margin-top: 30/@rem;
        span {
          color: #aaaaaa;
        }
      }
    //   .goods-state {
    //     color: #484848;
    //     font-size: 26 / @rem;
    //     display: flex;
    //     justify-content: space-between;
    //     align-items: flex-start;
    //     margin-top: 54 / @rem;
    //     .left{
    //         flex: 1.5
    //     }
    //     .right{
    //         flex: 1
    //     }
    //     p:first-child {
    //       margin-bottom: 42 / @rem;
    //     }
    //     span {
    //       color: #aaaaaa;
    //     }
    //   }
      .goods-procurement{
        color: #484848;
        font-size: 26 / @rem;
         p:first-child {
          margin-bottom: 42 / @rem;
        }
        .p{
            display: flex;
           flex-direction: row;
            span{
                width: 460/@rem;
                line-height: 40/@rem;
            }
        }
         span {
          color: #aaaaaa;
        }
      }
    }
  }
  .detail-footer {
    width: 100%;
    height: 110 / @rem;
    color: #424242;
    font-size: 28 / @rem;
    text-align: center;
    line-height: 110 / @rem;
    border-top: 1px solid #eee;
  }
  .detail-footer:active{
      background-color: #f4f4f4;
  }
}
.shadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
}
</style>

