var tel = require("../../../utils/common.js")
const Url = require('../../../utils/API/url.js')
var api = require('../../../utils/API/request.js')
var common = require("../../../utils/common.js")
import {
  UploadPhotoUrl,
  CreateAfterSalesService,
  GetUserBuyGoodsInfo,
  QuestionNaire
} from '../../../utils/API/home/api.js'
var updatePhotoMark = true; //修改图片标识
var checkedSate = true; //用于防止用户多次点击
var page = 1;
var count = 5;
var type; //判断售后服务、满意问卷请求请求商品接口标识

var stayTime_JY = 0 //停留时间
var stayTimer_JY //定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // navTab: true, //true代表第一个默认nav
    navTab: ['售后服务', '满意问卷'],
    tabId: 0,
    chooseIcon: false, //售后服务下拉框icon
    selectIcon: false, //售后服务问题商品
    chooseIcon2: false, //满意问卷下拉框icon
    picList: [], //页面展示的图片数组
    photoList: [], //阿里服务器返回的图片数组
    pickerValue: '', //picker值
    array: ['天猫', '淘宝', '京东', '唯品会', '官网', '线下店铺', '微信小程序'],
    channel: ['天猫/淘宝', '唯品会', '新媒体（微博、微信等）', '新闻报道', '邻居好友推荐', '路过', '广告', '其它'],
    channelMark: ['T', 'W', 'M', 'X', 'P', 'L', 'G', 'Q'],
    start: ['1', '2', '3', '4', '5'],
    hiddenMask: true,
    controlArea: true,
    hiddenAddBtn: false,
    changeColor: false,
    ban: false,
    submit: '提交',
    submit1: '提交',
    hiddenReply: true,
    installTextArea: false,
    showProductTextArea: false, //是否显示商品输入框
    installWenJuanTextArea: false,
    replayAreaValue: '',
    cursor: 0, //textarea输入字数
    cursor1: 0, //问卷调查textarea输入字数
    cursor2: 0, //售后服务输入商品
    hiddenNumber: false, //展示数字
    hiddenNum: false,
    consignee: {},
    wenjuan: {},
    colorIndex: '-1', //星星
    colorIndex1: '-1',
    colorIndex2: '-1',
    colorIndex3: '-1',
    colorIndex4: '-1',
    startList: ['', '', '', '', ''],
    choiceItem: '', //是否愿意推荐优梵
    channelValue: '', //问卷渠道
    channelValueMark: '', //对应的标志
    state: {},
    tipsText: '提交成功！我们会在24小时内给您联系，请保持电话畅通',
    wenjuanBan: false,
    showError: false, //手机号码输入错误警告
    hiddenProduct: true,
    productList: [],
    radioState: -1,
    radioStateNotGoods: false,
    productName: '',
    productNameSH: '',
    ensureProduct: '',
    ensureProductSH: '',
    radioNum: '-1',
    pageNum: '',
    channelMore: false,
    noProductInfo: true, //没找到商品信息
    noproductRecord: false, //没商品时做的标志
    hideenBounced: true,
    goodsInfos: '', //用户输入的商品信息
    ensureGoodsInfos: '', //用户确认信息
    hiddenNotFindProduct: false,
    noMoreProduct: true,
    goodsInfosFz: '',
    userProductName: '',
    Mobile: '', //k3订单用户手机号码
    F_YF_CLIENTNAME: '', //k3订单用户姓名
  },

  kaifazhong: function() {
    wx.showToast({
      title: '功能正在开发中',
    })
  },

  // 导航栏标签选择
  chooseNav: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.id == 1) {
      wx.setNavigationBarTitle({
        title: '满意问卷',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '售后服务',
      })
    }
  

    this.setData({
      tabId: e.currentTarget.dataset.id
    })
  },

  // 跳转到历史查询页面
  toHistoricalPage: function() {
    this.setData({
      state: {}
    })
    wx.navigateTo({
      url: 'historical/historical?id=1',
    })
  },

  // 拨打电话
  Dialing: function() {
    wx.makePhoneCall({
      phoneNumber: '4009318268',
    })
  },

  // 售后服务问题商品选择
  selectGoods: function() {
    if (this.data.ban) {
      return;
    }
    type = 1;
    page = 1;
    let height = wx.getSystemInfoSync().windowHeight + 'px';
    this.loadK3Product();
    this.setData({
      productList: [],
      ban: true,
      hideenBounced: true,
      hiddenNotFindProduct: false,
      radioStateNotGoods: false, //重置radio
      selectIcon: !this.data.selectIcon,
      installTextArea: true, //隐藏textarea bug
      hiddenProduct: !this.data.hiddenProduct,
      height: height
    })
    if (!!this.data.goodsInfosFz) {
      this.setData({
        radioStateNotGoods: true
      })
    }
    console.log(this.data.hideenBounced)
  },
  // 找不到商品时点击该按钮输入商品名称
  notProductRadio: function() {
    if (type == 2) {
      return;
    }
    if (!this.data.radioStateNotGoods) { //没选中的情况
      this.setData({
        userProductName: '',
        cursor2: 0
      })
    } else {
      this.setData({
        userProductName: this.data.goodsInfosFz
      })
    }
    this.setData({
      radioState: -1,
      showProductTextArea: true,
      hideenBounced: !this.data.hideenBounced,
      radioStateNotGoods: !this.data.radioStateNotGoods
    })
  },
  // 实时监听用户输入商品名称
  listenInput: function(e) {
    console.log(e.detail.value)
    this.setData({
      goodsInfos: e.detail.value,
      cursor2: e.detail.value.length
    })
  },
  rCancel: function() {
    this.setData({
      radioStateNotGoods: false,
      hideenBounced: true,
      goodsInfosFz: '',
      goodsInfos: ''
    })
  },
  rEnsure: function() {
    // 判断用户输入的是否是空格，如果是则不允许确认
    if (this.data.goodsInfos.replace(/\s+/g, '') == '') {
      wx.showToast({
        title: '名称不能为空',
        icon: "none",
        image: "../../../images/index/error.png"
      })
      return;
    } else {
      this.setData({
        hideenBounced: true,
        radioStateNotGoods: true,
        goodsInfosFz: this.data.goodsInfos,
        Mobile: wx.getStorageSync('phone')
      })
    }
  },
  // 确认填写的商品信息
  ensureInfo: function() {
    // 判断用户输入的是否是空格，如果是则不允许确认
    if (this.data.goodsInfos.replace(/\s+/g, '') == '') {
      wx.showToast({
        title: '名称不能为空',
        icon: "none",
        image: "../../../images/index/error.png"
      })
      return;
    } else {
      this.setData({
        hideenBounced: true,
        ensureProductSH: this.data.goodsInfos
      })
      this.closeShadow();
      console.log(this.data.ensureGoodsInfos)
    }
  },

  // 失去焦点时获取手机号码长度和验证是否正确
  requireTellength: function(e) {
    console.log(e)
    var reslut = tel.isPhone(e.detail.value);
    if (reslut == false) {
      this.setData({
        showError: true
      })
    } else {
      this.setData({
        showError: false
      })
    }
  },

  // 实时监听当用户输入字数等于11时触发验证事件
  judge: function(e) {
    console.log(e)
    if (e.detail.cursor == 11) {
      var reslut = tel.isPhone(e.detail.value);
      if (reslut == false) {
        this.setData({
          showError: true
        })
      } else {
        this.setData({
          showError: false
        })
      }
    }
  },

  //  售后交易平台下拉框事件   B
  changeIcon: function() {
    if (this.data.ban) {
      return;
    }
    this.setData({
      chooseIcon: true
    })
  },
  changeValue: function(e) {
    console.log(e)
    this.setData({
      chooseIcon: false,
      pickerValue: this.data.array[e.detail.value]
    })
    console.log(this.data.pickerValue)
  },
  cancelMethods: function(e) {
    this.setData({
      chooseIcon: false
    })
  },
  // 交易平台下拉框事件    E


  // 监控售后服务描述textarea输入情况
  monitor: function(e) {
    console.log(e)
    this.setData({
      cursor: e.detail.value.length
    })
  },

  // 点击添加图片
  addPhoto: function(e) {
    if (this.data.ban) {
      return;
    }
    let addId = e.currentTarget.dataset.id;
    this.uploadPhoto(addId);
  },

  // 修改图片
  updatePhoto: function(e) {
    console.log(e)
    if (this.data.ban) {
      return;
    }
    let updateId = e.currentTarget.dataset.id;
    let updateNum = e.currentTarget.dataset.num; //图片下标
    this.uploadPhoto(updateId, updateNum);
  },

  // 上传图片公用方法
  uploadPhoto: function(id, num) {
    var _this = this;
    var itemList;
    if (id == 1) {
      itemList = ['修改图片', '删除图片']
    } else {
      itemList = ['从相册中选择', '拍照']
    }
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#5e5e5e',
      success: function(e) {
        console.log(e)
        console.log(id)
        switch (id) {
          case '1':
            if (e.tapIndex == 0) {
              // var photoType = 'album';
              console.log('默认')
            } else if (e.tapIndex == 1) {
              wx.showModal({
                title: '是否删除该照片？',
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    console.log(_this.data.picList)
                    console.log(_this.data.photoList)
                    _this.data.photoList.splice(num, 1); //删除对应的图片
                    _this.data.picList.splice(num, 1);
                    _this.setData({
                      picList: _this.data.picList
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              return;
            } else {
              return;
            }
            break;
          case '2':
            if (e.tapIndex == 0) {
              var photoType = 'album';
            } else if (e.tapIndex == 1) {
              var photoType = 'camera';
            } else {
              return;
            }
            break;
        }

        switch (num) {
          case 0: //修改第一张图片
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              // sourceType: [photoType],
              success: function(res) {
                _this.aLiUpload((res.tempFilePaths).toString(), updatePhotoMark, num); //重新上传图片(增加修改图片标识和下标)
                _this.data.picList.splice(0, 1, (res.tempFilePaths).toString()) //本地图片地址同样更改
                _this.setData({
                  picList: _this.data.picList
                })

              }
            })
            break;
          case 1: //修改第二张图片
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              // sourceType: [photoType],
              success: function(res) {
                _this.aLiUpload((res.tempFilePaths).toString(), updatePhotoMark, num); //重新上传图片(增加修改图片标识和下标)
                _this.data.picList.splice(1, 1, (res.tempFilePaths).toString())
                _this.setData({
                  picList: _this.data.picList
                })

              }
            })
            break;
          case 2: //修改第三张图片
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              // sourceType: [photoType],
              success: function(res) {
                _this.aLiUpload((res.tempFilePaths).toString(), updatePhotoMark, num); //重新上传图片(增加修改图片标识和下标)
                _this.data.picList.splice(2, 1, (res.tempFilePaths).toString())
                _this.setData({
                  picList: _this.data.picList
                })
              }
            })
            break;
          case 3: //修改第四张图片
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              // sourceType: [photoType],
              success: function(res) {
                _this.aLiUpload((res.tempFilePaths).toString(), updatePhotoMark, num); //重新上传图片(增加修改图片标识和下标)
                _this.data.picList.splice(3, 1, (res.tempFilePaths).toString())
                _this.setData({
                  picList: _this.data.picList
                })
              }
            })
            break;
          case 4: //修改第五张图片
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              // sourceType: [photoType],
              success: function(res) {
                _this.aLiUpload((res.tempFilePaths).toString(), updatePhotoMark, num); //重新上传图片(增加修改图片标识和下标)
                _this.data.picList.splice(4, 1, (res.tempFilePaths).toString())
                _this.setData({
                  picList: _this.data.picList
                })
              }
            })
            break;
          default: //添加图片
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed'],
              sourceType: [photoType],
              success: function(res) {
                console.log(res)
                _this.data.picList.push((res.tempFilePaths).toString());
                _this.setData({
                  picList: _this.data.picList
                })
                // 执行上传图片接口
                _this.aLiUpload((res.tempFilePaths).toString());
                console.log(_this.data.picList)
              }
            })
        }
      }
    })
  },

  // 上传图片到阿里服务器
  aLiUpload: function(path, mark, id) {
    this.setData({
      ban: true
    })
    var _this = this;
    let PhotoUrl = Url.host + UploadPhotoUrl.url
    wx.showLoading({
      title: '上传图片中...',
    })
    console.log(path)
    wx.uploadFile({
      url: PhotoUrl,
      filePath: path,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        "formType": 'S2b',
        "imageType": '售后服务',
        "image": '',
        "token": wx.getStorageSync('token'),
        "loginmark": wx.getStorageSync('phone')
      },
      success: function(res) {
        console.log(JSON.parse(res.data))
        wx.hideLoading()
        if (JSON.parse(res.data).code == 200) {
          if (mark) { //如果是修改图片则需更新图片地址再保存到photoList数组
            _this.data.photoList.splice(id, 1, JSON.parse(res.data).data.F_ImageUrl) //替换图片地址
            _this.setData({
              photoList: _this.data.photoList
            })
            console.log(_this.data.photoList)
          } else {
            _this.data.photoList.push(JSON.parse(res.data).data.F_ImageUrl)
            _this.setData({
              photoList: _this.data.photoList
            })
          }
          console.log(_this.data.photoList)
          _this.setData({
            ban: false
          })
        } else {
          _this.data.picList.pop() //上传失败清掉最后一张图片
          _this.setData({
            ban: false,
            picList: _this.data.picList
          })
          wx.showToast({
            title: '上传失败，请重新上传',
            icon: 'none'
          })
          _this.setData({
            ban: false
          })
        }
      },
      fail: function(res) {
        console.log('图片上传失败')
        console.log(res)
        wx.showToast({
          title: '上传失败，请删除后重新上传！',
          icon: 'none'
        })
      }
    })
  },


  // 申请售后表单提交
  formSubmit: function(e) {
    console.log('formid为 ' + `${e.detail.formId}`);
    common.postformid(e.detail.formId);
    console.log(e)
    var _this = this;
    if (this.data.noproductRecord) {
      wx.showModal({
        title: '优梵艺术提醒您！',
        content: '亲！您还没有购买商品，暂时不能填写问卷哦~',
      })
      return;
    }
    if (!e.detail.value.name || !e.detail.value.phone || !e.detail.value.serviceDetail || !this.data.pickerValue || !this.data.ensureProductSH) {
      wx.showToast({
        title: '请完善售后信息',
        icon: "none",
        image: "../../../images/index/error.png"
      })
      return;
    }
    // 验证手机格式是否正确
    var reslut = tel.isPhone(e.detail.value.phone);
    if (reslut == false) {
      wx.showToast({
        title: '手机号码不正确',
        icon: 'none',
        image: "../../../images/index/error.png"
      })
      return;
    }
    console.log(this.data.photoList)
    let formData = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": {
        "F_Name": e.detail.value.name,
        "F_ProblemGoods": _this.data.ensureProductSH,
        "F_PhoneNumber": e.detail.value.phone,
        "F_SalesPlatform": _this.data.pickerValue,
        "F_Image1": _this.data.photoList[0],
        "F_Image2": _this.data.photoList[1],
        "F_Image3": _this.data.photoList[2],
        "F_Image4": _this.data.photoList[3],
        "F_Image5": _this.data.photoList[4],
        "F_Remark": e.detail.value.serviceDetail
      }
    }
    this.setData({
      ban: true
    })
    let header = "application/json";
    CreateAfterSalesService(formData, header).then(res => {
        console.log(res)
        if (res.code == 200) {
          _this.setData({
            hiddenMask: false,
            ban: true,
            textAreaData: e.detail.value.serviceDetail,
            installTextArea: true,
            submit: '已提交'

          })
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
          _this.setData({
            ban: false,
            submit: '提交'
          })
        }
      })
      .catch(res => {
        console.log(res)
        wx.showToast({
          title: '提交失败',
        })
        _this.setData({
          ban: false,
          submit: '提交'
        })
      })
      .then(() => {

      })
  },

  // 点击阴影层（提交成功时的遮罩层）
  closeMask: function() {
    this.setData({
      hiddenMask: true
    })
    wx.switchTab({
      url: '../../home/home',
    })
  },

  // 提交成功确认事件
  enSure: function() {
    this.setData({
      hiddenMask: true
    })
    wx.switchTab({
      url: '../../me/me',
    })
  },


  // 满意问卷逻辑实现   B

  // 更多商品
  moreProduct: function() {
    page = 1;
    type = 2;
    this.setData({
      productList: [],
      hiddenNotFindProduct: true,
      radioStateNotGoods: false,
      hideenBounced: true
    })
    if (this.data.wenjuanBan) {
      return;
    }
    let height = wx.getSystemInfoSync().windowHeight + 'px';
    this.loadK3Product();
    this.setData({
      slectedMore: !this.data.slectedMore,
      hiddenProduct: !this.data.hiddenProduct,
      height: height
    })
  },
  //  请求k3返回商品列表
  loadK3Product: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var data = {
      "data": {
        // "phone": '13726274026',
        "phone": wx.getStorageSync('phone'),
        "page": page,
        "limit": count,
        "type": type
      }
    }
    var header = 'application/json'
    GetUserBuyGoodsInfo(data, header).then(res => {
        console.log(res)
        if (res.data.Data === null || res.data.ErrorMsg == '未找到已购买商品信息') {
          if (type == 1) {
            _this.setData({
              noMoreProduct: false
            })
          }
          _this.setData({
            noProductInfo: false,
            // noproductRecord: true,
          })
          return;
        } else {
          _this.setData({
            noProductInfo: true,
            // noproductRecord: false
          })
        }
        var array = _this.data.productList;
        for (let i = 0; i < res.data.Data.length; i++) {
          array.push(res.data.Data[i])
        }
        _this.setData({
          productList: array,
          pageNum: Math.ceil(res.data.Total / 5)
        })
        console.log(type)
        if (Math.ceil(res.data.Total / 5) == 1 && type == 1) { //只有一页情况下显示找不到商品
          _this.setData({
            noMoreProduct: false
          })
        }
        console.log(_this.data.pageNum)
      })
      .catch(res => {
        console.log(res)
      })
      .then(() => {
        wx.hideLoading()
      })
  },

  // 关闭商品列表
  closeShadow: function() {
    this.setData({
      hideenBounced: true,
      hiddenProduct: true,
      showProductTextArea: false,
      slectedMore: false,
      height: '',
      selectIcon: false,
      productNameSH: '',
      productName: '',
      radioState: -1,
      ban: false, //可操作
      installTextArea: false,
      noMoreProduct: true
    })
  },

  // 加载更多商品
  loadMore: function(e) {
    console.log(e)
    console.log(page)
    console.log(this.data.pageNum)
    console.log('到底了')
    if (page == this.data.pageNum) {
      if (!this.data.hideenBounced) {
        return
      } else {
        wx.showToast({
          title: '到底了',
          icon: 'none'
        })
        if (type == 1) {
          this.setData({
            noMoreProduct: false
          })
        } else {
          this.setData({
            noMoreProduct: true
          })
        }
        return;
      }
    } else {
      page++;
      this.loadK3Product();
    }
  },

  // radio选择
  productRadio: function(e) {
    var _this = this
    console.log(e)
    
    this.setData({
      radioStateNotGoods: false,
      radioState: e.currentTarget.dataset.id,
      hideenBounced: true,
      goodsInfosFz: ''
    })
    if (type == 1) {
      this.setData({
        Mobile: e.currentTarget.dataset.mobile,
        F_YF_CLIENTNAME: e.currentTarget.dataset.username,
      })
    }
    if (e.currentTarget.dataset.checked == 1) {
      this.setData({
        productNameSH: e.currentTarget.dataset.productname
      })
    } else {
      this.setData({
        productName: e.currentTarget.dataset.productname
      })
    }
    console.log(this.data.productNameSH)
    console.log(this.data.productName)
  },
  // 确认选择
  ensureChoosed: function() {
    this.setData({
      ban: false,
      showProductTextArea: false,
      ensureProduct: this.data.productName,
      ensureProductSH: this.data.productNameSH,
      installTextArea: false, //显示textarea
      noMoreProduct: true
    })
    if (type == 2) { //满意问卷商品确认后要清空售后服务的姓名和手机号码
      this.setData({
        Mobile: '',
        F_YF_CLIENTNAME: ''
      })
    }
    if (!!this.data.goodsInfosFz) {
      debugger
      this.setData({
        ensureProductSH: this.data.goodsInfosFz,
      })
    }
    this.closeShadow();
  },

  changeChannel: function(e) {
    console.log(e)
    console.log('1')
    if (this.data.wenjuanBan) {
      return;
    }
    this.setData({
      chooseIcon2: false,
      channelValue: this.data.channel[e.detail.value],
      channelValueMark: this.data.channelMark[e.detail.value]

    })
  },
  changeIcon2: function() {
    console.log('1')
    if (this.data.wenjuanBan) {
      return;
    }
    this.setData({
      chooseIcon2: true
    })
  },
  cancelChannel: function() {
    this.setData({
      chooseIcon2: false
    })
  },
  // 星星选择
  chooseStart: function(e) {
    console.log(e)
    console.log(e.target.dataset.id)
    //如果是查看历史问卷返回的数据不可编辑
    if (this.data.wenjuanBan) {
      return;
    }
    // debugger
    var _this = this;
    switch (e.currentTarget.dataset.state) {
      case '1':
        this.data.startList.splice(0, 1, e.currentTarget.dataset.id + 1)
        this.setData({
          colorIndex: e.target.dataset.id,
          startList: this.data.startList
        })
        break;
      case '2':
        this.data.startList.splice(1, 1, e.currentTarget.dataset.id + 1)
        this.setData({
          colorIndex1: e.target.dataset.id,
          startList: this.data.startList
        })
        break;
      case '3':
        this.data.startList.splice(2, 1, e.currentTarget.dataset.id + 1)
        this.setData({
          colorIndex2: e.target.dataset.id,
          startList: this.data.startList
        })
        break;
      case '4':
        this.data.startList.splice(3, 1, e.currentTarget.dataset.id + 1)
        this.setData({
          colorIndex3: e.target.dataset.id,
          startList: this.data.startList
        })
        break;
      case '5':
        this.data.startList.splice(4, 1, e.currentTarget.dataset.id + 1)
        this.setData({
          colorIndex4: e.target.dataset.id,
          startList: this.data.startList
        })
        break;
    }
    console.log(this.data.startList)
  },
  //  选择推荐优梵
  chooseRadio: function(e) {
    console.log(e)
    if (this.data.wenjuanBan) {
      return;
    }
    this.setData({
      radioNum: e.currentTarget.dataset.id,
      choiceItem: e.currentTarget.dataset.name
    })
    console.log(this.data.choiceItem)
  },

  // 查看历史问卷
  TohistoryPage: function() {
    this.setData({
      state: {}
    })
    wx.navigateTo({
      url: 'historical/historical?id=2',
    })
  },

  // 监控问卷调查textarea输入情况
  monitor1: function(e) {
    console.log(e)
    this.setData({
      cursor1: e.detail.value.length
    })
  },

  // 满意问卷提交
  wenJuanSubmit: function(e) {
    console.log(e)
    console.log(this.data.choiceItem)
    console.log(this.data.channelValueMark)
    var _this = this;
    if (this.data.choiceItem == '是') {
      var itemNum = 1;
    } else if (this.data.choiceItem == '否') {
      var itemNum = 0;
    }
   

    if (!this.data.choiceItem || this.data.ensureProduct == '') {
      wx.showToast({
        title: '您有信息未填！',
        icon: "none",
        image: "../../../images/index/error.png"
      })
      return;
    }
    for (let i = 0; i < this.data.startList.length; i++) {
      if (this.data.startList[i] == '') {
        wx.showToast({
          title: '您有信息未填！',
          icon: "none",
          image: "../../../images/index/error.png"
        })
        return;
      }
    }
    this.setData({
      wenjuanBan: true
    })

    var wenjuanData = {
      "token": wx.getStorageSync('token'),
      "loginMark": wx.getStorageSync('phone'),
      "data": {
        "F_PhoneNumber": wx.getStorageSync('phone'),
        "F_BuyProduct": this.data.ensureProduct,
        "F_KnowTheOutlets": this.data.channelValueMark,
        "F_ShoppingQuideQuality": this.data.startList[0],
        "F_3DDesignProject": this.data.startList[1],
        "F_DeliveryService": this.data.startList[2],
        "F_FurnitureQuality": this.data.startList[3],
        "F_AfterSalesService": this.data.startList[4],
        "F_IsRecommendUvanart": itemNum,
        "F_Suggest": e.detail.value.suggest
      }
    }
    let header2 = "application/json";
    if (checkedSate) {
      checkedSate = false;
      QuestionNaire(wenjuanData, header2).then(res => {
          console.log(res)
          if (res.code == 200) {
            _this.setData({
              tipsText: '提交成功，感谢您的填写！',
              hiddenMask: false,
              wenjuanBan: true,
              submit1: '已提交',
              textWenJuanAreaData: e.detail.value.suggest,
              installWenJuanTextArea: true
            })
          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none'
            })
            _this.setData({
              wenjuanBan: false,
              submit1: '提交',
              wenjuanBan: false
            })
          }
        })
        .catch(res => {
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
          _this.setData({
            wenjuanBan: false,
            submit1: '提交',
            wenjuanBan: false
          })
        })
        .then(() => {
          checkedSate = true
        })
    }

    console.log(wenjuanData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

    console.log(this.data.consignee)
    console.log(this.data.wenjuan)
    console.log(this.data.state)
    var _this = this;
    // 判断用户是否登录
    var seesionId = wx.getStorageSync('sessionid');
    console.log(seesionId)
   
  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "售后社区")
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY, "售后社区")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})