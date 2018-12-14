<template>
  <div class="myorderpagewrapper" ref="myorderpagewrapper" :style="{height: fullHeight-50+'px'}">
    <div class="myorderpage">
      <div v-for="(order,index) in orderList" :key="index" class="orderItem" :data-orderid="order.id" @click="todetail($event)">
        <div class="orderItemHeadBody">
          <div class="orderItemHead">
            <div>订单编号：{{order.documentCode}}</div>
            <!-- <div>{{order.customerName}}</div> -->
            <!-- <div>{{order.createTime}}</div> -->
          </div>
          <div class="buyAgain" :data-index="index" @click.stop="buyAgain($event)">商品复购</div>
        </div>
        <div v-for="(good,index) in order.goods" :key="index">
          <div class="good-body">
            <div class="good">
              <img :src="good.picUrl" alt="" />
              <div class="word">
                <div class="goodname grey">{{good.goodsName}}</div>
                <div class="secondLine black">
                  <div class="price">￥{{good.price}}</div>
                  <div class="count">x{{good.quantity}}</div>
                </div>
                <div class="spec grey">{{good.spec}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="orderItemFooter">
          <div class="order-createTime">{{order.createTime}}</div>
          <div class="totalprice">
            <span class="grey">实际付款：</span>
            <span class="black">￥{{order.totalFee}}</span>
          </div>
          <div class="buttons">
            <div class="uploadimgBtn"
            @click.stop="showUploadImage($event)" 
            :data-orderid="order.id"
            :data-documentstatus="order.documentStatus">
              <div class="iconfont icon-shangchuan" :data-orderid="order.id" :data-documentstatus="order.documentStatus"></div>
              <div class="text" :data-orderid="order.id" :data-documentstatus="order.documentStatus">{{order.documentStatus=='创建'?'上传凭证':'查看凭证'}}</div>
            </div>
            <div class="confirm" v-if="order.documentStatus=='确认'&&order.documentStatus!='提交'" @click.stop="cancelConfirm($event)" :data-orderid="order.id" :data-index="index">取消确认</div>
            <div class="confirm" v-if="order.documentStatus!='确认'&&order.documentStatus!='提交'" @click.stop="confirm($event)" :data-type="order.documentType" :data-orderid="order.id" :data-index="index">确认</div>
            <div class="updateUvanart" v-if="order.documentStatus!='提交'" @click.stop="submitToUvanart($event)" :data-orderid="order.id" :data-index="index">提交优梵</div>
            <div class="updateUvanart" v-if="order.documentStatus=='提交'" :data-orderid="order.id" :data-index="index">已提交</div>
          </div>
        </div>
        <div class="greyline"></div>
      </div>
    </div>
    <div class="cover" :class="{'noCover':attrOn}" @click="attrOn=false"></div>
    <div class="remark" :class="{'showRemark':attrOn}">
      <div class="iconfont icon-guanbi" @click="attrOn=false"></div>
      <div class="remarkBody">
        <div class="title">客户来源</div>
        <div class="client">
          <div :class="[nowClient=='老客户'?'client-selected':'']" data-name="老客户" @click="selectClient($event)">老客户</div>
          <div :class="[nowClient=='线上'?'client-selected':'']" data-name="线上" @click="selectClient($event)">线上客户</div>
          <div :class="[nowClient=='线下'?'client-selected':'']" data-name="线下" @click="selectClient($event)">线下客户</div>
          <div :class="[nowClient=='地推'?'client-selected':'']" data-name="地推" @click="selectClient($event)">地推客户</div>
        </div>
        <div class="title">备注信息</div>
        <textarea name="remarkWord" id="remarkWord" cols="30" rows="10" v-model="textPS"></textarea>
        <div class="input1" v-if="type=='平台原始订单'||type=='零售订单'">
          <label for="input1">特权定金单号1:</label>
          <input class="grey" type="text" id="input1" v-model="order1" placeholder="请输入" />
        </div>
        <div class="input2" v-if="type=='平台原始订单'||type=='零售订单'">
          <label for="input2">特权定金单号2:</label>
          <input class="grey" type="text" id="input2" v-model="order2" placeholder="请输入" />
        </div>
        <div class="input3" v-if="type=='平台原始订单'||type=='零售订单'">
          <label for="input3">特权定金单号3:</label>
          <input class="grey" type="text" id="input3" v-model="order3" placeholder="请输入" />
        </div>
        <div class="remarkButton" @click="submitorder">确认</div>
      </div>
    </div>
    <dialog-confirm :dialogshow.sync="dialogshow" :dialogConfig="dialogConfig"></dialog-confirm>
    <router-view></router-view>
    <div class="search-win" v-if="showsearch">
      <form action="javascript:return true;"><input type="search" id="input" :class="['search',showsearch?'search-show':'']" placeholder="输入客户名电话信息检索" v-model="inputValue" @focus="onFocusSearch" @keyup.13="onSubmitSearch" /></form>
      <div :class="['iconfont','icon-sousuo1',showsearch?'icon-sousuo1-show':'']" @click="onSubmitSearch"></div>
      <div class="search-cancel" v-if="showsearch" @click="cancelsearch">取消</div>
    </div>
    <div class="search-page" v-if="showsearch">
      <div class="search-history">
        <div class="history-title">历史搜索</div>
        <div class="iconfont icon-shanchu" @click="deleteSearchHistory"></div>
        <div class="history-content" v-for="(historyvalue,index) in searchHistory" :key="index" :data-searchvalue="historyvalue" @click="selectSearchHistory">
          {{historyvalue}}
        </div>
      </div>
    </div>
    <div :class="['cover',uploadImageOn?'noCover':'']"></div>
    <div class="uploadWin" v-if="uploadImageOn">
      <div class="title">{{documentStatus=='创建'?'上传凭证':'查看凭证'}}
        <div class="iconfont icon-close" @click="closeUploadImage"></div>
      </div>
      <div class="title2">{{documentStatus=='创建'?'请上传优惠凭证':(imgList.length==0?'暂无上传优惠凭证':'已上传的优惠凭证')}}</div>
      <div class="uploadimage">
        <div class="uploadPhoto">
          <div v-if="imgList.length !=0" :class="['hadupload',index==1||index==4?'hadupload-margin':'']" v-for="(pic,index) in imgList" :key="index">
            <div class="delete-btn" v-if="documentStatus=='创建'">
              <i class="iconfont icon-cha" :data-imgcode="pic.imgCode" @click="deletUploadPic($event,index)"></i>
            </div>
            <img :preview="orderid" :src="pic.imgUrl" alt="">
          </div>

          <div v-if="imgList.length<6&&documentStatus=='创建'" :class="['rect',imgList.length==1||imgList.length==4?'rect-margin':'']">
            <i class="iconfont icon-jia"></i>
            <input type="file" id="upload" accept="image/jpg" multiple @change="upload">
          </div>
        </div>
        <div class="btn">
          <div class="submit" v-if="documentStatus=='创建'" @click="submit('')">确认</div>
          <div class="submit" v-else @click="closeUploadImage">关闭</div>
        </div>
      </div>
    </div>
    <confirm 
    
    @on-cancel="onCancel"
    @on-confirm="onConfirm">
    </confirm>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Toast, Loading, Confirm } from "vux";
