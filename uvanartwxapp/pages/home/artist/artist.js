// pages/home/artist/artist.js
var common = require("../../../utils/common.js")
var api = require("../../../utils/API/request.js")
var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id == '0') {
      wx.setNavigationBarTitle({
        title: 'Jacky谈创业',
      })
      this.setData({
        title: 'Jacky谈创业'
      })
    } else if (options.id == '1') {
      wx.setNavigationBarTitle({
        title: 'Sophie',
      })
      this.setData({
        title: 'Sophie'
      })
    } else if (options.id == '2') {
      wx.setNavigationBarTitle({
        title: '美西之旅',
      })
      this.setData({
        title: '美西之旅'
      })
    } else if (options.id == '3') {
      wx.setNavigationBarTitle({
        title: '优梵实验室',
      })
      this.setData({
        title: '优梵实验室'
      })
    }
    this.setData({
      id: options.id
    })
    console.log(this.data.id)
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
    common.visitorRecordAPI(stayTime_JY,this.data.title)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,this.data.title)
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