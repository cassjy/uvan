// pages/home/home.js
var api = require("../../utils/API/request.js")
var common = require("../../utils/common.js")
var mta = require('../../lib/js/mta_analysis.js') //小程序数据分析
import {
  GetBannersTop,
  GetShareRecord
} from '../../utils/API/home/api.js'
var inthrott = false; //节流 
var leftsize = 0;
var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageShow: false, //控制蒲公英、梵星页面切换
    hiddenActivity: false, //隐藏活动模块
    shadow: false, //阴影
    control: false, //控制活动模块的显隐
    animationData: '',
    animationControl: '',
    trunok: true, //防止用户疯狂点击
    imgUrlsNew: [ //头部轮播图
      "https://uvpt.uvanart.com/upload/static/home/banner/2.jpg",
      "https://uvpt.uvanart.com/upload/static/home/banner/3.jpg",
      // "https://uvpt.uvanart.com/upload/static/home/banner/2.jpg",
    ],
    newimgurl: [],
    hotimgurl: [],
    bedimgurl: [],
    num: 0,
    designerGroup: [
      "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/tE91NkMcQSit8Yy9Krc0UgAAAT1wZDIE",
      "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/FGexFKvZQGCOClxlgRGR9QAAAT1wZDIE",
      "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/MJ_OzI0KQOadL9lN7_1S6gAAAT1wZDIE",
      "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/33s-EMR1S3yK5-uEcQfajwAAAT1wZDIE",
      "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/XoEpPJSGTjiKG0Z0G8iazgAAAT1wZDIE"
    ],
    navList: ["关于优梵", " 设计", " 供应链", " 品控", " 性价比", " 设计服务", " 艺术生活馆"],
    toView: '', //楼层号
    screenHeight: '',
    scrollTop: false, //是否显示fixnav
    top: '', //nav块距离顶部的高度
    navChoose: 0, //导航选中
    leftNavNum: 0,
    showAllNav: false, //显示快速导航全图
  },
  // to全屋购
  toQuanwugou(){
    wx.navigateTo({
      url: 'quanwugou/quanwugou',
    })
  },
 
  // 隐藏活动模块
  closeActivity: function() {
    // var _this = this;
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    let animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.translateX(300).scale(0.1).opacity(0).step();
    animation2.translateX(-54).opacity(1).step();
    this.setData({
      animationData: animation.export(),
      animationControl: animation2.export(),
      shadow: true
    })
  },

  // 控制活动模块显隐
  control: function() {
    var _this = this;
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    let animation2 = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })
    animation.translateX(0).scale(1).opacity(1).step();
    animation2.translateX(54).opacity(0).step();
    this.setData({
      animationData: animation.export(),
      animationControl: animation2.export(),
      shadow: false
    })
  },

  // 点击活动立即查看
  ToGuangzhouPage: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.id == 0) {
      this.closeActivity();
      wx.navigateTo({
        url: 'guangzhouShop/guangzhouShop',
      })
    } else if (e.currentTarget.dataset.id == 1) {
      wx.navigateTo({
        url: '../me/logOut/logOut',
      })
    } else if (e.currentTarget.dataset.id == 2) {
      try {
        let sessionid = wx.getStorageSync('sessionid')
        if (!sessionid) {
          wx.showModal({
            title: '未登录',
            content: '亲，你还未登录哦，请点击梵星进行登录',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../me/twicelogin/twicelogin'
                })
              } else if (res.cancel) {}
            }
          })
          wx.setStorageSync('formWhere', 'formHome')
        } else {
          wx.navigateTo({
            url: 'answer/answer',
          })
        }
      } catch (e) {
        console.log(e)
      }

    } else {
      return;
    }
  },
  //固定导航轮播
  //获取向上的滚动位置，向上只触发一次
  scrolltoupper: function(e) {
    this.setData({
      scrollTop: false
    })
  },
  scrolltolower: function(e) {
    console.log("到底了--------------");
    this.setData({
      leftNavNum: 400,
      navChoose: 6,
    })
  },
  // 实时获取scroll滚动的位置
  scroll: function(e) {
    var _this = this;
    _this.throttling(function() {
      if (e.detail.scrollTop == 0) return;
      var toppx = e.detail.scrollTop;
      var _id;
      console.log("==-----------" + e.detail.scrollTop)
      if (toppx >= Math.floor(_this.data.floor[0])) {
        _this.setData({
          scrollTop: true
        })
      }
      if (toppx < Math.floor(_this.data.floor[0])) {
        _this.setData({
          scrollTop: false
        });
        _id = 1;
      } else if (toppx >= 0 && toppx < Math.floor(_this.data.floor[1])) {
        _id = 1;
      } else if (toppx >= Math.floor(_this.data.floor[1]) && toppx < Math.floor(_this.data.floor[2])) {
        _id = 2;
      } else if (toppx >= Math.floor(_this.data.floor[2]) && toppx < Math.floor(_this.data.floor[3])) {
        _id = 3;
      } else if (toppx >= Math.floor(_this.data.floor[3]) && toppx < Math.floor(_this.data.floor[4])) {
        _id = 4;
      } else if (toppx >= Math.floor(_this.data.floor[4]) && toppx < Math.floor(_this.data.floor[5])) {
        _id = 5;
      } else if (toppx >= Math.floor(_this.data.floor[5]) && toppx < Math.floor(_this.data.floor[6])) {
        _id = 6;
      } else if (toppx >= Math.floor(_this.data.floor[6])) {
        _id = 7;
      }

      _this.ToFloor(_id, "noskip");
    }, 200)()
  },

  //函数节流
  throttling: function(func, delay) {
    var timer; //保证最后一次执行 
    return function() {
      var self = this;
      var args = arguments; //保留上下文 
      if (!inthrott) { //判断上一次是否执行完毕 
        func.apply(self, args);
        inthrott = true;
        setTimeout(function() {
          inthrott = false;
        }, delay);
      } else {
        console.log("清除计时器~~~~~~~~~~~~~~~~~");
        clearTimeout(timer);
        timer = setTimeout(function() {
          func.apply(self, args);
          inthrott = false;
        }, 0); //此处500可以进行加快,主要是希望能够尽快的执行最后一次 
      }
    }
  },

  //锚点跳转
  scrollToViewFn: function(e) {
    var _id = parseInt(e.target.dataset.id) + 1;
    var typename = e.target.dataset.typename;
    if (typename == "navList") {
      this.setData({
        showAllNav: false
      })
    }
    this.ToFloor(_id, "skip");
  },
  //公用去到对应楼层
  ToFloor: function(_id, name) {
    var _this = this;
    var leftNavNum;
    switch (_id) {
      case 3:
        leftNavNum = 40
        break;
      case 4:
        leftNavNum = 120
        break;
      case 5:
        leftNavNum = 200
        break;
      case 6:
        leftNavNum = 350
        break;
      case 7:
        leftNavNum = 380
        break;
      default:
        leftNavNum = 0
    }
    console.log(leftNavNum + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    if (name === "skip") {
      this.setData({
        toView: 'to' + _id
      })
    }

    if (leftsize == leftNavNum) {
      _this.setData({
        navChoose: _id - 1,
      })
    } else {
      leftsize = leftNavNum;
      _this.setData({
        leftNavNum: leftNavNum,
        navChoose: _id - 1,
      })
    }
  },
  //设计师轮播
  cutPage: function(e) {
    this.setData({
      num: e.detail.current
    })
  },
  //关于优梵
  openBrandPage: function() {
    wx.navigateTo({
      url: './aboutuv/aboutuv',
    })
  },
  showNavList: function() {
    this.setData({
      showAllNav: true
    })
  },
  hideNavList: function() {
    this.setData({
      showAllNav: false
    })
  },
  //点击商品分类跳转到对应的商品类别
  openStyleList: function(e) {
    wx.navigateTo({
      url: '../shoppe/styleList/styleList?index=' + e.currentTarget.dataset.id,
    })
  },

  onLaunch: function (options) {
    mta.App.init({
      "appID": "500660066",
      "lauchOpts": options,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    mta.Page.init() //初始化
    if (options.openid) {
      //公共分享的访问记录
      let invitationID = options.invitationID
      let originalOpenid = options.openid
      common.commonVisitRecord(invitationID, originalOpenid)
    }
    var phone = wx.getStorageSync('phone');
    console.log(phone)
    if (!phone) {
      console.log('用户未登录')
      this.setData({
        pageShow: false,
        scrollTop: false
      })
    } else {
      console.log('用户已登录')
      var characterType = wx.getStorageSync('characterType')
      if (characterType == '蒲公英') {
        this.setData({
          pageShow: true
        })
        // 获取nav节点距离顶部的高度
        var _this = this;
        wx.createSelectorQuery().select('#nav').boundingClientRect(function(rect) {
          _this.setData({
            top: rect.top
          })
        }).exec()
        var arrPageLink = ["#to1", "#to2", "#to3", "#to4", "#to5", "#to6", "#to7"];
        arrPageLink.forEach(function(item, index, arr) {
          wx.createSelectorQuery().select(item).boundingClientRect(function(rect) {
            var floor = "floor[" + index + "]";
            _this.setData({
              [floor]: rect.top
            })
          }).exec()
        })
      }
    }

    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: (res.screenHeight) * 2 + "rpx",
        })
      }
    })
    this.onloadswiper()
    this.onloadNew()
    this.onloadHot()
    this.onloadBed()
    var _this = this
   
  },

  onReady: function() {},

 
  onShow: function() {
    console.log(this.data.trunok)
    this.setData({
      trunok: true
    })
    //开始计时（停留时间）
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
  },

  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "首页")
  },

 
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "首页")
  },

  physicalStore: function() {
    if (this.data.trunok) {
      var _this = this
      _this.setData({
        trunok: false
      })
      wx.navigateTo({
        url: '../physicalStore/physicalStore'
      })
    }
  },
 
  //做生活的艺术家页面跳转
  artRun: function(event) {
    if (this.data.trunok) {
      var _this = this
      _this.setData({
        trunok: false
      })
      wx.navigateTo({
        url: 'knowYF/lifeArtist/lifeArtist'
      })
    }
  },
  //3D设计和物流是公用一个页面的
  toBrandServise: function(event) {
    if (this.data.trunok) {
      var _this = this
      _this.setData({
        trunok: false
      })
      wx.navigateTo({
        url: 'brandservice/brandservice?id=' + event.currentTarget.dataset.id
      })
    }
  },
  /*去前后空格*/
  trim: function(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },

  /*=====2018-04-12改版JS=====*/
  // 走进优梵艺术的去到详情页
  tab1(event) {
    if (this.data.trunok) {
      var _this = this
      _this.setData({
        trunok: false
      })
      wx.navigateTo({
        url: 'knowYF/Consultation/Consultation?id=' + event.currentTarget.dataset.tab
      })
    }
  },
 

  //头部轮播图页面跳转
  Topage(e) {
    let url = e.currentTarget.dataset.url
    let tabUrls = ["home/home", "beanShopping/beanShopping", "explore/explore", "me/me?type=true", "me/me?type=false"]
    let isTabUrl = false
    for (let i = 0; i < tabUrls.length; i++) {
      if (url == tabUrls[i]) {
        isTabUrl = true
      }
    }
    if (isTabUrl == true) {
      wx.switchTab({
        url: '/pages/' + url
      })
    } else {
      wx.navigateTo({
        url: '../' + url
      })
    }
  },
 
  //广州店
  guangzhou() {
    wx.navigateTo({
      url: './guangzhoustore/guangzhoustore'
    })
  },
  // 快速导航的指向
  tocate(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../categories/categories?pID=" + id
    })
  },
  

  // 了解我们
  learnAbout() {
    this.setData({
      pageShow: true
    })
    // 获取nav节点距离顶部的高度
    var _this = this;
    wx.createSelectorQuery().select('#nav').boundingClientRect(function(rect) {
      _this.setData({
        top: rect.top
      })
    }).exec()
    var arrPageLink = ["#to1", "#to2", "#to3", "#to4", "#to5", "#to6", "#to7"];
    arrPageLink.forEach(function(item, index, arr) {
      wx.createSelectorQuery().select(item).boundingClientRect(function(rect) {
        var floor = "floor[" + index + "]";
        _this.setData({
          [floor]: rect.top
        })
      }).exec()
    })
  },
  // 进入商城
  enterShop() {
    this.setData({
      pageShow: false,
      scrollTop: false
    })
  },
  // 实体店
  toPhysicalStore() {
    wx.navigateTo({
      url: '../physicalStore/physicalStore',
    })
  },

  // 梵豆商城
  toBeanShop() {
    wx.switchTab({
      url: '../beanShopping/beanShopping',
    })
  },
  // 签到页面
  toSignIn() {
    let phone = wx.getStorageSync('phone')
    if (!phone) {
      wx.showModal({
        title: '未登录',
        content: '亲，你还未登录哦，请点击梵星进行登录',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../me/twicelogin/twicelogin'
            })
          } else if (res.cancel) {}
        }
      })
      wx.setStorageSync('formWhere', 'formHome')
    } else {
      wx.navigateTo({
        url: '../me/sign/sign',
      })
    }
  },
  //客厅
  toNewlist() {
    wx.navigateTo({
      url: "../categories/categories?pID=0136db50-9356-4aba-8494-27a349f5d312" + "&pName=布/皮艺沙发"
    })
  },
  //卧室
  toHotlist() {
    wx.navigateTo({
      url: "../categories/categories?pID=58b21c32-c6f8-4f54-bee1-43b6cdd1b207" + "&pName=实木床"
    })
  },
  //餐厅
  toFanDouShop() {
    wx.navigateTo({
      url: "../categories/categories?pID=231dc2d9-93a4-46f6-a6d3-1b4f490a850b" + "&pName=组合"
    })
  },
  //风格总览
  tostyleOverview() {
    wx.navigateTo({
      url: "./styleOverview/styleOverview"
    })
  },
  //软装服务
  tosoftService() {
    wx.navigateTo({
      url: "./softService/softService"
    })
  },
  //酷家乐H5
  open3DPage: function(e) {
    console.log(e)
    switch (e.currentTarget.dataset.id) {
      case '0':
        wx.navigateTo({
          url: './3Ddesign/page1/page1',
        })
        break;
      case '1':
        wx.navigateTo({
          url: './3Ddesign/page2/page2',
        })
        break;
      case '2':
        wx.navigateTo({
          url: './3Ddesign/page3/page3',
        })
        break;
      case '3':
        wx.navigateTo({
          url: './3Ddesign/page4/page4',
        })
        break;
      default:
      
        break;
    }
   

  },
  //优梵实验室
  toLaboratory: function() {
    wx.navigateTo({
      url: 'knowYF/Laboratory/Laboratory',
    })
  },

  //设计师
  toDesign: function() {
    wx.navigateTo({
      url: 'knowYF/Designer/Designer',
    })
  },
  //质量控制
  toQuanity: function() {
    wx.navigateTo({
      url: 'knowYF/Quality/Quality',
    })
  },
  //制造工厂
  toFactory: function() {
    wx.navigateTo({
      url: 'knowYF/Factory/Factory',
    })
  },
  //后台加载配置的图片
  onloadswiper() {
    let data = {
      "data": "顶部轮播图"
    }
    GetBannersTop(data)
      .then(res => {
        this.setData({
          imgUrlsNew: res.data.Data
        })
      })
  },
  onloadNew() {
    let data = {
      "data": "客厅"
    }
    GetBannersTop(data)
      .then(res => {
        this.setData({
          newimgurl: res.data.Data
        })
      })
  },
  onloadHot() {
    let data = {
      "data": "卧室"
    }
    GetBannersTop(data)
      .then(res => {
        this.setData({
          hotimgurl: res.data.Data
        })
      })
  },
  onloadBed() {
    let data = {
      "data": "餐厅"
    }
    GetBannersTop(data)
      .then(res => {
        this.setData({
          bedimgurl: res.data.Data
        })
      })
  },
  //跳转到商品详情
  toproductdetail(e) {
    let productid = e.currentTarget.dataset.id
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      // url: "../categories/detail/detail?index="+productid
      url: "../" + url
    })
  },
 

  //分享记录
  onShareAppMessage: function(res) {
    let nickname = wx.getStorageSync('userName') || " "
    let openid = wx.getStorageSync('openid')
    let invitationID = common.uuid()
    console.log(res.from)
    if (res.from === 'menu') {
      //缓存没有openid的话就用接口取
      if (openid == '') {

        api.wxlogin()
          .then(res => {
            let openiddata = {
              data: JSON.stringify({
                "fromtype": "fandianvip",
                "code": res
              })
            }
            return GetShareRecord(openiddata);
          })
          .then(res => {
            openid = JSON.parse(res.info).openid;
            //用户未授权的话，nickName传空格字符串
            wx.getUserInfo({
              success: function(res) {
                console.log(res)
                nickname = res.userInfo.nickName
                common.commonShare('优梵艺术|梵店', nickname, openid, '', invitationID, '')
              },
              fail: function(err) {
                console.log(err)
                common.commonShare('优梵艺术|梵店', nickname, openid, '', invitationID, '')
              }
            })
          })
      } else {
        //用户未授权的话，nickName传空格字符串
        wx.getUserInfo({
          success: function(res) {
            console.log(res)
            nickname = res.userInfo.nickName
            common.commonShare('优梵艺术|梵店', nickname, openid, '', invitationID, '')
          },
          fail: function(err) {
            console.log(err)
            common.commonShare('优梵艺术|梵店', nickname, openid, '', invitationID, '')
          }
        })
      }
    }
    return {
      title: '优梵艺术|梵店',
      path: '/pages/home/home?openid=' + openid + '&invitationID=' + invitationID
    }
  }
})