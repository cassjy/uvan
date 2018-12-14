var api = require("../request.js")

export const GetNewSearchHistory = (data) => {
  return api.get('/lr/s2bapi/GetNewSearchHistory', data)
}

export const CreateSearchHistory = (data,header) => {
  return api.post('/lr/s2bapi/CreateSearchHistory', data ,header)
}

export const DeleteSearchHistory = (data) => {
  return api.get('/lr/s2bapi/DeleteSearchHistory', data)
}