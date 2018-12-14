<template>
  <div class="shopping-cart">
    <!-- <div class="list-handle-bar" :class="{'list-handle-bar-show':isSelectEdit}">
            <div class="submit-delete" @click="handleDeleteMore">删除</div>
        </div> -->
    <div style="overflow: hidden; width:100%;" :style="{height: fullHeight+'px'}" ref="goodlistscroll">
      <div class="empty" v-if="goodList.length ==0">
        <img src="~common/images/shopping-cart/shopping-cart-empty.png" alt="empty">
      </div>
      <div class="content" v-else>
        <div class="goodList1" v-if="furnitureList.length !=0">
          <div class="furniture">
            <div class='check-box-container title-icon' style="float: left;" @click="selectProductSelect(isSelectAllFurniture,1)">
              <div class='check-box-icon'>
                <div class="check-box-icon1" v-if="isSelectAllFurniture"></div>
              </div>
            </div>
            <div class="home-img"><img src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/bcbdceb5be40419ba4ce0fee317f4417" /></div>
            <div class="title">优梵艺术旗舰店</div>
          </div>
          <div class="border-wrapper">
            <div class="border"></div>
          </div>
          <div v-for='(product, index) in furnitureList' :key="index">
            <div class='shopping-cart-list-cell-container' @click="toDetail(product.id)">
              <div class='check-box-container' style="float: left;" @click.stop="product.isChecked = !product.isChecked">
                <div class='check-box-icon'>
                  <div class="check-box-icon1" v-if="product.isChecked"></div>
                </div>
              </div>
              <img class='product-image' :src='product.pic' style="float: left;">
              <div v-if='!isEditStatus' class='right-container'>
                <div class='product-name'>
                  <img :src="product.storename ==='优梵艺术旗舰店'? storeIcon[0] : storeIcon[1]" v-if="product.storename==='优梵艺术旗舰店' || product.storename==='saladliang'" alt="" width="15" height="15">{{product.name}}
                </div>
                <div class='product-specifications'>
                  <div>
                    <div class='product-specifications-a'>{{product.property}}</div>
                    <div class="iconfont icon-xiasanjiao" style="position: absolute;right: 0;top: 0;font-size: 24/@rem;"></div>
                  </div>
                </div>
                <div class='product-count-price'>
                  <!-- <div wx:if="{{product.stock>=product.count}}">X{{product.count}}</div> -->
                  <!-- <div v-if="product.stock<product.count">库存不足</div> -->
                  <!-- <div wx:else>X{{product.count}}</div> -->
                  <div class="red-price">¥{{product.price|| 10000}}</div>
                  <div class='counter-container'>
                    <!-- 购买数量: -->
                    <div class='decrease-increase' @click.stop="cart($event,'-',product)" :class="{decreaseIncreaseDisabled : product.count <= 1}" :disabled="product.count <= 1" style="margin-left: 2px;" :data-productid="product.id" :data-skuid="product.skuid">-</div>
                    <input class='count-input' @blur="checkNum($event,product)" @click.stop="press()" v-model='product.count' :data-productid="product.id" :data-skuid="product.skuid" />
                    <div class='decrease-increase' @click.stop="cart($event,'+',product)" :class="{decreaseIncreaseDisabled : product.count >= 99}" :disabled="product.count >= 99" :data-productid="product.id" :data-skuid="product.skuid">+</div>
                  </div>
                </div>
              </div>
              <div v-if="!product.canedit" class="itemCover" @click.stop="showgoodtip()"></div>
            </div>
            <!-- <div style='height: 1px; background-color: #EEEEEE;'></div> -->
            <div class="border-wrapper" v-if="index !=furnitureList.length-1 ||decorationsList.length==0">
              <div class="border"></div>
            </div>
          </div>
        </div>
        <div class="line" v-if="decorationsList.length !=0 &&furnitureList!=0"></div>
        <div class="goodList2" v-if="decorationsList.length !=0">
          <div class="furniture">
            <div class='check-box-container title-icon' style="float: left;"  @click="selectProductSelect(isSelectAllDecorations,2)">
              <div class='check-box-icon'>
                <div class="check-box-icon1" v-if="isSelectAllDecorations"></div>
              </div>
            </div>
            <div class="home-img"><img src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/bc14475e2969434dbeecf7a4d453b99a" /></div>
            <div class="title">优梵艺术家居旗舰店</div>
          </div>
          <div class="border-wrapper">
            <div class="border"></div>
          </div>
          <div v-for='(product, index) in decorationsList' :key="index">
            <div class='shopping-cart-list-cell-container' @click="toDetail(product.id)">
              <div class='check-box-container' style="float: left;" @click.stop="product.isChecked = !product.isChecked">
                <div class='check-box-icon'>
                  <div class="check-box-icon1" v-if="product.isChecked"></div>
                </div>
              </div>
              <img class='product-image' :src='product.pic' style="float: left;">
              <div v-if='!isEditStatus' class='right-container'>
                <div class='product-name'>
                  <img :src="product.storename ==='优梵艺术旗舰店'? storeIcon[0] : storeIcon[1]" v-if="product.storename==='优梵艺术旗舰店' || product.storename==='saladliang'" alt="" width="15" height="15">{{product.name}}
                </div>
                <div class='product-specifications'>
                  <div>
                    <div class='product-specifications-a'>{{product.property}}</div>
                    <div class="iconfont icon-xiasanjiao" style="position: absolute;right: 0;top: 0;font-size: 24/@rem;"></div>
                  </div>
                </div>
                <div class='product-count-price'>
                  <!-- <div wx:if="{{product.stock>=product.count}}">X{{product.count}}</div> -->
                  <!-- <div v-if="product.stock<product.count">库存不足</div> -->
                  <!-- <div wx:else>X{{product.count}}</div> -->
                  <div class="red-price">¥{{product.price|| 10000}}</div>
                  <div class='counter-container'>
                    <!-- 购买数量: -->
                    <div class='decrease-increase' @click.stop="cart($event,'-',product)" :class="{decreaseIncreaseDisabled : product.count <= 1}" :disabled="product.count <= 1" style="margin-left: 2px;" :data-productid="product.id" :data-skuid="product.skuid">-</div>
                    <input class='count-input' @blur="checkNum($event,product)" @click.stop="press()" v-model='product.count' :data-productid="product.id" :data-skuid="product.skuid" />
                    <div class='decrease-increase' @click.stop="cart($event,'+',product)" :class="{decreaseIncreaseDisabled : product.count >= 99}" :disabled="product.count >= 99" :data-productid="product.id" :data-skuid="product.skuid">+</div>
                  </div>
                </div>
              </div>
              <div v-if="!product.canedit" class="itemCover" @click.stop="showgoodtip()"></div>
            </div>
            <!-- <div style='height: 1px; background-color: #EEEEEE;'></div> -->
            <div class="border-wrapper">
              <div class="border"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="shopping-cart-bottom-container">
      <div class="left" @click="selectProductSelect(isSelectAll,0)">
        <div class="icon">
          <div class="icon1" v-if="isSelectAll"></div>
        </div>
        <div class="title">全选</div>
      </div>
      <div class="center">
        <div class="label">合计:</div>
        <div class="price">￥{{getTotal.totalPrice}}</div>
      </div>
      <div v-if="manageStatus =='结算'" class="submit" @click="toAccount">
        {{manageStatus}}
      </div>
      <div class="submit" v-else @click="confirmDelete">
        {{manageStatus}}
      </div>
    </div>
    <!-- <dialog-confirm :show="dialogshow" dialogtitle="提示"  dialogmessage="确定要删除该商品吗？" @listenShow="parentListenShow" ></dialog-confirm> -->
    <dialog-confirm :dialogshow.sync="dialogshow" :dialogConfig="dialogConfig"></dialog-confirm>
    <choose-good v-show="attrOn" :good="chooseGoodItem" @listenCache="listenMethod" @attrflase="listenAttr"></choose-good>
    <router-view></router-view>
    <confirm 
    
    @on-cancel="onCancel"
    @on-confirm="onConfirm">
    </confirm>
  </div>
