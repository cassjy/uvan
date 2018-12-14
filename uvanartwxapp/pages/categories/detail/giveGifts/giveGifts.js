// pages/categories/detail/giveGifts/giveGifts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideRule: true,
    goodsInfo: {}, //商品信息 
    payWayId: -1, //支付方式(0微信支付，1梵豆支付)
    process: 0, //进程（0支付状态，1选好友，2已赠送）
    isApart: false,//是否已经拆开
  },

  onLoad: function(options) {
    console.log(options)
    console.log(JSON.parse(options.goodsInfo))
    this.setData({
      goodsInfo: JSON.parse(options.goodsInfo)
    })
  },

  // 打开规则说明
  openRule() {
    this.setData({
      hideRule: false
    })
  },

  //关闭规则说明
  closeRule() {
    this.setData({
      hideRule: true
    })
  },

  // to赠送列表
  toGivingList() {
    wx.navigateTo({
      url: '../../../me/givingRecord/givingRecord',
    })
  },

  // 选择支付方式
  checkPayWay(e) {
    console.log(e)
    this.setData({
      payWayId: parseInt(e.currentTarget.dataset.index)
    })
  },
  // 立即支付
  toPay() {
    this.setData({
      process: 1
    })
  },
  onShareAppMessage(res) {
    console.log(res)
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '精挑细选一件礼物送给你请笑纳',
      path: '/pages/categories/detail/goodsTransferred/goodsTransferred?goodsImg=' + this.data.goodsInfo.goodsImg,
      imageUrl: this.data.goodsInfo.goodsImg,
      success: (res) => {
        console.log("转发成功", res);
        _this.setData({
          process:2
        })
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})