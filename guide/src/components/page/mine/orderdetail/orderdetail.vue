<template>
  <div class="orderdetailwrapper" ref="orderdetailwrapper" :style="{height: fullHeight-50+'px'}">
    <div class="orderdetail">
      <div class="client-info">
        <div class="info">
          <div class="title">客户姓名：</div>
          <div class="value">{{customerName}}</div>
          <div class="clear"></div>
        </div>
        <div class="info">
          <div class="title">移动电话：</div>
          <div class="value">{{mobilePhone}}</div>
          <div class="clear"></div>
        </div>
        <div class="info">
          <div class="title">收货区域：</div>
          <div class="value">{{area}}</div>
          <div class="clear"></div>
        </div>
        <div class="info info-noborder">
          <div class="title">详细地址：</div>
          <div class="value">{{detailedAddress}}</div>
          <div class="clear"></div>
        </div>
      </div>
      <div class="line"></div>
      <div class="product-info">
        <div :class="['product',index+1==productlist.length?'product-noborder':'']" v-for="(product,index) in productlist" :key="index" @click="toDetail(product.numId)">
          <img class="product-left" :src="product.picUrl" />
          <div class="product-right">
            <div class="product-name">{{product.goodsName}}</div>
            <div class="product-price-count">
              <div class="product-price">￥ {{product.price}}</div>
              <div class="product-count">x{{product.quantity}}</div>
            </div>
            <div class="product-attr">{{!product.spec||product.spec==""?product.spec:'已选规范：'+product.spec}}</div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="other-info">
        <div class="info2">
          <div class="title2">配送方式</div>
          <div class="value2">{{distribution}}</div>
          <div class="clear"></div>
        </div>
        <div class="info2">
          <div class="title2">支付方式</div>
          <div class="value2">{{payType}}</div>
          <div class="clear"></div>
        </div>
        <div class="info3">
          <div class="title3">备注信息：</div>
          <div class="value3">{{remarks}}</div>
          <div class="clear"></div>
        </div>
      </div>
      <div class="line"></div>
      <div class="price-info">
        <div class="price">
          <div class="title">商品金额</div>
          <div class="value">￥{{totalPrice}}</div>
          <div class="clear"></div>
        </div>
        <div class="price">
          <div class="title">运费金额</div>
          <div class="value">￥{{freight}}</div>
          <div class="clear"></div>
        </div>
        <div class="price">
          <div class="title">优惠金额</div>
          <div class="value">￥{{preferential}}</div>
          <div class="clear"></div>
        </div>
        <div class="price">
          <div class="title">邮费补贴</div>
          <div class="value">￥{{oilSubsidy}}</div>
          <div class="clear"></div>
        </div>
      </div>
      <div class="totalfee">
        实际付款：
        <span class="price">￥{{totalFee}}</span>
      </div>
      <div class="line"></div>
      <div class="other-info">
        <div class="info2" style="border-bottom: none;">
          <div class="title2">订单编号</div>
          <div class="value2">{{orderid}}</div>
          <div class="clear"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Toast } from 'vux'
