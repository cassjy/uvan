// pages/shopInfo/dandelion1/enable/enable.js
var common = require("../../../../utils/common.js")
var api = require("../../../../utils/API/request.js")

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
      height:'865'
  },
  //图片载入完毕
  loadImg: function (e) {
    var bl = e.detail.width / e.detail.height;//原图比例
    var sjheight = wx.getSystemInfoSync().windowWidth / bl//显示实际高度
    this.setData({
      height: sjheight
    })
    setTimeout(function () {
      wx.hideLoading();
    }, 1000)
  },
  imageError: function (e) {
    console.log('加载失败，请重新刷新');
    wx.showToast({
      title: '加载失败',
      icon: 'loading',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      time: new Date().getTime()
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"蒲公英特权")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"蒲公英特权")
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