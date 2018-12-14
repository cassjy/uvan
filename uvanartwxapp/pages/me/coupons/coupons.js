var api = require("../../../utils/API/request.js");
import { UserCoupons } from '../../../utils/API/me/api.js'
var count = 5;
var page = 1;
var data; //优惠券标志
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navNum: 1,
    hiddenShadow: true, //默认隐藏优惠券规则弹框
    noCoupons: false,  //没有优惠券
    couponsList: [],  //有效优惠券
    failCouponsList: [], //无效优惠券
    page: '' //优惠券页码
  },

  // 标签选择
  navCheck: function (e) {
    console.log(e)
    let hisId = this.data.navNum
    if (parseInt(e.currentTarget.dataset.id) == hisId) {
      console.log('重复点击同一个标签')
      return;
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      page = 1;
      this.setData({
        couponsList: [],
        failCouponsList: [],
        navNum: parseInt(e.currentTarget.dataset.id)
      })
      if (parseInt(e.currentTarget.dataset.id) == 1) {
        data = 'w';
        this.getCouponsData(data);
      } else if (parseInt(e.currentTarget.dataset.id) == 2) {
        data = 'y';
        this.getCouponsData(data);
      }
    }
  },

  // 优惠券规则显示
  showRlue: function () {
    this.setData({
      hiddenShadow: false
    })
  },

  // 确认关闭规则
  ImSure: function () {
    this.setData({
      hiddenShadow: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    data = 'w';
    this.getCouponsData(data);
  },


  //  请求优惠券数据公用方法
  getCouponsData: function (data) {
    var _this = this
    let couponsData = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": {
        "status": data,
        "limit": count,
        "page": page
      }
    }
    let header = 'application/json'
    UserCoupons(JSON.stringify(couponsData), header).then(res => {
    console.log(res)
    if (res.code == 400) {
      _this.setData({
        noCoupons: true
      })
    } else if (res.code == 200) {
      if (data == 'w') {
        let fzList = _this.data.couponsList;
        for (let i = 0; i < res.data.data.length; i++) {
          fzList.push(res.data.data[i])
        }
        _this.setData({
          couponsList: fzList,
          page: Math.ceil(res.data.total / count),
          noCoupons: false
        })
        console.log(_this.data.page)
      } else if (data = 'y') {
        let fzList2 = _this.data.failCouponsList;
        for (let i = 0; i < res.data.data.length; i++) {
          fzList2.push(res.data.data[i])
        }
        _this.setData({
          failCouponsList: fzList2,
          page: Math.ceil(res.data.total / count),
          noCoupons: false
        })
      }

    }
    })
      .catch(error => {
        console.log(error)
      })
      .then(() => {
        wx.hideLoading()
      })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触发上拉')
    console.log(data)
    console.log(page)
    if (page >= this.data.page) {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    } else {
      page++
      console.log(`页码:${page}`)
      this.getCouponsData(data)
    }

  },

})