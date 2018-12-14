var api = require("../../../utils/API/request.js");
var common = require("../../../utils/common.js");
var count = 10;
var page = 1;

var stayTime_JY = 0; //停留时间
var stayTimer_JY; //定时器
import { getvanbeanrecord } from "../../../utils/API/beanShopping/api.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    loadingMore: true,
    showNotRecord: true, //梵豆记录
    pageNum: "",
    noMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    page = 1;
    wx.showLoading({
      title: "加载中..."
    });
    this.onloadData();
  },

  //  加载数据公用方法
  onloadData: function() {
    var _this = this;
    var data = {
      data: {
        openid: wx.getStorageSync("openid"),
        recordtype: "", //A是消费记录，B是获取记录
        year: 0,
        month: 0,
        day: 0,
        page: page,
        limit: count
      }
    };
    getvanbeanrecord(data)
      .then(res => {
        console.log(res);
        if (res.code == 400) {
          //无梵豆记录
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
          pageNum: Math.ceil(res.data.Total / 10)
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
  },
  onHide: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "梵豆明细");
  },
  onUnload: function() {
    //离开时插入访问记录
    clearInterval(stayTimer_JY);
    common.visitorRecordAPI(stayTime_JY, "梵豆明细");
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
      // 执行获取商品列表接口
      this.onloadData();
    } else {
      wx.showToast({
        title: "到底了"
      });
      return;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
