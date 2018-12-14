var api = require("../../../utils/API/request.js");
const Url = require("../../../utils/API/url.js")
var common = require("../../../utils/common.js"); // pages/mine/personalData/personalData.js
import {
  PersonalInfoSendVanBean,
  oldcustomergetvanbean,
  savepersonaldata,
  getcustomerguidepage,
  getpersonaldata
} from '../../../utils/API/me/api.js'

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '未选择',
    email: '',
    name: '',
    head: '',
    headState: '',
    phone: '',
    emailok: "",
    nameok: "",
    mchoose: "",
    wchoose: "",
    vbsex: false,
    vbbirthday: false,
    vbemail: false,
    realName: false,
    hiddenShadow: true,
    changeColor: false,
    emptyInfoCount: 0,
    hadClickBean: false,
    checkedRadio: false,
    radioId: 0
  },

  // 无效方法
  invalid: function() {
    return;
  },

  // 引导层确认事件
  enSure: function() {
    this.setData({
      changeColor: false,
      hiddenShadow: true
    })
    this.loadData('B');
  },

  //上传头像
  uploadPic: function() {
    var _this = this;
    let type;
    let url = Url.host + "/lr/s2bapi/UploadCustomerHeadImage";
    console.log(url)
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#5e5e5e",
      success: function(e) {
        //判断用户点击的是相册还是拍照
        if (e.tapIndex === 0) {
          type = 'album';
        } else if (e.tapIndex === 1) {
          type = 'camera';
        } else {
          return;
        }
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: [type],
          success: function(res) {
            console.log(res)
            let tempFilePaths = res.tempFilePaths.toString();
            console.log(tempFilePaths)
            wx.showLoading({
              title: '上传中...',
            })
            wx.uploadFile({
              url: url,
              filePath: tempFilePaths,
              name: 'file',
              header: {
                'content-type': 'multipart/form-data',
                'token': wx.getStorageSync('token')
              },
              formData: {
                "token": wx.getStorageSync('token'),
                "loginMark": wx.getStorageSync('phone')
              },
              success: function(res) {
                console.log('图片上传成功')
                console.log(res)
                _this.onloadData();
                // 显示弹框，用户点击回到个人中心
              },
              fail: function(res) {
                console.log('图片上传失败')
                console.log(res)
              }
            })
          }
        })

      }
    })
  },
  //保存个人信息
  setdata: function(key, value) {
    wx.showLoading({
      title: '修改中...',
    })
    var data = {
        "token": wx.getStorageSync('token'),
        "loginMark": wx.getStorageSync('phone'),
        "data": {
          'openid': wx.getStorageSync('openid'),
          'key': key,
          'value': value
        }
      },
      _this = this;
    var header = "application/json";
    savepersonaldata(data, header).then(function(res) {
      console.log(res)
      console.log(res.data)
      console.log("保存成功")
      wx.hideLoading()
      if (key == "XB") {
        _this.addvb("VBSex", _this.data.vbsex)
        _this.setData({
          vbsex: false
        })
      } else if (key == "CSRQ") {
        _this.addvb("VBBirthday", _this.data.vbbirthday)
        _this.setData({
          vbbirthday: false
        })
      } else if (key == "YX") {
        _this.addvb("VBEmail", _this.data.vbemail)
        _this.setData({
          vbemail: false
        })
      } else if (key == 'ZSXM') {
        console.log('...................测试..............')
        _this.addvb("VBCustomerName", _this.data.realName)
        _this.setData({
          realName: false,
          nameok: ""
        })
      }
    })
  },
  //填信息触发获取梵豆
  addvb: function(key, ut) {
    console.log(key + "----" + ut)
    if (ut) {
      wx.showLoading({
        title: '修改中...',
      })
      console.log(key)
      // var data = {
      //   "token": wx.getStorageSync('token'),
      //   "loginMark": wx.getStorageSync('phone'),
      //   "data": key
      // }
      // var recordUrl = '/s2b/vanbean/PersonalInfoSendVanBean?token=' + wx.getStorageSync('token') + "&loginMark=" + wx.getStorageSync('phone') + '&data=' + key;
      var header = "application/json";
      PersonalInfoSendVanBean(key).then(function(res) {
        console.log(res)
        wx.hideLoading()
        if (res.code == 200) {
          wx.showToast({
            title: '梵豆+1',
            icon: 'none',
            duration: 2000
          })
        } else if (res.code == 400) {
          console.log('已经送过梵豆了')
        }

      })
    }
  },

  //  真实姓名
  checkRealName: function(e) {
    console.log(e.detail.value)
    if (e.detail.value == "") { //输入不能为空
      this.setData({
        nameok: "wrong"
      })
    } else {
      this.setdata("ZSXM", e.detail.value)
    }
  },

  // 性别选择
  chooseSex: function(e) {
    wx.showLoading({
      title: '修改中...',
    })
    setTimeout(() => {
      wx.hideLoading()
      console.log(e.currentTarget.dataset.id)
      this.setData({
        radioId: e.currentTarget.dataset.id,
        checkedRadio: true
      })
      if (parseInt(e.currentTarget.dataset.id) == 1) {
        this.setdata("XB", 1)
      } else if (parseInt(e.currentTarget.dataset.id) == 2) {
        this.setdata("XB", 0)
      }
    }, 300);
  },
  checkemail: function(e) {
    console.log("---邮箱----")
    console.log(e.detail.value)
    console.log(e)
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; //正则表达式
    if (e.detail.value === "") { //输入不能为空
      this.setData({
        emailok: "wrong"
      })
    } else if (!reg.test(e.detail.value)) { //正则验证不通过，格式不对
      this.setData({
        emailok: "wrong"
      })
    } else {
      this.setData({
        emailok: " "
      })
      this.setdata("YX", e.detail.value)
    }
  },
  // 出生日期选择
  dateChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.setdata("CSRQ", e.detail.value)
  },

  //  加载公用方法
  loadData: function(type) {
    var _this = this;
    try {
      var token = wx.getStorageSync('token');
      var phone = wx.getStorageSync('phone');
      var data = {
        "token": token,
        "loginMark": phone,
        "data": {
          "key": type
        }
      };
      var header = "application/json";
      getcustomerguidepage(data, header).then(res => {
          console.log(res)
          if (res.code == 400 || type == 'B') {
            return;
          } else if (res.data.profilePageStatus === null || res.data.profilePageStatus == '') {
            _this.setData({
              hiddenShadow: false,
              changeColor: true
            })
          } else {
            return;
          }

        })
        .catch(res => {
          console.log(res)
        })
    } catch (e) {
      console.log(e)
    }
  },
  receiveBean: function() {
    const _this = this
    if (this.data.hadClickBean == true) {
      return
    } else {
      this.setData({
        hadClickBean: true
      })
      let token = wx.getStorageSync('token');
      let phone = wx.getStorageSync('phone');
      var receiveBeanData = {
        "token": token,
        "loginMark": phone
      }
      oldcustomergetvanbean(receiveBeanData)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            common.showModal('成功领取' + res.info + '梵豆。', '提示', function(res) {
              _this.setData({
                hadClickBean: false
              })
              if (res.confirm) {

                return
              }
            })
          } else if (res.code == 400 && res.info == "用户已经获取历史订单梵豆") {
            common.showModal('您已经领取过老顾客梵豆。', '提示', function(res) {
              _this.setData({
                hadClickBean: false
              })
              if (res.confirm) {

                return
              }
            })
          } else if (res.code == 400 && res.info == "未找到订单信息") {
            common.showModal('您未曾购买优梵产品哦。', '提示', function(res) {
              _this.setData({
                hadClickBean: false
              })
              if (res.confirm) {

                return
              }
            })
          } else if (res.code == 400 && res.info == "没有梵豆") {
            common.showModal('您目前还没有能领取的梵豆。', '提示', function(res) {
              _this.setData({
                hadClickBean: false
              })
              if (res.confirm) {

                return
              }
            })
          }
        })
      // }
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("+++++++");
    console.log(options);
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    this.loadData();
    wx.showLoading({
      title: '加载中'
    })
    _this.setData({
      wchoose: false,
      mchoose: false
    })
    wx.getStorage({
      key: 'phone',
      success: function(res) {
        console.log(res)
        _this.setData({
          phone: res.data
        })
      },
    })
    this.onloadData();
  },


  onloadData: function() {
    var _this = this;
    var data = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": {
        'openid': wx.getStorageSync('openid'),
        'key': 'YJ'
      }
    }
    var header = "application/json";
    getpersonaldata(data, header).then(function(res) {
        console.log("#########################bug");
        console.log(res)
        if (res.code == 400 && res.info == '访问受限') {
          wx.showToast({
            title: '访问太频繁，请稍后再试',
            icon: 'none'
          })
          return;
        }
        console.log("获取成功")
        var head2;
        if (res.data.head === null || res.data.head == '') {
          head2 = '';
          _this.setData({
            headState: true,
            head: ''
          })
        } else {
          head2 = res.data.head;
          _this.setData({
            headState: false,
            head: res.data.head
          })
        }
        //  把头像地址存进缓存
        wx.setStorageSync('headPortrait', head2)
        // debugger;
        wx.hideLoading();
        if (res.data.sex === null) {
          _this.setData({
            vbsex: true
          })
        }
        if (res.data.email === null) {
          _this.setData({
            vbemail: true
          })
        }
        if (res.data.birthdate === null) {
          _this.setData({
            vbbirthday: true
          })
        }
        if (res.data.name === null) {
          _this.setData({
            realName: true
          })
        }


        if (res.data.sex == 0) {
          _this.setData({
            wchoose: true,
            mchoose: false,
            checkedRadio: true,
            radioId: 2
          })
        } else if (res.data.sex == 1) {
          _this.setData({
            wchoose: false,
            mchoose: true,
            checkedRadio: true,
            radioId: 1
          })
        }
        console.log(res.data.birthdate)
        if (res.data.birthdate !== null) {
          _this.setData({
            date: res.data.birthdate.slice(0, 10)
          })
        }
        _this.setData({
          email: res.data.email,
          name: res.data.name,
        })

        console.log(_this.data.head)
      })
      .catch(res => {
        console.log(res)
      })
      .then(res => {
        wx.hideLoading()
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //开始计时（停留时间）
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)

    this.setData({
      emptyInfoCount: 0
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "个人资料")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "个人资料")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})