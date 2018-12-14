var api = require("../request.js")

// 判断是否蒲公英
export const getdandelioninfo = ()=>{
  let url = '/lr/s2bapi/getdandelioninfo?token=' + wx.getStorageSync('token') + '&loginMark=' + wx.getStorageSync('phone') + '&data=' + wx.getStorageSync('openid') + '';
  return api.get(url)
}

// 顾客操作引导接口
export const getcustomerguidepage = (data, header)=>{
  let token = wx.getStorageSync('token')
  return api.post('/lr/s2bapi/getcustomerguidepage', data, header, token)
}

export const UserFeedback = (data,header)=>{
  return api.post("/lr/s2bapi/UserFeedback", data, header)
}

// 用户注册时间
export const validateusertype = (data) => {
   return api.post('/lr/s2bapi/validateusertype', data)
}

//检测是否拥有子账号

export const GetSubAccountList = (data,header) => {
  return api.post("/s2b/customer/GetSubAccountList", data, header)
}

// 升级蒲公英
export const k3customerinfo = (data) => {
  return api.post("/lr/s2bapi/k3customerinfo", data)
}


// 特权蒲公英
export const PrivilegeLink = (data) => {
  return api.post('/lr/s2bapi/PrivilegeLink', data)
}


export const InvitedQrCode = (data, header) => {
  return api.post('/s2b/qrcode/InvitedQrCode', data, header)
}

// 优惠券列表
export const UserCoupons = (data, header) => {
  return api.post('/s2b/temactpi/UserCoupons', data, header)
}

// 
export const get_lastestauthrecord = (data) => {
  return api.post("/lr/s2bapi/GetLastestAuthRecord", data)
}

// 顾客审核
export const upload_dandelionproof = (data) => {
  return api.post("/lr/s2bapi/UploadDandelionProof", data, "application/json")
}

// 蒲公英订单
export const GetDandelionOrder = (data) => {
  return api.post('/lr/s2bapi/GetDandelionOrder', data, 'application/json')
}

// // 访问记录
// export const GetWxOpenId = (data) =>{
//   return api.post("/api/user/getmyopenid", data, 'application/json');
// }

// 
export const validateusertype2 = (data)=>{
  return api.post("/lr/s2bapi/validateusertype", data)
}

// 
export const BecomeDandelion = (data,header) => {
  return api.post('/lr/s2bapi/BecomeDandelion', data,header)
}

// 删除足迹接口
export const DeleteProductBrowsingRecord = (data, header) => {
  return api.post('/lr/s2bapi/DeleteProductBrowsingRecord', data, header)
}

// 浏览足迹列表
export const GetProductBrowsingRecord = () => {
  let recordUrl = '/lr/s2bapi/GetProductBrowsingRecord?token=' + wx.getStorageSync('token') + '&loginMark=' + wx.getStorageSync('phone');
  return api.get(recordUrl)
}

// 
export const GetUserIncomeProfit = (data) => {
  return api.get('/s2b/incomecash/GetUserIncomeProfit', data)
}

// 
export const GetDandelionEarnings = (data) => {
  return api.get('/lr/s2bapi/GetDandelionEarnings', data)
}

//
export const GetUserIncomeBalance = (data) => {
  return api.get('/s2b/incomecash/GetUserIncomeBalance', data)
}

// 检查提现是否重复申请
export const GetUserIncomeStatus = (data) => {
  return api.get('/s2b/incomecash/GetUserIncomeStatus', data, 'application/json')
}

// 提现到支付宝
export const GetNewIncomeCashRecord = (data) => {
  return api.post('/lr/s2bapi/GetNewIncomeCashRecord', data, 'application/json')
}

// 提现列表
export const GetIncomeCashRecord = (data) => {
  return api.post('/lr/s2bapi/GetIncomeCashRecord', data, 'application/json')
}

// 
export const CreateIncomeCashRecord = (data) => {
  return api.post('/lr/s2bapi/CreateIncomeCashRecord', data, 'application/json')
}

// 
export const validateuser = (data, header) => {
  return api.get('/lr/xcapi/validateuser', data, header)
}

// 
export const GetUserFile = (data) => {
  return api.get('/xc/faceimage/GetUserFile', data)
}

