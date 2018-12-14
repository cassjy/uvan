<template>
  <div class="list">
    <!-- :style="{height: fullHeight+'px'}" -->
    <!-- <search class="search"
    :auto-fixed="true"
    ref="search" 
    @on-focus="onFocusSearch" 
    @on-cancel="onCancelSearch" 
    @on-submit="onSubmitSearch"
    v-model="inputValue"></search> -->
    <div class="search-win">
      <form action="javascript:return true;">
        <input type="search" id="input" :class="['search',showSearch?'search-show':'']" placeholder="输入关键词检索商品" autocomplete="off" v-model="inputValue" @click.stop="onFocusSearch" @keyup.13="onSubmitSearch" />
      </form>
      <div :class="['iconfont','icon-sousuo1',showSearch?'icon-sousuo1-show':'']" @click="onSubmitSearch"></div>
      <div class="search-cancel" v-if="showSearch" @click="cancelsearch">取消</div>
      <div :class="['autocompletewrapper',autoword.length<5?'autocompletewrapper-autoheight':'']" ref="autocompletewrapper" v-if="showAutoComplete">
        <div class="autocomplete" v-if="showAutoComplete">
          <div v-for="(word,index) in autoword" :key="index" :class="['auto-word',(index+1)==autoword.length?'auto-word-noborder':'']" :data-word="word.seriesName" @click="onSubmitSearch">{{word.seriesName}}</div>
        </div>
      </div>
    </div>
    <!-- <div class="sort-head" 
		v-if="!showSearch">
			<div :class="['sort-name',nowsortword=='综合'?'hl':'']"
				data-name="综合"
				@click="sortlist($event)">综合</div>
			<div :class="['sort-name',nowsortword=='销量'?'hl':'']"
				data-name="销量"
				@click="sortlist($event)">销量</div>
			<div :class="['sort-name',nowsortword=='价格'?'hl':'']"
				data-name="价格"
				@click="sortlist($event)">价格
				<div :class="['iconfont','icon-shang',nowsortword=='价格'&&priceup==true?'price-up-or-down':'']"></div>
				<div :class="['iconfont','icon-xia',nowsortword=='价格'&&priceup==false?'price-up-or-down':'']"></div>
			</div>
			<div :class="['sort-name',nowsortword=='新品'?'hl':'']"
				data-name="新品"
				@click="sortlist($event)">新品</div>
			<div class="sort-name">筛选</div>
		</div> -->
    <div class="list-wrapper" ref="listwrapper" :style="{height: fullHeight-160+'px'}" v-if="!showSearch">
      <div class="product-list">
        <div :class="['product',index%2==0?'fl':'fr']" v-for="(product,index) in productlist" :key="index">
          <router-link :to="{name: 'detail', params: { product_id: product.numIid,_sid: sid}}">
            <img class="product-img" :src="product.picUrl">
            <div class="product-name line">{{product.title}}</div>
            <div class="product-price">
              <div class="price">￥{{product.lowestPrice}}</div>
              <div class="btn" :data-id="product.numIid" :data-index="index" :data-title="product.title" :data-img="product.picUrl" :data-nick="product.nick" @click.prevent="showAttr($event)">加入购物车</div>
            </div>
          </router-link>
        </div>
        <!-- 
			    <load-more tip="正在加载"></load-more>
			    <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
			    <load-more :show-loading="false" background-color="#fbf9fe"></load-more> -->
      </div>

      <!-- <div class="box">
        <div class="loader">
          <div class="loading-2">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
        </div>           
      </div> -->

      <div class="nogood" v-if="productlist.length==0">
        <img class="iconfont zanwushangpin" src="../../../../common/images/productlist/暂无商品.png" />
        <div class="text">暂无商品</div>
      </div>
    </div>
    <div class="search-page" v-if="showSearch&&!showAutoComplete">
      <div class="search-history">
        <div class="history-title">历史搜索</div>
        <div class="iconfont icon-shanchu" @click="deleteSearchHistory"></div>
        <div class="history-content" v-for="(historyvalue,index) in searchHistory" :key="index" :data-searchvalue="historyvalue" @click.once="selectSearchHistory($event)">
          {{historyvalue}}
        </div>
      </div>
    </div>
    <router-view></router-view>
    <queryGoodsTime :showGoodsDetail="showGoodsDetail" :isDetailPage="isDetailPage" :goodsTimeDetail="goodsTimeDetail" @updateChildState="updateChildState"></queryGoodsTime>
    <choose-good v-show="attrOn" :good="chooseGoodItem" :exist="true" @attrflase="listenAttr" @chooseType="chooseType"></choose-good>
  </div>
