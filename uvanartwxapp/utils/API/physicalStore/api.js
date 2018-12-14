var api = require("../request.js")
//
export const GetAllPhysicalStore = (data,header) => {
  return api.get('/lr/s2bapi/GetAllPhysicalStore', data,header)
}

export const GetPhysicalStore = (data,header) => {
  return api.get('/lr/s2bapi/GetPhysicalStore', data,header)
}