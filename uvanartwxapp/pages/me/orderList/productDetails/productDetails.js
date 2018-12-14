var api = require('../../../../utils/API/request.js')
var common = require('../../../../utils/common.js')
const Decimal = require('../../../../utils/decimal.js');
const Url = require('../../../../utils/API/url.js');
const { getWxpaydata, modifyOrderStatus, addShoppingCart } = require('../../../../utils/HttpUtils.js');
import { modifyorderstatusApi, designgold, getorderdetaildata, orderreminder, CancelOrder} from '../../../../utils/API/me/api.js'
var orderid = ''

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnId: 'null',
    codeNum: '',
    orderId: '',
    productId: '',
    touxiangImg: '',
    dataList: [], //商品数据
    animationData: '',
    F_BuyTime: '',
    F_ConsigneeName: '',
    F_ConsigneePhone: '',
    F_Freight: '',
    F_OrderNo: '',
    F_OrderStatus: '',
    F_RealPayAmount: '',
    F_WechatName: '',
    F_ShippingAddress: '',
    F_ShippingMethod: '',
    F_LogisticsFirm: '',
    F_LogisticsNo: '',
    F_PaymentMethodCode: '', //付款方式
    F_PhysicalStore: '', //门店信息
    F_PaymentMethod: '', //支付方式
    F_DiscountAmount: '', //优惠金额
    F_ProductTotalAmount: '',//商品总金额
    F_DiscountAmount: 0,//优惠信息
    formPinTuan: '',
    payState: false,  //默认支付状态为false
    cancelArray: ['我不想买了', '信息填写错误重拍', '卖家缺货', '其他原因'],
    F_ID: ''
  },

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
    common.visitorRecordAPI(stayTime_JY, "梵星订单详情")
  },
  onUnload: function () {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "梵星订单详情")
  },

  // 再次购买
  bugAgain: function () {
    var _this = this;
    let thisgoods = [];
    let obj;
    let combinationList = []
    console.log(this.data.dataList)
    for (let i = 0; i < this.data.dataList.length; i++) {
      obj = {
        product_id: this.data.dataList[i].F_ProductID,
        combination_id: this.data.dataList[i].F_Combination,
        product_price: this.data.dataList[i].F_ProductPrice,
        product_name: this.data.dataList[i].F_ProductName,
        product_specifications: this.data.dataList[i].F_ProductSpecification,
        product_image: this.data.dataList[i].F_ProductImage,
        count: this.data.dataList[i].F_ProductNumber
      }
      thisgoods.push(obj)
      combinationList.push(this.data.dataList[i].F_Combination)
    }
    console.log(thisgoods)
    console.log(combinationList)
    debugger
    addShoppingCart({
      body: thisgoods,
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../../../shopping-cart/shopping-cart?fromOrderDetail=orderDetail' + '&F_Combination=' + combinationList,
          })
          // wx.showToast({
          //   title: '添加购物车成功',
          // });
          // wx.setStorageSync("ShoppingCart", "");

        } else if (res.data.code == 400 || res.data.code == 401) {
          // that.setData({
          //   isLogin: false
          // })
          that.handleLoginPage()
        } else {

        }
      }
    })

    // 多个
    //    for (let i = 0; i < this.data.dataList.length; i++) {
    //   thisgoods = {
    //     product_id: this.data.dataList[i].F_ProductID,
    //     combination_id: this.data.dataList[i].F_Combination,
    //     product_price: this.data.dataList[i].F_ProductPrice,
    //     product_name: this.data.dataList[i].F_ProductName,
    //     product_specifications: this.data.dataList[i].F_ProductSpecification,
    //     product_image: this.data.dataList[i].F_ProductImage,
    //     count: this.data.dataList[i].F_ProductNumber
    //   }
    //   console.log(thisgoods)
    //   addShoppingCart({
    //     body: [thisgoods],
    //     success: function (res) {
    //       console.log(res)
    //       if (res.data.code == 200) {
    //         if (i == _this.data.dataList.length) {
    //           wx.navigateTo({
    //             url: '../../../shopping-cart/shopping-cart?fromOrderDetail=orderDetail' + '&F_Combination=' + _this.data.dataList[i].F_Combination,
    //           })
    //         }

    //         // wx.showToast({
    //         //   title: '添加购物车成功',
    //         // });
    //         // wx.setStorageSync("ShoppingCart", "");

    //       } else if (res.data.code == 400 || res.data.code == 401) {
    //         // that.setData({
    //         //   isLogin: false
    //         // })

    //       } else {

    //       }
    //     }
    //   })
    // }

  },

  // 未开发功能提示
  showTips: function (e) {
    var _this = this;
    console.log(1111)
    wx.showToast({
      title: '功能暂未开发!',
    })
    // let pages = getCurrentPages();
    // let curPage = pages[pages.length - 1];
    // let animation = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease-in',
    // })
    // animation.opacity(1).step();
    // this.setData({
    //   animationData: animation.export()
    // })
    // setTimeout(function () {
    //   animation.opacity(0).step();
    //   _this.setData({
    //     animationData: animation.export()
    //   })
    // }, 3000)
  },

  // 取消订单信息选择
  bindPickerChange: function (e) {
    var _this = this;
    console.log(this.data.cancelArray[e.detail.value])
    let cancelOrderUrl = '/s2b/vanstarorder/CancelOrder?token=' + wx.getStorageSync('token') + '&loginMark=' + wx.getStorageSync('phone') + '&status=F' + '&id=' + this.data.F_ID + '&reason=' + this.data.cancelArray[e.detail.value]
    console.log(cancelOrderUrl)
    CancelOrder(this.data.F_ID, this.data.cancelArray[e.detail.value]).then(res => {
      console.log(res)
      if (res.code == 200) {
        wx.showToast({
          title: '取消订单成功',
        })
        wx.setStorageSync('cancelTheOrder', 'yes')
        _this.loadData();
      }
    })
      .catch(res => {
        wx.showToast({
          title: '取消订单失败',
          image: '../../../order-submit/images/toast_note.png',
        })
      })
  },

  // 进入售后列表页
  toServiceList: function () {
    wx.navigateTo({
      url: '../customerService/serviceList/serviceList?dataList=' + JSON.stringify(this.data.dataList) + '&buyTime=' + this.data.F_BuyTime + '&orderNo=' + this.data.F_OrderNo,
    })
  },

  //打开商品详情页
  openDetail: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.payway == 'C') {
      let catename = '梵豆';
      wx.navigateTo({
        url: '../../../categories/detail/detail?index=' + e.currentTarget.dataset.index + '&catename=' + catename,
      })
    } else {
      wx.navigateTo({
        url: '../../../categories/detail/detail?index=' + e.currentTarget.dataset.index,
      })
    }
  },

  //确认收货事件
  confirmOrder: function () {
    var _this = this;
    wx.showModal({
      title: '优梵艺术提醒您',
      content: '是否确认收货？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          try {
            var token = wx.getStorageSync('token');
            var phone = wx.getStorageSync('phone');
            var openid = wx.getStorageSync('openid');
            var data = {
              "token": token,
              "loginMark": phone,
              "data": { "F_OrderNo": _this.data.F_OrderNo, 'F_OrderStatus': 'C' }
            }
            modifyorderstatusApi(data).then(res => {
              console.log(res)
              wx.showLoading({
                title: '加载中...',
              })
              _this.loadData();
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
        } else if (res.cancel) {
          console.log('用户点击取消')
          return;
        }
      }
    })
  },


  // 详情页付款逻辑
  toPayByWeChat: function () {
    let that = this;
    const info = this.data.info || {};
    const { timeStamp = '', nonceStr = '', signType = '', paySign = '' } = info || {};

    wx.requestPayment({
      timeStamp,
      nonceStr,
      'package': info.package || '',
      signType,
      paySign,
      success: function (res) {
        // that.data.orderId
        console.log('支付成功');
        console.log(res);
        wx.showToast({
          title: '支付成功',
          image: '../../../order-submit/images/toast_success.png',
        });
        setTimeout(function () {
          wx.redirectTo({
            url: '../../orderList/orderList',
          })
        }, 800);
        modifyOrderStatus({
          body: {
            F_OrderNo: that.data.orderId,
            F_OrderStatus: 'A',
          },
          success: function (res) {
            // // 不需要处理
            // if (res.data.code == 200) {

            // } else if (res.data.code == 400 || res.data.code == 401) {

            // } else {

            // }
            try {
              let token = wx.getStorageSync('token');
              let phone = wx.getStorageSync('phone');
              let designgoldData = {
                "token": token,
                "loginMark": phone,
                "data": {
                  'orderNo': that.data.orderId
                }
              }
              designgold(designgoldData)
                .then(() => {
                  console.log(res.info)
                })
            } catch (e) {
              console.log(e)

            }
          },
        });
      },
      fail: function (err) {
        console.log('支付失败');
        console.log(err);

        wx.showToast({
          title: '支付失败',
          image: '../../../order-submit/images/toast_note.png',
        });
        modifyOrderStatus({
          body: {
            F_OrderNo: that.data.orderId,
            F_OrderStatus: 'P',
          },
          success: function (res) {
            that.setData({
              payState: false
            })
            // // 不需要处理
            // if (res.data.code == 200) {

            // } else if (res.data.code == 400 || res.data.code == 401) {

            // } else {

            // }
          },
        });
      },
    });
  },

  // 详情页付款逻辑
  pay: function () {
    var that = this;
    if (!this.data.payState) {
      this.setData({
        payState: true
      })
      if (this.data.F_PaymentMethodCode == 'B') {
        // 线下支付
        wx.showToast({
          title: '请到线下支付',
          duration: 2000
        })
      } else if (this.data.F_PaymentMethodCode == 'A') {
        //线上支付
        const orderId = this.data.F_OrderNo; //order.F_ID;
        console.log(orderId)
        this.setData({
          orderId,
        });
        const totalfee = this.data.F_RealPayAmount || 0.01;
        console.log(this.data.F_RealPayAmount)
        const payname = '订单号: ' + orderId;
        var price = Url.host == 'https://wxapp.uvanart.com' ? 1 : new Decimal(that.data.F_RealPayAmount).times(100)
        getWxpaydata({
          body: {
            // totalfee: new Decimal(that.data.F_RealPayAmount).times(100),
            // totalfee: price,
            // payname,
            id: orderId,
          },
          success: function (res) {
            console.log('获取支付信息');
            console.log(res);
            if (res.data.code == 200) {
              const info = res.data.data;
              that.setData({
                info: info,
              });

              that.toPayByWeChat();
            } else if (res.data.code == 400 || res.data.code == 401) {

            } else if (res.data.code == 500) {
              wx.showToast({
                title: '订单已失效',
                image: '../../../order-submit/images/toast_note.png'
              })
              that.setData({
                payState: false
              })
            } else {

            }
          },
        });
      }
    }
  },

  //  拨打电话
  Dialing: function () {
    wx.makePhoneCall({
      phoneNumber: '4009318268',
    })
  },

  //  申请售后，跳转到售后页面
  customerService: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../customerService/customerService?fid=' + e.currentTarget.dataset.fid,
    })
  },

  //服务栏按钮点击事件
  touchBtn: function (e) {
    console.log(e)
    this.setData({
      btnId: e.currentTarget.dataset.id
    })
  },

  // 复制事件
  copyText: function () {
    var _this = this;
    wx.createSelectorQuery().select(".numCode").boundingClientRect(function (rect) {
      console.log(rect)
      _this.setData({
        codeNum: rect.dataset.value
      })
      wx.setClipboardData({
        data: _this.data.codeNum,
        success: function (res) {
          // console.log(res)
          wx.getClipboardData({
            success: function (res) {
              console.log(res.data)
              wx.showToast({
                title: '复制成功',
                icon: 'success',
                duration: 1000
              })
            }
          })
        }
      })
    }).exec()
  },


  //数据加载公用方法
  loadData: function () {
    var _this = this;
    try {
      // 获取用户的openId和phone
      var openid = wx.getStorageSync('openid');
      var phone = wx.getStorageSync('phone');
      var token = wx.getStorageSync('token');
      var data = {
        "token": token,
        "loginMark": phone,
        "data": { 'fid': this.data.productId, 'limit': '0', 'page': '0' }
      }
      getorderdetaildata(data).then(res => {
        console.log(res)
        _this.setData({
          dataList: res.data.goods,
          F_BuyTime: res.data.order.F_BuyTime,
          F_PaymentTime: res.data.order.F_PaymentTime,
          shippingTime: res.data.order.F_ShippingTime,
          deliveryTime: res.data.order.F_DeliveryTime,
          F_ConsigneeName: res.data.order.F_ConsigneeName,
          F_ConsigneePhone: res.data.order.F_ConsigneePhone,
          F_Freight: res.data.order.F_Freight,
          F_OrderNo: res.data.order.F_OrderNo,
          F_RealPayAmount: res.data.order.F_RealPayAmount,
          F_WechatName: res.data.order.F_WechatName,
          F_ShippingAddress: res.data.order.F_ShippingAddress,
          F_OrderStatus: res.data.order.F_OrderStatus,
          F_ShippingMethod: res.data.order.F_ShippingMethod,
          F_LogisticsFirm: res.data.order.F_LogisticsFirm,
          F_LogisticsNo: res.data.order.F_LogisticsNo,
          F_PaymentMethodCode: res.data.order.F_PaymentMethodCode,
          F_PhysicalStore: res.data.order.F_PhysicalStore,
          F_PaymentMethod: res.data.order.F_PaymentMethod,
          F_DiscountAmount: res.data.order.F_DiscountAmount,
          F_ProductTotalAmount: res.data.order.F_ProductTotalAmount,
          F_DiscountAmount: res.data.order.F_DiscountAmount,
          F_ID: res.data.order.F_ID
        })
      })
        .catch(res => {
          console.log(res)
        })
        .then(res => {
          wx.hideLoading()
          _this.setData({
            hideLoading: true
          })
        })
    } catch (e) {
      console.log(e)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    orderid = options.idd
    var _this = this;
    // var screenHeight = wx.getSystemInfoSync().screenHeight;
    //  this.setData({
    //    screenHeight: screenHeight
    //  })
    // console.log('屏幕高度')
    // console.log(screenHeight)
    if (options.formPinTuan == "true") {
      this.setData({
        formPinTuan: false
      })
    } else {
      this.setData({
        formPinTuan: true
      })
    }
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      hideLoading: false,
      productId: options.id
    })
    // 获取缓存的用户头像
    let headPortrait = wx.getStorageSync('headPortrait')

    // 获取用户头像
    _this.setData({ touxiangImg: headPortrait })
    this.loadData();
  },

  //催单逻辑事件
  reminder: function (e) {
    console.log(e)
    let F_OrderNo = this.data.F_OrderNo;
    let token1 = wx.getStorageSync('token')
    let phone1 = wx.getStorageSync('phone')
    var reminderdata = {
      "token": token1,
      "loginMark": phone1,
      "data": {
        'F_OrderNo': F_OrderNo,
        'F_OrderStatus': 'R'
      }
    }
    orderreminder(reminderdata)
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          common.showModal('催单成功', '提示', function (res) {
            if (res.confirm) {
              return
            }
          })
        } else if (res.code == 400) {
          common.showModal('今天已催单，同一订单每天只能催单一次', '提示', function (res) {
            if (res.confirm) {
              return
            }
          })
        }

      })


  },

  // 跳转到退款/售后详情页
  openShPage: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../tuikuan/tkDetail/tkDetail?orderId=' + e.currentTarget.dataset.f_detailsid,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})