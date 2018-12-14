<template>
    <div class="guesswrapper">
        <div class="actpic" v-for="(pic,index) in picArr" :key="index">
            <img :src="pic" alt="">
        </div>
        <div class="achievement">
            <input type="text" name="" id="" placeholder="输入竞猜尾数(4位)" v-model="achievement">
        </div>
        <div class="submit" @click="submit">
        </div>
    </div>
</template>

<script>
import { Loading } from 'vux'
import { mapGetters } from 'vuex'
export default {
        name:"actGuess",
        data(){
            return{
                picArr:[
                    "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/7c72f48ffdf6416983e0103d252425c0",
                    "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/d2365478b6bd4d849faff6ed28849be4",
                    "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/9a1e24d4edb64d94aa4339a54de08ad4",
                    "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/3346738b47f44895adf0a9cf908659ec",
                    "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/dc24616e533f401a9239dddccde69ea4",
                    "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/28b0e0f5576549bc90cfc8907817f818",
                    "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/95769a2964d248d98be7bbb3a920cdcf"
                ],
                achievement:"",
                flag:true,//true代表不能填写
                
            };
        },
        beforeRouteUpdate(to,from,next){
            this.$vux.loading.show({
                text: '正在加载'
            })
            this.init();
            next()
        },
        created(){
            this.$vux.loading.show({
                text: '正在加载'
            })
            this.init();
        },
        computed: {
            ...mapGetters(["user","token"])
        },
        methods:{
            //提交业绩
            submit:function(){
                var mes=this.check();
                if(this.flag){
                    this.$vux.toast.show({
                        text: "该活动已结束，感谢参与。",
                        type: "warn",
                        width: "15em",
                        time: 1000
                    });
                    return;
                }
                if(mes.check){
                    this.$vux.toast.show({
                        text: mes.tip,
                        type: "warn",
                        width: "15em",
                        time: 1000
                    });
                }else{
                    //提交业绩接口
                    var data={
                        userId:this.user.userid,
                        achievement:this.achievement
                    }
                    this.$api.get("/guessing/updateAchievement",data).then(res=>{
                        console.log(res);
                        if(res.code == 200){
                            this.$router.push({name: "explore"});
                        }else{
                            this.$vux.toast.show({
                                text: res.msg,
                                type: "warn",
                                width: "15em",
                                time: 1000
                            });
                        }
                    })
                }
            },
            //初始化显示之前填写的金额
            init:function(){
                var data={
                    userId:this.user.userid
                };
                this.$api.get("/guessing/getAchievement",data).then(res=>{
                    console.log(res);
                    this.flag=res.data.flag;
                    this.achievement = res.data.achievement;
                    this.$vux.loading.hide();
                })
            },
            //校验
            check:function(){
                var mes={
                    "check":false,
                    "tip":""
                }
                if(this.achievement.length!=4){
                    mes.check =true;mes.tip="请输入竞猜尾数(4位)";return mes
                }
                else{return mes}
            } 
        }
    }
    // export default {
    //     name:"actGuess",
    //     data(){
    //         return{
    //             picArr:[
    //                 "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/7c72f48ffdf6416983e0103d252425c0",
    //                 "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/d2365478b6bd4d849faff6ed28849be4",
    //                 "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/9a1e24d4edb64d94aa4339a54de08ad4",
    //                 "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/3346738b47f44895adf0a9cf908659ec",
    //                 "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/dc24616e533f401a9239dddccde69ea4",
    //                 "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/28b0e0f5576549bc90cfc8907817f818",
    //                 "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/95769a2964d248d98be7bbb3a920cdcf"
    //             ],
    //             achievementShow:"",
    //             achievementSubmit:"",
    //             flag:true,//true代表不能填写
                
    //         };
    //     },
    //     beforeRouteUpdate(to,from,next){
    //         var _this = this;
    //         _this.$vux.loading.show({
    //             text: '正在加载'
    //         })
    //         let time = setInterval(()=>{
    //         console.log(_this.user);
    //         console.log(_this.token);
    //         if(_this.token!=123  && _this.token){
    //             _this.init();
    //             clearInterval(time)
    //         }
    //         },500)
    //         next()
    //     },
    //     created(){
    //     },
    //     computed: {
    //         ...mapGetters(["user","token"])
    //     },
    //     methods:{
    //         //提交业绩
    //         submit:function(){
    //             var mes=this.check();
    //             if(this.flag){
    //                 this.$vux.toast.show({
    //                     text: "该活动已结束，感谢参与。",
    //                     type: "warn",
    //                     width: "15em",
    //                     time: 1000
    //                 });
    //                 return;
    //             }
    //             if(mes.check){
    //                 this.$vux.toast.show({
    //                     text: mes.tip,
    //                     type: "warn",
    //                     width: "15em",
    //                     time: 1000
    //                 });
    //             }else{
    //                 //提交业绩接口
    //                 var data={
    //                     userId:this.user.userid,
    //                     achievement:this.achievementSubmit
    //                 }
    //                 this.$api.get("/guessing/updateAchievement",data).then(res=>{
    //                     console.log(res);
    //                     if(res.code == 200){
    //                         this.$router.push({name: "explore"});
    //                     }else{
    //                         this.$vux.toast.show({
    //                             text: res.msg,
    //                             type: "warn",
    //                             width: "15em",
    //                             time: 1000
    //                         });
    //                     }
    //                 })
    //             }
    //         },
    //         //初始化显示之前填写的金额
    //         init:function(){
    //             var data={
    //                 userId:this.user.userid
    //             };
    //             this.$api.get("/guessing/getAchievement",data).then(res=>{
    //                 console.log(res);
    //                 this.flag=res.data.flag;
    //                 this.achievementSubmit = res.data.achievement;
    //                 this.achievementShow = this.comdify(res.data.achievement);
    //                 this.$vux.loading.hide();
    //             })
    //         },
    //         //校验
    //         check:function(){
    //             var mes={
    //                 "check":false,
    //                 "tip":""
    //             }
    //             var reg1 =/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;//是否为正的浮点数
    //             var reg2=/^\d+(\.\d{1,2})?$/;//小数点后不能超过两位
    //             if(this.achievementSubmit==""){mes.check =true;mes.tip="业绩不能为空";return mes}
    //             else if(!reg1.test(this.achievementSubmit)){
    //                 mes.check =true;mes.tip="请输入正确的业绩";return mes
    //             }
    //             else if(!reg2.test(this.achievementSubmit)){
    //                 mes.check =true;mes.tip="小数点后不能超过两位";return mes
    //             }
    //             else if(this.achievementSubmit.length>16){
    //                 mes.check =true;mes.tip="竞猜业绩长度过长";return mes
    //             }
    //             else{return mes}
    //         },
    //         //更新数字格式
    //         updateCount:function(e){
    //             debugger;
    //             e.target.value = e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    //             e.target.value = e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
    //             e.target.value = e.target.value.replace(/\.{2,}/g,".");//只有一个.
    //             this.achievementSubmit =this.delcommafy(e.target.value);
    //             this.achievementShow = this.comdify(this.achievementSubmit);
    //         },
    //         //千分符转化 
    //         comdify(n) { 
    //             let re = /\d{1,3}(?=(\d{3})+$)/g; 
    //             let n1 = n.replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) { 
    //             return s1.replace(re, "$&,") + s2; 
    //             }); 
    //             return n1; 
    //         },
    //         //将千分符格式的金额数字转化成普通格式的数字 
    //         delcommafy(num){//去除千分位中的"，" 
    //             num = num.toString(); 
    //             num = num.replace(/,/gi, ''); 
    //             return num; 
    //         }, 


    //     }
    // }
</script>

<style lang="less" scoped>
@import "~common/css/defult.less";
.guesswrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  z-index: 10;
  overflow: scroll;
  .actpic {
    width: 100vw;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.achievement {
  position: absolute;
  top: 2652 / @rem;
  left: 140 / @rem;
  z-index: 11;
  background-color: #efefef;
  input {
    width: 447 / @rem;
    height: 70 / @rem;
    background-color: #efefef;
    border: 1 / @rem #aaa solid;
    padding-left: 8 / @rem;
    line-height: 70 / @rem;
    font-size: 28 / @rem;
    color: #aaa;
  }
}
.submit {
  position: absolute;
  top: 2822 / @rem;
  left: 256 / @rem;
  width: 235 / @rem;
  height: 208 / @rem;
  //   border: 1 / @rem #a8a8a8 solid;
}
</style>