var api = require("../../../../utils/API/request.js")
var common = require("../../../../utils/common.js")
import { GetMyChangedUvanStars } from '../../../../utils/API/me/api.js'
var page = 1;//从第几页开始
var pages = 1;//一共多少页
var count = 10;

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startingTime: '2018-01-01',
    nowDate: '',
    finishTime: '',
    finishTime2: '',
    listData: [],
    noRecord: true,
    length: 0,
    page: 0,
    isHidden: false,
    id: '',
    hisId: '',
    loadMore: true,
    noMore: true,
    hideLoading: true,
    changeType: ["全部","访客失效", "梵星失效","蒲公英失效"],
    index:0
  },
  onLoad: function () {
    var _this = this;
    var d = new Date()
    wx.showLoading({
      title: '加载中...',
    })
    // 获取当天日期
    var day = d.getDate(),
      oday = d.getDate(),
      month = d.getMonth() + 1,
      year = d.getFullYear()
    if (month - 6 <= 0) {
      var omonth = d.getMonth() + 1 + 6,
        oyear = d.getFullYear() - 1
    } else {
      omonth = d.getMonth() + 1 - 6,
        oyear = d.getFullYear()
    }
    if (day < 10) {
      day = "0" + day
    }
    if (oday < 10) {
      oday = "0" + oday
    }
    if (month < 10) {
      month = "0" + month
    }
    if (omonth < 10) {
      omonth = "0" + omonth
    }
    this.setData({
      finishTime2: year + "-" + month + "-" + day,
      finishTime: year + "-" + month + "-" + day,
      nowDate: year + "-" + month + "-" + day
    })
    pages = 1;
    page = 1;
    this.loadData();
  },
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
    common.visitorRecordAPI(stayTime_JY,"有效期更变")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"有效期更变")
  },
  changeType:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({ index: e.detail.value})
  },
  // 传播记录数据加载(时间筛选传参数，非时间筛选不传参数)
  loadData: function (startTime="", finishTime="", index=0) {
    // debugger
    var typeMap = {
      0:' ',
      1:'A',
      2:'B',
      3:'C'
    }
    var status=typeMap[index]
    var _this = this;
    this.setData({
      hideLoading: false
    })
    try {
      // 获取用户的  phone和token
      var phone = wx.getStorageSync('phone');
      var token = wx.getStorageSync('token');
      // var token = '6bd0fcb2-82f9-40cd-8e46-3418c73a7d94';
      // var phone ='13336400394'
      // page是从第几条开始搜索，limit是允许一页显示的条数，startTime和finishTime分别代表起始时间和结束时间
      var codedata = {
        "token": token,
        "loginMark": phone,
        "data": { "page": page, "limit": count, "StartTime": startTime, "EndTime": finishTime, "ChangeType": status }
      }
      var header = "application/json";
      GetMyChangedUvanStars(codedata, header).then(function (res) {
        if(res.code == 200){
          // 判断是否有传播记录
          res.data.Total == 0 ? _this.setData({ noRecord: false, noMore: true}): _this.setData({noRecord: true,noMore: true});
            (res.data.Total != 0 && (_this.data.listData.length >= res.data.Total)) ? _this.setData({ noMore: false }) : _this.setData({ noMore: true })
          // 每次加载把获取的数据存放到data数组
          var data =_this.data.listData;
           data = data.concat(res.data.Data);
          pages = Math.ceil(res.data.Total / count)
          page++
          _this.setData({
            listData: data,
          })
        }
      })
        .catch(res => {
          console.log(res);
        })
        .then(function (res) {
          console.log('加载完成')
          wx.hideNavigationBarLoading()
          wx.hideLoading()
          _this.setData({
            loadMore: true,
            hideLoading: true
          })
        })

    } catch (e) {
      console.log(e)
    }

  },
  //  点击显示隐藏信息


  //起始时间
  changeStartDate: function (e) {
    console.log(e)
    this.setData({
      startingTime: e.detail.value
    })
    if ((this.data.finishTime).split(' ')[1] == undefined){
      this.setData({
        finishTime: this.data.finishTime + ' 23:59:59'
      })
    }
    this.screenData()
  },
  // 完成时间
  changeFinishDate: function (e) {
    var _this = this;
    this.setData({
      finishTime2: e.detail.value,
      finishTime: e.detail.value + ' 23:59:59',  //结束时间+1
    })
    this.screenData()
  },

  //  筛选数据
  screenData: function () {
    wx.showLoading({
      title: '加载中...',
    })
    // 筛选数据时先清空listData数组
    this.setData({
      listData: []
    })
    // 再次判断数组长度是否为0
    // 重置全部变量
    pages = 1;
    page = 1;
    this.loadData(this.data.startingTime, this.data.finishTime, this.data.index);
  },

  //  上拉加载
  onReachBottom: function () {
    if (page > pages) {
        wx.showToast({
          title: '到底了',
        })
        this.setData({
          noMore: false
        })
        return;
    }else{
      this.setData({
        loadMore: false
      })
      wx.showNavigationBarLoading();
      this.loadData(this.data.startingTime,this.data.finishTime,this.data.index);
    }
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // console.log('下拉刷新')
    // page = 1;
    // pages = 1;
    // this.setData({
    //   listData: [],
    //   startingTime: '',
    //   finishTime: '',
    //   finishTime2: '',
    //   isHidden: false,
    //   index:0
    // })
    // if (this.data.listData.length != 0) {
    //   this.setData({
    //     listData: []
    //   })
    // }
    // this.loadData();
    // wx.showToast({
    //   title: '刷新成功',
    //   icon: 'loading',
    //   duration: 400
    // })
    // wx.stopPullDownRefresh();
  }
})