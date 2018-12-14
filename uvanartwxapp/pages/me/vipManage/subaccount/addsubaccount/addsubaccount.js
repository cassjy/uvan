var api = require('../../../../../utils/API/request.js')
var common = require("../../../../../utils/common.js")
import { customerSendVerifyCode, BindSubAccount, CheckVerifyCode} from "../../../../../utils/API/me/api.js"

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phonenumber:'', //电话号码
    phonecheck:'',
    token: '',
    time:60,
    btn:"获取验证码",
    btnclick:false,
    code:""
  },

  //验证手机号
  checkphone: function(e){
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!myreg.test(e.detail.value)) {
      this.setData({
        phonecheck:"wrong"
      })
    }else{
      this.setData({
        phonenumber:e.detail.value,
        phonecheck:"right"
      })
    }
  },
  time(){
    if(this.data.btn==0){
      this.setData({
        btn:"获取验证码",
        btnclick:false
      })
    }else{
      let _this =this
      setTimeout(function() {
        _this.setData({
          btn:_this.data.btn-1
        })
        _this.time()
      }, 1000);
    }
  },
  codeinput(e){
    this.setData({
      code:e.detail.value
    })
  },
  //发送验证码
  sendcode(){
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if(myreg.test(this.data.phonenumber)&&this.data.phonecheck=="right"){
      try {
        // 获取用户的openId和phone
        var phone = wx.getStorageSync('phone')
        var token = wx.getStorageSync('token');
        var url = '/s2b/customer/SendVerifyCode',
            data = {
              token:token,
              loginMark:phone,
              mobile:this.data.phonenumber,
              typename:phone+"的子账号"
            }
        this.setData({
          btn:60,
          btnclick:true
        })
        this.time()
        customerSendVerifyCode(data,'application/json')
          .then(res=>{
            console.log(res)
            if(res.code==200){
              wx.showModal({
                content: '短信已成功发送！',
                confirmColor:"#4c9ffb",
                showCancel:false,
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }else{
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
          title: '服务器繁忙！',
          icon: 'loading',
          duration: 1000
        })
      }
    }else{
      wx.showToast({
        title: '请填写正确手机号！',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //提交绑定
  sub(){
    try {
      // 获取用户的openId和phone
      var phone = wx.getStorageSync('phone')
      var token = wx.getStorageSync('token');
      var url = '/s2b/customer/BindSubAccount',
          data = {
            token:token,
            loginMark:phone,
            data:this.data.phonenumber
          }
     BindSubAccount(data,'application/json')
        .then(res=>{
          wx.hideLoading()
          console.log(res)
          if(res.code==200){
            wx.showModal({
              content: res.info,
              confirmColor:"#4c9ffb",
              showCancel:false,
              success: function(res) {
                if (res.confirm) {
                  wx.hideLoading()
                  console.log('用户点击确定')
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }else{
            wx.showToast({
              title: res.info,
              icon: 'loading',
              duration: 1000
            })
          }
        })
        .catch(e=>{
          wx.hideLoading()
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
  },
  //验证码校验
  checkcode(){
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if(!myreg.test(this.data.phonenumber)){
      wx.showToast({
        title: '请填写正确手机号！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if(this.data.code==''){
      wx.showToast({
        title: '请填写验证码！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.showLoading({
      title: '验证中...',
      mask:true
    })
    try {
      // 获取用户的openId和phone
      var phone = wx.getStorageSync('phone')
      var token = wx.getStorageSync('token');
      var url = '/s2b/customer/CheckVerifyCode',
          _this =this,
          data = {
            token:token,
            loginMark:phone,
            mobile:this.data.phonenumber,
            verifycode:this.data.code
          }
     CheckVerifyCode(data,'application/json')
        .then(res=>{
          console.log(res)
          wx.hideLoading()
          if(res.code==200){
            wx.showLoading({
              title: '绑定中...',
              mask:true
            })
            _this.sub()
          }else{
            wx.showToast({
              title:res.info,
              icon: 'loading',
              duration: 1000
            })
          }
        })
        .catch(e=>{
           wx.showToast({
              title:res.info,
              icon: 'loading',
              duration: 1000
            })
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
  }
})