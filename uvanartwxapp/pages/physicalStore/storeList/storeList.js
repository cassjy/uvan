// pages/physicalStore/storeList/storeList.js
var api = require("../../../utils/API/request.js");
import { GetAllPhysicalStore } from "../../../utils/API/physicalStore/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
      storesList:[
        {
          shopname:"广州店",
          address:"广州市番禺区石基镇金山村华创动漫产业园二期18栋",
          latitude:"22.991690",
          longitude:"113.426200"
        },
        {
          shopname: "上海店",
          address: "上海市青浦吉盛伟邦国际家具村嘉松中路5369号",
          latitude: "31.161640",
          longitude: "121.226310"
        },
        {
          shopname: "青岛店",
          address: "青岛市李沧区九水东路9号富尔玛家具建材广场二楼",
          latitude: "36.158740",
          longitude: "120.436320"
        },
        {
          shopname: "广州店",
          address: "广州市番禺区石基镇金山村华创动漫产业园二期18栋",
          latitude: "22.991690",
          longitude: "113.426200"
        },
        {
          shopname: "上海店",
          address: "上海市青浦吉盛伟邦国际家具村嘉松中路5369号",
          latitude: "31.161640",
          longitude: "121.226310"
        },
        {
          shopname: "青岛店",
          address: "青岛市李沧区九水东路9号富尔玛家具建材广场二楼",
          latitude: "36.158740",
          longitude: "120.436320"
        },
        {
          shopname: "广州店",
          address: "广州市番禺区石基镇金山村华创动漫产业园二期18栋",
          latitude: "22.991690",
          longitude: "113.426200"
        },
        {
          shopname: "上海店",
          address: "上海市青浦吉盛伟邦国际家具村嘉松中路5369号",
          latitude: "31.161640",
          longitude: "121.226310"
        },
        {
          shopname: "青岛店",
          address: "青岛市李沧区九水东路9号富尔玛家具建材广场二楼",
          latitude: "36.158740",
          longitude: "120.436320"
        }
      ],
      id:'',
      height:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // api.get('/lr/s2bapi/GetAllPhysicalStore',{})
    GetAllPhysicalStore({})
    .then(res=>{
      console.log(res);
      _this.setData({
        list:res.data.Data
      })
    })
  },
  goToAddress:function(event){
    console.log(event);
    console.log(event.currentTarget.dataset.id);
    var _this = this;
    var index = event.currentTarget.dataset.id;
    this.setData({ id: index});

    //-----------------------------
  
        wx.openLocation({
          latitude: Number(_this.data.storesList[index].latitude),
          longitude: Number(_this.data.storesList[index].longitude),
          name: _this.data.storesList[index].address,
          address: _this.data.storesList[index].address,
          scale: 28
        })
    this.setData({ id: "" });
    
  },
  loadImg: function(e){
    var bl = e.detail.width/e.detail.height;//原图比例
    var sjheight = wx.getSystemInfoSync().windowWidth/bl//显示实际高度
    this.setData({
      height:sjheight
    })
  },
  imageError: function(e) {
    console.log('加载失败，请重新刷新');
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

  
})