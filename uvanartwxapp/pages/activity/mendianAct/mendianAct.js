// pages/activity/mendianAct/mendianAct.js
var app = getApp();
var api = require("../../../utils/API/request.js");
import {
  GetPrizes,
  GetRoulettePrizeName,
  startRoulette,
  GetRoulettePrizeImage,
  wxdecryptdata,
  uvanstarlogin2
} from "../../../utils/API/activity/activity.js";
Page({
  data: {
    circleList: [], //圆点数组
    awardList: [], //奖品数组
    colorCircleFirst: "#FFDF2F", //圆点颜色1
    colorCircleSecond: "#FE4D32", //圆点颜色2
    colorAwardDefault: "#F5F0FC", //奖品默认颜色
    colorAwardSelect: "#ffddae", //奖品选中颜色
    indexSelect: 0, //被选中的奖品index
    isRunning: false, //是否正在抽奖
    animationData: {},
    chooseIndex: 9, //后端返回选中奖品
    lcount: 1,
    imageAward: [
      {
        F_ID: "735321e1-e23b-4a18-8a42-56b1dd31b97f",
        F_PrizeName: "92折优惠",
        F_Image:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/bubuRGEGRFuuN-zCGt2SAwAAAT1wZDIE",
        F_Seq: 1
      },
      {
        F_ID: "41708d96-cd1b-4c45-be92-518107e9e132",
        F_PrizeName: "10000元奖券",
        F_Image:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/F4CVhSPrTcSw2EnTLvsGxgAAAT1wZDIE",
        F_Seq: 2
      },
      {
        F_ID: "8a92182c-52a4-437d-ac61-2a6d6f1170b4",
        F_PrizeName: "90折优惠",
        F_Image:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/APEFrDjZQxyWKcZKvdSN7QAAAT1wZDIE",
        F_Seq: 3
      },
      {
        F_ID: "23ce93bf-0721-4dc1-9d97-63ced5ee6054",
        F_PrizeName: "2000元奖券",
        F_Image:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/V2uFveA8QR-Bz44LM4BoqgAAAT1wZDIE",
        F_Seq: 4
      },
      {
        F_ID: "c5efcbc9-a192-4a08-8dcf-7b0ea1e9226f",
        F_PrizeName: "1000元奖券",
        F_Image:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/E7zljiQCQH6GbTpew_y_6QAAAT1wZDIE",
        F_Seq: 5
      },
      {
        F_ID: "ec9760cf-835f-46c0-b0ec-4cdea23aa6dc",
        F_PrizeName: "95折优惠",
        F_Image:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/gmzDeFjnSJWHY_ShXQg2BAAAAT1wZDIE",
        F_Seq: 6
      },
      {
        F_ID: "a4f35e0b-4a4b-43f3-bbac-c2cb8aed6120",
        F_PrizeName: "5000元奖券",
        F_Image:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/0ze8XDBiSgOjvYP-Yez8fQAAAT1wZDIE",
        F_Seq: 7
      },
      {
        F_ID: "12975d51-e9ff-4d95-9162-0828346f2a01",
        F_PrizeName: "88折优惠",
        F_Image:
          "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/InjBXMCPSaSsmJWfDtwXewAAAT1wZDIE",
        F_Seq: 8
      }
    ], //奖品图片数组
    prizemember: [],
    hiddenPrize: true,
    shadow: true,
    prizename: "",
    thisimageAward: "",
    pagehidden: true,
    prizedate: "",
    register: true, //抽奖变成注册
    enablePhone: false
  },
  onShow: function() {
    this.initfun();
    //获取当天所有人的中奖名单
  },
  onLoad: function() {},
  initfun: function() {
    var _this = this;
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    _this.setData({ register: false });
    //奖品item设置
      var photodata = {data: "广州门店抽奖"};
      GetPrizes(photodata).then(res => {
        console.log(res);
        _this.setData({ imageAward: res.data });
        _this.initPrize();
        var pricedata = {
            rouletteName: "广州门店抽奖" 
        };
        GetRoulettePrizeName(pricedata)
          .then(res => {
            res.info == "是"
              ? _this.setData({ lcount: 1 })
              : _this.setData({ lcount: 0 });
          })
          .catch(res => {
            console.log(res);
          })
          .finally(() => {
            //最后初始化完成，显示网页，隐藏loading
            wx.hideLoading();
            _this.setData({ pagehidden: false });
          });
      });
    
  },
  //显示弹窗
  showPrize: function() {
    this.setData({
      shadow: false,
      hiddenPrize: false
    });
  },
  //隐藏弹窗
  hiddenPrize: function() {
    this.setData({
      shadow: true,
      hiddenPrize: true
    });
  },
  initPrize: function() {
    var awardList = [];
    //间距,怎么顺眼怎么设置吧.
    var topAward = 83;
    var leftAward = 55;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 83;
        leftAward = 55;
      } else if (j < 3) {
        topAward = topAward;
        //166.6666是宽.15是间距.下同
        leftAward = leftAward + 166.6666 + 15;
      } else if (j < 5) {
        leftAward = leftAward;
        //150是高,15是间距,下同
        topAward = topAward + 150 + 15;
      } else if (j < 7) {
        leftAward = leftAward - 166.6666 - 15;
        topAward = topAward;
      } else if (j < 8) {
        leftAward = leftAward;
        topAward = topAward - 150 - 15;
      }
      var imageAward = this.data.imageAward[j].F_Image;
      var prizename = this.data.imageAward[j].F_PrizeName;
      var F_ID = this.data.imageAward[j].F_ID;
      awardList.push({
        topAward: topAward,
        leftAward: leftAward,
        imageAward: imageAward,
        prizename: prizename,
        F_ID: F_ID
      });
    }
    this.setData({
      awardList: awardList
    });
  },
  //抽奖接口
  priceIF: function() {
    var _this = this;
      var prizedata = {
         rouletteName: "广州门店抽奖" 
      };
      startRoulette(prizedata).then(res => {
        console.log(res);
        if (res.code == 200) {
          var list = _this.data.imageAward;
          var choose = 9;
          list.map(function(prize, index) {
            if (prize.F_ID == res.data.F_ID) {
              choose = prize.F_Seq - 1;
            }
          });
          console.log(choose);
          _this.setData({
            chooseIndex: choose,
            lcount: 0
          });
        } else if (res.code == 400) {
          wx.showModal({
            title: "提示",
            content: res.info,
            showCancel: false, //去掉取消按钮
            success: function(res) {
              //一般不会进来，点了开始，才发现次数没了
              _this.setData({
                lcount: 0
              });
            }
          });
        }
      });
  },
  //开始游戏
  startGame: function() {
    var _this = this;
    if (this.data.lcount <= 0) {
      wx.showModal({
        title: "提示",
        content: "每个人只能抽一次",
        showCancel: false, //去掉取消按钮
        success: function(res) {
          //一般不会进来，点了开始，才发现次数没了
          _this.setData({
            lcount: 0
          });
        }
      });
    }
    if (this.data.isRunning || this.data.lcount <= 0) return;
    this.setData({
      isRunning: true
    });
    var token = wx.getStorageSync("token");
    var phone = wx.getStorageSync("phone");
    if (phone == "" || token == "") {
      wx.showModal({
        title: "提示",
        content: "注册或者登录后才能参与此活动，点击“确定”后跳转到注册登录页面",
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "../../me/twicelogin/twicelogin"
            });
            wx.setStorageSync("formWhere", "running");
            return;
          } else if (res.cancel) {
            return;
          }
        }
      });
      _this.setData({
        isRunning: false
      });
    }else{
      this.priceIF(); //抽奖接口，先请求接口，与下面的转盘同步，下标转盘初始为9，接口返回才有1-8的值，否则一直转
      var indexSelect = 0;
      var i = 0;
      var timerwait = setInterval(function () {
        indexSelect = indexSelect % 8;
        _this.setData({
          indexSelect: indexSelect
        });
        if (_this.data.indexSelect == _this.data.chooseIndex && i > 8) {
          // chooseIndex根据接口返回看是哪个下标
          clearInterval(timerwait);
          //显示中奖成功的页面，可以做页面的优化-------------------------------------------------------------------------
          _this.setData({
            prizename: _this.data.awardList[_this.data.indexSelect].prizename,
            thisimageAward:
            _this.data.awardList[_this.data.indexSelect].imageAward,
            isRunning: false,
            hiddenPrize: false,
            shadow: false
          });
          // wx.showModal({
          //   title: '恭喜您',
          //   content: '获得了' + _this.data.awardList[_this.data.indexSelect].prizename + "",
          //   showCancel: false,//去掉取消按钮
          //   success: function (res) {

          //   }
          // })
        } else if (i > 40) {
          clearInterval(timerwait);
          wx.showModal({
            title: "提示",
            content: "服务端异常",
            showCancel: false, //去掉取消按钮
            success: function (res) {
              _this.setData({
                isRunning: false
              });
            }
          });
        }
        indexSelect++; //每次在累加值
        i++;
      }, 200);
    }
  },
  showGift: function() {
    debugger;
    var _this = this;
    try {
      var token = wx.getStorageSync("token");
      var phone = wx.getStorageSync("phone");
      if (token != "" && phone != "") {
        var price = {
          rouletteName: "广州门店抽奖"
        };
        GetRoulettePrizeImage(price).then(res => {
          _this.setData({
            prizename: res.data[0].F_PrizeName,
            thisimageAward: res.data[0].F_Image,
            prizedate: res.data[0].F_CreateDate
          });
          _this.showPrize();
        });
      } else {
        wx.showModal({
          title: "提示",
          content: "请先您先抽奖,再查看奖品",
          showCancel: false //去掉取消按钮
        });
      }
    } catch (e) {}
  }
});
