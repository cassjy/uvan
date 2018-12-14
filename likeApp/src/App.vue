<template>
  <div id="app">
    <!-- <my-header :message="message"></my-header> -->
    <router-view :class="{'routerView':!isSHowTab}" ref="rout"></router-view>
    <!-- v-if="isRouterAlive" -->
    <!-- <lg-preview></lg-preview> -->
    <tab v-if="!isSHowTab"></tab>
  </div>
</template>

<script>
import Tab from "components/tab/tab";
import Header from "components/public/header/header";
import { mapMutations } from "vuex";
import {getuuid} from 'common/js/common.js'
import { join } from 'path';
import {chromeLogin, checkenv} from 'api/dingenv.js'
import { URL } from "api/url"

export default {
  name: "App",
  provide(){
    return{
      reload:this.reload
    }
  },
  data() {
    return {
      isRouterAlive:true,
    };
  },
  beforeCreate(){
    //重新请求服务器文件，不访问缓存
    if(window.localStorage.getItem('updateTime')==null||window.localStorage.getItem('updateTime')==''||window.localStorage.getItem('updateTime')!=URL.updateTime){
      debugger
      window.location.reload(true)
      window.localStorage.setItem('updateTime',URL.updateTime)
    }
  },
  created(){
    debugger;
    var _this  = this;
    if((!(dd.version || DingTalkPC.ua.isDesktop))&&URL.env=='mobile'){
       this.$router.push({name: "tip",});
    }
    //因webpack热加载的问题，chrome登录不能写在公用组件部分 
    var env =checkenv();
    if(env =="chrome"){
      this.chromeLogin()
    }
    window.addEventListener("message", function(data) {
      // if (ev.source !== window.parent) {return;}
      debugger;
      // if (data.source != window.parent) return;
      console.log(data.data.code);
      // console.log(store.getters.code);
      var code = data.data.code;
      if(data.data.code){
          _this.$store.commit("SET_CODE",code );
      }
    });
  },
  components: {
    tab: Tab
  },
  computed: {
    isSHowTab() {
      // return this.$store.getters.showTab
      return this.$route.meta.showtab;
    },
    message() {
      return this.$route.meta.title;
    },

  },
  methods:{
      chromeLogin:function(){
        // console.log("进入chromelogin");
        // var _this =this;
        // var code = "0957668172d93ff09cbb34bcd22b9455";
        // var data = {
        //   ddCode: code
        // };
        // debugger;
        // _this.$api.post("fzLogin/fzLogin", data).then(res => {
        //   console.log(JSON.stringify(res));
        //   var user = {
        //     userid: res.data.userid,
        //     name: res.data.name,
        //     code: data.code,
        //     avatar: res.data.avatar,
        //     department: res.data.dingDepartmentList
        //       ? res.data.dingDepartmentList[0].name
        //       : "IT开发部",
        //     phone: res.data.mobile
        //   };
        //   debugger;
        //   _this.$store.commit("SET_TOKEN", res.data.uvan_token);
        //   _this.$store.commit("setUser", user);
        //   _this.$store.commit("setDingDingUser", res.data);
        // });
      }

  }
};
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";
#app {
  // overflow: hidden;
  height: 100vh;
  background-color: #fff;
  border-top: 1 / @rem #f2f2f2 solid;
}
.routerView {
  height: 100%;
}
</style>
