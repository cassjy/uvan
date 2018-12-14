// pages/shopInfo/privilege/privilege.js
var api = require("../../../utils/API/request.js")
var common = require("../../../utils/common.js");
import { GetInviteShareRecord, CheckInvitationStatus, wxdecryptdata, uvanstarlogin2, BecomeDandelion} from '../../../utils/API/me/api.js'
import { GetWxOpenId} from '../../../utils/API/activity/activity.js'
var invitationCode = ''
var IconUrl=''
var nickName =''//打开用户的昵称
var visiterphone ='' //本地的这个变量看看能够防止多次点击~~~~~~之后再为漏洞用户做兼容
var originOpenid =''
var token =''
var invitephone=''
const app = getApp();
Page({
  data: {
    openidofvisiter: '',
    enablePhone:true,
  },
  onLoad: function (option) {
    //公共分享的访问记录
    let invitationID = option.invitationID
    let originalOpenid = option.openid
    common.commonVisitRecord(invitationID,originalOpenid)

    wx.showLoading({
      mask: true,
      title: '加载中'
    })
    var _this = this;
    var inviteopenid = option.inviteopenid
    originOpenid = inviteopenid
    invitephone = option.invitephone
    // var invitationID = option.invitationID
    token = option.token
    invitationCode = option.invitationCode
    console.log(invitationCode)
    wx.setStorage({key: "inviter",data: inviteopenid})
    try {
      // 获取用户的openId和phone
      GetWxOpenId().then(res => {
          //获取访客的openid
          _this.setData({
            openidofvisiter: res.data.data,
          })
          console.log(_this.data.openidofvisiter)
          //获取用户信息
          wx.getUserInfo({
            withCredentials: false,
            lang: 'zh_CN',
            complete: function (res) {
              if (res.errMsg == "getUserInfo:ok") {
                nickName = res.userInfo.nickName;
                IconUrl = res.userInfo.avatarUrl;
              } else {
                nickName = null;
                IconUrl = null;
              }
          //记录邀请函打开次数
              // var data = {
              //   OpenID: _this.data.openidofvisiter,
              //   NickName: nickName,
              //   InvitationsId: invitationID,
              //   VanShopMasterPhone: invitephone,
              //   VanShopMaster: '蒲公英',
              //   QRCodeSource: 'T'
              // }
              var inviteData = {
                "token": token,
                "loginMark": invitephone,
                "data": {
                  'qrcode_id': invitationID,
                  'openid': _this.data.openidofvisiter,
                  'store_openid': originOpenid,
                  'source': 'T'
                }
              }
              GetInviteShareRecord(inviteData)
                .then(res => {
                  console.log("每次点开都会记录");
                  console.log(res.info);
                  //判断邀请函是否使用过
                  var ifdata = {
                    F_DandelionOpenId: _this.data.openidofvisiter,
                    F_InvitationsId: invitationID,
                  }
                  return CheckInvitationStatus(ifdata) 
                })
                .then(res => {
                  wx.hideLoading();
                  console.log(JSON.stringify(res));
                  if (!res.data.Success) { //不相等就是无效
                    _this.setData({ use: true })
                    wx.showModal({
                      title: '邀请函过期',
                      content: '此邀请函已使用，或你已成为蒲公英',
                      showCancel: false,
                      success: function (res) {
                          wx.switchTab({
                            url: '../me?type=false',
                          })
                      }
                    })
                  } else {
                    _this.setData({ use: false })
                  }
                })
                .then(()=>{
                  wx.login({
                    success: function (res) {
                      _this.setData({ "code": res.code });
                    },
                    complete: function (res) {
                      // that.loading.hideToast();
                    }
                  })
                })
                .catch(res=>{
                  console.log(res);
                })

            }
          })
        })
        .catch(res=>{
          console.log(res);
        })
        // .then(function () {
        //   var inviteData = {
        //     "token": token,
        //     "loginMark": phone,
        //     "data": JSON.stringify({
        //       'qrcode_id': invitationID,
        //       'openid': _this.data.openidofvisiter,
        //       'store_openid': openid,
        //       'source': 'P'
        //     })
        //   }
        //   api.post('/lr/s2bapi/inviterecord', inviteData)
        // })
      // var url = '/lr/s2bapi/getdandelioninfo?token=' + token + '&loginMark=' + phone + '&data=' + openid + '';
      // debugger
      // api.get(url)
      // .then(function (res) {
      //   console.log(res)
      //   _this.setData({
      //     invitationCode: res.data.invitation_code,
      //   })
      //   console.log(_this.data.invitationCode)
      // })


    } catch (e) {

    }
  },
  getPhoneNumber: function (e) {
    debugger;
    if (!this.data.enablePhone) {
      return
    }
    if (this.data.use){
      return
    }
    console.log("手机解密流程，用login2登录");
    if (e.detail.errMsg.indexOf('getPhoneNumber:fail') != -1) {
      console.log("用户不同意授权")
    } else {
      this.setData({ enablePhone: false })
      wx.showLoading({
        mask: true,
        title: '加载中'
      })
      var that = this;
      var phonedata = {
        "data": JSON.stringify({
          "code": that.data.code,
          "encryptedData": e.detail.encryptedData,
          "iv": e.detail.iv
        })
      };
      wxdecryptdata(phonedata)
        .then(res => {
          if (res.code == 200) {
            console.log("手机解密成功" + JSON.stringify(res));
            visiterphone = res.data.phoneNumber;
              console.log("解密后存储成功");
              api.wxlogin()
                .then(res => {
                  console.log("解密后的code" + res);
                  that.setData({
                    code: res
                  });
                })
              that.pforregister(visiterphone);
              that.setData({ enablePhone: true }) 
          }else{
            that.setData({ enablePhone: true }) 
            wx.hideLoading();
          }
        })
        .catch(res => {
          console.log("手机解密失败,语法错误");
          that.setData({ enablePhone: true });
          wx.hideLoading();
        })
    }
  },
  pforregister: function (visiterphone) {
    var _this = this;
    //先登录
    var login2data = {
      token: "",
      loginMark: visiterphone,
      data: JSON.stringify({
        "phone": visiterphone,
        "openid": _this.data.openidofvisiter,
        "nickname": nickName,
        "originOpenid": originOpenid,
        "imageurl": IconUrl
      })
    }
    uvanstarlogin2(login2data)
    .then(res=>{
      if (res.code == 200) {
        var Privilege = res.data.Privilege ? 1 : 0;
        try {
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('sessionid', res.data.sessionid);
          wx.setStorageSync('characterType', res.data.type);
          wx.setStorageSync('Privilege', Privilege);
        } catch (e) {
        }
      } else if (res.code == 400) {
        //暂时login2是注册的，应该不会反悔不成功，除了500
        console.log("返回400");
      }
      if (!_this.data.use) {
        var registerdata ={
          token: res.data.token,
          loginMark: visiterphone,
          OpenID: _this.data.openidofvisiter,
          Mobile: visiterphone,
          InvitationCode: invitationCode,
          NickName: nickName,
          IconUrl: IconUrl
        }
        return BecomeDandelion(registerdata)
      }else{
        console.log("过期，或你已经是蒲公英");
      }
    })
    .then(res => {
      //****************************info==0是成功的但是我自己加自己的没有成功,最好是在登录一次，跳蒲公英页面
      // if()

      wx.hideLoading();
      if (res.data.Success) {//成功
        var login2data = {
          token: "",
          loginMark: visiterphone,
          data: JSON.stringify({
            "phone": visiterphone,
            "openid": _this.data.openidofvisiter,
            "nickname": nickName,
            "originOpenid": originOpenid,
            "imageurl": IconUrl
          })
        }
        uvanstarlogin2(login2data)
          .then(res => {
            if (res.code == 200) {
              var Privilege = res.data.Privilege ? 1 : 0;
              try {
                wx.setStorageSync('token', res.data.token);
                wx.setStorageSync('sessionid', res.data.sessionid);
                wx.setStorageSync('characterType', res.data.type);
                wx.setStorageSync('Privilege', Privilege);
                wx.switchTab({
                  url: '../me?type=false',
                })
              } catch (e) {}
            } else if (res.code == 400) {
              //暂时login2是注册的，应该不会反悔不成功，除了500
              console.log("返回400");
            }
          })
      }
      else{
        wx.showModal({
          title: '失败',
          content: res.data.ErrorMsg,
          showCancel: false,
          success: function (res) {
            wx.switchTab({
              url: '../me?type=false',
            })
          }
        })
      }
    })
    .catch(res=>{
      console.log(res);
    })
    debugger;
    
  }
})