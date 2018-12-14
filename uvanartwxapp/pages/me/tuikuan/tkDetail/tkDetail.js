// pages/mine/tuikuan/tkDetail/tkDetail.js
var api = require("../../../../utils/API/request.js")
var common = require("../../../../utils/common.js")
import { getaftersalesdetails } from '../../../../utils/API/me/api.js'
var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
      ticket:{},
      duration:'',
      ifHidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.loading = this.selectComponent("#loading");
    this.loading.showToast();
    console.log(options.orderId);
    let data = { data: options.orderId }
    getaftersalesdetails(data)
    .then(res=>{
      if(res.code==200){
        console.log(res.data.Data[0]);
        this.setData({ ticket: res.data.Data[0] });
        var data = res.data.Data[0];
        if (data.TicketDetails[0].F_Status == "待审核" || data.TicketDetails[0].F_Status == "待退款") {
          var stoptime = this.fun_date(data.Ticket.F_CreateDate, 7);
          this.count_down(stoptime)
        }
      } else if (res.code == 400){
        this.setData({ ticket: { "TicketDetails": [{"F_Status":res.info}]} });//ticket.TicketDetails[0].F_Status
      }
      debugger
      _this.loading.hideToast();
      _this.setData({
        ifHidden:false
      })
    })
    .catch(res=>{
      _this.loading.hideToast();
    })
    
  },
  count_down:function(o){
    var datatime= /^[\d]{4}-[\d]{1,2}-[\d]{1,2}( [\d]{1,2}:[\d]{1,2}(:[\d]{1,2})?)?$/ig, str='', conn, s;
    console.log(o);
    if(!o.match(datatime)){
        console.log('参数格式为2020-01-01[ 01:01[:01]].\r其中[]内的内容可省略');
        return false;
    }
    var sec = (new Date(o.replace(/-/ig, '/')).getTime() - new Date().getTime()) / 1000;
    if (sec > 0) {
      conn = '还剩下';
    } else {
      conn = '已过期';
      sec *= -1;
    }
    s = { '天': sec / 24 / 3600, '小时': sec / 3600 % 24, '分': sec / 60 % 60, '秒': sec % 60 };
    var i;
    for (i in s) {
      if (Math.floor(s[i]) > 0) str += Math.floor(s[i]) + i;
    }
    if (Math.floor(sec) == 0) { str = '0秒'; }
    var time=  conn + str ;
    debugger;
    this.setData({
      duration: time
    });
  },
  //加7天
  fun_date:function(time,aa){
    var detail = time.split(" ")
    var re = /-/g;
    var time3 =time.replace(re, "/");
    var date2 = new Date(time3);
    date2.setDate(date2.getDate() + aa);
    var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate()+" "+detail[1];
    return time2
  },
// count_down('2012-1-1 00:00:00');

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
    common.visitorRecordAPI(stayTime_JY,"退款详情")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"退款详情")
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})