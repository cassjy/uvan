var api = require("../../../utils/API/request.js")
var common = require("../../../utils/common.js");
import {
  validateusertype2,
  BecomeDandelion
} from '../../../utils/API/me/api.js'
import { GetWxOpenId} from '../../../utils/API/activity/activity.js'
var invitationCode = ''
const app = getApp();
var option1;

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器

Page({
  data: {
    openidofvisiter: '',
    QrCode:''
  },
  onShow: function() {
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
    //onshow 比onReady先执行，且执行次数要多 梵星用户进来直接升级，登录之后返回也直接升级
    //第一次进来的时候 有token和phone的情况，onshow和onready都有执行进去
    option1 = wx.getStorageSync("Doption");
    if (option1.invitationCode) {
      invitationCode = option1.invitationCode || '';
      this.quickBecomeD();
    }
  },
  onLoad: function(option) {
    //公共分享的访问记录
    console.log('invitationCode:' + invitationCode)
    if (option.scene) {
      console.log('invitationID=' + option.scene)
      //公共分享的访问记录
      let invitationID = option.scene
      this.setData({
        QrCode: option.scene
      })
      // let originalOpenid = option.openid
      debugger;
      common.commonVisitRecord(invitationID, '')
    }
    if (option.invitationID) {
      let invitationID = option.invitationID;
      let originalOpenid = option.openid
      this.setData({
        QrCode: option.invitationID
      })
      common.commonVisitRecord(invitationID, originalOpenid)
    }

    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    var _this = this;
    try {
      // 获取用户的openId和phone
      GetWxOpenId().then(res => {
          console.log(res.data)
          if (res.data.code == 0) {
            _this.setData({
              openidofvisiter: res.data.data
            })
          } else if (res.data.code == -1) {
            wx.showToast({
              title: '系统错误',
              icon: 'none'
            })
          } else if (res.data.code == 30001) {
            wx.showToast({
              title: '非法请求',
              icon: 'none'
            })
          }
          wx.hideLoading();
        })
        .then(function() {
          var data = {
            "token": "",
            "loginMark": "",
            "data": _this.data.openidofvisiter
          }
          validateusertype2(data)
            .then(res => {
              option1 = option ? option : wx.getStorageSync("Doption");
              //注意option为空的情况
              invitationCode = option1.invitationCode || 'undefined';
              if (res.code == 200 && res.data.F_UserType == "蒲公英") {
                wx.switchTab({
                  url: '../../home/home'
                })
              } else if (invitationCode !== "") {
                debugger;
                _this.quickBecomeD();
              }
            })
        })



    } catch (e) {

    }

  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "蒲公英邀请函")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "蒲公英邀请函")
  },
  toBecomeD: function() {
    var token = wx.getStorageSync("token");
    var phone = wx.getStorageSync("phone");
    var visiteropenid = wx.getStorageSync("openid");
    if (token !== "" && (phone!=''&&phone !== null)) {
      this.quickBecomeD();
    } else {
      //用户未登录
      var _this = this;
      wx.setStorageSync("Doption", option1)
      wx.setStorageSync("formWhere", "BecomeDandelion")
      wx.navigateTo({
        url: '/pages/me/twicelogin/twicelogin',
      })
    }

  },
  quickBecomeD: function() {
    var token = wx.getStorageSync("token");
    var phone = wx.getStorageSync("phone");
    var visiteropenid = wx.getStorageSync("openid");
    let _this = this
    if (token !== "" && (phone!=''&&phone !== null) ) {//&& visiteropenid !== ""
      console.log('invitationCode:' + invitationCode)
      debugger
      wx.removeStorageSync("Doption");
      wx.showModal({
        title: '',
        content: '当前账户升级为蒲公英',
        success: function(res) {
          if (res.confirm) {
            //升级程序
            console.log(invitationCode)
            var registerdata = {
              // token: token,
              // loginMark: phone,
              // OpenID: visiteropenid,
              // Mobile: phone,
              InvitationCode: invitationCode,
              QrCode: _this.data.QrCode
              // NickName: "",
              // IconUrl: ""
            }
            BecomeDandelion(registerdata, 'application/x-www-form-urlencoded')
              .then(res => {
                debugger;
                if (res.data.Success) {
                  wx.setStorageSync("characterType", "蒲公英")
                  wx.switchTab({
                    url: '/pages/me/me'
                  })
                } else {
                  wx.showToast({
                    title: res.data.ErrorMsg,
                    icon: 'none',
                    duration: 3000
                  })
                }
              })
          } else if (res.cancel) {

          }
        }
      })
    }
  },

})