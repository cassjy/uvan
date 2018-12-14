<template>
  <div class="mine">
    <loading></loading>
    <div class="header" @click="toPersonalData">
      <div class="headPortrait">
        <img :src="user.avatar" />
      </div>
      <div class="nickName">{{user.name}}</div>
      <div v-if="DEV_mode">登录code</div>
      <div v-if="DEV_mode">{{user.code}}</div>
      <div v-if="DEV_mode">用户id</div>
      <div v-if="DEV_mode">{{user.userid}}</div>
      <div class="company">{{user.department}}</div>
    </div>
    <!-- <div class="mydata">
        <div>
          <i class="icon-wode1-copy iconfont"></i>
          <span>我的资料</span>
        </div>
        <div>
          <i class="icon-more iconfont"></i>
        </div>
      </div> -->
    <!-- <div class="border"></div> -->
    <div class="border"></div>
    <div class="line">
      <div class="item" @click="toPersonalData">
        <div>
          <i class="icon-zengsongjine iconfont"></i>
          <span>可赠送</span>
        </div>
        <div>
          <span class="coin">{{diamondNum}}&nbsp;&nbsp;梵钻</span>
          <i class="icon-more iconfont"></i>
        </div>
      </div>
      <div class="item" @click="toExchange">
        <div>
          <i class="icon-tixian iconfont"></i>
          <span>可兑换</span>
        </div>
        <div>
          <span class="coin">{{convertibleNum}}&nbsp;&nbsp;梵钻</span>
          <i class="icon-more iconfont"></i>
        </div>
      </div>
      <!-- <div class="item">
          <div>
            <i class="icon-hongbao1 iconfont"></i>
            <span>赞币红包</span>
          </div>
          <div>
            <i class="icon-more iconfont"></i>
          </div>
        </div> -->
      <div class="item" v-if="DEV_mode2" @click="toOther">
        <div>
          <i class="icon-jilu1 iconfont"></i>
          <span>清除缓存</span>
        </div>
        <div>
          <i class="icon-more iconfont"></i>
        </div>
      </div>
      <div class="item" v-if="DEV_mode2" @click="updateToken">
        <div>
          <i class="icon-jilu1 iconfont"></i>
          <span>设置token过期</span>
        </div>
        <div>
          <i class="icon-more iconfont"></i>
        </div>
      </div>
    </div>
    <!-- <transition name="fade" mode="out-in"> -->
      <router-view></router-view>
    <!-- </transition> -->
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { mapGetters } from "vuex";
import { Loading } from 'vux'
import { removeCookies } from "api/util.js";
import { URL } from "api/url"

export default {
  data() {
    return {
      diamondNum: 0, //钻石总数量
      convertibleNum:0, //可兑换的钻石数量
      DEV_mode: false,
      DEV_mode2: false
    };
  },
  components: {
    Loading
  },
  created() {
    // console.log(URL.mode)
    if(URL.mode == "dev"){
      this.DEV_mode = true
    }
    if(URL.mode == "dev" || URL.mode == "pre"){
      this.DEV_mode2 = true
    }
    this.$vux.loading.show({
      text: '正在加载'
    })
    debugger;
    this.requireUserPraise();
  },
  mounted() {},
  computed: {
    ...mapGetters(['user']),
  },
  watch: {},
  methods: {
    toPersonalData(){
      this.$router.push({name:'personalData'})
    },
    toExchange(){
      this.$router.push({name:'exchange',params:{diamondNum:this.convertibleNum}})
    },
    // 请求接口获取用户赞数量
    requireUserPraise(){
      let url = 'ding/dingUser/getUserByUserId?userId='+this.user.userid
      this.$api.get(url).then(res=>{
        // console.log(res)
        if(res.code==200){
          this.diamondNum = res.data.outDepartmentGold+res.data.inDepartmentGold;
          this.convertibleNum = res.data.convertibleGold
          this.$vux.loading.hide()
        }else{
          this.$vux.loading.hide()
        } 

      })
      // console.log(url)
    },
    //去页面已清除的空白页
    toOther(){
        //清除缓存
        window.localStorage.clear();
        removeCookies("token");
        //设置token过期
        this.$store.commit("SET_TOKEN", "undefined");
        this.$store.commit("setUser", "");
        // this.$router.push({name:'refreash'});

    },
    updateToken(){
      this.$store.commit("SET_TOKEN", "11111111111");
      alert("设置成功！");
    }
  }
};
</script>
	
<style lang="less" scoped>
@import "~common/css/defult.less";
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.mine {
  color: #484848;
  .header {
    cursor: pointer;
    width: 100%;
    height: 365 / @rem;
    padding: 60 / @rem 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    .headPortrait {
      font-size: 0;
      img {
        width: 150 / @rem;
        height: 150 / @rem;
        border-radius: 100%;
      }
    }
    .nickName {
      color: #222222;
      font-size: 32 / @rem;
      font-weight: bold;
      margin-top: 20 / @rem;
    }
    .company {
      color: #c1c1c1;
      font-size: 24 / @rem;
      margin-top: 13 / @rem;
    }
  }
  .mydata {
    width: 100%;
    height: 120 / @rem;
    padding: 0 40 / @rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26 / @rem;
    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      .icon-wode1-copy {
        color: #71b78b;
        font-size: 42 / @rem;
        margin-right: 25 / @rem;
      }
      .icon-more {
        font-size: 20 / @rem;
      }
    }
  }
  .border {
    width: 100%;
    height: 20 / @rem;
    background-color: #f8f8f8;
  }
  .line {
    padding: 0 40 / @rem;
    .item {
      cursor: pointer;
      width: 100%;
      height: 120 / @rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 26 / @rem;
      border-bottom: 1px solid #eee;
      div {
        color: #484848;
        font-size: 24 / @rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        .coin {
          color: #afafaf;
          font-size: 24 / @rem;
          margin-right: 15 / @rem;
        }
        .icon-zengsongjine {
          color: #666666;
          font-size: 42 / @rem;
          margin-right: 24 / @rem;
        }
        .icon-tixian {
          color: #666666;
          font-size: 42 / @rem;
          margin-right: 25 / @rem;
        }
        .icon-hongbao1 {
          color: #ca4a54;
          font-size: 32 / @rem;
          margin-right: 31 / @rem;
        }
        .icon-jilu1 {
          color: #5e7fb3;
          font-size: 32 / @rem;
          margin-right: 28 / @rem;
        }
        .icon-more {
          font-size: 20 / @rem;
        }
      }
    }
  }
}
</style>
