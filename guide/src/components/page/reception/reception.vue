<template>
  <div class="reception" :style="{height: fullHeight-53+'px'}" ref="reception">
    <div class="recWrapper">
      <form @submit.prevent="submit">
        <div class="customerInfo">
          <div class="title" :class="[errorState1?'changeColor':'']">客户简称</div>
          <input placeholder="请填写客户简称" name='customerInfo' v-model="customerInfo" :disabled="receptionStatus==1" />
        </div>
        <div class="customerSex">
          <div class="madam" :class="{'addBorder':sexNum==2,'changeBorderColor':errorState4}" @click="chooseSex(2)">
            <div class="icon">
              <img :src="sexNum==2?'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/396a9375b40d4f2588891388406e000c':'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/54da6532d5354dbe85ce72651dc47b2d'" />
            </div>
            <div class="text" :class="[sexNum==2?'wordColor':'']">女士</div>
          </div>
          <div class="man" :class="{'addBorder':sexNum==1,'changeBorderColor':errorState4}" @click="chooseSex(1)">
            <div class="icon">
              <img :src="sexNum==1?'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/90c9627fc1df448b94b58901a4d12051':'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/afa8f5b69f9748b384659fc53a4d6fb7'" />
            </div>
            <div class="text" :class="[sexNum==1?'wordColor':'']">先生</div>
          </div>
        </div>
        <div class="customerInfo phone">
          <div class="title" :class="[errorState?'changeColor':'']">移动电话</div>
          <input placeholder="请填写移动电话" name='phone' type="number" maxlength="11" oninput="if(value.length>11)value=value.slice(0,11)" v-model="phoneNumber" :disabled="receptionStatus==1" />
        </div>
        <div class="customerSource" @click="show">
          <div class="left" :class="[errorState2?'changeColor':'']">客户来源</div>
          <div class="right">
            <span>{{customerPathId !=-1?list[customerPathId]:'请选择'}}</span>
            <span class="icon-jiantou iconfont"></span>
          </div>
        </div>
        <div class="purchaseDemand">
          <div class="title">购买需求</div>
          <textarea placeholder="请填写大致购买需求" name='purchaseDemand' v-model="purchaseDemand" :disabled="receptionStatus==1"></textarea>
        </div>
        <div class="ensure">
          <button type="submit" v-if="receptionStatus !=1" :disabled="isEnsure">确认</button>
          <div class="hadEnsure" v-if="receptionStatus ==1">已确认</div>
        </div>
      </form>
    </div>
    <div :class="[showBounced?'bounced':'dowmbounced']">
      <div class="Bheader">
        <span>选择客户来源</span>
      </div>
      <div class="cList" v-for="(item,index) in list" :key="index" @click="choosePath(index)" :class="{'bgColor':index==customerPathId}">
        <div class="listWrapper" :class="{'noBorderBottom':index==list.length-1}">
          <div class="left">{{item}}</div>
          <div class="right">
            <span class="iconfont" :class="[index==customerPathId?'icon-gouxuan':'icon-yuanquanweixuanfuben']"></span>
          </div>
        </div>
      </div>
      <div class="colse icon-chuyidong1-copy iconfont" @click="closeBounced" v-show="showBounced"></div>
    </div>
    <div class="shadow" v-show="showBounced" @click="closeBounced"></div>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { isPhone } from "@/common/js/common.js";
