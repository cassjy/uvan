var WxParse = require('../../wxParse/wxParse.js')
var api = require("../../../utils/API/request.js")
var common = require("../../../utils/common.js")
var mta = require('../../../lib/js/mta_analysis.js') //小程序数据分析
import {
  GetFreightByArea,
  ValidateUserType,
  ProductDetails2,
  GetQrCode,
  GetCommonProblemByGoodsID,
  ProductBrowsingRecord,
  CheckToken,
  Login,
  GetProductRates
} from '../../../utils/API/detail/api.js'
import {
  GetWxOpenId
} from "../../../utils/API/activity/activity.js";
const {
  getMyShoppingCart,
  addShoppingCart,
  delshoppingcart,
  editshoppingcart,
} = require('../../../utils/HttpUtils.js')
const {
  readUvanartToken,
  updateShoppingCart,
  readShoppingCart,
  insertShoppingCart,
  removeShoppingCart,
  removeAllShoppingCart
} = require('../../../utils/StorageUtils.js');

const app = getApp();

var tuanID0 = null
var tuanID1 = null

var tuanName0 = ''
var tuanName1 = ''
var openID = ''
var goodsdata = []
var productID = ''
var productAttr = ''
var productprice = 0
var PACMID = 0
var oldInventory = 0
// var table = ''
var pagelength = 0
var nickName = ''
var avatarUrl = ''
var start = 0
var countDowntimerPre = null //定时器
var countDowntimer = null //定时器

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器

