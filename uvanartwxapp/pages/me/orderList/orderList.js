var api = require('../../../utils/API/request.js')
var common = require('../../../utils/common.js')
const Decimal = require('../../../utils/decimal.js');
const Url = require('../../../utils/API/url.js');
const {
  getWxpaydata,
  modifyOrderStatus
} = require('../../../utils/HttpUtils.js');
import {
  modifyorderstatus2,
  designgold,
  getorderlist,
  orderreminder,
  getmyaddress,
  EvaluateOrder
} from '../../../utils/API/me/api.js'
var pages = 1; //页码
var count = 5; //每页加载的数据

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: ["全部", "待付款", "待发货", "待收货", "待评价"],
    indexNum: 0,
    currentTab: 0,
    fail: true, //数据请求失败
    onOff: false, //控制按钮显示或隐藏
    isShow: true,
    noOrder: true,
    noMore: true,
    openId: '',
    token: '',
    orderId: '',
    id: '',
    hisId: '',
    page: '', //页数
    totalNum: 0, //订单子数列
    isHidden: true,
    loadingMore: true,
    dataList: [], //全部订单
    hiddenTips: true,
    discountmoney: 0, //优惠信息
    cursor: 0, //评价输入字数
    reasonValue: '',
    iconNum: 1, //默认选中好评
    ratingList: ['好评', '中评', '差评'],
    hiddenEvaluate: true, //显示评论弹框
    isNotRelease: true, //是否未评价
    releaseText: '发布',
    inExecution: false, //商品接口执行中，不允许在操作导航栏
    fid: '',
    placeholderValue: ''
  },

  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "梵星订单列表")
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "梵星订单列表")
  },
  // 拼团订单失败申请退款入口
  toRefound: function(e) {
    console.log(e)
  },

  // 未开发功能提示
  showTips: function() {
    var _this = this;
    clearTimeout(time)
    this.setData({
      hiddenTips: false
    })
    var time = setTimeout(function() {
      _this.setData({
        hiddenTips: true
      })
    }, 1500)

  },
  // 用户评价
  evaluate: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.fid != this.data.fid) {
      this.setData({
        reasonValue: '', //清空文本域
        iconNum: 1, //恢复默认
        cursor: 0
      })
    }
    this.setData({
      hiddenEvaluate: false,
      fid: e.currentTarget.dataset.fid,
      placeholderValue: '商品满足您的期待吗？说说您的使用心得吧！'
    })
  },
  // 取消评论
  cancelEvaluate: function() {
    this.setData({
      hiddenEvaluate: true,
      isNotRelease: true,
      releaseText: '发布',
      placeholderValue: '',
      reasonValue: ''
    })
  },

  // 用户选择评价等级
  checkIcon: function(e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      iconNum: e.currentTarget.dataset.id
    })
  },

  // 获取用户评价的输入字符数
  requireNumber: function(e) {
    console.log(e)
    this.setData({
      cursor: e.detail.value.length,
      reasonValue: e.detail.value
    })
  },

  // 发布评价
  release: function(e) {
    var _this = this;
    if (this.data.releaseText == '发布') {

      let releaseUrl = '/s2b/vanstarorder/EvaluateOrder?token=' + wx.getStorageSync('token') + '&loginMark=' + wx.getStorageSync('phone') + '&id=' + this.data.fid + '&reason=' + '【' + this.data.ratingList[parseInt(this.data.iconNum - 1)] + '】' + this.data.reasonValue
      console.log(releaseUrl)
      EvaluateOrder(this.data.fid, this.data.ratingList[parseInt(this.data.iconNum - 1)], this.data.reasonValue).then(res => {
        console.log(res)
        if (res.code == 200) {
          _this.setData({
            isNotRelease: false,
            releaseText: '关闭',
            dataList: []
          })
          if (_this.data.currentTab == 0) {
            _this.loadList('');
          } else if (_this.data.currentTab == 4) {
            _this.loadList('D');
          }
        }
      })
      // }
    } else if (this.data.releaseText == '关闭') {
      this.setData({
        hiddenEvaluate: true,
        isNotRelease: true,
        placeholderValue: '',
        reasonValue: '',
        releaseText: '发布',
      })
    }

  },

  // 确认收货
  confirmOrder: function(e) {
    console.log(e)
    var _this = this;
    wx.showModal({
      title: '优梵艺术提醒您',
      content: '是否确认收货？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          try {
            var token = wx.getStorageSync('token');
            var phone = wx.getStorageSync('phone');
            var openid = wx.getStorageSync('openid');
            var data = {
              "token": token,
              "loginMark": phone,
              "data": {
                "F_OrderNo": e.currentTarget.dataset.orderno,
                'F_OrderStatus': 'C'
              }
            }
            modifyorderstatus2(data).then(res => {
                console.log(res)
                setTimeout(function() {
                  _this.setData({
                    currentTab: 4,
                    dataList: []
                  })
                  _this.loadList('D');
                }, 800);
              })
              .catch(res => {
                _this.loading.hideToast();
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

  // 支付
  toPayByWeChat: function() {

    let that = this;
    const info = this.data.info || {};
    const {
      timeStamp = '', nonceStr = '', signType = '', paySign = ''
    } = info || {};

    wx.requestPayment({
      timeStamp,
      nonceStr,
      'package': info.package || '',
      signType,
      paySign,
      success: function(res) {
        that.setData({
          onOff: false
        })
        // that.data.orderId
        console.log('支付成功');
        console.log(res);
        debugger
        try {
          let token = wx.getStorageSync('token');
          let phone = wx.getStorageSync('phone');
          let designgoldData = {
            "token": token,
            "loginMark": phone,
            "data": {
              orderNo: that.data.orderId
            }
          }
          designgold(designgoldData)
            .then(() => {
              console.log(res.info)
            })
            .catch(res => {
              that.loading.hideToast();
            })
        } catch (e) {
          console.log(e)
        }
        wx.showToast({
          title: '支付成功',
          image: '../../order-submit/images/toast_success.png',
        });
        setTimeout(function() {
          that.setData({
            currentTab: 2,
            dataList: []
          })
          that.loadList('B');
        }, 800);
        modifyOrderStatus({
          body: {
            F_OrderNo: that.data.orderId,
            F_OrderStatus: 'A',
          },
          success: function(res) {
            // // 不需要处理


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
                .catch(res => {
                  that.loading.hideToast();
                })
            } catch (e) {
              console.log(e)
            }

          },
        });
      },
      fail: function(err) {
        console.log('支付失败');
        console.log(err);
        that.setData({
          onOff: false
        })
        wx.showToast({
          title: '支付失败',
          image: '../../order-submit/images/toast_note.png',
        });
        modifyOrderStatus({
          body: {
            F_OrderNo: that.data.orderId,
            F_OrderStatus: 'P',
          },
          success: function(res) {
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

  // 支付
  pay: function(e) {
    console.log(this.data.currentTab)
    console.log(e)
    if (e.currentTarget.dataset.paymentmethod == 'B') {
      // 线下支付
      wx.showToast({
        title: '请到线下支付',
        duration: 2000
      })
    } else if (e.currentTarget.dataset.paymentmethod == 'A') {
      //线上支付
      this.setData({
        onOff: true
      })
      const {
        index
      } = e.currentTarget.dataset;
      // 判断用户是在全部订单点击付款还是待付款订单付款
      var order = this.data.dataList[index];
      // const order = this.data.dataList[index];

      var that = this;
      const orderId = order.orderNo //order.F_ID;
      console.log(orderId)
      this.setData({
        orderId,
      });

      const totalfee = order.realpay || 0.01;
      console.log(totalfee)
      const payname = '订单号: ' + orderId;
      console.log('呼啦啦啦${orderId}')
      var price = Url.host == 'https://wxapp.uvanart.com' ? 1 : new Decimal(order.realpay).times(100);
      getWxpaydata({
        body: {
          // totalfee: new Decimal(order.realpay).times(100),
          // totalfee: price,
          // payname,
          id: orderId,
        },
        success: function(res) {
          console.log('获取支付信息');
          console.log(res);
          if (res.data.code == 200) {
            const info = res.data.data;
            that.setData({
              info: info,
            });

            that.toPayByWeChat();
          } else if (res.data.code == 400 || res.data.code == 401) {
            that.setData({
              onOff: false
            })
          } else if (res.data.code == 500) {
            wx.showToast({
              title: '订单已失效',
              image: '../../order-submit/images/toast_note.png'
            })
            that.setData({
              onOff: false
            })
          } else {

          }
        },
      });
    }
  },

  // 导航栏标签选择
  swichNav: function(e) {
    if (this.data.inExecution) {
      console.log('接口执行中，不允许点击导航栏')
      return
    }
    this.setData({
      loadingMore: true
    })
    if (this.data.currentTab == e.currentTarget.dataset.id) {
      console.log('点击同一标签')
      return;
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.id,
      })
    }
    wx.showLoading({
      title: '加载中...',
    })
    pages = 1; //重置页码
    this.setData({
      noMore: true, //默认隐藏noMore
      dataList: [] //清空数组
    })
    //加载对应标签的订单数据
    switch (e.currentTarget.dataset.id) {
      case 0:
        this.loadList('');
        break;
      case 1:
        this.loadList('A');
        break;
      case 2:
        this.loadList('B');
        break;
      case 3:
        this.loadList('C');
        break;
      case 4:
        this.loadList('D');
        break;
    }
  },

  // 数据加载公用方法
  loadList: function(status, labelID) {
    console.log(status)
    var _this = this;
    try {
      // 获取用户的openId和phone
      var openid = wx.getStorageSync('openid');
      var phone = wx.getStorageSync('phone');
      var token = wx.getStorageSync('token');
      // 接口传参
      var data = {
        "token": token,
        "loginMark": phone,
        "data": {
          'openid': openid,
          'status': status,
          'limit': count,
          'page': pages
        }
      }
      getorderlist(data).then(function(res) {
          console.log(res)
          // 判断是否有数据
          if (res.code == 400 || res.data.total == 0) {
            wx.hideLoading()
            _this.setData({
              noOrder: false,
              noMore: true
            })
            if (res.code == 400) {
              wx.showToast({
                title: res.info,
                icon: 'none'
              })
            }
          } else {
            _this.setData({
              noOrder: true
            })
          }
          // 每次加载把获取的数据存放到data数组
          var data = _this.data.dataList;
          for (let i = 0; i < res.data.order.length; i++) {
            data.push(res.data.order[i])
          }
          console.log(data)
          // 计算数组数据的页数（每页5条）
          _this.setData({
            page: Math.ceil(res.data.total / count),
            dataList: data
          })
          console.log(_this.data.dataList)
          console.log("总页码:" + _this.data.page + "当前页码:" + pages)
          //判断当前页面是否为最后的页码
          if (_this.data.page == pages) {
            _this.setData({
              noMore: false
            })
          } else {
            _this.setData({
              noMore: true
            })
          }
        })
        .catch(res => {
          console.log(res)
          _this.loading.hideToast();
        })
        .then(res => {
          wx.hideNavigationBarLoading()
          wx.hideLoading()
          _this.setData({
            loadingMore: true,
            inExecution: false
          })
          // _this.loading.hideToast();
        })
    } catch (e) {
      console.log(e)
    }
  },

  // 跳转到订单详情页
  openDetail: function(e) {
    console.log(e)
    let formPinTuan = false;
    wx.navigateTo({
      url: 'productDetails/productDetails?id=' + e.currentTarget.dataset.id + '&idd=' + e.currentTarget.dataset.idd + '&formPinTuan=' + formPinTuan,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    pages = 1; //重置页码
    this.setData({
      dataList: [],
      inExecution: true
    })
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...',
    })
    // 获取订单列表栏目标签id
    if (options.id != undefined) { //从列表栏进入
      this.setData({
        currentTab: options.id
      })
      switch (parseInt(options.id)) {
        case 1:
          this.loadList('A');
          break;
        case 2:
          this.loadList('B');
          break;
        case 3:
          this.loadList('C');
          break;
        case 4:
          this.loadList('D');
          break;
      }
    } else {
      console.log('用户从我的订单进入')
      this.loadList('');
    }
  },
  onShow: function() {
    if (wx.getStorageSync('cancelTheOrder') == 'yes') {
      wx.removeStorageSync('cancelTheOrder')
      wx.showNavigationBarLoading()
      wx.showLoading({
        title: '加载中...',
      })
      pages = 1; //重置页码
      this.setData({
        dataList: [],
        inExecution: true
      })
      if (this.data.currentTab != '') {
        switch (parseInt(this.data.currentTab)) {
          case 1:
            this.loadList('A');
            break;
          case 2:
            this.loadList('B');
            break;
          case 3:
            this.loadList('C');
            break;
          case 4:
            this.loadList('D');
            break;
        }
      } else {
        console.log('用户从我的订单进入')
        this.loadList('');
      }
    }
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)
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
    console.log('触发加载')
    console.log(this.data.totalNum)
    console.log("页码")
    console.log(pages)
    switch (parseInt(this.data.currentTab)) {
      case 0: //全部数据分页加载
        if (pages == this.data.page) {
          wx.showToast({
            title: '到底了',
          })
          this.setData({
            noMore: false
          })
        } else if (pages < this.data.page) {
          wx.showNavigationBarLoading()
          pages++;
          this.setData({
            loadingMore: false,
            noMore: true
          })
          this.loadList('', 0);
        } else {
          wx.showToast({
            title: '到底了',
          })
          return;
        }
        break;
      case 1: //待付款数据分页加载
        console.log('执行待付款下拉加载')
        if (pages == this.data.page) {
          wx.showToast({
            title: '到底了',
          })
          this.setData({
            noMore: false
          })
        } else if (pages < this.data.page) {
          wx.showNavigationBarLoading()
          pages++;
          this.setData({
            loadingMore: false,
            noMore: true
          })
          this.loadList('A');
        } else {
          wx.showToast({
            title: '到底了',
          })
          return;
        }
        break;
      case 2: //待发货数据分页加载
        console.log('执行待发货下拉加载')
        if (pages == this.data.page) {
          wx.showToast({
            title: '到底了',
          })
        } else if (pages < this.data.page) {
          wx.showNavigationBarLoading()
          pages++;
          this.setData({
            loadingMore: false
          })
          this.loadList('B');
        } else {
          wx.showToast({
            title: '到底了',
          })
          return;
        }
        break;
      case 3: //待收货分页加载
        console.log('执行待收货下拉加载')
        if (pages == this.data.page) {
          wx.showToast({
            title: '到底了',
          })
        } else if (pages < this.data.page) {
          wx.showNavigationBarLoading()
          pages++;
          this.setData({
            loadingMore: false
          })
          this.loadList('C');
        } else {
          wx.showToast({
            title: '到底了',
          })
          return;
        }
        break;
      case 4: //待评价分页加载
        console.log('执行待评价下拉加载')
        if (pages == this.data.page) {
          wx.showToast({
            title: '到底了',
          })
        } else if (pages < this.data.page) {
          wx.showNavigationBarLoading()
          pages++;
          this.setData({
            loadingMore: false
          })
          this.loadList('D');
        } else {
          wx.showToast({
            title: '到底了',
          })
          return;
        }
        break;
    }
  },

  // 催单功能
  reminder: function(e) {
    let F_OrderNo = e.target.dataset.id

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
          common.showModal('催单成功', '提示', function(res) {
            if (res.confirm) {
              return
            }
          })
        } else if (res.code == 400) {
          common.showModal('今天已催单，同一订单每天只能催单一次', '提示', function(res) {
            if (res.confirm) {
              return
            }
          })
        }

      })


  }

})