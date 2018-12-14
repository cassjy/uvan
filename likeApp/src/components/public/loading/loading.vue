<template>
  <div class="wrapper">
    <!-- 页面等待加载动画 -->
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
     
    }
  },
  components:{

  },
  filters:{
   
  },
  created(){
    
  },
  mounted(){
    
  },
  computed: {
    
  },
  watch: {
    
  },
  methods:{
    
  }
}

</script>
	
<style lang="less" scoped>
  @import "~common/css/defult.less";
  *{
    box-sizing: border-box;
  }

  // 加载动画
  .loading{
      width: 120/@rem;
      height: 80/@rem;
      margin: 0 auto;
      margin-top:450/@rem;
      // position: fixed;
      // top: 50%;
      // left: 50%;
      // margin-top: -120/@rem;
      // margin-left: -80/@rem;
  }
  .loading span{
      display: inline-block;
      width: 8px;
      height: 100%;
      border-radius: 4px;
      background: lightgreen;
      animation: load 1s ease infinite;
      -webkit-animation: load 1s ease infinite;
      -moz-animation: load 1s ease infinite;
      -o-animation: load 1s ease infinite;
  }
  @-webkit-keyframes load{
      0%,100%{
          height: 80/@rem;
          background: lightgreen;
      }
      50%{
          height: 140/@rem;
          margin: -30/@rem 0;
          background: lightblue;
      }
  }
  .loading span:nth-child(2){
       animation-delay:0.2s;
      -webkit-animation-delay:0.2s;
      -moz-animation-delay:0.2s;
      -o-animation-delay:0.2s;
  }
  .loading span:nth-child(3){
    animation-delay:0.4s;
      -webkit-animation-delay:0.4s;
      -moz-animation-delay:0.4s;
      -o-animation-delay:0.4s;
  }
  .loading span:nth-child(4){
    animation-delay:0.6s;
      -webkit-animation-delay:0.6s;
      -moz-animation-delay:0.6s;
      -o-animation-delay:0.6s;
  }
  .loading span:nth-child(5){
    animation-delay:0.8s;
      -webkit-animation-delay:0.8s;
      -moz-animation-delay:0.8s;
      -o-animation-delay:0.8s;
  }
</style>