Page({
  data: {
    option1: true,
    option2: false,
    option3: false,
    option4: false,
    option5: false,
    option6: false,
    widthVal: 108, //头部标签的活动底边长度
    leftVal: 0, //头部标签的活动底边位置
    tabCount: 3, //头部标签数量
    bar1: true,
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    index: null,
    imgURL: [],
    imgList: [],
    productOldId: 0, //商品旧ID
    productName: '',
    productPrice: '',
    reward: '',

    F_MianImageList: '', //是否有可配置主图
    PictureModeList: '', //
    productAttributes: [], //商品规格分类
    nowAttrID: [], //控制规格是否被选择的样式,存放的是当前选择的规格ID
    nowAttrParentID: [], //控制规格是否被选择的样式，存放的是当前选择的规格父级ID
    nowAttrName: [], //当前选择了的规格名称
    nowAttrCombineName: [], //当前选择了的规格组合全称
    hasCombination: false, //判断是否存在该组合
    unitPrice: 0, //单价
    nowCombinationID: '', //当前规格组合的ID
    nowCombinationName: '', //当前规格组合的名称
    EmployeePrice:'',//内部员工价
    EmployeeUnitPrice:'',//内部员工价单价
    isEmployee: false,//是否内部员工

    tuanName0: '拼团规模',
    tuanName1: '规格',
    productAttributeCombinationModel: [],
    priceChange: false,
    isTap: false, //控制遮罩层
    isTapAttr: false,
    isSelect: false,


    caculatePrice: "",

    hideInventory: false,
    InventoryID: 0,
    hasLoad: false,
    colorName: '',
    attrName: '',
    hasSelect: false,
    num: 1,
    minusStatus: 'disabled',
    mytoken: '',
    QRcodeIMG: '',
    QRcodeID: '',
    hasQRcode: false,
    scene: '',
    openid: '',
    phone: '',
    canshare: false,
    openshare: true,
    hiddenInventory: true,
    canConfirm: false,
    finishChooseAttr: false,
    commentinfo: [],
    region: ['广东省', '佛山市', '顺德区'],
    customItem: '',
    rateQty: '',
    BuyerNick: '',
    noRate: false,
    ratecount: 0,
    isDandelion: false,
    canAdd: false,
    tMoney: '0',
    qrvisitor: false,
    isGood: true,
    fromCart: false,
    Inventory: 100,
    tmallNumiid: '',
    article: '', //旧商品详情，需要用到wxParse插件
    article2: [], //新商品详情，图片数组，后台可配置
    firstTime: true,
    showToTop: false,
    mark: '', //标志从购物车点击商品进入
    // table: '',
    hiddenActivity: true, //隐藏活动模块
    shadow: true, //阴影
    control: true, //控制活动模块的显隐
    isFirstTimeOpenComment: true, //判断是否首次打开评论
    animationData: '',
    animationControl: '',
    questionDetail: false,
    intoComment: false,
    questionPostValue: '',
    questionInputValue: '',
    answerPostValue: '',
    answerInputValue: '',
    commentPostValue: '',
    commentInputValue: '',
    question: [],

    DeliveryCycle: 0, //发货周期

    nickName: '',
    swiperNum: 1, //轮播图当前页面
    swiperAllNum: 0, //轮播图总数
    isTapSer: false, //控制开打商品服务弹窗
    paramslist: [], //参数
    canconfirmshoppingcart: true,
    banscroll: false,
    topnum: 0,
    published: true, //审核状态
    isBeanGoods: false, //是否是梵豆商品
    goodsSku: '', //当前商品sku
    goodsSpecifications: '', //当前商品规格
    goodsImg: '', //当前商品图片
  },
  onLoad: function(option) {
    // 监听用户访问商品详情页
    mta.Event.stat('diaoyanfenxi', { 'test': 'true' })
    console.log(option)
    console.log('..................................................')
    app.globalData.beanShoppingLoading = false
    wx.showLoading({
      title: '加载中...'
    })
    if (option.catename == "梵豆") {
      this.setData({
        isBeanGoods: true
      })
    }
    const _this = this
    if (option.orderid && option.groupcommanderopenid && option.PersonCount) {
      console.log('来自拼团邀请函')
      this.setData({
        fromcreate: false,
        chooseTuan0: true,
        orderID: option.orderid, //团单号
        GroupCommanderOpenID: option.groupcommanderopenid, //团长ID
        tuanNum: option.PersonCount, //参团默认选中拼团规模
        tuanScale: option.PersonCount, //拼团规模
        tuanName0: option.PersonCount + '人团', //设置默认团规模
      })
      this.showAttr()
    }
    start = 0; //评论页码初始化
    //获取商品分类，梵豆，拼团，普通
    this.setData({
      productCategories: option.catename || ''
    })
    pagelength = getCurrentPages().length
    console.log(pagelength)
    console.log(option)
    //从购物车进入该页面要修改全局变量
    if (option.shopCart == "fromShopCart") {
      console.log('修改全局变量')
      app.globalData.shoppingCartLoading = "reset";
    }
    oldInventory = 0
    var areadata = {
      "token": "",
      "loginMark": "",
      "data": {
        "province": (this.data.region)[0],
        "city": (this.data.region)[1],
        "district": (this.data.region)[2],
        "deliveryMethod ": "自提",
        "money": 1000
      }
    }
    // api.post('/lr/k3api/getfreightbyarea', areadata, 'application/json')
    GetFreightByArea(areadata, 'application/json')
      .then(res => {
        console.log(JSON.parse(res.data.Value))
        this.setData({
          tMoney: JSON.parse(res.data.Value).money
        })
      })
    wx.hideShareMenu()

    wx.getStorage({
      key: "openid",
      success: function(res) {
        var data = {
          "token": "",
          "loginMark": "",
          "data": res.data
        }
        // api.post("/lr/s2bapi/validateusertype", data)
        ValidateUserType(data)
        .then(res => {
          console.log(res)
          let tokenTmp = wx.getStorageSync('token') || ''
          if(res.code==200 && res.data.F_Employees){
            _this.setData({
              isEmployee: true
            })
          }
          if (res.code == 200 && res.data.F_UserType == "蒲公英") {
            if (tokenTmp != '') {
              _this.setData({
                isDandelion: true
              })
            } else {
              _this.setData({
                isDandelion: false
              })
            }
          } else {
            _this.setData({
              isDandelion: false
            })
          }
        })
      },
      fail: function(err){
        GetWxOpenId().then(res => {
          var data = {
            "token": "",
            "loginMark": "",
            "data": res.data.data
          }
          //用户未授权的话，nickName传空格字符串
          ValidateUserType(data)
          .then(res => {
            console.log(res)
            let tokenTmp = wx.getStorageSync('token') || ''
            if(res.code==200 && res.data.F_Employees){
              _this.setData({
                isEmployee: true
              })
            }
            if (res.code == 200 && res.data.F_UserType == "蒲公英") {
              if (tokenTmp != '') {
                _this.setData({
                  isDandelion: true
                })
              } else {
                _this.setData({
                  isDandelion: false
                })
              }
            } else {
              _this.setData({
                isDandelion: false
              })
            }
          })
        })
      }
    })
    if (wx.getStorageSync("token")) {
      _this.setData({
        canshare: true
      })

    } else {
      _this.setData({
        canshare: false
      })

    }

    if (option.scene) {
      //公共访问记录——商品二维码
      common.productQRcodeRecord(option.scene)
      this.loadingProduct(option);
      console.log(option.scene)
      // 用户从分享的二维码扫描进入，显示广告
      _this.setData({
        hiddenActivity: false, //隐藏活动模块
        shadow: false, //阴影
        control: false,
      })
      var scene = option.scene
      _this.setData({
        qrvisitor: true,
        scene: scene
      })

    } else if (option.index && option.openid) {
      //公共分享的访问记录
      let invitationID = option.invitationID
      let originalOpenid = option.openid
      common.commonVisitRecord(invitationID, originalOpenid)
      this.loadingProduct(option);

      // 用户从分享的二维码扫描进入，显示广告
      _this.setData({
        hiddenActivity: false, //隐藏活动模块
        shadow: false, //阴影
        control: false,
      })
      wx.setStorage({
        key: "inviter",
        data: option.openid
      })
      console.log(option.openid)
      console.log(option.index)
      productID = option.index
      _this.setData({
        index: option.index
      })

    } else {
      productID = option.index
      this.setData({
        index: option.index
      })
      this.loadingProduct(option);
    }
  },
  onShow: function() {
    //开始计时（停留时间）
    stayTime_JY = 0 //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++
    }, 1000)

  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "商品详情")
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "商品详情")
  },

  // to赠送礼物页面
  toGiveGiftPage() {
    if (!wx.getStorageSync('phone')) {
      wx.showModal({
        title: '提示',
        content: '还未登录, 现在去登录?',
        cancelText: '先逛逛',
        cancelColor: '#666666',
        confirmText: '去登录',
        confirmColor: '#3CC51F',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../me/twicelogin/twicelogin',
            })
            wx.setStorageSync("formWhere", "shopping")
          }
        }
      });
    } else {
      let goodsInfo = {
        goodsSku: this.data.goodsSku,
        goodsSpecifications: this.data.goodsSpecifications,
        goodsImg: this.data.goodsImg,
        goodsPrice: this.data.caculatePrice
      }
      console.log(goodsInfo)
      if (!this.data.goodsSku) {
        wx.showToast({
          title: '请选择规格再赠送！',
          icon: 'none'
        })
        return
      } else {
        if (this.data.Inventory <= 0) {
          common.showModal('所选商品库存不足。', '提示', function(res) {
            if (res.confirm) {
              return
            }
          })
        } else {
          wx.navigateTo({
            url: 'giveGifts/giveGifts?goodsInfo=' + JSON.stringify(goodsInfo),
          })
        }
      }
    }
  },
  loadingProduct: function(option) {
    // console.log(option.index)
    const _this = this
    wx.getStorage({
      //通过缓存的token判断是否登陆状态
      //通过缓存的phone判断是否已注册用户
      key: "phone",
      success: function(res) {
        _this.setData({
          index: option.index || '',
          mytoken: wx.getStorageSync('token'),
          phone: res.data
        })
        console.log(res)
        _this.setData({
          // openid: JSON.parse(res.info).openid
          openid: wx.getStorageSync('openid')
        })
        // console.log(_this.data.openid+'-----------')
        try {
          var phone = wx.getStorageSync('phone');
          _this.setData({
            phone: phone
          })
          var indexdata = {}
          var apiurl = ''

          indexdata = {
            "productId": _this.data.index
          }
          if (_this.data.scene != '') {
            indexdata = {
              "qrcodeid": _this.data.scene
            }
          }
          apiurl = '/lr/s2bapi/productdetails2'
          // }
          // api.get(apiurl, indexdata)
          ProductDetails2(indexdata)
            .then(function(res) {
              wx.hideLoading()
              console.log(res)
              if (res.code == 200) {
                _this.setData({
                  published: res.data.published
                })
                _this.loadingProductInfoFn(res)

              } else {
                var phone = wx.getStorageSync('phone');
                _this.setData({
                  phone: phone
                })

                var indexdata = {

                  "qrcodeid": option.scene

                }

                ProductDetails2(indexdata)
                  .then(function(res) {
                    console.log(res.data.rateQty)
                    if (res.code == 200) {
                      _this.setData({
                        published: res.data.published
                      })
                      _this.loadingProductInfoFn(res)

                    } else {
                      common.showModal('请稍后再试', '提示', function(res) {
                        if (res.confirm) {
                          return
                        }
                      })
                    }
                  })
              }
            })
        } catch (e) {}
      },
      //非登陆状态下
      fail: function() {
        var apiurl = '/lr/s2bapi/productdetails2'
        var indexdata2
        if (option.scene) {
          //通过商品二维码进入的商品详情接口请求
          console.log(option.scene)

          indexdata2 = {

            "qrcodeid": option.scene

          }
        } else if (_this.data.index && _this.data.productCategories != '拼团') {
          productID = option.index

          indexdata2 = {

            "productId": _this.data.index

          }
        } else if (_this.data.productCategories == '拼团') {
          //通过拼团进入的商品详情接口请求
          indexdata2 = {
            'id': _this.data.index
          }
          apiurl = '/s2b/groupbuy/GetGBProductDetail'
        } else {

          indexdata2 = {

            "productId": option.index

          }
        }

        ProductDetails2(indexdata2)
          .then(function(res) {
            wx.hideLoading()
            console.log(res)
            if (res.code == 200) {
              _this.setData({
                published: res.data.published
              })
              _this.loadingProductInfoFn(res)


            } else {
              common.showModal('加载时出现了错误，请稍后再尝试。', '提示', function(res) {
                if (res.confirm) {
                  return
                }
              })
            }
          })
      }
    })
  },
  onShareAppMessage: function(res) {
    let nickname = wx.getStorageSync('userName') || " "
    let openid = wx.getStorageSync('openid')
    let invitationID = common.uuid()
    console.log(res)
    let productID = (this.data.productCategories == '拼团' ? this.data.F_ProductID : this.data.index)
    if (res.target.dataset.name === 'share') {
      this.closeShare()
      //缓存没有openid的话就用接口取
      if (openid == '') {
        GetWxOpenId().then(res => {
          openid = res.data.data;
          //用户未授权的话，nickName传空格字符串
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              nickname = res.userInfo.nickName
              common.commonShare(productID, nickname, openid, '', invitationID, '')
            },
            fail: function(err) {
              console.log(err)
              common.commonShare(productID, nickname, openid, '', invitationID, '')
            }
          })
        })
      } else {
        //用户未授权的话，nickName传空格字符串
        wx.getUserInfo({
          success: function(res) {
            console.log(res)
            nickname = res.userInfo.nickName
            common.commonShare(productID, nickname, openid, '', invitationID, '')
          },
          fail: function(err) {
            console.log(err)
            common.commonShare(productID, nickname, openid, '', invitationID, '')
          }
        })
      }

    }
    return {
      title: this.data.productName,
      path: 'pages/categories/detail/detail?index=' + this.data.index + '&openid=' + this.data.openid + '&catename=' + this.data.productCategories + '&invitationID=' + invitationID
    }
  },


  canNotShare: function() {
    common.showModal('注册登录成为梵星或者蒲公英才能分享。', '提示', function(res) {
      if (res.confirm) {
        return
      }
    })
  },
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  showAttr: function() {
    let _this = this
    var query = wx.createSelectorQuery()
    query.select('.attr').boundingClientRect()
    query.exec(function(res) {
      console.log(res)
      if (res[0].height <= 230) {
        _this.setData({
          isTap: true,
          isTapAttr: true,
          fromCart: false,
          banscroll: false,
        })
      } else {
        _this.setData({
          isTap: true,
          isTapAttr: true,
          fromCart: false,
          banscroll: true,
        })
      }
    })
  },
  hiddenAttr: function() {
    this.setData({
      isTap: false,
      isTapAttr: false,
      hasQRcode: false,
      openshare: true,
      showMoreTuan: false,
      isTapSer: false,
      topnum: 0
    })
  },
  // 选择规格

  selectAttr(e) {
    console.log(e.currentTarget.dataset)
    let _nowParnetIndex = e.currentTarget.dataset.parentindex; //当前点击的规格父级索引
    let _nowAttrID = e.currentTarget.dataset.id; //当前点击的规格ID
    let _nowAttrParentID = e.currentTarget.dataset.parentid; //当前点击的规格父级ID
    let _nowAttrCombineName = e.currentTarget.dataset.combinename; //当前点击的父级名称+规格名称
    let _nowAttrName = e.currentTarget.dataset.name; //当前点击的规格的名称

    let __nowAttrID = this.data.nowAttrID
    let __nowAttrParentID = this.data.nowAttrParentID
    let __nowAttrCombineName = this.data.nowAttrCombineName
    let __nowAttrName = this.data.nowAttrName

    __nowAttrID.splice(_nowParnetIndex, 1, _nowAttrID),
      __nowAttrParentID.splice(_nowParnetIndex, 1, _nowAttrParentID),
      __nowAttrCombineName.splice(_nowParnetIndex, 1, _nowAttrCombineName)
    __nowAttrName.splice(_nowParnetIndex, 1, _nowAttrName)

    this.setData({
      nowAttrID: __nowAttrID,
      nowAttrParentID: __nowAttrParentID,
      nowAttrCombineName: __nowAttrCombineName,
      nowAttrName: __nowAttrName
    })

    let nowAttrCombineNameArr = Object.assign([], this.data.nowAttrCombineName);
    let differentCount = 0;
    for (let i = 0; i < this.data.ProductAttributeCombinationModel.length; i++) {
      let combinationAttributes = this.data.ProductAttributeCombinationModel[i].AttributesXml.split('<br />').toString() //将数据中的组合字符串去掉'<br />',再转成字符串与当前选择的组合进行对比
      if (nowAttrCombineNameArr.toString() == combinationAttributes) { //对比一致则打印该组合的信息
        console.log("当前规格组合：" + this.data.ProductAttributeCombinationModel[i].AttributesXml)
        console.log("当前规格组合ID：" + this.data.ProductAttributeCombinationModel[i].Id)
        console.log("当前规格组合价格：" + this.data.ProductAttributeCombinationModel[i].OverriddenPrice)
        console.log("当前规格组合库存：" + this.data.ProductAttributeCombinationModel[i].StockQuantity)
        console.log("当前规格组合SKU：" + this.data.ProductAttributeCombinationModel[i].Sku)
        console.log("当前规格组合发货周期：" + this.data.ProductAttributeCombinationModel[i].DeliveryCycle)
        console.log("当前规格组合的内部员工价：" + this.data.ProductAttributeCombinationModel[i].EmployeePrice)
        this.setData({
          hiddenInventory: false,
          num: 1,
          minusStatus: 'disabled',
          caculatePrice: this.data.ProductAttributeCombinationModel[i].OverriddenPrice,
          unitPrice: this.data.ProductAttributeCombinationModel[i].OverriddenPrice,
          Inventory: this.data.ProductAttributeCombinationModel[i].StockQuantity,
          DeliveryCycle: this.data.ProductAttributeCombinationModel[i].DeliveryCycle,
          nowCombinationID: this.data.ProductAttributeCombinationModel[i].Id,
          nowCombinationName: combinationAttributes,
          goodsSku: this.data.ProductAttributeCombinationModel[i].Sku,
          goodsSpecifications: this.data.ProductAttributeCombinationModel[i].AttributesXml,
          goodsImg: e.currentTarget.dataset.goodsimg.ImageUrl,
          EmployeePrice: this.data.ProductAttributeCombinationModel[i].EmployeePrice || '',
          EmployeeUnitPrice: this.data.ProductAttributeCombinationModel[i].EmployeePrice || ''
        })
        break
      } else if (nowAttrCombineNameArr.indexOf("A") < 0 && nowAttrCombineNameArr.toString() != combinationAttributes) {
        //当每类规格都选完，且不存在于所有组合中的，用一个计数器记录
        differentCount++
        this.setData({
          num: 1,
          minusStatus: 'disabled'
        })
      }
    }
    if (nowAttrCombineNameArr.indexOf("A") < 0) {
      this.setData({
        canConfirm: true,
        hasCombination: true,
        priceChange: true,
        hiddenInventory: false
      })
      if (differentCount == this.data.ProductAttributeCombinationModel.length) {
        this.setData({
          hasCombination: false,
          hiddenInventory: true
        })
      }
    }

  },

  confirm: function(e) {
    if (!this.data.canconfirmshoppingcart) {
      return
    }
    this.setData({
      canconfirmshoppingcart: false
    })
    // 判断用户是否把商品加入购物车
    app.globalData.shoppingCartLoading = "loading";
    console.log('用户购买了商品')

    if (!this.data.hasCombination) {
      this.setData({
        canconfirmshoppingcart: true
      })
      common.showModal('暂时无该组合。', '提示', function(res) {
        if (res.confirm) {
          return
        }
      })
      return
    }
    if (this.data.num > this.data.Inventory) {
      this.setData({
        canconfirmshoppingcart: true
      })
      common.showModal('输入数量大于现有库存或库存不足。', '提示', function(res) {
        if (res.confirm) {
          return
        }
      })
      return
    }
    console.log(this.data.fromCart)
    this.hiddenAttr()
    const _this = this
    var areadata = {
      "token": "",
      "loginMark": "",
      "data": {
        "province": (this.data.region)[0],
        "city": (this.data.region)[1],
        "district": (this.data.region)[2],
        "deliveryMethod": "送货上门并安装",
        // "money": parseInt((this.data.caculatePrice).split(',').join(''))
        "money": this.data.isEmployee&&this.data.EmployeePrice!=''?this.data.EmployeePrice:this.data.caculatePrice
      }
    }
    // api.post('/lr/k3api/getfreightbyarea', areadata, 'application/json')
    GetFreightByArea(areadata, 'application/json')
      .then(res => {
        if (res.data.Message == "您所选省市区不能送货上门并安装，请选择自提，详情请咨询在线客服。") {
          this.setData({
            canconfirmshoppingcart: true
          })
          common.showModal('该地区只支持自提，详情请咨询在线客服。', '提示', function(res) {
            if (res.confirm) {
              areadata = {
                "token": "",
                "loginMark": "",
                "data": {
                  "province": (_this.data.region)[0],
                  "city": (_this.data.region)[1],
                  "district": (_this.data.region)[2],
                  "deliveryMethod": "自提",
                  // "money": parseInt((_this.data.caculatePrice).split(',').join(''))
                  "money": _this.data.isEmployee&&_this.data.EmployeePrice!=''?_this.data.EmployeePrice:_this.data.caculatePrice
                }
              }
              // api.post('/lr/k3api/getfreightbyarea', areadata, 'application/json')
              GetFreightByArea(areadata, 'application/json')
                .then(res => {
                  _this.setData({
                    tMoney: JSON.parse(res.data.Value).money
                  })
                })
              return
            }
          })

        }
        console.log(JSON.parse(res.data.Value))
        this.setData({
          tMoney: JSON.parse(res.data.Value).money
        })
      })


    let thisgoods = {
      product_id: productID,
      combination_id: this.data.nowCombinationID,
      // product_price: parseInt((this.data.caculatePrice).split(',').join("")) / this.data.num,
      product_price: this.data.isEmployee&&this.data.EmployeePrice!=''?this.data.EmployeePrice/this.data.num : this.data.caculatePrice / this.data.num,
      product_name: this.data.productName,
      product_specifications: this.data.nowCombinationName,
      product_image: this.data.imgURL[0].ImageUrl || this.data.imgURL[0],
      count: this.data.num,
      published: this.data.published
    }
    _this.fetchMyShoppingCart(thisgoods);


  },
  confirm1: function() {
    common.showModal('请选择规格', '提示', function(res) {
      if (res.confirm) {
        return
      }
    })
  },
  addToCart: function(event) {
    console.log('formid为 ' + `${event.detail.formId}`);
    common.postformid(event.detail.formId);
    const _this = this
    if (this.data.productCategories == '拼团') {
      this.setData({
        // chooseTuan0: false
      })
      if (!wx.getStorageSync('token')) {

        common.showModal('请登录后再参加拼团活动', '提示', function(res) {
          _this.hiddenAttr()
          if (res.confirm) {

            wx.navigateTo({
              url: '../../me/twicelogin/twicelogin',
            });
            wx.setStorageSync("formWhere", "running");
            return
          }
          return
        })
      }
    }
    debugger;
    if (event.currentTarget.dataset.id == 3) {
      this.setData({
        fromcreate: true
      })
    }
    this.setData({
      fromCart: true
    })
    console.log(this.data.fromCart)
    this.showAttr()
  },
  /* minus or plus*/
  bindMinus: function() {
    var num = this.data.num
    if (num > 1) {
      num--
    }
    var minusStatus = num <= 1 ? 'disabled' : 'normal'
    this.setData({
      num: num,
      minusStatus: minusStatus,
      caculatePrice: this.data.unitPrice * num,
      EmployeePrice: this.data.EmployeeUnitPrice * num
    })

  },
  bindPlus: function() {
    var num = this.data.num
    num++
    var minusStatus = num < 1 ? 'disabled' : 'normal'
    this.setData({
      num: num,
      minusStatus: minusStatus,
      caculatePrice: this.data.unitPrice * num,
      EmployeePrice: this.data.EmployeeUnitPrice * num
    })
  },
  bindManual: function(e) {
    var num = e.detail.value
    var minusStatus = num <= 1 ? 'disabled' : 'normal'
    if (num <= 0) {
      num = 1
    }
    this.setData({
      num: num,
      minusStatus: minusStatus,
      caculatePrice: this.data.unitPrice * num,
      EmployeePrice: this.data.EmployeeUnitPrice * num
    })

  },
  onReachBottom: function() {
    this.loadDetail()
    if (this.data.option4 == true) {
      this.loadComment(start);
    }
  },
  /*load the detail of goods*/
  loadDetail: function() {
    if (this.data.hasLoad) {
      return
    }
    const _this = this
    _this.setData({
      hasLoad: true
    })
    if (this.data.article2.length != 0) {
      this.setData({
        showArticle2: true
      })
    } else if (this.data.article == '<div></div>') {
      common.showModal('该商品暂无详细介绍。', '提示', function(res) {
        if (res.confirm) {
          return
        }
      })
    } else {
      WxParse.wxParse('article', 'html', _this.data.article, _this, 0)
    }

  },
  /*open the HD image of the goods*/
  previewImg: function(e) {
    var _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: _this.data.imgList
    })
  },
  pushImgList: function(img, imgData) {
    for (let i = 0; i < imgData.length; i++) {
      img[i] = imgData[i].FullSizeImageUrl
    }
    return img
  },
  /*create QRcode*/
  createQRcode: function() {
    this.closeShare()
    if (this.data.QRcodeIMG != '') {
      //停留在当前页面或者生成的二维码还存在的情况下，不再重新生成
      this.setData({
        hasQRcode: true,
        isTap: true
      })
      return
    }
    let nickname = wx.getStorageSync('userName') || " "
    let openid = wx.getStorageSync('openid')
    let invitationID = common.uuid()

    const _this = this
    if (this.data.mytoken) {
      wx.showLoading({
        title: '加载中'
      })
      this.setData({
        hasQRcode: true,
        isTap: true
      })
      var qrdata = { //A-商品二维码，B-图文二维码
        // "token": _this.data.mytoken,
        // "loginMark": _this.data.phone,
        "productID": _this.data.index,
        "qrCodeType": "A"
      }
      // api.get('/lr/s2bapi/getQrCode', qrdata)
      GetQrCode(qrdata, 'application/x-www-form-urlencoded', _this.data.mytoken)
        .then(function(res) {
          if (res.code == 200) {
            console.log(res)
            _this.setData({
              QRcodeIMG: res.data.F_ImagePath,
              QRcodeID: res.data.F_ID
            })
            wx.hideLoading()
            let qrcode = res.data.F_ID
            wx.getUserInfo({
              success: function(res) {
                console.log(res)
                nickname = res.userInfo.nickName
                common.commonShare(qrcode, nickname, openid, 'qrcode', invitationID, '')
              },
              fail: function(err) {
                console.log(err)
                common.commonShare(qrcode, nickname, openid, 'qrcode', invitationID, '')
              }
            })
          } else if (res.code == 400) {
            if (res.info == '找不到该蒲公英') {
              common.showModal("亲你还不是蒲公英，还不能生成二维码~。", "", function(res) {
                debugger
                if (res.confirm) {
                  wx.switchTab({
                    url: '../../me/me?type=false'
                  })
                }
              })
            } else {
              common.showModal("请稍后再试", "", function(res) {
                if (res.confirm) {

                }
              })
            }
            wx.hideLoading()
          }
        })
    } else {
      common.showModal("请登录并成为蒲公英才生成二维码~。", "", function(res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../../me/me?type=true'
          })
        }
      })
    }
  },
  createQRcode1: function() {
    const _this = this
    if (this.data.isTap) {
      return
    } else if (this.data.productCategories == '拼团') {
      common.showModal("二维码不适用于该活动。", "", function(res) {
        if (res.confirm) {
          return
        }
        return
      })
    }
  },
  previewQRcode: function(e) {
    let QRimg = []
    QRimg[0] = e.target.dataset.src
    wx.previewImage({
      urls: QRimg
    })
  },
  backToCate: function() {
    wx.switchTab({
      url: '../categories'
    })
  },
  submitComment: function() {
    common.showModal('评论功能暂未开放', '提示', function(res) {
      if (res.confirm) {
        return
      }
    })
  },
  /*select option*/
  // 商品标签
  openOption1: function() {
    this.setData({
      option1: true,
      option2: false,
      option3: false,
      option4: false,
      option5: false,
      option6: false,
      isGood: true,
      leftVal: 0
    })
  },
  // 参数标签
  openOption2: function() {
    const _this = this
    // this.setData({
    //   table: table
    // })
    this.setData({
      option1: false,
      option2: true,
      option3: false,
      option4: false,
      option5: false,
      option6: false,
      isGood: false,
      leftVal: 750 / this.data.tabCount
    })

  },
  // 推荐标签
  openOption3: function() {
    this.setData({
      option1: false,
      option2: false,
      option3: true,
      option4: false,
      option5: false,
      option6: false,
      isGood: false,
      leftVal: 750 / this.data.tabCount * 3
    })
  },
  // 评论标签
  openOption4: function() {
    if (this.data.rateQty == '0') {
      this.setData({
        noRate: true
      })
    }
    this.setData({
      option1: false,
      option2: false,
      option3: false,
      option4: true,
      option5: false,
      option6: false,
      isGood: false,
      leftVal: 750 / this.data.tabCount * 2
    })
    /*评论*/
    if (this.data.isFirstTimeOpenComment) {
      this.setData({
        isFirstTimeOpenComment: false
      })
      this.loadComment(start)
    }

    /*常见问题*/
    var questiondata = {
      "GoodsID": this.data.index
    }
    // api.get('/lr/s2bapi/GetCommonProblemByGoodsID',questiondata)
    GetCommonProblemByGoodsID(questiondata)
      .then(res => {
        this.setData({
          question: res.data
        })
      })
  },
  openOption5: function() {
    this.setData({
      option1: false,
      option2: false,
      option3: false,
      option4: false,
      option5: true,
      option6: false,
      isGood: false
    })
  },


  /*公共方法*/
  addDetial: function(detailArr, object) {
    detailArr.unshift(object)
    return detailArr
  },
  noLoginTips: function(tips, storageName, storageVal) {
    common.showModal(tips, '提示', function(res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '../../me/twicelogin/twicelogin',
        });
        wx.setStorageSync(storageName, storageVal);
      }
    })
  },
  activeChange: function(e, postValue, inputValue) {
    let val = e.detail.value
    const _this = this
    if (postValue == "questionPostValue") {
      this.setData({
        questionPostValue: _this.trim(val),
        questionInputValue: val
      })
    } else if (postValue == "answerPostValue") {
      this.setData({
        answerPostValue: _this.trim(val),
        answerInputValue: val
      })
    } else {
      this.setData({
        commentPostValue: _this.trim(val),
        commentInputValue: val
      })
    }

  },
  trim: function(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },

  /*userbar*/
  toIndex: function() {
    let _this = this;
    wx.switchTab({
      url: "../../home/home",
      success: function(res) {
        // 用户点击了首页，执行成功
        app.globalData.shoppingCartLoading = "loading";
      }
    })
  },
  openShare: function() {
    this.setData({
      openshare: false,
      isTap: true
    })
  },
  closeShare: function() {
    this.setData({
      openshare: true,
      isTap: false
    })
  },
  saveQR: function() {
    const _this = this
    if (this.data.mytoken) {
      var qrdata = {
        "token": _this.data.mytoken,
        "loginMark": _this.data.phone,
        "data": _this.data.index
      }
      // api.get('/lr/s2bapi/getQrCode', qrdata)
      GetQrCode(qrdata, '', _this.data.mytoken)
        .then(function(res) {
          if (res.code == 200) {
            _this.setData({
              QRcodeIMG: res.info
            })
            wx.downloadFile({
              url: _this.data.QRcodeIMG,
              success: function(res) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(res) {
                    console.log('调用成功')
                  },
                  complete() {
                    wx.showToast({
                      title: '保存到相册',
                      icon: 'success',
                      duration: 1500
                    })
                    _this.closeShare()
                  },
                })
              },
              fail: function() {
                common.showModal('二维码获取失败，请稍后再尝试。', '提示', function(res) {
                  if (res.confirm) {
                    return
                  }
                })
              },
              complete: function() {}
            })
          } else if (res.code == 400) {
            debugger;
            common.showModal("亲你还不是蒲公英，还不能生成二维码~。", "", function(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../../me/me?type=false'
                })
              }
            })
          }
        })
    } else {
      common.showModal("请登录并成为蒲公英才生成二维码~。", "", function(res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../../me/me?type=true'
          })
        }
      })
    }
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const _this = this
    this.setData({
      region: e.detail.value
    })
    var areadata = {
      "token": "",
      "loginMark": "",
      "data": {
        "province": (this.data.region)[0],
        "city": (this.data.region)[1],
        "district": (this.data.region)[2],
        "deliveryMethod": "送货上门并安装",
        "money": this.data.isEmployee&&this.data.EmployeePrice!=''?parseInt(this.data.EmployeePrice):parseInt(this.data.caculatePrice)
      }
    }
    // api.post('/lr/k3api/getfreightbyarea', areadata, 'application/json')
    GetFreightByArea(areadata, 'application/json')
      .then(res => {
        if (res.data.Message == "您所选省市区不能送货上门并安装，请选择自提，详情请咨询在线客服。") {
          common.showModal('该地区只支持自提，详情请咨询在线客服。', '提示', function(res) {
            if (res.confirm) {
              areadata = {
                "token": "",
                "loginMark": "",
                "data": {
                  "province": (_this.data.region)[0],
                  "city": (_this.data.region)[1],
                  "district": (_this.data.region)[2],
                  "deliveryMethod": "自提",
                  // "money": parseInt((_this.data.caculatePrice).split(',').join(''))
                  "money": _this.data.isEmployee&&_this.data.EmployeePrice!=''?_this.data.EmployeePrice:_this.data.caculatePrice
                }
              }
              // api.post('/lr/k3api/getfreightbyarea', areadata, 'application/json')
              GetFreightByArea(areadata, 'application/json')
                .then(res => {
                  if (_this.data.productCategories == "梵豆") {
                    _this.setData({
                      tMoney: '0'
                    })
                  } else {
                    _this.setData({
                      tMoney: JSON.parse(res.data.Value).money
                    })
                  }

                })
              return
            }
          })
        }
        console.log(JSON.parse(res.data.Value))
        if (this.data.productCategories == "梵豆") {
          _this.setData({
            tMoney: '0'
          })
        } else {
          this.setData({
            tMoney: JSON.parse(res.data.Value).money
          })
        }
      })
  },
  showSuccess: function() {
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      image: '',
      duration: 1000,
    })
  },

  fetchMyShoppingCart: function(product = {}) {
    console.log(product);
    let that = this;
    var cart;
    wx.showLoading({
      title: '加入购物车',
    });
    if (!!wx.getStorageSync('phone')) {
      // debugger
      if (!!wx.getStorageSync('ShoppingCart')) {
        insertShoppingCart({
          value: product,
          success: function() {
            // 插入成功，取总的缓存中的提交接口
            cart = wx.getStorageSync("ShoppingCart");
            console.log(cart);
          },
        });
      }
      var insertcart = cart ? cart : [product];
      console.log("用户已登录需插入商品---------------------------");
      console.log(insertcart);

      addShoppingCart({
        body: insertcart,
        success: function(res) {
          console.log(res)
          if (res.data.code == 200) {
            mta.Event.stat('diaoyanfenxi', { 'shopping': 'true' })
            wx.showToast({
              title: '添加购物车成功',
            });
            wx.setStorageSync("ShoppingCart", "");
            that.setData({
              canconfirmshoppingcart: true
            })

          } else if (res.data.code == 400 || res.data.code == 401) {
            that.setData({
              isLogin: false,
              canconfirmshoppingcart: true
            })
            that.handleLoginPage()
          } else {
            that.setData({
              canconfirmshoppingcart: true
            })
          }
        },
        fail: function(err) {
          that.setData({
            canconfirmshoppingcart: true
          })
        }
      });
    } else {
      console.log("用户未登录需插入商品---------------------------");
      console.log(product);
      insertShoppingCart({
        value: product,
        success: function() {
          // 插入本地缓存成功
          wx.hideLoading();
          wx.showToast({
            title: '加入购物车成功',
          });
          that.setData({
            canconfirmshoppingcart: true
          })
        },
        fail: function(err) {
          that.setData({
            canconfirmshoppingcart: true
          })
        }
      });
    }

  },
  handleLoginPage: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '还未登录, 现在去登录?',
      cancelText: '先逛逛',
      cancelColor: '#666666',
      confirmText: '去登录',
      confirmColor: '#3CC51F',
      success: function(event) {
        const {
          confirm = false
        } = event
        if (confirm) {
          // that.pushToLoginPage();
          wx.navigateTo({
            url: '../../me/twicelogin/twicelogin',
          })
          wx.setStorageSync("formWhere", "shopping")
        }
      },
      fail: function() {
        // Do nothing.
      },
    });
  },

  loadingProductInfoFn: function(res) {
    const _this = this
    let thisData = ''
    let thisData2 = ''
    let GroupBuyCombinations = []
    if (this.data.productCategories == '拼团') {
      //拼团相关
      console.log(JSON.parse(res.data.F_Packets))
      console.log("==========================================")
      thisData = JSON.parse(res.data.F_Packets)
      GroupBuyCombinations = thisData.GroupBuyCombinations //拼团用这个规格
      console.log(GroupBuyCombinations)
      this.setData({
        GroupBuyCombinations: GroupBuyCombinations
      })
    } else {
      //正常详情
      console.log(JSON.parse(res.data.detailJson))
      thisData = JSON.parse(res.data.detailJson)
      thisData2 = res.data
    }
    productID = thisData.Id
    if ((thisData2.F_MianImageList === null || thisData2.F_MianImageList == "") && thisData2.PictureModeList === null && thisData.FullDescription == null) {

      wx.showModal({
        title: '提示',
        content: '商品资料正在维护，请稍后。',
        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
      return
    }
    _this.setData({
      F_MianImageList: thisData2.F_MianImageList,
      PictureModeList: thisData2.PictureModeList,
      // imgURL: (thisData2.F_MianImageList===null||thisData2.F_MianImageList=="")?thisData.PictureModels:(thisData2.PictureModeList).split(','),//新旧的轮播图，新的后台可配置
      imgURL: ((thisData2.F_MianImageList === null || thisData2.F_MianImageList == "") && thisData2.PictureModeList === null) ? thisData.PictureModels : (thisData2.PictureModeList === null ? (thisData2.F_MianImageList).split(',') : thisData2.PictureModeList), //新旧的轮播图，新的后台可配置
      // imgList: (thisData2.F_MianImageList===null||thisData2.F_MianImageList=="")?_this.pushImgList(_this.data.imgList, thisData.PictureModels):(thisData2.F_MianImageList).split(','),
      imgList: ((thisData2.F_MianImageList === null || thisData2.F_MianImageList == "") && thisData2.PictureModeList === null) ? _this.pushImgList(_this.data.imgList, thisData.PictureModels) : (thisData2.PictureModeList === null ? (thisData2.F_MianImageList).split(',') : _this.pushImgList(_this.data.imgList, thisData2.PictureModeList)),
      // swiperAllNum: thisData.PictureModels.length,
      swiperAllNum: ((thisData2.F_MianImageList === null || thisData2.F_MianImageList == "") && thisData2.PictureModeList === null) ? thisData.PictureModels.length : (thisData2.PictureModeList === null ? (thisData2.F_MianImageList).split(',').length : thisData2.PictureModeList.length),
      productName: thisData.Name,
      // productPrice: thisData.ProductPrice.Price.substr(1, thisData.ProductPrice.Price.length - 4),
      productPrice: _this.data.productCategories == '拼团' ? res.data.F_Price : thisData.ProductPrice.PriceValue,
      // reward: (parseFloat(thisData.ProductPrice.Price.substr(1, thisData.ProductPrice.Price.length - 4).split(",").join("")) * 0.05).toFixed(2),
      reward: (parseFloat(thisData.ProductPrice.Price) * 0.05).toFixed(2),

      productAttributes: thisData.ProductAttributes,
      ProductAttributeCombinationModel: _this.data.productCategories == '拼团' ? thisData.GroupBuyCombinations[0].ProductAttributeCombinationModel : thisData.ProductAttributeCombinationModel,

      caculatePrice: thisData.ProductPrice.PriceValue,
      rateQty: res.data.rateQty,
      tmallNumiid: _this.data.productCategories != '拼团' ? res.data.tmallNumiid : res.data.F_TmallNumIid,
      article: (thisData2.F_DetailImageList === null || thisData2.F_DetailImageList == "") ? thisData.FullDescription : thisData2.F_DetailImageList,
      article2: (thisData2.F_DetailImageList !== null && thisData2.F_DetailImageList != "" && thisData2.F_DetailImageList.indexOf('<') >= 0) ? _this.data.article2 : (thisData2.F_DetailImageList !== null && thisData2.F_DetailImageList != "" && thisData2.F_DetailImageList.indexOf('<') < 0) ? (thisData2.F_DetailImageList).split(',') : [], //新商品详情图片，后台可配置
      // table: thisData.FullDescription===null?"":"<table" + thisData.FullDescription.split('<table')[1].split('</table>')[0] + "</table>",
      // GroupBuyCount: _this.data.productCategories=='拼团'?res.data.F_GroupBuyCount:0,
      F_ProductID: _this.data.productCategories == '拼团' ? res.data.F_ProductID : 0,
      productOldId: thisData.Id,
      paramslist: res.data.paramslist === null || res.data.paramslist == "" ? [] : res.data.paramslist
    })
    // 根据规格父级的数量向规格ID组插入初始化值，用于下面的多层级多项选择
    for (let i = 0; i < thisData.ProductAttributes.length; i++) {
      let arrZore = ['A']
      let arrAttrName = [thisData.ProductAttributes[i].Name]
      _this.setData({
        nowAttrID: _this.addGoods(_this.data.nowAttrID, arrZore),
        nowAttrParentID: _this.addGoods(_this.data.nowAttrParentID, arrZore),
        nowAttrName: _this.addGoods(_this.data.nowAttrName, arrAttrName),
        nowAttrCombineName: _this.addGoods(_this.data.nowAttrCombineName, arrZore)
      })
    }
    if (_this.data.qrvisitor) {
      _this.setData({
        index: thisData.Id
      })
    }
    //插入浏览记录
    wx.getUserInfo({
      success: function(res) {
        let BrowsingRecordData = {
          "token": _this.data.mytoken,
          "loginMark": _this.data.phone,
          "data": {
            "F_NickName": res.userInfo.nickName,
            "F_PhoneNumber": _this.data.phone,
            "F_ProductID": _this.data.productOldId,
            "F_ProductName": _this.data.productName,
            "F_Status": "B",
            "F_Image": (_this.data.F_MianImageList === null || _this.data.F_MianImageList == '') && _this.data.PictureModeList == null ? _this.data.imgURL[0].ImageUrl : (_this.data.PictureModeList == null ? _this.data.imgURL[0] : _this.data.imgURL[0].ImageUrl),
            "F_Price": _this.data.productPrice,
            "F_ProductCategories": _this.data.productCategories
          }
        }
        // api.post('/lr/s2bapi/ProductBrowsingRecord',BrowsingRecordData,'application/json')
        ProductBrowsingRecord(BrowsingRecordData, 'application/json')
          .then(res => {
            console.log(res)
            console.log('记录足迹=======================')
          })
      },
      fail: function(res) {
        let BrowsingRecordData = {
          "token": _this.data.mytoken,
          "loginMark": _this.data.phone,
          "data": {
            "F_NickName": '',
            "F_PhoneNumber": _this.data.phone,
            "F_ProductID": _this.data.productOldId,
            "F_ProductName": _this.data.productName,
            "F_Status": "B",
            "F_Image": (_this.data.F_MianImageList === null || _this.data.F_MianImageList == '') && _this.data.PictureModeList == null ? _this.data.imgURL[0].ImageUrl : (_this.data.PictureModeList == null ? _this.data.imgURL[0] : _this.data.imgURL[0].ImageUrl),
            "F_Price": _this.data.productPrice,
            "F_ProductCategories": _this.data.productCategories
          }
        }
        // api.post('/lr/s2bapi/ProductBrowsingRecord',BrowsingRecordData,'application/json')
        ProductBrowsingRecord(BrowsingRecordData, 'application/json')
          .then(res => {
            console.log(res)
            console.log('记录足迹=======================')
          })
      }
    })
    if (_this.data.productCategories == '拼团') { //拼团列表
      console.log(_this.data.F_ProductID)
      _this.moretuanOnload()
    }



  },
  onPageScroll: function(e) {
    if (e.scrollTop >= 900) {
      this.setData({
        showToTop: true
      })
    } else {
      this.setData({
        showToTop: false
      })
    }
  },
  toTop: function() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 点击活动立即查看
  ToGuangzhouPage: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.id != 4) {
      return;
    } else {
      this.closeActivity();
      wx.navigateTo({
        url: '../../home/guangzhouShop/guangzhouShop',
      })
    }
  },

  // 隐藏活动模块
  closeActivity: function() {
    // var _this = this;
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    let animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.translateX(300).scale(0.1).opacity(0).step();
    animation2.translateX(-54).opacity(1).step();
    this.setData({
      animationData: animation.export(),
      animationControl: animation2.export(),
      shadow: true
    })
  },
  opencart: function() {
    app.globalData.shoppingCartLoading = "loading";
    this.refreash();
    if (pagelength >= 5) {
      wx.redirectTo({
        url: '../../shopping-cart/shopping-cart'
      })
    } else {
      wx.navigateTo({
        url: '../../shopping-cart/shopping-cart'
      })
    }

  },
  refreash: function() {
    var token = wx.getStorageSync("token");
    var phone = wx.getStorageSync("phone");
    var openid = wx.getStorageSync("openid");
    if (token != '') {
      let checktokendata = {}
      let checktokenheader = 'application/x-www-form-urlencoded'
      // api.get('/api/user/checktoken',checktokendata,checktokenheader,token)
      CheckToken(checktokendata, checktokenheader, token)
        .then(res => {
          if (res.data.code == 0) {

          } else if (res.data.code == -1) {
            api.wxlogin()
              .then(res => {
                let url = '/api/user/login'
                let data = {
                  "code": res,
                  // "orginOpenId":''
                }
                let header = 'application/json'
                // api.post(url,data,header)
                // Login(data,header)
                GetMyOpenid(data)
                  .then(res => {
                    if (res.data.code == 0) {
                      console.log(res)

                      wx.setStorageSync('openid', res.data.data)

                    }
                  })
              })
          }
        })
    }
  },
  /*加载评论列表*/
  loadComment: function(page) {
    if (this.data.firstTime == false && start + 10 >= this.data.ratecount) {
      return
    } else {

      wx.showLoading({
        title: '加载中'
      })

      var commentdata = {
        "tmallnumiid": this.data.tmallNumiid,
        "page": page / 10 + 1,
        "limit": 10
      }
      // api.get('/lr/s2bapi/getproductrates', commentdata)
      GetProductRates(commentdata)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            if (res.data == []) {
              this.setData({
                ratecount: 0
              })
            } else {
              console.log(res.data.Data)
              this.setData({
                commentinfo: this.data.isFirstTimeOpenComment ? res.data.Data : this.addGoods(this.data.commentinfo, res.data.Data),
                ratecount: res.data.Total,
                firstTime: false
              })
              start += 10
            }
            wx.hideLoading()
          } else {
            console.log("这里报400")
            this.setData({
              ratecount: 0
            })
            wx.hideLoading()
          }
        })
    }

  },

  addGoods: function(goodsList, resData) {
    var length = goodsList.length
    for (let i = 0; i < resData.length; i++) {
      goodsList[i + length] = resData[i]
    }
    return goodsList
  },

  //轮播图页码指示器
  changeSwiperNum: function(e) {
    this.setData({
      swiperNum: e.detail.current + 1
    })
  },
  //打开商品服务
  toSer: function() {
    this.setData({
      isTapSer: true,
      isTap: true
    })
  },
  //创建图文二维码
  toImgQRCode: function() {
    let visitorType = ''
    let imglist = ''
    if ((this.data.F_MianImageList === null || this.data.F_MianImageList == "") && this.data.PictureModeList === null) {
      imglist = this.data.imgList
    } else if (this.data.F_MianImageList !== null && this.data.F_MianImageList != "" && this.data.PictureModeList === null) {
      imglist = this.data.imgURL
    } else if (this.data.F_MianImageList !== null && this.data.F_MianImageList != "" && this.data.PictureModeList !== null) {
      imglist = this.data.imgList
    }
    try {
      visitorType = wx.getStorageSync('characterType')
    } catch (e) {}
    if (visitorType == '蒲公英') {
      wx.navigateTo({
        url: './imgQRcode/imgQRcode?productid=' + this.data.index + '&productpic=' + JSON.stringify(imglist) + '&qrcodeimg=' + this.data.QRcodeIMG + '&qrcodeid=' + this.data.QRcodeID
      })
    } else {
      common.showModal('成为蒲公英才能制作海报。', '提示', function(res) {
        if (res.confirm) {
          return
        }
      })
    }
    this.closeShare()
  }
})