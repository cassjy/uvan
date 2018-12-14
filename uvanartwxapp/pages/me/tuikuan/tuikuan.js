    // pages/mine/tuikuan/tuikuan.js
var api = require("../../../utils/API/request.js")
var common = require("../../../utils/common.js")
import { GetMyAfterSalesTickets } from '../../../utils/API/me/api.js'
var page = 1;//从第几页开始
var count = 4;
var pages = 1;//一共多少页
//这个页面的分页传的page从第几页开始取得，是页码，不是行数

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TicketData:[],
    noMore:true,
    noRecord:true,
    hideLoading: true
  },


// 打开详情页
  openDetail:function(event){
    debugger
    console.log(event.currentTarget.dataset.index);
    var data = this.data.TicketData[event.currentTarget.dataset.index].Ticket.F_OrderDetailsID;
    console.log("打开的订单id" + this.data.TicketData[event.currentTarget.dataset.index].Ticket.F_OrderDetailsID);
    wx.navigateTo({
      url: 'tkDetail/tkDetail?orderId='+data,
    })     
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 1;
    pages = 1;
    this.loadData();
  },
  loadData:function(){
    if (page > pages){
      return;
    }
    var that = this;
    this.setData({
      hideLoading: false
    })
    try{
      var token = wx.getStorageSync("token");
      var phone = wx.getStorageSync("phone");
    }catch(e){}
    var refundData = {
      "token": token,
      "loginMark": phone,
      "data": { "page": page, "limit": count }
    }
    wx.showNavigationBarLoading();
    let header = 'application/json'
    GetMyAfterSalesTickets(refundData, header)
    .then(res=>{
      console.log(res)
      if(res.code ==200){
        var data = that.data.TicketData;
         data = data.concat(res.data.Data);
        console.log(data);
        pages = Math.ceil(res.data.Total / count)
        page++;
          that.setData({
            TicketData:data
          });
          res.data.Total > 0 ? that.setData({ noRecord: true, noMore: true }) : that.setData({ noRecord: false, noMore:true})
          if (res.data.Total != 0 && (that.data.TicketData.length >= res.data.Total)){ that.setData({noMore: false})}else{that.setData({noMore: true})}

          console.log("test---")
      }
      console.log('加载完成')
      wx.hideNavigationBarLoading()
      that.setData({
        hideLoading: true
      })
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"退款")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
     //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"退款")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      pages =1;
      page = 1;
      this.setData({
        TicketData:[]
      })
      this.loadData();
      wx.showToast({
        title: '刷新成功',
        icon: 'loading',
        duration: 400
      })
      wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(page);
    if (page > pages) {
      wx.showToast({
        title: '到底了',
      })
      this.setData({
        noMore: false
      })
      return;
    } else{
      this.loadData();
    }
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})