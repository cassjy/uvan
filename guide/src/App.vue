<template>
  <div id="app">
    <my-header :message="message"></my-header>
    <router-view :class="{'routerView':!isSHowTab}" ref="rout"></router-view>
    <tab v-if="isSHowTab"></tab>
  </div>
</template>

<script>
import Tab from "components/tab/tab";
import Header from "components/public/header/header";
import { mapMutations } from "vuex";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    tab: Tab,
    "my-header": Header
  },
  created(){
  },
  computed: {
    isSHowTab() {
      // return this.$store.getters.showTab
      return this.$route.meta.showtab;
    },
    message() {
      return this.$route.meta.title;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";
#app {
  overflow: hidden;
  height: 100vh;
  background-color: #fff;
}
.routerView {
  height: 100%;
}
</style>
