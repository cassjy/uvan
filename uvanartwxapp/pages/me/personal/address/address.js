var api = require("../../../../utils/API/request.js")
var common = require("../../../../utils/common.js")
import { getmyaddress, UpdateMyAddress} from '../../../../utils/API/me/api.js'

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    addressId: '',
    noAddress: true,
    chooseID: 'xx',
    oldChooseID: '',
    hiddenGou: false,
    startID: ''  //梵星页面点击进入
  },


  //搜索地址
  search: function () {
    wx.showToast({
      title: '功能暂未开发',
    })
  },

  // 选择地址
  chooseAddress: function (e) {
    console.log(e)

    var _this = this;
    var hisID = this.data.chooseID;
    var newID = e.currentTarget.dataset.index;

    if (newID == hisID) {
      this.setData({
        chooseID: e.currentTarget.dataset.index,
        hiddenGou: !_this.data.hiddenGou
      })
    } else {
      this.setData({
        chooseID: e.currentTarget.dataset.index,
        hiddenGou: true
      })
    }
    //获取当前页面栈实例
    if (this.data.startID != 1) {
      let routes = getCurrentPages();
      let prvePage = routes[routes.length - 2];
      switch (this.data.dataList[newID].province) {
        case '北京市': this.data.dataList[newID].province = '北京'
          break;
        case '重庆市': this.data.dataList[newID].province = '重庆'
          break;
        case '天津市': this.data.dataList[newID].province = '天津'
          break;
        case '上海市': this.data.dataList[newID].province = '上海'
          break;
      }
      console.log(`选择的地址${JSON.stringify(this.data.dataList[newID])}`)
      prvePage.setData({
        consignee: this.data.dataList[newID],
      });
      wx.navigateBack({
      });
    } else {
      return;
    }

  },

  //  添加地址逻辑事件
  addAddress: function (event) {
    wx.navigateTo({
      url: '../newAddress/newAddress',
    })
  },

  // 删除地址
  deleteAddress: function (e) {
    console.log(e)
    var _this = this;
    var deleteData = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": {
        "id": e.currentTarget.dataset.id,
      }
    }
    var header = 'application/json'
    console.log(deleteData)
    wx.showModal({
      title: '优梵艺术提醒您！',
      content: '是否删除该地址?',
      success: function (res) {
        if (res.confirm) {
          UpdateMyAddress(deleteData, header).then(res => {
            console.log(res)
            if (res.code == 200) {
              wx.showToast({
                title: '删除成功',
              })
              // 重新获取地址列表
              _this.requireAddressList();
            } else {
              wx.showToast({
                title: '刪除失败',
                icon: "none",
                image: "../../../../images/index/error.png"
              })
            }
          })
            .catch(res => {
              console.log(res)
              wx.showToast({
                title: '刪除失败',
                icon: "none",
                image: "../../../../images/index/error.png"
              })
            })
        } else if (res.cancel) {

        }
      }
    })

  },

  // 修改地址信息

  upData: function (e) {
    var _this = this;
    var obj = this.data.dataList[e.currentTarget.dataset.index]
    console.log(obj)
    wx.navigateTo({
      url: '../newAddress/newAddress?addressId=' + obj.id + '&address=' + obj.address + '&city=' + obj.city + '&county=' + obj.county + '&customer_name=' + obj.customer_name + '&is_default=' + obj.is_default + '&label=' + obj.label + '&province=' + obj.province + '&phone=' + obj.phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      startID: options.id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)

    this.requireAddressList();
  },
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "收货地址管理")
  },
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "收货地址管理")
  },
  // 获取地址列表公用方法
  requireAddressList: function () {
    var _this = this;
    try {
      var token = wx.getStorageSync('token');
      var phone = wx.getStorageSync('phone');
      var openid = wx.getStorageSync('openid');
      var url = '/lr/s2bapi/getmyaddress?token=' + token + '&loginMark=' + phone + '&data=' + openid + '';
      console.log(url)
      getmyaddress(token, phone, openid).then(res => {
        console.log(res)
        if (res.data.length > 0) {
          _this.setData({
            noAddress: true
          })
        } else {
          _this.setData({
            noAddress: false
          })
        }
        _this.setData({
          dataList: res.data
        })
      })
        .catch(res => {
          console.log(res)
        })
        .then(res => {
          wx.hideLoading()
        })
    } catch (e) {
      console.log(e)
    }
  }

})