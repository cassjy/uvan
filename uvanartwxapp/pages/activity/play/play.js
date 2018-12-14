// pages/brand/play/play.js
var app = getApp();
var api = require("../../../utils/API/request.js");
var common = require("../../../utils/common.js");
import regeneratorRuntime from "../../../utils/API/wxPromise.min.js";
import {
  GetPrizes,
  CanPlayRoulette,
  GetPrizeWinnerList,
  GetMyPrize,
} from "../../../utils/API/brand/brand.js";
import { getBlackBox} from "../../../utils/API/activity/activity.js"

var stayTime_JY = 0; //停留时间
var stayTimer_JY; //定时器
Page({
  data: {
    circleList: [], //圆点数组
    awardList: [], //奖品数组
    colorCircleFirst: "#ffe442", //圆点颜色1
    colorCircleSecond: "#d87139", //圆点颜色2
    colorAwardDefault: "#fcecec", //奖品默认颜色
    colorAwardSelect: "#fff095", //奖品选中颜色
    indexSelect: 0, //被选中的奖品index
    isRunning: false, //是否正在抽奖
    animationData: {},
    chooseIndex: 9, //后端返回选中奖品
    lcount: 3,
    imageAward: [
    ], //奖品图片数组
    hiddenPrize: true,
    shadow: true,
    prizename: "",
    thisimageAward: "",
    pagehidden: true,
    timeLimit:false,
    update:true,
  },
  onShow: function() {
    //开始计时（停留时间）
    stayTime_JY = 0; //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++;
    }, 1000);
    var token = wx.getStorageSync("token");
    var phone = wx.getStorageSync("phone");
    var openid = wx.getStorageSync("openid");
    if (token && phone && openid) {
      this.init();
    } else {
    }
    //获取当天所有人的中奖名单
  },
  onReady:function(){
    var token = wx.getStorageSync("token");
    var phone = wx.getStorageSync("phone");
    var openid = wx.getStorageSync("openid");
    if (token && phone && openid){
      this.init();
    }else{
      wx.setStorageSync("formWhere", "blackbox");
      wx.showModal({
        title: '提示',
        content: '抽奖前需要先登录哦~',
        showCancel:false,
        success(res) {
            wx.navigateTo({
              url: '/pages/me/twicelogin/twicelogin'
            })
        }
      })
    }
  },
  init: async function() {
    wx.showLoading({
      title: "加载中"
    });
    //奖品item设置
    var _this = this;
      var photodata = {
        data: "小黑盒抽奖"
      };
      var res1 = await GetPrizes(photodata);
      _this.setData({ imageAward: res1.data });
      var countdata = {
        data:"小黑盒抽奖"
      };
      var res2 = await CanPlayRoulette(countdata);
      _this.setData({
        lcount: res2.data.limitVisitCount,
        timeLimit: res2.data.TimeLimit
      });
      _this.initPrize();
      wx.hideLoading();
      _this.setData({ pagehidden: false });
  },
  onLoad: function (option) {
    if (option.invitationID) {
      let invitationID = option.invitationID;
      let originalOpenid = option.openid
      common.commonVisitRecord(invitationID, originalOpenid)
    }
  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "小黑盒抽奖");
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "小黑盒抽奖");
  },
  onShareAppMessage:function(res){
    let openid = wx.getStorageSync('openid')
    let invitationID = common.uuid()
    let token = wx.getStorageSync('token')
    var nickname;
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        nickname = res.userInfo.nickName
        common.commonShare('小黑盒分享', nickname, openid, '', invitationID, 'pages/activity/play/play')
      },
      fail: function (err) {
        console.log(err)
        common.commonShare('小黑盒分享', nickname, openid, '', invitationID, 'pages/activity/play/play')
      }
    })
    return {
      title: '邀您马上参与小黑盒专属抽奖',
      path: 'pages/activity/play/play?openid=' + openid  + '&invitationID=' + invitationID,
      imageUrl: 'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/6c28c81affd243da8386c049d17316e8',
      success: function (res) { },
      fail: function (res) { }
    }
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
    //间距,怎么顺眼怎么设置吧,左上角顶点位置
    var topAward = 10;
    var leftAward = 10;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 10;
        leftAward = 10;
      } else if (j < 3) {
        topAward = topAward;
        //176是小正方形的长，6是水平间隙
        leftAward = leftAward + 176 + 6;
      } else if (j < 5) {
        leftAward = leftAward;
        //176是小正方形的高，6是竖直间隙
        topAward = topAward + 176 + 6;
      } else if (j < 7) {
        //水平
        leftAward = leftAward - 176 - 6;
        topAward = topAward;
      } else if (j < 8) {
        //竖直
        leftAward = leftAward;
        topAward = topAward - 176 - 6;
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
        data: "小黑盒抽奖"
      };
      getBlackBox(prizedata)
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
              // lcount: res.data.Data.F_VisitCount,
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
          _this.updateMes();
        })
        .catch(res => {
          console.log(res);
        });
  },
  //抽奖后更新数据
  updateMes: async function() {
    this.setData({
      update: false
    });
    wx.showLoading({
      title: "加载中"
    });
    var countdata = {
      data: "小黑盒抽奖"
    };
    var res1 = await CanPlayRoulette(countdata);
    debugger;
    this.setData({
      lcount: res1.data.limitVisitCount,
      timeLimit: res1.data.TimeLimit,
      update: true
    });
    wx.hideLoading()
    this.setData({ beanRuleCount: res2.data.F_VanBeanNum });
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
    } else if (!this.data.timeLimit){
      wx.showModal({
        title: "提示",
        content: "活动已结束",
        showCancel: false, //去掉取消按钮
      });
    }
    debugger;
    if (
      this.data.isRunning ||
      this.data.lcount <= 0 ||
      !this.data.timeLimit||
      !this.data.update
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
      if (_this.data.chooseIndex == -1){
        clearInterval(timerwait);
        _this.setData({
          indexSelect:-1
        })
      }else if (_this.data.indexSelect == _this.data.chooseIndex && i > 8) {
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
              isRunning: false
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
