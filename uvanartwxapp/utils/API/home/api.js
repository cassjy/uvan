var api = require("../request.js")

// 轮播图、客厅、卧室、餐厅
export const GetBannersTop = (data) => {
  return api.get('/lr/s2bapi/GetBanners', data)
}

// 分享记录
// export const GetShareRecord = (data) => {
//   return api.get('/lr/uvanapi/GetWxOpenId', data)
// }

// 阿里云图片上传地址
export const UploadPhotoUrl = {
  url: '/lr/s2bapi/uploadimage'
}

// 创建售后服务工单
export const CreateAfterSalesService = (data, header) => {
  return api.post('/lr/s2bapi/CreateAfterSalesService', data, header)
}

// 售后服务、满意问卷商品列表
export const GetUserBuyGoodsInfo = (data, header) => {
  return api.post('/s2b/k3cloud/GetUserBuyGoodsInfo', data, header)
}

// 满意问卷提交
export const QuestionNaire = (data, header) => {
  return api.post('/lr/s2bapi/QuestionNaire', data, header)
}

// 问卷调查历史列表
export const GetQuestionNaire = (count, page) => {
  let wenJuanUrl = '/lr/s2bapi/GetQuestionNaire?token=' + wx.getStorageSync('token') + '&loginMark=' + wx.getStorageSync('phone') + '&data=' + '{limit:' + count + ',page:' + page + '}';
  return api.get(wenJuanUrl)
}

// 售后服务历史列表
export const GetAfterSalesService = (data, header) => {
  return api.post('/lr/s2bapi/GetAfterSalesService', data, header)
}

// 领劵接口
export const Get_FunClubPrize = (data)=> {
  return api.post('/s2b/temactpi/Get_FunClubPrize', data)
}

// 优惠券详情
export const Get_FunClubPartinfo = (data)=>{
  return api.post('/s2b/temactpi/Get_FunClubPartinfo', data)
}

// 记录邀请

export const GetInviteShareRecord = (data)=>{
  return api.post('/lr/s2bapi/GetInviteShareRecord', data)
}

