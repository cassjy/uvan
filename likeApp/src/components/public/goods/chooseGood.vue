<template>
  <div>
    <div class="cover noCover" @click="close"></div>
    <div class=" attrList showAttr ">
      <div class="iconfont icon-guanbi" @click="close"></div>
      <div class="_title">
        <div class="title">商品规格</div>
      </div>
      <div class="goodview">
        <div class="good-name">{{good.name}}</div>
        <div class="good-price">￥{{vprice}}</div>
        <div class="quantity">库存:{{good.quantity}}</div>
      </div>
      <div class="attrListScroll">
        <div class="attr">
          <div v-for="(attrtype,i) in good.skus" :key="i">
            <div v-show="attrtype.quantity!=0" class="colorList" :class="{'select': selectSku==attrtype.skuid}" @click="changetype(); selectSku=attrtype.skuid;good.skuid=attrtype.skuid; good.property=attrtype.property; good.outerCode=attrtype.outerCode; good.quantity=attrtype.quantity">{{attrtype.property}}</div>
          </div>
        </div>
      </div>
      <div class="confirm">
        <div class='counter-container'>
          购买数量:
          <div class='decrease-increase' v-show="good.count>0" @click="good.count--" :class="{decreaseIncreaseDisabled : good.count <= 1}" style="margin-left: 2px;">-</div>
          <input class='count-input' type="number" v-model='good.count' />
          <div class='decrease-increase' @click="good.count++" :class="{decreaseIncreaseDisabled :good.count >= 999}">+</div>
        </div>
        <div class="innerconfirm" @click="updatecacheCart()">加入购物车</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vux";
