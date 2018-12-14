const {
  addShoppingCart
} = require('../../../../../utils/HttpUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schemeName: '',
    goodsList: '',
    productNum: 1,
    productData: [], //用于加入购物车传参
    stystemIOS: false
  },

  onLoad: function(options) {
    var _this = this;
    wx.getSystemInfo({
      success(res) {
        console.log((res.system).split(' ')[0])
        if ((res.system).split(' ')[0] == 'iOS') {
          _this.setData({
            stystemIOS: true
          })
        }
      }
    })
    console.log(JSON.parse(options.data))
    this.setData({
      schemeName: JSON.parse(options.data).schemeName,
      goodsList: JSON.parse(options.data).productList
    })
  },
  // 规格选择功能逻辑
  selectSpecificate(e) {
    console.log(e)
    this.data.goodsList[parseInt(e.currentTarget.dataset.index)].F_CombinationName = this.data.goodsList[parseInt(e.currentTarget.dataset.index)].combinationList[parseInt(e.currentTarget.dataset.gg)].F_CombinationName
    // 改变价格
    this.data.goodsList[parseInt(e.currentTarget.dataset.index)].F_ProductPrice = this.data.goodsList[parseInt(e.currentTarget.dataset.index)].combinationList[parseInt(e.currentTarget.dataset.gg)].F_CombinationPrice
    // 改变规格选中状态
    this.data.goodsList[parseInt(e.currentTarget.dataset.index)].combinationList.forEach((vaule, index, array) => {
      console.log(array[index])
      if (index == parseInt(e.currentTarget.dataset.gg)) {
        this.data.goodsList[parseInt(e.currentTarget.dataset.index)].combinationList[index].checked = true
      } else {
        this.data.goodsList[parseInt(e.currentTarget.dataset.index)].combinationList[index].checked = false
      }
    })
    // 获取商品组合ID，商品ID

    let productObj = {
      product_id: e.currentTarget.dataset.f_productid,
      combination_id: e.currentTarget.dataset.f_combinationid,
      count: ''
    }
    if (this.data.productData.length != 0) {

      let isExists = this.isInArray(this.data.productData, parseInt(e.currentTarget.dataset.f_productid))
      console.log('isExists=' + isExists)
      if (isExists) {
        this.data.productData.forEach((vaule, index, array) => {
          if (array[index].product_id == e.currentTarget.dataset.f_productid) {
            array[index].combination_id = e.currentTarget.dataset.f_combinationid
          }
        })
      } else {
        this.data.productData.push(productObj)
      }
    } else {
      this.data.productData.push(productObj)
    }

    this.setData({
      goodsList: this.data.goodsList,
      productData: this.data.productData
    })
    console.log('..............................测试数据..................')
    console.log(this.data.productData)
    console.log(this.data.goodsList)
    console.log('f_combinationid=' + e.currentTarget.dataset.f_combinationid)
    console.log('F_ProductId=' + e.currentTarget.dataset.f_productid)
    console.log(e.currentTarget.dataset.f_combinationprice)
  },

  // 数据判断
  isInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
      if (value === arr[i].product_id) {
        return true;
      }
    }
    return false;
  },

  // 商品数量增加
  bindPlus() {
    this.setData({
      productNum: this.data.productNum + 1
    })
  },
  // 商品数量减少
  bindMinus() {
    if (this.data.productNum == 1) {
      return
    } else {
      this.setData({
        productNum: this.data.productNum - 1
      })
    }
  },

  // 商品价格输入
  bindManual(e) {
    console.log(e)
    this.setData({
      productNum: parseInt(e.detail.value)
    })
  },

  // to购物车
  toShoopCart() {
    wx.navigateTo({
      url: '../../../../shopping-cart/shopping-cart',
    })
  },

  // to详情
  toDetail(e) {
    wx.navigateTo({
      url: "../../../../categories/detail/detail?index=" +
        e.currentTarget.dataset.f_productid +
        "&catename=" + '全屋购'
    });
  },

  // 加入购物车
  bugAgain: function() {
    var _this = this;
    let phone = wx.getStorageSync('phone')
    if (!phone) {
      wx.showModal({
        title: '未登录',
        content: '亲，你还未登录哦，请点击梵星进行登录',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../../../me/twicelogin/twicelogin'
            })
          } else if (res.cancel) {}
        }
      })
      wx.setStorageSync('formWhere', 'specification')
    } else {
      if (this.data.productData.length < this.data.goodsList.length) {
        wx.showToast({
          title: '请选择所有商品的规格！',
          icon: 'none'
        })
        return
      }
      wx.showLoading({
        title: '提交中...',
      })
      let combinationList = [];
      for (let i = 0; i < this.data.productData.length; i++) {
        this.data.productData[i].count = this.data.productNum;
        combinationList.push(this.data.productData[i].combination_id)
      }
      this.setData({
        productData: this.data.productData
      })
      addShoppingCart({
        body: this.data.productData,
        success: function(res) {
          console.log(res)
          if (res.data.code == 200) {
            wx.hideLoading()
            wx.showToast({
              title: '加入购物车成功',
              duration: 1000
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '../../../../shopping-cart/shopping-cart?fromOrderDetail=orderDetail' + '&F_Combination=' + combinationList,
              })
            }, 1000)

          } else if (res.data.code == 400 || res.data.code == 401) {
            wx.hideLoading()
            wx.showToast({
              title: '加入购物车失败',
            })
            that.handleLoginPage()
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '加入购物车失败',
            })
          }
        }
      })
    }
  },
})