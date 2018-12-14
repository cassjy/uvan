var api = require("../../../utils/API/request.js");
var common = require("../../../utils/common.js")
import {
  Get_FunClubPrize,
  GetShareRecord,
  Get_FunClubPartinfo,
  GetInviteShareRecord
} from '../../../utils/API/home/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenShadow: true, //隐藏优惠券弹框
    btnText: '立即领取',
    alreadyReceived: false, //是否已经领取优惠券
    concessionCode: '', //优惠码
    startTime: '', //起始时间
    endTime: '', //结束时间
    checked: true, //防止多次点击
    nowOpenid: '', //点击进来的openid
    shareOpenid: '',
    invitationID: ''

  },

  // 领取优惠券
  receive: function() {
    var _this = this;
    console.log('点击领券按钮')
    // 未登录处理
    var phone = wx.getStorageSync('phone');
    if (!phone) {
      wx.showModal({
        title: '未登录',
        content: '亲，你还未登录哦，请点击梵星进行登录',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../me/twicelogin/twicelogin'
            })
          } else if (res.cancel) {}
        }
      })
      wx.setStorageSync('formWhere', 'fromGZCashCoupon')
    } else {
      if (this.data.alreadyReceived) {
        wx.showToast({
          title: '您已领取过了',
        })
        return;
      }
      wx.showLoading({
        title: '领劵中...',
      })
      if (this.data.checked) { //防止多次点击
        this.setData({
          checked: false
        })
        // 调用领券接口
        var FunClubPrizeData = {
          "token": wx.getStorageSync('token'),
          "loginMark": wx.getStorageSync('phone')
        }
        Get_FunClubPrize(FunClubPrizeData).then(res => {
            console.log(res)
            // 获取优惠券信息
            if (res.info == "已领取过优惠券" && res.code == 400) {
              wx.showToast({
                title: '您已领取过了',
              })
              _this.getFunClubPartinfo();
              _this.setData({
                hiddenShadow: true,
                alreadyReceived: true,
                btnText: '已领取'
              })
            } else if (res.code == 200) {
              _this.getFunClubPartinfo();
              _this.setData({
                hiddenShadow: false,
                alreadyReceived: true,
                btnText: '已领取'
              })
            } else {
              wx.hideLoading()
              wx.showToast({
                title: '领取失败',
                icon: 'none'
              })
              _this.setData({
                checked: true
              })
            }

          })
          .catch(res => {
            console.log(res)
            _this.setData({
              hiddenShadow: true,
              alreadyReceived: false,
              btnText: '立即领取',
              checked: true
            })
          })
      }
    }
  },
  // 优惠券具体详情
  getFunClubPartinfo: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var FunClubPartinfoData = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone')
    }
    Get_FunClubPartinfo(FunClubPartinfoData).then(res => {
        console.log(res)
        if (res.data.isprize) {
          _this.setData({
            alreadyReceived: true,
            concessionCode: res.data.F_prizecode,
            startTime: res.data.dtprize,
            endTime: res.data.dtprizeend,
            btnText: '已领取'
          })
        } else {
          _this.setData({
            alreadyReceived: false
          })
        }
      })
      .catch(res => {
        console.log(res)
      })
      .then(() => {
        wx.hideLoading()
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //公共分享的访问记录
    let invitationID = options.invitationID
    let originalOpenid = options.openid
    common.commonVisitRecord(invitationID, originalOpenid)

    this.setData({
      shareOpenid: options.openid,
      invitationID: options.invitationID
    })
  },

  // 关闭优惠券信息
  closeShadow: function() {
    this.setData({
      hiddenShadow: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _this = this;
    api.wxlogin()
      .then(res => {
        _this.setData({
          code: res
        });
        var openiddata = {
          data: JSON.stringify({
            "fromtype": "fandianvip",
            "code": res
          })
        }
        return GetShareRecord(openiddata);
      })
      .then(res => {
        var openid = JSON.parse(res.info).openid;
        _this.setData({
          "nowOpenid": openid
        });
        wx.login({
          success: function(res) {
            _this.setData({
              "code": res.code
            });
          },
          complete: function(res) {
            if (_this.data.invitationID != '') { //记录邀请
              var inviteData = {
                "token": "",
                "loginMark": "",
                "data": {
                  'qrcode_id': _this.data.invitationID,
                  'openid': _this.data.nowOpenid,
                  'store_openid': _this.data.shareOpenid,
                  'source': 'GZ',
                }
              }
              debugger
              GetInviteShareRecord(inviteData)
            }
          }
        })
      })
    // 查看优惠券信息
    if (wx.getStorageSync('phone') !== null) {
      this.getFunClubPartinfo();
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let nickname = wx.getStorageSync('userName') || " "
    let openid = wx.getStorageSync('openid')
    let invitationID = common.uuid()

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
              common.commonShare('广州店活动', nickname, openid, '', invitationID, '')
            },
            fail: function(err) {
              console.log(err)
              common.commonShare('广州店活动', nickname, openid, '', invitationID, '')
            }
          })
        })
    } else {
      //用户未授权的话，nickName传空格字符串
      wx.getUserInfo({
        success: function(res) {
          console.log(res)
          nickname = res.userInfo.nickName
          common.commonShare('广州店活动', nickname, openid, '', invitationID, '')
        },
        fail: function(err) {
          console.log(err)
          common.commonShare('广州店活动', nickname, openid, '', invitationID, '')
        }
      })
    }
    return {
      title: '马上领5000元代金券',
      path: '/pages/home/guangzhouCashCoupon/guangzhouCashCoupon?invitationID=' + invitationID + '&openid=' + wx.getStorageSync('openid') + '&name=rex',
      success: function(res) {
        // var sharedata = {
        //   "data": {
        //     "Skey": "/pages/home/guangzhouCashCoupon/guangzhouCashCoupon",
        //     "Svalue": '广州店',
        //     "NickName": nickName,
        //     "Openid": wx.getStorageSync('openid'),
        //     "cssid": invitationID
        //   }
        // }
        // api.post('/lr/s2bapi/ADD_CommonShareService', sharedata, 'application/json')
        //   .then(res => {
        //     console.log(res)
        //   })
      }
    }
  }
})