export default {
  name: "chooseGood",
  props: ["good"],
  data() {
    return {
      ifexist: -1,
      chooseIndex: 0
    };
  },
  components: {
    Toast
  },
  computed: {
    selectSku: {
      get: function() {
        return this.good.skuid || this.good.skus[0].skuid;
      },
      set: function() {}
    },
    vprice() {
      var p = 0;
      var _this = this;
      this.good.skus.map(function(value, index) {
        if (value.skuid == _this.selectSku) {
          p = value.price;
        }
      });
      this.good.price = p;
      return p;
    }
  },
  methods: {
    //新加入，编辑
    updatecacheCart: function() {
      var newItem = this.good;
      var cart = JSON.parse(this.$storage.getItem("cart")) || [];
      var _this = this;
      this.ifexist = cart.findIndex(function(item) {
        return item.skuid == _this.good.skuid && item.id == _this.good.id;
      });
      if (this.ifexist == -1) {
        cart.splice(0, 0, newItem); //全是新的
        this.$vux.toast.show({
          type: "success",
          text: "已加入购物车",
          width: "12em",
          position: "middle"
        });
      } else {
        newItem.count = cart[this.ifexist].count + newItem.count;
        cart.splice(this.ifexist, 1, newItem);
      }
      console.log(cart);
      this.$storage.setItem("cart", JSON.stringify(cart));
      this.$emit("attrflase", false);
      this.$emit("listenCache", cart);
    },
    close: function() {
      this.$emit("attrflase", false);
    },
    //规格变动有一个转换的方法
    changetype: function() {
      var _this = this;
      var cart = JSON.parse(this.$storage.getItem("cart")) || [];
      //判断是否存在这个id和规格，如果存在不用传进来的值新，新的就另开一个
      this.ifexist = cart.findIndex(function(item) {
        return item.skuid == _this.good.skuid && item.id == _this.good.id;
      });
    }
  },
  created: function() {
    var t = this.good.skuid || this.good.skus[0].skuid;
    console.log(this.good);
    var _this = this;
    var cart = JSON.parse(this.$storage.getItem("cart")) || [];
    //判断是否存在这个id和规格，如果存在不用传进来的值新，新的就另开一个
    this.ifexist = cart.findIndex(function(item) {
      return item.skuid == _this.good.skuid && item.id == _this.good.id;
    });
    if (this.ifexist != -1) {
      this.good = cart[this.ifexist];
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../common/css/defult.less";
/*cover*/
.cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 130;
  display: none;
}
.noCover {
  display: block;
  overflow: hidden;
}

.attrList {
  box-sizing: border-box;
  background-color: #fff;
  position: fixed;
  bottom: -120%;
  width: 100%;
  /*height: 480/@rem;*/
  /*padding-left: 24/@rem;
  padding-right: 24/@rem;*/
  z-index: 199;
  transition: bottom 0.5s;
  /*border-top-left-radius: 20/@rem;*/
  /*border-top-right-radius: 20/@rem;*/
}
.attrList .iconfont {
  position: absolute;
  font-size: 40 / @rem;
  width: 40 / @rem;
  height: 40 / @rem;
  color: white;
  top: -80 / @rem;
  right: 40 / @rem;
  font-weight: bolder;
}
.attrList ._title {
  box-sizing: border-box;
  line-height: 112 / @rem;
  font-size: 34 / @rem;
  margin: 0 42 / @rem;
  border-bottom: 1 / @rem solid #dedede;
  overflow: hidden;
}
.attrList ._title .title {
  float: left;
  font-size: 36 / @rem;
  color: #424242;
}
.attrList .goodview {
  margin: 30 / @rem 40 / @rem 0 40 / @rem;
  .good-name {
    font-size: 30 / @rem;
    line-height: 46 / @rem;
    width: 100%;
    color: #888;
  }
  .good-price {
    color: #222;
    font-size: 36 / @rem;
    line-height: 78 / @rem;
    font-weight: bold;
    display: inline-block;
    padding-bottom: 49 / @rem;
  }
  .quantity {
    color: #888;
    font-size: 28 / @rem;
    display: inline-block;
    padding-bottom: 49 / @rem;
    float: right;
  }
}
.attrListScroll {
  min-height: 50 / @rem;
  max-height: 250 / @rem;
  height: 100%;
  overflow: scroll;
  padding-bottom: 52 / @rem;
}
// .attrList ._title .iconfont{
//   font-size: 30/@rem;
//   font-weight: bold;
//   width: 50/@rem;
//   height: 50/@rem;
// }
.attrList .view {
  box-sizing: border-box;
  /*height: 200/@rem;*/
  margin-left: 24 / @rem;
  margin-right: 24 / @rem;
  padding-top: 10 / @rem;
  padding-bottom: 10 / @rem;
  border-bottom: 2 / @rem solid #ccc;
  overflow: hidden;
}
.attrList .view img {
  background-color: #ccc;
  width: 180 / @rem;
  height: 180 / @rem;
  float: left;
}
.attrList .view .info {
  overflow: hidden;
  padding-left: 20 / @rem;
}
.attrList .view .info .title {
  font-size: 24 / @rem;
  letter-spacing: 4 / @rem;
  line-height: 36 / @rem;
  color: #424242;
}

.attrList .view .info .thisPrice {
  font-size: 28 / @rem;
  color: #f35c5c;
  margin-top: 16 / @rem;
}
.attrList .view .info .attrRes {
  font-size: 24 / @rem;
  margin-top: 12 / @rem;
  line-height: 24 / @rem;
  color: #888;
}
.attrList .view .info .attrRes .hiddenColor {
  display: none;
}
.attrList .view .info .attrRes div {
  border-radius: 8 / @rem;
  display: inline-block;
  height: 56 / @rem;
  line-height: 56 / @rem;
  padding-right: 10 / @rem;
  font-size: 28 / @rem;
  color: #424242;
}
.attrList .view .info .inventory {
  float: right;
  color: #000;
  font-size: 24 / @rem;
}
.attrList .view .info .hiddenInventory {
  display: none;
}
.attrList .attr {
  box-sizing: border-box;
  margin: 0 40 / @rem;
  font-size: 28 / @rem;
  /*border-bottom: 2/@rem solid #ccc;*/
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.attrList .attr .color {
  padding-bottom: 10 / @rem;
  overflow: hidden;
  display: inline-block;
}
.attrList .attr .color .colorTitle {
  margin-bottom: 10 / @rem;
}
.attrList .attr .colorList {
  display: inline-block;
  font-size: 24 / @rem;
  box-sizing: border-box;
  padding: 12 / @rem 36 / @rem;
  margin-right: 20 / @rem;
  margin-bottom: 20 / @rem;
  color: #666666;
  border: 2 / @rem solid #dedede;
  /*border-radius: 8/@rem;*/
}
.attrList .hiddenColor,
.attrList .attr .hiddenColor {
  display: none;
}

.attrList .selectNum {
  box-sizing: border-box;
  margin-left: 24 / @rem;
  margin-right: 24 / @rem;
  padding-top: 10 / @rem;
  padding-bottom: 10 / @rem;
  font-size: 28 / @rem;
}

.attrList .selectNum .stepper,
.goodsDetail .buyNum .stepper {
  width: 160 / @rem;
  height: 52 / @rem;
  border: 2 / @rem solid #ccc;
  border-radius: 8 / @rem;
  margin-top: 10 / @rem;
}
.attrList .selectNum .stepper text,
.goodsDetail .buyNum .stepper text {
  width: 38 / @rem;
  line-height: 52 / @rem;
  text-align: center;
  float: left;
}
.attrList .selectNum .stepper input,
.goodsDetail .buyNum .stepper input {
  width: 80 / @rem;
  height: 52 / @rem;
  float: left;
  margin: 0 auto;
  text-align: center;
  font-size: 24 / @rem;
  border-left: 2 / @rem solid #ccc;
  border-right: 2 / @rem solid #ccc;
}
.attrList .selectNum .stepper .normal,
.goodsDetail .buyNum .stepper .normal {
  color: black;
}
.attrList .selectNum .stepper .disabled,
.goodsDetail .buyNum .stepper .disabled {
  color: #ccc;
}
.showAttr {
  bottom: 0;
  transition: bottom 0.5s;
}
.attrList .attr .select {
  background-color: #424242;
  color: #fff;
}
.attrList .confirm,
.attrList .confirm1 {
  box-sizing: border-box;
  width: 100%;
  height: 96 / @rem;
  text-align: center;
  font-size: 28 / @rem;
  line-height: 80 / @rem;
  color: #fff;
  border-top: 2 / @rem solid #dedede;
}
.attrList .hiddenconfirm {
  display: none;
}
.attrList .confirm .innerconfirm,
.attrList .confirm1 .innerconfirm {
  float: right;
  display: inline-block;
  width: 330 / @rem;
  height: 94 / @rem;
  line-height: 94 / @rem;
  background-color: #424242;
}
.attrList .confirm .innerconfirm1,
.attrList .confirm1 .innerconfirm1 {
  float: right;
  display: inline-block;
  width: 330 / @rem;
  height: 94 / @rem;
  line-height: 94 / @rem;
  background-color: #424242;
}
.counter-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #fafafa;
  font-size: 26 / @rem;
  color: #888;
}
.confirm .counter-container,
.confirm1 .counter-container {
  box-sizing: border-box;
  width: 400 / @rem;
  height: 94 / @rem;
  float: left;
  padding-left: 30 / @rem;
}
.count-input {
  width: 55 / @rem;
  height: 60 / @rem;
  color: #424242;
  font-size: 24 / @rem;
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center; */
  text-align: center;
  background-color: #fafafa;
}
.decrease-increase {
  width: 46 / @rem;
  height: 46 / @rem;
  text-align: center;
  line-height: 46 / @rem;
  /*border-radius: 50px;*/
  background-color: #666666;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decrease-increase--disabled {
  color: #fff;
  background-color: #dedede;
}
</style>