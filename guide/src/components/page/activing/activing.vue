<template>
  <div
    class="activitiesShow"
    :style="{height: fullHeight-53+'px'}"
    ref="actWrapper"
  >
    <div class="act-wrapper">
      <div
        class="theme"
        v-for="(item,index) in dataList"
        @click="toDetailPage(item.activityCode)"
        :key="index"
      >
        <h2>{{item.activityName}}</h2>
        <p class="date">{{item.createTime}}~{{item.endTime}}</p>
        <div class="theme-photo">
          <img :src="item.bannerImage" />
        </div>
      </div>
    </div>
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { mapGetters } from "vuex";
import { Toast, Loading, Confirm } from "vux";
import bus from '@/common/js/bus.js'
export default {
  data() {
    return {
      fullHeight: document.documentElement.clientHeight,
      options: {
        pullDownRefresh: {
          threshold: 0, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 0 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        closePullDown: {
          threshold: 0, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 0 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        click: true,
        probeType: 3,
        startY: 0,
        bounce: {
          top: false,
          bottom: false,
          left: false,
          right: false
        },
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV|SPAN)$/
        }
      },
      dataList: []
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.actWrapper.enable();
    if (to.name == "actDetail") {
      this.actWrapper.disable();
    }
    next();
  },
  mounted() {
    bus.$emit("haveToSee",'seen')
    this.$nextTick(() => {
      this.initScroll();
    });
    this.$vux.loading.show({
      text: "加载中"
    });
    this.requireListData();
  },
  computed: {
    ...mapGetters(["sid", "usercode", "phone"])
  },
  methods: {
    // 初始化滚动条
    initScroll() {
      if (!this.actWrapper) {
        this.actWrapper = new BScroll(this.$refs.actWrapper, this.options);
      }
    },

    // 请求活动列表数据
    requireListData() {
      let url = "a/guide/guideActivity/queryActivity?__sid=" + this.sid;
      this.$api
        .get(url)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.dataList = res.data;
            if(res.data.length !=0){
              window.localStorage.setItem('createTime',res.data[0].createTime)
            }else{
              window.localStorage.setItem('createTime','')
            }
            console.log(this.dataList);
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "20em"
            });
          }
          this.$vux.loading.hide();
        })
        .catch(err => {
          this.$vux.toast.show({
            text: "系统错误！",
            type: "text",
            width: "20em"
          });
          this.$vux.loading.hide();
        });
    },
    // 详情页
    toDetailPage(code) {
      console.log(code);
      this.$router.push({ name: "actDetail", params: { code: code } });
    }
  }
};
</script>
<style lang="less">
@import "~common/css/defult.less";
.activitiesShow {
  width: 100%;
  height: 100%;
  margin-top: 100 / @rem;
  padding: 0 40 / @rem 100 / @rem;
  box-sizing: border-box;
  overflow: hidden;
  .act-wrapper {
    padding-bottom: 96 / @rem;
  }
  .theme {
    padding-top: 40 / @rem;
    padding-bottom: 60 / @rem;
    border-bottom: 1px solid #eee;
    h2 {
      color: #222222;
      font-size: 34 / @rem;
      font-weight: bold;
      margin-bottom: 18 / @rem;
    }
    p {
      color: #888888;
      font-size: 24 / @rem;
      margin-bottom: 34 / @rem;
    }
    .theme-photo {
      width: 100%;
      height: 375 / @rem;
      font-size: 0;
      img {
        width: 100%;
        height: 375 / @rem;
      }
    }
  }
  .theme:last-child {
    border-bottom: none;
  }
}
</style>

