var api = require("../../../../../utils/API/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changevalue: "",
    hobby: [{ value: '运动', isChecked: false }, { value: '画画', isChecked: false }, { value: '购物', isChecked: false }, { value: '唱歌', isChecked: false }, { value: '音乐', isChecked: false }, { value: '书法', isChecked: false }, { value: '旅游', isChecked: false }, { value: '阅读', isChecked: false }, { value: '电影', isChecked: false }, { value: '美食', isChecked: false }, { value: '思考', isChecked: false }, { value: '跳舞', isChecked: false }],
    style: [{ value: '美式', isChecked: false }, { value: '北欧', isChecked: false }, { value: '新古典', isChecked: false }, { value: '艺术', isChecked: false }, { value: '儿童', isChecked: false }, { value: '户外', isChecked: false }, { value: 'LOFT', isChecked: false }],
    space: [{ value: '客厅', isChecked: false }, { value: '主卧室', isChecked: false }, { value: '次卧室', isChecked: false }, { value: '餐厅', isChecked: false }, { value: '书房', isChecked: false }, { value: '儿童房', isChecked: false }],
    items: [],
    key: "",
    firstTime: ''  //用户初次进入该界面
  },
  checkboxChange: function (e) {
    console.log(e);
    this.setData({
      changevalue: e.detail.value
    })
    console.log(this.data.changevalue)
    // console.log(this.data.items)
  },
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中'
    })
    // console.log(options.id)
    if (options.id == 1) {
      wx.setNavigationBarTitle({
        title: '爱好'
      })
      this.setData({
        items: this.data.hobby,
        key: "AH"
      })
      // console.log(this.data.items)
    } else if (options.id == 2) {
      wx.setNavigationBarTitle({
        title: '装修风格',
      })
      this.setData({
        items: this.data.style,
        key: "JJFG"
      })
    } else if (options.id == 3) {
      wx.setNavigationBarTitle({
        title: '装修空间',

      })
      this.setData({
        items: this.data.space,
        key: "ZXKJ"
      })
    }
    this.getdata()
  },
  tolastpage: function () {
    this.setdata();
  },
  getdata: function (key) {
    var data = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": "{'openid':'" + wx.getStorageSync('openid') + "','key':'" + this.data.key + "'}"
    },
      _this = this
    var header = "application/json";
    api.post("/lr/s2bapi/getpersonalmultipledata", data, header).then(function (res) {
      console.log(res)
      console.log("获取成功")
      // 判断返回的爱好数组是否为空，是空则不保存
      if ((res.data).toString() !== 'null') {
        _this.setData({
          changevalue: res.data,
        })
      } else {
        _this.setData({
          firstTime: res.data  //第一次进入
        })
      }

      for (let i = 0; i < res.data.length; i++) {
        _this.data.items.forEach(function (item, index, input) {
          if (input[index].value == res.data[i]) {
            input[index].isChecked = true
          }
        })
      }
      console.log(_this.data.items)
      _this.setData({
        items: _this.data.items
      })

    })
      .catch(res => {
        console.log(res)
      })
      .then(res => {
        wx.hideLoading();
      })
  },
  setdata: function () {
    //如果勾选为0，则把value设为null
    if (this.data.changevalue.length == 0) {
      var value = null;
    } else {
      var value = this.data.changevalue.toString();
    }

    var data = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": "{'openid':'" + wx.getStorageSync('openid') + "','key':'" + this.data.key + "','value':'" + value + "'}"
    }
    var header = "application/json";

    if ((this.data.firstTime).toString() === 'null' && value === null) {
      console.log('我是第一次进入该界面，我可以不选择直接按保存哦')
      wx.navigateBack({
        delta: 1
      })
    } else if (value === null) {
      console.log('用户以前已进入该界面选择选项，不能清空所有选择按保存')
      wx.showToast({
        title: '请至少选择一项',
        icon: 'none',
        image: "../../../../../images/index/error.png",
        duration: 2000
      })
    } else {
      api.post("/lr/s2bapi/savepersonaldata", data, header).then(function (res) {
        console.log(res)
        console.log("保存成功")
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500,
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      })
        .catch(res => {
          console.log(res)
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            image: "../../../../../images/index/error.png",
            duration: 1500
          })
        })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  }
})