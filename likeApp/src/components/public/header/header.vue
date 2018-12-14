<template>
  <div>
    <div class="header">
      <div v-if="ifshowBack" @click="back" class="action">
        <i class="iconfont icon-mjiantou"></i>
      </div>
      <div class="title">
        <span>{{message}}</span>
      </div>
      <div class="iconfont icon-fenlei1" v-if="message=='商品列表'&&!showcancel" @click="tolist"></div>
      <div class="cancel" v-if="message=='商品列表'&&showcancel" @click="cancelsearch2">取消</div>
      <div class="iconfont icon-gouwuche4" v-if="message=='商品详情'" @click="toCart">
        <div class="count" v-if="message=='商品详情'&&cartCount!=0">{{cartCount}}</div>
      </div>
      <div class="historyList" v-if="message=='梵导购'" @click="toHistoryList">历史接待</div>
      <div class="shopping-cart" v-if="message=='购物车'" @click="shoppingCartEdit();">{{shoppingCartStatus}}</div>
      <div class="iconfont icon-sousuo1" v-if="message=='订单列表'&&showsearch" @click="showSearch"></div>
      <div class="cancel" v-if="message=='订单列表'&&!showsearch" @click="cancelsearch">取消</div>
      <div class="iconfont icon-jia1" v-if="message=='历史接待'" @click="addCustomer"></div>
    </div>
  </div>
</template>

<script>
import Bus from "@/common/js/bus.js";
import { watch } from "fs";
export default {
  data() {
    return {
      cartCount: 0,
      shoppingCartStatus: "管理",
      showsearch: true,
      showcancel: false
    };
  },
  props: {
    message: {
      type: String,
      default: "首页"
    }
  },
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    tolist() {
      this.$router.push({ name: "classification" });
    },
    toHistoryList() {
      this.$router.push({ name: "historyList" });
    },
    toCart() {
      this.$router.push({ name: "shoppingCart" });
    },
    addCustomer() {
      this.$router.push({ name: "reception", params: { mark: 1 } });
    },
    shoppingCartEdit() {
      this.shoppingCartStatus == "管理"
        ? (this.shoppingCartStatus = "完成")
        : (this.shoppingCartStatus = "管理");
      this.bus.$emit("shareshopping", this.shoppingCartStatus); //触发事件sharetext
    },
    showSearch() {
      this.bus.$emit("showsearch", true);
      this.showsearch = false;
    },
    cancelsearch() {
      this.bus.$emit("showsearch", false);
      this.showsearch = true;
    },
    cancelsearch2() {
      this.showcancel = false;
      this.bus.$emit("showproductsearch", false);
    }
  },
  watch: {
    message: function(val, oldVal) {
      if (val != "购物车" && this.shoppingCartStatus != "管理") {
        this.shoppingCartStatus = "管理";
        this.bus.$emit("shareshopping", this.shoppingCartStatus);
      }
    }
  },
  computed: {
    isSHowTab() {
      return this.$store.getters.showTab;
    },
    ifshowBack() {
      var path = this.$route.path;
      var o =
        path == "/login" ||
        path == "/reception" ||
        path == "/productlist" ||
        path == "/shoppingCart" ||
        path == "/mine";
      return !o;
    }
    // shoppingCartStatus() {
    //   var mes = this.message != "购物车" ? "管理" : this.shoppingCartStatus;
    //   return mes;
    // }
  },
  mounted() {
    let _this = this;
    Bus.$on("cartCount", e => {
      _this.cartCount = e;
    });
    this.bus.$on("showsearch", e => {
      _this.showsearch = e;
    });
    this.bus.$on("showcancel", e => {
      _this.showcancel = e;
    });
  }
};
</script>

<style scoped lang="less">
@import "~common/css/defult.less";
.header {
  position: absolute;
  top: 0;
  width: 686 / @rem;
  padding: 32 / @rem;
  line-height: 35 / @rem;
  font-size: 32 / @rem;
  z-index: 999;
  background-color: #f4f4f4;
  display: flex;
  justify-content: space-between;
  border-bottom: 1 / @rem #eee solid;
}
.action {
  flex: 0 0 33 / @rem;
}
.icon-mjiantou {
  color: #666;
  font-size: 34 / @rem;
}
.title {
  flex: 1;
  display: inline-block;
  text-align: center;
  color: #222222;
}
.icon-fenlei1,
.icon-gouwuche4,
.icon-jia1,
.icon-sousuo1,
.cancel {
  position: absolute;
  bottom: 30 / @rem;
  right: 40 / @rem;
  color: #666;
  font-size: 34 / @rem;
}
.cancel {
  position: absolute;
  bottom: 32 / @rem;
  right: 40 / @rem;
  color: #666;
  font-size: 28 / @rem;
}
.icon-gouwuche4 {
  font-size: 46 / @rem;
  top: 30 / @rem;
}
.icon-gouwuche4 .count {
  height: 32 / @rem;
  width: 32 / @rem;
  border-radius: 50px;
  font-size: 16 / @rem;
  line-height: 32 / @rem;
  text-align: center;
  background-color: #424242;
  color: #fff;
  position: absolute;
  top: -8 / @rem;
  right: -6 / @rem;
}
.historyList {
  color: #666666;
  font-size: 28 / @rem;
  position: absolute;
  bottom: 30 / @rem;
  right: 40 / @rem;
}
.shopping-cart {
  color: #666666;
  font-size: 28 / @rem;
  position: absolute;
  bottom: 33 / @rem;
  right: 40 / @rem;
}
</style>