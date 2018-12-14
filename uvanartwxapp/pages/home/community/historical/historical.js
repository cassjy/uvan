var api = require('../../../../utils/API/request.js')
import { GetQuestionNaire, GetAfterSalesService } from "../../../../utils/API/home/api.js"
var page = 1;
var count = 15;
var mark;  //定义一个全局变量用于判断下拉加载请求的接口是哪个
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    dataPage: '', //数据页码(一页十条)
    hiddenNoMore: true,
    dataList2: [], //历史问卷
    stateId: '',
    tipsText: '已经加载全部售后啦~',
    hiddenNoRecord: true,
    noRecord:'暂无历史售后记录~'
  },

  // 售后详情/问卷详情页入口
  toCommunity: function (e) {
    console.log(e)
    wx.navigateTo({
      url: 'saleDetail/saleDetail?data=' + JSON.stringify(this.data.dataList[e.currentTarget.dataset.id]) + '&state=' + this.data.stateId,
    })
  },

  // 售后服务数据加载公用方法
  loadData: function () {
    var _this = this;
    mark = 1;
    let data = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": { "page": page, "limit": count }
    }
    let header = "application/json";
    GetAfterSalesService(data, header).then(res => {
      console.log(res)
      if (res.code==200&&res.data.Total == 0) {
        _this.setData({
          hiddenNoRecord: false,
          noRecord: '暂无历史售后记录~'
        })
      } else if (res.code == 400) {
        wx.showToast({
          title: '访问受限',
          icon: 'none'
        })
      }
      let prepareList = _this.data.dataList; //预存数组
      for (let i = 0; i < res.data.Data.length; i++) {
        prepareList.push(res.data.Data[i])  //遍历返回的数据并存放到预存数组
      }
      _this.setData({
        dataList: prepareList,
        dataPage: Math.ceil(res.data.Total / count)
      })
      if (_this.data.dataPage == 1 || page == _this.data.dataPage) {
        _this.setData({ hiddenNoMore: false })   //页码为1时显示底部的没有更多
      }
    })
      .catch(res => {
        console.log(res)
        wx.showToast({
          title: '加载失败',
          icon:'none'
        })
      })
      .then(() => {
        wx.hideLoading()
      })
  },

  // 问卷调查数据加载
  loadWenJuanData: function () {
    var _this = this;
    mark = 2;
    // var wenJuanUrl = '/lr/s2bapi/GetQuestionNaire?token=' + wx.getStorageSync('token') + '&loginMark=' + wx.getStorageSync('phone') + '&data=' + '{limit:' + count + ',page:' + page + '}';
    GetQuestionNaire(count, page).then(res => {
      console.log(res)
      if (res.code == 200 && res.data.Total==0){
        _this.setData({
          hiddenNoRecord: false,
          noRecord: '暂无历史问卷记录~'
        })
      }else if(res.code==400){
        wx.showToast({
          title: '访问受限',
          icon:'none'
        })
      }
      let prepareList = _this.data.dataList; //预存数组
      for (let i = 0; i < res.data.Data.length; i++) {
        prepareList.push(res.data.Data[i])  //遍历返回的数据并存放到预存数组
      }
      _this.setData({
        dataList: prepareList,
        dataPage: Math.ceil(res.data.Total / count)
      })
      if (_this.data.dataPage == 1 || page == _this.data.dataPage) {
        _this.setData({ hiddenNoMore: false })   //页码为1时显示底部的没有更多
      }
      console.log(_this.data.dataList)
      console.log(_this.data.dataPage)
    })
      .catch(res => {
        console.log(res)
      })
      .then(() => {
        wx.hideLoading()
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    console.log(options)
    wx.showLoading({
      title: '加载中...',
    })
    switch (options.id) {
      case '1':
        this.setData({
          stateId: options.id,
        })
        this.loadData();  //执行售后列表接口方法
        break;
      case '2':
        wx.setNavigationBarTitle({
          title: '历史问卷',
        })
        this.setData({
          stateId: options.id,
          dataList: this.data.dataList2,
          tipsText: '已经加载全部历史问卷啦~'
        })
        this.loadWenJuanData(); //执行问卷列表接口方法
        wx.hideLoading()
        break;
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    console.log('触发上拉')
    console.log(this.data.dataPage)
    console.log(page)
    if (page == this.data.dataPage) {
      this.setData({
        hiddenNoMore: false
      })
      wx.showToast({
        title: '到底了',
      })
    } else if (page < this.data.dataPage) {
      page++;
      wx.showLoading({
        title: '加载中...',
      })
      if (mark == 1) {
        this.loadData();  //执行售后服务接口
      } else if (mark == 2) {
        this.loadWenJuanData(); //执行满意问卷接口
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})