import dialogConfirm from "components/public/dialogConfirm/dialogConfirm";
import BScroll from 'better-scroll';

    export default {
        components: {
            
        },
        data(){
          return{
            options: {
              pullDownRefresh: {
                threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
                stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
              },
              pullUpLoad: {
                threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
              },
              pullDownRefresh: false, //关闭下拉
              // pullUpLoad: false, // 关闭上拉
              click: true,
              probeType: 3,
              startY: 0,
              scrollbar: false
            },
            fullHeight: document.documentElement.clientHeight,
            customerName:'',//客户姓名
            mobilePhone:'',//联系电话
            area:'',//收货区域
            detailedAddress:'',//详细地址
            productlist:[],//商品列表
            distribution:'',//配送方式
            payType:'',//支付方式
            remarks: '',//备注
            totalPrice:'',//商品金额
            preferential:'',//优惠金额
            oilSubsidy:'', //油费补贴
            totalFee: '',//实际付款
            freight:'',//运费
            orderid: '',
            isEnjoy: false,
            oilSubsidy: 0,
          }
        },
        created(){
          this.loadList()
        },
        mounted(){
          this.resetBetterScroll();
        },
        computed: {
          ...mapGetters(["sid", "usercode"])
        },
        watch: {
          fullHeight(val) {
            if (!this.timer) {
              this.fullHeight = val
              this.timer = true
              setTimeout(()=> {
                this.timer = false
              }, 400)
            }
          },
        },
        methods:{
          loadList(){
            let sid ,orderid
            if(this.$route.params.orderid){
              sid = this.$route.params.sid
              orderid = this.$route.params.orderid
              this.$storage.setItem('orderid',orderid)
            }else{
              sid = this.sid
              orderid = this.$storage.getItem('orderid')
            }
            let url = '/order/form?__sid='+sid+'&documentCode='+orderid
            this.$api.post(url,'','application/x-www-form-urlencoded')
            .then(res=>{
              console.log(res)
              if(res.code==200){
                this.customerName = res.data.customerName
                this.mobilePhone = res.data.mobilePhone
                this.area = res.data.province+'-'+res.data.city+'-'+res.data.region
                this.detailedAddress = res.data.detailedAddress
                this.productlist = res.data.amOrderDetailList
                this.distribution = res.data.distribution
                this.payType = res.data.payType
                this.remarks = res.data.remarks
                this.totalPrice = res.data.totalPrice
                this.preferential = res.data.preferential
                this.totalFee = res.data.totalFee
                this.freight = res.data.freight
                this.orderid = res.data.id
                this.isEnjoy = res.data.isEnjoy=="1"?true:false
                this.documentStatus = res.data.documentStatus
                this.documentType = res.data.documentType
                if(this.isEnjoy){
                  this.oilSubsidy = res.data.oilSubsidy
                }
                
              }
              
            })
          },
          pullingDownUp () {
            this.orderdetailwrapper.finishPullUp(); //告诉 better-scroll 数据已加载
            this.orderdetailwrapper.refresh(); //重新计算元素高度
          },
          // 初始化自定义的better-scroll
          initScroll(){
            this.orderdetailwrapper = new BScroll(this.$refs.orderdetailwrapper, this.options);
            this.orderdetailwrapper.on('pullingUp', () => {
              
            })
          },
          //重置better-scroll状态
          resetBetterScroll(){
            this.$nextTick(() => {
              setTimeout(()=>{
                this.initScroll();
              },500)
            })
            const that = this
            window.onresize = () => {
              return (() => {
                window.fullHeight = document.documentElement.clientHeight;
                that.fullHeight = window.fullHeight;
              })()
            }
          },
          toDetail(id) {
            debugger;
            this.$router.push({
              name: "detail",
              params: { product_id: id, _sid: this.sid }
            });
          },
        },
    }
</script>

<style scoped lang="less" >
@import "~common/css/defult.less";

