var api = require("../request.js")

export const GetFreightByArea = (data,header) => {
  return api.post('/lr/k3api/getfreightbyarea', data, header)
}

export const ValidateUserType = (data) => {
  return api.post('/lr/s2bapi/validateusertype', data)
}

export const ProductDetails2 = (data) => {
  return api.get('/lr/s2bapi/GetProductDetail_2', data)
}

export const GetQrCode = (data,header,token) => {
  return api.get('/lr/s2bapi/getQrCode', data,header,token)
}

export const GetCommonProblemByGoodsID = (data) => {
  return api.get('/lr/s2bapi/GetCommonProblemByGoodsID', data)
}

export const ProductBrowsingRecord = (data,header) => {
  return api.post('/lr/s2bapi/ProductBrowsingRecord', data,header)
}

export const CheckToken = (data,header,token) => {
  return api.get('/api/user/checktoken', data,header,token)
}

export const Login = (data,header) => {
  return api.post('/api/user/login', data,header)
}

export const GetProductRates = (data) => {
  return api.get('/lr/s2bapi/getproductrates', data)
}

//获取openid
export const GetMyOpenid = (data)=>{
	return api.post('/api/user/getmyopenid',data)
}