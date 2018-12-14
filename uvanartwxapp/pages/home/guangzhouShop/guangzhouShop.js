// pages/home/guangzhouShop/guangzhouShop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: [
      {
        url: 'https://uvpt.uvanart.com/upload/static/%E5%BC%80%E5%BA%97%E4%B8%8E3D/%E5%B9%BF%E5%B7%9E%E5%BA%97%E5%BC%80%E4%B8%9AUI%E5%9B%BE/%E4%B8%93%E9%A2%98%E9%A1%B5%E5%88%87%E5%9B%BE/%E4%B8%93%E9%A2%98%E9%A1%B5_01.jpg',
        height: "0"
      },
      {
        url: 'https://uvpt.uvanart.com/upload/static/%E5%BC%80%E5%BA%97%E4%B8%8E3D/%E5%B9%BF%E5%B7%9E%E5%BA%97%E5%BC%80%E4%B8%9AUI%E5%9B%BE/%E4%B8%93%E9%A2%98%E9%A1%B5%E5%88%87%E5%9B%BE/%E4%B8%93%E9%A2%98%E9%A1%B5_02.jpg',
        height: "0"
      },
      {
        url: 'https://uvpt.uvanart.com/upload/static/%E5%BC%80%E5%BA%97%E4%B8%8E3D/%E5%B9%BF%E5%B7%9E%E5%BA%97%E5%BC%80%E4%B8%9AUI%E5%9B%BE/%E4%B8%93%E9%A2%98%E9%A1%B5%E5%88%87%E5%9B%BE/%E4%B8%93%E9%A2%98%E9%A1%B5_03.jpg',
        height: "0"
      },
      {
        url: 'https://uvpt.uvanart.com/upload/static/%E5%BC%80%E5%BA%97%E4%B8%8E3D/%E5%B9%BF%E5%B7%9E%E5%BA%97%E5%BC%80%E4%B8%9AUI%E5%9B%BE/%E4%B8%93%E9%A2%98%E9%A1%B5%E5%88%87%E5%9B%BE/%E4%B8%93%E9%A2%98%E9%A1%B5_04.jpg',
        height: "0"
      },
      {
        url: 'https://uvpt.uvanart.com/upload/static/%E5%BC%80%E5%BA%97%E4%B8%8E3D/%E5%B9%BF%E5%B7%9E%E5%BA%97%E5%BC%80%E4%B8%9AUI%E5%9B%BE/%E4%B8%93%E9%A2%98%E9%A1%B5%E5%88%87%E5%9B%BE/%E4%B8%93%E9%A2%98%E9%A1%B5_05.jpg',
        height: "0"
      }
    ],
    hiddenBtn: true
  },


  loadImg: function (e) {
    console.log(e)
    var bl = e.detail.width / e.detail.height;//原图比例
    var sjheight = wx.getSystemInfoSync().windowWidth / bl//显示实际高度
    var i = e.currentTarget.dataset.id;
    var string = "imgUrl[" + i + "].height";
    this.setData({
      string: sjheight,
      hiddenBtn: false
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

  // 跳转到广州实体店预约页面

  ToGZPage: function(e){
    console.log(e)
    wx.navigateTo({
      // url: '../../physicalStore/physicalStorexq/physicalStorexq?id=' + e.currentTarget.dataset.id,
      url: '../../physicalStore/guangzhoushop/guangzhougshop'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
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