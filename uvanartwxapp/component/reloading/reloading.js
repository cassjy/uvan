Component({
  properties: {
    comtype:{
      type:String,
      value:"loading"
    }
  },
  data: {
    isShow:true
  },
  methods: {
    //隐藏弹框
    hideToast() {
      console.log("隐藏弹窗");
      this.setData({
        isShow: true
      })
    },
    //展示弹框
    showToast() {
      console.log("显示弹窗");
      this.setData({
        isShow: false
      })
    },
    //展示自定义秒数
    showToastSecond(second=1000){
      this.showToast();
      var _this = this;
      setTimeout(function () {
        _this.hideToast();
      }, second)
    }
  }
})