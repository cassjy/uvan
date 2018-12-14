var api = require("../../../utils/API/request.js")
var common = require("../../../utils/common.js")
import {
  GetUserIncomeProfit,
  GetDandelionEarnings,
  GetUserIncomeBalance,
  Details
} from '../../../utils/API/me/api.js'

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
var page = 1;
var count = 5;
Page({
  data: {
    income: 0.00,
    rest: 0.00,
    grand: {},
    noRecord: true,
    dataList: [],
    totalPage: '', //总页数
    // hasOrder: true
  },
  onLoad: function() {
    // this.setData({
    // 	rest: this.data.income
    // })
    this.getDateData();
    this.getUserIncomeProfit();
    this.getUserIncomeBalance()
  },
  getUserIncomeProfit() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var url = "/s2b/incomecash/GetUserIncomeProfit",
      data = {
        token: wx.getStorageSync('token'),
        loginMark: wx.getStorageSync('phone')
      }
    GetUserIncomeProfit(data)
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          this.setData({
            UserIncomeProfit: res.data
          })
        } else if (res.code == 400) {
          this.setData({
            UserIncomeProfit: 0
          })
        }
        wx.hideLoading();
      })
  },
  getUserIncomeBalance() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var url = "/s2b/incomecash/GetUserIncomeBalance",
      data = {
        token: wx.getStorageSync('token'),
        loginMark: wx.getStorageSync('phone')
      }
    GetUserIncomeBalance(data)
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          this.setData({
            UserIncomeBalance: res.data
          })
        } else if (res.code == 400) {
          this.setData({
            UserIncomeBalance: 0
          })
        }
        wx.hideLoading();
      })
  },
  getDateData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var url = "/s2b/k3cloud/GetDandelionEarnings",
      data = {
        token: wx.getStorageSync('token'),
        loginMark: wx.getStorageSync('phone')
      }
    GetDandelionEarnings(data)
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          this.setData({
            grand: res.data
            // hasOrder: true
          })
        } else if (res.code == 400) {
          this.setData({
            // hasOrder: false
            grand: {
              "FDayPrice": 0,
              "FWeekPrice": 0,
              "FMonthPrice": 0,
              "FLastMonthPrice": 0,
              "FAllPrice": 0
            }
          })
        }
        wx.hideLoading();
      })
  },
  onShow: function() {
    //开始计时（停留时间）
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
    page = 1;
    this.setData({
      dataList: []
    })
    this.requireReturnsDetailed(); //收益明细列表
  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "累计收益")
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "累计收益")
  },

  // 请求收益明细列表
  requireReturnsDetailed() {
    let data = {
      page: page,
      limit: count
    }
    Details(data).then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.code == 200) {
        let list = this.data.dataList;
        for (let i = 0; i < res.data.Data.length;i++){
          list.push(res.data.Data[i])
        }
        this.setData({
          noRecord: true,
          dataList: list,
          totalPage: Math.ceil(res.data.Total/count)
        })
        console.log(this.data.totalPage)
      } else if (res.code == 400) {
        this.setData({
          noRecord: false
        })
      }
    })

  },
  back: function() {
    wx.switchTab({
      url: '../me?type=false'
    })
  },
  toCash: function() {
    const _this = this
    wx.navigateTo({
      url: './cash/cash?FAllPrice=' + _this.data.UserIncomeBalance
    })
  },
  toTips: function() {
    this.setData({
      showTips: true
    })
  },
  toOK: function() {
    this.setData({
      showTips: false
    })
  },
  onReachBottom: function () {
    console.log('上拉加载')
    if (this.data.totalPage==page){
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    }else{
      page ++;
      wx.showLoading({
        title: '加载中',
      })
      this.requireReturnsDetailed()
    }
  }
})