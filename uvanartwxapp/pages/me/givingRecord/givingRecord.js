// pages/me/givingRecord/givingRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 顶栏tabbar选择
  selectTab(e){
     this.setData({
       tabIndex: parseInt(e.currentTarget.dataset.index)
     })
  },
  // to退款页
  refund(){
    wx.navigateTo({
      url: 'giftRefund/giftRefund',
    })
  },
  
})