var common = require("../../utils/common.js");
var api = require("../../utils/API/request.js");
import { getdandelioninfo, getcustomerguidepage, UserFeedback, validateusertype, GetSubAccountList, k3customerinfo, PrivilegeLink, InvitedQrCode, getordersamount, GetUserIncomeProfit, GetUserIncomeBalance, } from '../../utils/API/me/api.js'
var openid = ''
var phone = ''
var token = ''

const app = getApp();

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagehide: ["", "hide"],
    topbanner: true, //头部选中样式
    hiddenShaow: true,
    uploadHead: false,
    loginstatus: "未登录",
    loginstatus1: "",
    touxiangImg: '',
    userName: '',
    // hiddenTips: true,
    animationData: {},
    mesgFK: "none",
    newmesgFK: 0,
    registrationYear: '', //注册年份
    registrationMonth: '', //注册月份
    lastX: 0,
    translateX: "0",
    name: '蒲公英',
    vipCode: '',
    invitationID: '',
    invitationCode: '',
    isK3Show: true,
    nowbannerName: '个人中心-梵星',
    showwin: false, //显示梵星邀请方式
    isTap: true, //遮罩层显示隐藏
    showqrcode: false, //显示二维码,
    qrcodeimg: '', //二维码
    canCreate: true, //防止多次生成
    monthAmount: '', //本月销售额
    totalAmount: '', //订单金额
    UserIncomeProfit: '', //用户累计收益
    UserIncomeBalance: '', //用户账户余额
    uvanstar_count: '', //梵星数量
    showPGYBounced: true
  },
  //优梵社区
  UVcommunity() {
    wx.navigateTo({
      url: '../home/community/community',
    })
  },
  // 未开发功能提示
  showTips: function (e) {
    common.showModal('码农正在加班赶工，敬请期待', '提示', function (res) {
      if (res.confirm) {
        return
      }
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e)
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res22) {
              console.log(res22)
            }
          })
        }
      }
    })
  },
  //点击头部样式转换
  topbanner(e) {
    console.log(e.currentTarget.dataset.id)
    var _this = this
    if (parseInt(e.currentTarget.dataset.id) === 1) {
      this.setData({
        topbanner: true
      })
      this.data.pagehide[0] = ""
      this.data.pagehide[1] = "hide"

      if (this.data.nowbannerName != '个人中心-梵星') {
        //离开时插入访问记录
        clearInterval(stayTimer_JY)
        common.visitorRecordAPI(stayTime_JY, this.data.nowbannerName)
        this.setData({
          nowbannerName: '个人中心-梵星'
        })
        //开始计时（停留时间）
        stayTime_JY = 0 //停留时间
        stayTimer_JY = setInterval(() => {
          stayTime_JY++
        }, 1000)
      }
    } else {
      this.setData({
        topbanner: false,
      })
      this.data.pagehide[0] = "hide"
      this.data.pagehide[1] = ""

      if (this.data.nowbannerName != '个人中心-蒲公英') {
        //离开时插入访问记录
        clearInterval(stayTimer_JY)
        common.visitorRecordAPI(stayTime_JY, this.data.nowbannerName)
        this.setData({
          nowbannerName: '个人中心-蒲公英'
        })
        //开始计时（停留时间）
        stayTime_JY = 0 //停留时间
        stayTimer_JY = setInterval(() => {
          stayTime_JY++
        }, 1000)
      }
    }
    setTimeout(function () {
      _this.setData({
        pagehide: _this.data.pagehide
      })
    }, 300)
  },
  // 打开每日签到
  ToSignPage: function (event) {
    console.log('formid为 ' + `${event.detail.formId}`);
    common.postformid(event.detail.formId);
    wx.navigateTo({
      url: 'sign/sign',
    })
  },

  // 打开退款页
  openTkPage: function () {
    wx.navigateTo({
      url: 'tuikuan/tuikuan',
    })
  },
  // to转赠记录页
  toGivingRecordPage(){
    wx.navigateTo({
      url: 'givingRecord/givingRecord',
    })
  },
 
  // 打开优惠券页面
  toCoupons() {
    wx.navigateTo({
      url: 'coupons/coupons',
    })
  },

  // 打开订单列表页
  openOrderList: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: 'orderList/orderList?id=' + e.currentTarget.dataset.id,
    })
  },

  // 打开拼团页面
  openSpellGroup: function () {
    wx.navigateTo({
      url: 'spellGroup/spellGroup',
    })
  },

  // 打开地址页面
  openAddress: function (e) {
    console.log(e)
    wx.navigateTo({
      url: 'personal/address/address?id=' + e.currentTarget.dataset.id,
    })
  },

  topreson: function () {
    wx.navigateTo({
      url: "personalData/personalData",
    })
  },
  // 打开我的足迹页面
  toFootprint: function () {
    wx.navigateTo({
      url: 'footPrint/footPrint',
    })
  },

  //打开相册
  toAlbum: function () {
    wx.navigateTo({
    
      url: './photoPush/photoPush',
    })
  },

  //打开人脸识别
  toFacing: function (e) {
    console.log(e)
    wx.navigateTo({
      url: './personalCenter/personalCenter',
    })
  },

  // 打开反馈意见页
  ToFeedback: function () {
    wx.navigateTo({
      url: 'feedback/feedback',
    })
  },

 

  //  加载公用方法
  loadData: function () {
    var _this = this;
    var data = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": {
        "key": ''
      }
    };
    var header = "application/json";
    getcustomerguidepage(data, header).then(res => {
      // 获取用户注册时间
      let registrationYear = (res.data.createDate).split(' ')
      let registrationMonth = registrationYear[0].split('-')
      console.log(`用户注册时间${registrationYear[0]}`)
      wx.setStorageSync('registrationTime', registrationYear[0])
      _this.setData({
        registrationYear: registrationMonth[0],
        registrationMonth: registrationMonth[1]
      })
      console.log(this.data.registrationYear)
      console.log(this.data.registrationMonth)
     
    })
      .catch(res => {
        debugger
        console.log(res)
      })

    var data = {
      'openid': wx.getStorageSync('openid'),
      'PostType': 6
    }
    UserFeedback(data)
      .then(res => {
        console.log(res);
        if (res.code === 200 && res.info != "0") {
          _this.setData({
            mesgFK: "",
            newmesgFK: res.info
          })
          console.log(this.data.newmesgFK)
        } else {
          _this.setData({
            mesgFK: "none",
            newmesgFK: 0
          })
        }
      })
      .catch(function (reason) {
        console.log(reason);
      });
  },

  onLoad: function (options) {
    var that = this;
    console.log(options.type)
    if (options.type != undefined) {
      if (options.type) {
        this.data.pagehide[0] = ""
        this.data.pagehide[1] = "hide"
      } else {
        this.data.pagehide[1] = ""
        this.data.pagehide[0] = "hide"
      }
      this.setData({
        topbanner: options.type,
        pagehide: this.data.pagehide
      })
    }
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //开始计时（停留时间）
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
    // console.log(this.data.consignee)
    var that = this;
    // 获取缓存的用户头像
    let headPortrait = wx.getStorageSync("headPortrait");
    api.getStorage("phone")
      .then(res => {
        console.log(res)
        debugger
        if (res === null) {
          that.setData({
            loginstatus: "未登录"
          });
        } else {
          that.setData({
            loginstatus: "已登录"
          });
        }

        wx.getUserInfo({
          withCredentials: false,
          lang: 'zh_CN',
          complete: function (res) {
            // debugger
            console.log(res);
            if (res.errMsg == "getUserInfo:ok") {
              that.setData({
                touxiangImg: headPortrait == '' ? res.userInfo.avatarUrl : headPortrait,
                userName: res.userInfo.nickName
              })
            } else {
              that.setData({
                touxiangImg: headPortrait == '' ? '' : headPortrait,
                userName: '用户未授权'
              })
            }

          }
        })
      })
      .catch(res => {
        that.setData({
          loginstatus: "未登录"
        });
      })
    // 判断用户是否是蒲公英
    try {
      // 获取用户的openId和手机号码
      openid = wx.getStorageSync('openid');
      phone = wx.getStorageSync('phone');
      token = wx.getStorageSync('token');
      var registrationTime = wx.getStorageSync('registrationTime'); //获取注册时间
      var Privilege = wx.getStorageSync("Privilege");
      if (Privilege == 1) {
        that.setData({
          pstatus: "1"
        })
      } else {
        that.setData({
          pstatus: "0"
        })
      }
    } catch (e) { }
    // 获取用户注册时间（判断缓存是否有注册时间，有则不执行）
    if (registrationTime != '') {
      let registrationMonthFZ = registrationTime.split('-')
      this.setData({
        registrationYear: registrationMonthFZ[0],
        registrationMonth: registrationMonthFZ[1]
      })
    } else {
      if (wx.getStorageSync('phone')) {
        this.loadData();
      }

    }
    console.log(`是否打开特权${this.data.pstatus}`)
    // if()
    var userdata = {
      "token": "",
      "loginMark": "",
      "data": wx.getStorageSync('openid')
    }
    if (wx.getStorageSync('phone')) {
      validateusertype(userdata).then(res => {
        if (res.code == 200 && res.data.F_UserType == "蒲公英") {
          that.setData({
            loginstatus1: "蒲公英"
          })
         
          getdandelioninfo().then(function (res) {
            console.log(res)
            if (res.code == 200) {
              that.setData({
                vipCode: res.data.invitation_code,
                uvanstar_count: res.data.uvanstar_count
              })
            } else if (res.code == 400) {
              console.log(res.info)
            }
          })
        } else {
          that.setData({
            loginstatus1: "非蒲公英"
          })
        }
      })

    }
    if (wx.getStorageSync('phone')) {
      //检测是否拥有子账号
      this.getSubAccount();

      // 获取蒲公英本月销售额和订单总额
      this.getMonthlySales();

      // 获取用户累计收益
      this.getUserAccumulatedEarnings();

      // 获取用户账户余额
      this.getuserBalance();
    }
  },
  //检测是否拥有子账号
  getSubAccount() {
    var userdata = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": {}
    },
      _this = this
    let header = 'application/json'
    GetSubAccountList(userdata, header)
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          _this.setData({
            SubAccount: 1
          })
        } else {
          _this.setData({
            SubAccount: 0
          })
        }
      })
      .catch(e => {
        console.log(e)
        _this.setData({
          SubAccount: 0
        })
      })
  },

  // 获取蒲公英本月销售额和订单总额
  getMonthlySales() {
    getordersamount().then(res => {
      if (res.code == 200) {
        this.setData({
          monthAmount: parseInt(res.data.monthAmount),
          totalAmount: parseInt(res.data.totalAmount)
        })
      } else if (res.code == 400) {
        this.setData({
          monthAmount: 0,
          totalAmount: 0
        })
      }
      console.log(res)
    })
  },

  // 获取用户累计收益
  getUserAccumulatedEarnings() {
    GetUserIncomeProfit().then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          UserIncomeProfit: parseInt(res.data)
        })
      } else if (res.code == 400) {
        this.setData({
          UserIncomeProfit: 0
        })
      }
    })
  },
  //获取用户账户余额
  getuserBalance() {
    GetUserIncomeBalance().then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          UserIncomeBalance: parseInt(res.data)
        })
      } else if (res.code == 400) {
        this.setData({
          UserIncomeBalance: 0
        })
      }
    })
  },

  // to提现页面
  toCash: function () {
    wx.navigateTo({
      url: 'incomeList/cash/cash?FAllPrice=' + this.data.UserIncomeBalance
    })
  },

  // to梵星类表页
  toVIPList: function () {
    wx.navigateTo({
      url: "vipManage/vipList/vipList?touxiangimg=" + this.data.touxiangImg + '&username=' + this.data.userName
    })
  },

  tosubaccount() {
    wx.navigateTo({
      url: './subaccountbaobiao/subaccountbaobiao',
    })
  },
  k3customer: function () {
    //loading
    var _this = this;
    this.setData({
      isK3Show: false
    })
    var k3data = {
      "token": token,
      "loginMark": phone,
      "data": {
        'openid': openid,
        'phone': phone
      }
    }
    k3customerinfo(k3data)
      .then(res => {
        _this.setData({
          isK3Show: true
        })
        if (res.info == "升级蒲公英成功！") {
          //成功
          debugger;
          wx.setStorageSync("characterType", "蒲公英")
          // var url = '/lr/s2bapi/getdandelioninfo?token=' + token + '&loginMark=' + phone + '&data=' + openid + '';
          getdandelioninfo().then(function (res) {
            console.log(res)
            _this.setData({
              vipCode: res.data.invitation_code,
              loginstatus1: "蒲公英"
            })
          })
        } else if (res.info == "未在K3系统找到客户信息！") {
          wx.showModal({
            title: '提示',
            content: "很遗憾未搜索到您曾购买的记录",
          })
        } else {
          var info = res.data.ErrorMsg;
          wx.showModal({
            title: '提示',
            content: info,
          })
        }
      })
      .catch(res => {
        _this.setData({
          isK3Show: true
        })
      })
    //loading
  },
  toInfo: function () {
    const _this = this
    wx.navigateTo({
      url: "./info/info?vipCode=" + _this.data.vipCode + "&name=" + _this.data.name
    })
  },
  onShareAppMessage: function (res) {
    let nickname = wx.getStorageSync('userName') || " "
    let openid = wx.getStorageSync('openid')
    let invitationID = common.uuid()
    let phone = wx.getStorageSync('phone')
    let token = wx.getStorageSync('token')

    const _this = this
    if (res.target.dataset.id == 0) {
      wx.getUserInfo({
        success: function (res) {
          console.log(res)
          nickname = res.userInfo.nickName
          common.commonShare('梵星邀请函', nickname, openid, '', invitationID, 'pages/me/uvStar1/uvStar1')
        },
        fail: function (err) {
          console.log(err)
          common.commonShare('梵星邀请函', nickname, openid, '', invitationID, 'pages/me/uvStar1/uvStar1')
        }
      })
      _this.hiddenCover()
      return {
        title: '梵星邀请函',
        path: '/pages/me/uvStar1/uvStar1?openid=' + openid + '&phone=' + phone + '&invitationID=' + invitationID,
        imageUrl: 'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/05beb5c571454801bfba12c65e91cd5c',
        success: function (res) { },
        fail: function (res) { }
      }
    } else if (res.target.dataset.id == 1) {
      // let invitationID = common.randomString('P', 15)
      // this.setData({
      //   invitationID: invitationID
      // })
      wx.getUserInfo({
        success: function (res) {
          console.log(res)
          nickname = res.userInfo.nickName
          common.commonShare('蒲公英邀请函', nickname, openid, '', invitationID, '/pages/me/dandelion/dandelion')
        },
        fail: function (err) {
          console.log(err)
          common.commonShare('蒲公英邀请函', nickname, openid, '', invitationID, '/pages/me/dandelion/dandelion')
        }
      })
      return {
        title: '蒲公英邀请函',
        path: '/pages/me/dandelion/dandelion?openid=' + openid + '&phone=' + phone + '&token=' + token + '&invitationID=' + invitationID + '&invitationCode=' + this.data.vipCode,
        imageUrl: 'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/1c460bf2ed244f9cb324947b67396973',
        success: function (res) {
          console.log('/pages/me/dandelion/dandelion?openid=' + openid + '&phone=' + phone + '&token=' + token + '&invitationID=' + invitationID + '&invitationCode=' + _this.data.vipCode)
         
        },
        fail: function (res) {
          // 转发失败
        }
      }
    } else if (res.target.dataset.id == 2) {
    
      wx.getUserInfo({
        success: function (res) {
          console.log(res)
          nickname = res.userInfo.nickName
          common.commonShare('特权蒲公英邀请函', nickname, openid, '', invitationID, '/pages/me/privilege/privilege')

          let inviteData = {
            'F_DandelionOpenId': openid,
            'F_InvitationsId': invitationID,
            'F_InviteType': 'T',
            'F_DandelionName': nickname,
            'F_PhoneNumber': phone
          }
          PrivilegeLink(inviteData)
        },
        fail: function (err) {
          console.log(err)
          common.commonShare('特权蒲公英邀请函', nickname, openid, '', invitationID, '/pages/me/privilege/privilege')

          let inviteData = {
            'F_DandelionOpenId': openid,
            'F_InvitationsId': invitationID,
            'F_InviteType': 'T',
            'F_DandelionName': nickname,
            'F_PhoneNumber': phone
          }
          PrivilegeLink(inviteData)
        }
      })

      return {
        title: '特权蒲公英邀请函',
        path: '/pages/me/privilege/privilege?inviteopenid=' + openid + '&invitephone=' + phone + '&token=' + token + '&invitationID=' + this.data.invitationID + '&invitationCode=' + this.data.vipCode,
        imageUrl: 'https://uvpt.uvanart.com/upload/static/shopInfo/dandelion.jpg',
        success: function (res) {
         
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  },
  saleList: function () {
    wx.navigateTo({
      url: 'saleList/saleList'
    })
  },
  advanceSaleList: function () {
    wx.navigateTo({
      url: 'advanceSale/advanceSale'
    })
  },
  incomeList: function () {
    wx.navigateTo({
      url: 'incomeList/incomeList'
    });
  },
  toSelect2: function () {
    wx.navigateTo({
      url: './dOrderlist/dOrderlist'
    })
  },
  toSelect3: function () {
    wx.navigateTo({
      url: './dOrderlist/dOrderlist?select=' + 3
    })
  },
  toSelect4: function () {
    wx.navigateTo({
      url: './dOrderlist/dOrderlist?select=' + 4
    })
  },
  toSelect5: function () {
    wx.navigateTo({
      url: './dOrderlist/dOrderlist?select=TK'
    })
  },
  toEnable: function () {
    wx.navigateTo({
      url: "./dandelion1/enable/enable"
    })
  },
  toUVPost: function () {
    
        wx.navigateTo({
          url: "./uvpost/uvpost"
        })
  
  },
  toVIPManage: function () {
    wx.navigateTo({
      url: "./vipManage/vipManage"
    })
  },
  toInfo: function () {
    const _this = this
    wx.navigateTo({
      url: "./info/info?vipCode=" + _this.data.vipCode + "&name=" + _this.data.name
    })
  },
  toH5: function () {
    wx.navigateTo({
      url: "/pages/privilege/h5report/h5report"
    })
  },
  // 
  invalid: function () {
    return;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, this.data.nowbannerName)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, this.data.nowbannerName)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  showsharewin() {
    wx.hideTabBar()
    this.setData({
      showwin: true,
      isTap: false
    })

  },
  hiddenCover() {
    wx.showTabBar()
    this.setData({
      isTap: true,
      showwin: false,
      showqrcode: false,
    })

  },
  createQRcode() {
    if (this.data.qrcodeimg != '') {
      //已经生成二维码且图片未被销毁的情况下，不再重复生成
      this.setData({
        showqrcode: true,
        showwin: false
      })
      return
    }
    if (this.data.canCreate == false) {
      wx.showToast({
        title: '请勿频点击',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.setData({
      canCreate: false
    })
    wx.showLoading({
      title: '加载中',
    })
    let nickname = wx.getStorageSync('userName') || " "
    let openid = wx.getStorageSync('openid')
    let invitationID = common.uuid()
    let phone = wx.getStorageSync('phone')
    let token = wx.getStorageSync('token')
    //缓存没有openid的话就用接口取
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        nickname = res.userInfo.nickName
        common.commonShare('梵星邀请函', nickname, openid, '', invitationID, 'pages/me/uvStar1/uvStar1')
      },
      fail: function (err) {
        console.log(err)
        common.commonShare('梵星邀请函', nickname, openid, '', invitationID, 'pages/me/uvStar1/uvStar1')
      }
    })
    let qrcodedata = {
      "token": token,
      "loginMark": phone,
      "data": {
        "F_ID": invitationID,
        "F_PageUrl": "pages/me/uvStar1/uvStar1",
        "F_QrCodeName": "梵星邀请函二维码",
        "F_QRCodeSource": "F"
      }
    }
    let header = 'application/json'
    InvitedQrCode(qrcodedata, header)
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          wx.hideLoading()
          this.setData({
            showqrcode: true,
            showwin: false,
            qrcodeimg: res.info,
            canCreate: true
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '请稍后再试',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            canCreate: true
          })
        }
      })
  },
  previewIMG() {
    const _this = this
    wx.previewImage({
      current: _this.data.qrcodeimg, // 当前显示图片的http链接
      urls: [_this.data.qrcodeimg] // 需要预览的图片http链接列表
    })
  },
  saveqrcode() {
    if (this.data.canSave == false) {
      return
    }
    this.setData({
      canSave: false
    })
    const _this = this
    wx.downloadFile({
      url: _this.data.qrcodeimg,
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (res) => {
              wx.showToast({
                title: '已保存到本地相册',
                icon: 'success',
                duration: 1500
              })
              _this.setData({
                canSave: true
              })
            },
            fail: (err) => {
              wx.showToast({
                title: '保存失败，请点击图片长按保存',
                icon: 'none',
                duration: 2000
              })

              _this.setData({
                showqrcode: true,
                showwin: false,
                canSave: true
              })
            }
          })
        }
      }
    })
  },
  toLogin(event) {
    console.log('formid为 ' + `${event.detail.formId}`);
    common.postformid(event.detail.formId);
    wx.navigateTo({
      url: 'twicelogin/twicelogin',
    })
  },
  // 蒲公英特权弹框
  showBounced(){
    this.setData({
      showPGYBounced: false
    })
  },
  // 取消弹框
  cancel(){
    this.setData({
      showPGYBounced:true
    })
  }

})