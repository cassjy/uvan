<template>
  <div class="followwrapper">
    <div class="follow">
      <div class="follow-header">送
        <span class="follow-name">{{name}}</span>1梵钻<img class="follow-img" src="../../../../common/images/hall/钻石.png" /></div>
      <textarea class="follow-text" placeholder="一赞赋能+1" v-model="followContent"></textarea>
      <div class="follow-btn" @click="follow">发布</div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import { mapGetters } from 'vuex'
export default {
  data(){
    return {
      fullHeight: document.documentElement.clientHeight,
      followContent: '',
      name: '',
      canFollow: true
    }
  },
  components:{

  },
  created(){
    this.name = this.$route.params.name
  },
  mounted(){
    // this.$nextTick(() => {
    //   this.hallwrapper = new BScroll(this.$refs.hallwrapper, { mouseWheel: true, click: true, tap: true })
    // })
    // const that = this
    // window.onresize = () => {
    //   return (() => {
    //     window.fullHeight = document.documentElement.clientHeight
    //     that.fullHeight = window.fullHeight
    //   })()
    // }
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    // fullHeight(val) {
    //   if (!this.timer) {
    //     this.fullHeight = val
    //     this.timer = true
    //     setTimeout(()=> {
    //       this.timer = false
    //     }, 400)
    //   }
    // }
  },
  methods:{
    follow(){
      if(!this.canFollow){
        return
      }
      this.canFollow = false
      if(this.followContent==''){
        this.followContent = '一赞赋能+1'
      }
      let url = '/appreciation/fzAppreciationRecord/saveFollow'
      let data = {
              "recordCode": this.$route.params.id,
              // "presenterId": "manager9586",//jack的id
              "presenterId": this.user.userid,
              "coinNumber": 1,
              "content": this.followContent
            }
      this.$api.post(url,data,'application/json')
      .then(res=>{
        // console.log(res)
        this.followContent = ''
        if(res.code==900){
          this.$vux.toast.show({
            text: res.msg,
            type: "warn",
            width: "15em",
            time: 1000
          });
          setTimeout(()=>{
            this.$router.go(-1)
          },1000)
        }

        if(res.code==200){
          this.$vux.toast.show({
            text: "跟赞成功",
            type: "success",
            width: "10em",
            time: 1000
          });
          setTimeout(()=>{
            this.$router.go(-1)
          },1000)
        }else{
          this.$vux.toast.show({
            text: res.msg,
            type: "text",
            width: "20em",
            time: 1000
          });
          setTimeout(()=>{
            this.$router.go(-1)
          },1000)
        }
        
        
      })
    }
  }
}

</script>
	
<style lang="less" scoped>
@import "~common/css/defult.less";
* {
  box-sizing: border-box;
}
.followwrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 110;
  background-color: #f5f5f5;
  .follow {
    .follow-header {
      width: 100%;
      height: 84 / @rem;
      padding-left: 20 / @rem;
      line-height: 84 / @rem;
      font-size: 28 / @rem;
      color: #aaaaaa;
      .follow-name {
        display: inline-block;
        color: #222222;
        margin-left: 5 / @rem;
        margin-right: 5 / @rem;
      }
      .follow-img {
        width: 38 / @rem;
        height: 38 / @rem;
        margin-left: 10 / @rem;
      }
    }
    .follow-text {
      background-color: #fff;
      width: 100%;
      height: 340 / @rem;
      border: none;
      padding: 20 / @rem 20 / @rem;
      font-size: 28 / @rem;
      color: #222;
    }
    .follow-text:focus {
      outline: none;
    }
    .follow-text::-webkit-input-placeholder {
      color: #919191;
    }
    .follow-text::-moz-placeholder {
      color: #919191;
    }
    .follow-text::-ms-input-placeholder {
      color: #919191;
    }
    .follow-btn {
      width: 670 / @rem;
      height: 90 / @rem;
      background-color: #424242;
      text-align: center;
      line-height: 90 / @rem;
      margin: 50 / @rem auto;
      font-size: 34 / @rem;
      color: #fff;
      border-radius: 50px;
    }
  }
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  font-size: 28/@rem;
  color: #888;
}

input:-moz-input-placeholder,
textarea:-moz-input-placeholder {
  font-size: 28/@rem;
  color: #888;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  font-size: 28/@rem;
  color: #888;
}
</style>
