var api = require("../../../utils/API/request.js");
var common = require("../../../utils/common.js")
import { GetDandelionOrder} from '../../../utils/API/me/api.js'
var openid = ''
var query = '1'
var pageNo = 0
var pageSize = 0
var orderCondition = ''
var count = 0

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
  data: {
    select: 1,
    navList: ["全部", "待发货", "待收货", "待评价","退款"],
    orderList: [],
    noOrder: true,
    isOnLoad: true,
    over: false,
    totalFree: [],
    mytoken: '',
    myphone: '',
    currentTab: 0,
    canloadmore: true,
    loading: false
  },
  onLoad: function (option) {
    let token = wx.getStorageSync('token')
    let phone = wx.getStorageSync('phone')
    this.setData({
      mytoken: token,
      myphone: phone
    })
    wx.showLoading({
      title: '加载中',
    })
    pageNo = 1
    pageSize = 5
    count = 0
    openid = wx.getStorageSync('openid')
    console.log(openid)
    if (option.select == 2) {
      this.setData({
        select: 2
      })
      this.selectOptionFn(2, '2', true)
    } else if (option.select == 3) {
      this.setData({
        currentTab: 1,
        select: 3
      })
      this.selectOptionFn(3, '3', true)
    } else if (option.select == 4) {
      this.setData({
        currentTab: 2,
        select: 4
      })
      this.selectOptionFn(4, '4', true)
    } else if (option.select == 'TK') {
      this.setData({
        currentTab: 4,
        select: 6
      })
      this.selectOptionFn(6, 'TK', true)
    } else {
      this.setData({
        currentTab: 0,
        select: 1
      })
      query = '1'
      this.loadOrder(query, pageNo, pageSize, this.data.isOnLoad, this.data.over)
      pageNo++
    }


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
    common.visitorRecordAPI(stayTime_JY, "蒲公英订单")
  },
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "蒲公英订单")
  },
  onReachBottom: function () {
    if(this.data.canloadmore==false){
      return
    }
    this.setData({
      loading: true,
      canloadmore:false
    })
    if (this.data.over) {
      this.setData({
        noOrder: true
      })
      return
    }
    this.setData({
      isOnLoad: false
    })
    if (query == '1') {
      this.loadOrder(query, pageNo, pageSize, this.data.isOnLoad, this.data.over)
      pageNo++
    } else if (query == '2') {
      this.loadOrder(query, pageNo, pageSize, this.data.isOnLoad, this.data.over)
      pageNo++
    } else if (query == '3') {
      this.loadOrder(query, pageNo, pageSize, this.data.isOnLoad, this.data.over)
      pageNo++
    } else if (query == '4') {
      this.loadOrder(query, pageNo, pageSize, this.data.isOnLoad, this.data.over)
      pageNo++
    } else if (query == '5') {
      this.loadOrder(query, pageNo, pageSize, this.data.isOnLoad, this.data.over)
      pageNo++
    } else if (query == 'TK') {
      this.loadOrder(query, pageNo, pageSize, this.data.isOnLoad, this.data.over)
      pageNo++
    }

  },
  // select1: function(){
  // 	this.selectOptionFn(1,'1',false)
  // },
  // select2: function(){
  // 	this.selectOptionFn(2,'2',true)
  // 	// orderCondition = 'WAIT_BUYER_PAY'
  // },
  // select3: function(){
  // 	this.selectOptionFn(3,'3',true)
  // 	// orderCondition = 'WAIT_SELLER_SEND_GOODS' 
  // },
  // select4: function(){
  // 	this.selectOptionFn(4,'4',true)
  // },
  // select5: function(){
  // 	this.selectOptionFn(5,'5',true)
  // },
  // 头部导航栏
  swichNav(e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      currentTab: e.currentTarget.dataset.id,
      noOrder: true,
      loading: false
    })
    switch (e.currentTarget.dataset.id) {
      case 0:
        this.selectOptionFn(1, '1', false)
        break;
      case 1:
        this.selectOptionFn(3, '3', true)
        break;
      case 2:
        this.selectOptionFn(4, '4', true)
        break;
      case 3:
        this.selectOptionFn(5, '5', true)
        break;
      case 4:
        this.selectOptionFn(6, 'TK', true)
        break;
    }
  },
  toOrderDetail: function () {
    wx.navigateTo({
      url: './orderDetail/orderDetail'
    })
  },
  addGoods2: function (goodsList, resData) {
    var length = goodsList.length
    for (let i = 0; i < resData.length; i++) {
      goodsList[i + length] = resData[i]
    }
    return goodsList
  },
  loadOrder: function (qurey, pageNo, pageSize, isOnLoad, over) {
    var _this = this;
    debugger;
    if (isOnLoad == false && over == false) {
      // wx.showLoading({
      //   title: '加载中',
      // })
    }
    var orderdata = {
      'token': this.data.mytoken,
      'loginMark': this.data.myphone,
      'data': {
        "queryType": qurey,
        "pageNo": pageNo,
        "pageSize": pageSize,
        // "openid":openid
        // "openid":"oQCP70GlsocLqGZg_FVLlEDuN5Vo"
        // "openid": "oQCP70BdzS2ZJ83wqORm25eqGKi8"
      }
    }
    GetDandelionOrder(orderdata)
      .then(res => {
        if (res.code == 200) {
          this.setData({
            loading: false,
            canloadmore: true
          })
          wx.hideLoading()
          count = 1
          console.log(res.data)
          let orderlist = res.data.Data ? res.data.Data:[]
          _this.setData({
            orderList: isOnLoad ? orderlist : _this.addGoods2(_this.data.orderList, orderlist)
          })
          // for (let i = 0; i < orderlist.length; i++) {
          //   let totalfree = 0
          //   for (let j = 0; j < orderlist[i].FOrderEntrys.length; j++) {
          //     totalfree += orderlist[i].FOrderEntrys[j].FTotalFee * parseInt(orderlist[i].FOrderEntrys[j].FQty)
          //     totalfree.toFixed(2)
          //   }
          //   _this.setData({
          //     totalFree: _this.pusharr(_this.data.totalFree, totalfree)
          //   })
          // }
          // }

          if (orderlist.length < pageSize) {
            wx.showToast({
              title: '已显示全部订单',
              icon: 'success',
              duration: 2000
            })

            _this.setData({
              over: true,
              loading: false,
              canloadmore: false,
              noOrder: true
            })
          }
          if (_this.data.orderList.length==0){
            debugger;
            _this.setData({
              noOrder: false
            })
          }
        } else {
          wx.hideLoading()
          _this.setData({
            loading: false,
            canloadmore: true 
          })
          if (count == 1) {
            wx.showToast({
              title: '已显示全部订单',
              icon: 'success',
              duration: 2000
            })

            _this.setData({
              over: true,
              noOrder: true
            })
          } else if (isOnLoad && count == 0) {
            console.log(res)
            _this.setData({
              noOrder: false
            })
          }

        }

      })
  },
  selectOptionFn: function (selectNum, queryNumStr, hasCountNum) {
    wx.showLoading({
      title: '加载中'
    })
    // orderCondition = 'WAIT_BUYER_PAY'
    this.setData({
      select: selectNum,
      isOnLoad: true,
      over: false,
      orderList: [],
      totalFree: [],
      noOrder: true,
      canloadmore: true,
      loading: false
    })
    query = queryNumStr
    pageNo = 1
    if (hasCountNum) {
      count = 0
    }
    this.loadOrder(query, pageNo, pageSize, this.data.isOnLoad, this.data.over)
    pageNo++
  },
  pusharr: function (arr, num) {
    if (arr.length == 0) {
      arr[0] = num
      return arr
    } else {
      arr[arr.length] = num
      return arr
    }
  }
})