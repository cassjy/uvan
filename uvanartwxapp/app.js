//app.js
// 新版
//app.js
var api = require("utils/API/request.js");
var mta = require('lib/js/mta_analysis.js') //小程序数据分析
import {
  checktoken,
  login,
  scancustomqrcode
} from './utils/API/app/api.js'
import regeneratorRuntime from '/utils/API/wxPromise.min.js'

App({
  globalData: {
    shoppingCartLoading: "loading",
    beanShoppingLoading: true
  },
  onShow: function(options) {
    console.log("app.js的onshow~~~~~~~~~~~~~~~~~~");
    var _this = this;
    var openid;
    console.log(options);
    //token过期更新token
    var token = wx.getStorageSync("token");
    var phone = wx.getStorageSync("phone");
    var openid = wx.getStorageSync("openid");
    if (token) {
      let checktokendata = {}
      let checktokenheader = 'application/x-www-form-urlencoded'
      checktoken(checktokendata, checktokenheader, token)
        .then(res => {
          if (res.data.code == 0) {

          } else if (res.data.code == -1) {
            api.wxlogin()
              .then(res => {
                let url = '/api/user/login'
                let data = {
                  "code": res,
                  "orginOpenId": ""
                }
                let header = 'application/json'
                GetMyOpenid(data)
                  .then(res => {
                    if (res.data.code == 0) {
                      console.log(res)
                      wx.setStorageSync('openid', res.data.data)
                      _this.recordinterface(options);
                    } else if (res.data.code == 10002) {
                      console.log(res)
                      wx.setStorageSync('openid', res.data.data)
                      _this.recordinterface(options);
                    }
                  })
              })
          }
        })
    }


    //自定义二维码
    if (openid != "") {
      _this.recordinterface(options)
    } else { //获取当前的打开用户的openid在做自定义二维码打开记录
      api.wxlogin()
        .then(res => {
          let url = '/api/user/login'
          let data = {
            "code": res,
            "orginOpenId": wx.getStorageSync('originalOpenid') || ''
          }
          let header = 'application/json'
          // api.post(url,data,header)
          // login(data,header)
          GetMyOpenid(data)
            .then(res => {
              if (res.data.code == 0) {
                wx.setStorageSync('openid', res.data.data)
                _this.recordinterface(options);
              } else if (res.data.code == 10002) {
                console.log(res)
                wx.setStorageSync('openid', res.data.data)
                _this.recordinterface(options);
              }
            })
        })


    }

  },
  recordinterface: function(options) {
    if (options.path == "pages/categories/detail/detail" || options.path == "pages/me/uvStar1/uvStar1" || options.path == "pages/me/dandelion/dandelion" || !(options.query.scene)) {
      return;
    } else {
      var openid = wx.getStorageSync("openid");
      var scandata = {
        token: "",
        loginMark: "",
        data: {
          "openid": openid,
          "qrcode_id": options.query.scene
        }
      }
      scancustomqrcode(scandata)
        .then(res => {
          console.log("自定义二维码打开记录成功" + res);
        })
    }
  },
  onLaunch: function (options) {
    mta.App.init({
      "appID": "500660066",
      "eventID": "500660070",
      // "lauchOpts": options,
      "statPullDownFresh": true,
      "statShareApp": true,
      "statReachBottom": true
    });
  },
  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {},

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  }
})