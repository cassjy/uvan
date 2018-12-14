var api = require("../../../utils/API/request.js");
var count = 10;
var page = 1;
Page({
  data: {
    sale:0,
    page:1,
    dataList:[]
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.getsaledata();
  },
  getsaledata(){
    var _this = this,
      data = {},
      header = "application/json",
      token = wx.getStorageSync('token');
    api.get('/s2b/vanbean/GetCustomerExpectedReturnTotal', data, header, token).then(response => {
      console.log(response)
      if (response.code == 200) {
        _this.getlistdata();
        _this.setData({
          sale: response.data
        })
      } else if (response.code == 400) {
        wx.hideLoading();
        wx.showToast({
          title: response.info,
          icon: 'none',
          duration: 1500
        })
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '收益获取失败！',
          icon: 'none',
          duration: 1500
        })
      }
    }).catch(error =>{
      wx.hideLoading();
      console.log(error);
      wx.showToast({
        title: '服务器繁忙！',
        icon: 'none',
        duration: 1500
      })
    })

  },
  getlistdata(){
    var _this = this,
      data = {
        page:this.data.page,
        limit:6
      },
      header = "application/json",
      token = wx.getStorageSync('token');

    api.get('/s2b/vanbean/GetExpectedReturnList', data, header, token).then(response => {
      console.log(response)
      wx.hideLoading();
      if (response.code == 200) {
        if (response.data.length === 0){
          wx.showToast({
            title: '到底了',
            icon: 'none',
            duration: 1500
          })
        }
        _this.setData({
          dataList: _this.data.dataList.concat(response.data),
          page:this.data.page + 1
        })

      } else if (response.code == 400){
        wx.showToast({
          title: response.info,
          icon: 'none',
          duration: 1500
        })
      }
    }).catch(error => {
      debugger
      wx.hideLoading();
      console.log(error);
      wx.showToast({
        title: '服务器繁忙！',
        icon: 'none',
        duration: 1500
      })
    })
  },
  onShow: function () {

  },
  onReachBottom: function () {
    console.log('触发上拉')
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.getlistdata()
  },

})