// pages/personal/personal.js
var common = require("../../../utils/common.js")
var api = require("../../../utils/API/request.js")
import { logout, checktoken, login } from '../../../utils/API/me/api.js'

var app = getApp()

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: ''
  },
  toUnbind(){
    wx.navigateTo({
      url: './unbind/unbind'
    })
  },
  // 未开发功能提示
  showTips: function (e) {
    console.log(1)
    var _this = this;
    let pages = getCurrentPages();
    let curPage = pages[pages.length - 1];
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in',
    })
    animation.opacity(1).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(0).step();
      _this.setData({
        animationData: animation.export()
      })
    }, 3000)
  },

  // 退出登录
  exit: function () {
    wx.showLoading({
      title: '正在退出'
    })
    try {
      let data = {}
      let header = 'application/x-www-form-urlencoded'
      let token = wx.getStorageSync('token')
      logout(data,header,token)
      .then(res=>{
        debugger
        if(res.data.code==0){
          wx.removeStorageSync('openid');
          wx.removeStorageSync('token');
          wx.removeStorageSync('sessionid');
          wx.removeStorageSync('characterType');
          wx.removeStorageSync('Privilege');
          wx.removeStorageSync("headPortrait");
          wx.removeStorageSync("userName");
          wx.removeStorageSync("registrationTime")
          // wx.removeStorageSync("phone")
          wx.removeStorageSync('phone')
          wx.reLaunch({
            url: '../me'
          })
          console.log('检查token============================')
          console.log(wx.getStorageSync('token'))
          wx.hideLoading()
        }
      })
      
    } catch (e) {
      // Do something when catch error
      wx.reLaunch({
        url: '../me'
      })
      wx.hideLoading()
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phone = wx.getStorageSync('phone')
    let anonymousPhoneNum = phone.substr(0,3) + '****' + phone.substr(7)
    this.setData({
      phone: anonymousPhoneNum
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(()=>{
      stayTime_JY++
    },1000)
    var token = wx.getStorageSync("token");
    if(token!=''){
      let checktokendata = {}
      let checktokenheader = 'application/x-www-form-urlencoded'
     checktoken(checktokendata,checktokenheader,token)
      .then(res=>{
        if(res.data.code==0){

        }else if(res.data.code == -1){
          api.wxlogin()
          .then(res => {
            console.log(res)
            let url = '/api/user/login'
            let data = {
              "code": res,
              "orginOpenId": ''
            }
            let header = 'application/json'
            login(data,header)
            .then(res=>{
              if(res.data.code==0){
                console.log(res)
                wx.setStorageSync('token', res.header.Token || res.header.token)
                wx.setStorageSync('openid', res.data.data.openId)
                wx.setStorageSync('phone',res.data.data.phone)
                wx.setStorageSync('characterType',res.data.data.userType)
                wx.setStorageSync('Privilege',res.data.data.privilege)
              }
            })
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"设置")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"设置")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})