var api = require("../../../utils/API/request.js");
var common = require("../../../utils/common.js")
import { GetServerTime, GetVanBeanSignRecordStatus, InsertVanBeanSignRecord} from '../../../utils/API/me/api.js'
var isOnClick = true;

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnState: false,
    dataList: [],
    finshTime: '',
    wlTime: '',
    wlTime1: '',//备份系统返回的年月日
    intraday: true,//当天签到状态(默认已经签到)
    txImg: '', //头像
    monthNum: '', //月份小写
    monthNum1: '', //备份月份
    month: '', //月份大写
    date: '', //几号
    canlender: {
      'month': new Date().getMonth() + 1,
      'date': new Date().getDate(),
      "day": new Date().getDay(),
      'year': new Date().getFullYear(),
      "weeks": []
    },
    hiddenShadow: true,
    lastMonth: '',
    preAndNext: true, //用来判断是翻看上月还是回到本月(默认点击是翻看上月)
    preMonthData: [],//备份上个月的签到状态
    preMonthLastData: '', //上个月最后五天的签到状态
    // 签到成功显示获得梵豆
    animationClass: 'start1',  // 交互效果
    animationClass2: 'start', // 交互效果2 -> 额外获得梵豆弹出
    getBean_num:false,  // 当前是否连续签到5天   false 1梵豆 / true 1+3梵豆
    getBeanShow: true,  // 梵豆界面显示
    vanBeanNum: '',  //当天签到梵豆数量
    vanBeanNum1: '',  //连续签到梵豆数量
  },

  // 打开连续签到规则
  showRule: function () {
    this.setData({
      hiddenShadow: false
    })
  },
  // 已浏览签到规则
  cancel: function () {
    this.setData({
      hiddenShadow: true
    })
  },

  // 翻看上月签到记录
  showPreviousMonth: function () {
    wx.showLoading({
      title: '加载中',
    })
    let mark = 'lookLastMonth'; //用来辨别是否是否翻看上月记录
    if (this.data.preAndNext) {
      this.setData({
        wlTime: this.data.lastMonth,
        intraday: true,
        preAndNext: !this.data.preAndNext,
        monthNum: this.data.monthNum - 1
      })
      console.log(`.............${this.data.monthNum}..............`)
      console.log(this.data.monthNum1)
      this.dateLoad(this.data.wlTime, mark);
    } else {
      this.setData({
        wlTime: this.data.wlTime1,
        preAndNext: !this.data.preAndNext,
        monthNum: this.data.monthNum1
      })
      this.dateLoad(this.data.wlTime);
    }

  },
  //签到事件
  signIn: function () {
    var _this = this;
    var day1 = new Date().getDate();
    console.log(day1)
    console.log(this.data.finshTime)
    console.log('..............测试数据..............')
    console.log(this.data.intraday)
    if (isOnClick) {
      isOnClick = false;
      if ((day1 == this.data.finshTime)) {  //用户本地时间与后台返回来的时间做对比
        if (this.data.intraday) { //已签到
          console.log('当天已签到')
          return;
        }
        // 未签到
        wx.showLoading({
          title: '签到中...',
        })
        let token1 = wx.getStorageSync('token');
        let loginMark1 = wx.getStorageSync('phone');
        var data = {
          "token": token1,
          "loginMark": loginMark1
        }
        console.log(data)
       InsertVanBeanSignRecord(data).then(res => {
          console.log(res)
          _this.dateLoad(_this.data.wlTime);
          wx.hideLoading()
          wx.showToast({
            title: '签到成功',
            duration: 1500
          })

          var numZT // 判断当前梵豆显示状态  T*1+3  F*1
          if (res.data.Data.F_Key === "VBSignIn") {
            numZT = false 
            _this.setData({
              getBean_num: numZT,
              vanBeanNum: res.data.Total, //当天签到
            })
          }
          if (res.data.Data.F_Key === "VBSignIn5") {
            numZT = true
            _this.setData({
              getBean_num: numZT,
              vanBeanNum: res.data.Total - res.data.Data.F_VanBeanNum, //当天签到
              vanBeanNum1: res.data.Data.F_VanBeanNum //连续签到
            })
          }
          console.log('.....................测试梵豆...................')
          console.log(this.data.vanBeanNum)
          console.log(this.data.vanBeanNum1)
          // 签到成功显示签到梵豆
          _this.singInSuccess()
        })
          .catch(res => {
            console.log(res)
            wx.showToast({
              title: '签到失败',
              duration: 2000
            })
            isOnClick = true;
          })
          .then(() => {
            wx.hideLoading()
          })
      } else {
        console.log('不是当天，不能签到')
        wx.showModal({
          title: '优梵艺术提醒您！',
          content: '请更新您的本地时间',
        })
        return;
      }

    } else {
      console.log('你已经点击一次了')
      return;
    }

  },
  // 签到成功显示签到梵豆
  singInSuccess: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this.setData({
      animationClass2: 'start',
      animationClass: 'start1'
    })

    var _this = this
    clearTimeout(this.times1)
    this.times1 = setTimeout(() => {
      wx.hideLoading()
      _this.setData({
        animationBg: "show",
        getBeanShow: true,
      })
    }, 100)

    clearTimeout(this.times2_1)
    this.times2_1 = setTimeout(() => {
      _this.setData({
        animationClass: 'animated infinite bounceInDown',
      })
    }, 100)

    clearTimeout(this.times2_2)
    this.times2_2 = setTimeout(() => {
      _this.setData({
        animationClass: '',
      })
    }, 500)
    
    clearTimeout(this.times2)
    this.times2 = setTimeout(() => {  
      _this.setData({
        animationClass: 'animated infinite swing',
      })
    },590)

    clearTimeout(this.times3)
    this.times3 = setTimeout(() => {
      _this.setData({
        animationClass: '',
        animationClass2: 'animated infinite fadeInDownBig',
      })
    }, 1380)

    clearTimeout(this.times4)
    this.times4 = setTimeout(() => {
      _this.setData({
        animationClass2: '',
      })
    }, 1800)
   
  },
  // 隐藏 - 签到成功显示签到梵豆
  getBeanHide: function () {
    this.setData({
      getBeanShow: false,
      animationBg: ""
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.singInSuccess()  //测试签到效果
    var _this = this;
    wx.showLoading({
      title: '加载中...',
      duration: 300
    })

    // 获取系统时间
    GetServerTime().then(res => {
      console.log(res)
      var nyrTime = (res.info).split(" ")[0];  //后台返回年月日
      var lastMonth = nyrTime.split("/")[1] - 1; //后台返回上月月份
      var systemTime = nyrTime.split("/");  //处理年月日
      systemTime.splice(1, 1, lastMonth.toString()) //替换成上月份
      var finishedTime = systemTime.join("/").toString()
      console.log(finishedTime)
      var today = nyrTime.split("/")[2]; //后台返回来当天的是几号 
      _this.setData({
        finshTime: today,
        wlTime: nyrTime,
        wlTime1: nyrTime, //用来备份年月日时间
        lastMonth: finishedTime
      })
      console.log(nyrTime)
      console.log(today)
      _this.dateLoad(nyrTime);  //传系统返回的年月日

      // 获取下一个月签到状态
      var mark = 'requireNextMonth'
      this.gainSignDate('', '', '', mark);
    })
      .catch(res => {
        console.log(res)
      })
      .then(res => {
        wx.hideLoading();
      })


  },

  // 获取后台返回来的日期转成对应的日历
  dateLoad: function (nyrTime, mark) {
    var canlender = [];
    var handleTime = nyrTime + '';   //年月日化成字符串型
    var _date = new Date(handleTime); //根据系统返回来的时间获取当月的日历
    var year = _date.getFullYear()  //获取年份
    var month = _date.getMonth() + 1 //获取月份
    var date = _date.getDate()  //获取当天是几号
    if (mark == 'lookLastMonth') {
      this.setData({
        date: date,
        // monthNum1: month  //备份月份
      })
    } else {
      this.setData({
        date: date,
        monthNum: month,
        monthNum1: month  //备份月份
      })
    }


    switch (month) {   // 月份化成中文大写
      case 1:
        this.setData({
          month: '一'
        })
        break;
      case 2:
        this.setData({
          month: '二'
        })
        break;
      case 3:
        this.setData({
          month: '三'
        })
        break;
      case 4:
        this.setData({
          month: '四'
        })
        break;
      case 5:
        this.setData({
          month: '五'
        })
        break;
      case 6:
        this.setData({
          month: '六'
        })
        break;
      case 7:
        this.setData({
          month: '七'
        })
        break;
      case 8:
        this.setData({
          month: '八'
        })
        break;
      case 9:
        this.setData({
          month: '九'
        })
        break;
      case 10:
        this.setData({
          month: '十'
        })
        break;
      case 11:
        this.setData({
          month: '十一'
        })
        break;
      case 12:
        this.setData({
          month: '十二'
        })
        break;
    }
    var day = _date.getDay(); //今天是周几
    var firstDay = new Date(year, month - 1, 1).getDay(); //当月第一天是周几
    var lastMonthDays = []; //存放上一个月最后那几天（全部置空）
    for (var i = firstDay; i > 0; i--) {
      lastMonthDays.push({
        'date': '',  //置空
        'month': month - 1,
        'sign': false
      })
    }
    // console.log(lastMonthDays)
    var currentMonthDays = []; //存放本月的天数
    for (var i = 1; i <= new Date(year, month, 0).getDate(); i++) {
      currentMonthDays.push({
        'date': i + "",
        'month': month,
        'sign': ''
      })
    }
    // console.log(currentMonthDays)

    var nextMonthDays = [];  //存放下一个月的前面几天
    var endDay = new Date(year, month, 0).getDay();
    console.log('end day:' + endDay)
    for (var i = 1; i < 7 - endDay; i++) {
      nextMonthDays.push({
        'date': '',
        'month': month + 1,
        'sign': false
      })
    }
    this.gainSignDate(lastMonthDays, currentMonthDays, nextMonthDays, mark); //把前一个月，当月，后一个月的数据传到获取签到日期方法中
  },


  // 当月已签到数公用方法
  gainSignDate: function (lastMonthDays, currentMonthDays, nextMonthDays, mark) {
    var _this = this;
    var canlender = [];
    let token = wx.getStorageSync('token');
    let loginMark = wx.getStorageSync('phone');
    var data = {
      "token": token,
      "loginMark": loginMark,
      "data": this.data.wlTime
    }
    GetVanBeanSignRecordStatus(data).then(res => {
      console.log(res)

      var arr = [];
      // 对象格式转数组格式
      for (let i in res.data[0]) {
        arr.push(res.data[0][i])
      }


      // 获取当天的签到状态
      console.log(`................${mark}.......................`)
      var nowaday = arr[_this.data.finshTime - 1];
      if (mark == 'lookLastMonth') {
        _this.setData({
          dataList: arr  //整个月的签到状态
        })


      } else if (mark == 'requireNextMonth') {
        _this.setData({
          preMonthData: arr  //整个月的签到状态
        })
        var preMonthLastData = 0; //用户存放上个月最后四天里连续签到得次数

        for (let i = arr.length - 1; i >= arr.length - 5; i--) {
          if (arr[i] == true) {
            preMonthLastData++;
          } else {
            _this.setData({
              preMonthLastData: preMonthLastData
            })
            return;
          }
        }
        return; //获取数组后退出
      }
      else {
        _this.setData({
          dataList: arr,   //整个月的签到状态
          intraday: nowaday   //当天的签到状态
        })
      }
      // 处理数据
      currentMonthDays.forEach((item, index, input) => {  //当月所有状态插入到currentMonthDays数组
        input[index].sign = _this.data.dataList[index]
      })

      // 处理所有整合后的数据
      canlender = canlender.concat(lastMonthDays, currentMonthDays, nextMonthDays) //把三个数组连接起来
      var weeks = []
      for (var i = 0; i < canlender.length; i++) {
        if (i % 7 == 0) {
          weeks[parseInt(i / 7)] = new Array(7);
        }
        weeks[parseInt(i / 7)][i % 7] = canlender[i]
      }
      console.log(weeks)
      _this.setData({
        "canlender.weeks": weeks
      })
      wx.hideLoading()
      console.log(_this.data.canlender)
    })
      .catch(res => {
        console.log(res)
      })


  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(()=>{
      stayTime_JY++
    },1000)

    var _this = this;
    // 获取缓存的用户头像

    let headPortrait = wx.getStorageSync('headPortrait')
    _this.setData({ txImg: headPortrait })
  },
  onHide: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"每日签到")
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"每日签到")
  },


})