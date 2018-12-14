// pages/privilege/h5report/h5report.js
//js
import Url from '../../../utils/API/url.js';
const host = Url.host;
const env = (host == 'https://wxapp.uvanart.com')?'test':'online'
Page({
  data: {
    url: ''
  },
  onLoad(){
    try{
      let phone = wx.getStorageSync("phone");
      let token = wx.getStorageSync("token");
      let url = `https://uvanhd.uvanart.com/h5report/index.html?phone=${phone}&token=${token}&env=${env}`;
      console.log(url);
      this.setData({ url: url })
    }catch(e){}
    

  }
})