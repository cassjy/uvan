var api = require('../../../../utils/API/request.js')
var common = require("../../../../utils/common.js")
import { getuvanstars } from "../../../../utils/API/me/api.js"
var page = 1;
var count = 10;
var refresh = true; //下拉刷新全局变量

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    defaultImg: 'https://uvpt.uvanart.com/upload/static/fail/dandelion.png',
    num: '',
    openId: '',
    page: '', //总页码
    token: '',
    myImg:'', //我的头像
    myNickName: '', //我的用户名
    loadingMore: true,
    noMore: true, //没有更多梵星
    touxiangimg: '',
    username: ''
  },


  loadData: function () {
    var _this = this;
    try {
      // 获取用户的openId和phone
      var openid = wx.getStorageSync('openid');
      var phone = wx.getStorageSync('phone')
      var token = wx.getStorageSync('token');
      var url = '/lr/s2bapi/getuvanstars?page=' + page + '&limit=' + count ;
      // var url = '/lr/s2bapi/getuvanstars?token=84c6e70f-a56b-46bc-a1c1-350182431087&loginMark=13726274026&data={openid:"oQCP70DjNuZEaOBhGIMd7Y17tX9c", page:' + page + ',limit:' + count + '}';
      getuvanstars(page, count).then(function (res) {
        console.log(res)
        var list = _this.data.dataList;
        for (var i = 0; i < res.data.Data.length; i++) {
          list.push(res.data.Data[i])
        }
        _this.setData({
          page: Math.ceil(res.data.Total / 10),
          dataList: list,
        })
        _this.setData({
          myNickName: _this.data.dataList[0].nickName,
          myImg: _this.data.dataList[0].imageUrl,
        })
        if (page == _this.data.page){
          _this.setData({
            noMore: false
          })
        }
        console.log(_this.data.dataList)
        console.log(_this.data.page)
      })
        .catch(res => {
          console.log(res);
        })
        .then(res => {
          _this.setData({
            loadingMore: true
          })
          refresh = true;
          wx.hideLoading()
        })
    } catch (e) {

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    page = 1;
    this.setData({
      touxiangimg: options.touxiangimg,
      username: options.username
    })
    wx.showLoading({
      title: '加载中...',
    })
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(){
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(()=>{
      stayTime_JY++
    },1000)
  },
  onHide: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"梵星列表")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"梵星列表")
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉')
    page = 1;
    this.setData({
      dataList: [],
      noMore: true
    })
    if (this.data.dataList.length != 0) {
      this.setData({
        dataList: []
      })
    }
    if (refresh){
      refresh = false; //禁止因为网络延迟用户多次刷新
      this.loadData();
    }else{
      return
    }
    wx.showToast({
      title: '刷新成功',
      icon: 'loading',
      duration: 400
    })
    wx.stopPullDownRefresh();
    wx.showLoading({
      title: '加载中...',
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(page)
    if (page == this.data.page) {
      this.setData({
        noMore: false
      })
      wx.showToast({
        title: '到底了',
      })
      return;
    } else if (page < this.data.page) {
      page++;
      this.setData({
        loadingMore: false
      })
      this.loadData();
    }
    else {
      this.setData({
        noMore: false
      })
      wx.showToast({
        title: '到底了',
      })
      return;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})