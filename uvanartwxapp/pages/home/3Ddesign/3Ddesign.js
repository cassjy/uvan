// pages/home/3Ddesign/3Ddesign.js
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
    url: "",
    title: ''
  },

  message: function (e) {
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.id == 0) {
    //   this.setData({
    //     url: "https://uvanhd.uvanart.com/youfan/index.html"
    //   })
    // } else if (options.id == 1) {
    //   this.setData({
    //     url: ""
    //   })
    // }
    if (options.id == 0) {
      this.setData({
        url: "https://uvpt.uvanart.com/upload/static/kujiale/kujiali_Elizabeth/index.html",
        title: '美式田园-伊丽莎白'
      })
    } else if (options.id == 1) {
      this.setData({
        url: "https://uvpt.uvanart.com/upload/static/kujiale/kujiale_Sena/index.html",
        title: '美式轻奢风-塞纳河畔'
      })
    } else if (options.id == 2) {
      this.setData({
        url: "https://uvpt.uvanart.com/upload/static/kujiale/kujiale_Ins/index.html",
        title: '北欧风-浅憩ins风'
      })
    } else if (options.id == 3) {
      this.setData({
        url: "https://uvpt.uvanart.com/upload/static/kujiale/kujiale_Ocean/index.html",
        title: '地中海-海底总动员'
      })
    }
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