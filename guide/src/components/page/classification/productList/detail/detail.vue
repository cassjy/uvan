<template>
  <div class="product-detail">
    <!-- :style="{height: fullHeight+'px'}" -->
    <!-- 遮罩层 -->
    <div class="cover" v-if="showCover" @click="hideCover"></div>
    <!-- 页面内容 -->
    <div class="detailwrapper" ref="detailwrapper" :style="{height: fullHeight+'px'}">
      <!-- 商品标签 -->
      <div class="detail">
        <div class="swiper-box">
          <swiper class="swiper" :aspect-ratio="1" auto loop :show-dots="false" dots-class="custom-bottom" dots-position="center" @on-index-change="swiperIndexChange($event)">
            <swiper-item class="swiper-item" v-for="(pic,index) in productPic" :key="pic.id">
              <img :src="pic.url" class="pre-img" />
            </swiper-item>
          </swiper>
          <div class="indicator">{{nowPicNum}}/{{productPic.length}}</div>
          <div class="store-name">
            <div class="iconfont icon-dianpu"></div>
            <div class="name">{{storename}}</div>
          </div>
        </div>
        <div class="product-name">
          <div class="name">{{productName}}</div>
        </div>
        <div class="product-price">￥{{defaultPrice?defaultPrice:productprice}}
          <div class="delivery-date">{{forwardSaleDate}}</div>
          <div class="product-quantity">库存: {{defaultQuantity}}</div>
        </div>
        <div class="line"></div>
        <div class="attr-info">
          <div class="attr-info-title">规格：</div>
          <div :class="['attr-info-name',nowIndex==index?'attr-info-name-selected':'']" v-for="(attr,index) in productAttr" :key="index" v-if="attr.properties!=''&&attr.quantity!=0" :data-presale="attr.preSale" :data-price="attr.realPrice" :data-quantity="attr.quantity" :data-index="index" :data-property="attr.properties" :data-len="attr.properties.length" :data-skuid="attr.skuId" :data-outercode="attr.outerId" @click="chooseAttr($event)">
            {{attr.properties}}
          </div>
        </div>

        <!-- <div class="noDetailTips" v-if="detailImages.length==0">该商品暂无详细介绍</div> -->
        <!-- 自定义商品详情 -->
        <image v-if="typeof(detailImages)!='string'" v-for="(detailImage,index) in detailImages" :key="index" :src="detailImage" />
        <!-- 淘宝商品详情 -->
        <div v-if="typeof(detailImages)=='string'" v-html="detailImages"></div>
      </div>
    </div>
    <queryGoodsTime :showGoodsDetail="showGoodsDetail" :isDetailPage="isDetailPage" :goodsTimeDetail="goodsTimeDetail" @updateChildState="updateChildState"></queryGoodsTime>
    <!-- 查货期 -->
    <!-- <div class="query-goods-time" @click="showGoodsDetail=true">
     <span>查货期</span>
    </div> -->
    <!-- 货期详情 -->
    <!-- <div class="goods-time-detail" v-if="showGoodsDetail">
      <div class="detail-header">
        <span>货期详情</span>
        <div class="close-btn" @click="showGoodsDetail=false">
           <i class="icon-cha iconfont"></i>
        </div>
      </div>
      <div class="detail-body">
          <div class="wrapper">
             <h3>优梵艺术NAPA美式软包布艺床1.8m1.5双人后现代轻奢简约卧室婚床</h3>
             <div class="goods-state">
                 <div class="left">
                    <p>物料编码：<span>30165</span></p>
                    <p>预计交期：<span>2018-1-10</span></p>
                 </div>
                 <div class="right">
                    <p>可销售数：<span>30</span></p>
                    <p>采购周期：<span>20-30天</span></p>
                 </div>
             </div>
          </div>
      </div>
      <div class="detail-footer" @click="showGoodsDetail=false">
        <span>确定</span>
      </div>
    </div> -->
    <!-- 遮罩层 -->
    <!-- <div class="shadow" v-if="showGoodsDetail"></div> -->
    <div class="bottom-bar">
      <div class="bottom-num">
        <div class="title">购买数量</div>
        <div class="decrease" @click="minusNum">-</div>
        <input class="num" type="num" v-model="selectedNum" @blur="overInputNum" />
        <div class="increase" @click="addNum">+</div>
      </div>
      <div class="bottom-btn" @click="addCart">
        加入购物车
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperItem, Toast, Loading } from "vux";
import BScroll from "better-scroll";
import Bus from "common/js/bus.js";
import { mapGetters } from "vuex";
import queryGoodsTime from '@/components/public/queryGoodsTime/queryGoodsTime'
export default {
  data() {
    return {
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
      // fullHeight: document.body.scrollHeight,
      showCover: false, //控制遮罩层显示
      _sid: "",
      productName: "", //商品名称
      productprice: "", //商品价格
      nowPicNum: 1, //轮播图初始index
      productPic: [], //轮播图
      productAttr: [], //商品规格
      detailImages: "", //商品详情图
      productquantity: 0, //库存
      nowIndex: 0, //当前选中的规格ID
      defaultPrice: "", //默认价格
      defaultQuantity: 0, //默认库存
      defaultSku: 0, //默认规格ID
      defaultProperty: "", //默认规格名称
      selectedNum: 1,
      attrPic: [], //规格图组
      defaultPic: "", //默认选中的规格图
      skus: [], //规格组,
      outerCode: "",
      storename: '',//旗舰店店名
      showGoodsDetail: false,
      isDetailPage: true,
      goodsTimeDetail: {}, //货期详情
      materialNum: '',//物料编码
      // cartCount: 0,
      canADD: true,
      forwardSaleDate: ''
    };
  },
  components: {
    Loading,
    Swiper,
    SwiperItem,
    Toast,
    queryGoodsTime
  },
  created() {
    this.getCartCount()
    let storage = window.localStorage;
    // if(storage.getItem("cart") !== null){
    //   let len = JSON.parse(storage.getItem("cart")).length;
    //   Bus.$emit("cartCount", len);
    // }
    
    this.$vux.loading.show({
      text: "加载中"
    });
    if (this.$route.params.product_id) {
      this.$storage.setItem("product_id", this.$route.params.product_id);
      this.productID = this.$route.params.product_id;
    } else {
      this.productID = this.$storage.getItem("product_id");
    }
    console.log(this.$storage.getItem("product_id"));
    this.loadProductDetail();
  },
  mounted() {
    this.resetBetterScroll();
  },
  computed: {
    ...mapGetters(["sid"]),
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  watch: {
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val;
        this.timer = true;
        setTimeout(() => {
          this.timer = false;
        }, 400);
      }
    },
    selectedNum() {
      if (this.selectedNum >= 100) {
        this.selectedNum = 100;
      }
    }
  },
  methods: {

    updateChildState(value){
      console.log(value)
      if(parseInt(value)==1){
         this.$vux.loading.show({
              text: "查询中..."
            });
         this.queryGoodsTimeMethods(this.materialNum)
        // this.showGoodsDetail = true
      }else if(parseInt(value)==2){
         this.showGoodsDetail = false
      }
    },
    selectBar(e) {
      this.nowBar = e.target.getAttribute("data-name");
      this.barposition = e.target.getAttribute("data-num") * 250;
      this.resetBetterScroll();
      if (this.nowBar == "评价") {
        this.loadComment();
      }
    },
    swiperIndexChange(index) {
      this.nowPicNum = index + 1;
    },
    //加载商品详情信息
    loadProductDetail() {
      let _this = this;
      // let data = {
      // 	"numIid":this.productID,
      // 	"__sid":this.sid
      // }
      // this.$api.get('/a/tianmao/tbProduct/formDaoGou',data)
      let data = {};
      this.$api
        .get(
          "/a/tianmao/tbProduct/formDaoGou?numIid=" +
            _this.productID +
            "&__sid=" +
            _this.sid,
          data
        )
        .then(res => {
          this.$vux.loading.hide();
          console.log(res);
          if (res.code == 200) {
            let productData = res.data.item;
            this.storename = productData.nick;
            this.productprice = productData.price;
            this.productName = productData.title;
            this.productPic = productData.itemImgs;
            this.productAttr = productData.tbSkuList;
            this.forwardSaleDate = productData.tbSkuList[0].preSale,
            this.detailImages = productData.descModules || [];
            this.attrPic = productData.propImgs;
            this.outerCode = productData.tbSkuList[0].outerId;
            // console.log(this.detailImages)
            console.log(typeof this.detailImages == "string");
            console.log(typeof this.detailImages == "array");

            this.defaultSku = this.productAttr[0].skuId;
            this.defaultPrice = this.productAttr[0].realPrice;
            this.defaultQuantity = this.productAttr[0].quantity;
            this.defaultProperty = this.productAttr[0].properties;
            if (productData.propImgs) {
              this.defaultPic = this.attrPic[0].url;
            } else {
              this.defaultPic = this.productPic[0].url;
            }
            // console.log(productData.propImgs)
            // console.log("=============")
            //sku组
            if (productData.propImgs) {
              for (let i = 0; i < this.productAttr.length; i++) {
                this.skus.push({
                  property: this.productAttr[i].properties,
                  skuid: this.productAttr[i].skuId,
                  price: this.productAttr[i].realPrice,
                  url: this.attrPic[i].url,
                  quantity: this.productAttr[i].quantity,
                  selected: false,
                  outerCode: this.productAttr[i].outerId
                });
              }
            } else {
              for (let i = 0; i < this.productAttr.length; i++) {
                this.skus.push({
                  property: this.productAttr[i].properties,
                  skuid: this.productAttr[i].skuId,
                  price: this.productAttr[i].realPrice,
                  // "url":this.attrPic[i].url,
                  quantity: this.productAttr[i].quantity,
                  selected: false,
                  outerCode: this.productAttr[i].outerId
                });
              }
            }

            this.skus[0].selected = true;
            // this.$vux.loading.show({
            //   text: "加载中..."
            // });
            this.materialNum = this.skus[0].outerCode
            // this.queryGoodsTimeMethods(this.skus[0].outerCode)
            console.log(this.skus);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 查询货期详细数据
    queryGoodsTimeMethods(value){
      // let data ={
      //   outerId: value
      // }
      let url = '/a/tianmao/tbProduct/inventoryStockQueryReport?outerId='+value
     this.$api.get(url).then(res=>{
       console.log(res)
       if(res.code==200){
         this.goodsTimeDetail = {
             canSaleQty: res.data.canSaleQty,
             expectedDate: res.data.expectedDate,
             materialName: res.data.materialName,
             outerId: res.data.outerId,
             purchaseCycle: res.data.purchaseCycle
         }
          this.showGoodsDetail = true
          this.$vux.loading.hide();
       }else{
        this.$vux.toast.show({
          type: 'text',
          text: res.msg,
          width: '14em',
          position: 'middle'
        })
         this.goodsTimeDetail = {
             canSaleQty: '暂无',
             expectedDate: '暂无',
             materialName: '暂无',
             outerId: '暂无',
             purchaseCycle: '暂无',
         }
         this.$vux.loading.hide();
       }
     })
    },
    chooseAttr(e) {
      console.log(e);
      this.defaultPrice = e.target.dataset.price;
      this.defaultQuantity = e.target.dataset.quantity;
      this.defaultSku = parseInt(e.target.dataset.skuid);
      this.defaultProperty = e.target.dataset.property;
      this.nowIndex = e.target.dataset.index;
      this.outerCode = e.target.dataset.outercode;
      this.forwardSaleDate = e.target.dataset.presale;
      for (let i = 0; i < this.skus.length; i++) {
        if (i == e.target.dataset.index) {
          this.skus[i].selected = true;
        } else {
          this.skus[i].selected = false;
        }
      }
      // this.$vux.loading.show({
      //    text: "加载中..."
      // });
      this.materialNum = e.target.dataset.outercode
      // this.queryGoodsTimeMethods(e.target.dataset.outercode);
      console.log(this.defaultSku);
    },
    //隐藏遮罩层
    hideCover() {
      this.showCover = false;
      this.hideServer = true;
      this.hideAttr = true;
    },
    //展示商品规格
    // showAttr(){
    // 	this.hideAttr = false;
    // 	this.showCover = true;
    // 	this.$nextTick(() => {
    // 		this.productAttrSelectWinWrapper = new BScroll(this.$refs.productAttrSelectWinWrapper,{});
    // 	})
    // },
    overInputNum() {
      if (this.selectedNum <= 1 || this.selectedNum == "") {
        this.selectedNum = 1;
      }
      if (!/^[0-9]*$/.test(this.selectedNum)){
        this.$vux.toast.show({
         type: 'text',
         text: '请输入正确的数量',
         width: '14em',
         position: 'middle'
       })
      }
    },
    //减操作
    minusNum() {
      if (this.selectedNum > 1) {
        this.selectedNum--;
      }
    },
    //加操作
    addNum() {
      if (this.selectedNum >= 100) {
        this.selectedNum = 100;
      } else {
        this.selectedNum++;
      }
    },
    //获取购物车数量
    getCartCount(){
      let url = `/a/order/amOrderShopping/queryShopping?__sid=${this.sid}`
      this.$api.get(url)
      .then(res=>{
        if(res.code==200){
          Bus.$emit("cartCount", res.data.length);
        }
      })
    },
    //加入购物车
    addCart() {
      let _this = this
      if(!this.canADD){
        return
      }
      this.canADD = false
      this.$vux.loading.show({
        text: "正在添加"
      });
      if (!/^[0-9]*$/.test(this.selectedNum)){
        this.$vux.toast.show({
         type: 'text',
         text: '请输入正确的数量',
         width: '14em',
         position: 'middle'
       })
        return
      }
      let url = `/a/order/amOrderShopping/addShopping?__sid=${this.sid}&numIid=${this.productID}&skuId=${this.defaultSku}&count=${this.selectedNum}&flag=0`
      this.$api.get(url)
      .then(res=>{
        if(res.code==200){
          this.$vux.loading.hide();
          this.$vux.toast.show({
            type: "success",
            text: "已加入购物车",
            width: "12em",
            position: "middle"
          });
          this.getCartCount()
          this.canADD = true
        }else if(res.code==11001){
          this.$vux.loading.hide();
          this.$vux.toast.show({
            type: "warn",
            text: "商品已下架",
            width: "12em",
            position: "middle"
          });
          this.canADD = true
        }else{
          this.$vux.loading.hide();
          this.$vux.toast.show({
            type: "warn",
            text: "请稍后再试",//服务异常
            width: "12em",
            position: "middle"
          });
          this.canADD = true
        }
      })
      // .catch(err=>{
      //   this.$vux.toast.show({
      //     type: "warn",
      //     text: "请稍后再试",
      //     width: "12em",
      //     position: "middle"
      //   });
      //   this.canADD = true
      // })
      //判断库存
      // if(this.defaultQuantity==0){
      // 	this.$vux.toast.show({
      // 		type: 'text',
      // 		text: '该商品库存不足',
      // 		width: '14em',
      // 		position: 'middle'
      // 	})
      // 	return
      // }
      // if(this.selectedNum>this.defaultQuantity){
      // 	this.$vux.toast.show({
      // 		type: 'text',
      // 		text: '该商品仅剩'+ this.defaultQuantity +'件',
      // 		width: '14em',
      // 		position: 'middle'
      // 	})
      // 	return
      // }
      // let productOBJ = {
      //   name: this.productName,
      //   price: this.defaultPrice,
      //   id: this.productID,
      //   skuid: this.defaultSku,
      //   property: this.defaultProperty,
      //   pic: this.defaultPic,
      //   count: this.selectedNum,
      //   quantity: this.defaultQuantity,
      //   skus: this.skus,
      //   outerCode: this.outerCode,
      //   storename: this.storename
      // };

      // let storage = window.localStorage;
      // if (storage.getItem("cart") === null) {
      //   storage.setItem("cart", "[" + JSON.stringify(productOBJ) + "]");
      // } else {
      //   let cart = JSON.parse(storage.getItem("cart"));
      //   //如果购物车已存在该商品(本次操作属于加减数量)
      //   for (let i = 0; i < cart.length; i++) {
      //     if (productOBJ.skuid == cart[i].skuid) {
      //       cart[i].count = productOBJ.count + cart[i].count;
            // if(cart[i].count > cart[i].quantity){
            // 	this.$vux.toast.show({
            // 		type: 'text',
            // 		text: '商品加购件数已超出库存',
            // 		width: '16em',
            // 		position: 'middle'
            // 	})
            // 	return
            // }
            // storage.cart = JSON.stringify(cart);
            // this.$vux.toast.show({
            //   type: "success",
            //   text: "已加入购物车",
            //   width: "12em",
            //   position: "middle"
            // });
            //更新购物车图片数量
            // let len = JSON.parse(storage.getItem("cart")).length;
            // Bus.$emit("cartCount", len);
      //       return;
      //     }
      //   }
      //   cart.unshift(productOBJ);
      //   storage.cart = JSON.stringify(cart);
      // }
      // this.$vux.toast.show({
      //   type: "success",
      //   text: "已加入购物车",
      //   width: "12em",
      //   position: "middle"
      // });
      //更新购物车图片数量
      // let len = JSON.parse(storage.getItem("cart")).length;
      // Bus.$emit("cartCount", len);
    },
    pullingDownUp() {
      this.productdetailwrapper.finishPullUp(); //告诉 better-scroll 数据已加载
      this.productdetailwrapper.refresh(); //重新计算元素高度
    },
    // 初始化自定义的better-scroll
    initScroll() {
      this.productdetailwrapper = new BScroll(
        this.$refs.detailwrapper,
        this.options
      );
      this.productdetailwrapper.on("pullingUp", () => {
        // if(this.nowBar=='评价'){
        // 	this.loadmoreComment();
        // }
      });
    },
    //重置better-scroll状态
    resetBetterScroll() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.initScroll();
        }, 500);
      });
      const that = this;
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight;
          that.fullHeight = window.fullHeight;
        })();
      };
    },
    //其他方法
    // 删除数组中指定元素
    removeElement(arr, ele) {
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] != ele) {
          newArr.push[ele];
        }
      }
      return newArr;
    },
    //字符串处理
    subStr(str){
      var subStr1 = str.substr(0,16);
      var subStr2 = str.substr(str.length-8,8);
      var subStr = subStr1 + " ..." + subStr2 ;
      return subStr;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";

.product-detail {
  // touch-action: none;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 13;
// .query-goods-time{
//   position: fixed;
//   right: 30/@rem;
//   bottom: 200/@rem;
//   width: 100/@rem;
//   height: 100/@rem;
//   line-height: 100/@rem;
//   color: #424242;
//   font-size: 22/@rem;
//   text-align: center;
//   background-color:#fff;
//   border-radius: 100%;
//   letter-spacing: 1/@rem;
//   box-shadow: 0 0 2/@rem 4/@rem #eee;
// }
// .goods-time-detail{
//   position: fixed;
//   top: 350/@rem;
//   left: 35/@rem;
//   width: 680/@rem;
//   height: 610/@rem;
//   font-size: 28/@rem;
//   background-color: #fff;
//   border-radius: 6/@rem;
//   z-index: 16;
//   .detail-header{
//     width: 100%;
//     height: 110/@rem;
//     line-height: 110/@rem;
//     text-align: center;
//     color: #aaaaaa;
//     font-size: 28/@rem;
//     font-weight: bold;
//     letter-spacing: 4/@rem;
//     position: relative;
//     .close-btn{
//       position: absolute;
//       right: 0;
//       top: 0;
//       width: 110/@rem;
//       height: 110/@rem;
//       .icon-cha{
//         font-size: 28/@rem;
//       }
//     }
//   }
//   .detail-body{
//     width: 100%;
//     height: 390/@rem;
//     padding:0 40/@rem;
//     box-sizing: border-box;
//     .wrapper{
//       width: 100%;
//       color: #424242;
//       font-size: 28/@rem;
//       padding-top: 35/@rem;
//       border-top: 1px solid #eee;
//       h3{
//         line-height: 44/@rem;
//       }
//       .goods-state{
//         color: #484848;
//         font-size: 26/@rem;
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         margin-top: 54/@rem;
//         p:first-child{
//           margin-bottom: 50/@rem;
//         }
//         span{
//           color: #aaaaaa;
//         }
//       }
//     }
//   }
//   .detail-footer{
//     width: 100%;
//     height: 110/@rem;
//     color: #424242;
//     font-size: 28/@rem;
//     text-align: center;
//     line-height: 110/@rem;
//     border-top: 1px solid #eee;
//   }
// }
// .shadow{
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.5);
//   z-index: 15;
// }
  .bottom-bar {
    //底部加入购物车按钮
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100 / @rem;
    z-index: 14;
    background-color: #fafafa;
    overflow: hidden;
    .bottom-num {
      box-sizing: border-box;
      width: 375 / @rem;
      height: 100%;
      overflow: hidden;
      font-size: 26 / @rem;
      padding-left: 40 / @rem;
      float: left;
      border-top: 1px solid #eeeeee;
      border-bottom: 1px solid #eeeeee;
      .title {
        float: left;
        color: #888;
        line-height: 100 / @rem;
      }
      .decrease {
        float: left;
        color: #424242;
        width: 48 / @rem;
        height: 48 / @rem;
        margin-left: 20 / @rem;
        background-color: #dddddd;
        margin-top: 24 / @rem;
        line-height: 48 / @rem;
        text-align: center;
      }
      .num {
        float: left;
        color: #424242;
        width: 57 / @rem;
        height: 48 / @rem;
        line-height: 48 / @rem;
        text-align: center;
        margin-top: 24 / @rem;
        background-color: #fafafa;
      }
      .increase {
        float: left;
        color: #424242;
        width: 48 / @rem;
        height: 48 / @rem;
        background-color: #dddddd;
        margin-top: 24 / @rem;
        line-height: 48 / @rem;
        text-align: center;
      }
    }
    .bottom-btn {
      float: right;
      width: 375 / @rem;
      text-align: center;
      line-height: 100 / @rem;
      font-size: 28 / @rem;
      color: #fff;
      background-color: #424242;
    }
  }
  // 遮罩层
  .cover {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 15;
    background-color: rgba(0, 0, 0, 0.5);
  }
  // 商品详情页面
  .detailwrapper {
    box-sizing: border-box;
    width: 100%;
    height: 1334 / @rem;
    overflow: hidden;
    background-color: #fff;
    z-index: 13;
    .detail {
      box-sizing: border-box;
      padding-top: 101 / @rem;
      padding-bottom: 100 / @rem;
      // 商品界面
      .swiper-box {
        position: relative;
        .swiper {
          width: 100%;
          position: relative;
          .vux-indicator-center {
          }
          .swiper-item {
            width: 100%;
            height: 100%;
            .pre-img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .indicator {
          position: absolute;
          bottom: 20 / @rem;
          left: 30 / @rem;
          width: 86 / @rem;
          height: 40 / @rem;
          color: #fff;
          font-size: 24 / @rem;
          text-align: center;
          line-height: 40 / @rem;
          border-radius: 50px;
          background-color: rgba(0, 0, 0, 0.5);
        }
        .store-name {
          box-sizing: border-box;
          position: absolute;
          right: 0;
          bottom: 20 / @rem;
          height: 60 / @rem;
          padding-left: 30 / @rem;
          padding-right: 30 / @rem;
          background-color: rgba(0, 0, 0, 0.5);
          border-top-left-radius: 30 / @rem;
          border-bottom-left-radius: 30 / @rem;
          overflow: hidden;
          .icon-dianpu {
            float: left;
            height: 60 / @rem;
            line-height: 60 / @rem;
            color: #fff;
            font-size: 36 / @rem;
            margin-right: 14 / @rem;
          }
          .name {
            float: left;
            height: 60 / @rem;
            line-height: 60 / @rem;
            font-size: 26 / @rem;
            color: #fff;
          }
        }
      }

      .product-name {
        box-sizing: border-box;
        padding: 40 / @rem 40 / @rem 20 / @rem 40 / @rem;
        font-size: 30 / @rem;
        .name {
          // width: 578/@rem;
          color: #888;
        }
      }
      .product-price {
        box-sizing: border-box;
        padding-left: 40 / @rem;
        padding-right: 40 / @rem;
        padding-bottom: 40 / @rem;
        font-size: 36 / @rem;
        font-weight: bold;
        color: #3b3b3b;
        position: relative;
        .money {
          font-size: 38 / @rem;
        }
        .delivery-date{
          font-weight: normal;
          font-size: 24 / @rem;
          color: #888;
          position: absolute;
          right: 230 / @rem;
          bottom: 40 / @rem;
        }
        .product-quantity {
          font-weight: normal;
          font-size: 24 / @rem;
          color: #888;
          position: absolute;
          right: 40 / @rem;
          bottom: 40 / @rem;
        }
      }
      .attr-info {
        margin-left: 30 / @rem;
        margin-right: 30 / @rem;
        padding-top: 30 / @rem;
        padding-bottom: 30 / @rem;
        color: #888;
        position: relative;
        overflow: hidden;
        .icon-more {
          position: absolute;
          top: 30 / @rem;
          right: 0;
        }
        .attr-info-title {
          // float: left;
          font-size: 30 / @rem;
          color: #424242;
          margin-bottom: 40 / @rem;
        }
        .attr-info-name {
          box-sizing: border-box;
          display: inline-block;
          float: left;
          font-size: 26 / @rem;
          // height: 60 / @rem;
          padding-top: 10/@rem;
          padding-bottom: 10/@rem;
          padding-left: 20 / @rem;
          padding-right: 20 / @rem;
          margin-right: 20 / @rem;
          margin-bottom: 30 / @rem;
          color: #888888;
          border: 1px solid #eeeeee;
          line-height: 40 / @rem;
        }
        .attr-info-name-selected {
          border-color: #888;
          color: #424242;
        }
        .attr-info-name-none {
          color: #ccc;
          border-color: #eee;
        }
      }
      .parameter {
        //参数界面
        margin: 0 30 / @rem;
        padding: 30 / @rem 0;
        font-size: 28 / @rem;
        overflow: hidden;
        .parameter-title {
          float: left;
          width: 160 / @rem;
          color: #888;
        }
        .parameter-name {
          float: right;
          width: 530 / @rem;
          color: #424242;
        }
      }
      .parameter-border {
        border-top: 1px solid #dedede;
      }
      .line {
        margin-left: 30 / @rem;
        margin-right: 30 / @rem;
        border-bottom: 1px solid #dedede;
      }
      .big-line {
        height: 30 / @rem;
        background-color: #f6f6f6;
      }
    }
  }
}
</style>