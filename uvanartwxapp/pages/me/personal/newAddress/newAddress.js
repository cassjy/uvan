var api = require("../../../../utils/API/request.js")
var tel = require("../../../../utils/common.js")
var navigate = require("../../../../utils/navigateTo.js")
import { savemyaddress } from '../../../../utils/API/me/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked: false,
    value: '',
    id: '',
    name: '',
    phone: '',
    province: '',
    city: '',
    county: '',
    address: '',
    region: ['', '', ''],
    defaultLabel: '',
    label: ['家', '公司', '学校', '门店', 'vip'],
    onOff: false,
    hiddenError: true
  },

  // 获取手机号码长度和验证是否正确
  requireTellength: function (e) {
    console.log(e)
    var reslut = tel.isPhone(e.detail.value);
    if (reslut == false) {
      this.setData({
        hiddenError: false
      })
    } else {
      this.setData({
        hiddenError: true
      })
    }
  },

  // 
  judge: function (e) {
    console.log(e)
    if (e.detail.cursor == 11) {
      var reslut = tel.isPhone(e.detail.value);
      if (reslut == false) {
        this.setData({
          hiddenError: false
        })
      } else {
        this.setData({
          hiddenError: true
        })
      }
    }
  },

  // 省市区逻辑事件
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      province: e.detail.value[0],
      city: e.detail.value[1],
      county: e.detail.value[2]
    })
  },

  // 标签逻辑事件
  chooseLabel: function (e) {
    var value = e.currentTarget.dataset.value;
    this.setData({
      value: value,
      isChecked: true
    })
  },
  // addLabel: function () {
  //   console.log(1)
  // },

  //  设置默认地址
  isDefault: function (e) {
    this.setData({
      defaultLabel: e.detail.value
    })
  },
  // form表单提交事件
  formSubmit: function (e) {
    var _this = this;
    // 点击提交按钮时获取name、phone和address的value值
    this.setData({
      name: e.detail.value.name,
      phone: e.detail.value.phone,
      address: e.detail.value.address
    })
    // 不能为空
    if (this.data.name == '' || this.data.phone == '' || this.data.province == '' || this.data.address == '') {
      wx.showToast({
        title: '请完善收货地址信息',
        icon: "none",
        image: "../../../../images/index/error.png"
      })
      return;
    }
    // 验证手机格式是否正确
    var reslut = tel.isPhone(e.detail.value.phone);
    if (reslut == false) {
      wx.showToast({
        title: '手机号码不正确',
        icon: 'none',
        image: "../../../../images/index/error.png"
      })
      return;
    }

    //用户点击修改时传标签传过来的值value为null，要置为空
    if (this.data.value === null) {
      this.setData({
        value: ''
      })
    }

    // 判断用户是否已经点击提交按钮，如果提交则disabled设置为true
    _this.setData({
      onOff: true
    })
    try {
      var token = wx.getStorageSync('token');
      var phone = wx.getStorageSync('phone');
      var openid = wx.getStorageSync('openid');
      var data = {
        "token": token,
        "loginMark": phone,
        "data": { "openid": openid, "customer_name": this.data.name, "phone": this.data.phone, "province": this.data.province, "city": this.data.city, "county": this.data.county, "address": this.data.address, "label": this.data.value, "is_default": this.data.defaultLabel, "id": this.data.id }
      }
      console.log(data)
      var header = "application/json";
     savemyaddress(data, header).then(res => {
        console.log('保存数据成功')
        if(res.code==200){
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: '保存失败，请重试！',
            icon:'none'
          })
          _this.setData({
            onOff:false
          })
        }
      })
    } catch (e) {
      console.log(e)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  获取用户手机号码
    this.setData({
      phone: wx.getStorageSync('phone')
    })
    // 点击修改地址触发事件改变navigationBarTitleText
    if (options.phone !== null) {
      wx.setNavigationBarTitle({
        title: '编辑地址',
      })
    } else {
      console.log("触发新建地址")
    }

    //判断省市区是否有值，如果有值存进array数组里
    if (options.province != undefined) {
      var array = [];
      array[0] = options.province;
      array[1] = options.city;
      array[2] = options.county;
    } else {
      return;
    }
    // 如果默认地址值为空或flase都要设置为false，否则直接赋值
    var defaul = '';
    if (options.is_default === "null") {
      defaul = false;
    } else if (options.is_default === "false") {
      defaul = false;
    } else {
      defaul = options.is_default;
    }
    console.log(defaul)
    this.setData({
      name: options.customer_name,
      phone: options.phone,
      province: options.province,
      city: options.city,
      county: options.county,
      region: array,
      address: options.address,
      value: options.label,
      defaultLabel: defaul,
      id: options.addressId
    })
  }
})