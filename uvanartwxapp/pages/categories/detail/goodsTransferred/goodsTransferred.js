var tel = require("../../../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    goodsImg: '',
    hideBounced: true,
    error1: false, //收件人
    error2: false, //联系号码
    error3: false, //收货地址
    error4: false, //详细地址
    parameters:{
      recipient:'',
      phoneNum: '',
      address:'',
      addressDetailed:''
    }, //传参数据
  },

  onLoad: function(options) {
    console.log(options)
    this.setData({
      goodsImg: options.goodsImg
    })
  },

  onShow: function() {

  },
  // 地址选择
  bindRegionChange(e) {
    console.log(e)
    this.setData({
      addressList: e.detail.value
    })
    console.log(this.data.addressList)
  },

  // 立即拆开打开弹框
  openAddressBounced() {
    this.setData({
      hideBounced: false
    })
  },
  //  关闭弹框
  closeBounced() {
    this.setData({
      hideBounced: true
    })
  },
  // to首页
  toHomePage() {
    console.log(11111111111)
    wx.switchTab({
      url: '../../../home/home',
    })
  },

  // 收件人输入
  recipientInput(e) {
    console.log((e.detail.value).length)
    if ((e.detail.value).length>=1){
      this.setData({
        "parameters.recipient": e.detail.value,
        error2: false
      })
    }
  },

  // 联系号码输入
  phoneInput(e) {
    console.log((e.detail.value).length)
    if ((e.detail.value).length >= 11) {
      if (tel.isPhone(e.detail.value)) {
        this.setData({
          "parameters.phoneNum": e.detail.value,
          error2: false,
        })
      } else {
        wx.showToast({
          title: '手机格式不正确！',
          icon: 'none'
        })
        this.setData({
          error2: true
        })
      }
    }
  }

})