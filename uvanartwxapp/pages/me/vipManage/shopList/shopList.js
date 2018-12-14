var api = require("../../../../utils/API/request.js")
var common = require("../../../../utils/common.js")
import { getmydandelions, addpaymentsetting,editTeamRemark} from "../../../../utils/API/me/api.js"
var page = 1;
var pages = 1;//从第几条开始
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
    effectTime: '',
    listData: [],
    noRecord: true,
    length: 0,
    page: 0,
    isHidden: false,
    navLable: "0",
    id: '',
    status: '',
    userType: '',
    loadMore: true,
    noMore: true,
    hideLoading: true,
    hiddenmodalput: true,
    HPromo: "",
    MPromo: "",
    LPromo: "",
    index: ""
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
      finishTime: year + "-" + month + "-" + day+' 23:59:59',
      nowDate: year + "-" + month + "-" + day
    })
    this.loadData(this.data.startingTime, this.data.finishTime);
  },
  onShow: function () {
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
  },
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "蒲公英管理")
  },
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "蒲公英管理")
  },
  // 传播记录数据加载(时间筛选传参数，非时间筛选不传参数)
  loadData: function (startTime, finishTime) {
    var _this = this;
    this.setData({
      hideLoading: false
    })
    try {
      // 获取用户的openId、phone和token
      var phone = wx.getStorageSync('phone');
      var token = wx.getStorageSync('token');
      //https://wxapp.uvanart.com/lr/s2bapi/getmydandelions?token=91a0e853-c5af-4a5c-8141-7731aec6a8dd&loginMark=15917902850
      // page是从第几条开始搜索，limit是允许一页显示的条数，startTime和finishTime分别代表起始时间和结束时间
      var codedata = {
        "token": token,
        "loginMark": phone,
        "page": pages,
         "limit": count, 
         "start_time": startTime, 
         "end_time": finishTime 
      }
      getmydandelions(codedata)
        .then(function (res) {
          console.log(res)
          // 判断是否有蒲公英
          // debugger
          if (res.data.length == 0) {
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
          var data = _this.data.listData;
          for (var i = 0; i < res.data.length; i++) {
            data.push(res.data[i])
          }
          console.log("data-------------------------");
          console.log(data);
          _this.setData({
            // page: Math.ceil(res.data.Total / 10), //取得加载数据的页码（每页10条）
            listData: data
          })
          // console.log(_this.data.page)
          console.log(_this.data.listData)
          // 判断是否加载完全部数据
          // if (res.data.total != 0 && (_this.data.listData.length >= res.data.total)) {
          //   _this.setData({
          //     noMore: false
          //   })
          // } else {
          //   _this.setData({
          //     noMore: true
          //   })
          // }
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
  editratio: function (event) {
    var index = parseInt(event.currentTarget.dataset.id);
    var ifEdit = event.currentTarget.dataset.edit;
    if (!ifEdit) {
      return;
    }

    console.log(index);
    this.showFormModal();
    this.setData({
      index: index,
      effectTime: this.data.listData[index].PaymentSettings.F_StartTime.slice(0, 10),
      HPromo: this.data.listData[index].PaymentSettings.F_HighPromo,
      MPromo: this.data.listData[index].PaymentSettings.F_MiddlePromo,
      LPromo: this.data.listData[index].PaymentSettings.F_LowPromo
    })
  },
  //  form表单弹窗
  showFormModal: function (index) {
    this.setData({
      hiddenmodalput: false
    });
    //根据index，从data里面拿到值，付给input里面的值

  },
  //点击按钮弹窗指定的hiddenmodalput弹出框  
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    debugger;
    var that = this;
    var index = this.data.index;
    try {
      var token = wx.getStorageSync("token");
      var phone = wx.getStorageSync("phone");
    } catch (e) { }
    var settingData = {
      "token": token,
      "loginMark": phone,
      "data": {
        "F_ID": this.data.listData[index].PaymentSettings.F_ID,
        "F_CustomerID": this.data.listData[index].PaymentSettings.F_CustomerID,
        "F_StartTime": this.data.effectTime,
        "F_HighPromo": this.data.HPromo,
        "F_MiddlePromo": this.data.MPromo,
        "F_LowPromo": this.data.LPromo
      }
    }
   addpaymentsetting(settingData, 'application/json')
      .then(res => {
        if (res.code = 200) {
          this.setData({ listData: [] })
          this.loadData();
        }
        else {
          wx.showModal({
            title: '错误',
            content: res.info,
          })
        }
      })
    this.setData({
      hiddenmodalput: true
    })
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
    // 筛选数据时先清空listData数组
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      listData: []
    })
    // 再次判断数组长度是否为0
    // 重置全部变量
    pages = 1;
    page = 1;
    this.loadData(this.data.startingTime, this.data.finishTime, this.data.index);
  },
  //有效时间
  changeEffectDate: function (e) {
    console.log(e)
    this.setData({
      effectTime: e.detail.value
    })
  },
  bindinput: function (e) {
    var inputvalue;
    if (e.detail.value < 0) {
      inputvalue = 0;
    } else if (parseFloat(e.detail.value) > 100) {
      inputvalue = 100;
    }
    else {
      inputvalue = e.detail.value;
    }
    switch (e.currentTarget.id) {
      case 'recommend1':
        this.setData({ HPromo: inputvalue })
        break;
      case 'recommend2':
        this.setData({ MPromo: inputvalue })
        break;
      case 'recommend3':
        this.setData({ LPromo: inputvalue })
        break;
      default:
        break;
    }
  },
  //姓名备注
  psname: function (e) {
    if(e.detail.value==""||this.data.listData[e.currentTarget.dataset.id].Description==e.detail.value) return
    wx.showLoading({
      title: '更改中...',
      mask:true
    })
    try {
      var token = wx.getStorageSync('token');
      var url = '/s2b/customer/WriteRemarkName',
          data = {
            Token:token,
            data:{
              openId:this.data.listData[e.currentTarget.dataset.id].OpenID,
              remark:e.detail.value
            }
          }
      editTeamRemark(JSON.stringify(data),'application/json')
        .then(res=>{
          console.log(res)
          wx.hideLoading()
          if(res.code == 200){
           
          }else if(res.code == 400){
            wx.showToast({
              title: res.info,
              icon: 'none',
              duration: 1000
            })
          }
        })
        .catch(e=>{
          console.log(e)
        })
    } catch (e) {
      console.log(e)
      wx.showToast({
        title: '备注失败！',
        icon: 'loading',
        duration: 1000
      })
    }
  },

})