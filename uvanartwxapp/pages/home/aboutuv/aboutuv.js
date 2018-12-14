var common = require("../../../utils/common.js")
var api = require("../../../utils/API/request.js")
var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
	data:{
		url1:"https://uvpt.uvanart.com/upload/static/home/aboutuv/",
		// url1:"../../",
		imgUrls1: [//图片地址
      {
        url: '1.jpg',
        height:"0"
      }, {
        url: '2.jpg',
        height:"0"
      }, {
        url: '3.jpg',
        height:"0"
      }, {
        url: '4.jpg',
        height:"0"
      }, {
        url: '5.jpg',
        height:"0"
      },
    ],
	},
  onShow: function(){
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(()=>{
      stayTime_JY++
    },1000)
  },
  onHide: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"关于优梵")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"关于优梵")
  },
	//图片载入完毕
  loadImg1: function(e){
    var bl = e.detail.width/e.detail.height;//原图比例
    var sjheight = wx.getSystemInfoSync().windowWidth/bl//显示实际高度
    var i = e.currentTarget.dataset.id;
    var string = "imgUrls1["+i+"].height";
    this.setData({
      [string]:sjheight
    })
    setTimeout(function(){
      wx.hideLoading();
    },1000)
  },
  imageError: function(e) {
    console.log('加载失败，请重新刷新');
    wx.showToast({
      title: '加载失败',
      icon: 'loading',
      duration: 2000
    })
  },
  toGDstore(){
    wx.navigateTo({
      url: '../guangzhoustore/guangzhoustore'
    })
  }
})