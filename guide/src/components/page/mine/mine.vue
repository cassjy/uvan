<template>
  <div class="page">
    <div class="user">
      <img :src='userIconUrl' class="userIcon" />
      <div class="username">{{username}}</div>
    </div>
    <router-link :to="{name:'myorder'}">
      <div class="myorder">
        <div>我的订单</div>
        <div class="iconfont icon-dingdanguanli"></div>
      </div>
    </router-link>
    <div class="myservice">
      <div>我的售后</div>
      <div class="iconfont icon-shouhou3 "></div>
    </div>
    <div class="exitbutton" @click="quit">退出登录</div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "mine",
  data() {
    return {
      userIconUrl:
        "http://59.38.255.210:8086/content/images/thumbs/0053984_500.jpeg",
      username: this.$store.getters.username
    };
  },
  methods: {
    quit() {
      this.$store.commit("SET_SID", "");
      this.$store.commit("SET_USERCODE", "");
      this.$store.commit("SET_USERNAME", "");

      this.$storage.removeItem("usercode");
      this.$storage.removeItem("sid");
      this.$storage.setItem("autologin", false);
      this.$storage.removeItem("username");
      this.$storage.removeItem("password");
      this.$storage.removeItem("logincode");
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style scoped lang="less">
@import "~common/css/defult.less";
@import "./mine.less";
</style>