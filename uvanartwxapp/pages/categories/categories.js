var common = require("../../utils/common.js")
var api = require("../../utils/API/request.js")
import { GetNewSearchHistory, CreateSearchHistory, DeleteSearchHistory, ProductList } from '../../utils/API/categories/api.js'
import {
  GetWxOpenId
} from "../../utils/API/activity/activity.js";
import {
  ValidateUserType
} from '../../utils/API/detail/api.js'
var start = 0
var header = "application/json"
var openid = ''

var stayTime_JY = 0//停留时间
var stayTimer_JY //定时器

Page({
  data: {
    isTap: false, //控制遮罩层
    goodsList: [],//商品列表
    goodsList1: [],//商品列表
    count: 10,//每次加载数量
    total: 0,//商品总数
    finishloading: false,//加载动画相关
    hiddenLoading: true,//加载动画相关
    hiddenNoGoods:true,//隐藏没有商品标签
    hiddenNoSearch: true,//隐藏没有搜索到相关商品标签
    onloadHidden: false,//加载动画相关
    canLoadMore: true,//控制加载更多，防止加载频率过高
    isScrollY: true,//控制scroll-view
    isOpen: false,//判断是否打开了某个分类
    CateID: null,//存放分类ID
    StyleID: null,//存放风格ID
    searchValue: "",//经过处理的搜索词，传到后台的值
    inputValue: "",//输入的搜索词
    hasCateId: false,//判断是否通过点击分类/风格进来列表的
    hasScrollHeight: true,//固定scroll-view的高度，回到页面顶部
    isFromSearch: false,//判断是否通过搜索进入列表
    record: [],//搜索记录
    focus: false,//控制搜索框是否自动获取焦点
    canFresh: true,//防止刷新频率过高
    sortkeyVal: '综合',//排序词语默认值
    sortkeyOBJ: null,//排序条件对象
    priceStatus: '降序',
    hot: '',//是否爆款
    newest: '',//是否新品
    isClear: '',//是否内销
    name: '',//用作访问记录
    isEmployee: false
  },
  onLoad: function (option) {
    /**
    option参数说明，由pages/explore/explore传入
    通过获取的option参数对应的商品列表
    searchValue 搜索词
    pID 分类ID
    sID 风格ID
    hot 爆款
    newest 新品
    */
    const _this = this
    start = 0 
    wx.showNavigationBarLoading()
    if(option.searchValue){
      this.setData({
        goodsList:[],
        searchValue: option.searchValue
      })
      this.loadData(0,this.data.count,'','',option.searchValue,false,true)//加载商品列表函数，下面说明
    }
    if(option.pID){
      this.setData({
        CateID: option.pID,
        hasCateId: true,
        name: "-"+option.pName
      })
      this.loadData(0,this.data.count,option.pID,'','',false,true)
    }else if(option.sID){
      this.setData({
        StyleID: option.sID,
        hasCateId: true,
        name: "-"+option.sName
      })
      this.loadData(0,this.data.count,'',option.sID,'',false,true)
    }else if(option.hot){
      this.setData({
        hot: option.hot,
        name: "-新品上市"
      })
      this.loadData(0,this.data.count,'','','',false,true)
    }else if(option.newest){
      this.setData({
        newest: option.newest,
        name: "-臻选精品"
      })
      this.loadData(0,this.data.count,'','','',false,true)
    }else if(option.isClear){
      this.setData({
        isClear: option.isClear,
        name: "-内销"
      })
      this.loadData(0,this.data.count,'','','',false,true)
    }else{
      wx.hideNavigationBarLoading() 
      //没接收到option参数时，说明通过点击pages/explore/explore的搜索框进入页面，显示搜索页面
      //搜索页面与商品列表页面为同一页面，通过条件渲染
      this.setData({
        isFromSearch: true,
        focus: true
      })
      // openid = wx.getStorageSync('openid')
      // var getHistoryData = {
      //   "data": openid
      // }
      // api.get('/lr/s2bapi/GetNewSearchHistory',getHistoryData)//获取搜索历史的接口
      // .then(res=>{
      //   console.log(res)
      //   this.setData({
      //     record: res.data.Data
      //   })
      // })
    }
    openid = wx.getStorageSync('openid')
    var getHistoryData = {
      "data": openid
    }
    // api.get('/lr/s2bapi/GetNewSearchHistory',getHistoryData)//获取搜索历史的接口
    GetNewSearchHistory(getHistoryData)
    .then(res=>{
      console.log(res)
      this.setData({
        record: res.data.Data
      })
    })
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
          })
        })
      }
    })
  },
  onShow: function(){
    //开始计时（停留时间）
    stayTime_JY = 0//停留时间
    stayTimer_JY = setInterval(()=>{
      stayTime_JY++
    },1000)
  },
  onHide: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"商品列表（搜索）"+this.data.name)
  },
  onUnload: function(){
    //离开时插入访问记录
    clearInterval(stayTimer_JY)
    common.visitorRecordAPI(stayTime_JY,"商品列表（搜索）"+this.data.name)
  },
  /*loading more and refresh*/
    /*loading more加载更多商品*/
  loadMore: function(){
    if(this.data.canLoadMore){
      this.setData({
        canLoadMore: false
      })
      start+=this.data.count//累加每次的加载的数量用作计算返回数据的page值
      if(this.data.searchValue!=""&&this.data.total==0){ //处理不存在搜索关键词的情况
        this.setData({
          hiddenLoading:true, 
          hiddenNoGoods:true
        })
        return
      }else if(start>=this.data.total){ //处理没有更多商品的情况
        this.setData({
          hiddenLoading:true, 
          hiddenNoGoods:true
        })
        return
      }
      this.setData({
        hiddenLoading:false //loading GIF show
      })
      wx.showNavigationBarLoading()  //NavigationBarLoading show
      //区分选择了分类商品时加载更多和没有选择分类时加载更多的情况
      if(this.data.hasCateId&&this.data.CateID){ //加载分类类别的商品
        this.loadData(start,this.data.count,this.data.CateID,'','',false,false,this.data.sortkeyOBJ)//loading goodslist
      }else if(this.data.hasCateId&&this.data.StyleID){//加载风格类别的商品
        this.loadData(start,this.data.count,'',this.data.StyleID,'',false,false,this.data.sortkeyOBJ)
      }else if(this.data.hot!=''){//加载爆款商品
        this.loadData(start,this.data.count,'','','',false,false,this.data.sortkeyOBJ)
      }else if(this.data.newest!=''){//加载新品商品
        this.loadData(start,this.data.count,'','','',false,false,this.data.sortkeyOBJ)
      }else if(this.data.isClear!=''){//加载内销商品
        this.loadData(start,this.data.count,'','','',false,false,this.data.sortkeyOBJ)
      }else{//不是通过分类/风格/爆款/新品进入商品列表的加载
        if(this.data.searchValue!=""){//加载搜索词的商品
          this.loadData(start,this.data.count,'','',this.data.searchValue,false,false,this.data.sortkeyOBJ)//loading goodslist
        }else{//加载全部商品，前期存在这个情况，现阶段已不存在这个情况
          this.loadData(start,this.data.count,'','','',false,false,'')//loading goodslist
        }
      }
    }
    
  },
  /*refresh刷新列表，主要是通过点击“综合”按钮*/
  freshData: function(sortkey){
    if(this.data.canFresh){
      this.setData({
        canFresh: false
      })
      start = 0 //重新刷新数据，清空计数
      wx.showNavigationBarLoading()
      this.setData({
        hasScrollHeight: false,
      })
      if(this.data.searchValue){//刷新搜索的列表
        this.loadData(0,this.data.count,'','',this.data.searchValue,true,true,sortkey)
      }else if(this.data.CateID){//刷新分类的商品列表
        this.loadData(0,this.data.count,this.data.CateID,'','',true,true,sortkey)
      }else if(this.data.StyleID){//刷新风格的商品列表
        this.loadData(0,this.data.count,'',this.data.StyleID,'',true,true,sortkey)
      }else if(this.data.hot){//刷新爆款的商品列表
        this.loadData(0,this.data.count,'','','',true,true,sortkey)
      }else if(this.data.newest){//刷新新品的商品列表
        this.loadData(0,this.data.count,'','','',true,true,sortkey)
      }else if(this.data.isClear){//刷新内销商品列表
        this.loadData(0,this.data.count,'','','',true,true,sortkey)
      }
      this.setData({
        hasScrollHeight: true
      })
    }
    
  },
  onPullDownRefresh: function(){//下拉刷新，之前有用，现在禁用了本页面的下拉行为，所以这个已经不起作用
    this.freshData()
  },
  onReachBottom: function(){//触底加载更多
    this.loadMore()
  },
  /*loading more and refresh end*/
  hiddenCover: function(){//点击遮罩层隐藏
    this.setData({
      isTap: false,
      isScrollY: true
    })
  }, 
  /*search text*/
  tapSearch: function(){//点击本页面的搜索框触发与pages/explore/explore的搜索框相同的行为
    this.setData({
      isFromSearch: true
    })
    var getHistoryData = {
      "data": openid
    }
    // api.get('/lr/s2bapi/GetNewSearchHistory',getHistoryData)
    GetNewSearchHistory(getHistoryData)
    .then(res=>{
      console.log(res)
      this.setData({
        record: res.data.Data
      })
    })
  },
  searchActiveChange: function(e){//跟踪用户在输入框输入的数据
    let val = e.detail.value
    const _this = this
    this.setData({
      searchValue: _this.trim(val),//处理输入词的前后空格，用作传到后台
      inputValue: val,//未作处理的输入词，用作保留在输入框使用
    })
  },
  searchFn: function(e){//搜索按钮
    if(e.target.dataset.value){//搜索输入框保留词
      this.setData({
        searchValue: e.target.dataset.value,
        inputValue: e.target.dataset.value
      })
    }
    if(this.data.searchValue==""){//空框搜索的情况
      // this.toSearchPage()
      common.showModal( '请输入搜索内容', '提示', function (res) {
        if (res.confirm) {
          return
        }
      })
      return
    }

    if(this.data.searchValue){
      var searchData = {
        "data": {
          "openId": openid,
          "searchText": this.data.searchValue 
        }
      }
      // api.post('/lr/s2bapi/CreateSearchHistory',searchData,'application/json')//将搜索词传到后台记录
      CreateSearchHistory(searchData,'application/json')
      .then(res=>{
        console.log(res)
      })
      start = 0
      this.setData({
        isFromSearch: false,
        CateID: '',
        StyleID:'',
        goodsList:[]
      })
      this.loadData(0,this.data.count,'','',this.data.searchValue,false,true)
    }
  },
  deleteRecord: function(){//删除搜索记录
    this.setData({
      record: []
    })
    var deleteHistoryData = {
      "data": openid
    }
    // api.get('/lr/s2bapi/DeleteSearchHistory',deleteHistoryData)//删除记录接口
    DeleteSearchHistory(deleteHistoryData)
    .then(res=>{
      console.log(res)
    })
  },
  /*loading data function*/
  loadData: function(start,count,cateId,styleId,keywords,fresh,isonload,sortkey){
    /**
    参数说明
    start 分页页码
    count 每次加载数量，默认10
    cateId 分类ID
    styleId 风格ID
    keywords 关键词，搜索用
    fresh 是否刷新，刷新用
    isonload 是否初次加载
    sortkey 筛选+排序条件
    */
    const _this = this
    let goodsListData = this.data.goodsList
    if(cateId){
      var listdata = {
        "token":'',//不用传
        "loginMark":'',//不用传
        "data": {
          'page': start/10+1,//分页
          'limit':count,//每次加载数量
          'productcategory': cateId,//分类ID
          'productstyle':'',//风格ID
          'keywords': keywords,//关键词
          'sortParameter': sortkey,//筛选+排序条件
        }
      }
    }else if(styleId){
      var listdata = {
        "token":'',
        "loginMark":'',
        "data": {
          'page': start/10+1,
          'limit':count,
          'productcategory': '',
          'productstyle':styleId,
          'keywords': keywords,
          'sortParameter': sortkey
        }
      }
    }else if(keywords){
      var listdata = {
        "token":'',
        "loginMark":'',
        "data": {
          'page': start/10+1,
          'limit':count,
          'productcategory': '',
          'productstyle':'',
          'keywords': keywords,
          'sortParameter': sortkey
        }
      }
    }else if(this.data.hot!=''){
      var listdata = {
        "token":'',
        "loginMark":'',
        "data": {
          'page': start/10+1,
          'limit':count,
          'productcategory': '',
          'productstyle':'',
          'keywords': '',
          'sortParameter': sortkey,
          'isHot': true
        }
      }
    }else if(this.data.newest!=''){
      var listdata = {
        "token":'',
        "loginMark":'',
        "data": {
          'page': start/10+1,
          'limit':count,
          'productcategory': '',
          'productstyle':'',
          'keywords': '',
          'sortParameter': sortkey,
          'isNewest': true
        }
      }
    }else if(this.data.isClear!=''){
      // 内销
      var listdata = {
        "token":'',
        "loginMark":'',
        "data": {
          'page': start/10+1,
          'limit':count,
          'productcategory': '',
          'productstyle':'',
          'keywords': '',
          'sortParameter': sortkey,
          'IsClear': true
        }
      }
    }
    // api.post('/lr/s2bapi/productlist',listdata)//商品列表接口
    // console.log(common.pagingCommon('/lr/s2bapi/productlist',listdata))
    ProductList(listdata)
    .then(function(res){
      console.log(res)
      if(_this.data.searchValue!=""&&res.code!=200){
        _this.setData({
          goodsList:[],
          hiddenNoSearch: false,
          hiddenNoGoods: true,
          onloadHidden: true,
          total: 0
        })
        return
      }else if(res.code != 200){
        _this.setData({
          goodsList:[],
          goodsList1:[],
          hiddenNoSearch: true,
          hiddenNoGoods: true,
          onloadHidden: true,
          total: 0,
        })
        // wx.showModal({
        //   title: '提示',
        //   content: '该系列还未上架，敬请期待！',
        //   showCancel:false,
        //   success: function(res) {
        //     if (res.confirm) {
        //       wx.switchTab({
        //         url: "/pages/explore/explore"
        //       })
        //     } else if (res.cancel) {
        //       wx.switchTab({
        //         url: "/pages/explore/explore"
        //       })
        //     }
        //   }
        // })
        // goodsListData = _this.data.goodsList1
        var listdata = {
          "token":'',
          "loginMark":'',
          "data": {
            'page': 1,
            'limit':999,
            'productcategory': '',
            'productstyle':'',
            'keywords': '',
            'sortParameter': sortkey,
            'isHot': true
          }
        }
        // api.post('/lr/s2bapi/productlist',listdata)
        ProductList(listdata)
        .then(res=>{
          _this.setData({
            goodsList1: fresh?res.data.Data:_this.addGoods(goodsListData,res.data.Data),
            total: res.data.Total,
            canLoadMore: false
          })
        })
        return
      }else if(res.code == 200 && res.data===null ){
        _this.setData({
          goodsList:[],
          goodsList1:[],
          hiddenNoSearch: true,
          hiddenNoGoods: false,
          onloadHidden: true,
          total: 0,
        })
        // wx.showModal({
        //   title: '提示',
        //   content: '该系列还未上架，敬请期待！',
        //   showCancel:false,
        //   success: function(res) {
        //     if (res.confirm) {
        //       // wx.switchTab({
        //       //   url: "/pages/explore/explore"
        //       // })
        //       wx.navigateBack({
        //         delta: 1
        //       })
        //     } 
        //   }
        // })
        var listdata = {
          "token":'',
          "loginMark":'',
          "data": {
            'page': 1,
            'limit':999,
            'productcategory': '',
            'productstyle':'',
            'keywords': '',
            'sortParameter': sortkey,
            'isHot': true
          }
        }
        // api.post('/lr/s2bapi/productlist',listdata)
        ProductList(listdata)
        .then(res=>{
          
          _this.setData({
            goodsList1: fresh?res.data.Data:_this.addGoods(goodsListData,res.data.Data),
            total: res.data.Total,
            canLoadMore: false
          })
        })
        return
      }else{
        _this.setData({
          hiddenNoGoods: true,
          hiddenNoSearch: true
        })
        if(cateId!=''){
          _this.setData({
            onloadHidden: true,
            goodsList: fresh?res.data.Data:_this.addGoods(goodsListData,res.data.Data),
            total: res.data.Total
          })
        }else if(styleId!=''){
          _this.setData({
            onloadHidden: true,
            goodsList: fresh?res.data.Data:_this.addGoods(goodsListData,res.data.Data),
            total: res.data.Total
          })
        }else{
          _this.setData({
            onloadHidden: true,
            goodsList: fresh?res.data.Data:_this.addGoods(goodsListData,res.data.Data),
            total: res.data.Total
          })
        }
        console.log(_this.data.goodsList)
      }
    })
    .then(function(){
       console.log("loading complete")
      _this.setData({
        finishloading:true,
        hiddenloading: true,
        canLoadMore: true
      })
      wx.hideNavigationBarLoading()
      _this.setData({
        canFresh: true
      }) 
      if(_this.data.searchValue&&_this.data.total<=10){
        if(_this.data.total==0){
          _this.setData({
            hiddenLoading:true, 
            hiddenNoGoods:false
          })
        }else{
          _this.setData({
            hiddenLoading:true, 
            hiddenNoGoods:true
          })
        }
        
        return
      }else if(_this.data.total<=10&&_this.data.total>0){
        _this.setData({
          hiddenLoading:true, 
          hiddenNoGoods:true
        })
        return
      }else if(_this.data.total>10){
        _this.setData({
          hiddenLoading:false, 
          hiddenNoGoods:true
        })
      }
    })
  },
  /*
  Field=F_ShelfTime=上架时间
  Field=F_SalesVolume=销量
  Field=F_Price=价钱
  Direction=ASC=升序
  Direction=DESC=降序
   */
  sortByKey: function(e){
    var key = e.target.dataset.name
    if(key == "价格" && this.data.priceStatus == '降序'){
      this.setData({
        sortkeyVal: key,
        sortkeyOBJ: {
          'Field':'F_Price',
          'Direction':'ASC' 
        },
        priceStatus: '升序'
      })
    } else if( key == "价格"){
      this.setData({
        sortkeyVal: key,
        sortkeyOBJ: {
          'Field':'F_Price',
          'Direction':'DESC' 
        },
        priceStatus: '降序'
      })
    } else if(key == "销量"){
      this.setData({
        sortkeyVal: key,
        sortkeyOBJ: {
          'Field':'F_SalesVolume',
          'Direction':'DESC' 
        },
        priceStatus: '降序'
      })
    }else if( key == "新品"){
      this.setData({
        sortkeyVal: key,
        sortkeyOBJ: {
          'Field':'F_ShelfTime',
          'Direction':'DESC' 
        },
        priceStatus: '降序'
      })
    }else{
      debugger
      this.setData({
        sortkeyVal: key,
        sortkeyOBJ: null,
        priceStatus: '降序'
      })
    }
    this.freshData(this.data.sortkeyOBJ)
  },
  /*add data function*/
  addGoods: function(goodsList,resData){//拼接商品列表
    var length = goodsList.length
    for(let i = 0;i<resData.length;i++){
      goodsList[i+length] = resData[i]
    }
    return goodsList
  },
  /*goto detail of goods*/
  toDetail: function(e){//跳转到商品详情
    if(this.data.finishloading){
      wx.navigateTo({//需要携带参数index和catename,index是商品ID（五位数），catename是商品类别，主要区分梵豆商品，拼团商品
        url:"./detail/detail?index="+e.currentTarget.dataset.text + "&catename=" + e.currentTarget.dataset.catename //get the index of goods which user tapped on
      })
    }
  },
  trim: function(s){//去前后空格
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },
  tips: function(){
    wx.showToast({
      title: '功能正在开发中',
      duration: 2000
    })
  },

})

