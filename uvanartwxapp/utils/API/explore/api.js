var api = require("../request.js")

// 商品分类列表
export const getproductcategories = (data)=>{
  return api.get('/lr/s2bapi/getproductcategories',data)
}

// 风格列表
export const getproductstyles = (data) => {
  return api.get('/lr/s2bapi/getproductstyles', data)
}

// 检查token
export const checktoken = (checktokendata, checktokenheader, token) => {
  return api.get('/api/user/checktoken', checktokendata, checktokenheader, token)
}

// 微信登录
export const login = (data, header)=>{
  return api.post('/api/user/login', data, header)
}

//获取openid
export const GetMyOpenid = (data)=>{
	return api.post('/api/user/getmyopenid',data)
}