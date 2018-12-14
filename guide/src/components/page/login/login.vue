<template>
  <div class="loginPage" :style="{height: fullHeight+'px'}">
    <div class="header"></div>
    <div class="logo"><img src="~common/images/logo/logo-brand.png" alt="logo"></div>
    <div class="form">
      <input type="text" name="loginCode" id="loginCode" v-model="loginCode" placeholder="请输入账号" />
      <input type="password" name="passWord" id="passWord" v-model="passWord" placeholder="请输入密码">
    </div>
    <div class="button" @click="login">登录</div>
    <div class="autologin">
      <span class="click" @click="autologin=!autologin">
        <i class="iconfont" :class="{'icon-gou6':autologin}"> </i>
      </span>
      <span class="clickword">是否自动登录</span>
    </div>
    <div class="footer" v-show="hidshow">优梵信息管理平台客户端V1.0</div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { Toast } from "vux";
export default {
  name: "login",
  data() {
    return {
      fullHeight: document.documentElement.clientHeight,
      loginCode: "",
      passWord: "",
      docmHeight: document.documentElement.clientHeight, //默认屏幕高度
      showHeight: document.documentElement.clientHeight, //实时屏幕高度
      hidshow: true,
      autologin: true //自动登录
    };
  },
  mounted() {
    // window.onresize监听页面高度的变化
    window.onresize = () => {
      return (() => {
        this.showHeight = document.body.clientHeight;
      })();
    };
  },
  methods: {
    login() {
      var _this = this;
      let check = this.check();
      if (!check) {
      } else {
        let url = "/guide/login";
        let data = {
          loginCode: this.loginCode,
          passWord: this.passWord
        };
        this.$api
          .post(url, data)
          .then(res => {
            // if(res.code==200){
            //     console.log(res);
            // }else{
            //     console.log(res.code)
            // }
            //暂时
            console.log(res);
            if (res.code == 200) {
              var sid = res.data.sessionid;
              var usercode = res.data.user.userCode;
              var username = res.data.user.userName;
              // this.newCreateTime(sid)
              this.$store.commit("SET_SID", sid);
              this.$store.commit("SET_USERCODE", usercode);
              this.$store.commit("SET_USERNAME", username);

              this.$storage.setItem("usercode", usercode);
              this.$storage.setItem("sid", sid);
              this.$storage.setItem("password", _this.passWord);
              this.$storage.setItem("logincode", _this.loginCode);
              this.$storage.setItem("username", username);
              debugger;
              _this.autologin
                ? this.$storage.setItem("autologin", true)
                : this.$storage.setItem("autologin", false);
              this.$router.push({ path: "/reception" });
            } else if (res.code == 403) {
              this.$vux.toast.show({
                type: "warn",
                text: res.msg,
                width: "20em",
                position: "middle"
              });
            } else {
              debugger;
              this.$vux.toast.show({
                type: "warn",
                text: res.msg,
                width: "20em",
                position: "middle"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 获取活动列表最新事件与本地缓存时间做对比
    // newCreateTime(sid){
    //   let url = "a/guide/guideActivity/newCreateTime?__sid="+sid
    //   this.$api.get(url).then(res=>{
    //     console.log(res)
    //      if(window.localStorage.getItem('createTime')==res.data){
    //        console.log('匹配成功')
    //        window.localStorage.setItem('hasNewInformation','false')
    //      }else{
    //        console.log('失败')
    //       window.localStorage.setItem('hasNewInformation','true') 
    //      }
    //   })
    // },
    check() {
      if (this.loginCode == "") {
        this.$vux.toast.show({
          type: "warn",
          text: "用户名不能为空",
          width: "14em",
          position: "middle"
        });
        return false;
      } else if (this.passWord == "") {
        this.$vux.toast.show({
          type: "warn",
          text: "密码不能为空",
          width: "14em",
          position: "middle"
        });
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    showHeight: function() {
      if (this.docmHeight > this.showHeight) {
        debugger;
        this.hidshow = false;
      } else {
        this.hidshow = true;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "~common/css/defult.less";
@import "./login.less";
</style>