// pages/mine/footPrint/footPrint.js
var api = require("../../../utils/API/request.js");
var common = require("../../../utils/common.js")
import { DeleteProductBrowsingRecord, GetProductBrowsingRecord } from '../../../utils/API/me/api.js'
var page = 1;
var count = 30;

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkedDeteleIcon: false, //控制右上角删除图片显隐
    dateId: -1, //日期列表
    goodsId: -1, //日期列表下的商品列表
    checkState: false,
    dataLists: [],
    fidList: [], //用于存放需要删除商品的标识fid
    fidString: '', //fidList数组转成字符串
    hiddenNoRecord: true,
    checkAll: false,
    hideenNoMore: true
  },

  //触发右上方删除图标事件
  touchDetele: function () {
    this.setData({
      checkedDeteleIcon: !this.data.checkedDeteleIcon
    })
  },

  // 跳转到详情页
  toDetail: function (e) {
    console.log(e)
    if (this.data.checkedDeteleIcon) {
      return;
    }
    wx.navigateTo({
      url: '../../categories/detail/detail?index=' + e.currentTarget.dataset.productid + '&catename=' + e.currentTarget.dataset.productcategories
    })
  },

  // 删除浏览足迹
  cancel: function () {
    var _this = this;
    console.log(this.data.fidString)
    if (!this.data.fidString) {
      wx.showToast({
        title: '请选择删除信息',
        icon: "none",
        image: "../../../images/index/error.png"
      })
      return;
    }
    // var data = {
    //   'fid': this.data.fidString,
    //   'isDeleteAll': 'false'
    // }
    var dateleData = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data":{
        "fId": this.data.fidString,
        "isDeleteAll":"false"
      }
    }
    var header = 'application/json'
    console.log(dateleData)
    wx.showModal({
      title: '优梵艺术提醒您！',
      content: '是否删除选中记录',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          DeleteProductBrowsingRecord(dateleData, header).then((res) => {
            console.log(res)
            wx.showToast({
              title: '删除成功',
            })
            _this.setData({
              fidList: [],
              checkAll: false,
              fidList: [],
              fidString: ''
            })
            _this.loadData();
          })
            .catch((res) => {
              console.log(res)
              wx.showToast({
                title: '删除失败',
              })
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  // 全选删除浏览足迹
  checkAll: function () {
    var _this = this;
    var list = [];
    if (this.data.checkAll) {
      for (let i = 0; i < this.data.dataLists.length; i++) {
        this.data.dataLists[i].goods.forEach((vaule, index, array) => {
          this.data.dataLists[i].goods[index].isCheck = false
        })
      }
      this.setData({
        fidList: [],
        fidString: ''
      })
    } else {
      for (let i = 0; i < this.data.dataLists.length; i++) {
        this.data.dataLists[i].goods.forEach((vaule, index, array) => {
          this.data.dataLists[i].goods[index].isCheck = true
          list.push(this.data.dataLists[i].goods[index].F_ID)
        })
      }
      this.setData({
        fidList: list
      })
      this.setData({
        fidString: this.data.fidList.join(',')
      })
      console.log(this.data.fidList)
      console.log(this.data.fidString)
    }
    this.setData({
      dataLists: this.data.dataLists,
      checkAll: !this.data.checkAll
    })
    console.log(this.data.dataLists)
  },

  // radio选择
  checkRadio: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.fid)
    var _this = this;
    var array = this.data.fidList;
    this.setData({
      checkAll: false
    })
    if (array.includes(e.currentTarget.dataset.fid)) { //判断数组是否存在该fid，如果存在则剔除
      array.forEach((value, index, array) => {
        if (array[index] == e.currentTarget.dataset.fid) {
          array.splice(index, 1)
        }
      })
      _this.setData({
        fidList: array
      })
    } else { //数组不存在该fid，加进数组
      array.push(e.currentTarget.dataset.fid)
      _this.setData({
        fidList: array
      })
    }
    this.setData({
      fidString: this.data.fidList.join(',')
    })
    console.log(this.data.fidString)
    console.log(array)
    // 以下是处理足迹选择标识
    var nowsGoodsId = e.currentTarget.dataset.id;
    var nowsDateId = e.currentTarget.dataset.dateid;
    if (this.data.dataLists[nowsDateId].goods[nowsGoodsId].isCheck) { //判断用户点击的商品状态是否被勾选,若是则改变其状态
      this.data.dataLists[nowsDateId].goods.forEach((value, index, array) => {
        this.data.dataLists[nowsDateId].goods[nowsGoodsId].isCheck = false
      })
      this.setData({
        dataLists: this.data.dataLists,
      })
    } else {
      this.data.dataLists[nowsDateId].goods.forEach((value, index, array) => {
        this.data.dataLists[nowsDateId].goods[nowsGoodsId].isCheck = true
      })
      this.setData({
        dataLists: this.data.dataLists,
      })
      console.log(this.data.dataLists)
      console.log(`值为:${this.data.dataLists[nowsDateId].goods[nowsGoodsId].isCheck}`)
    }

  },

  // 请求后台用户浏览历史数据
  loadData: function () {
    var _this = this;
    // var data = {
    //   'page': page,
    //   'limit': count,
    //   'beginTime': '2018-5-10',
    //   'endTime': '2018-5-11'
    // }
    // var recordUrl = '/lr/s2bapi/GetProductBrowsingRecord?token=' + wx.getStorageSync('token') + '&loginMark=' + wx.getStorageSync('phone');
    // console.log(recordUrl)
    GetProductBrowsingRecord().then(res => {
      console.log(res)
      if (res.data.length == 0 || res.code == 400) {
        _this.setData({
          hiddenNoRecord: false,
          hideenNoMore: true
        })
      } else {
        _this.setData({
          hideenNoMore: false
        })
      }
      _this.setData({
        dataLists: res.data
      })
      console.log(_this.data.dataLists)
    })
      .catch(res => {

      })
      .then(() => {
        wx.hideLoading()
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.loadData();
    console.log(this.data.dataList)
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
  },
  onHide: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "我的足迹")
  },
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "我的足迹")
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