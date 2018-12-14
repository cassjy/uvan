var api = require("../../../../utils/API/request.js");
var common = require("../../../../utils/common.js")
import {
  PersonalInfoSendVanBean,
  getpersonaldata,
  savepersonaldata,
  getpersonalmultipledata
} from '../../../../utils/API/me/api.js'
var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showMore: true,
    trunok: true,
    adddou: false,
    addnum: 0,
    occupationld: "",
    industryld: "",
    carRangeld: "",
    marriageld: "",
    userTypeld: "",
    renovationRangeld: "",
    budgetld: "",
    hobbyld: "",
    styleld: "",
    spaceld: "",
    occupationvalue: "",
    industryvalue: "",
    carRangevalue: "",
    marriagevalue: "",
    userTypevalue: "",
    renovationRangevalue: "",
    budgetvalue: "",
    //hobbyvalue:"",
    //stylevalue:"",
    //spacevalue:"",
    items: ['运动', '画画', '购物', '唱歌', '音乐', '书法', '旅游', '阅读', '电影', '美食', '思考', '跳舞'],
    //style:['美式','北欧','新古典','艺术','儿童','户外','LOFT'],
    //space:['客厅','主卧室','次卧室','餐厅','书房','儿童房'],
    occupation: ['金融/保险/银行', '贸易/制造', '制药/医疗', '广告/媒体', '房地产/建筑', '教育/培训', '服务业', '物流/运输', '能源/原材料', '农业', '政府/非盈利机构', '其他'],
    industry: ['互联网/通讯/电子', '金融/保险/银行', '贸易/制造', '制药/医疗', '广告/媒体', '房地产/建筑', '教育/培训', '服务业', '物流/运输', '能源/原材料', '农业', '政府/非盈利机构'],
    carRange: ['无车', '<10万', '10-20万', '20-40万', '大于40万'],
    marriage: ['未婚', '已婚'],
    userType: ['一居室', '二居室', '三居室', '四居室', '复式', '别墅'],
    renovationRang: ['全局装修', '局部装修'],
    budget: ['<2万', '2-4万', '4-6万', '6-8万', '8-10万', '>10万'],

    changevalue: '', //存放checkBox值
    hobby: [{
      value: '运动',
      isChecked: false
    }, {
      value: '画画',
      isChecked: false
    }, {
      value: '购物',
      isChecked: false
    }, {
      value: '唱歌',
      isChecked: false
    }, {
      value: '音乐',
      isChecked: false
    }, {
      value: '书法',
      isChecked: false
    }, {
      value: '旅游',
      isChecked: false
    }, {
      value: '阅读',
      isChecked: false
    }, {
      value: '电影',
      isChecked: false
    }, {
      value: '美食',
      isChecked: false
    }, {
      value: '思考',
      isChecked: false
    }, {
      value: '跳舞',
      isChecked: false
    }],
    style: [{
      value: '美式',
      isChecked: false
    }, {
      value: '北欧',
      isChecked: false
    }, {
      value: '新古典',
      isChecked: false
    }, {
      value: '艺术',
      isChecked: false
    }, {
      value: '儿童',
      isChecked: false
    }, {
      value: '户外',
      isChecked: false
    }, {
      value: 'LOFT',
      isChecked: false
    }],
    space: [{
      value: '客厅',
      isChecked: false
    }, {
      value: '主卧室',
      isChecked: false
    }, {
      value: '次卧室',
      isChecked: false
    }, {
      value: '餐厅',
      isChecked: false
    }, {
      value: '书房',
      isChecked: false
    }, {
      value: '儿童房',
      isChecked: false
    }],
    items: [],
    key: "",
    addnummore: false, //判断用户选择多选原值是否存在
    firstTime: true //用户初次进入该界面
  },
  //自定义多选弹框组件By--Rex Begin
  // 打开选择更多弹框
  ToMoreWrapper: function(e) {
    console.log(e)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      showMore: false,
    })
    if (e.currentTarget.dataset.id == 1) {
      // wx.setNavigationBarTitle({
      //   title: '爱好'
      // })
      if (this.data.hobbyld == "") {
        this.setData({
          addnummore: true
        })
      } else {
        this.setData({
          addnummore: false
        })
      }
      this.setData({
        items: this.data.hobby,
        key: "AH",
        changevalue: ''
      })
      // console.log(this.data.items)
    } else if (e.currentTarget.dataset.id == 2) {
      // wx.setNavigationBarTitle({
      //   title: '装修风格',
      // })
      if (this.data.styleld == "") {
        this.setData({
          addnummore: true
        })
      } else {
        this.setData({
          addnummore: false
        })
      }
      this.setData({
        items: this.data.style,
        key: "JJFG",
        changevalue: ''
      })
    } else if (e.currentTarget.dataset.id == 3) {
      // wx.setNavigationBarTitle({
      //   title: '装修空间',

      // })
      if (this.data.spaceld == "") {
        this.setData({
          addnummore: true
        })
      } else {
        this.setData({
          addnummore: false
        })
      }
      this.setData({
        items: this.data.space,
        key: "ZXKJ",
        changevalue: ''
      })
    }
    this.getdata()
  },

  //多选公用方法，根据key值匹配各自的多选选项
  getdata: function(key) {
    var data = {
        "token": wx.getStorageSync('token'),
        "loginMark": wx.getStorageSync('phone'),
        "data": {
          'openid': wx.getStorageSync('openid'),
          'key': this.data.key
        }
      },
      _this = this
    var header = "application/json";
    getpersonalmultipledata(data, header).then(function(res) {
        console.log(res)
        wx.hideLoading()

        // 判断返回的爱好数组是否为空，是空则不保存
        if (res.data !== null) {
          _this.setData({
            changevalue: res.data,
          })
          for (let i = 0; i < res.data.length; i++) {
            _this.data.items.forEach(function(item, index, input) {
              if (input[index].value == res.data[i]) {
                input[index].isChecked = true
              }
            })
          }
          console.log(_this.data.items)
          _this.setData({
            items: _this.data.items
          })

        }
      })
      .catch(res => {
        console.log(res)
      })
      .then(res => {
        wx.hideLoading();
      })
  },
  //  点击自定义弹框组件确认事件
  saveAllData: function() {
    console.log(this.data.changevalue)
    this.saveData();
  },

  //  保存事件
  saveData: function() {
    var _this = this;
    wx.showLoading({
      title: '保存中'
    })
    //如果勾选为0，则把value设为null
    if (this.data.changevalue.length == 0) {
      var value = null;
    } else {
      var value = this.data.changevalue.toString();
    }

    var data = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": {
        'openid': wx.getStorageSync('openid'),
        'key': this.data.key,
        'value': value
      }
    }
    var header = "application/json";
    debugger
    if (this.data.addnummore && value === null) {
      console.log('我是第一次进入该界面，我可以不选择直接按保存哦')
      // wx.navigateBack({
      //   delta: 1
      // })
      this.refreshPage();
      this.setData({
        showMore: true
      })
    } else if (value === null) {
      console.log('用户以前已进入该界面选择选项，不能清空所有选择按保存')
      wx.showToast({
        title: '请至少选择一项',
        icon: 'none',
        image: "../../../../images/index/error.png",
        duration: 2000
      })
    } else {
      savepersonaldata(data, header).then(function(res) {
          console.log(res)
          console.log("保存成功")
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500,
            success: function(res) {
              _this.refreshPage();
              _this.setData({
                showMore: true
              })
              if (_this.data.addnummore) {
                _this.setData({
                  addnum: _this.data.addnum + 1
                })
                console.log(_this.data.addnum)
              }
              if (_this.data.addnum == 10) {
                _this.addvb()
              }
            }
          })
        })
        .catch(res => {
          console.log(res)
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            image: "../../../../images/index/error.png",
            duration: 1500
          })
        })
    }
  },

  // 取消选择
  cancelChoose: function() {
    this.setData({
      showMore: true
    })
  },
  // checkbox事件
  checkboxChange: function(e) {
    console.log(e);
    this.setData({
      changevalue: e.detail.value
    })
    console.log(this.data.changevalue)
  },
  //自定义多选弹框组件By--Rex  End

  /**
   * 生命周期函数--监听页面加载
   */
  setdata: function(key, value) {
    var _this = this;
    var data = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": {
        'openid': wx.getStorageSync('openid'),
        'key': key,
        'value': value
      }
    }
    var header = "application/json";
    savepersonaldata(data, header).then(function(res) {
      console.log(res)
      if (res.code == 200) {
        _this.refreshPage()
      }
    }).catch(function(error) {
      console.log(error)
    })
  },
  //填信息触发获取梵豆
  addvb: function() {
    if (this.data.adddou) {
      // var recordUrl = '/s2b/vanbean/PersonalInfoSendVanBean?token=' + wx.getStorageSync('token') + "&loginMark=" + wx.getStorageSync('phone') + '&data=VBPerfect';
      let key = 'VBPerfect'
      PersonalInfoSendVanBean(key).then(function(res) {
          console.log(res)
          if (res.code == 200) {
            wx.showToast({
              title: '梵豆+10',
              icon: 'none',
              duration: 2000
            })
          } else if (res.code == 400) {
            console.log('已经送过梵豆')
          }

        })
        .catch(res => {
          console.log(res)
        })
    }
  },
  //职业
  occupationChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      occupationvalue: e.detail.value
    })
    this.setdata("ZY", this.data.occupation[e.detail.value])
    this.addchecknum(this.data.occupationld)
    if (this.data.addnum == 10) {
      this.addvb()
    }
  },
  //行业
  industryChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      industryvalue: e.detail.value
    })
    this.setdata("HY", this.data.industry[e.detail.value])
    this.addchecknum(this.data.industryld)
    if (this.data.addnum == 10) {
      this.addvb()
    }
  },
  //座驾范围
  carRangeChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      carRangevalue: e.detail.value
    })
    this.setdata("ZJFW", this.data.carRange[e.detail.value])
    this.addchecknum(this.data.carRangeld)
    if (this.data.addnum == 10) {
      this.addvb()
    }
  },
  //婚否
  marriageChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      marriagevalue: e.detail.value
    })
    this.setdata("HF", e.detail.value)
    this.addchecknum(this.data.marriageld)
    if (this.data.addnum == 10) {
      this.addvb()
    }
  },
  //户型
  userTypeChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      userTypevalue: e.detail.value
    })
    this.setdata("HX", this.data.userType[e.detail.value])
    this.addchecknum(this.data.userTypeld)
    if (this.data.addnum == 10) {
      this.addvb()
    }
  },
  //装修范围
  renovationRangChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      renovationRangevalue: e.detail.value
    })
    this.setdata("ZXFW", this.data.renovationRang[e.detail.value])
    this.addchecknum(this.data.renovationRangeld)
    if (this.data.addnum == 10) {
      this.addvb()
    }
  },
  //预算范围
  budgetChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      budgetvalue: e.detail.value
    })
    this.setdata("YSFW", this.data.budget[e.detail.value])
    this.addchecknum(this.data.budgetld)
    if (this.data.addnum == 10) {
      this.addvb()
    }
  },
  //检测数据修改前是否为空
  addchecknum: function(key) {
    console.log(key)
    if (key == "") {
      this.setData({
        addnum: this.data.addnum + 1
      })
      console.log(this.data.addnum)
    }
  },
  //检查是否满足填写完信息可获取梵豆
  checknull: function(key) {
    if (key == "") {
      this.setData({
        adddou: true
      })
    } else {
      this.setData({
        addnum: this.data.addnum + 1
      })
      console.log(this.data.addnum)
    }
  },
  onLoad: function(options) {

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
      trunok: true
    })
    wx.showLoading({
      title: '加载中'
    })
    this.refreshPage();
  },

  //  重新刷新页面
  refreshPage: function() {
    var data = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": {
        'openid': wx.getStorageSync('openid'),
        'key': 'ER'
      }
    }
    var _this = this
    var header = "application/json";
    getpersonaldata(data, header).then(function(res) {
      console.log(res)
      console.log("获取成功")
      wx.hideLoading();
      var marid = ""
      if (res.data.F_IsMarried !== null) {
        if (res.data.F_IsMarried == 1) {
          marid = "已婚"
        } else {
          marid = "未婚"
        }
      }
      _this.setData({
        occupationld: res.data.F_Profession === null ? "" : res.data.F_Profession,
        industryld: res.data.F_Industry === null ? "" : res.data.F_Industry,
        carRangeld: res.data.F_CarRange === null ? "" : res.data.F_CarRange,
        marriageld: marid == "" ? "" : marid,
        userTypeld: res.data.F_HouseType === null ? "" : res.data.F_HouseType,
        renovationRangeld: res.data.F_DecorateRange === null ? "" : res.data.F_DecorateRange,
        budgetld: res.data.F_BudgetRange === null ? "" : res.data.F_BudgetRange,
        hobbyld: res.data.F_Hobby === null ? "" : res.data.F_Hobby,
        styleld: res.data.F_HouseholdStyle === null ? "" : res.data.F_HouseholdStyle,
        spaceld: res.data.F_DecorateSpace === null ? "" : res.data.F_DecorateSpace
      })
      if (_this.data.firstTime) {
        _this.checknull(_this.data.occupationld)
        _this.checknull(_this.data.industryld)
        _this.checknull(_this.data.carRangeld)
        _this.checknull(_this.data.marriageld)
        _this.checknull(_this.data.userTypeld)
        _this.checknull(_this.data.renovationRangeld)
        _this.checknull(_this.data.budgetld)
        _this.checknull(_this.data.hobbyld)
        _this.checknull(_this.data.styleld)
        _this.checknull(_this.data.spaceld)
        _this.setData({
          firstTime: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "完善资料")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "完善资料")
  }
})