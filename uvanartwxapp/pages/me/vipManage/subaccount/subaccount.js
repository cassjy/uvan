var api = require('../../../../utils/API/request.js')
var common = require("../../../../utils/common.js")
import { WriteRemarkName,GetSubAccountList} from "../../../../utils/API/me/api.js"
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
    count:0, //总数
    num: '',
    openId: '',
    page: 1, //页码
    token: '',
    noMore:true,
    loadingMore:true
  },
  toAddsubaccount(){
    wx.navigateTo({
      url: "./addsubaccount/addsubaccount"
    })
  },
  //姓名备注
  psname(e){
    if(e.detail.value==""||this.data.dataList[e.currentTarget.dataset.id].name==e.detail.value) return
    wx.showLoading({
      title: '更改中...',
      mask:true
    })
    try {
      var token = wx.getStorageSync('token');
      var phone = wx.getStorageSync('phone')
      var url = '/s2b/customer/WriteRemarkName',
          data = {
            token:token,
            loginMark:phone,
            id:this.data.dataList[e.currentTarget.dataset.id].id,
            name:e.detail.value
          }
     WriteRemarkName(data,'application/json')
        .then(res=>{
          console.log(res)
          wx.hideLoading()
          if(res.code == 200){
           
          }else if(res.code == 400){
            wx.showToast({
              title: res.info,
              icon: 'loading',
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
  //解绑
  showtips(e){
    var _this =this
    wx.showModal({
      title: '提示',
      content: '确定要解除绑定吗?',
      confirmColor:"#4c9ffb",
      cancelColor:"#8a8a8a",
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          try {
            // 获取用户的openId和phone
            var phone = wx.getStorageSync('phone');
            var token = wx.getStorageSync('token');
            var url = '/s2b/customer/UnBindSubAccount',
                data = {
                  token:token,
                  loginMark:phone,
                  data:e.currentTarget.dataset.id
                }
            api.get(url,data,'application/json')
              .then(res=>{
                console.log(res)
                if(res.code == 200){
                  wx.showToast({
                    title: res.info,
                    icon: 'success',
                    duration: 1000
                  })
                  _this.setData({
                    dataList: [],
                    page: 1
                  })
                  _this.loadData()
                }else if(res.code == 400){
                  wx.showToast({
                    title: res.info,
                    icon: 'loading',
                    duration: 1000
                  })
                }
                wx.hideLoading()
              })
              .catch(e=>{
                console.log(e)
              })
          } catch (e) {
            console.log(e)
            wx.showToast({
              title: '服务器繁忙！',
              icon: 'loading',
              duration: 1000
            })
          }
        }
      }
    })
  },
  loadData: function () {
    var _this = this;
    try {
      // 获取用户的openId和phone
      var openid = wx.getStorageSync('openid');
      var phone = wx.getStorageSync('phone')
      var token = wx.getStorageSync('token');
      var url = '/s2b/customer/GetSubAccountList',
          data = {
            token:token,
            loginMark:phone,
            data:{
              limit:7,
              page:this.data.page
            }
          }
      GetSubAccountList(data,'application/json')
        .then(res=>{
          console.log(res)
          if(res.code == 200){
            let new_pullData, new_data = res.data.list

            if (_this.data.dataList.length) {   // 已存在数据则合并
              new_pullData = _this.data.dataList.concat(new_data)  // 下拉刷新合并数据
            } else {
              new_pullData = res.data.list  // 第一次进入
            }
            _this.setData({
              dataList: new_pullData,
              count:res.data.total
            })
          }else if(res.code == 400){
            console.log(res.code)
            _this.setData({
              noMore:false
            })
          }
          wx.hideLoading()
        })
        .catch(e=>{
          console.log(e)
        })
        .then(res => {
          _this.setData({
            loadingMore: true
          })
          refresh = true;
          wx.hideLoading()
        })
    } catch (e) {
      console.log(e)
      wx.showToast({
        title: '服务器繁忙！',
        icon: 'loading',
        duration: 1000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    page = 1;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    this.data.page = 1;
    this.setData({
      dataList: [],
      noMore: true
    })
    this.loadData();
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
    if (refresh){
      this.data.page = 1;
      this.setData({
        dataList: [],
        noMore: true
      })
      refresh = false; //禁止因为网络延迟用户多次刷新
      this.loadData();
      wx.showLoading({
        title: '加载中...',
        mask:true
      })
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 800
      })
    }else{
      return
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page*7 >= this.data.count) {
      this.setData({
        noMore: false
      })
      wx.showToast({
        title: '到底了',
      })
      return;
    } else if (this.data.page*7 < this.data.count) {
      this.setData({
        loadingMore: false,
        page:this.data.page+1
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
  }
})