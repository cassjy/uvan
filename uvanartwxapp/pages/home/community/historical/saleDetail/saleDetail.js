// pages/home/community/historical/saleDetail/saleDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList: [], //图片列表
    ban: true,
    state: '', //状态码判断页面显示
    consignee: {},
    array: ['天猫', '淘宝', '京东', '唯品会', '官网', '线下店铺', '微信小程序'],
    channel: ['天猫/淘宝', '唯品会', '新媒体（微博、微信等）', '新闻报道', '邻居好友推荐', '路过', '广告', '其它'],
    channelMark: ['T', 'W', 'M', 'X', 'P', 'L', 'G', 'Q'],
    start: ['1', '2', '3', '4', '5'],
    colorIndex: '-1', //星星
    colorIndex1: '-1',
    colorIndex2: '-1',
    colorIndex3: '-1',
    colorIndex4: '-1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.state)
    var _this = this;
    if (parseInt(options.state) == 1) {
      for (let i = 1; i <= 5; i++) {
        if (JSON.parse(options.data)['F_Image' + i] !== null) {
          this.data.picList.push(JSON.parse(options.data)['F_Image' + i])
        }
      }
    } else if ((options.state) == 2) {
      wx.setNavigationBarTitle({
        title: '问卷详情',
      })
      // 门店渠道标识转成中文
      this.data.channelMark.forEach(function (currentValue, index, arr) {
        if (currentValue == JSON.parse(options.data).F_KnowTheOutlets) {
          _this.setData({
            channelValue: _this.data.channel[index]
          })
        }
      })
      this.setData({
        colorIndex: JSON.parse(options.data).F_ShoppingQuideQuality - 1,
        colorIndex1: JSON.parse(options.data).F_3DDesignProject - 1,
        colorIndex2: JSON.parse(options.data).F_DeliveryService - 1,
        colorIndex3: JSON.parse(options.data).F_FurnitureQuality - 1,
        colorIndex4: JSON.parse(options.data).F_AfterSalesService - 1,
      })
    }
    this.setData({
      state: parseInt(options.state),
      consignee: JSON.parse(options.data),
      picList: this.data.picList
    })
    console.log(this.data.consignee)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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