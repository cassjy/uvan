var common = require('../../../../utils/common.js');

var api = require("../../../../utils/API/request.js");
const Url = require('../../../../utils/API/url.js');
import { getcode, UvanStarChangePhone, sendverifycode, uvanstarlogin2, unbindphone, getpersonaldata} from '../../../../utils/API/me/api.js'
var app = getApp();
var openid;

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phonenum: '',
    bindingcode: '',//验证码
    vcode: '',//phone生成的code
    getcodetext: '获取验证码',

    phonenumTip: "",
    vcodeTip: "",

    btnhidden: true,
    // hiddenLoading: true,

    showModal: false,

    hiddenmodalput: true,
    newPhone: '18676501387',
    getcodetext1: '获取验证码',
    vcodeTip1: "",
    vcode1: '',//解绑phone生成的code
    inputCode: '',//弹窗的输入
    loginNum: 0,
    phoneStatus: '',
    confirmStatus:true,
    phonechange:false, //控制电话输入
    quickcontrol:true,
    phone: '',
    showWarning: false
  },
  onLoad: function (options) {
    // this.loading = this.selectComponent("#loading");
    let phone = wx.getStorageSync('phone')
    phone = phone.substr(0,3) + '****' + phone.substr(7)
    this.setData({
      phone,
      phonenum: wx.getStorageSync('phone')
    })
  },
  onReady: function () {
    console.log("初次渲染完成");
  },
  onShow:function(){
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
  },
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "手机登录")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "手机登录")
  },
  //收不到验证码说明弹窗
  showCodetip: function () {
    common.showCodetip();
  },
  showDialogBtn: function () {
    this.setData({ showModal: true })
  },
  /**

 * 弹出框蒙层截断touchmove事件

 */

  preventTouchMove: function () {

  },

  /**

   * 隐藏模态对话框

   */

  hideModal: function () {
    this.setData({ showModal: false });
  },

  //更新手机号信息
  checkphone: function (event) {
    var tel = event.detail.value.replace(/\s/g, "");
    this.setData({
      phonenum: tel
    })
    if (tel.length == 11) {
      var t = common.isPhone(tel);
      //验证
      t ? this.setData({
        phonenumTip: ""
      }) : this.setData({
        phonenumTip: "手机格式不正确"
      })
    }
  },

  // phone获取验证码
  getcode: function (event) {
    console.log(this.data.phonenum)
    var t = common.isPhone(this.data.phonenum);
    if (!t) {
      this.setData({
        phonenumTip: "手机格式不正确"
      })
      return;
    }else{
    debugger
      if (this.data.getcodetext == "重新发送" || this.data.getcodetext == "获取验证码") {
        var that = this;
        var total_micro_second = 60 * 1000;    //表示60秒倒计时，想要变长就把60修改更大
        //生成code
        var code = common.createCode();
        that.setData({
          vcode: code + that.data.phonenum,
          phonechange:true
        })
        var t = common.isPhone(that.data.phonenum);
        if (t) {
          debugger;
          common.count_down(this, total_micro_second,"");
          let _token = wx.getStorageSync('token')
          var data = {
            // "data": "{'tel':'" + that.data.phonenum + "', 'code':'" + code + "', 'typename':'梵店登录' }"
            "phone": that.data.phonenum,
          }
          let header = 'application/x-www-form-urlencoded'
          let token = _token
          console.log(data.data);
          // api.post(" /lr/uvanapi/sendverifycode", data)
          getcode(data,header,token)
            .then(res => {
              console.log("短信接口回调")
              console.log(res)
            })
        } else {
          this.setData({
            phonenumTip: "手机格式不正确"
          })
        }
      }
    }
  },


  cancel: function () {
    var num = this.data.loginNum-1;
    this.setData({
      hiddenmodalput: true,
      loginNum: num
    });
    this.loading.hideToast();
  },
  //弹窗确认  
  confirm: function () {
    if (!this.data.confirmStatus) {
      return
    }
    var _this = this;
    if (this.data.loginNum > 2) {
      wx.showModal({
        title: '登录接口报错',
        content: '登录接口报错'
      })
      return;
    }
    if ((_this.data.inputCode + _this.data.newPhone == _this.data.vcode1 && _this.data.vcode1!="") || (_this.data.inputCode == "111111" && Url.host == "https://wxapp.uvanart.com")) {
      _this.setData({
        vcodeTip1: '',
        confirmStatus: false
      })
      if (_this.data.phoneStatus == 'new') {
        var p = {
          "token": '',
          "loginMark": _this.data.newPhone,
          "data": JSON.stringify({ openid: openid, newphone: _this.data.newPhone })
        }
       UvanStarChangePhone(p)
          .then(res => {
            if (res.code == 200) {
              wx.setStorageSync('phone', _this.data.newPhone);
              _this.comlogin2(_this.data.newPhone);
            } else {
              wx.showModal({
                title: '提示',
                content: res.info
              })
            }
          })
      } else {
        wx.setStorageSync('phone', _this.data.newPhone);
        _this.comlogin2(_this.data.newPhone);
      }
    }
    else {
      _this.setData({
        vcodeTip1: '验证码不正确'
      })
    }
  },
  bindinputCode: function (event) {
    this.setData({
      inputCode: event.detail.value
    })
  },
  // 解绑获取验证码
  getModalcode: function (event) {
    if (this.data.getcodetext1 == "重新发送" || this.data.getcodetext1 == "获取验证码") {
      var that = this;
      var total_micro_second = 60 * 1000;    //表示60秒倒计时，想要变长就把60修改更大
      //生成code
      var code = common.createCode();
      that.setData({
        vcode1: code + that.data.newPhone
      })
      common.count_down(this, total_micro_second,"modal");
      var data = {
        "data": "{'tel':'" + that.data.newPhone + "', 'code':'" + code + "', 'typename':'梵店手机验证' }"
      }
      console.log(data.data);
      sendverifycode(data)
        .then(res => {
          console.log("短信接口回调")
        })
    }
  },
  comlogin2: function (phone) {
    this.loading.showToast();
    var that = this;
    try {
      openid = wx.getStorageSync("openid");
      var originOpenid = wx.getStorageSync("inviter") || '';
      console.log("inviter-------------------------------");
      console.log(originOpenid);
      if (openid !== "") {
        wx.getUserInfo({
          withCredentials: false,
          lang: 'zh_CN',
          complete: function (res) {
            var nickname, imgUrl;
            if (res.errMsg == "getUserInfo:ok") {
              debugger
              nickname = res.userInfo.nickName;
              imgUrl = res.userInfo.avatarUrl;
            } else {
              nickname = null;
              imgUrl = null;
            }
            var login2data = {
              token: "",
              loginMark: phone,
              data: JSON.stringify({
                "phone": phone,
                "openid": openid,
                "nickname": nickname,
                "originOpenid": originOpenid,
                "imageurl": imgUrl
              })
            }
            uvanstarlogin2(login2data)
              .then(res => {
                if (res.code == 200) {
                  if (res.data.code) {
                    switch (res.data.code) {
                      case 3:
                        //完全新手机
                        wx.showModal({
                          title: '提示',
                          content: res.data.msg,
                          confirmText: '确认解绑',
                          success: function (res) {
                            console.log(res);
                            console.log("确认解绑确认解绑确认解绑");
                            if (res.confirm) {
                              //解绑操作
                              that.setData({
                                newPhone: phone,
                                hiddenmodalput: false,
                                loginNum: that.data.loginNum + 1,
                                phoneStatus: 'new'
                              })
                            }  else{
                              that.loading.hideToast();
                            }
                          }
                        })
                        wx.removeStorageSync("phone");
                        break;
                      case 5:
                        //返回老手机验证
                        var returnphone = res.data.newphone;
                        wx.showModal({
                          title: '提示',
                          content: "亲，你的账号绑定的手机号码为" + returnphone + ",请你校验手机号码是否正确",
                          confirmText: '确认',
                          success: function (res) {
                            if (res.confirm) {
                              //解绑操作
                              that.setData({
                                newPhone: returnphone,
                                hiddenmodalput: false,
                                loginNum: that.data.loginNum + 1,
                                phoneStatus: 'old'
                              })
                            } else {
                              that.loading.hideToast();
                            }

                          }
                        })
                        wx.removeStorageSync("phone");
                        break;
                      default:
                        that.loading.hideToast();
                        break;
                    }
                  } else {
                    var Privilege = res.data.Privilege ? 1 : 0;
                    try {
                      wx.setStorageSync('token', res.data.token);
                      wx.setStorageSync('sessionid', res.data.sessionid);
                      wx.setStorageSync('characterType', res.data.type);
                      wx.setStorageSync('Privilege', Privilege);
                      // wx.setStorageSync('phone', phone)
                      wx.setStorage({
                        key: "phone",
                        data: phone,
                        success:function(){
                          that.loading.hideToast();
                          that.setData({
                            hiddenmodalput: true,
                          })
                          debugger;
                          that.getUserImg(that.skipto);
                        }
                      })

                    } catch (e) {
                    }
                  }
                } else if (res.code == 400) {
                  that.loading.hideToast();
                  wx.showModal({
                    title: '提示',
                    content: res.info,
                    showCancel: false,
                  })
                  that.data.quickcontrol = true;
                  wx.removeStorageSync("phone");
                }
              })
              .catch(res => {
                that.loading.hideToast();
                that.data.quickcontrol = true;
              })
          },
          fail: function (res) {
            console.log("获取微信接口用户信息报错");
            that.data.quickcontrol = true;
          }
        })
      }
    }
    catch (e) {

    }

  },
  //-----------
  submit: function (event) {
    var that = this;
    var status = true;
    if (!that.data.quickcontrol){}else{
      that.data.quickcontrol = false;
      if ((event.detail.value.code + event.detail.value.phonenum == that.data.vcode && event.detail.value.code != "") || (event.detail.value.code == "111111" && Url.host == "https://wxapp.uvanart.com")) {
        debugger;
        that.comlogin2(event.detail.value.phonenum);
      } else {
        that.setData({
          vcodeTip: "验证码不正确"
        });
        that.data.quickcontrol = true;
      }

      //接口请求加载图案
      // that.setData({
      //   hiddenLoading:false
      // })

      // 默认跳转，之后删除


      console.log(event);
      console.log('校验验证码');
    }


  },
  inputcode(e){
    this.setData({
      bindingcode: e.detail.value
    })
    console.log(e.detail.value)
  },
  unbind(){
    let _this = this
    let data = {
      "phone": wx.getStorageSync('phone'),
      "code": this.data.bindingcode
    }
    let header = 'application/json'
    let token = wx.getStorageSync('token')
    unbindphone(data,header,token)
    .then(res=>{
      if(res.data.code==0){
        this.setData({
          showWarning: true,
          warningtext: "解绑成功"
        })
        // wx.removeStorageSync("phone")
        wx.setStorageSync('phone',null)
        setTimeout(()=>{
          this.setData({
            showWarning: false
          })
          wx.reLaunch({
            url: '../../phonelogin/phonelogin?from=unbind&code='+_this.data.bindingcode
          })
        },1000)
      }else if(res.data.code==-1){
        this.setData({
          showWarning: true,
          warningtext: "验证码输入错误"
        })
        setTimeout(()=>{
          this.setData({
            showWarning: false
          })
        },2000)
      }
    })
    
  },
  skipto: function () {
    var formWhere = wx.getStorageSync("formWhere");
    if (formWhere == "shopping") {
      wx.removeStorageSync('formWhere');
      wx.navigateBack({
        delta: 2
      })
    } else if (formWhere == "running") {
      wx.removeStorageSync('formWhere');
      wx.navigateBack({
        delta: 2
      })
    } else if (formWhere == "formHome") {
      wx.removeStorageSync('formWhere');
      wx.switchTab({
        url: '../../home/home'
      })
    } else if (formWhere == "formBean") {
      wx.removeStorageSync('formWhere');
      wx.switchTab({
        url: '../../beanShopping/beanShopping'
      })
    }
    else if (formWhere == "formPinTuan") {
      console.log('来自拼团详情')
      wx.removeStorageSync('formWhere');
      wx.navigateBack({
        delta: 2
      })
    } 
    else if (formWhere == "formCommunity") {
      console.log('来自梵星社区')
      wx.removeStorageSync('formWhere');
      wx.navigateBack({
        delta: 2
      })
    }
    else if (formWhere == "fromMenDianAct") {
      console.log('来自门店抽奖详情')
      wx.removeStorageSync('formWhere');
      wx.navigateBack({
        delta: 2
      })
    } else if (formWhere == "fromGZCashCoupon") {
      console.log('来自门店抽奖详情')
      wx.removeStorageSync('formWhere');
      wx.navigateBack({
        delta: 2
      })
    } else if (formWhere == "BecomeDandelion") {
      console.log('来自蒲公英邀请函')
      wx.removeStorageSync("formWhere");
      wx.navigateBack({
        delta: 2
      })
    }
    else {
      wx.switchTab({
        url: '../me'
      });
    }
  },
  // 获取用户上传的头像并存到缓存中
  getUserImg: function (fun1) {
    var data = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": "{'openid':'" + wx.getStorageSync('openid') + "','key':'YJ'}"
    }
    let header = "application/json";
    getpersonaldata(data,header).then(res => {
      console.log('...........获取用户头像接口..............')
      console.log(res)
      if (res.data.head == null) {
        wx.getUserInfo({
          withCredentials: false,
          lang: 'zh_CN',
          complete: function (res) {
            debugger
            var imgUrl;
            if (res.errMsg == "getUserInfo:ok") {
              wx.setStorageSync("headPortrait", res.userInfo.avatarUrl);
              wx.setStorageSync("userName", res.userInfo.nickName);
            } else {
              wx.setStorageSync("headPortrait", "")
              wx.setStorageSync("userName", "")
            }
          }
        })
      } else {

        wx.setStorageSync("headPortrait", res.data.head);
        wx.setStorageSync("userName", res.data.name);
      }

    })
      .catch(res => {
        console.log(res)
      })
      .finally(() => {
        fun1();
      })
  },
  //跳过绑定
  skip(){
    wx.switchTab({
      url: '../../home/home'
    })
  }
})