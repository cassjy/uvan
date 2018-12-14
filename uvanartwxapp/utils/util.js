const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const shopTologin =()=>{
  wx.navigateTo({
    url: '../mine/twicelogin/twicelogin',
  })
  wx.setStorageSync("formWhere", "shopping")
}
//倒计时还剩下多少时间（时分秒）
const count_down = time =>{
    var second = time;//总的秒数

    // 天数位   
    var day = Math.floor(second / 3600 / 24);
    var dayStr = day.toString();
    if (dayStr.length == 1) dayStr = '0' + dayStr;

    // 小时位   
    // var hr = Math.floor(second / 3600 % 24);
    var hr = Math.floor(second / 3600);  //直接转为小时 没有天 超过1天为24小时以上

    var hrStr = hr.toString();
    if (hrStr.length == 1) hrStr = '0' + hrStr;

    // 分钟位  
    var min = Math.floor(second / 60 % 60);
    var minStr = min.toString();
    if (minStr.length == 1) minStr = '0' + minStr;

    // 秒位  
    var sec = Math.floor(second % 60);
    var secStr = sec.toString();
    if (secStr.length == 1) secStr = '0' + secStr;

    return hrStr + ":" + minStr + ":" + secStr;
}
module.exports = {
  formatTime: formatTime,
  count_down: count_down
}
