var api = require("../../../../utils/API/request.js")
var common = require("../../../../utils/common.js")
import { getsharerecords } from '../../../../utils/API/me/api.js'
var page = 1;
var pages = 1;//从第几条开始
var count = 10;
var effectday = []

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
    effectday:[],
    noRecord: true,
    length: 0,
    page: 0,
    isHidden: false,
    navLable: "0",
    id: '',
    hisId: '',
    status: '',
    userType: "梵星,访客",
    loadMore: true,
    noMore: true,
    hideLoading: true
  },
  onLoad: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var d = new Date()
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
     wx.setNavigationBarTitle({
      title: '有效访问'
    })
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
    common.visitorRecordAPI(stayTime_JY,"有效访问")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"有效访问")
  },
  // 传播记录数据加载(时间筛选传参数，非时间筛选不传参数)
  loadData: function (startTime, finishTime, status="B", userType) {
    console.log('类型')
    console.log(status)
    console.log(userType)
    var _this = this;
    this.setData({
      hideLoading: false
    })
    try {
      // 获取用户的openId、phone和token
      var openid = wx.getStorageSync('openid');
      // var openid = "oQCP70MPtwP7D-De4cYFKpxmfGfs"
      var phone = wx.getStorageSync('phone');
      // var phone = "13192294647"
      var token = wx.getStorageSync('token');
      // var token = "bf2effb3-65f1-487b-b31b-8299d7a81599"
      // page是从第几条开始搜索，limit是允许一页显示的条数，startTime和finishTime分别代表起始时间和结束时间
      var codedata = {
        "token": token,
        "loginMark": phone,
        "data": { "openid": openid, "page": pages, "limit": count, "start_time": startTime, "end_time": finishTime, "status": "B", "userType":  "梵星,访客" }
      }
      var header = "application/json";
      getsharerecords(codedata, header).then(function (res) {
        console.log(res)
        // 判断是否有传播记录
        if (res.data.Total == 0) {
          _this.setData({
            noRecord: false,
            noMore: true
          })
        } else {
          _this.setData({
            noRecord: true,
            noMore: true
          })
        }
        // 每次加载把获取的数据存放到data数组
        var data = _this.data.listData
        for (var i = 0; i < res.data.Data.length; i++) {
          data.push(res.data.Data[i])
          console.log(res.data.Data[i].InvalidTime)
          let sday = new Date().getTime(),
            eday = new Date((res.data.Data[i].InvalidTime).replace(/-/g, "/")).getTime(),
              num = eday-sday
          console.log(parseInt(num/1000/60/60/24))
          if ((num/1000/60/60/24)<0){
            effectday.push('-1')
            // _this.data.effectday.push('-1')
          }else if(parseInt(num/1000/60/60/24)<1){
            effectday.push("<1")
            // _this.data.effectday.push("<1")
          }else if(parseInt(num/1000/60/60/24)>=1){
            effectday.push(parseInt(num/1000/60/60/24)+'')
            // _this.data.effectday.push(parseInt(num/1000/60/60/24)+'')
          }
        }
        console.log(_this.data.effectday)
        _this.setData({
          page: Math.ceil(res.data.Total / 10), //取得加载数据的页码（每页10条）
          listData: data,
          effectday: effectday
        })
        console.log(_this.data.page)
        console.log(_this.data.listData)
        // 判断是否加载完全部数据
        if (res.data.total != 0 && (_this.data.listData.length >= res.data.total)) {
          _this.setData({
            noMore: false
          })
        } else {
          _this.setData({
            noMore: true
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
  showText: function (e) {
    console.log(e)
    var _this = this;
    // 获取历史ID
    var hisId = this.data.id;
    var nowId = e.currentTarget.dataset.id;
    if (nowId == hisId) {
      this.setData({
        id: e.currentTarget.dataset.id,
        isHidden: !_this.data.isHidden
      })
    } else {
      this.setData({
        id: e.currentTarget.dataset.id,
        isHidden: true
      })
    }
    console.log(_this.data.isHidden)
  },


  //起始时间
  changeStartDate: function (e) {
    console.log(e)
    this.setData({
      startingTime: e.detail.value
    })
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
    var startTime = this.data.startingTime;  //起始时间
    var finishTime = this.data.finishTime;  //结束时间
    // 筛选数据时先清空listData数组
    this.setData({
      listData: []
    })
    // 再次判断数组长度是否为0
    if (this.data.listData.length != 0) {
      this.setData({
        listData: []
      })
    }
    // 重置全部变量
    pages = 1;
    page = 1;
    this.loadData(startTime, finishTime, '');
  },

  //  上拉加载
  onReachBottom: function () {
    console.log('上拉加载')
    console.log(this.data.status)
    console.log(pages)
    if (page == this.data.page) {
        wx.showToast({
          title: '到底了',
        })
        return;
    }else if (page < this.data.page) {
      page++;
      pages += count;
      this.setData({
        loadMore: false
      })
      wx.showNavigationBarLoading();
      this.loadData(this.data.startingTime,this.data.finishTime);
    }
    else {
      wx.showToast({
        title: '到底了',
      })
      return;
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
    //   navLable: '',
    //   status: '',
    //   userType: ''
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