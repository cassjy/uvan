// pages/brand/play/prize/prize.js
var api = require("../../../../utils/API/request.js");
var utils = require("../../../../utils/util.js");
var common = require("../../../../utils/common.js");
var count = 10;
var page = 1;

var stayTime_JY = 0; //停留时间
var stayTimer_JY; //定时器
import {
  GetPrizeList,
  getmyaddress,
  AddVanBeans,
  InsertRoulettePrizeOrder
} from "../../../../utils/API/brand/brand.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    loadingMore: true,
    showNotRecord: true, //梵豆记录
    pageNum: "",
    noMore: true,
    hiddenmodalput: true,
    customItem: "全部",
    receive: {
      region: ["广东省", "佛山市", "顺德区"],
      name: "",
      phone: "",
      address: ""
    },
    prizeobj: "",
    index: "",
    ifpost: "" //是否允许提交
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  //  加载数据公用方法
  onloadData: function() {
    var _this = this;
    var data = {
        openid: _this.data.openid,
        page: page,
        limit: count,
        rouletteName: "测试活动"
    }
    GetPrizeList(data)
      .then(res => {
        console.log(res);
        if (res.code == 400) {
          _this.setData({
            showNotRecord: false
          });
        } else {
          _this.setData({
            showNotRecord: true
          });
        }
        var listData = _this.data.dataList;
        for (let i = 0; i < res.data.Data.length; i++) {
          listData.push(res.data.Data[i]);
        }
        this.setData({
          dataList: listData,
          pageNum: Math.ceil(res.data.Total / count)
        });
        console.log(_this.data.dataList);
        if (page == _this.data.pageNum) {
          _this.setData({
            loadingMore: true,
            noMore: false
          });
        } else {
          _this.setData({
            noMore: true
          });
        }
      })
      .catch(res => {
        console.log(res);
      })
      .then(() => {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //开始计时（停留时间）
    stayTime_JY = 0; //停留时间
    stayTimer_JY = setInterval(() => {
      stayTime_JY++;
    }, 1000);

    console.log("onshow~~~~~~");
    var _this = this;
    wx.showLoading({
      title: "加载中"
    });
    wx.showNavigationBarLoading();
    try {
      var token = wx.getStorageSync("token");
      var phone = wx.getStorageSync("phone");
      var openid = wx.getStorageSync("openid");
      _this.setData({
        token: token,
        phone: phone,
        openid: openid
      });
      var data = {
        token: token,
        loginMark: phone,
        openid: openid
      };
      getmyaddress(data)
        .then(res => {
          console.log(res);
          if (res.data.length > 0) {
            res.data.map(function(address, index) {
              if (address.is_default) {
                _this.setData({
                  receive: {
                    region: [address.province, address.city, address.county],
                    name: address.customer_name,
                    phone: address.phone,
                    address: address.address
                  }
                });
              }
            });
          }
        })
        .catch(res => {
          console.log(res);
        });
    } catch (e) {
      console.log(e);
    }
    page = 1;
    _this.setData({
      dataList: []
    });
    this.onloadData();
  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "我的奖品（梵豆）");
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "我的奖品（梵豆）");
  },
  bindRegionChange: function(e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    this.setData({
      "receive.region": e.detail.value
    });
  },
  //  form表单弹窗
  showFormModal: function(e) {
    console.log(e);
    this.setData({
      hiddenmodalput: false,
      prizeobj: this.data.dataList[e.currentTarget.dataset.index].prizeName,
      index: e.currentTarget.dataset.index
    });
  },
  getbean: function(e) {
    wx.showLoading({
      title: "加载中"
    });
    var _this = this;
    var beandata = {
      token: this.data.token,
      loginMark: this.data.phone,
      data: this.data.dataList[e.currentTarget.dataset.index].fId
    };
    AddVanBeans(beandata).then(res => {
      wx.hideLoading();
      if (res.code == 200) {
        wx.showModal({
          title: "兑换成功",
          content: "兑换成功，请在梵豆明细列表中查看"
        });
        _this.setData({ dataList: [] });
        page = 1;
        _this.onloadData();
      } else {
        wx.showModal({
          title: "错误",
          content: res.info
        });
      }
    });
  },
  //取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认
  confirm: function() {
    var _this = this;
    var index = this.data.index;
    var now = utils.formatTime(new Date());
    console.log(now);
    var receive = _this.data.receive;
    if (
      receive.name == "" ||
      receive.address == "" ||
      receive.phone == ""
    ) {
      wx.showModal({
        title: "输入内容不能为空",
        content: "输入内容不能为空"
      });
    }else if(
      receive.region[0] == "全部" ||
      receive.region[1] == "全部" ||
      receive.region[2] == "全部"
    ){
      wx.showModal({
        title: "输入内容有误",
        content: "输入内容有误"
      });
    }
     else if (!common.isPhone(receive.phone)) {
      wx.showModal({
        title: "输入内容错误",
        content: "手机格式不正确"
      });
    } else {
      wx.showLoading({
        title: "加载中"
      });
      var settingData = {
        token: _this.data.token,
        loginMark: _this.data.phone,
        data: {
          F_ID: this.data.dataList[this.data.index].fId,
          F_Name: this.data.receive.name,
          F_PhoneNumber: this.data.receive.phone,
          F_Province: this.data.receive.region[0],
          F_City: this.data.receive.region[1],
          F_Area: this.data.receive.region[2],
          F_Address: this.data.receive.address,
          F_CreateDate: now
        }
      };
      InsertRoulettePrizeOrder(settingData).then(res => {
        wx.hideLoading();
        if (res.code == 200) {
          _this.setData({ dataList: [] });
          page = 1;
          _this.onloadData();
        } else {
          wx.showModal({
            title: "错误",
            content: res.info
          });
        }
      });
      this.setData({
        hiddenmodalput: true
      });
    }
  },
  bindinput: function(e) {
    var inputvalue = e.detail.value;
    var _this = this;
    debugger;
    console.log(e);
    switch (e.currentTarget.id) {
      case "receivead":
        var address = "receive.address";
        _this.setData({ [address]: inputvalue });
        break;
      case "receivename":
        var name = "receive.name";
        _this.setData({ [name]: inputvalue });
        break;
      case "receivephone":
        var phone = "receive.phone";
        _this.setData({ [phone]: inputvalue });
        break;
      default:
        break;
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("触发上拉加载");
    console.log(page);
    console.log(this.data.pageNum);
    if (page == this.data.pageNum) {
      this.setData({
        loadingMore: true,
        noMore: false
      });
      wx.showToast({
        title: "到底了"
      });
      return;
    } else if (page < this.data.pageNum) {
      page++;
      this.setData({
        loadingMore: false,
        noMore: true
      });
      wx.showNavigationBarLoading();
      wx.showLoading({
        title: "加载中"
      });
      // 执行获取商品列表接口
      this.onloadData();
    } else {
      wx.showToast({
        title: "到底了"
      });
      return;
    }
  }
});
