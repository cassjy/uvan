var api = require("../../utils/API/request.js");
var common = require("../../utils/common.js");
var phone; //定义一个全局的phone变量
var clearTime; //清空计时器
var count = 15; //一页十条
var page = 1; //当前页
var sortData;
var fromNan;

var stayTime_JY = 0; //停留时间
var stayTimer_JY; //定时器

const app = getApp();

import {
  oldcustomergetvanbean,
  productlist2,
  getvanbeanpayorder,
  getmyvanbeannum
} from "../../utils/API/beanShopping/api.js";
import { GetWxOpenId } from "../../utils/API/activity/activity.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: [
      {
        url: "https://uvpt.uvanart.com/upload/static/beanShop/laokehu.png",
        height: "0"
      },
      {
        url: "https://uvpt.uvanart.com/upload/static/beanShop/bean.jpg",
        height: "0"
      }
    ],
    height: "",
    hadClickBean: false, //防止用户点击领取老顾客梵豆多次触发
    state: false,
    hiddenScroll: false,
    beanNum: "", //梵豆数量
    avatarUrl: "", //用户头像
    notLogin: "", //用户未登录
    hiddenShadow: true,
    showTips: true,
    animationData: "",
    hiddenTips: false,
    tipsText: "",
    goodsList: [], //商品列表
    forRecordList: "", //兑换记录
    pageNum: "", //计算出后台返回的商品数量每页10条的页数
    loadingMore: true, //加载动画
    forRecordNull: false,
    goodsNull: false,
    userInfo: "",
    navNum: 1,
    checkUp: false, //价格排序高到低
    checkDowm: true, //价格排序低到高
    checkUp1: false, //上新
    checkDowm1: true, //上新
    scrollTop: false,
    lastScrollTop: true,
    screenHeight: "", //手机屏幕高度
    screenHeightBF: "",
    top: "" ,//nav块距离顶部的高度,
    isComplete: false, //是否完成资料填写
    goodsLoading: false
  },

  // 点击轮播图事件
  clickImg: function(e) {
    console.log(e);
    if (e.currentTarget.dataset.id == 0) {
      if (!!phone) {
        this.receiveBean();
      } else {
        this.setData({
          //显示提示块
          hiddenTips: true,
          tipsText: "亲，请先登录了再领取哦"
        });
        clearTimeout(clearTime);
        this.anmationPublic();
      }
    } else if (e.currentTarget.dataset.id == 1) {
      this.ToSignPage();
    }
    return;
  },


  // 转盘
  uncultivated: function() {
    if (!!phone) {
      wx.navigateTo({
        url: "/pages/brand/play/play"
      });
    } else {
      wx.showToast({
        title: "亲，请先登录了再抽奖哦",
        icon:'none'
      });
    }
  },

  // 商品列表导航栏
  navChoose: function(e) {
    var _this = this;
    page = 1;
    // fromNan = true;
    wx.showLoading({
      title: "加载中..."
    });
    // 隐藏底部的tips提示
    this.setData({
      showTips: true
    });
    switch (e.currentTarget.dataset.id) {
      case "1":
        this.setData({
          navNum: 1,
          goodsList: [],
          checkUp: false,
          checkDowm: true,
          checkUp1: false,
          checkDowm1: true
        });
        sortData = null;
        this.loadGoods(sortData);
        break;
      case "2":
        this.setData({
          navNum: 2,
          goodsList: [],
          checkUp: !this.data.checkUp,
          checkDowm: !this.data.checkUp,
          checkUp1: false,
          checkDowm1: true
        });
        if (this.data.checkUp) {
          var upDowm = "ASC";
        } else {
          var upDowm = "DESC";
        }
        sortData = { Field: "F_Price", Direction: upDowm };
        this.loadGoods(sortData);
        break;
      case "3":
        this.setData({
          navNum: 3,
          goodsList: [],
          checkUp1: !this.data.checkUp1,
          checkDowm1: !this.data.checkUp1,
          checkUp: false,
          checkDowm: true
        });
        sortData = { Field: "F_ShelfTime", Direction: "ASC" };
        this.loadGoods(sortData);
        break;
      case "4":
        this.setData({
          navNum: 4,
          checkUp: false,
          checkDowm: true,
          checkUp1: false,
          checkDowm1: true
        });
        wx.hideLoading();
        sortData = null;
        wx.showToast({
          title: "功能正在开发中"
        });
        break;
    }
  },

  //点击梵豆说明
  openBeanTips: function() {
    wx.showModal({
      showCancel: false,
      title: "优梵艺术提醒您！",
      content:
        "梵豆是用户在优梵艺术旗舰店或梵店小程序（优梵艺术l梵店）购物等相关活动情况给予的优惠，梵豆仅可在梵店小程序使用，如用户帐号暂停使用，则优梵艺术将取消该用户帐号内梵豆相关使用权益。"
    });
  },

  //  点击马上登录
  TologinPage: function() {
    if (this.data.notLogin) {
      //未登录
      wx.navigateTo({
        url: "../me/twicelogin/twicelogin"
      });
      wx.setStorageSync("formWhere", "formBean");
    } else {
      //已登录
      console.log("已经登录了");
      return;
    }
  },

  // 点击每日签到
  ToSignPage: function() {
    var _this = this;
    if (!!phone) {
      wx.navigateTo({
        url: "../me/sign/sign"
      });
    } else {
      wx.showToast({
        title: "亲，请先登录了再签到哦",
        icon: 'none'
      });
      // this.setData({
      //   //显示提示块
      //   hiddenTips: true,
      //   tipsText: "亲，请先登录了再签到喔"
      // });
      clearTimeout(clearTime);
      this.anmationPublic();
    }
  },

  // 点击注册梵星
  openRegister: function() {
    var _this = this;
    if (!!phone) {
      this.setData({
        hiddenTips: true,
        tipsText: "亲，您已经是梵星啦！"
      });
      clearTimeout(clearTime);
      this.anmationPublic();
    } else {
      wx.navigateTo({
        url: "../me/twicelogin/twicelogin"
      });
      wx.setStorageSync("formWhere", "formBean");
    }
  },

  // 打开梵豆明细
  TobeanDetailed: function() {
    var _this = this;
    if (!!phone) {
      wx.navigateTo({
        url: "beanDetailed/beanDetailed"
      });
    } else {
      wx.showToast({
        title: "亲，请先登录梵星再查看梵豆明细",
        icon: 'none'
      });
      // this.setData({
      //   hiddenTips: true,
      //   tipsText: "亲，请先登录梵星再查看梵豆明细"
      // });
      clearTimeout(clearTime);
      this.anmationPublic();
    }
  },

  // 点击幸福转盘
  TozhuanpanPage: function() {
    var _this = this;
    if (!!phone) {
      wx.navigateTo({
        url: "/pages/brand/play/play"
      });
      wx.showToast({
        title: "敬请期待！"
      });
    } else {
      this.setData({
        hiddenTips: true,
        tipsText: "亲，请先登录梵星再玩幸福转盘"
      });
      clearTimeout(clearTime);
      this.anmationPublic();
    }
  },

  // 点击完善资料页
  ToPersonalPage: function() {
    var _this = this;
    if (!!phone) {
      wx.navigateTo({
        url: "../me/personalData/personalData"
      });
    } else {
      this.setData({
        hiddenTips: true,
        tipsText: "亲，请先登录梵星再完善资料吧！"
      });
      clearTimeout(clearTime);
      this.anmationPublic();
    }
  },

  // 打开梵豆兑换规则
  openRule: function() {
    console.log(1);
    let height = wx.getSystemInfoSync().windowHeight + "px";
    console.log(height);
    this.setData({
      hiddenShadow: false,
      hiddenScroll: true,
      height: height,
      screenHeight: height
    });
  },

  //  打开商品详情页
  ToGoodsDetial: function(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url:
        "../categories/detail/detail?index=" +
        e.currentTarget.dataset.id +
        "&catename=" +
        e.currentTarget.dataset.catename
    });
  },

  // 动画公用方法
  anmationPublic: function() {
    var _this = this;
    let animation = wx.createAnimation({
      //弹框动画执行
      duration: 1000,
      timingFunction: "ease-in"
    });
    animation.opacity(1).step();
    this.setData({
      animationData: animation.export()
    });
    clearTime = setTimeout(function() {
      animation.opacity(0).step();
      _this.setData({
        animationData: animation.export(),
        hiddenTips: false
      });
    }, 3000);
  },
  // 关闭弹框
  cancel: function() {
    this.setData({
      hiddenShadow: true,
      screenHeight: this.data.screenHeightBF,
      height: ""
    });
  },

  // 隐藏底部的提示
  hiddenTips: function() {
    this.setData({
      showTips: true
    });
  },

  bindGetUserInfo: function(e) {
    console.log("...................yonghu.................");
    console.log(e.detail.userInfo);
    this.setData({ userInfo: e.detail.userInfo.nickName });
  },
  // 商品加载公用方法
  loadGoods: function(sortData,loadMark) {
    var _this = this;
    console.log(page);
    console.log(this.data.pageNum);
    if (loadMark !='noloading'){
     wx.showLoading({
       title: '加载中...',
       icon: 'none'
     })
    }
    var data = {
      data: {
        page: page,
        limit: count,
        productcategory: "",
        productstyle: "",
        keywords: "梵豆",
        sortParameter: sortData
      }
    };
    productlist2(data)
      .then(res => {
        console.log("...................商品列表.................");
        console.log(res);
        this.setData({
          loading: false
        });
        if (res.code == 400 || res.data === null) {
          _this.setData({
            goodsNull: true
          });
        }
        var listData = _this.data.goodsList;
        for (let i = 0; i < res.data.Data.length; i++) {
          listData.push(res.data.Data[i]);
        }
        _this.setData({
          goodsList: listData,
          pageNum: Math.ceil(res.data.Total / count)
        });
        console.log(_this.data.goodsList);
        // 只有一页商品
        if (_this.data.pageNum == 1 || _this.data.pageNum == page) {
          _this.setData({
            showTips: false
          });
        } else {
          _this.setData({
            showTips: true
          });
        }
        // if (page == _this.data.pageNum - 1) {
        //   _this.setData({
        //     loadingMore: true
        //   })
        // }
      })
      .catch(res => {
        console.log(res);
      })
      .then(() => {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        _this.setData({
          goodsLoading:false
        })
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.openid) {
      //公共分享的访问记录
      let invitationID = options.invitationID;
      let originalOpenid = options.openid;
      common.commonVisitRecord(invitationID, originalOpenid);
    }

    var _this = this;
    // 获取nav节点距离顶部的高度
    wx.createSelectorQuery()
      .select("#nav")
      .boundingClientRect(function(rect) {
        console.log(rect);
        _this.setData({
          top: rect.top
        });
      })
      .exec();
    // 获取用户手机屏幕的大小
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        _this.setData({
          screenHeight: res.screenHeight * 2 + "rpx",
          screenHeightBF: res.screenHeight * 2 + "rpx"
        });
      }
    });
    console.log("屏幕高度");
    console.log(_this.data.screenHeight);
    page = 1;
    wx.showLoading({
      title: "加载中..."
    });
    this.setData({
      goodsLoading: true
    })
    //  获取商品列表
    sortData = null;
    this.loadGoods(sortData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //开始计时（停留时间）
    stayTime_JY = 0; //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++;
    }, 1000);

    var _this = this;

    // 获取兑换记录
    getvanbeanpayorder()
      .then(res => {
        console.log("....................兑换记录..................");
        console.log(res);
        console.log(res.data);
        if (res.code == 400) {
          console.log("NULL");
          _this.setData({
            forRecordNull: true
          });
        }
        _this.setData({
          forRecordList: res.data
        });
        console.log(_this.data.forRecord);
      })
      .catch(res => {
        console.log(res);
      });

    // 获取缓存的用户头像
    let headPortrait = wx.getStorageSync("headPortrait");
    // 判断用户是否登录
    phone = wx.getStorageSync("phone");
    console.log(phone);
    if (!!phone) {
      this.setData({
        notLogin: false
      });
      // 获取用户微信头像
      wx.getUserInfo({
        withCredentials: false,
        lang: "zh_CN",
        complete: function(res) {
          console.log(res)
          headPortrait != ""? _this.setData({ avatarUrl: headPortrait }): res.errMsg == "getUserInfo:ok"? _this.setData({ avatarUrl: res.userInfo.avatarUrl }): _this.setData({ avatarUrl: "" });
          res.errMsg == "getUserInfo:ok"
            ? _this.setData({ userInfo: res.userInfo.nickName })
            : _this.setData({ userInfo: "" });
        }
      });
      // 获取梵豆数量
      if (app.globalData.beanShoppingLoading){
        wx.showLoading({
          title: '加载中...',
          icon: 'none'
        })
      }else{
        app.globalData.beanShoppingLoading = true
      }
      this.requireBeanNumber();
    } else {
      this.setData({
        notLogin: true
      });
      console.log(this.data.notLogin);
      // wx.showToast({
      //   title: '还没登录',
      // })
    }
  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "梵豆商城");
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "梵豆商城");
  },
  // 获取梵豆数量
  requireBeanNumber: function() {
    var _this = this;
    var data = {};
    getmyvanbeannum(data).then(res => {
      console.log("...............梵豆数量..............");
      console.log(res);
      if (res.code == 200) {
        _this.setData({
          beanNum: res.data.Data,
          isComplete: res.data.IsCompletePersonalInfo  //是否完成资料填写
        });
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
      wx.hideLoading()
    });
  },

  // 上拉加载
  onReachBottom: function() {},

  //获取向上的滚动位置，向上只触发一次
  scrolltoupper: function(e) {
    console.log(e);
    this.setData({
      scrollTop: false
    });
  },
  // 实时获取scroll滚动的位置
  scroll: function(e) {
    // console.log(e.detail.scrollTop)
    if (e.detail.scrollTop >= this.data.top) {
      if (this.data.scrollTop == this.data.lastScrollTop) {
        return;
      } else {
        this.setData({
          scrollTop: true,
          lastScrollTop: true
        });
      }
    } else {
      return;
    }
  },
  // 滚动条距离底部20px触发加载更多
  loadMore: function(e) {
    console.log("触发下拉加载");
    console.log(page);
    this.setData({
      loading: true
    });
    console.log(this.data.pageNum);
    var _this = this;
    if (page == this.data.pageNum) {
      this.setData({
        showTips: false,
        loadingMore: true
      });
      wx.showToast({
        title: "到底了"
      });
      this.setData({
        loading: false
      });
      return;
    } else if (page < this.data.pageNum) {
      page++;
      this.setData({
        showTips: true,
        loadingMore: false
      });
      // wx.showLoading({
      //   title: '加载中...',
      // })
      // debugger
      if (page == this.data.pageNum - 1) {
        this.setData({
          loadingMore: true
        });
      } else {
        this.setData({
          loadingMore: false
        });
      }
      wx.showNavigationBarLoading();
      // 执行获取商品列表接口
      this.loadGoods(sortData,'noloading');
    } else {
      wx.showToast({
        title: "到底了"
      });
      this.setData({
        loading: false
      });
      return;
    }
  },

  onPageScroll: function(e) {},
  

  //分享记录
  onShareAppMessage: function(res) {
    let nickname = wx.getStorageSync("userName") || " ";
    let openid = wx.getStorageSync("openid");
    let invitationID = common.uuid();
    if (res.from === "menu") {
      //缓存没有openid的话就用接口取
      if (openid == "") {
        GetWxOpenId().then(res => {
          openid = res.data.data;
          //用户未授权的话，nickName传空格字符串
          wx.getUserInfo({
            success: function(res) {
              console.log(res);
              nickname = res.userInfo.nickName;
              common.commonShare(
                "梵豆商城",
                nickname,
                openid,
                "",
                invitationID,
                ""
              );
            },
            fail: function(err) {
              console.log(err);
              common.commonShare(
                "梵豆商城",
                nickname,
                openid,
                "",
                invitationID,
                ""
              );
            }
          });
        });
      } else {
        //用户未授权的话，nickName传空格字符串
        wx.getUserInfo({
          success: function(res) {
            console.log(res);
            nickname = res.userInfo.nickName;
            common.commonShare(
              "梵豆商城",
              nickname,
              openid,
              "",
              invitationID,
              ""
            );
          },
          fail: function(err) {
            console.log(err);
            common.commonShare(
              "梵豆商城",
              nickname,
              openid,
              "",
              invitationID,
              ""
            );
          }
        });
      }
    }
    return {
      title: "梵豆商城",
      path:
        "/pages/beanShopping/beanShopping?openid=" +
        openid +
        "&invitationID=" +
        invitationID
    };
  }
});
