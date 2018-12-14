// pages/home/3Ddesign/3Ddesign.js
var common = require("../../../../utils/common.js")
var api = require("../../../../utils/API/request.js")
var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  toProduct(e){
  	wx.navigateTo({//需要携带参数index和catename,index是商品ID（五位数），catename是商品类别，主要区分梵豆商品，拼团商品
      url:"../../../categories/detail/detail?index="+ e.target.dataset.id + "&catename=''" //get the index of goods which user tapped on
    })
  },
  to3DPage(){
  	wx.navigateTo({
      url: '../3Ddesign?id=3',
    })
  },
  to3DSer(){
  	wx.navigateTo({
      url: '../../brandservice/brandservice?id=1'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
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
    common.visitorRecordAPI(stayTime_JY,'地中海-海底总动员')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,'地中海-海底总动员')
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