</template>

<script>
import { Search,Loading } from "vux";
import BScroll from "better-scroll";
import { LoadMore } from "vux";
import { mapGetters } from "vuex";
import chooseGood from "public/goods/chooseGood";
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
          threshold: 0 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        pullDownRefresh: false, //关闭下拉
        // pullUpLoad: false, // 关闭上拉
        click: true,
        probeType: 3,
        startY: 0,
        scrollbar: false,
        bounce: {
          top: false,
          bottom: false,
          left: false,
          right: false
        }
      },
      start: 0, //控制商品列表接口换页
      total: 0, //商品总数
      productlist: [],
      nowsortword: "综合", //控制选中状态
      sortword: "", //排序的关键词
      keywords: "", //搜索的关键词
      priceup: false, //价格升序或者降序
      fullHeight: document.documentElement.clientHeight,
      fromCate: false, //判断是否来自分类页面
      showSearch: false, //控制显示搜索页面还是商品列表页面
      inputValue: "", //输入的搜索的内容
      searchValue: "", //传到接口的搜索的内容
      searchHistory: [], //搜索历史
      _sid: "", //sid
      pageNo: 1, //加载的页码
      canLoad: true, //控制上拉加载
      chooseGoodItem: {
        //商品信息
        name: "",
        id: "",
        skuid: 768797,
        property: "",
        price: "",
        pic: "",
        count: 1,
        quantity: 0,
        skus: [],
        outerCode: "",
        storename: ""
      },
      skulist: [],
      attrOn: false,
      onsearch: false,
      searchtotal: "",
      showAutoComplete: false,//联想词条窗口
      autoword: [],//联想词条
      isLoadmore: false,
      showGoodsDetail: false, //显示货期详情
      isDetailPage: false,
      goodsTimeDetail:{},
      materialNum: ''
    };
  },
  components: {
    Loading,
    LoadMore,
    Search,
    "choose-good": chooseGood,
    queryGoodsTime
  },
  computed: {
    ...mapGetters(["sid"])
  },
  created() {
    this.$vux.loading.show({
     text: '加载中'
    })
    // this.$api.post('/guide/login?loginCode=1012&passWord=123456').then(res=>{
    // 	console.log(res)
    //     if(res.code == 200){
    //     	this._sid = res.data.sessionid
    //     	this.loadProductList('',res.data.sessionid);
    //     }
    //   })
    let sid = this.sid;
    this.bus.$emit("showcancel", false);
    this.loadProductList("", sid);
  },
  mounted() {
    let body = document.querySelector('body')
    body.addEventListener('click',()=>{
      this.showAutoComplete = false
    })

    this.bus.$on("showproductsearch", e => {
      this.showSearch = e;
      this.showAutoComplete = false;
    });
    if (this.$route.params.fromCate) {
      this.showSearch = true;
      this.fromCate = true;
      this.searchHistory = this.$route.params.searchHistory;
      console.log(this.$route.params.searchHistory);
      this.$refs.search.setFocus();
    } else {
      this.resetBetterScroll();
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
    inputValue(){
      this.watchInputValue()
    }
  },
  methods: {
    updateChildState(value){
       if(parseInt(value)==1){
          this.$vux.loading.show({
              text: "查询中..."
            });
         this.queryGoodsTimeMethods(this.materialNum)
      }else if(parseInt(value)==2){
         this.showGoodsDetail = false
      }
    },
    cancelsearch() {
      this.showSearch = false;
      this.pageNo = 1;
      this.productlist = []
      this.loadProductList("", this.sid);
    },
    toDetail() {},
    //加载商品列表
    loadProductList(searchValue, _sid) {
      // let url = '/a/tianmao/tbProduct/listDaoGou';
      let url = "/a/product/productOuter/secondProduct?__sid=" + _sid;
      // let url = '/a/product/productOuter/secondProduct?__sid=4aebbb0dc5254f9fba9f5946ae9a4e83';
      let data = {};

      if (this.$route.params.pid) {
        data = {
          pageNo: this.pageNo,
          // "__sid": _sid,
          id: this.$route.params.pid
        };
      } else {
        data = {
          pageNo: this.pageNo,
          // "__sid": _sid,
          id: ""
        };
      }

      this.$api
        .post(url, data)
        .then(res => {
          this.$vux.loading.hide()
          console.log(res);
          if (res.code == 200 && res.data != "暂无属于该商品分类的商品") {
            // console.log(res.count)
            // this.productlist = this.productlist.concat(res.data.list)
            this.productlist = this.productlist.concat(res.data.list);
            this.total = res.data.count;
            // this.total = 101//测试
            this.canLoad = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //加载更多
    loadmore() {
      console.log(this.canLoad);
      if (!this.canLoad) {
        return;
      } else {
        this.isLoadmore = true
        this.canLoad = false;
        if (this.onsearch) {
          this.pageNo += 1;
          if (this.pageNo * 50 - this.searchtotal >= 50) {
            this.$vux.toast.show({
              text: "没有商品了",
              type: "success",
              time: 2000
            });
            return;
          }
          let data = {
            __sid: this.sid,
            title: this.inputValue,
            pageNo: this.pageNo
          };
          this.$api
            .post(
              "/a/tianmao/tbProduct/query",
              data,
              "application/x-www-form-urlencoded"
            )
            .then(res => {
              if (res.code == 200) {
                this.productlist = this.productlist.concat(res.data.list);
                this.searchtotal = res.data.count;
                this.canLoad = true;
                this.pullingDownUp()
              } else {
              }
            });
            debugger
          this.resetBetterScroll();
        } else {
          this.pageNo += 1;
          console.log(this.pageNo);
          console.log(this.pageNo * 50);
          console.log(this.pageNo * 50 - this.total);
          if (this.pageNo * 50 - this.searchtotal >= 50) {
            this.$vux.toast.show({
              text: "没有商品了",
              type: "success",
              time: 2000
            });
            return;
          }
          this.loadProductList("", this.sid);
          this.$nextTick(() => {
            setTimeout(() => {
              this.pullingDownUp();
            }, 1000);
          });
        }
      }
    },

    //
    pullingDownUp() {
      // this.foodsScroll.finishPullDown();
      this.productlistwrapper.finishPullUp(); //告诉 better-scroll 数据已加载
      this.productlistwrapper.refresh(); //重新计算元素高度
    },
    //点击输入框（获取焦点）的时候跳转到搜索页面
    onFocusSearch() {
      this.bus.$emit("showcancel", true);
      this.showSearch = true;
      if (this.$storage.getItem("searchHistory") === null) {
        this.searchHistory = [];
      } else {
        this.searchHistory = JSON.parse(this.$storage.getItem("searchHistory"));
      }
      this.watchInputValue()
      // this.$api.get('/lr/s2bapi/GetNewSearchHistory?data='+openid)
      // .then(res=>{
      //   if(res.code == 200){
      //     this.searchHistory = res.data.Data;
      //   }
      // })
      // .catch(err=>{
      //   console.log(err)
      // })
    },
    //点击取消按钮的时候返回当前页面或者
    onCancelSearch() {
      if (this.fromCate == true) {
        this.$router.go(-1);
      }
      this.showSearch = false;
      this.showAutoComplete = false
    },
    //提交搜索
    onSubmitSearch(e) {
      var input = document.getElementById("input");
      input.blur();
      let _this = this;
      console.log(this.inputValue);
      this.searchValue = this.trim(this.inputValue);
      if(e.target.dataset.word){
        this.inputValue = e.target.dataset.word
        this.searchValue = e.target.dataset.word
      }
      if (this.searchValue == "") {
        return;
      }
      this.canLoad = true;
      this.onsearch = true;
      this.productlist = [];
      this.pageNo = 1;
      this.showSearch = false;
      // this.$refs.search.setBlur()

      let data = {
        title: this.inputValue,
        pageNo: this.pageNo
      };
      debugger;
      this.$api
        .post(
          "/a/tianmao/tbProduct/query?__sid=" + _this.sid,
          data,
          "application/x-www-form-urlencoded"
        )
        .then(res => {
          this.showAutoComplete = false
          if (res.code == 200) {
            if (res.msg == "未找到符合的商品") {
              this.productlist = [];
              return;
            }
            this.bus.$emit("showcancel", false);
            if (this.$storage.getItem("searchHistory") === null) {
              this.$storage.setItem(
                "searchHistory",
                "[" + JSON.stringify(this.searchValue) + "]"
              );
            } else {
              let history = JSON.parse(this.$storage.getItem("searchHistory"));
              for (let i = 0; i < history.length; i++) {
                if (this.searchValue == history[i]) {
                  //重复关键词置顶
                  let history2 = history;
                  history = [];
                  for (let j = 0; j < history2.length; j++) {
                    if (j != i) {
                      history.push(history2[j]);
                    }
                  }
                  break;
                }
              }

              history.unshift(this.searchValue);
              if (history.length > 5) {
                history = history.slice(0, 4);
              }
              this.$storage.searchHistory = JSON.stringify(history);
            }

            this.productlist = this.productlist.concat(res.data.list);
            this.searchtotal = res.data.count;
          } else {
            // console.log(res.code+"插入失败")
          }
        });
      // this.loadProductList(this.searchValue);

      this.resetBetterScroll();
    },
    //删除搜索记录
    deleteSearchHistory() {
      this.$storage.searchHistory = "[]";
      this.searchHistory = [];
    },
    selectSearchHistory(event) {
      debugger;
      // console.log(event.target.dataset.searchvalue)
      this.searchValue = event.target.dataset.searchvalue;
      this.inputValue = event.target.dataset.searchvalue;
      this.productlist = [];
      this.showSearch = false;
      this.onSubmitSearch(event);
      // this.fromCate = false
      // this.loadProductList(this.searchValue)

      this.resetBetterScroll();
    },
    //商品规格弹窗
    listenAttr(v) {
      this.attrOn = v;
      this.isDetailPage = false
    },
    showAttr(e) {
      this.attrOn = true;
      this.chooseGoodItem.skus = [];
      this.skulist = this.productlist[e.target.dataset.index].skuList;
      console.log(this.skulist);
      debugger;
      this.chooseGoodItem.storename = e.target.dataset.nick;
      this.chooseGoodItem.price = this.skulist[0].realPrice;
      this.chooseGoodItem.name = e.target.dataset.title;
      this.chooseGoodItem.id = e.target.dataset.id;
      this.chooseGoodItem.pic = this.skulist[0].url || e.target.dataset.img;
      this.chooseGoodItem.property = this.skulist[0].properties;
      this.chooseGoodItem.skuid = this.skulist[0].skuId;
      this.chooseGoodItem.quantity = this.skulist[0].quantity;
      this.chooseGoodItem.outerCode = this.skulist[0].outerId;
      
      // this.chooseGoodItem.skus = this.skulist
      // debugger
      for (let i = 0; i < this.skulist.length; i++) {
        if (this.skulist[i].url) {
          this.chooseGoodItem.skus.push({
            property: this.skulist[i].properties,
            skuid: this.skulist[i].skuId,
            price: this.skulist[i].realPrice,
            url: this.skulist[i].url,
            quantity: this.skulist[i].quantity,
            selected: false,
            outerCode: this.skulist[i].outerId
          });
        } else {
          this.chooseGoodItem.skus.push({
            property: this.skulist[i].properties,
            skuid: this.skulist[i].skuId,
            price: this.skulist[i].realPrice,
            url: e.target.dataset.img,
            quantity: this.skulist[i].quantity,
            selected: false,
            outerCode: this.skulist[i].outerId
          });
        }
      }
      this.chooseGoodItem.skus[0].selected = true;
      this.isDetailPage = true
      this.materialNum = this.chooseGoodItem.skus[0].outerCode
      // this.$vux.loading.show({
      //      text: "加载中..."
      //  });
      // this.queryGoodsTimeMethods( this.chooseGoodItem.skus[0].outerCode)
    },

    // 子组件商品规格选择
    chooseType(value){
      console.log('选择规格')
      //  this.$vux.loading.show({
      //      text: "加载中..."
      //  });
      this.materialNum = value
      //  this.queryGoodsTimeMethods(value)
    },
 
    // 查询货期详细数据
    queryGoodsTimeMethods(value){
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

    //监控input的值
    watchInputValue(){
      this.searchValue = this.trim(this.inputValue);
      //执行联想词条接口
      let url = '/a/tianmao/tbProduct/querySeries?__sid=' + this.sid + '&seriesName='+ this.searchValue
      let data = {}
      this.$api.get(url,data)
      .then(res=>{
        console.log(res)
        if(res.code==200){
          this.showAutoComplete = true
          this.autoword = res.data
          this.$nextTick(()=>{
            this.autocompletewrapper = new BScroll(
              this.$refs.autocompletewrapper,
              {
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
                scrollbar: {
                  fade: false,
                  interactive: false,
                  height: '100px'
                }
              }
            );
          })
        }else{
          this.showAutoComplete = false
        }

      })
    },
    //去前后空格
    trim(s) {
      return s.replace(/(^\s*)|(\s*$)/g, "");
    },
    // 初始化自定义的better-scroll
    initScroll() {
      this.productlistwrapper = new BScroll(
        this.$refs.listwrapper,
        this.options
      );
      this.productlistwrapper.on("pullingUp", () => {
        this.loadmore();
      });
    },
    //重置better-scroll状态
    resetBetterScroll() {
      console.log(this.isLoadmore)
      debugger
      if(!this.isLoadmore){
        this.$nextTick(() => {
          this.initScroll();
        });
      }else{
        this.pullingDownUp()
      }
      this.isLoadmore = false
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

<style lang="less" scoped>
@import "~common/css/defult.less";
.list {
  box-sizing: border-box;
  position: fixed;
  top: 216 / @rem;
  z-index: 102;
  width: 100%;
  // height: 1018/@rem;
  // overflow: scroll;
  // padding-bottom: 100/@rem;
  background-color: #fff;
  .search-win {
    box-sizing: border-box;
    position: fixed;
    top: 100 / @rem;
    z-index: 10;
    width: 100%;
    height: 116 / @rem;
    background-color: #fff;
    padding-left: 40 / @rem;
    padding-right: 40 / @rem;
    padding-top: 28 / @rem;
    padding-bottom: 28 / @rem;
    .search {
      box-sizing: border-box;
      padding-left: 20 / @rem;
      padding-right: 70 / @rem;
      width: 100%;
      height: 60 / @rem;
      font-size: 26 / @rem;
      line-height: 60 / @rem;
      color: #222;
      background-color: #eaeaea;
    }
    .search-show{
      width: 85%;
    }
    .icon-sousuo1 {
      position: absolute;
      right: 60 / @rem;
      top: 28 / @rem;
      height: 60 / @rem;
      font-size: 28 / @rem;
      line-height: 60 / @rem;
      color: #666;
    }
    .icon-sousuo1-show{
      right: 160/@rem;
    }
    .search-cancel{
      font-size: 32/@rem;
      color: #666;
      position: absolute;
      right: 50/@rem;
      top: 35/@rem;
    }
    .autocompletewrapper {
      width: 100%;
      height: 510 / @rem;
      overflow: hidden;
      background-color: #f9f9f9;
      position: relative;
    }
    .autocompletewrapper-autoheight {
      height: auto;
    }
    // .bscroll-vertical-scrollbar{
    //   .bscroll-indicator{
    //     height: 100px !important;
    //   }
    // }
    .autocomplete {
      box-sizing: border-box;
      width: 100%;
      padding-left: 20 / @rem;
      padding-right: 20 / @rem;
      background-color: #f9f9f9;
      .auto-word {
        height: 100 / @rem;
        border-bottom: 1px solid #eeeeee;
        line-height: 100 / @rem;
        font-size: 26 / @rem;
        color: #424242;
      }
      .auto-word-noborder {
        border-bottom: none;
      }
    }
  }
  .sort-head {
    width: 100%;
    height: 80 / @rem;
    display: flex;
    flex-direction: row;
    background-color: #fff;
    border-bottom: 2 / @rem solid #eee;
    .sort-name {
      flex: 1;
      font-size: 28 / @rem;
      text-align: center;
      line-height: 80 / @rem;
      position: relative;
      .icon-shang {
        position: absolute;
        top: -10 / @rem;
        right: 14 / @rem;
        font-size: 28 / @rem;
        color: #888;
      }
      .icon-xia {
        position: absolute;
        bottom: -10 / @rem;
        right: 14 / @rem;
        font-size: 28 / @rem;
        color: #888;
      }
      .price-up-or-down {
        color: #917253;
      }
    }
    .hl {
      color: #917253;
    }
  }
  .list-wrapper {
    width: 100%;
    height: 1118 / @rem;
    overflow: hidden;
    margin-top: 12 / @rem;
    .nogood {
      position: fixed;
      top: 50%;
      left: 50%;
      margin-top: -200 / @rem;
      margin-left: -100 / @rem;
      color: #ccc;
      height: 200 / @rem;
      width: 200 / @rem;
      text-align: center;
      .zanwushangpin {
        z-index: 1;
        width: 178 / @rem;
        height: 178 / @rem;
      }
      .text {
        font-size: 28 / @rem;
        position: absolute;
        bottom: -40 / @rem;
        width: 100%;
        height: 32 / @rem;
      }
    }
    .product-list {
      box-sizing: border-box;
      width: 100%;
      padding: 0 40 / @rem 0 40 / @rem;
      overflow: hidden;
      background-color: #fff;
      .product {
        width: 315 / @rem;
        height: 465 / @rem;
        margin-bottom: 40 / @rem;
        .product-img {
          box-sizing: border-box;
          width: 100%;
          height: 315 / @rem;
          border-bottom: 1px solid #ececec;
        }
        .product-name {
          margin-top: 20 / @rem;
          font-size: 24 / @rem;
          color: #888;
          height: 64 / @rem;
          line-height: 32 / @rem;
        }
        .line {
          //显示两行，超过省略号
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .product-price {
          box-sizing: border-box;
          height: 48 / @rem;
          margin-top: 20 / @rem;
          font-size: 24 / @rem;
          color: #222;
          line-height: 48 / @rem;
          overflow: hidden;
          .price {
            float: left;
            font-size: 30 / @rem;
            font-weight: bold;
            color: #222;
          }
          .btn {
            float: right;
            box-sizing: border-box;
            width: 168 / @rem;
            height: 48 / @rem;
            border: 1px solid #aaa;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      .fl {
        float: left;
      }
      .fr {
        float: right;
      }
    }
  }
  .search-page {
    .search-history {
      padding: 30 / @rem 30 / @rem;
      position: relative;
      .history-title {
        font-size: 30 / @rem;
        margin-bottom: 20 / @rem;
      }
      .icon-shanchu {
        position: absolute;
        top: 30 / @rem;
        right: 30 / @rem;
      }
      .history-content {
        display: inline-block;
        height: 75 / @rem;
        font-size: 30 / @rem;
        line-height: 75 / @rem;
        padding-left: 20 / @rem;
        padding-right: 20 / @rem;
        margin-right: 20 / @rem;
        margin-bottom: 20 / @rem;
        background-color: #f6f3f7;
        overflow: hidden;
      }
    }
  }
}

.box {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -50px;
  width: 100px;
  padding: 3%;
  box-sizing: border-box;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
}
.loader {
  width: 80px;
  // border: 1px solid #ccc;
  float: left;
  // margin-left: 3%;
  height: 60px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
}
@-webkit-keyframes loading-2 {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.4);
  }
  100% {
    transform: scale(1);
  }
}
.loading-2 i {
  display: inline-block;
  width: 2px;
  height: 20px;
  margin: 0 2px;
  background: #fff;
  border-radius: 2px;
  -webkit-animation: loading-2 1s ease-in 0.1s infinite;
}
.loading-2 i:nth-child(1) {
  -webkit-animation: loading-2 1s ease-in 0.1s infinite;
}
.loading-2 i:nth-child(2) {
  -webkit-animation: loading-2 1s ease-in 0.2s infinite;
}
.loading-2 i:nth-child(3) {
  -webkit-animation: loading-2 1s ease-in 0.3s infinite;
}
.loading-2 i:nth-child(4) {
  -webkit-animation: loading-2 1s ease-in 0.4s infinite;
}
.loading-2 i:nth-child(5) {
  -webkit-animation: loading-2 1s ease-in 0.5s infinite;
}

::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: #ccc;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #ccc;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #ccc;
}
:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #ccc;
}

input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;

  position: relative;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: #ebebeb;
}

input[type="search"]::-webkit-search-cancel-button:after {
  position: absolute;
  content: "x";
  left: 25%;
  top: -12%;
  font-size: 20px;
  color: #fff;
}
</style>