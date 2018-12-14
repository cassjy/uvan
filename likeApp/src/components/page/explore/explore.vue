<template>
  <div class="wrapper" :style="{height: fullHeight-75+'px'}">
    <!-- <div class="guess" @click="toActGuess">
      <i class="iconfont icon-icon-maozi"></i>
      <div class="word">业绩尾数竞猜</div>
      <div class="achievement">{{achievement}}</div>
      <i class="iconfont icon-jiantou"></i>
    </div> -->
    <div class="border"></div>
    <div class="guess" @click="toPage(1)" v-if="primary!=3">
      <div class="img"><img src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/edbdfa627242416fb36abb05c5c21350" /></div>
      <div class="word">双11心愿激励初选提名</div>
      <div class="achievement"></div>
      <i class="iconfont icon-jiantou"></i>
    </div>
    <div class="guess" @click="toPage(2)" v-if="shortlist ==1||shortlist ==2">
      <div class="img"><img src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/6d1a75baa5124b9f8e068b2b7c45eb18" /></div>
      <div class="word">个人简介录入</div>
      <div class="achievement"></div>
      <i class="iconfont icon-jiantou"></i>
    </div>
    <!-- <div class="guess" @click="toPage(3)" v-if="level !=0">.
      <div class="img"><img src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/acdd1f9a889c44ae93c66ebdfa76453d" /></div>
      <div class="word">复选投票</div>
      <div class="achievement"></div>
      <i class="iconfont icon-jiantou"></i>
    </div> -->
    <div class="guess" @click="toShop()">
      <div class="img"><img src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/7a0c1f0133a8462d854553c4302664be" /></div>
      <div class="word">点滴商城</div>
      <div class="achievement"></div>
      <i class="iconfont icon-jiantou"></i>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { mapGetters } from "vuex";
import { Loading } from "vux";
export default {
  data() {
    return {
      flag: true,
      achievement: "",
      fullHeight: document.documentElement.clientHeight,
      primary: 0, //初选(0未参加初选,1已参加)
      shortlist: 0, //名单(0未入选，1入选未填写，2入选已填写)
      level: 0 //复选(0低于p5级别，1p5级别以上未复选，2p5级别以上已复选)
    };
  },
  components: {},
  beforeRouteUpdate(to, from, next) {
    // 检测用户是否有权限显示
    this.$vux.loading.show({
      text: "加载中..."
    });
    this.qualification();
    next();
  },
  created() {
    // 检测用户是否有权限显示
    this.$vux.loading.show({
      text: "加载中..."
    });
    this.qualification();
  },
  mounted() {},
  computed: {
    ...mapGetters(["user", "token"])
  },
  watch: {},
  methods: {
    goPAGE() {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            /*window.location.href="你的手机版地址";*/
            return true
        }
        else {
            /*window.location.href="你的电脑版地址";    */
            return false
        }
    },
    // 权限检测
    qualification() {
      let url = "wish/wishShortlist/qualification?userId=" + this.user.userid;
      this.$api
        .get(url)
        .then(res => {
          console.log(res);
          this.$vux.loading.hide();
          if (res.code == 200) {
            this.primary = res.data.primary;
            this.shortlist = res.data.shortlist;
            this.level = res.data.level;
          } else {
            console.log("获取权限失败");
          }
        })
        .catch(err => {
          this.$vux.loading.hide();
        });
    },
    //跳转
    toActGuess: function() {
      if (!this.flag) {
        this.$router.push({ name: "actGuess" });
      } else {
        this.$vux.toast.show({
          text: "该活动已结束，感谢参与。",
          type: "warn",
          width: "10em",
          time: 1000
        });
      }
    },

    // 页面跳转
    toPage(id) {
      console.log(id);
      switch (parseInt(id)) {
        case 1:
          if (this.primary == 0) {
            this.$router.push({ name: "primary" });
          } else if (this.primary == 1) {
            this.$router.push({ name: "voteComplete" });
          }
          break;
        case 2:
          if (this.shortlist == 1) {
            this.$router.push({ name: "personalProfile" });
          } else if (this.shortlist == 2) {
            this.$router.push({ name: "completeProfile" });
          }
          break;
        case 3:
          if (this.level == 1) {
            this.$router.push({ name: "check" });
          } else if (this.level == 2) {
            this.$router.push({ name: "checkComplete" });
          }
          break;
      }
    },
    //跳转商城
    toShop(){
      this.$vux.loading.show({
        text: "请求中..."
      });
      let data = {userid:this.user.userid};
      this.$api.get("/fzLogin/fzNeigouLogin", data).then(res => {
        console.log(res);
        this.$vux.loading.hide();
        if(res.returnInfo.code == 200){
          //跳转
          if(this.goPAGE()){
            window.location.href =res.returnInfo.data;
          }else{
            window.open(res.returnInfo.data);
          }
        }else{
          //报错
          this.$vux.toast.show({
            text: res.returnInfo.code==-100? res.returnInfo.msg:'暂无权限进入',
            type: "warn",
            width: "10em",
            time: 1500
          });
        }
      }).catch( err =>{
        this.$vux.loading.hide();
        this.$vux.toast.show({
          text: '请求失败',
          type: "warn",
          width: "10em",
          time: 1000
        });
      });
    },
    //页面初始化
    init: function() {
      var data = {
        userId: this.user.userid
      };
      this.$api.get("/guessing/getAchievement", data).then(res => {
        console.log(res);
        this.flag = res.data.flag;
        this.achievement = res.data.achievement;
        this.$vux.loading.hide();
      });
    }
    //千分符转化
    // comdify(n) {
    //             let re = /\d{1,3}(?=(\d{3})+$)/g;
    //             let n1 = n.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) {
    //             return s1.replace(re, "$&,") + s2;
    //             });
    //             return n1;
    //         },
  }
};
</script>
	
<style lang="less" scoped>
@import "~common/css/defult.less";
.wrapper {
  padding: 0 / @rem 0 100 / @rem;
  background-color: #fff;
}
.border {
  width: 100%;
  height: 22 / @rem;
  background-color: #e9eef2;
}
.guess {
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  height: 140 / @rem;
  width: 690 / @rem;
  padding: 0 30 / @rem;
  background-color: #fff;
  // margin-bottom: 20/@rem;
  border-bottom: 1px solid #eeeeee;
  .img {
    font-size: 0;
    line-height: 140 / @rem;
    margin-right: 20 / @rem;
    img {
      width: 54 / @rem;
      height: 54 / @rem;
      border-radius: 100%;
    }
  }
  .icon-icon-maozi {
    flex: 0 0 50 / @rem;
    font-size: 50 / @rem;
    margin-right: 30 / @rem;
    line-height: 142 / @rem;
    color: brown;
  }
  .word {
    flex: 0 0 570 / @rem;
    font-size: 30 / @rem;
    line-height: 140 / @rem;
  }
  // .achievement {
  //   flex: 0 0 300 / @rem;
  //   font-size: 26 / @rem;
  //   line-height: 140 / @rem;
  //   text-align: right;
  //   margin: 0 8 / @rem 5 / @rem 0;
  // }
  .icon-jiantou {
    flex: 0 0 20 / @rem;
    font-size: 26 / @rem;
    line-height: 140 / @rem;
    color: #666666;
  }
}
</style>
