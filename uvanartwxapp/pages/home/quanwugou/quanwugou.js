var api = require("../../../utils/API/request.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    noDate: false,
    page: 1,
    pageAll: 0,
    limit: 10
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.getQuanwugouData()
  },

  // 获取搭配方案
  getQuanwugouData() {
    var _this = this;
    let data = {
      page: this.data.page,
      limit: this.data.limit
    }
    api.get('/s2b/wholehousepurchase/getschemelist', data).then(res => {
        console.log(res)
        if (res.code == 200) {
          let list = this.data.dataList.concat(res.data.list)
          _this.setData({
            dataList: list,
            pageAll: Math.ceil(res.data.total/this.data.limit)
          })
        } else {
          this.setData({
            noDate: true
          })
        }
        wx.hideLoading()
      })
      .catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '系统错误！',
          icon: 'none'
        })
      })
  },

  // to搭配方案详情页
  toCollocationProgram(e) {
    console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: 'collocationProgram/collocationProgram?schemeid=' + this.data.dataList[parseInt(e.currentTarget.dataset.index)].schemeid + '&schemename=' + this.data.dataList[parseInt(e.currentTarget.dataset.index)].schemename,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('到底了')
    if (this.data.pageAll==this.data.page){
      wx.showToast({
        title: '已经到底了~',
        icon:'none'
      })
      return
    } else if (this.data.page<this.data.pageAll){
      this.setData({
        page: this.data.page+1
      })
      wx.showLoading({
        title: '加载中...',
      })
      this.getQuanwugouData()
    }
  }
})