import dialogConfirm from "components/public/dialogConfirm/dialogConfirm";
import BScroll from "better-scroll";
import Exif from 'exif-js';
import Bus from "@/common/js/bus.js";
import { setTimeout } from "timers";
import {formatTime , getuuid, dataURLtoBlob} from 'common/js/common.js'
export default {
  name: "myorder",
  components: {
    "dialog-confirm": dialogConfirm,
    Loading,
    Confirm
  },
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
        scrollbar: false,
        // preventDefault: false
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV)$/
        }
      },
      fullHeight: document.documentElement.clientHeight,
      attrOn: false,
      dialogshow: false,
      orderList: [],
      page: 1,
      pagesize: 0,
      ordercount: 0,
      type: "", //订单类型
      nowClient: "", //客户来源
      textPS: "", //备注
      order1: "", //特权定金订单1
      order2: "", //特权定金订单2
      order3: "", //特权定金订单3
      lastorderid: "",
      nowIndex: 0,
      canconfirm: true, //防止频繁确认
      cancancel: true, //防止频繁取消
      submitMSG: "",
      noworderid: "", //当前订单号（提交优梵
      dialogConfig: {
        dialogtitle: "提示",
        dialogmessage: "是否提交到优梵艺术？",
        type: 3 //1取消 2确定 3两个都有
      },
      cansubmit: true,
      showsearch: false,
      inputValue: "",
      searchValue: "",
      searchHistory: [],
      canConfirmDialog: true,
      //上传凭证的数据
      orderid: '',
      documentStatus: '',
      fileArr: '',
      headerImage: '',
      imgList:[],
      fileArr:[],
      aliyunHost:'',
      alyData : {
        policy: '',
        OSSAccessKeyId: '',  // 密钥
        success_action_status: "200",  // 状态
        signature: '',  // 签名
        key: '',
        callback: ''  // 回调
      },
      candelete: true,
      toDeleApi: false,
      cansubmit: true,
      uploadImageOn: false,
      show: false
    };
  },
  beforeRouteUpdate(to,from,next){
    console.log("from:"+from.path)
    if(from.path=="/mine/myorder/orderdetail"){
      this.loadlist();
    }
    next()
  },
  created() {
    this.$vux.loading.show({
      text: "正在加载"
    });
    this.loadlist();
    window.eventHub.$on("dialogquit", this.dialogquit);
    window.eventHub.$on("dialogconfirm", this.dialogconfirm);
    this.bus.$emit("showsearch", true);
  },
  mounted() {
    this.resetBetterScroll();
    let _this = this;
    this.bus.$on("showsearch", e => {
      this.showsearch = e;
      if (e == true) {
        if (this.showsearch) {
          if (this.$storage.getItem("searchOrderHistory") === null) {
            this.searchHistory = [];
          } else {
            this.searchHistory = JSON.parse(
              this.$storage.getItem("searchOrderHistory")
            );
          }
        }
        // this.resetBetterScroll();
      }else{
        // this.resetBetterScroll();
      }
    });
  },
  computed: {
    ...mapGetters(["sid", "usercode"])
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
    }
  },
  methods: {
    cancelsearch() {
      this.bus.$emit("showsearch", true);
      this.showsearch = false;
    },
    //跳转订单详情
    todetail(e) {
      console.log(e.currentTarget.dataset);
      let orderid = e.currentTarget.dataset.orderid;
      this.$router.push({
        name: "orderdetail",
        params: { sid: this.sid, orderid: orderid }
      });
    },
    submitToUvanart(e) {
      debugger;
      if (!this.cansubmit) {
        return;
      }
      this.dialogFlag = 'uvan';
      this.cansubmit = false;
      let index = e.target.dataset.index;

      this.noworderid = e.target.dataset.orderid;
      if (this.orderList[index].documentStatus != "确认") {
        this.$vux.toast.show({
          type: "warn",
          text: "该订单还没确认",
          width: "14em",
          position: "middle"
        });
        this.cansubmit = true;
        return;
      }
      this.dialogshow = true;
      this.submitMSG = "是否确认提交该订单？";
      let orderid = e.target.dataset.orderid;
    },
    //取消确认
    cancelConfirm(e) {
      if (!this.cancancel) {
        return;
      }
      this.cancancel = false;
      let orderid = e.target.dataset.orderid;
      let index = e.target.dataset.index;
      let url =
        "/order/cancelConfirm?__sid=" + this.sid + "&documentCode=" + orderid;
      this.$api.post(url, "", "application/x-www-form-urlencoded").then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$vux.toast.show({
            type: "success",
            text: "已取消",
            width: "14em",
            position: "middle"
          });
          this.cancancel = true;
          this.orderList[index].documentStatus = "创建";
        } else if (res.code == 901) {
          this.cancancel = true;
          console.log("订单不是确认状态，不能取消确认");
        } else if (res.code == 900) {
          this.$vux.toast.show({
            type: "warn",
            text: "订单不存在",
            width: "14em",
            position: "middle"
          });
          this.cancancel = true;
        }
      });
    },
    confirm(e) {
      if (this.lastorderid != e.target.dataset.orderid) {
        this.textPS = "";
        this.nowClient = "";
        this.order1 = "";
        this.order2 = "";
        this.order3 = "";
      }
      this.attrOn = true;
      this.nowIndex = e.target.dataset.index;
      let type = e.target.dataset.type;
      let orderid = e.target.dataset.orderid;
      this.lastorderid = orderid;
      this.type = type;
    },
    selectClient(e) {
      this.nowClient = e.target.dataset.name;
    },
    //确认订单
    submitorder() {
      if (!this.canconfirm) {
        this.$vux.toast.show({
          type: "warn",
          text: "请勿频繁操作",
          width: "14em",
          position: "middle"
        });
        return;
      }
      this.canconfirm = false;
      let data;
      let url = "/order/confirm?__sid=" + this.sid;
      if (this.type == "平台原始订单" || this.type == "零售订单") {
        if (this.nowClient == "") {
          this.$vux.toast.show({
            type: "warn",
            text: "请选择客户来源",
            width: "14em",
            position: "middle"
          });
          this.canconfirm = true;
          return;
        }
        if (this.order1 == "") {
          this.$vux.toast.show({
            type: "warn",
            text: "请填写特权定金单号1",
            width: "14em",
            position: "middle"
          });
          this.canconfirm = true;
          return;
        }
        data = {
          userCode: this.usercode,
          documentCode: this.lastorderid,
          remarks: this.textPS,
          cusFrom: this.nowClient,
          privilege1: this.order1,
          privilege2: this.order2,
          privilege3: this.order3
        };
      } else {
        if (this.nowClient == "") {
          this.$vux.toast.show({
            type: "warn",
            text: "请选择客户来源",
            width: "14em",
            position: "middle"
          });
          this.canconfirm = true;
          return;
        }
        data = {
          userCode: this.usercode,
          documentCode: this.lastorderid,
          remarks: this.textPS,
          cusFrom: this.nowClient
        };
      }
      this.$api.post(url, data, "application/json").then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$vux.toast.show({
            type: "success",
            text: "确认成功",
            width: "14em",
            position: "middle"
          });
          this.orderList[this.nowIndex].documentStatus = "确认";
          this.canconfirm = true;
          this.attrOn = false;
        } else if (res.code == 900) {
          this.$vux.toast.show({
            type: "warn",
            text: "订单不存在",
            width: "14em",
            position: "middle"
          });
          this.attrOn = false;
          this.canconfirm = true;
        }else{
          this.$vux.toast.show({
            type: "warn",
            text: res.msg,
            width: "14em",
            position: "middle"
          });
          this.attrOn = false;
          this.canconfirm = true;
        }
      });
    },
    loadlist() {
      let data = {};
      debugger;
      let url =
        "/order/query?__sid=" +
        this.sid +
        "&userCode=" +
        this.usercode +
        "&pageNo=1&nameOrPhone";
      this.$api.post(url, data, "text/plain;charset=UTF-8").then(res => {
        console.log(res);
        if (res.code == 200) {
          this.orderList = res.data.list;
          this.pagesize = res.data.pageSize;
          this.ordercount = res.data.count;
          this.$vux.loading.hide()
        }else{
          this.$vux.loading.hide()
          this.$vux.toast.show({
            text: "请稍后再试",
            type: "text",
            width: "15em"
          });
        }
      });
    },
    parentListenShow(show) {
      this.dialogshow = show;
      console.log(this.dialogshow);
      if (this.dialogshow == "取消") {
        this.dialogshow = false;
        return;
      } else {
        // let data = {}
        let url =
          "/order/submit?__sid=" +
          this.sid +
          "&documentCode=" +
          this.noworderid +
          "&userCode=" +
          this.usercode;
        this.$api.post(url, "", "text/plain;charset=UTF-8").then(res => {
          console.log(res);
          this.dialogshow = false;
          if (res.code == 200) {
            this.$vux.toast.show({
              type: "success",
              text: "提交成功",
              width: "14em",
              position: "middle"
            });
          } else if (res.code == 900) {
            this.$vux.toast.show({
              type: "warn",
              text: res.msg,
              width: "20em",
              position: "middle"
            });
          }
        });
      }
    },
    //点击输入框（获取焦点）的时候跳转到搜索页面
    onFocusSearch() {
      // this.showSearch = true;
    },
    onSubmitSearch() {
      var input = document.getElementById("input");
      input.blur();
      this.searchValue = this.trim(this.inputValue);
      if (this.searchValue == "") {
        return;
      }
      this.orderList = [];
      this.page = 1;
      let data = {};
      let url =
        "/order/query?__sid=" +
        this.sid +
        "&userCode=" +
        this.usercode +
        "&pageNo=" +
        this.page +
        "&nameOrPhone=" +
        this.searchValue;
      this.$api.post(url, data, "text/plain;charset=UTF-8").then(res => {
        console.log(res);
        if (res.code == 200) {
          this.bus.$emit("showsearch", true);
          this.showsearch = false;
          if (this.$storage.getItem("searchOrderHistory") === null) {
            this.$storage.setItem(
              "searchOrderHistory",
              "[" + JSON.stringify(this.searchValue) + "]"
            );
          } else {
            let history = JSON.parse(
              this.$storage.getItem("searchOrderHistory")
            );
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
            this.$storage.searchOrderHistory = JSON.stringify(history);
          }
          this.orderList = this.orderList.concat(res.data.list);
          this.pagesize = res.data.pageSize;
          this.ordercount = res.data.count;
          // this.$nextTick(()=>{
          //   setTimeout(()=>{
          //     this.pullingDownUp();
          //   },500)
          // })
          this.resetBetterScroll();
        } else {
          this.$vux.toast.show({
            type: "warn",
            text: "订单不存在",
            width: "14em",
            position: "middle"
          });
          console.log("没有查询到符合条件的订单");
        }
      });
    },
    deleteSearchHistory() {
      this.$storage.searchOrderHistory = "[]";
      this.searchHistory = [];
    },
    selectSearchHistory() {
      this.searchValue = event.target.dataset.searchvalue;
      this.inputValue = event.target.dataset.searchvalue;
      this.onSubmitSearch();
    },
    pullingDownUp() {
      this.myorderpagewrapper.finishPullUp(); //告诉 better-scroll 数据已加载
      this.myorderpagewrapper.refresh(); //重新计算元素高度
    },
    // 初始化自定义的better-scroll
    initScroll() {
      this.myorderpagewrapper = new BScroll(
        this.$refs.myorderpagewrapper,
        this.options
      );
      this.myorderpagewrapper.on("pullingUp", () => {
        this.page += 1;
        if (this.page * this.pagesize - this.ordercount >= 20) {
          this.$vux.toast.show({
            type: "success",
            text: "没有更多了",
            width: "10em",
            position: "middle"
          });
          return;
        }
        let data = {};
        let url = "";
        if (this.searchValue != "") {
          url =
            "/order/query?__sid=" +
            this.sid +
            "&userCode=" +
            this.usercode +
            "&pageNo=" +
            this.page +
            "&nameOrPhone=" +
            this.searchValue;
        } else {
          url =
            "/order/query?__sid=" +
            this.sid +
            "&userCode=" +
            this.usercode +
            "&pageNo=" +
            this.page +
            "&nameOrPhone";
        }
        this.$api.post(url, data, "text/plain;charset=UTF-8").then(res => {
          console.log(res);
          if (res.code == 200) {
            this.orderList = this.orderList.concat(res.data.list);
            this.$nextTick(() => {
              setTimeout(() => {
                this.pullingDownUp();
              }, 500);
            });
          }
        });
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
    dialogquit() {
      this.cansubmit = true;
      this.dialogshow = false;
      // alert("取消");
    },
    dialogconfirm() {
      if(!this.canConfirmDialog){
        return
      }
      this.canConfirmDialog = false
      if(this.dialogFlag == 'uvan'){
        this.submitToUvan()
      }else{
        let index = 0
        this.addCart(index)
      }
    },
    buyAgain(e){
      // this.dialogFlag = 'bug';
      this.goodIndex = e.target.dataset.index
      // this.dialogshow = true
      // this.dialogConfig = {
      //   dialogtitle: "提示",
      //   dialogmessage: "是否再次添加到购物车？",
      //   type: 3 //1取消 2确定 3两个都有
      // }
      let _this = this
      console.log(this.$vux)
      this.$vux.confirm.show({
        title: "提示",
        content: "是否再次添加到购物车？",
        onCancel () {
          _this.$vux.confirm.hide()
        },
        onConfirm () {
          let index = 0
          _this.addCart(index)
        }
      })
    },
    onCancel(){

    },
    onConfirm(){

    },
    //加入购物车
    addCart(i){
      if(i==0){
        this.$vux.loading.show({
          text: "正在复购"
        });
      }
      let index = this.goodIndex
      let url = `/a/order/amOrderShopping/addShopping?__sid=${this.sid}&numIid=${this.orderList[index].goods[i].numId}&skuId=${this.orderList[index].goods[i].skuId}&count=${this.orderList[index].goods[i].quantity}&flag=0`
      this.$api.get(url)
      .then(res=>{
        if(res.code==200){
          if(i==this.orderList[index].goods.length-1){
            this.$vux.loading.hide();
            this.$vux.toast.show({
              type: "success",
              text: "已加入购物车",
              width: "12em",
              position: "middle"
            });
            this.canConfirmDialog = true
            this.$router.push({name:'shoppingCart'});
            return
          }
          i++
          this.addCart(i)
        }else{
          this.$vux.loading.hide();
          this.$vux.toast.show({
            type: "warn",
            text: "请稍后再试",//服务异常
            width: "12em",
            position: "middle"
          });
          this.canConfirmDialog = true
        }
      })
    },
    //提交优梵
    submitToUvan(){
      this.$vux.loading.show({
        text: "正在提交..."
      });
      let url =
        "/order/submit?__sid=" +
        this.sid +
        "&documentCode=" +
        this.noworderid +
        "&userCode=" +
        this.usercode;
      this.$api.post(url, "", "text/plain;charset=UTF-8").then(res => {
        console.log(res);
        this.dialogshow = false;
        if (res.code == 200) {
          this.$vux.toast.show({
            type: "success",
            text: "提交成功",
            width: "14em",
            position: "middle"
          });
          this.orderList[this.nowIndex].documentStatus = "提交";
          this.canConfirmDialog = true
        } else if (res.code == 900) {
          this.$vux.toast.show({
            type: "warn",
            text: res.msg,
            width: "20em",
            position: "middle"
          });
          this.canConfirmDialog = true
        } else if (res.code == 408) {
          this.$vux.loading.hide();
          this.cansubmit = true;
          this.$vux.toast.text("网络超时", 2000, "middle");
          var _this = this;
          setTimeout(function() {
            _this.$router.go(0); //强制刷新很影响交互，这里是因为不强制刷新会造成数据不一致的情况
          }, 2000);
        }
        this.$vux.loading.hide();
        this.cansubmit = true;
        this.canConfirmDialog = true
      });
      // alert("确认");
    },
    //去前后空格
    trim(s) {
      return s.replace(/(^\s*)|(\s*$)/g, "");
    },
    //上传凭证相关
  closeUploadImage(){
    this.uploadImageOn = false
  },
  //打开上传凭证的窗口
  showUploadImage(e){
    this.imgList = []
    this.orderid = e.target.dataset.orderid
    this.documentStatus = e.target.dataset.documentstatus
    this.uploadImageOn = true
    this.$vux.loading.show({
      text:"加载中"
    })
    
    console.log(e)
    // this.imgList = JSON.parse(window.localStorage.getItem('imgList')) || []
    this.getPic()
  },
  //获取已上传的凭证
  getPic(){
    let url = `/order/getCredentials?__sid=${this.sid}&documentCode=${this.orderid}`
    this.$api.get(url)
    .then(res=>{
      if(res.code==200){
        this.imgList = res.data
        // window.localStorage.setItem('imgList',JSON.stringify(this.imgList))
        this.$nextTick(() => {
          setTimeout(() => {
            this.$previewRefresh()
          }, 500);
        });
        this.$vux.loading.hide()
      }else{
        this.$vux.loading.hide()
        this.$vux.toast.show({
          text: "请稍后再试",
          type: "text",
          width: "15em"
        });
      }
    })
  },
  upload (e) {
      var _this = this;
      var files = e.target.files || e.dataTransfer.files;
      var a=false;
      for(var i= 0;i<files.length;i++){
        if(files[i].type.indexOf("image") == -1){a=true}
      }
      if(a){
        this.$vux.toast.show({
          text: "请选择图片文件",
          type: "text",
          width: "15em"
        });
        return;
      }
      var l =files.length;
      if (!l) return;
      if(this.imgList.length+l>6){
        this.$vux.toast.show({
          text: "图片最多上传六张",
          type: "text",
          width: "15em"
        });
        return
      }
      this.$vux.loading.show({
          text:"正在上传"
        })
      // var f = length => Array.from({length}).map((v,k) => k);
      // var arr = f(l);
      // var i =arr.map((item)=>{
      //   _this.imgPreview(files[item],files.length-1,item);
      //   return i
      // })
      _this.fileArr = files;
      _this.imgPreview(files[0],files.length-1,0);
    },
    imgPreview (file,h,i) {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function(){
        Orientation = Exif.getTag(this, 'Orientation');
      });
      // 看支持不支持FileReader  
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result;
          let img = new Image();
          img.src = result;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= (100 * 1024) || file.type =="image/gif") {
            self.headerImage = this.result;
            self.postImg(file,h,i);
          }else {
            img.onload = function () {
              let data = self.compress(img,Orientation);
              self.headerImage = data;
              self.postImg(file,h,i);
            }
          }
        }
      }
    },
    //上传图片
    postImg (file,h,i) {
      var _this = this;
      //这里写接口
      this.$api.get("/a/aliyunimage/amAliyunImage/getPolicy",{})
      .then(res=>{
        _this.aliyunHost= res.data.host;
        _this.alyData.policy = res.data.policy;
        _this.alyData.OSSAccessKeyId = res.data.accessId;
        _this.alyData.signature = res.data.signature;
        _this.alyData.key = res.data.dir;
        _this.alyData.callback = res.data.callBack;

        //文件上传加上时间戳，防止阿里服务器上的文件被覆盖
        var dataDay = new Date(),
            dnum = dataDay.getFullYear().toString() + dataDay.getMonth().toString() + dataDay.getDate().toString() + dataDay.getMinutes().toString() + dataDay.getMilliseconds().toString() + dataDay.getSeconds().toString();
        var file2=dataURLtoBlob(_this.headerImage)
        var formData = new FormData;
        formData.append('OSSAccessKeyId', _this.alyData.OSSAccessKeyId)
        formData.append('policy', _this.alyData.policy)
        formData.append('signature', _this.alyData.signature)
        formData.append('key', _this.alyData.key + dnum +file.name)
        formData.append('success_action_status', _this.alyData.success_action_status)
        formData.append('callback', _this.alyData.callback)
        formData.append('file', file2)

        _this.$api.post(_this.aliyunHost,formData,"multipart/form-data")
        .then(res=>{
          if (res.code === 200) {
            console.log("*****************************")
            var str = _this.aliyunHost+res.data
            let imgList = {
              "imgStatus": "0",
              "imgUrl": str,
              "imgCode":''
            }
            _this.imgList.push(imgList);
            _this.$nextTick(() => {
              setTimeout(() => {
                _this.$previewRefresh()
              }, 500);
            });
            if(h==i){_this.$vux.loading.hide()}
            // _this.$vux.loading.hide()
            // window.localStorage.setItem('imgList',JSON.stringify(_this.imgList))
            console.log(JSON.stringify(_this.imgList))
            console.log(i);
            console.log(i+1)
            console.log(_this.fileArr)
            console.log(_this.fileArr[i+1])
            if(_this.fileArr[i+1]){_this.imgPreview(_this.fileArr[i+1],_this.fileArr.length-1,i+1)};
          }else{ 
            if(_this.fileArr[i+1]){_this.imgPreview(_this.fileArr[i+1],_this.fileArr.length-1,i+1)};
            return false
          }
        }).catch(res=>{
          if(res.code){
            _this.showCodeMes(_this,res.code,res.data);
            if(_this.fileArr[i+1]){_this.imgPreview(_this.fileArr[i+1],_this.fileArr.length-1,i+1)};
              return false
          }
        })
      })
    },
    //压缩图片
    compress(img,Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
        //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素")
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if(Orientation != "" && Orientation != 1){
        debugger
        switch(Orientation){
          case 6://需要顺时针（向左）90度旋转
              this.rotateImg(img,'left',canvas);
              break;
          case 8://需要逆时针（向右）90度旋转
              this.rotateImg(img,'right',canvas);
              break;
          case 3://需要180度旋转
              this.rotateImg(img,'right',canvas);//转两次
              this.rotateImg(img,'right',canvas);
              break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    rotateImg (img, direction,canvas) {
        //最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0;
        const max_step = 3;
        if (img == null)return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = img.height;
        let width = img.width;
        let step = 2;
        if (step == null) {
            step = min_step;
        }
        if (direction == 'right') {
            step++;
            //旋转到原位置，即超过最大值
            step > max_step && (step = min_step);
        } else {
            step--;
            step < min_step && (step = max_step);
        }
        //旋转角度以弧度值为参数
        let degree = step * 90 * Math.PI / 180;
        let ctx = canvas.getContext('2d');
        switch (step) {
          case 0:
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0);
              break;
          case 1:
              canvas.width = height;
              canvas.height = width;
              ctx.rotate(degree);
              ctx.drawImage(img, 0, -height);
              break;
          case 2:
              canvas.width = width;
              canvas.height = height;
              ctx.rotate(degree);
              ctx.drawImage(img, -width, -height);
              break;
          case 3:
              canvas.width = height;
              canvas.height = width;
              ctx.rotate(degree);
              ctx.drawImage(img, -width, 0);
              break;
        }
    },
    //删除图片
    deletUploadPic(e,index){
      if(this.candelete){
        this.candelete = false
        console.log(e)
        let imgCode = e.target.dataset.imgcode
        if(imgCode!=""){
          this.toDeleApi = true
          this.$vux.loading.show({
            text:"正在删除"
          })
          this.imgList[index].imgCode = imgCode
          this.imgList[index].imgStatus = "1"
          this.submit(index)
          return
        }else{
          this.imgList.splice(index,1);
        //   if(this.imgList.length==0){
        //     window.localStorage.removeItem('imgList')
        //   }else{
        //     window.localStorage.setItem('imgList',JSON.stringify(this.imgList))
        //   }
          setTimeout(()=>{
            this.candelete = true
          },500)
        }
      }
      
    },
    //提交凭证(包括删除，删除已上传到后的凭证需要传imgCode和更变imgStatus为1)
    submit(index){
      if(this.documentStatus!='创建'){
        this.$vux.toast.show({
          text: "订单确认后无法再上传",
          type: "text",
          width: "20em"
        });
        return
      }
      if(this.imgList.length==0){
        this.$vux.toast.show({
          text: "请上传凭证",
          type: "text",
          width: "15em"
        });
        return
      }
      if(!this.cansubmit){
        return
      }
      this.cansubmit = false
      if(!this.toDeleApi){
        this.$vux.loading.show({
          text:"正在提交"
        })
      }
      let data
      let imgList = []
      if(index===''){
        debugger
        for(let i = 0;i<this.imgList.length;i++){
          if(this.imgList[i].imgCode==''){
            imgList.push(this.imgList[i])
          }
        }
        if(imgList.length==0){
          this.$vux.loading.hide()
          this.$vux.toast.show({
            text: "凭证已存在",
            type: "text",
            width: "15em"
          });
          this.cansubmit = true
          return
        }
        data = {
          "documentCode": this.orderid,
          "imgList": imgList
        }
      }else{
        data = {
          "documentCode": this.orderid,
          "imgList": `[${JSON.stringify(this.imgList[index])}]`
        }
      }
      let url = `/order/uploadCredentials?__sid=${this.sid}`
      this.$api.post(url,data,'application/json')
      .then(res=>{
        if(res.code == 200){
          if(index!=""){
            this.imgList.splice(index,1);
          }
          // if(this.imgList.length==0){
          //   window.localStorage.removeItem('imgList')
          // }else{
          //   window.localStorage.setItem('imgList',JSON.stringify(this.imgList))
          // }
          this.getPic()
          this.$vux.loading.hide()
          if(!this.toDeleApi){
            this.$vux.toast.show({
              text: "上传成功",
              type: "success",
              width: "15em"
            });
            this.uploadImageOn = false
          }
          
          this.candelete = true
          this.toDeleApi = false
          this.cansubmit = true
          
        }else{
          this.candelete = true
          this.toDeleApi = false
          this.cansubmit = true
          this.$vux.loading.hide()
          this.$vux.toast.show({
            text: "请稍后再试",
            type: "text",
            width: "15em"
          });
        }
      })
    },
  },

  beforeDestroy: function() {
    window.eventHub.$off("dialogquit");
    window.eventHub.$off("dialogconfirm");
  },
  
};
</script>

<style scoped lang="less" >
@import "~common/css/defult.less";
@import "./myorder.less";
</style>