// 
export const GetPushImage = (data, header) => {
  return api.post('/xc/faceimage/GetPushImage', data, header)
}

// 
export const deletes2bimage = (m,data, header) => {
  let url = m == true ? '/lr/xcapi/deletes2bimage' : '/lr/xcapi/restores2bimage'
  return api.post(url, data, header)
}

// 确认收货
export const modifyorderstatus2 = (data) => {
  return api.post('/lr/s2bapi/modifyorderstatus', data)
}

// 发表评价
export const EvaluateOrder = (fid, ratingListID, reasonValue) => {
  let releaseUrl = '/s2b/vanstarorder/EvaluateOrder?token=' + wx.getStorageSync('token') + '&loginMark=' + wx.getStorageSync('phone') + '&id=' + fid + '&reason=' + '【' + ratingListID + '】' + reasonValue
  return api.get(releaseUrl)
}

// 取消订单
export const CancelOrder = (fid, cancelArrayID) => {
  let cancelOrderUrl = '/s2b/vanstarorder/CancelOrder?token=' + wx.getStorageSync('token') + '&loginMark=' + wx.getStorageSync('phone') + '&status=F' + '&id=' + fid + '&reason=' + cancelArrayID
  return api.get(cancelOrderUrl)
}

// 支付
export const designgold = (data) => {
  return api.post('/lr/s2bapi/designgold', data)
}

// 订单列表
export const getorderlist = (data) => {
  return api.post("/lr/s2bapi/getorderlist", data)
}

// 催单
export const orderreminder = (data) => {
  return api.post('/lr/s2bapi/orderreminder', data)
}

// 确认收货
export const modifyorderstatusApi = (data) => {
  return api.post('/lr/s2bapi/modifyorderstatus', data)
}

// 订单详情
export const getorderdetaildata = (data) => {
  return api.post('/lr/s2bapi/getorderdetaildata', data)
}

// 申请售后
export const createaftersalesticket = (data, header) => {
  return api.post('/lr/s2bapi/createaftersalesticket', data, header)
}

// 地址列表
export const getmyaddress = (token, phone, openid) => {
  let url = '/lr/s2bapi/getmyaddress?token=' + token + '&loginMark=' + phone + '&data=' + openid + '';
  return api.get(url)
}

// 删去地址
export const UpdateMyAddress = (data, header) => {
  return api.post('/lr/s2bapi/UpdateMyAddress ', data, header)
}

// 保存地址
export const savemyaddress = (data, header) => {
  return api.post("/lr/s2bapi/savemyaddress", data, header)
}

// 修改头像
export const AddCustomerFormID = (data) => {
  return api.post("/s2b/customer/AddCustomerFormID", data)
}


// 触发获取梵豆
export const PersonalInfoSendVanBean = (key) => {
  let recordUrl = '/s2b/vanbean/PersonalInfoSendVanBean?token=' + wx.getStorageSync('token') + "&loginMark=" + wx.getStorageSync('phone') + '&data=' + key;
  return api.get(recordUrl)
}

//
export const oldcustomergetvanbean = (data) => {
  return api.get('/lr/s2bapi/oldcustomergetvanbean', data)
}

// 保存信息
export const savepersonaldata = (data,header) => {
  return api.post("/lr/s2bapi/savepersonaldata", data, header)
}

// 
export const getpersonaldata = (data, header) => {
  return api.post("/lr/s2bapi/getpersonaldata", data, header)
}

// 
export const getpersonalmultipledata = (data, header) => {
  return api.post("/lr/s2bapi/getpersonalmultipledata", data, header)
}

// 获取短信验证码
export const getcode = (data, header, token) => {
  return api.get('/api/sms/getcode', data, header, token)
}

// 
export const UvanStarChangePhone = (data) => {
  return api.post('/lr/adms/UvanStarChangePhone', data)
}

// 登录
export const uvanstarlogin2 = (data) => {
  return api.post(" /lr/adms/uvanstarlogin2", data)
}

// 
export const UpgradePhone = (data, header, token) => {
  return api.post('/api/user/UpgradePhone', data, header, token)
}

//分享记录
export const GetInviteShareRecord = (data) => {
  return api.post('/lr/s2bapi/GetInviteShareRecord', data)
}

