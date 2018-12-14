<template>
  <div>
    <div class="accountpagewrapper" :style="{height: fullHeight-50+'px'}" ref="wrapper">
      <div class="wrapper">
        <div class="address">
          <div class="userName">
            <span :class="[errorState1?'changeColor':'']">客户姓名：</span>
            <input v-model="userName" placeholder="请填写" />
          </div>
          <div class="userPhone" :class="{'error':phoneError}">
            <span>移动电话：</span>
            <input v-model="userPhone" placeholder="请填写" type="number" maxlength="11" oninput="if(value.length>11)value=value.slice(0,11)" />
          </div>
          <div class="userAddress">
            <span :class="[errorState3?'changeColor':'']">收货区域：</span>
            <div class="addressControl">
              <!-- <group>
                              <x-address title="" placeholder="请选择地址" raw-value="true" v-model="value" :list="addressData" @on-shadow-change="onShadowChange"></x-address>
                          </group> -->
              <x-address class="xaddress" :placeholder="xaddressValue" title="" ref="address" raw-value :list="addressData" value-text-align="left" @on-hide="logHide"></x-address>
            </div>
          </div>
          <div class="detailedAddress">
            <span :class="[errorState4?'changeColor':'']">详细地址：</span>
            <textarea placeholder="请填写" v-model="detailedAddress"></textarea>
          </div>
        </div>
        <div class="border"></div>
        <div class="goods" v-for="(item,index) in goodsList" :key="index">
          <div class="goodItem">
            <div class="left">
              <img :src="item.pic" />
            </div>
            <div class="right">
              <div class="goodName">{{item.name}}</div>
              <div class="priceWrapper">
                <div class="price">￥ {{item.price}}</div>
                <div class="num">x{{item.count}}</div>
              </div>
              <div class="specification">已选规格：{{item.property}}</div>
            </div>
          </div>
        </div>
        <div class="border"></div>
        <div class="wayWrapper">
          <div class="item" @click="showbouncedway(0)">
            <div class="left" :class="[errorState5?'changeColor':'']">配送方式</div>
            <div class="right">
              <span>{{list1[distributionId]?list1[distributionId]:'请选择'}}</span>
              <span class="icon-jiantou iconfont"></span>
            </div>
          </div>
          <div class="item" @click="showbouncedway(1)">
            <div class="left" :class="[errorState6?'changeColor':'']">支付方式</div>
            <div class="right">
              <span>{{list2[payId]?list2[payId]:'请选择'}}</span>
              <span class="icon-jiantou iconfont"></span>
            </div>
          </div>
          <div class="note">
            <span>备注信息：</span>
            <input v-model="note" name="note" placeholder="请填写" />
          </div>
        </div>
        <div class="border"></div>
        <div class="orderDetail">
          <div class="item" @click="showPickerFun">
            <span>取价时间</span>
            <div class="right">
              <span>{{datePickerValue2[0]}}-{{datePickerValue2[1]}}-{{datePickerValue2[2]}} {{datePickerValue2[3]}}:{{datePickerValue2[4]}}:00</span>
              <span class="icon-jiantou iconfont"></span>
            </div>
          </div>
          <div class="item">
            <span>商品金额</span>
            <div class="right">
              <span>￥{{totalPrice}}</span>
            </div>
          </div>
          <div class="item yfPrice">
            <span>运费金额</span>
            <div class="right">
              <span>￥{{freight}}</span>
            </div>
          </div>
          <div class="item item2" @click="showbounYHMX">
            <!-- <div class="item item2" @click="showbouncedway(2)"> -->
            <span>优惠金额</span>
            <div class="right">
              <span>￥{{totalPreferential}}</span>
              <span class="icon-jiantou iconfont"></span>
            </div>
          </div>
          <div class="item" @click="showbouncedway(3)">
            <span>邮费补贴</span>
            <div class="right">
              <span>￥{{PostageDisscount}}</span>
              <span class="icon-jiantou iconfont"></span>
            </div>
          </div>
        </div>
        <div class="actualAmount">
          <div>
            <span>实际付款</span>
            <span class="price">￥{{actualPrice}}</span>
          </div>
        </div>
        <button class="btn" @click="submitOrder" :disabled="submission">
          <span>提交订单</span>
        </button>
      </div>
      <div :class="[showBounced?'bounced':'dowmbounced']">
        <div class="header">
          <div class="headerWrapper">
            <span>{{wayId==0?'配送方式':(wayId==1?'支付方式':(wayId==2?'优惠明细':'邮费补贴'))}}</span>
          </div>
        </div>
        <div class="distributionWay" v-show="wayId==0">
          <div class="bItem" v-for="(item,index) in list1" :key="index" @click="choosePsWay(index)">
            <div class="wrapper">
              <div class="left">{{item}}</div>
              <div class="right">
                <span class="quan" v-show="index!=distributionId"></span>
                <span class="icon-gouxuan iconfont" v-show="index==distributionId"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="payWay" v-show="wayId==1">
          <div class="bItem" v-for="(item,index) in list2" :key="index" @click="choosePayWay(index)">
            <div class="wrapper">
              <div class="left">{{item}}</div>
              <div class="right">
                <span class="quan" v-show="index!=payId"></span>
                <span class="icon-gouxuan iconfont" v-show="index==payId"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="payWay" v-show="wayId==3">
          <div class="bItem" v-for="(item,index) in list3" :key="index" @click="chooseOilWay(index)">
            <div class="wrapper">
              <div class="left">{{item}}</div>
              <div class="right">
                <span class="quan" v-show="index!=oilId"></span>
                <span class="icon-gouxuan iconfont" v-show="index==oilId"></span>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="preferential" v-show="wayId==2">
          <div class="listWrapper" :style="{height: listHeight+'px'}" v-show="!withoutPrivileges" ref="list">
            <div>
              <div class="item" v-for="(item,index) in preferentialList" :key="index">
                <div class="left">{{item.offerName}}</div>
                <div class="right">￥{{item.offerAmount|priceFilter}}</div>
              </div>
            </div>
          </div>
          <div class="withoutPrivileges" v-show="withoutPrivileges">{{tips}}</div>
          <div class="order" :class="{'borderTop':withoutPrivileges}">
            <div class="left">其它优惠(元)</div>
            <div class="right"><input v-model="preferentialPrice" type="number" placeholder="请输入优惠金额" /></div>
          </div>
        </div>
        <div class="ensure" v-show="wayId==2&&preferentialPrice" @click="ensure">确定</div> -->
        <div class="colse icon-chuyidong1-copy iconfont" v-show="showBounced" @click="closeBounced"></div>
      </div>
      <div :class="[showBouncedYHMX?'bouncedYHMX':'dowmbouncedYHMX']">
        <div class="header">
          <div class="headerWrapper">
            <span>优惠明细</span>
          </div>
        </div>
        <div class="preferential">
          <div class="listWrapper" v-show="!withoutPrivileges" ref="list">
            <div>
              <div class="item" v-for="(item,index) in preferentialList" :key="index">
                <div class="left">{{item.offerName}}</div>
                <div class="right">￥{{item.offerAmount|priceFilter}}</div>
              </div>
              <div class="order">
                <div class="left">其它优惠(元)</div>
                <div class="right"><input v-model="preferentialPrice" oninput="value=value.replace(/[^\d\.]/g,'')" type="number" placeholder="请输入优惠金额" /></div>
              </div>
              <div class="ensure2" v-show="!withoutPrivileges" @click="ensure">确定</div>
            </div>
          </div>
          <div class="withoutPrivileges" v-show="withoutPrivileges">{{tips}}</div>
          <div class="order borderTop">
            <div class="left">其它优惠(元)</div>
            <div class="right"><input v-model="preferentialPrice" oninput="value=value.replace(/[^\d\.]/g,'')" type="number" placeholder="请输入优惠金额" /></div>
          </div>
        </div>
        <div class="ensure" v-show="withoutPrivileges" @click="ensure">确定</div>
        <div class="colse icon-chuyidong1-copy iconfont" v-show="showBouncedYHMX" @click="closeBounced"></div>
      </div>
      <div class="shadow" v-show="showBounced||showpicker||showBouncedYHMX" @click="closeBounced"></div>
    </div>
    <div :class="['date-picker-win',showpicker?'date-picker-win-show':'']">
      <div class="picker-header">
        <div class="picker-cancel" @click="pickerCancel">取消</div>
        <div class="picker-confirm" @click="pickerConfirm">确认</div>
      </div>
      <picker class="picker" :data='datePicker' v-model='datePickerValue' @on-change='pickerChange'></picker>
    </div>
  </div>
