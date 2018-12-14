// pages/brand/play/play.js
var app = getApp();
var api = require("../../../utils/API/request.js");
var common = require("../../../utils/common.js");
import regeneratorRuntime from "../../../utils/API/wxPromise.min.js";
import {
  GetPrizes,
  CanPlayRoulette,
  GetPrizeWinnerList,
  GetMyPrize
} from "../../../utils/API/brand/brand.js";

var stayTime_JY = 0; //停留时间
var stayTimer_JY; //定时器
Page({
  data: {
    circleList: [], //圆点数组
    awardList: [], //奖品数组
    colorCircleFirst: "#FFDF2F", //圆点颜色1
    colorCircleSecond: "#FE4D32", //圆点颜色2
    colorAwardDefault: "#F5F0FC", //奖品默认颜色
    colorAwardSelect: "#8a6a6f", //奖品选中颜色
    indexSelect: 0, //被选中的奖品index
    isRunning: false, //是否正在抽奖
    animationData: {},
    chooseIndex: 9, //后端返回选中奖品
    lcount: 3,
    beanCount: 0, //个人梵豆数
    imageAward: [
      "https://uvpt.uvanart.com/upload/static/play/light.png",
      "https://uvpt.uvanart.com/upload/static/play/light.png",
      "https://uvpt.uvanart.com/upload/static/play/light.png",
      "https://uvpt.uvanart.com/upload/static/play/light.png",
      "https://uvpt.uvanart.com/upload/static/play/light.png",
      "https://uvpt.uvanart.com/upload/static/play/umbrella.png",
      "https://uvpt.uvanart.com/upload/static/play/chair.png",
      "https://uvpt.uvanart.com/upload/static/play/lALPBbCc1ZKKPw3NByDNAu4_750_1824.png"
    ], //奖品图片数组
    prizemember: [],
    hiddenPrize: true,
    shadow: true,
    prizename: "",
    thisimageAward: "",
    pagehidden: true,
    beanRuleCount: 10,
    update:true,
    duringAct:true,//活动是否结束
  },
  onShow: function() {
    //开始计时（停留时间）
    stayTime_JY = 0; //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++;
    }, 1000);

    this.init();

    //获取当天所有人的中奖名单
  },
  //初始化
  init: async function() {
    wx.showLoading({
      title: "加载中"
    });
    //奖品item设置
    var _this = this;
    var photodata = {
      data: "测试活动"
    };
    var res1 = await GetPrizes(photodata);
    _this.setData({ imageAward: res1.data });
    var countdata = {
      data: "测试活动"
    };
    var res2 = await CanPlayRoulette(countdata);
    //活动是否过期，10梵豆，剩余次数，当前梵豆
    _this.setData({
      beanRuleCount: res2.data.VanBeanConsume, 
      lcount: res2.data.limitVisitCount,
      beanCount: res2.data.VanBeanCount,
      duringAct: res2.data.TimeLimit
    });
    if (!res2.data.TimeLimit) {
      wx.showModal({
        title: "提示",
        content: "梵豆抽奖活动已结束",
        showCancel: false, //去掉取消按钮
      });
    }
    var allPrizeData = {
      rouletteName: "测试活动", page: "1", limit: "5" 
    };
    var res3 = await GetPrizeWinnerList(allPrizeData);
    _this.initPrize();
    if (res3.data.Data) {
      _this.setData({ prizemember: res3.data.Data });
    }
    wx.hideLoading();
    _this.setData({ pagehidden: false });
    
  },
  onLoad: function() {},
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "梵豆抽奖");
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "梵豆抽奖");
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
    var topAward = 25;
    var leftAward = 25;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 25;
        leftAward = 25;
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
        data: "测试活动"
      };
      GetMyPrize(prizedata)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            var list = _this.data.imageAward;
            var choose = 9;
            list.map(function(prize, index) {
              if (prize.F_ID == res.data.Data.F_ID) {
                choose = prize.F_Seq - 1;
              }
            });
            console.log(choose);
            _this.setData({
              lcount: res.data.Data.F_VisitCount,
              beanCount: res.data.Data.F_VanbeanCount,
              chooseIndex: choose
            });
          } else if (res.code == 400) {
            debugger;
            _this.setData({
              chooseIndex: -1
            });
            wx.showModal({
              title: "提示",
              content: res.info,
              showCancel: false, //去掉取消按钮
              success: function(res) {
                _this.setData({
                  lcount: 0
                });
              }
            });

          }
        })
        .catch(res => {
          console.log(res);
        });
  },
  //开始游戏
  startGame: function() {
    var _this = this;
    if (this.data.lcount <= 0) {
      wx.showModal({
        title: "提示",
        content: "今天抽奖次数已用完",
        showCancel: false, //去掉取消按钮
        success: function(res) {
          //一般不会进来，点了开始，才发现次数没了
          _this.setData({
            lcount: 0
          });
        }
      });
    } else if (this.data.beanCount < this.data.beanRuleCount) {
      wx.showModal({
        title: "提示",
        content: "可用梵豆不足",
        showCancel: false //去掉取消按钮
      });
    }
    debugger;
    if (
      this.data.isRunning ||
      this.data.lcount <= 0 ||
      this.data.beanCount < this.data.beanRuleCount||
      !this.data.update ||
      !this.data.duringAct
    )
      return;
    this.setData({
      isRunning: true
    });
    debugger;
    this.priceIF(); //抽奖接口，先请求接口，与下面的转盘同步，下标转盘初始为9，接口返回才有1-8的值，否则一直转
    var indexSelect = 0;
    var i = 0;
    var timerwait = setInterval(function() {
      indexSelect = indexSelect % 8;
      _this.setData({
        indexSelect: indexSelect
      });
      if (_this.data.chooseIndex == -1) {
        clearInterval(timerwait);
        _this.setData({
          indexSelect: -1
        })
      } else if (_this.data.indexSelect == _this.data.chooseIndex && i > 8) {
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
      } else if (i > 40) {
        clearInterval(timerwait);
        wx.showModal({
          title: "提示",
          content: "服务端异常",
          showCancel: false, //去掉取消按钮
          success: function(res) {
            _this.setData({
              isRunning: false,
              chooseIndex: -1
            });
          }
        });
      }
      indexSelect++; //每次在累加值
      i++;
    }, 200);
  },
  showMyModal: function() {}
});