import { Toast, Confirm, ConfirmPlugin } from "vux";
import { setTimeout } from "timers";
import BScroll from "better-scroll";
import Vue from "vue";
Vue.use(ConfirmPlugin);
export default {
  nane: "reception",
  data() {
    return {
      options: {
        pullDownRefresh: {
          threshold: 0, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 0 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        closePullDown: {
          threshold: 0, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 0 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        click: true,
        probeType: 3,
        startY: 0,
        bounce: {
          top: false,
          bottom: false,
          left: false,
          right: false
        },
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV|SPAN)$/
        }
      },
      fullHeight: document.documentElement.clientHeight,
      list: ["线上", "线下", "地推", "老客户", "样品"],
      customerPathId: -1,
      showBounced: false,
      sexNum: -1,
      customerInfo: "", //客户信息
      phoneNumber: "", //手机号码
      purchaseDemand: "", //购买需求
      receptionCode: "", //接待id
      errorState: "",
      errorState1: "",
      errorState2: "",
      errorState3: "",
      errorState4: "",
      receptionStatus: "", //接待状态
      isUpdate: false, //是否执行更新操作
      remarks: "",
      buyingStatus: "",
      isEnsure: false //是否点击确认
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  beforeRouteLeave(to, from, next) {
    if (
      (this.customerInfo ||
        this.sexNum != -1 ||
        this.phoneNumber ||
        this.purchaseDemand ||
        this.customerPathId != -1) &&
      this.receptionStatus != 1
    ) {
      this.$vux.confirm.show({
        content: "正在编辑的信息将不保存，是否离开？",
        onCancel() {
          console.log("用户点击取消");
        },
        onConfirm() {
          next();
        }
      });
    } else {
      next();
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log("测试", JSON.stringify(to.params));
    console.log(to.params.mark);
    if (JSON.stringify(to.params) != "{}" && to.params.mark == 2) {
      this.customerInfo = to.params.list.customer;
      this.sexNum = to.params.list.gender;
      this.phoneNumber = to.params.list.phonenum;
      this.customerPathId = to.params.list.customerType;
      this.purchaseDemand = to.params.list.demands;
      this.receptionCode = to.params.list.receptionCode;
      this.receptionStatus = to.params.list.receptionStatus;
      this.buyingStatus = to.params.list.buyingStatus;
      this.remarks = to.params.list.remarks;
      this.isUpdate = true;
      if (!to.params.list.demands) {
        this.purchaseDemand = "无";
      }
      next();
    } else {
      if (
        (this.customerInfo ||
          this.sexNum != -1 ||
          this.phoneNumber ||
          this.purchaseDemand ||
          this.customerPathId != -1) &&
        !this.receptionStatus
      ) {
        console.log("坎坎坷坷");
        console.log(this.receptionStatus);
        console.log(to);
        if (to.name == "historyList" || to.name == "reception") {
          if (to.params.mark == 1) {
            //如果是在历史接待页通过加号进入则清空新增数据
            this.customerInfo = "";
            this.sexNum = -1;
            this.phoneNumber = "";
            this.customerPathId = -1;
            this.purchaseDemand = "";
            this.receptionCode = "";
            this.isUpdate = false;
            this.receptionStatus = "";
          }
          next();
        }
      } else {
        this.customerInfo = "";
        this.sexNum = -1;
        this.phoneNumber = "";
        this.customerPathId = -1;
        this.purchaseDemand = "";
        this.receptionCode = "";
        this.isUpdate = false;
        this.receptionStatus = ""; //接待状态置空
        next();
      }
    }
  },
  watch: {
    phoneNumber() {
      // console.log(this.phoneNumber.length)
      if (this.phoneNumber.length >= 11) {
        //  console.log(isPhone(this.phoneNumber))
        if (!isPhone(this.phoneNumber)) {
          console.log(1);
          this.errorState = true;
          console.log(this.errorState);
        } else {
          this.errorState = false;
        }
      }
    },
    // 监听用户选择性别
    sexNum() {
      if (this.sexNum != -1) {
        this.errorState4 = false;
      }
    },
    customerInfo() {
      if (this.customerInfo != "") {
        this.errorState1 = false;
      }
    },
    customerPathId() {
      if (this.customerPathId != -1) {
        this.errorState2 = false;
      }
    },
    purchaseDemand() {
      if (this.purchaseDemand != "") {
        this.errorState3 = false;
      }
    }
  },
  computed: {
    ...mapGetters(["sid", "usercode", "phone"])
  },
  components: {
    Toast,
    Confirm
  },
  methods: {
    initScroll() {
      if (!this.reception) {
        this.reception = new BScroll(this.$refs.reception, this.options);
      }
    },
   
    // 用户性别选择
    chooseSex(id) {
      console.log(id);
      if (this.receptionStatus == 1) {
        return;
      }
      this.sexNum = id;
    },
    // 选择客户来源路径
    choosePath(index) {
      console.log(index);
      this.customerPathId = index;
      this.closeBounced();
    },
    // 展示客户来源弹框
    show() {
      console.log(1);
      if (this.receptionStatus == 1) {
        return;
      }
      this.showBounced = true;
    },

    // 关闭客户来源弹框
    closeBounced() {
      this.showBounced = false;
    },
    // 表单提交
    submit(event) {
      if (!this.customerInfo) {
        this.errorState1 = true;
      }
      if (this.customerPathId == -1) {
        this.errorState2 = true;
      }
      if (this.sexNum == -1) {
        this.errorState4 = true;
      }
      if (
        !this.customerInfo ||
        this.customerPathId == -1 ||
        this.sexNum == -1
      ) {
        this.$vux.toast.show({
          text: "请完善客户资料",
          type: "text",
          width: "10em"
        });
        return;
      }
      if (this.phoneNumber) {
        if (!isPhone(this.phoneNumber)) {
          this.errorState = true;
          this.$vux.toast.show({
            text: "请完善客户资料",
            type: "text",
            width: "10em"
          });
          return;
        }
      }
      console.log(`hahhh${this.isUpdate}`);
      this.isEnsure = true; //已经点击确认
      // 生成四位随机数
      if (!this.isUpdate) {
        let randomNum = "";
        for (let i = 0; i < 4; i++) {
          randomNum += Math.floor(Math.random() * 10);
        }
        // 生成时间戳
        let timestamp = Date.parse(new Date());
        this.receptionCode = randomNum + timestamp;
        console.log(this.receptionCode);
        let formData = {
          receptionCode: this.receptionCode,
          customer: this.customerInfo,
          gender: this.sexNum,
          phonenum: this.phoneNumber,
          customerType: this.customerPathId,
          demands: this.purchaseDemand,
          userCode: this.usercode
        };
        this.api(formData, 1);
      } else {
        let formData = {
          receptionCode: this.receptionCode,
          customer: this.customerInfo,
          gender: this.sexNum,
          phonenum: this.phoneNumber,
          customerType: this.customerPathId,
          demands: this.purchaseDemand,
          userCode: this.usercode,
          buyingStatus: this.buyingStatus,
          remarks: this.remarks
        };
        console.log(formData);
        this.api(formData, 2);
      }
    },

    api(formData, id) {
      let header = "text/plain;charset=UTF-8";
      if (id == 1) {
        var url = "/a/sale/saleReception/outer/createData?__sid=" + this.sid;
      } else if (id == 2) {
        var url = "/a/sale/saleReception/outer/editData?__sid=" + this.sid;
      }

      this.$api.post(url, formData, header).then(res => {
        console.log(res);
        if (res.code == 200 && res.msg == "请求成功") {
          this.$vux.toast.show({
            text: "提交成功",
            type: "text",
            width: "10em",
            time: 1300
          });
          setTimeout(() => {
            this.customerInfo = "";
            this.sexNum = -1;
            this.phoneNumber = "";
            this.customerPathId = -1;
            this.purchaseDemand = "";
            this.receptionCode = "";
            this.isUpdate = false;
            this.receptionStatus = ""; //接待状态置空
            this.isEnsure = false;
            this.$router.push({ name: "historyList" });
          }, 1000);
        } else {
          this.isEnsure = false;
          this.$vux.toast.show({
            text: res.msg,
            type: "text",
            width: "15em"
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
@import "~common/css/defult.less";
// icon B
.icon-nanshengnvshengicon-2,
.icon-nanshengnvshengicon-3 {
  color: #1c1c1c;
  font-size: 95 / @rem;
}
.icon-jiantou {
  color: #898989;
  font-size: 20 / @rem;
}
.icon-gouxuan {
  color: #f76e6e;
  font-size: 40 / @rem;
}
.icon-yuanquanweixuanfuben {
  color: #838383;
  font-size: 40 / @rem;
}
// icon E
.reception {
  width: 100%;
  margin-top: 100 / @rem;
  background-color: #fff;
  padding: 0 40 / @rem 100 / @rem;
  box-sizing: border-box;
  overflow: hidden;
}
.recWrapper {
  position: relative;
  padding-top: 45 / @rem;
  padding-bottom: 100 / @rem;
}
.customerInfo {
  padding-bottom: 20 / @rem;
  border-bottom: 1px solid #eee;
}
.customerInfo .title {
  color: #424242;
  font-size: 30 / @rem;
  margin-bottom: 22 / @rem;
}
.customerInfo input {
  color: #424242;
  font-size: 28 / @rem;
  width: 100%;
  height: 40 / @rem;
}

.customerSex {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 40 / @rem;
}
.customerSex .addBorder {
  border: 1px solid #a2a2a2 !important;
}
.customerSex .madam,
.customerSex .man {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 255 / @rem;
  border: 1px solid #eee;
}
.madam .icon,
.man .icon {
  width: 100 / @rem;
  height: 100 / @rem;
}
.madam .icon img,
.man .icon img {
  width: 100 / @rem;
  height: 100 / @rem;
}
.customerSex .man {
  margin-left: 20 / @rem;
}
.man .text,
.madam .text {
  color: #aaaaaa;
  font-size: 28 / @rem;
  margin-top: 20 / @rem;
}
.phone {
  margin-top: 80 / @rem;
}
.customerSource {
  color: #424242;
  font-size: 30 / @rem;
  height: 96 / @rem;
  line-height: 96 / @rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.customerSource .right {
  color: #aaaaaa;
  font-size: 28 / @rem;
}
.purchaseDemand .title {
  font-size: 30 / @rem;
  height: 108 / @rem;
  line-height: 108 / @rem;
}
.purchaseDemand textarea {
  color: #444;
  font-size: 27 / @rem;
  width: 100%;
  height: 300 / @rem;
  padding: 20 / @rem 10 / @rem;
  box-sizing: border-box;
  border: none;
  background-color: #f8f8f8;
}
.ensure {
  height: 85 / @rem;
  margin: 40 / @rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ensure button {
  font-size: 30 / @rem;
  color: #fff;
  width: 100%;
  height: 100%;
  background-color: #424242;
}
.ensure .hadEnsure {
  color: #666;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
}
::-webkit-input-placeholder {
  color: #aaaaaa;
}

// 弹框
.bounced {
  color: #424242;
  width: 100%;
  height: 800 / @rem;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  box-sizing: border-box;
  background-color: #fff;
  transition: bottom ease 0.4s;
}
.dowmbounced {
  color: #424242;
  width: 100%;
  height: 800 / @rem;
  position: fixed;
  left: 0;
  bottom: -800 / @rem;
  z-index: 10;
  box-sizing: border-box;
  background-color: #fff;
}
.Bheader {
  color: #424242;
  font-size: 34 / @rem;
  height: 125 / @rem;
  line-height: 125 / @rem;
  text-align: center;
  padding: 0 35 / @rem;
  box-sizing: border-box;
}
.cList {
  font-size: 28 / @rem;
  padding: 0 35 / @rem;
  box-sizing: border-box;
  .listWrapper {
    height: 110 / @rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ececec;
  }
}
.cList:hover {
  background-color: #f8f8f8;
}
.noBorderBottom {
  border-bottom: 0 !important;
}
.colse {
  position: absolute;
  right: 25 / @rem;
  top: -65 / @rem;
  color: #fff;
  padding: 10 / @rem 10 / @rem 0;
}
.shadow {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
}
// 错误
.changeColor {
  color: #eb1d21 !important;
}
.changeBorderColor {
  border: 1px solid #eb1d21 !important;
}
.wordColor {
  color: #222 !important;
}
// 禁止输入样式
// input:disabled,
// input[disabled] {
//   color: #444;
//   -webkit-text-fill-color: #444;
//   background-color: #fff;
// }
input[disabled],
input:disabled,
input.disabled {
  color: #888;
  -webkit-text-fill-color: #888;
  -webkit-opacity: 1;
  opacity: 1;
  background-color: #fff;
}

textarea[disabled],
textarea:disabled,
textarea.disabled {
  color: #888;
  -webkit-text-fill-color: #888;
  -webkit-opacity: 1;
  opacity: 1;
}
// input:disabled {
//   -webkit-text-fill-color: #000;
//   -webkit-opacity: 1;
//   color: #000;
//   background-color: #fff;
// }
// textarea:disabled,
// textarea[disabled] {
//   color: #444;
//   -webkit-text-fill-color: #444;
// }
</style>