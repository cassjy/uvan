var api = require("../../utils/API/request.js")

export const GetBannersTop = () => {
  let data = {
    "data": "顶部轮播图"
  }
  return api.get('/lr/s2bapi/GetBanners', data)
}