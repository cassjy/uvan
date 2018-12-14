var api = require("../request.js")

export const checktoken = (data,header,token) => {
  return api.get('/api/user/checktoken', data,header,token)
}

export const login = (data,header) => {
  return api.post('/api/user/login', data,header)
}

export const scancustomqrcode = (data) => {
  return api.post('/lr/s2bapi/scancustomqrcode', data)
}
//获取openid
export const GetMyOpenid = (data)=>{
	return api.post('/api/user/getmyopenid',data)
}