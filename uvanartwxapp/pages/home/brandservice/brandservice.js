var common = require("../../../utils/common.js")
var api = require("../../../utils/API/request.js")
var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
  data: {
    titlename: '物流服务',
    leftVal: 0,
    widthVal: 375,
    url1: "https://uvpt.uvanart.com/upload/static/3ddesign/",
    url2: "https://uvpt.uvanart.com/upload/static/home/logistics/",
    imgUrls1: [//图片地址
      {
        url: '3D_01.jpg',
        height: "0"
      }, {
        url: '3D_02.jpg',
        height: "0"
      }, {
        url: '3D_03.jpg',
        height: "0"
      }, {
        url: '3D_04.jpg',
        height: "0"
      }, {
        url: '3D_05.jpg',
        height: "0"
      }, {
        url: '3D_06.jpg',
        height: "0"
      }, {
        url: '3D_07.jpg',
        height: "0"
      }, {
        url: '3D_08.jpg',
        height: "0"
      }, {
        url: '3D_09.jpg',
        height: "0"
      }, {
        url: '3D_10.jpg',
        height: "0"
      }, {
        url: '3D_11.jpg',
        height: "0"
      },
    ],
    imgUrls2: [//图片地址
      {
        url: '1.jpg',
        height: "0"
      }, {
        url: '2.jpg',
        height: "0"
      }, {
        url: '3.jpg',
        height: "0"
      }, {
        url: '4.jpg',
        height: "0"
      }, {
        url: '5.jpg',
        height: "0"
      }, {
        url: '6.jpg',
        height: "0"
      }, {
        url: '7.jpg',
        height: "0"
      }
    ],
  },
  onLoad:function(options) {
    debugger;
    if (options.id == '0') {
      wx.setNavigationBarTitle({
        title: '物流服务',
      })
      this.setData({
        titlename: '物流服务'
      })
    } else if (options.id == '1') {
      wx.setNavigationBarTitle({
        title: '3D设计',
      })
      this.setData({
        titlename: '3D设计'
      })
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
    common.visitorRecordAPI(stayTime_JY, "品牌服务")
  },
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "品牌服务")
  },
  // selectTitle(e){
  // 	let titlename = e.currentTarget.dataset.name
  // 	let count = 2
  // 	let leftVal = 0
  // 	switch (titlename){
  // 		case '3D设计':
  // 			this.setData({
  // 				leftVal: 0,
  // 				titlename: titlename
  // 			})
  // 			break;
  // 		case '物流服务':
  // 			this.setData({
  // 				leftVal: 750/count,
  // 				titlename: titlename
  // 			})
  // 			break;
  // 		case '物流服务1':
  // 			this.setData({
  // 				leftVal: 750/count*2,
  // 				titlename: titlename
  // 			})
  // 			break;
  // 		case '物流服务2':
  // 			this.setData({
  // 				leftVal: 750/count*3,
  // 				titlename: titlename
  // 			})
  // 			break;
  // 		default:
  // 			this.setData({
  // 				leftVal: 0,
  // 				titlename: '3D设计'
  // 			})
  // 			break;
  // 	}
  // },
  //图片载入完毕
  loadImg1: function (e) {
    var bl = e.detail.width / e.detail.height;//原图比例
    var sjheight = wx.getSystemInfoSync().windowWidth / bl//显示实际高度
    var i = e.currentTarget.dataset.id;
    var string = "imgUrls1[" + i + "].height";
    this.setData({
      [string]: sjheight
    })
    setTimeout(function () {
      wx.hideLoading();
    }, 1000)
  },
  loadImg2: function (e) {
    var bl = e.detail.width / e.detail.height;//原图比例
    var sjheight = wx.getSystemInfoSync().windowWidth / bl//显示实际高度
    var i = e.currentTarget.dataset.id;
    var string = "imgUrls2[" + i + "].height";
    this.setData({
      [string]: sjheight
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
  }
})