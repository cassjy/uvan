var api = require("../request.js")

export const GetNearbyStores = (data) => {
  return api.get('/s2b/physicalstore/GetNearbyStores', data)
}

export const getmyvanbeannum = (data) => {
  return api.get('/lr/s2bapi/getmyvanbeannum', data)
}

export const designgold = (data) => {
  return api.post('/lr/s2bapi/designgold', data)
}

export const MeetConditionsCoupons = (data,header) => {
  return api.post('/s2b/temactpi/MeetConditionsCoupons', data,header)
}

export const CalcuDiscount = (data,header) => {
  return api.post('/s2b/temactpi/CalcuDiscount', data,header)
}

export const Buy = (data,header) => {
  return api.post('/s2b/groupbuy/Buy', data,header)
}

export const PaySuccess = (data,header) => {
  return api.post('/s2b/groupbuy/PaySuccess', data,header)
}