var api = require('../../../utils/API/request.js')
var common = require("../../../utils/common.js")
import { getdandelioninfo, GetSubAccountList} from "../../../utils/API/me/api.js"
var token = '';

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
  data: {
    token: '',
    openId: '',
    vipCode: '',
    num1: '',
    num2: '',
    num3: '',
    num4:0,
    phone: ''
  },
  toVIPList: function () {
    wx.navigateTo({
      url: "./vipList/vipList"
    })
  },
  toSubaccount: function () {
    wx.navigateTo({
      url: "./subaccount/subaccount"
    })
  },
  toShoper: function () {
    wx.navigateTo({
      url: "shopList/shopList"
    })
  },
  //to有效期变更
  toChangeRecord(){
    wx.navigateTo({
      url: '../record/changeRecord/changeRecord',
    })
  },
  copyCode: function () {
    const _this = this
    wx.createSelectorQuery().select(".code").boundingClientRect(function (rect) {
      _this.setData({
        vipCode: rect.dataset.code
      })
      wx.setClipboardData({
        data: _this.data.vipCode,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '已复制',
                icon: 'success',
                duration: 1000
              })
            }
          })
        }
      })
    }).exec()
  },

  onLoad: function (options) {
    var _this = this;
    try {
      // 获取用户的openId和token
      var openid = wx.getStorageSync('openid');
      var phone = wx.getStorageSync('phone');
      var token = wx.getStorageSync('token');
      var url = '/lr/s2bapi/getdandelioninfo?token=' + token + '&loginMark=' + phone + '&data=' + openid + '',
          url2 = '/s2b/customer/GetSubAccountList',
          data = {
            token:token,
            loginMark:phone,
            data:{
              limit:1,
              page:1
            }
          }
      getdandelioninfo()
        .then(function (res) {
          console.log(res)
          if (res.code == 200) {
            _this.setData({
              vipCode: res.data.invitation_code,
              num1: res.data.dandelion_count,
              num2: res.data.uvanstar_count + 1,
              num3: res.data.guest_count
            })
          }else if(res.code==400&&res.info=="访问受限"){
            wx.showToast({
              title: '访问频繁，请稍后再试',
              icon:'none'
            })

          }
        })
        .catch(res => {
          console.log(res);
        })
      GetSubAccountList(data,'application/json')
        .then(res=>{
          console.log(res)
          if(res.code == 200){
            _this.setData({
              num4: res.data.total
            })
          }else{
            console.log(res.code)
          }
        })
        } catch (e) {
            console.log(e)
        }
  },
  onShow: function () {
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
  },
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "客户管理")
  },
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "客户管理")
  },
})