</template>
<script>
import UA from "common/js/ua.js";
import chooseGood from "public/goods/chooseGood";
import dialogConfirm from "public/dialogConfirm/dialogConfirm";
import BScroll from "better-scroll";
import { mapGetters } from "vuex";
import Bus from "common/js/bus.js";
import { Toast, Loading, Confirm } from "vux";
export default {
  name: "shoppingCart",
  components: {
    "choose-good": chooseGood,
    "dialog-confirm": dialogConfirm,
    Loading,
    Toast,
    Confirm
  },
  data() {
    return {
      ifipad: UA,
      isEditStatus: false,
      attrOn: false,
      chooseGoodIndex: 0,
      goodList: [], //ischecked
      cartCount: 0,
      manageStatus: "结算",
      dialogshow: false,
      chooseGoodItem: {
        name: "树脂工艺品马摆件 简约现代动物摆设   中秋 高档 礼品 送领导 商",
        price: "268.00",
        id: "15274389852",
        skuid: 33925215454,
        property: "汗血宝马小摆件",
        pic:
          "https://img.alicdn.com/bao/uploaded/i4/872353151/T2khwXXeFXXXXXXXXX_!!872353151.jpg",
        count: 15,
        quantity: 3,
        skus: [
          {
            property:
              "栗棕马首摆件栗棕马首摆件栗棕马首摆件栗棕马首摆件栗棕马首摆件",
            skuid: 28975684858,
            price: "846.00",
            url:
              "https://img.alicdn.com/bao/uploaded/i1/872353151/T2_NL.Xi0aXXXXXXXX_!!872353151.jpg",
            quantity: 0,
            selected: true
          },
          {
            property: "汗血宝马小摆件",
            skuid: 33925215454,
            price: "268.00",
            url:
              "https://img.alicdn.com/bao/uploaded/i4/872353151/T2khwXXeFXXXXXXXXX_!!872353151.jpg",
            quantity: 3,
            selected: false
          },
          {
            property: "青峰马首摆件",
            skuid: 44731744393,
            price: "846.00",
            url:
              "https://img.alicdn.com/bao/uploaded/i2/872353151/T2n53XXgFXXXXXXXXX_!!872353151.jpg",
            quantity: 3,
            selected: false
          }
        ],
        isChecked: false
      },
      dialogConfig: {
        dialogtitle: "提示",
        dialogmessage: "确定要删除该商品吗？",
        type: 3 //1取消 2确定 3两个都有
      },
      fullHeight: document.documentElement.clientHeight - 145,
      options: {
        pullDownRefresh: {
          threshold: 0, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 0 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: 20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        pullDownRefresh: true, //关闭下拉
        // pullUpLoad: true, // 关闭上拉
        click: true,
        probeType: 3,
        startY: 0,
        preventDefaultException: {
          tagName: /^(IMG|SELECT)$/
        },
        scrollbar: false
      },
      storeIcon: [
        "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/7c64ec8e90ef4a219e8aea82698ee8d7",
        "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/4c5fedfd129e4d6db88c046d5ca8bd6f"
      ],
      canUpdateCount: true,
      furnitureList: [], //家具数组
      decorationsList: [] // 饰品数组
    };
  },
  created() {
    // var cart = JSON.parse(this.$storage.getItem("cart")) || [];
    // cart.forEach(function(item, index) {
    //   item["isChecked"] = false;
    // });
    // this.goodList = cart;
    //初始化购物车
    this.$vux.loading.show({
      text: "加载中"
    });
    this.getCart(1);
    window.eventHub.$on("dialogquit", this.dialogquit);
    window.eventHub.$on("dialogconfirm", this.dialogconfirm);
    var _this = this;
    this.bus.$on("shareshopping", status => {
      //通过$on监听事件sharetext
      status == "管理"
        ? (_this.manageStatus = "结算")
        : (_this.manageStatus = "删除");
    });
  },
  beforeDestroy: function() {
    window.eventHub.$off("dialogquit");
    window.eventHub.$off("dialogconfirm");
  },
  mounted() {
    var _this = this;
    this.bus.$on("shareshopping", status => {
      //通过$on监听事件sharetext
      status == "管理"
        ? (_this.manageStatus = "结算")
        : (_this.manageStatus = "删除");
    });
    this.resetBetterScroll();
  },
  computed: {
    //是否全选
    isSelectAll: function() {
      return this.goodList.every(function(value) {
        return value.isChecked;
      });
    },
    // 家具商品是否全选
    isSelectAllFurniture(){
       return this.furnitureList.every((value)=>{
         return value.isChecked
       })
    },
    // 饰品是否全选
    isSelectAllDecorations(){
     return this.decorationsList.every((value)=>{
         return value.isChecked
       })
    },
    //弹窗的缓存
    dialogCache: function() {
      return {
        good: this.goodList[this.chooseGoodIndex],
        Attr: this.ProductAttr
      };
    },
    isSelectEdit: function() {
      return this.goodList.some(function(value) {
        return value.isChecked;
      });
    },
    getTotal: function() {
      //获取productList中select为true的数据。
      var _proList = this.goodList.filter(function(val) {
          return val.isChecked;
        }),
        totalPrice = 0;
      for (var i = 0, len = _proList.length; i < len; i++) {
        //总价累加
        totalPrice += _proList[i].count * _proList[i].price;
      }
      //选择产品的件数就是_proList.length，总价就是totalPrice
      return { totalNum: _proList.length, totalPrice: totalPrice.toFixed(2) };
    },
    cacheProduct_specifications: function() {
      var retuenstr = "",
        showstr = "";
      this.dialogCache.Attr.forEach(element => {
        retuenstr =
          retuenstr + element.Name + ":" + element.ValuesSelect.name + ",";
        showstr = showstr + element.ValuesSelect.name + " ";
      });
      retuenstr = retuenstr.substring(0, retuenstr.length - 1);
      return { retuenstr: retuenstr, showstr: showstr };
    },
    ...mapGetters(["sid"])
  },
  watch: {
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val - 150;
        this.timer = true;
        setTimeout(() => {
          this.timer = false;
        }, 400);
      }
    }
  },
  methods: {
    //获取购物车信息，flag进入购物车时置1，用作初始化商品isChecked的值
    getCart(flag) {
      let _this = this;
      let url = `/a/order/amOrderShopping/queryShopping?__sid=${this.sid}`;
      this.$api.get(url).then(res => {
        if (res.code == 200) {
          console.log(res);
          Bus.$emit("cartCount", res.data.length);
          let cart = res.data;
          if (flag == 1) {
            //初始化商品isChecked的值
            cart.forEach(function(item, index) {
              item["isChecked"] = false;
            });
          } else {
            cart.forEach(function(item, index) {
              item["isChecked"] = _this.goodList[index].isChecked;
            });
          }
          cart.forEach(function(item, index) {
            item.quantity == 0 ? (item.canedit = false) : (item.canedit = true);
          });
          this.goodList = cart;
          console.log(this.goodList);
          // 商品分组
          let furnitureList = [],
            decorationsList = []; //家具和饰品数组
          this.goodList.forEach((item, index) => {
            if (item.storename == "优梵艺术旗舰店") {
              furnitureList.push(item);
            } else if (item.storename == "优梵艺术家居旗舰店") {
              decorationsList.push(item);
            }
          });
          this.furnitureList = furnitureList;
          this.decorationsList = decorationsList;
          console.log("家具");
          console.log(this.furnitureList);
          console.log("饰品");
          console.log(this.decorationsList);
          this.$vux.loading.hide();
          this.canUpdateCount = true;
        } else if (res.code == 11001) {
          //购物车为空，不作处理
          this.canUpdateCount = true;
          this.$vux.loading.hide();
        } else {
          this.$vux.toast.show({
            type: "warn",
            text: "请稍后再试",
            width: "12em",
            position: "middle"
          });
          this.$vux.loading.hide();
          this.canUpdateCount = true;
        }
      });
    },
    //全选与取消全选.
    selectProductSelect: function(_isSelect,id) {
      //遍历productList，全部取反
     if(parseInt(id)==0){
        for (var i = 0, len = this.goodList.length; i < len; i++) {
        this.goodList[i].isChecked = !_isSelect;
      }
     }else if(parseInt(id)==1){
      for (var i = 0, len = this.furnitureList.length; i < len; i++) {
        this.furnitureList[i].isChecked = !_isSelect;
      }
     }else if(parseInt(id)==2){
      for (var i = 0, len = this.decorationsList.length; i < len; i++) {
        this.decorationsList[i].isChecked = !_isSelect;
      }
     }
    },
    confirmcache: function(index) {
      //赋值所选的规格（显示文字，对象）
      this.goodList[
        this.chooseGoodIndex
      ].product_specifications = this.cacheProduct_specifications.retuenstr;
      this.productAttr = this.dialogCache.Attr;
      //赋值所选数量
      // this.goodList[this.chooseGoodIndex].count =cachecount;
    },
    //更新购物车
    cart: function(e, str, product) {
      if (!this.canUpdateCount) {
        return;
      }
      this.canUpdateCount = false;
      if (
        (str === "-" && product.count <= 1) ||
        (str === "+" && product.count >= 99)
      ){
        this.canUpdateCount = true;
        return;
      }
      this.$vux.loading.show({
        text: "加载中"
      });
      str === "-" ? this.minusCount(e, 1, 1) : this.addCount(e, 1, 0);
      // this.$storage.setItem("cart", JSON.stringify(this.goodList));.
    },
    //加数量操作
    addCount(e, selectedNum, flag) {
      let productid = e.target.dataset.productid;
      let skuid = e.target.dataset.skuid;
      let url = `/a/order/amOrderShopping/addShopping?__sid=${
        this.sid
      }&numIid=${productid}&skuId=${skuid}&count=${selectedNum}&flag=${flag}`;
      this.addCart(url);
    },
    //减数量操作
    minusCount(e, selectedNum, flag) {
      let productid = e.target.dataset.productid;
      let skuid = e.target.dataset.skuid;
      let url = `/a/order/amOrderShopping/addShopping?__sid=${
        this.sid
      }&numIid=${productid}&skuId=${skuid}&count=${selectedNum}&flag=${flag}`;
      this.addCart(url);
    },
    //输入数量
    inputCount(e, selectedNum, flag) {
      let productid = e.target.dataset.productid;
      let skuid = e.target.dataset.skuid;
      let url = `/a/order/amOrderShopping/addShopping?__sid=${
        this.sid
      }&numIid=${productid}&skuId=${skuid}&count=${selectedNum}&flag=${flag}`;
      this.addCart(url);
    },
    addCart(url) {
      this.$api.get(url).then(res => {
        if (res.code == 200) {
          this.getCart(0);
        } else if (res.code == 11001) {
          //商品已下架
          this.canUpdateCount = true;
        } else {
          this.$vux.toast.show({
            type: "warn",
            text: "请稍后再试",
            width: "12em",
            position: "middle"
          });
          this.canUpdateCount = true;
        }
      });
    },
    listenMethod: function(cart) {
      this.goodList = cart;
    },
    listenAttr: function(v) {
      this.attrOn = v;
    },
    //删除确认
    confirmDelete: function() {
      console.log(this.goodList);
      let deleteList = [];
      let _this = this
      this.goodList.map(function(item, index) {
        if (item.isChecked) {
          deleteList.push(item);
        }
      });
      if (deleteList.length <= 0) {
        this.$vux.confirm.show({
          title: "提示",
          content: "请先选中需要删除的商品！",
          onCancel () {
            _this.$vux.confirm.hide()
          },
          onConfirm () {
            _this.$vux.confirm.hide()
          }
        })
        // this.dialogshow = true;
        // this.dialogConfig = {
        //   dialogtitle: "提示",
        //   dialogmessage: "请先选中需要删除的商品！",
        //   type: 2 //1取消 2确定 3两个都有
        // };
      } else {
        this.$vux.confirm.show({
          title: "提示",
          content: "确定要删除该商品吗？",
          onCancel () {
            _this.$vux.confirm.hide()
          },
          onConfirm () {
            _this.handleDeleteMore();
            _this.$vux.confirm.hide()
          }
        })
        // this.dialogshow = true;
        // this.dialogConfig = {
        //   dialogtitle: "提示",
        //   dialogmessage: "确定要删除该商品吗？",
        //   type: 3 //1取消 2确定 3两个都有
        // };
      }
    },
    onCancel(){

    },
    onConfirm(){

    },
    //删除购物车
    handleDeleteMore: function() {
      this.$vux.loading.show({
        text: "正在删除"
      });
      let cart = [];
      let deleCart = [];
      this.goodList.map(function(item, index) {
        if (!item.isChecked) {
          cart.push(item);
        } else {
          deleCart.push({ skuid: item.skuid });
        }
      });


      // debugger;
      console.log(cart);
      // this.$storage.setItem("cart", JSON.stringify(cart));
      let url = `/a/order/amOrderShopping/removeShopping?__sid=${this.sid}`;
      let data = deleCart;
      let header = "application/json";
      this.$api.post(url, data, header).then(res => {
        if (res.code == 200) {
          this.goodList = cart;
           // 商品分组
          let furnitureList = [],
            decorationsList = []; //家具和饰品数组
          this.goodList.forEach((item, index) => {
            if (item.storename == "优梵艺术旗舰店") {
              furnitureList.push(item);
            } else if (item.storename == "优梵艺术家居旗舰店") {
              decorationsList.push(item);
            }
          });
          this.furnitureList = furnitureList;
          this.decorationsList = decorationsList;
          this.$vux.loading.hide();
        } else {
          this.$vux.loading.hide();
          this.$vux.toast.show({
            type: "warn",
            text: "请稍后再试",
            width: "12em",
            position: "middle"
          });
        }
      });
    },
    toDetail(id) {
      this.$router.push({
        name: "detail",
        params: { product_id: id, _sid: this.sid }
      });
    },
    toAccount() {
      let fzlist = []; //通过路由传到结算页面(已选中)
      let fzlist2 = []; //未选中的商品
      this.goodList.forEach((currentValue, index, arr) => {
        if (currentValue.isChecked) {
          fzlist.push(currentValue);
        } else {
          fzlist2.push(currentValue);
        }
      });
      this.$storage.setItem("cartBF", JSON.stringify(fzlist));
      console.log(`辅助数组${JSON.stringify(fzlist)}`);
      var noquantity = fzlist.some(function(item) {
        return item.quantity == 0;
      });

      if (this.isSelectEdit && !noquantity) {
        this.$router.push({
          name: "account",
          params: { list: fzlist, list2: fzlist2, listBF: fzlist }
        });
      } else if (noquantity) {
        this.$vux.toast.show({
          type: "text",
          text: "选中商品库存为0，请退出重试",
          width: "12em"
        });
      } else {
        this.dialogshow = true;
        this.dialogConfig = {
          dialogtitle: "提示",
          dialogmessage: "请先选择商品！",
          type: 2 //1取消 2确定 3两个都有
        };
      }
    },
    press() {},
    showgoodtip() {
      this.$vux.toast.show({
        type: "text",
        text: "该商品已下架",
        width: "12em"
      });
    },
    checkNum(e, product) {
      console.log(e);
      debugger;
      // if( /^[0-9]+.?[0-9]*$/.test(e.target.value))
      product.count = product.count.replace(/[^\d]/g, "");
      if (product.count > 99) {
        product.count = 99;
        this.$vux.loading.show({
          text: "正在修改"
        });
        this.inputCount(e, 99, 2);
      } else if (product.count == "" || product.count <= 0) {
        product.count = 1;
        this.$vux.loading.show({
          text: "正在修改"
        });
        this.inputCount(e, 1, 2);
      } else {
        product.count = parseInt(product.count);
        this.$vux.loading.show({
          text: "正在修改"
        });
        this.inputCount(e, product.count, 2);
      }
    },
    dialogquit() {
      this.dialogshow = false;
    },
    dialogconfirm() {
      console.log(1)
      this.dialogshow = false;
      this.handleDeleteMore();
    },
    initScroll() {
      this.goodlistscroll = new BScroll(
        this.$refs.goodlistscroll,
        this.options
      );
      this.goodlistscroll.on("pullingUp", () => {});
    },
    pullingDownUp() {
      this.goodlistscroll.finishPullUp(); //告诉 better-scroll 数据已加载
      this.goodlistscroll.refresh(); //重新计算元素高度
    },
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
    }
  }
};
</script>

<style scoped lang="less">
@import "~common/css/defult.less";
@import "./shoppingCartPhone.less";
</style>