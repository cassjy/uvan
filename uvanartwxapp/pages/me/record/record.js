var api = require("../../../utils/API/request.js")
var common = require("../../../utils/common.js")
import {
  getsharerecords
} from '../../../utils/API/me/api.js'
var page = 1;
var pages = 1; //从第几条开始
var count = 10;

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startingTime: '',
    nowDate: '',
    finishTime: '',
    finishTime2: '',
    listData: [],
    noRecord: true,
    page: 0,
    isHidden: false,
    navLable: "0",
    id: '',
    hisId: '',
    status: '',
    userType: '',
    loadMore: true,
    noMore: true,
    beginTime: '',
    tipsId: -1,
    tipsShow: true,
    top: ''
  },
  onLoad: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var d = new Date()
    d.setDate(d.getDate())
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
    // 改造一周前时间
    d.setDate(d.getDate() - 6)
    var day1 = d.getDate(),
      oday1 = d.getDate(),
      month1 = d.getMonth() + 1,
      year1 = d.getFullYear()
    this.setData({
      finishTime2: year + "-" + month + "-" + day,
      finishTime: year + "-" + month + "-" + day,
      startingTime: year1 + "-" + month1 + "-" + day1,
      nowDate: year + "-" + month + "-" + day
    })
    // 重置全部变量
    pages = 1;
    page = 1;
    this.loadData(this.data.startingTime, this.data.finishTime + ' 23:59:59');
  },
  onShow: function() {
    //开始计时（停留时间）
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "传播记录")
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "传播记录")
  },
  // 传播记录数据加载(时间筛选传参数，非时间筛选不传参数)
  loadData: function(startTime, finishTime, status, userType) {
    console.log('类型')
    console.log(userType)
    var _this = this;
    // this.loading = this.selectComponent("#loading");
    // this.loading.showToast();//调用组件内的方法，弹窗显示
    try {
      // 获取用户的openId、phone和token
      var openid = wx.getStorageSync('openid');
      var phone = wx.getStorageSync('phone');
      var token = wx.getStorageSync('token');
      // page是从第几条开始搜索，limit是允许一页显示的条数，startTime和finishTime分别代表起始时间和结束时间
      var codedata = {
        "data": {
          "openid": openid,
          "page": pages,
          "limit": count,
          "start_time": startTime,
          "end_time": finishTime,
          "status": status,
          "userType": userType
        }
      }
      var header = "application/json";
      getsharerecords(codedata, header).then(function(res) {
          console.log(res)
          // 判断是否有传播记录
          if (res.data.Total == 0 || res.code == 400) {
            _this.setData({
              noRecord: false,
              noMore: true
            })
          } else {
            _this.setData({
              noRecord: true
            })
          }
          // 每次加载把获取的数据存放到data数组
          var data = _this.data.listData;
          for (var i = 0; i < res.data.Data.length; i++) {
            data.push(res.data.Data[i])
          }

          _this.setData({
            page: Math.ceil(res.data.Total / 10), //取得加载数据的页码（每页10条）
            listData: data
          })
          console.log(_this.data.listData)
          //判断当前页面是否为最后的页码
          console.log(_this.data.page)
          console.log(pages)
          if (_this.data.page == pages) {
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
        .then(function(res) {
          console.log('加载完成')
          wx.hideNavigationBarLoading()
          wx.hideLoading()
          // _this.loading.hideToast();
          _this.setData({
            loadMore: true,
          })
        })

    } catch (e) {
      console.log(e)
    }

  },

  // 导航栏标签选择
  touchNav: function(e) {
    console.log(e)
    wx.showLoading({
      title: '加载中...',
    })
    // 重置全部变量
    pages = 1;
    page = 1;
    // 选择有效筛选数据时先清空listData数组和把noMore设为默认值
    this.setData({
      listData: [],
      noMore: true
    })
    // 再次判断数组长度是否为0
    if (this.data.listData.length != 0) {
      this.setData({
        listData: []
      })
    }
    //把点击的标签id存进navLable
    this.setData({
      navLable: e.currentTarget.dataset.id
    })
    var status1 = 'A'; //无效数据
    var status2 = 'B'; //有效数据
    if (this.data.startingTime == '' && this.data.finishTime == '') {
      console.log('空的也输出?')
      switch (e.currentTarget.dataset.id) {
        case "0": // 导航栏标签为全部
          this.setData({
            status: '',
            userType: '',
          })
          this.loadData();
          break;
        case "1": //导航栏标签为有效
          this.setData({
            status: status2,
            userType: ''
          })
          this.loadData('', '', 'B');
          break;
        case "2": //导航栏标签为无效
          this.setData({
            status: status1,
            userType: ''
          })
          this.loadData('', '', 'A');
          break;
        case "3": //导航栏标签为访客
          this.setData({
            status: '',
            userType: '访客'
          })
          this.loadData('', '', '', '访客');
          break;
        case "4": //导航栏标签为梵星
          this.setData({
            status: '',
            userType: '梵星'
          })
          this.loadData('', '', '', '梵星');
          break;
        case "5": //导航栏标签为蒲公英
          this.setData({
            status: '',
            userType: '蒲公英'
          })
          this.loadData('', '', '', '蒲公英');
          break;
      }
    } else {
      console.log(this.data.finishTime2)
      console.log(this.data.finishTime)
      if (this.data.finishTime == this.data.finishTime2) {
        this.setData({
          finishTime: ''
        })
      }
      switch (e.currentTarget.dataset.id) {
        case "0": // 导航栏标签为全部
          this.setData({
            status: '',
            userType: ''
          })
          this.loadData(this.data.startingTime, this.data.finishTime);
          break;
        case "1": //导航栏标签为有效
          this.setData({
            status: status2,
            userType: ''
          })
          this.loadData(this.data.startingTime, this.data.finishTime, 'B');
          break;
        case "2": //导航栏标签为无效
          this.setData({
            status: status1,
            userType: ''
          })
          this.loadData(this.data.startingTime, this.data.finishTime, 'A');
          break;
        case "3": //导航栏标签为访客
          this.setData({
            status: '',
            userType: '访客'
          })
          this.loadData(this.data.startingTime, this.data.finishTime, '', '访客');
          break;
        case "4": //导航栏标签为梵星
          this.setData({
            status: '',
            userType: '梵星'
          })
          this.loadData(this.data.startingTime, this.data.finishTime, '', '梵星');
          break;
        case "5": //导航栏标签为蒲公英
          this.setData({
            status: '',
            userType: '蒲公英'
          })
          this.loadData(this.data.startingTime, this.data.finishTime, '', '蒲公英');
          break;
      }
    }
  },

  //  点击显示隐藏信息
  showText: function(e) {
    console.log(e)
    var _this = this;
    this.setData({
      tipsShow: false
    })
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
  changeStartDate: function(e) {
    console.log(e)
    var bdate = new Date(e.detail.value) //开始时间
    bdate.setDate(bdate.getDate() + 6)
    var eday = bdate.getDate(), //改造后的结束时间
      emonth = bdate.getMonth() + 1,
      eyear = bdate.getFullYear()
    console.log(eyear + '-' + emonth + '-' + eday)
    this.setData({
      startingTime: e.detail.value,
      finishTime2: eyear + '-' + emonth + '-' + eday,
      finishTime: eyear + '-' + emonth + '-' + eday
    })
    console.log(this.data.finishTime2)
    this.screenData()
  },
  // 完成时间
  changeFinishDate: function(e) {
    var _this = this;
    var edate = new Date(e.detail.value) //结束时间
    edate.setDate(edate.getDate() - 6)
    var bday = edate.getDate(), //改造后的开始时间
      bmonth = edate.getMonth() + 1,
      byear = edate.getFullYear()
    this.setData({
      startingTime: byear + '-' + bmonth + '-' + bday,
      finishTime2: e.detail.value,
      finishTime: e.detail.value,
    })
    this.screenData()
  },

  //  筛选数据
  screenData: function() {
    wx.showLoading({
      title: '加载中...',
    })
    var startTime = this.data.startingTime; //起始时间
    var finishTime;
    if ((this.data.finishTime).split(' ')[1] != undefined) {
      finishTime = this.data.finishTime
    } else {
      finishTime = this.data.finishTime + ' 23:59:59'; //结束时间
    }
    this.setData({
      finishTime: finishTime
    })
    // debugger
    // 筛选数据时先清空listData数组和隐藏noMore
    this.setData({
      listData: [],
      noMore: true
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

    // 执行数据加载方法
    console.log('标签值' + this.data.navLable)
    var data = this.data.navLable
    switch (this.data.navLable) {
      case "0":
        this.loadData(startTime, finishTime, '');
        break;
      case "1":
        this.loadData(startTime, finishTime, 'B');
        break;
      case "2":
        this.loadData(startTime, finishTime, 'A');
        break;
      case "3":
        this.loadData(startTime, finishTime, '', '访客');
        break;
      case "4":
        this.loadData(startTime, finishTime, '', '梵星');
        break;
      case "5":
        this.loadData(startTime, finishTime, '', '蒲公英');
        break;
    }

  },

  //上拉公共方法
  PubMethods: function(startingTime, finishTime, status, userType) {
    if (page == this.data.page) {
      wx.showToast({
        title: '到底了',
      })
      this.setData({
        noMore: false
      })
      return;
    } else if (page < this.data.page) {
      page++;
      pages += count;
      this.setData({
        loadMore: false,
        noMore: true
      })
      wx.showNavigationBarLoading();
      this.loadData(startingTime, finishTime, status, userType);
    } else {
      wx.showToast({
        title: '到底了',
      })
      return;
    }
  },

  //  上拉加载
  onReachBottom: function() {
    if (this.data.startingTime == '' && this.data.finishTime == '' && this.data.status == '' && this.data.userType == '') {
      console.log("我在执行全部数据（无时间）")
      this.PubMethods();
    } else if (this.data.startingTime == '' && this.data.finishTime == '' && this.data.status == 'B') {
      console.log("我在执行有效数据（无时间）")
      this.PubMethods('', '', this.data.status);
    } else if (this.data.startingTime == '' && this.data.finishTime == '' && this.data.status == 'A') {
      console.log("我在执行无效数据（无时间）")
      this.PubMethods('', '', this.data.status);
    } else if (this.data.startingTime == '' && this.data.finishTime == '' && this.data.status == '' && this.data.userType == '访客') {
      console.log("我在执行访客数据（无时间）")
      this.PubMethods('', '', '', this.data.userType);
    } else if (this.data.startingTime == '' && this.data.finishTime == '' && this.data.status == '' && this.data.userType == '梵星') {
      console.log("我在执行梵星数据（无时间）")
      this.PubMethods('', '', '', this.data.userType);
    } else if (this.data.startingTime == '' && this.data.finishTime == '' && this.data.status == '' && this.data.userType == '蒲公英') {
      console.log("我在执行蒲公英数据（无时间）")
      this.PubMethods('', '', '', this.data.userType);
    } else if ((this.data.startingTime != '' || this.data.finishTime != '') && this.data.status == 'B') {
      console.log("我在执行有效数据（有时间）")
      this.PubMethods(this.data.startingTime, this.data.finishTime, this.data.status, '');
    } else if ((this.data.startingTime != '' || this.data.finishTime != '') && this.data.status == 'A') {
      console.log("我在执行无效数据（有时间）")
      this.PubMethods(this.data.startingTime, this.data.finishTime, this.data.status, '');
    } else if ((this.data.startingTime != '' || this.data.finishTime != '') && this.data.status == '' && this.data.userType == '访客') {
      console.log("我在执行访客数据（有时间）")
      this.PubMethods(this.data.startingTime, this.data.finishTime, '', this.data.userType);
    } else if ((this.data.startingTime != '' || this.data.finishTime != '') && this.data.status == '' && this.data.userType == '梵星') {
      console.log("我在执行梵星数据（有时间）")
      this.PubMethods(this.data.startingTime, this.data.finishTime, '', this.data.userType);
    } else if ((this.data.startingTime != '' || this.data.finishTime != '') && this.data.status == '' && this.data.userType == '蒲公英') {
      console.log("我在执行蒲公英数据（有时间）")
      this.PubMethods(this.data.startingTime, this.data.finishTime, '', this.data.userType);
    } else {
      console.log("有时间执行全部数据加载")
      this.PubMethods(this.data.startingTime, this.data.finishTime, '', '');
    }

  },
  lalala(e) {
    console.log(e)
    this.setData({
      top: e.detail.y * 2 - 85
    })
  },
  // 点击疑问
  hadDoubt: function(e) {
    // console.log(e.currentTarget.dataset.id)
    // wx.createSelectorQuery()
    //   .select("#yiwen")
    //   .boundingClientRect(function (rect) {
    //     console.log(rect);
    //   })
    //   .exec();
    var hisTipsId = this.data.tipsId
    var nowId = e.currentTarget.dataset.id;
    if (nowId == hisTipsId) {
      this.setData({
        tipsId: e.currentTarget.dataset.id,
        tipsShow: !this.data.tipsShow
      })
    } else {
      this.setData({
        tipsId: e.currentTarget.dataset.id,
        tipsShow: true
      })
    }
  },
  closeTips: function() {
    this.setData({
      tipsShow: false
    })
  },
  // onPageScroll: function(e){
  //   console.log(e)
  //   this.setData({
  //     tipsShow:false
  //   })
  // },

  // 下拉刷新
  onPullDownRefresh: function() {}
})