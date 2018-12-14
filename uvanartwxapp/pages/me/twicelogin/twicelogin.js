// pages/mine/twicelogin/twicelogin.js
//index.js
//初始onReady 获取openid         /lr/uvanapi/GetWxOpenId 
//手机登录和微信登录（快速登录）   /lr/adms/login3
//手机解密                       /lr/uvanapi/wxdecryptdata
// 用解密的手机号做常规登录       /lr/adms/login2

//主要存在的流程
//记录页面离开打点
//其他页面跳转登录页，再回去自己页面的跳转
//按钮快速点击
//登录页的页面入口，可能为扫码进来，所有初始openid需要再这里请求为准
//缓存到storage的信息

var common = require("../../../utils/common.js");
var api = require("../../../utils/API/request.js");
var skip = require("../../../utils/navigateTo.js");
const Url = require('../../../utils/API/url.js');
var util = require("../../../utils/util.js");
import regeneratorRuntime from '../../../utils/API/wxPromise.min.js'
import {
  checktoken,
  getpersonaldata,
  login,
  UvanStarChangePhone,
  sendverifycode,
  uvanstarlogin2,
  uvanstarlogin3,
  wxdecryptdata,
  upgradeinfo
} from "../../../utils/API/me/api.js"

const app = getApp()
var openid, phone;
var enablePhone = true;
var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
var performNum = 0; //微信登录接口执行失败重新执行次数
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    item: {
      name: 'true',
      checked: 'true'
    },
    readStatus: true,
    weixinbtn: false,
    onOff: false,
    hiddenmodalput: true,
    newPhone: '18676501387',
    getcodetext: '获取验证码',
    vcodeTip: '',
    vcode: '',
    inputCode: '',
    loginNum: 0,
    phoneStatus: '',
    confirmStatus: true,
    canlogin: true,
    toAuthorization: false, //判断用户是否授权（默认未授权）
    loginCode: '', //微信login接口返回的code
    mytoken: '',
    myopneid: '',
    myphone: '',
    mycharacterType: '',
    myPrivilege: '',
    userInfo: '', //用户微信信息
  },
  onLoad: function(options) {
    console.log("onload~~~~~~~~~~~");
    var _this = this;
    wx.getUserInfo({
      withCredentials: false,
      lang: 'zh_CN',
      complete: function(res) {
        // 判断用户是否授权
        console.log(res)
        if (res.errMsg == "getUserInfo:ok") {
          console.log('用户已授权')
          _this.setData({
            toAuthorization: false,
            userInfo: res.userInfo
          })
        } else {
          console.log('用户未授权')
          _this.setData({
            toAuthorization: true
          })
        }
      }
    })

    //执行微信登录接口
    this.loading = this.selectComponent("#loading");
    this.loading.showToast();
    this.wxLoginPublicMethod()
  },
  //  获取微信code
  requireWxCode: function() {
    var that = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: function(res) {
          resolve(res.code);
        },
        fail: function(res) {
          reject(res);
        },
        complete: function(res) {
          // that.loading.hideToast();
        }
      })
    })
  },

  wxLoginPublicMethod: async function() {
    let code = await this.requireWxCode(); //获取微信code
    await this.loginAPI(code);
  },


  onReady: function() {
    // console.log("onReady~~~~~~~~~~~");
    // //onReady在onshow方法之后，初次加载的时候，不知道app.js中的openid是否已经存好（考虑之后会单独使用这个页面的情况），在这里统一再请求存储一遍
    var that = this;
    // api.wxlogin()
    //   .then(res => {
    //     var openiddata = { data: JSON.stringify({ "fromtype": "fandianvip", "code": res }) }
    //     return api.get(" /lr/uvanapi/GetWxOpenId", openiddata);
    //   })
    //   .then(res => {
    //    openid = JSON.parse(res.info).openid;
    //    var d= new Date()
    //    var date = util.formatTime(d);
    //    wx.reportAnalytics('quickloginenter', {
    //      entertime: date,
    //      open_id: openid,
    //    });
    //     return api.setStorage("openid", openid);
    //   })
    //   .then(res => {
    wx.login({
      success: function(res) {
        that.setData({
          "code": res.code
        });
      },
      complete: function(res) {
        // that.loading.hideToast();
      }
    })
    // })
    // .catch(res=>{
    //   that.loading.hideToast();
    // })
  },
  onShow: function(e) {
    console.log(e)
    console.log("onshow~~~~~~~~~~~");
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
    var that = this;
    api.getStorage("phone")
      .then(res => {
        that.setData({
          "weixinbtn": true
        });
      })
      .catch(res => {
        that.setData({
          "weixinbtn": false
        });
      })
  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "微信登录")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "微信登录")
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value.length == 1) {
      this.setData({
        "readStatus": true
      })
    } else {
      this.setData({
        "readStatus": false
      })
    }
  },

  // 获取授权信息
  bindGetUserInfo(res) {
    console.log(res)
    var _this = this
    this.setData({
      toAuthorization: false //打开微信登录按钮
    })
    if (res.detail.errMsg != "getUserInfo:ok") {
      console.log("用户不同意授权")

    } else {
      console.log('同意授权')
      _this.setData({
        userInfo: res.detail.userInfo
      })
      // this.updateUserInfo(res.detail.userInfo); //更新头像信息
      this.quicklogin(); //登录
    }
  },

  // 更新用户信息
  updateUserInfo: function(data) {
    let userData = {
      nickName: data.nickName,
      headerImage: data.avatarUrl
    }
    let header = 'application/json'
    upgradeinfo(userData, header).then(res => {
      console.log(res)
      if (res.data.code == 0) {
        console.log('更新用户信息成功')
      }
      // wx.hideLoading()
    })
  },
  showAgreement: function() {
    wx.showModal({
      title: '优梵登录',
      content: '亲，请您阅读并同意《用户服务协议》'
    })
  },
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
    // this.loading.hideToast();
  },
  //确认  
  confirm: function() {
    if (!this.data.confirmStatus) {
      return
    }
    var _this = this;
    if (this.data.loginNum > 2) {
      wx.showModal({
        title: '登录接口报错',
        content: '登录接口报错'
      })
      return;
    }
    if ((_this.data.inputCode == _this.data.vcode && _this.data.vcode != "") || (_this.data.inputCode == "111111" && Url.host == "https://wxapp.uvanart.com")) {
      _this.setData({
        vcodeTip: '',
        confirmStatus: false
      })
      if (_this.data.phoneStatus == 'new') {
        var p = {
          "token": '',
          "loginMark": _this.data.newPhone,
          "data": JSON.stringify({
            openid: openid,
            newphone: _this.data.newPhone
          })
        }
        UvanStarChangePhone(p)
          .then(res => {
            if (res.code == 200) {
              _this.comlogin2(_this.data.newPhone);
            } else {
              wx.showModal({
                title: '提示',
                content: res.info
              })
            }
          })
      } else {
        _this.comlogin2(_this.data.newPhone);
      }
      wx.setStorageSync('phone', _this.data.newPhone);
    } else {
      _this.setData({
        vcodeTip: '验证码不正确'
      })
    }
  },
  bindinputCode: function(event) {
    this.setData({
      inputCode: event.detail.value
    })
  },
  // 获取验证码
  getcode: function(event) {
    if (this.data.getcodetext == "重新发送" || this.data.getcodetext == "获取验证码") {
      var that = this;
      var total_micro_second = 60 * 1000; //表示60秒倒计时，想要变长就把60修改更大
      //生成code
      var code = common.createCode();
      that.setData({
        vcode: code
      })
      common.count_down(this, total_micro_second);
      var data = {
        "data": "{'tel':'" + that.data.newPhone + "', 'code':'" + that.data.vcode + "', 'typename':'梵店手机验证' }"
      }
      console.log(data.data);
      sendverifycode(data)
        .then(res => {
          console.log("短信接口回调")
        })
    }
  },

  quicklogin: function() {
    if (!this.data.readStatus){
      this.showAgreement()
      return
    }
    wx.showLoading({
      title: '登录中...',
    })
    
    // if (!this.data.toAuthorization) { //授权后的用户微信信息更新
      this.updateUserInfo(this.data.userInfo); //更新头像信息
    // }
    let that = this
    // if (!this.data.canlogin) {
    //   return
    // }
    // this.setData({
    //   canlogin: false
    // })
    wx.setStorageSync('token', that.data.mytoken)
    wx.setStorageSync('openid', that.data.myopneid)
    wx.setStorageSync('phone', that.data.myphone)
    wx.setStorageSync('characterType', that.data.mycharacterType)
    wx.setStorageSync('Privilege', that.data.myPrivilege)
    let token = wx.getStorageSync('token')
    let phone = wx.getStorageSync('phone')
    if (token != '') {
      console.log('进来了进来了')
      let checktokendata = {}
      let checktokenheader = 'application/x-www-form-urlencoded'
      debugger
      checktoken(checktokendata, checktokenheader, token)
        .then(res => {
          console.log(res)
          if (res.data.code == 0) {
            if (phone !== null) {
              that.getUserImg(that.skipto);
              // if (wx.getStorageSync("formWhere") == "formBean") {
              //   console.log('来自梵豆页面')
              //   wx.removeStorageSync("formWhere");
              //   wx.switchTab({
              //     url: '../../beanShopping/beanShopping'
              //   })
              // } else if (wx.getStorageSync("formWhere") == "shopping"){
              //   wx.removeStorageSync("formWhere");
              //   wx.navigateBack({
              //     delta: 1
              //   })
              // } else {
              //   wx.switchTab({
              //     url: '../../home/home'
              //   })
              // }

            } else {
              wx.hideLoading()
              wx.navigateTo({
                url: '../phonelogin/phonelogin?from=login'
              })
            }
            // this.setData({
            //   canlogin: true
            // })
          } else if (res.data.code == -1) {
            wx.login({
              success: function(res) {
                that.setData({
                  "code": res.code
                });
                // this.loginAPI()
                // 根据loginApi返回的code判断执行步骤
                if (that.data.loginCode == 0) {
                  that.getUserImg(that.skipto);
                } else if (that.data.loginCode == 10002) {
                  wx.hideLoading()
                  wx.navigateTo({
                    url: '../phonelogin/phonelogin?from=login'
                  })
                }
              }
            })
          }
          // wx.hideLoading()
        })
        .catch(res => {
          console.log(res)
        })
        .then(() => {
          // wx.hideLoading()
        })
    } else {
      // this.loginAPI()
      // 根据loginApi返回的code判断执行步骤
      debugger
      console.log('测试测试.........................................................')
      if (that.data.loginCode == 0) {
        that.getUserImg(that.skipto);
      } else if (that.data.loginCode == 10002) {
        wx.navigateTo({
          url: '../phonelogin/phonelogin?from=login'
        })
        wx.hideLoading()
      }
    }
  },
  skipto: function() {
    debugger;
    var formWhere = wx.getStorageSync("formWhere");
    if (formWhere == "shopping") {
      wx.removeStorageSync("formWhere");
      wx.navigateBack({
        delta: 1
      })
    } else if (formWhere == "running") {
      wx.removeStorageSync("formWhere");
      debugger
      wx.navigateBack({
        delta: 1
      })
    } else if (formWhere == "formHome") {
      console.log('来自首页')
      wx.removeStorageSync("formWhere");
      wx.switchTab({
        url: '../../home/home'
      })
    } else if (formWhere == "formCommunity") {
      console.log('来自梵星社区')
      wx.removeStorageSync("formWhere");
      wx.navigateBack({
        delta: 1
      })
    } else if (formWhere == "formBean") {
      console.log('来自梵豆页面')
      wx.removeStorageSync("formWhere");
      wx.switchTab({
        url: '../../beanShopping/beanShopping'
      })
    } else if (formWhere == "formPinTuan") {
      console.log('来自拼团详情')
      wx.removeStorageSync("formWhere");
      wx.navigateBack({
        delta: 1
      })
    } else if (formWhere == "fromMenDianAct") {
      console.log('来自门店抽奖详情')
      wx.removeStorageSync("formWhere");
      wx.navigateBack({
        delta: 1
      })
    } else if (formWhere == "fromGZCashCoupon") {
      console.log('来自广州店优惠券活动')
      wx.removeStorageSync("formWhere");
      wx.navigateBack({
        delta: 1
      })
    } else if (formWhere == "BecomeDandelion") {
      console.log('来自蒲公英邀请函')
      wx.removeStorageSync("formWhere");
      wx.navigateBack({
        delta: 1
      })
    }
    else if (formWhere == "blackbox") {
      console.log('小黑盒抽奖')
      wx.removeStorageSync("formWhere");
      wx.navigateBack({
        delta: 1
      })
    } else if (formWhere == "specification") {
      console.log('全屋购')
      wx.removeStorageSync("formWhere");
      wx.navigateBack({
        delta: 1
      })
    }
    else {
      wx.switchTab({
        url: '../me'
      });
    }
  },
  // 获取用户上传的头像并存到缓存中
  getUserImg: function(fun1) {
    debugger
    var data = {
      "data": {
        'openid': wx.getStorageSync('openid'),
        'key': 'YJ'
      }
    }
    getpersonaldata(data, "application/json").then(res => {
        console.log('...........获取用户头像接口..............')
        console.log(res)
        // wx.hideLoading()
        if (res.data.head === null) {
          debugger
          wx.getUserInfo({
            withCredentials: false,
            lang: 'zh_CN',
            complete: function(res) {
              var imgUrl;
              if (res.errMsg == "getUserInfo:ok") {
                wx.setStorageSync("headPortrait", res.userInfo.avatarUrl);
                wx.setStorageSync("userName", res.userInfo.nickName);
              } else {
                wx.setStorageSync("headPortrait", "")
                wx.setStorageSync("userName", "")
              }
            }
          })
        } else {
          wx.setStorageSync("headPortrait", res.data.head);
          wx.setStorageSync("userName", res.data.name);
        }

      })
      .catch(res => {
        console.log(res)
      })
      .finally(() => {
        wx.hideLoading()
        fun1();
      })
  },
  agree() {
    wx.navigateTo({
      url: './agreement/agreement'
    })
  },
  loginAPI(code) {
    debugger
    var _this = this;
    let data = {
      "code": code,
      "orginOpenId": wx.getStorageSync('originalOpenid') || ''
    }
    let header = 'application/json'
    login(data, header)
      .then(res => {
        _this.loading.hideToast();
        _this.setData({
          loginCode: res.data.code
        })
        if (res.data.code == 0) {
          _this.setData({
            mytoken: res.header.Token || res.header.token,
            myopneid: res.data.data.openId,
            myphone: res.data.data.phone,
            mycharacterType: res.data.data.userType,
            myPrivilege: res.data.data.privilege
          })
          wx.setStorageSync('token', res.header.Token || res.header.token)
          // wx.setStorageSync('openid', res.data.data.openId)
          // wx.setStorageSync('phone', res.data.data.phone)
          // wx.setStorageSync('characterType', res.data.data.userType)
          // wx.setStorageSync('Privilege', res.data.data.privilege)
          // _this.getUserImg(_this.skipto);
        } else if (res.data.code == 10002) {
          _this.setData({
            mytoken: res.header.Token || res.header.token,
            myopneid: res.data.data.openId,
            myphone: res.data.data.phone,
            mycharacterType: res.data.data.userType,
            myPrivilege: res.data.data.privilege
          })
          wx.setStorageSync('token', res.header.Token || res.header.token)
          // wx.setStorageSync('openid', res.data.data.openId)
          // wx.setStorageSync('phone', res.data.data.phone)
          // wx.setStorageSync('characterType', res.data.data.userType)
          // wx.setStorageSync('Privilege', res.data.data.privilege)
          // wx.navigateTo({
          //   url: '../phonelogin/phonelogin?from=login'
          // })
        } else {
          performNum++;
          if (performNum <= 3) {
            _this.loginAPI(_this.data.code) //重新微信登录接口
          } else {
            wx.showToast({
              title: '微信登录失败，请稍后重试！',
              icon: 'none'
            })
          }
        }
        // this.setData({
        //   canlogin: true
        // })
      })
  }


})