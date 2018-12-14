var common = require("../../utils/common.js")
var api = require("../../utils/API/request.js")
var start = 0
var cateIdStr = ''
var styleIdStr = ''
import { GetBanners, productlist } from "../../utils/API/clearance/api.js";
Page({
	data:{
		goodsList: [],
		canLoadMore: true,
		idArr: [ "0136db50-9356-4aba-8494-27a349f5d312,7cda091e-07ff-4e32-ad01-b2d488e6b447,7c804181-b33b-469d-90a2-ca1f951d44d5,34e42996-d350-4922-9da0-9c3e16c17ea6,715c1954-c7d7-42fb-b2eb-3533d6064272",
						"58b21c32-c6f8-4f54-bee1-43b6cdd1b207,c83f10bf-15a5-48b1-ba59-c92c28205afa,6be3e56d-966a-4949-92c6-83520f5aa2bf,82dc404e-777e-48d3-b809-dea0595a5dd7,30194c9f-14cf-45ec-b41c-82284b91955e,485a149d-aaff-45ca-b276-4df049f0f5b0,103b21d5-1040-48af-9cef-6d92410e3242",
						"f190e114-4cd2-410a-8b74-fec523f73bac,de3713a7-7e03-4b10-82e1-dd001aafc1ae,599a91fa-6e9d-4d64-9604-771a4e651c38,b4fea7ec-a607-4fd4-8cf7-1f7842c103ab,3e1b8a2b-a0e4-487a-871c-62625ccbbf98,62d67b72-4212-41f0-ab57-2586c7d2bea3",
						"bae88b32-324f-467e-b61b-d37e12afd330,e0d06385-d0ce-4ebd-bad6-bd0e0f9794fa"
		],
		tabNum: 0,
		todayDiscountProduct:{},//进入钜惠商品信息
			
	},
  onLoad: function(){
  	start = 0
  	cateIdStr = this.data.idArr[0]
    // cateIdStr = "0136db50-9356-4aba-8494-27a349f5d312"
    this.loadlist(cateIdStr,'',0,true)
    let data = {
    	'data': '今日钜惠专栏'
    }
    GetBanners(data)
    .then(res=>{
    	if(res.code==200){
    		this.setData({
    			todayDiscountProduct: res.data.Data[0]
    		})
    	}
    })
  },
  onReachBottom(){
  	this.loadMore()
  },
	// 进入商品详情
	todetail(e){
		wx.navigateTo({
			url: '../categories/detail/detail?index='+e.currentTarget.dataset.id
		})
	},
	// 加载商品列表
	loadlist(cateIdStr,styleIdStr,start,fresh){
		const _this = this
		wx.showToast({
			title:'加载中',
			icon:'loading',
			duration: 1000
		})
		let listdata = {}
		if(cateIdStr!=''){
			listdata = {
        data: {
          'page': start / 10 + 1,
          'limit': '10',
          'productcategory': cateIdStr,
          'productstyle': '',
          'keywords': '',
          'keyword1': '',
          'isClear': 1}
	    }
		}else if(styleIdStr!=''){
			listdata = {
        data: {
          'page': start / 10 + 1,
          'limit': '10',
          'productcategory': '',
          'productstyle': styleIdStr,
          'keywords': '',
          'keyword1': '',
          'isClear': 1}
	    }
		}
    productlist(listdata)
    .then(res=>{
    	console.log(res)
    	if(res.code==200){
    		this.setData({
    			goodsList:fresh?res.data.Data:this.addGoods(this.data.goodsList,res.data.Data),
    			total: res.data.Total
    		})
    	}
    })
    .then(()=>{
    	this.setData({
    		canLoadMore: true
    	})
    })
	},
	// 加载更多
	loadMore(){
		if(this.data.canLoadMore){
      this.setData({
        canLoadMore: false
      })
      start+=10//累加每次的加载的数量用作计算返回数据的page值
      if(start>=this.data.total){ //处理没有更多商品的情况
      	wx.showToast({
					title:'没有了',
					icon:'success',
					duration: 1000
				})
        return
      }
      if(cateIdStr!=''){
      	this.loadlist(cateIdStr,'',start,false)
      }else{
      	this.loadlist('',styleIdStr,start,false)
      }
    }
	},
	// 拼接列表
	addGoods(goodsList,resData){
    var length = goodsList.length
    for(let i = 0;i<resData.length;i++){
      goodsList[i+length] = resData[i]
    }
    return goodsList
  },
  // 选择列表
  changeList(e){
  	start = 0
  	this.setData({
  		goodsList: [],
  		total: 0,
  		tabNum: e.currentTarget.dataset.index,
  		canLoadMore: true
  	})
  	console.log(this.data.tabNum)
  	cateIdStr = this.data.idArr[e.currentTarget.dataset.index]
  	this.loadlist(cateIdStr,'',0,true)
  }
})