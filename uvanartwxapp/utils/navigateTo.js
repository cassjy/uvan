function navigateTo(_this, url) {
  _this.setData({
    onOff: true
  })
  wx.navigateTo({
    url: url,
    success: function () {
    },
    complete: function () {
      setTimeout(function () {
        _this.setData({
          onOff: false
        })
      }, 1500);
    }
  })
}
module.exports = {
  navigateTo: navigateTo
}