.orderdetailwrapper {
  box-sizing: border-box;
  position: fixed;
  top: 100 / @rem;
  left: 0;
  width: 100%;
  z-index: 14;
  background-color: #fff;
  overflow: hidden;
  .orderdetail {
    padding-bottom: 60 / @rem;
    .line {
      width: 100%;
      height: 20 / @rem;
      background-color: #f4f4f4;
    }
    .client-info {
      box-sizing: border-box;
      padding-left: 40 / @rem;
      padding-right: 40 / @rem;
      padding-bottom: 40 / @rem;
      .info {
        font-size: 26 / @rem;
        border-bottom: 1px solid #eee;
        .title {
          float: left;
          color: #222;
          line-height: 106 / @rem;
          margin-right: 20 / @rem;
          font-size: 34 / @rem;
        }
        .value {
          float: left;
          color: #888;
          line-height: 106 / @rem;
          font-size: 30 / @rem;
        }
        .clear {
          clear: both;
        }
      }
      .info-noborder {
        border: none;
      }
    }
    .product-info {
      box-sizing: border-box;
      padding-left: 40 / @rem;
      padding-right: 40 / @rem;
      .product {
        padding-top: 40 / @rem;
        padding-bottom: 40 / @rem;
        border-bottom: 1px solid #eee;
        overflow: hidden;
        .product-left {
          float: left;
          width: 178 / @rem;
          height: 178 / @rem;
          margin-right: 20 / @rem;
        }
        .product-right {
          float: right;
          width: 472 / @rem;
          .product-name {
            font-size: 26 / @rem;
            line-height: 36 / @rem;
            color: #888;
          }
          .product-price-count {
            height: 50 / @rem;
            font-size: 26 / @rem;
            color: #222;
            line-height: 50 / @rem;
            overflow: hidden;
            margin-top: 10 / @rem;
            .product-price {
              float: left;
              font-size: 30 / @rem;
              font-weight: bold;
            }
            .product-count {
              float: right;
              font-size: 30 / @rem;
              font-weight: bold;
            }
          }
          .product-attr {
            margin-top: 20 / @rem;
            font-size: 24 / @rem;
            color: #888;
          }
        }
      }
      .product-noborder {
        border: none;
      }
    }
    .other-info {
      box-sizing: border-box;
      padding-left: 40 / @rem;
      padding-right: 40 / @rem;
      font-size: 26 / @rem;
      .info2 {
        line-height: 106 / @rem;
        border-bottom: 1px solid #eee;
        .title2 {
          float: left;
          color: #222;
          font-size: 34 / @rem;
        }
        .value2 {
          float: right;
          color: #888;
          font-size: 30 / @rem;
        }
        .clear {
          clear: both;
        }
        .title-26 {
          font-size: 26 / @rem;
        }
        .value-26 {
          font-size: 26 / @rem;
        }
      }
      .info3 {
        line-height: 106 / @rem;
        .title3 {
          float: left;
          color: #222;
          font-size: 34 / @rem;
        }
        .value3 {
          float: left;
          color: #888;
          font-size: 30 / @rem;
        }
        .clear {
          clear: both;
        }
      }
    }
    .price-info {
      box-sizing: border-box;
      margin-left: 40 / @rem;
      margin-right: 40 / @rem;
      margin-bottom: 20 / @rem;
      padding-top: 20 / @rem;
      padding-bottom: 20 / @rem;
      border-bottom: 1px solid #eee;
      .price {
        line-height: 62 / @rem;
        font-size: 24 / @rem;
        .title {
          float: left;
          color: #222;
          font-size: 34 / @rem;
        }
        .value {
          float: right;
          color: #888;
          font-size: 30 / @rem;
        }
        .clear {
          clear: both;
        }
      }
    }
    .totalfee {
      box-sizing: border-box;
      margin-left: 40 / @rem;
      margin-right: 40 / @rem;
      margin-bottom: 20 / @rem;
      line-height: 68 / @rem;
      font-size: 26 / @rem;
      color: #888;
      text-align: right;
      .price {
        font-size: 36 / @rem;
        color: #222;
        font-weight: bold;
      }
    }
  }
  .btnbot{
    width: 170/@rem;
    height: 50/@rem;
    position: fixed;
    bottom: 50/@rem;
    border: 1px solid #aaa;
    text-align: center;
    line-height: 50/@rem;
    color: #222;
    background-color: #fff;
  }
  //上传凭证
  .upload{
    left: 40/@rem;
  }
  //确认订单
  .confirm{
    left: 240/@rem;
  }
  .cover{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 90;
    display: none;
  }
  .noCover{
    display: block;
    overflow: hidden;
  }
  .remark{
    box-sizing: border-box;
    position: fixed;
    bottom: -120%;
    width: 100%;
   
    z-index: 99;
    transition: bottom 0.5s;
    .icon-guanbi{
        color: #fff;
        font-weight: bolder;
        font-size: 48/@rem;
        margin: 0 40/@rem 40/@rem 668/@rem;
    }
    .remarkBody{
        background-color: #fff;
        
        width: 670/@rem;
        padding: 40/@rem 40/@rem 40/@rem 40/@rem;
        font-size: 22/@rem;
        line-height: 22/@rem;
        .client{
            margin-bottom:40/@rem;
            div{
                display:inline-block;
                width: 158/@rem;
                height: 68/@rem;
                margin-left: 2px;
                font-size: 24/@rem;
                color:#666;
                text-align:center;
                line-height:68/@rem;
                background-color:#fafafa;
            }
            .client-selected{
                background-color:#666;
                color:#fff;
            }
        }
        .title{
            margin-bottom: 20/@rem;
            font-size: 26/@rem;
        }
        textarea{
            background-color: #fafafa;
            width: 650/@rem;
            height: 130/@rem;
            border: 0;
            line-height: 38/@rem;
            color: #888;
            padding: 15/@rem;
            margin-bottom: 40/@rem;
        }
        .input1,.input2,.input3{
            border-bottom: #eee 1px solid;
            font-size: 26/@rem;
            line-height: 26/@rem;
            padding: 20/@rem ;
            padding-left: 0;
            overflow:hidden;
            label{
                float:left;
                padding-top: 20/@rem;
                padding-bottom: 20/@rem; 
            }
            input{
                float:left;
                padding-left: 25/@rem;
                padding-top: 20/@rem;
                padding-bottom: 20/@rem;
            }
            :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                color: #aaa;  
                font-size: 26/@rem;
            }
             
            ::-moz-placeholder { /* Mozilla Firefox 19+ */
                color: #aaa;
                font-size: 26/@rem;
            }
             
            input:-ms-input-placeholder{
                color: #aaa;
                font-size: 26/@rem;
            }
             
            input::-webkit-input-placeholder{
                color: #aaa;
                font-size: 26/@rem;
            }
        }
        .remarkButton{
            width: 670/@rem;
            height: 90/@rem;
            background-color:#424242 ;
            color: white;
            font-size: 30/@rem;
            text-align: center;
            line-height: 90/@rem;
        }
    }
  }
  .showRemark{
    bottom: 0;
    transition: bottom 0.5s;
  }
}
</style>