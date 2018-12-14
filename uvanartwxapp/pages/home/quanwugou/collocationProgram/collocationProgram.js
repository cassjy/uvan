var api = require("../../../../utils/API/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
  },
  onLoad: function(options) {
    var _this = this;
    console.log(options)
    wx.showLoading({
      title: '加载中...',
    })
    let data = {
      id: options.schemeid,
      name: options.schemename
    }
    api.get('/s2b/wholehousepurchase/getschemedetails', data).then(res => {
      console.log(res)
      if (res.code == 200) {
        _this.setData({
          dataList: res.data
        })
      } else {
        wx.showToast({
          title: '数据请求失败！',
          icon: 'none'
        })
      }
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '系统错误！',
        icon: 'none'
      })
    })
  },

  // to详情页
  toDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: "../../../categories/detail/detail?index=" +
        e.currentTarget.dataset.f_productid +
        "&catename=" + '全屋购'
    });
  },
  // 去购物
  tobuy() {
    wx.navigateTo({
      url: 'specification/specification?data=' + JSON.stringify(this.data.dataList),
    })
  }

})