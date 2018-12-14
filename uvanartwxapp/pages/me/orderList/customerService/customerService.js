var api = require('../../../../utils/API/request.js')
import { getorderdetaildata } from '../../../../utils/API/me/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    fid: '',
    value1: '仅退货',
    value2: '退货退款',
    formPinTuan: ''
  },


  // 退款跳转
  refund: function (e) {
    console.log(e)
    wx.navigateTo({
      url: 'refund/refund?fid=' + e.currentTarget.dataset.fid + '&id=' + e.currentTarget.dataset.id + '&Combination=' + e.currentTarget.dataset.combination + '&value=' + e.currentTarget.dataset.value + '&formPinTuan=' + this.data.formPinTuan,
    })
  },

  // 退货退款跳转
  refund1: function (e) {
    wx.navigateTo({
      url: 'refund/refund?fid=' + e.currentTarget.dataset.fid + '&id=' + e.currentTarget.dataset.id + '&Combination=' + e.currentTarget.dataset.combination + '&value=' + e.currentTarget.dataset.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    //  存拼团传来的标志隐藏退货退款模块
    if (options.formPinTuan != 'undefined') {
      debugger;
      this.setData({
        formPinTuan: options.formPinTuan
      })
    }

    // 获取用户openID、手机号码、token等
    try {
      var token = wx.getStorageSync('token');
      var openid = wx.getStorageSync('openid');
      var phone = wx.getStorageSync('phone');
      var data = {
        "token": token,
        "loginMark": phone,
        "data": { 'fid': options.fid, 'limit': '0', 'page': '0' }
      }
      getorderdetaildata(data).then(res => {
        console.log(res)
        _this.setData({
          dataList: res.data.goods,
          fid: res.data.order.F_ID
        })
        console.log(_this.data.dataList)
      })
        .catch(res => {
          console.log(res)
        })
        .then(res => {
          wx.hideLoading()
        })
    } catch (e) {
      console.log(e)
    }
  }

})