</template>

<script>
import {
  Group,
  XAddress,
  ChinaAddressV4Data,
  Toast,
  Confirm,
  ConfirmPlugin,
  Loading,
  Picker
} from "vux";
import BScroll from "better-scroll";
import { mapGetters } from "vuex";
var header = "text/plain;charset=UTF-8";
var nowdate = new Date();
export default {
  name: "account",
  data() {
    return {
      fullHeight: document.documentElement.clientHeight,
      addressData: ChinaAddressV4Data,
      options: {
        closePullDown: true,
        click: true,
        probeType: 3,
        startY: 0,
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV|SPAN)$/
        }
      },
      totalPrice: 0, //商品总金额
      totalPriceBF: 0, //商品总金额备份
      fstotalPrice: 0, //优梵艺术旗舰店总商品价格（不算饰品即优梵艺术家具旗舰店的商品价格）
      freight: 0, //运费
      preferentialPrice: "", //输入的优惠金额
      preferentialPriceBF: "", //备份用户输入的优惠金额
      hadEnsure: false, //是否确认输入优惠金额
      computePreferentialPrice: 0, //计算的优惠金额
      totalPreferential: 0, //总优惠金额
      actualPrice: 0, //实际付款金额
      goodsList: [], //商品数组
      goodsListBF: [], //备份商品数组
      preferentialList: [], //优惠列表
      preferentialListBF: [], //优惠列表备份用于传参
      // preferentialList: [
      //   {
      //     offerName: "是是是阿萨斯所所所所所所",
      //     offerAmount:1600.467464466469486
      //   }
      // ],
      submission: false, //是否提交中
      //优惠数组
      goods: [], //用于提交订单参数
      userName: "", //用户名
      userPhone: "", //用户手机
      note: "", //备注信息
      list1: ["送货上门并安装", "物流点自提", "门店自提"],
      list2: ["导购宝", "银联", "支付宝", "现金"],
      list3: ["不享受", "享受"],
      showBounced: false, //默认不展示弹框
      showBouncedYHMX: false, //默认不展示优惠明细框
      wayId: "", //用户判断用户点击配送方式、支付方式和优惠券
      distributionId: -1, //配送方式子ID
      payId: -1, //支付方式子ID
      oilId: 0, //是否邮费补贴
      province: "", //省份
      city: "", //市区
      region: "", //地区
      detailedAddress: "", //详细地址
      phoneError: false,
      UncheckedGoodsList: [], //未选中的购物车商品（用于替换缓存中的carts）
      withoutPrivileges: false, // 所选商品暂无优惠
      errorState1: false,
      errorState2: false,
      errorState3: false,
      errorState4: false,
      errorState5: false,
      errorState6: false,
      tips: "所选商品暂无优惠",
      listHeight: "",
      xaddressValue: "请选择地址",
      showpicker: false,
      years: [],
      months: [],
      days: [],
      hours: [],
      mins: [],
      datePicker: [this.years, this.months, this.days, this.hours, this.mins],
      datePickerValue: [
        nowdate.getFullYear() + "年",
        nowdate.getMonth() + 1 < 10
          ? "0" + (nowdate.getMonth() + 1) + "月"
          : nowdate.getMonth() + 1 + "月",
        nowdate.getDate() < 10
          ? "0" + nowdate.getDate() + "日"
          : nowdate.getDate() + "日",
        nowdate.getHours() < 10
          ? "0" + nowdate.getHours() + "时"
          : nowdate.getHours() + "时",
        nowdate.getMinutes() < 10
          ? "0" + nowdate.getMinutes() + "分"
          : nowdate.getMinutes() + "分"
      ],
      datePickerValue2: [
        nowdate.getFullYear(),
        nowdate.getMonth() + 1 < 10
          ? "0" + (nowdate.getMonth() + 1)
          : nowdate.getMonth() + 1,
        nowdate.getDate() < 10 ? "0" + nowdate.getDate() : nowdate.getDate(),
        nowdate.getHours() < 10 ? "0" + nowdate.getHours() : nowdate.getHours(),
        nowdate.getMinutes() < 10
          ? "0" + nowdate.getMinutes()
          : nowdate.getMinutes()
      ],
      timedata: "",
      skuList: [], //商品sku
      isPostageDisscount: "", //是否邮费补贴
      PostageDisscount: 0 //邮费补贴值
    };
  },
  components: {
    XAddress,
    Group,
    Toast,
    Confirm,
    Picker
  },
  created() {
    //初始化时间选择器
    for (
      let i = nowdate.getFullYear() - 1;
      i <= nowdate.getFullYear() + 1;
      i++
    ) {
      this.years.push(i + "年");
    }
    //月
    for (let i = 1; i < 13; i++) {
      if (i < 10) {
        this.months.push("0" + i + "月");
      } else {
        this.months.push(i + "月");
      }
    }
    //日
    if (
      (nowdate.getFullYear() % 4 == 0 && nowdate.getFullYear() % 100 != 0) ||
      nowdate.getFullYear() % 400 == 0
    ) {
      if (nowdate.getMonth() + 1 == 2) {
        for (let i = 1; i <= 29; i++) {
          if (i < 10) {
            this.days.push("0" + i + "日");
          } else {
            this.days.push(i + "日");
          }
        }
      }
      if (
        nowdate.getMonth() + 1 == 1 ||
        nowdate.getMonth() + 1 == 3 ||
        nowdate.getMonth() + 1 == 5 ||
        nowdate.getMonth() + 1 == 7 ||
        nowdate.getMonth() + 1 == 8 ||
        nowdate.getMonth() + 1 == 10 ||
        nowdate.getMonth() + 1 == 12
      ) {
        //大月
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            this.days.push("0" + i + "日");
          } else {
            this.days.push(i + "日");
          }
        }
      }
      if (
        nowdate.getMonth() + 1 == 4 ||
        nowdate.getMonth() + 1 == 6 ||
        nowdate.getMonth() + 1 == 9 ||
        nowdate.getMonth() + 1 == 11
      ) {
        //小月
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            this.days.push("0" + i + "日");
          } else {
            this.days.push(i + "日");
          }
        }
      }
    } else {
      if (nowdate.getMonth() + 1 == 2) {
        for (let i = 1; i <= 28; i++) {
          if (i < 10) {
            this.days.push("0" + i + "日");
          } else {
            this.days.push(i + "日");
          }
        }
      }
      if (
        nowdate.getMonth() + 1 == 1 ||
        nowdate.getMonth() + 1 == 3 ||
        nowdate.getMonth() + 1 == 5 ||
        nowdate.getMonth() + 1 == 7 ||
        nowdate.getMonth() + 1 == 8 ||
        nowdate.getMonth() + 1 == 10 ||
        nowdate.getMonth() + 1 == 12
      ) {
        //大月
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            this.days.push("0" + i + "日");
          } else {
            this.days.push(i + "日");
          }
        }
      }
      if (
        nowdate.getMonth() + 1 == 4 ||
        nowdate.getMonth() + 1 == 6 ||
        nowdate.getMonth() + 1 == 9 ||
        nowdate.getMonth() + 1 == 11
      ) {
        //小月
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            this.days.push("0" + i + "日");
          } else {
            this.days.push(i + "日");
          }
        }
      }
    }
    //小时
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        this.hours.push("0" + i + "时");
      } else {
        this.hours.push(i + "时");
      }
    }
    //分钟
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        this.mins.push("0" + i + "分");
      } else {
        this.mins.push(i + "分");
      }
    }
    this.datePicker = [
      this.years,
      this.months,
      this.days,
      this.hours,
      this.mins
    ];
    this.timedata =
      this.datePickerValue2[0] +
      "-" +
      this.datePickerValue2[1] +
      "-" +
      this.datePickerValue2[2] +
      " " +
      this.datePickerValue2[3] +
      ":" +
      this.datePickerValue2[4] +
      ":00";
    console.log(this.timedata);
    this.goodsList = this.$route.params.list; //选中的商品
    if (this.$storage.getItem("cartBF")) {
      //如果备份购物车不为空，则取备份购物车
      this.goodsList = JSON.parse(this.$storage.getItem("cartBF"));
    }
    // this.$storage.setItem(
    //         "cartBF",
    //         JSON.stringify(this.goodsList)
    //       );
    this.UncheckedGoodsList = this.$route.params.list2; //未选中的商品
    if (Object.keys(this.$store.getters.address).length > 0) {
      this.province = this.$store.getters.address.province;
      this.city = this.$store.getters.address.city;
      this.region = this.$store.getters.address.region;
      this.xaddressValue =
        this.$store.getters.address.xaddressValue == ""
          ? "请选择地址"
          : this.$store.getters.address.xaddressValue;

      this.userName = this.$store.getters.address.userName;
      this.userPhone = this.$store.getters.address.userPhone;
      this.detailedAddress = this.$store.getters.address.detailedAddress;
    }

    // 处理数组用户计算优惠
    let arrList = []; //用于计算优惠
    let totalPrice = 0;
    let goods = []; //用于传参
    let obj = {
      materialNumber: "",
      materialQty: ""
    };
    let obj2 = {
      numId: "",
      skuId: "",
      amount: "",
      shop: ""
    };

    this.goodsList.forEach((currentValue, index, arr) => {
      console.log(arr[index]);
      obj.materialNumber = arr[index].outerCode;
      obj.materialQty = arr[index].count;
      obj.shop = arr[index].storename;
      obj2.numId = arr[index].id;
      obj2.skuId = arr[index].skuid;
      obj2.skuId = arr[index].skuid;
      obj2.amount = arr[index].count;
      obj2.shop = arr[index].storename;
      arrList.push(obj);
      goods.push(obj2);
      obj = {
        materialNumber: "",
        materialQty: "",
        shop: ""
      };
      obj2 = {
        numId: "",
        skuId: "",
        amount: "",
        shop: ""
      };
      totalPrice += arr[index].price * arr[index].count;
    });
    console.log("总金额" + totalPrice);
    // console.log(arrList);
    // console.log(goods);
    // console.log(this.goodsList);
    this.totalPrice = totalPrice; //商品总金额
    this.actualPrice = totalPrice; //实际付款金额
    this.goods = goods; //用于提交订单时传参
    this.skuList = arrList; //sku保存

    // 改造data参数结构
    let transformData = {
       wholeReducedSum: this.preferentialPriceBF||0,
      quoteTime: this.timedata,
      userCode: this.usercode,
      materialList: arrList,
      isPostageDisscount: this.isPostageDisscount || 0
    };
    //  执行计算优惠方法
    this.preferentialWay(transformData, 0, 0);
  },
  mounted() {
    // 初始化滚动条
    console.log(this.sid);
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  computed: {
    ...mapGetters(["sid", "usercode", "phone"])
  },
  watch: {
    //监控时间选择器
    datePickerValue() {
      let year = parseInt(this.datePickerValue[0].split("年")[0]);
      let month = parseInt(this.datePickerValue[1].split("月")[0]);
      this.datePickerValue2[0] = this.datePickerValue[0].split("年")[0];
      this.datePickerValue2[1] = this.datePickerValue[1].split("月")[0];
      this.datePickerValue2[2] = this.datePickerValue[2].split("日")[0];
      this.datePickerValue2[3] = this.datePickerValue[3].split("时")[0];
      this.datePickerValue2[4] = this.datePickerValue[4].split("分")[0];
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        if (month == 2 && this.days.length == 29) {
          return;
        } else if (month == 2 && this.days.length != 29) {
          this.days.splice(0, this.days.length);
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              this.days.push("0" + i + "日");
            } else {
              this.days.push(i + "日");
            }
          }
        }
        if (
          month == 1 ||
          month == 3 ||
          month == 5 ||
          month == 7 ||
          month == 8 ||
          month == 10 ||
          month == 12
        ) {
          //大月
          if (this.days.length == 31) {
            return;
          } else {
            this.days.splice(0, this.days.length);
            for (let i = 1; i <= 31; i++) {
              if (i < 10) {
                this.days.push("0" + i + "日");
              } else {
                this.days.push(i + "日");
              }
            }
          }
        }
        if (month == 4 || month == 6 || month == 9 || month == 11) {
          //小月
          if (this.days.length == 30) {
            return;
          } else {
            this.days.splice(0, this.days.length);
            for (let i = 1; i <= 30; i++) {
              if (i < 10) {
                this.days.push("0" + i + "日");
              } else {
                this.days.push(i + "日");
              }
            }
          }
        }
      } else {
        if (month == 2 && this.days.length == 28) {
          return;
        } else if (month == 2 && this.days.length != 28) {
          this.days.splice(0, this.days.length);
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              this.days.push("0" + i + "日");
            } else {
              this.days.push(i + "日");
            }
          }
        }
        if (
          month == 1 ||
          month == 3 ||
          month == 5 ||
          month == 7 ||
          month == 8 ||
          month == 10 ||
          month == 12
        ) {
          //大月
          if (this.days.length == 31) {
            return;
          } else {
            this.days.splice(0, this.days.length);
            for (let i = 1; i <= 31; i++) {
              if (i < 10) {
                this.days.push("0" + i + "日");
              } else {
                this.days.push(i + "日");
              }
            }
          }
        }
        if (month == 4 || month == 6 || month == 9 || month == 11) {
          //小月
          if (this.days.length == 30) {
            return;
          } else {
            this.days.splice(0, this.days.length);
            for (let i = 1; i <= 30; i++) {
              if (i < 10) {
                this.days.push("0" + i + "日");
              } else {
                this.days.push(i + "日");
              }
            }
          }
        }
      }
    },
    userName() {
      if (this.userName) {
        this.errorState1 = false;
      }
    },
    detailedAddress() {
      if (this.detailedAddress) {
        this.errorState4 = false;
      }
    },
    distributionId() {
      this.errorState5 = false;
    },
    payId() {
      this.errorState6 = false;
    },

    //   监听省份变化重新计算运费
    province() {
      this.errorState3 = false;
      if (this.distributionId != -1) {
        this.freightway(this.distributionId);
      }
    },
    // 监听输入的优惠金额变化
    preferentialPrice() {
      console.log(this.preferentialPrice);
      if (this.preferentialPrice > this.totalPrice) {
        this.$vux.toast.show({
          text: "优惠金额不能大于商品总金额",
          type: "text",
          width: "20em"
        });
        return;
      }
      if (!this.preferentialPrice) {
        //输入优惠为空
        // this.totalPreferential = parseFloat(this.computePreferentialPrice);
        // this.actualPrice =
        //   this.totalPrice +
        //   this.freight -
        //   (parseFloat(this.computePreferentialPrice) + 0).toFixed(2);
      } else {
        this.hadEnsure = false;
        // console.log(parseFloat(this.preferentialPrice));
        // this.totalPreferential = (
        //   parseFloat(this.computePreferentialPrice) +
        //   parseFloat(this.preferentialPrice)
        // ).toFixed(2);
        // this.actualPrice = (this.totalPrice + this.freight - (parseFloat(this.computePreferentialPrice) + parseFloat(this.preferentialPrice)).toFixed(2)).toFixed(2);
      }
    },
    // 监听手机输入是否正确
    userPhone() {
      if (this.userPhone.length >= 11) {
        if (this.validationPhoneNumber(this.userPhone)) {
          this.phoneError = false;
        } else {
          this.phoneError = true;
        }
      }
    }
  },
  filters: {
    priceFilter(price) {
      // console.log(price);
      if (!price) return "";
      return parseFloat(price).toFixed(2);
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log("离开了结算页");
    var address = {
      userName: this.userName,
      userPhone: this.userPhone,
      province: this.province,
      city: this.city,
      region: this.region,
      detailedAddress: this.detailedAddress,
      xaddressValue: this.xaddressValue
    };
    this.$store.commit("SET_ADDRESS", address);
    next();
  },
  methods: {
    //弹出时间选择器
    showPickerFun() {
      this.showpicker = true;
    },
    pickerChange() {},
    pickerCancel() {
      this.showpicker = false;
    },
    pickerConfirm() {
      this.showpicker = false;
      this.timedata =
        this.datePickerValue2[0] +
        "-" +
        this.datePickerValue2[1] +
        "-" +
        this.datePickerValue2[2] +
        " " +
        this.datePickerValue2[3] +
        ":" +
        this.datePickerValue2[4] +
        ":00";
      console.log(this.timedata);
      // 改造data参数结构
      let transformData2 = {
        wholeReducedSum: this.preferentialPriceBF||0,
        quoteTime: this.timedata,
        userCode: this.usercode,
        materialList: this.skuList,
        isPostageDisscount: this.isPostageDisscount || 0
      };
      this.computePreferentialPrice = 0;
      console.log(this.preferentialPrice);
      let inputPrice = this.preferentialPrice || 0; //用户输入的优惠金额
      let yfPrice = this.freight || 0; //运费金额
      console.log(`输入金额:${inputPrice},运费金额:${yfPrice}`);
      this.preferentialWay(transformData2, inputPrice, yfPrice);
    },
    // 初始化better-scroll
    initScroll() {
      if (!this.historyList) {
        this.historyList = new BScroll(this.$refs.wrapper, this.options);
      }
    },
    // 计算优惠金额
    preferentialWay(data, price, yfPrice, fromOilWay) {
      this.$vux.loading.show({
        text: "请求中"
      });
      let yhUrl = "/order/discount?__sid=" + this.sid;
      console.log(yhUrl);
      this.$api.post(yhUrl, data, header).then(res => {
        console.log(res);
        if (res.code == 200) {
          // 重构用户商品列表价格
          this.totalPrice = 0; //总价格清0
          this.fstotalPrice = 0;
          for (let i = 0; i < this.goodsList.length; i++) {
            //获取后台商品价格，goodsList数组重构
            for (let j = 0; j < res.data.skuPriceList.length; j++) {
              if (
                this.goodsList[i].outerCode ==
                res.data.skuPriceList[j].materialNumber
              ) {
                debugger;
                this.goodsList[i].price = res.data.skuPriceList[j].price;
              }
            }
          }
          this.goodsList.forEach((item, index, array) => {
            this.totalPrice +=
              this.goodsList[index].price * this.goodsList[index].count; //重构后重新计算总价格
              if(item.storename !="优梵艺术家居旗舰店"){  //计算不是优梵艺术家居旗舰店的所有商品金额
                this.fstotalPrice += this.goodsList[index].price * this.goodsList[index].count;
              }
          });
          console.log('仅优梵艺术旗舰店的商品总金额'+this.fstotalPrice)
          this.PostageDisscount = parseFloat(res.data.oilSubsidy).toFixed(2); //邮费补贴值
          this.withoutPrivileges = false;
          this.preferentialList = res.data.discountList;
          this.preferentialListBF = res.data.discountList;
          res.data.discountList.forEach((currentValue, index, arr) => {
            this.computePreferentialPrice += parseFloat(
              currentValue.offerAmount
            ); //计算返回优惠金额
          });

          this.totalPreferential = parseFloat(
            this.computePreferentialPrice + parseFloat(price)
          ).toFixed(2);
          this.actualPrice = (
            this.totalPrice -
            this.totalPreferential +
            yfPrice -
            parseFloat(res.data.oilSubsidy)
          ).toFixed(2);
          this.withoutPrivileges = false;
          if (res.data.discountList.length == 0) {
            this.withoutPrivileges = true;
            this.tips = "所选商品暂无优惠";
            this.$vux.loading.hide();
            return;
          } else if (res.data.discountList.length == 1) {
            this.listHeight = 45;
          } else if (res.data.discountList.length == 2) {
            this.listHeight = 90;
          } else {
            this.listHeight = "";
          }
          if (this.city != "" && this.distributionId != -1 && !fromOilWay) {
            this.freightway(this.distributionId); //优惠金额变化需重新计算运费
          }
          this.$vux.loading.hide();
        } else if (res.code == 900 || res.code == 500) {
          this.withoutPrivileges = true;
          this.tips = "所选商品暂无优惠";
          this.goodsList = JSON.parse(this.$storage.getItem("cartBF")); //如果接口执行失败就获取备份商品.
          this.totalPrice = 0; //总价格清0
          this.fstotalPrice = 0;
          this.goodsList.forEach((item, index, array) => {
            this.totalPrice +=
              this.goodsList[index].price * this.goodsList[index].count; //计算总价格
          });
          this.totalPreferential = parseFloat(price).toFixed(2);
          this.actualPrice = (
            this.totalPrice -
            parseFloat(price) +
            yfPrice
          ).toFixed(2);
          this.$vux.loading.hide();
        } else {
          this.withoutPrivileges = true;
          this.tips = res.msg;
          this.preferentialPrice = '';
          this.$vux.toast.show({
            text: res.msg,
            type: "text",
            width: "16em"
          });
          this.$vux.loading.hide();
        }
      });
    },

    // 计算运费金额
    freightway(id) {
      this.$vux.loading.show({
        text: "请求中"
      });
      let yfUrl = "/order/calculate?__sid=" + this.sid;
      let yfData = {
        province: this.province,
        city: this.city,
        region: this.region,
        price: this.fstotalPrice,
        distribution: this.list1[id]
      };
      this.$api.post(yfUrl, yfData, header).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.freight = parseFloat(res.data);
          this.actualPrice = (
            this.totalPrice +
            parseFloat(res.data) -
            this.totalPreferential -
            parseFloat(this.PostageDisscount)
          ).toFixed(2); //实际金额=总商品金额+运费-优惠金额
          this.$vux.loading.hide();
        } else {
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: res.msg,
            type: "text",
            width: "15em"
          });
        }
      });
    },

    // 打开弹框
    showbouncedway(id) {
      this.wayId = id;
      this.showBounced = true;
      console.log(id);
      if (id == 0) {
        if (!this.province) {
          this.showBounced = false;
          this.$vux.toast.show({
            text: "请先完善地址信息",
            type: "text",
            width: "15em"
          });
          return;
        } else {
          this.showBounced = true;
        }
      } else if (id == 2) {
        console.log("```````````````````测试``````````````````````````");
        console.log(this.hadEnsure);
        console.log(this.preferentialPriceBF);
        if (!this.hadEnsure) {
          console.log('用户未点击确认')
          //如果未点击确认
          this.preferentialPrice = this.preferentialPriceBF;
        }
        this.$nextTick(() => {
          this.list = new BScroll(this.$refs.list, this.options);
          this.historyList.disable();
          console.log(this.list);
        });
      } else if (id == 3) {
      }
    },

    // 打开优惠明细弹框
    showbounYHMX() {
      console.log(`测试${this.preferentialPriceBF}`)
      this.showBouncedYHMX = true;
      this.preferentialPrice = this.preferentialPriceBF
      this.$nextTick(() => {
        this.list = new BScroll(this.$refs.list, this.options);
        this.historyList.disable();
        console.log(this.list);
      });
    },
    // 关闭弹框
    closeBounced() {
      this.showBounced = false;
      this.historyList.enable();
      this.showpicker = false;
      this.showBouncedYHMX = false;
      if (this.actualPrice < 0) {
        this.preferentialPrice = "";
        this.preferentialPriceBF = "";
      }
      // if(!this.preferentialPriceBF||this.preferentialPriceBF==0){
      //   this.preferentialPrice = ''
      // }else{
      //    this.preferentialPrice = this.preferentialPriceBF
      // }
    },
    // 地址选择
    logHide(e) {
      console.log(e);
      if (e) {
        //用户点击确认
        console.log(this.$refs.address.nameValue);
        this.xaddressValue = this.$refs.address.nameValue;
        let address = this.$refs.address.nameValue.split(" ");
        this.province = address[0];
        this.city = address[1];
        this.region = address[2];
        this.addressFilter(this.province);
      }

      console.log(this.province);
    },
    // 地址过滤器
    addressFilter(province) {
      switch (province) {
        case "北京市":
          this.province = "北京";
          this.city = "北京市";
          break;
        case "天津市":
          this.province = "天津";
          this.city = "天津市";
          break;
        case "上海市":
          this.province = "上海";
          this.city = "上海市";
          break;
        case "重庆市":
          this.province = "重庆";
          this.city = "重庆市";
          break;
      }
    },
    // 配送方式选择
    choosePsWay(id) {
      console.log(id);
      this.distributionId = id;
      this.freightway(id); //计算运费
      this.closeBounced();
    },
    // 邮费补贴选择
    chooseOilWay(id) {
      this.oilId = id;
      this.isPostageDisscount = id;
      let transformData3 = {
        wholeReducedSum: this.preferentialPriceBF||0, //用户输入的优惠
        quoteTime: this.timedata,
        userCode: this.usercode,
        materialList: this.skuList,
        isPostageDisscount: id
      };
      this.computePreferentialPrice = 0;
      let inputPrice1 = this.preferentialPrice || 0; //用户输入的优惠金额
      let yfPrice1 = this.freight || 0; //运费金额
      let fromOilWay = true;
      console.log(`输入金额:${inputPrice1},运费金额:${yfPrice1}`);
      this.preferentialWay(transformData3, inputPrice1, yfPrice1, fromOilWay);
      this.closeBounced();
    },
    // 支付方式选择
    choosePayWay(id) {
      this.payId = id;
      this.closeBounced();
    },
    // 优惠券选择
    choosePreferential() {
      this.wayId = id;
    },
    // 确认输入的优惠金额
    ensure() {
      console.log("测试测试是");
      console.log(parseFloat(this.preferentialPrice));
      if (!parseFloat(this.preferentialPrice)) {
        console.log("输入为空");
        this.preferentialPrice = '';
        this.preferentialPriceBF = '';
      } else {
        console.log('ssssssssssssss')
        this.actualPrice = (
          this.totalPrice +
          this.freight -
          (
            parseFloat(this.computePreferentialPrice) +
            parseFloat(this.preferentialPrice)
          ).toFixed(2)
        ).toFixed(2);
        if (this.actualPrice < 0) {
          this.$vux.toast.show({
            text: "优惠金额输入有误！",
            type: "text",
            width: "15em"
          });
          return;
        } else {
          this.totalPreferential = (
          parseFloat(this.computePreferentialPrice) +
          parseFloat(this.preferentialPrice)
        ).toFixed(2);
          this.enable = true;
          this.hadEnsure = true,
          this.preferentialPriceBF = this.preferentialPrice;
        }
      }
       // 重新计算优惠
       console.log('哈哈uuahuau')
          console.log(!parseFloat(this.preferentialPrice))
          // let inputPrice1 = !parseFloat(this.preferentialPrice)?'0':(this.preferentialPrice || 0); //用户输入的优惠金额
          let inputPrice1 = this.preferentialPrice || 0; //用户输入的优惠金额
          let yfPrice1 = this.freight || 0; //运费金额
          let transformData = {
              wholeReducedSum: !parseFloat(this.preferentialPrice)?'0':(this.preferentialPriceBF||0),
              quoteTime: this.timedata,
              userCode: this.usercode,
              materialList: this.skuList,
              isPostageDisscount: this.isPostageDisscount || 0
             };
          this.computePreferentialPrice = 0;  //总的计算有优惠清0
          this.preferentialWay(transformData,inputPrice1,yfPrice1)
      //  if(this.city !=''&&this.distributionId !=-1){
      //         this.freightway(this.distributionId); //优惠金额变化需重新计算运费
      //     }
      this.closeBounced();
    },
    //验证手机号码是否正确
    validationPhoneNumber: function(phone) {
      var phoneReg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
      if (!phoneReg.test(phone)) {
        return false;
      } else {
        return true;
      }
    },
    // 提交订单
    submitOrder() {
      if (!this.userName) {
        this.errorState1 = true;
      }
      if (!this.userPhone) {
        this.phoneError = true;
      }
      if (!this.province) {
        this.errorState3 = true;
      }
      if (!this.detailedAddress) {
        this.errorState4 = true;
      }
      if (this.distributionId == -1) {
        this.errorState5 = true;
      }
      if (this.payId == -1) {
        this.errorState6 = true;
      }
      if (
        !this.userName ||
        !this.userPhone ||
        !this.province ||
        !this.detailedAddress ||
        this.distributionId == -1 ||
        this.payId == -1
      ) {
        this.$vux.toast.show({
          text: "请完善用户信息",
          type: "text",
          width: "15em"
        });
        return;
      }
      //验证手机号码
      console.log(this.validationPhoneNumber(this.userPhone));
      if (!this.validationPhoneNumber(this.userPhone)) {
        this.$vux.toast.show({
          text: "手机号码格式有误",
          type: "text",
          width: "15em"
        });
        this.phoneError = true;
        return;
      }
      this.$vux.loading.show({
        text: "正在提交..."
      });
      this.submission = true; //提交中禁止button重复提交
      // if(this.preferentialPrice)
      console.log(`输出一下优惠${this.preferentialPrice}`);
      if (this.preferentialPrice > 0) {
        console.log("优惠金额大于0");
        let orderDiscount = {
          offerName: "其它优惠",
          offerAmount: this.preferentialPrice
        };
        this.preferentialListBF.push(orderDiscount);
        console.log(this.preferentialListBF);
      }
      let orderUrl = "/order/createOrder?__sid=" + this.sid;
      let orderData = {
        userCode: this.usercode,
        province: this.province,
        city: this.city,
        region: this.region,
        customerName: this.userName,
        phone: this.userPhone,
        address: this.detailedAddress,
        distribution: this.list1[this.distributionId],
        payType: this.list2[this.payId],
        remarks: this.note,
        discount: this.totalPreferential,
        logisticsFee: this.freight,
        goods: this.goods,
        quoteTime: this.timedata,
        isEnjoy: this.isPostageDisscount || 0,
        oilSubsidy: this.PostageDisscount,
        discountList: this.preferentialListBF
      };
      console.log(orderData);
      this.$api.post(orderUrl, orderData, header).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$storage.setItem("cartBF", "");
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: "提交成功!",
            type: "text",
            width: "15em"
          });
          // this.$storage.setItem(
          //   "cart",
          //   JSON.stringify(this.UncheckedGoodsList)
          // ); //替换缓存中的购物车商品
          setTimeout(() => {
            // this.$router.replace({ name: "myorder" });
            // this.submission = false;
            this.$router.replace({
              name: "myorder"
              // params: { sid: this.sid, orderid: res.data.split(":")[1] }
            });
          }, 500);
        } else if (res.code == 500 && res.code == 900) {
          this.$vux.loading.hide();
          this.submission = false;
          this.$vux.toast.show({
            text: "创建订单失败",
            type: "text",
            width: "15em"
          });
        } else {
          this.submission = false;
          this.$vux.loading.hide();
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
<style lang="less" scoped>
@rem: 75rem;
.accountpagewrapper {
  box-sizing: border-box;
  position: absolute;
  top: 100 / @rem;
  width: 100%;
  z-index: 24;
  background-color: #fff;
  color: #222;
  overflow: hidden;
}
// icon-B
.icon-jiantou {
  color: #676767;
  font-size: 24 / @rem;
}
.icon-gouxuan {
  color: #f76e6e;
  font-size: 41 / @rem;
}
// icon-E
::-webkit-input-placeholder {
  color: #a9a9a9;
  font-size: 28 / @rem;
}

// 错误样式
.error {
  color: #e53922;
}
.address {
  color: #222222;
  font-size: 34 / @rem;
  padding: 0 40 / @rem 20 / @rem;
  .userName,
  .userPhone,
  .userAddress {
    height: 105 / @rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    input {
      color: #888888;
      width: 470 / @rem;
      height: 50 / @rem;
      font-size: 30 / @rem;
      padding-left: 29 / @rem;
      box-sizing: border-box;
    }
    .addressControl {
      // padding-left: 20 / @rem;
      width: 470 / @rem;
      font-size: 30 / @rem;
      text-align: left;
      box-sizing: border-box;
    }
  }
  .detailedAddress {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    font-size: 34 / @rem;
    padding-top: 34 / @rem;
    textarea {
      color: #888;
      font-size: 30 / @rem;
      width: 470 / @rem;
      height: 90 / @rem;
      padding: 5 / @rem 0 0 26 / @rem;
      border: none;
      box-sizing: border-box;
    }
  }
}
.border {
  width: 100%;
  height: 20 / @rem;
  background-color: #f4f4f4;
}
.goods {
  padding: 0 40 / @rem;
  .goodItem {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 40 / @rem 0;
    font-size: 28 / @rem;
    border-bottom: 1px solid #eee;
    .left {
      width: 180 / @rem;
      height: 180 / @rem;
      img {
        width: 180 / @rem;
        height: 180 / @rem;
      }
    }
    .right {
      width: 490 / @rem;
      padding-left: 20 / @rem;
      box-sizing: border-box;
      .goodName {
        color: #888888;
        font-size: 26 / @rem;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .priceWrapper {
        color: #222222;
        font-weight: bold;
        font-size: 30 / @rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 10 / @rem;
        margin-top: 20 / @rem;
        box-sizing: border-box;
      }
      .specification {
        color: #888;
        font-size: 24 / @rem;
        margin-top: 28 / @rem;
      }
    }
  }
  .goodItem:last-child {
    border-bottom: none;
  }
}
.wayWrapper {
  padding: 0 40 / @rem;
  .item {
    width: 100%;
    height: 105 / @rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    .left {
      font-size: 34 / @rem;
    }
    .right {
      color: #888;
      font-size: 28 / @rem;
    }
  }
  .note {
    font-size: 34 / @rem;
    width: 100%;
    height: 105 / @rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    input {
      color: #888;
      width: 470 / @rem;
      height: 50 / @rem;
      font-size: 30 / @rem;
      padding-left: 20 / @rem;
      box-sizing: border-box;
    }
  }
}
.orderDetail {
  padding: 40 / @rem 40 / @rem 0;
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 34 / @rem;
    height: 24 / @rem;
    margin-bottom: 45 / @rem;
    padding-right: 30 / @rem;
    .right {
      color: #888888;
      font-size: 30 / @rem;
    }
  }
  .yfPrice {
    margin-bottom: 20 / @rem;
  }
  .item:first-child {
    padding-right: 0 / @rem;
  }
  .item2 {
    margin-bottom: 0;
    padding: 25 / @rem 0 20 / @rem;
    padding-right: 0;
  }
  .item:last-child {
    margin-bottom: 0;
    padding: 25 / @rem 0 40 / @rem;
    padding-right: 0 / @rem;
    border-bottom: 1px solid #eee;
  }
}
.actualAmount {
  color: #888;
  font-size: 28 / @rem;
  padding: 40 / @rem 70 / @rem 60 / @rem 40 / @rem;
  display: flex;
  flex-direction: row-reverse;
  .price {
    color: #222;
    font-size: 32 / @rem;
    font-weight: 600;
  }
}
.btn {
  color: #fff;
  font-size: 28 / @rem;
  width: 100%;
  height: 95 / @rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #424242;
}
// 弹框
.bounced {
  width: 100%;
  height: 670 / @rem;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
  //   padding: 0 40 / @rem;
  box-sizing: border-box;
  background-color: #fff;
  transition: bottom ease 0.4s;
}
.bouncedYHMX {
  width: 100%;
  height: 785 / @rem;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
  box-sizing: border-box;
  background-color: #fff;
  transition: bottom ease 0.4s;
}
.dowmbounced {
  width: 100%;
  height: 670 / @rem;
  position: fixed;
  left: 0;
  bottom: -670 / @rem;
  z-index: 10;
  //   padding: 0 40 / @rem;
  box-sizing: border-box;
  background-color: #fff;
}
.dowmbouncedYHMX {
  width: 100%;
  height: 785 / @rem;
  position: fixed;
  left: 0;
  bottom: -785 / @rem;
  z-index: 10;
  //   padding: 0 40 / @rem;
  box-sizing: border-box;
  background-color: #fff;
}
.ensure {
  position: absolute;
  left: 0;
  bottom: 0;
  color: #fff;
  font-size: 28 / @rem;
  width: 100%;
  height: 90 / @rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #424242;
}
.ensure2 {
  color: #fff;
  font-size: 28 / @rem;
  width: 100%;
  height: 90 / @rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #424242;
}
.header {
  color: #424242;
  font-size: 34 / @rem;
  font-weight: 600;
  height: 120 / @rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
}
.bItem {
  font-size: 28 / @rem;
  padding: 0 40 / @rem;
  .wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 105 / @rem;
    border-bottom: 1px solid #f4f4f4;
    .quan {
      display: flex;
      width: 32 / @rem;
      height: 32 / @rem;
      border: 1px solid #999;
      border-radius: 100%;
    }
  }
}
.preferential {
  padding: 40 / @rem 40 / @rem 0;
  .order,
  .withoutPrivileges {
    color: #666666;
    font-size: 28 / @rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20 / @rem;
    box-sizing: border-box;
  }
  .withoutPrivileges {
    margin-bottom: 34 / @rem;
  }
  .item {
    color: #666666;
    font-size: 28 / @rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20 / @rem;
    box-sizing: border-box;
    border-bottom: 1px solid #f6f6f6;
    padding-bottom: 15 / @rem;
    .left {
      width: 520 / @rem;
      line-height: 36 / @rem;
      height: 72 / @rem;
      padding-right: 40 / @rem;
      box-sizing: border-box;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .right {
      min-width: 110 / @rem;
      color: #f76e6e;
    }
  }
  .order {
    color: #222;
    font-size: 28 / @rem;
    padding: 20 / @rem 0;
    box-sizing: border-box;
    .left {
      color: #666;
      width: 200 / @rem;
      margin-right: 50 / @rem;
    }
    .right {
      input {
        font-size: 24 / @rem;
        width: 450 / @rem;
        height: 65 / @rem;
        line-height: 65 / @rem;
        padding-left: 20 / @rem;
        box-sizing: border-box;
        border: 1px solid #f1f0f0;
      }
    }
  }
  .borderTop {
    border-top: 1px solid #f6f6f6;
  }
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
  z-index: 1;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

.vux-popup-picker-value {
  color: #222;
}
// 错误
.changeColor {
  color: #eb1d21 !important;
}

.listWrapper {
  height: 619 / @rem;
  overflow: hidden;
}

.date-picker-win {
  width: 100%;
  height: 688 / @rem;
  position: fixed;
  left: 0;
  bottom: -700 / @rem;
  z-index: 30;
  background-color: #fff;
  transition: bottom 0.5s;
  .picker-header {
    height: 86 / @rem;
    border-bottom: 1px solid #eeeeee;
    padding-left: 40 / @rem;
    padding-right: 40 / @rem;
    font-size: 26 / @rem;
    .picker-cancel {
      float: left;
      line-height: 86 / @rem;
      color: #999;
    }
    .picker-confirm {
      float: right;
      line-height: 86 / @rem;
      color: #222222;
    }
  }
  .picker {
    width: 100%;
    height: 600 / @rem;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
.date-picker-win-show {
  bottom: 0;
}
</style>