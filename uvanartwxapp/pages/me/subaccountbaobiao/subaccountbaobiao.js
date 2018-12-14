var api = require('../../../utils/API/request.js')
var common = require("../../../utils/common.js")
import { SubAccountGeneralizeReport} from '../../../utils/API/me/api.js'
var token = '';

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
  data: {
    startdate:'',
    nowdate:'',
    enddate:'',
    page:1,
    datalist:[],
    count:0
  },
  
  getdata(){
    try {
      // 获取用户的openId和token
      var openid = wx.getStorageSync('openid');
      var phone = wx.getStorageSync('phone');
      var token = wx.getStorageSync('token');
      var url = '/s2b/report/SubAccountGeneralizeReport',
          data = {
            token:token,
            loginMark:phone,
            data:{
              limit:12,
              page:this.data.page,
              begintime:this.data.startdate,
              endtime:this.data.nowdate
            }
          },
          _this = this,
        header ="application/json"
      SubAccountGeneralizeReport(data, header)
        .then(res=>{
          console.log(res)
          if(res.code == 200){
            let new_pullData, new_data = res.data.list

            if (_this.data.datalist.length) {   // 已存在数据则合并
              new_pullData = _this.data.datalist.concat(new_data)  // 下拉刷新合并数据
            } else {
              new_pullData = res.data.list  // 第一次进入
            }
            _this.setData({
              datalist: new_pullData,
              count:res.data.total
            })
          }else{
            console.log(res.code)
            wx.showToast({
              title: res.info,
              icon: 'loading',
              duration: 1000
            })
          }
          wx.hideLoading()
        })
    } catch (e) {
        console.log(e)
        wx.hideLoading()
        wx.showToast({
          title: '服务器繁忙！',
          icon: 'loading',
          duration: 1000
        })
    }
  },
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({
       title: '加载中'
    })
    let start = this.format(new Date(Date.parse(new Date())-1000*60*60*24*7))
    let end = this.format(new Date())
    console.log(start,end)
    this.setData({
      startdate:start,
      nowdate:end,
      enddate:end
    })
    this.getdata()
  },
  onShow: function () {
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
  },
  //时间格式
  format(date){
    var mat={};
    mat.M=date.getMonth()+1;//月份记得加1
    mat.Y=date.getFullYear();
    mat.D=date.getDate();
    mat.M=this.check(mat.M);
    mat.D=this.check(mat.D);
    return mat.Y+"-"+mat.M+"-"+mat.D;
  },
  //检查是不是两位数字，不足补全
  check(str){
    str=str.toString();
    if(str.length<2){
        str='0'+ str;
    }
    return str;
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page*12 >= this.data.count) {
      this.setData({
        noMore: false
      })
      wx.showToast({
        title: '到底了',
      })
      return;
    } else if (this.data.page*12 < this.data.count) {
      this.setData({
        page: this.data.page+1
      })
      wx.showLoading({
         title: '加载中'
      })
      this.getdata();
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
  bindstartDateChange: function(e){
      this.setData({
        startdate: e.detail.value,
        datalist:[],
        page:1
      })
      wx.showLoading({
         title: '加载中'
      })
      this.getdata()
  },
  bindendDateChange: function(e){
      this.setData({
        nowdate: e.detail.value,
        datalist:[],
        page:1
      })
      wx.showLoading({
         title: '加载中'
      })
      this.getdata()
  },
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "客户管理")
  },
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "客户管理")
  },
})