// 判断邀请函是否打开
export const CheckInvitationStatus = (data) => {
  return api.post('/lr/s2bapi/CheckInvitationStatus', data) 
}

// 
export const wxdecryptdata = (data) => {
  return api.post("/lr/uvanapi/wxdecryptdata", data)
}


// 传播记录
export const getsharerecords = (data,header) => {
  return api.post("/lr/s2bapi/getsharerecords", data, header)
}

// 
export const GetMyChangedUvanStars = (data, header) => {
  return api.post("/lr/s2bapi/GetMyChangedUvanStars", data, header)
}

// 
export const GetDandelionSaleroom = (data, header) => {
  return api.post("/lr/s2bapi/GetDandelionSaleroom", data, header)
}

// 退出登录
export const logout = (data, header, token) => {
  return api.get('/api/user/logout', data, header, token)
}

// 检查token
export const checktoken = (data, header, token) => {
  return api.get('/api/user/checktoken', data, header, token)
}

// 登录
export const login = (data, header) => {
  return api.post("/api/user/login", data, header)
}

//
export const sendverifycode = (data) => {
  return api.post("/lr/uvanapi/sendverifycode", data)
}

//
export const unbindphone = (data, header, token) => {
  return api.post('/api/user/unbindphone', data, header, token)
}

// 签到获取系统时间
export const GetServerTime = () => {
  return api.get('/lr/s2bapi/GetServerTime')
}

// 获取当月签到状况
export const GetVanBeanSignRecordStatus = (data) => {
  return api.post('/lr/s2bapi/GetVanBeanSignRecordStatus', data)
}

// 触发签到
export const InsertVanBeanSignRecord = (data) => {
  return api.post('/lr/s2bapi/InsertVanBeanSignRecord', data)
}

// 触发签到
export const SubAccountGeneralizeReport = (data, header) => {
  return api.post('/s2b/report/SubAccountGeneralizeReport', data, header)
}

// 售后详情
export const GetMyAfterSalesTickets = (data, header) => {
  return api.post('/lr/s2bapi/GetMyAfterSalesTickets', data, header)
}

//
export const getaftersalesdetails = (data) => {
  return api.get('/lr/s2bapi/getaftersalesdetails', data)
}

// 登录
export const uvanstarlogin3 = (data) => {
  return api.post(" /lr/adms/uvanstarlogin3", data)
}


//
export const getuvanstars = (page, count) => {
  let url = '/lr/s2bapi/getuvanstars?page=' + page + '&limit=' + count ;
  return api.get(url)
}

// 姓名备注
export const WriteRemarkName = (data,header) => {
  return api.get('/s2b/customer/WriteRemarkName', data, header)
}

// 发送验证码
export const customerSendVerifyCode = (data, header) => {
  return api.get('/s2b/customer/SendVerifyCode', data, header)
}

// 提交绑定
export const BindSubAccount = (data, header) => {
  return api.get('/s2b/customer/BindSubAccount', data, header)
}

// 验证码检验
export const CheckVerifyCode = (data, header) => {
  return api.get('/s2b/customer/CheckVerifyCode', data, header)
}


// 传播记录数据加载
export const getmydandelions = (data) => {
  return api.get('/lr/s2bapi/getmydandelions', data)
}

//蒲公英列表页新增备注
export const editTeamRemark = (data) => {
  return api.post('/lr/s2bapi/EditTeamRemark', data)
}

// 确认 
export const addpaymentsetting = (data,header) => {
  return api.post('/lr/s2bapi/addpaymentsetting', data, header)
}

// 更新用户头像
export const upgradeinfo = (data, header) => {
  return api.post('/api/user/upgradeinfo', data, header)
}


// 累计收益明细
export const Details = (data)=>{
  return api.get('/s2b/vanbean/Details',data)
}

// 获取蒲公英本月销售额和订单总额
export const getordersamount = (data)=>{
  return api.get('/s2b/orderbelong/getordersamount',data)
}

//获取优梵海报方案
export const GetVanPostList = (data)=>{
  return api.get('/s2b/vanposter/GetVanPostList',data)
}

//优梵海报操作埋点
export const OperationPoint = (data)=>{
  return api.get('/s2b/vanposter/OperationPoint',data)
}