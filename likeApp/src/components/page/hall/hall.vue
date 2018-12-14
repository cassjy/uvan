<template>
  <div class="hallwrapper">
    <!-- :style="{height: fullHeight-50+'px'}" ref="hallwrapper" -->
    <!-- <div class="loading-win"> -->
    <!-- <loading></loading> -->
    <!-- </div> -->
    <pull-to :top-load-method="refresh" @infinite-scroll="loadmore" :top-config="{triggerText:'释放刷新',loadingText:'刷新中...',doneText:'刷新完成'}" :is-bottom-bounce="!showLoadingend">
      <!-- :bottom-config="{triggerText:'加载更多',doneText:''}" -->
      <!-- <quick-loadmore :top-method="handleTop" ref="vueLoad" 
                      :top-status-change="handleStatusChange" 
                      :bottom-method="handleBottom" 
                      :bottom-status-change="handleBottomStatusChange" 
                      :disable-top="false" :disable-bottom="false"> -->
      <div class="hall" ref="hall">
        <!-- <div style="position: fixed;z-index:100;">
            <div>hallHeight:{{hallHeight}}</div>
            <div>scrollTop:{{scrollTop}}</div>
            <div>scrollHeight:{{scrollHeight}}</div>
          </div> -->
        <!-- <load-more class="loading-refresh" v-if="showRefresh" tip="正在刷新" background-color="#eee"></load-more> -->

        <!-- <v-infinite-scroll class="v-scroll" ref="vScroll" id="vScroll" :offset='0' @bottom="loadmore" :style="{height: fullHeight-50+'px'}" style="overflow-y: scroll;"> -->
        <!-- {{content.praiserName|letterFilter}} -->
        <!-- {{content.presenterName|letterFilter}} -->
        <div class="card" v-for="(content,index) in content" :key="index">
          <div class="card-header">
            <img class="header-img" :src="content.user_img" 
            @click="toPersonalData($event)" 
            :data-id="content.praiserId" :data-department="content.praiserDepartment" :data-name="content.praiserName"/>
            <div class="header-info">
              <div class="header-name">
                <span class="name" @click="toPersonalData($event)" :data-id="content.praiserId" :data-department="content.praiserDepartment" :data-name="content.praiserName">{{content.praiserName}} </span>获得
                <span class="name" @click="toPersonalData($event)" :data-id="content.presenterId" :data-department="content.presenterDepartment" :data-name="content.presenterName"> {{content.presenterName}} </span>的赞赏
              </div>
              <div class="header-time">
                <div class="iconfont icon-new" v-if="((new Date()).getTime()/1000-content.createTime)/60/60<24"></div>
                <div class="time">
                  {{((new Date()).getTime()/1000-content.createTime)/60/60/24>=1?parseInt(((new Date()).getTime()/1000-content.createTime)/60/60/24)+'天前': (((new Date()).getTime()/1000-content.createTime)/60/60>=1?parseInt(((new Date()).getTime()/1000-content.createTime)/60/60)+'小时前': (((new Date()).getTime()/1000-content.createTime)/60>=1?parseInt(((new Date()).getTime()/1000-content.createTime)/60)+'分钟前':'刚刚'))}}
                </div>

                <!-- <div class="iconfont icon-hot1"></div> -->
              </div>
            </div>
          </div>

          <div class="card-content" v-if="content.packup">
            <div style="word-wrap:break-word">{{content.content.length>60?content.content.substr(0,59):content.content}}
              <span v-if="content.content.length>60" :data-index="index" @click="openMore($event)" style="color:#5e7fb3;">...展开</span>
            </div>
            <!-- <span style="word-wrap:break-word">{{content.content.length>60?content.content.substr(0,59):content.content}}</span>
                <span class="content-more" v-if="content.content.length>60">...</span>
                <span class="content-open" v-if="content.content.length>60" @click="openMore($event)" :data-index="index">展开</span> -->
          </div>
          <div class="card-content" style="word-wrap:break-word" v-if="content.content.length>60&&!content.packup">
            {{content.content}}
            <span class="content-open" @click="closeMore($event)" :data-index="index">收起</span>
          </div>
          <div class="card-image" v-if="content.imgList.length!=0">
            <!-- <img class="image" v-preview="img" preview-nav-enable="false" v-for="(img,index) in content.imgList" :src="img" :key="index" v-if="index<3" /> -->
            <img class="image" :preview="content.id" v-for="(img,index) in content.imgList" v-lazy="img" :key="index" v-show="index<3" />

          </div>

          <div class="card-prize">
            <span class="card-prize-num">+{{content.coinCount||content.coinNumber}}</span> 梵钻
            <span class="card-tag">
              # {{content.tag}} #
            </span>
            <div class="card-like card-like1 " v-if="content.praiserId!=myuserid&&myfollowrecord.indexOf(content.appreciationCode)<0">
              <div class="iconfont icon-dianzan" @click="toFollow($event)" :data-id="content.appreciationCode" :data-name="content.praiserName"></div>
              <div class="like" @click="toFollow($event)" :data-id="content.appreciationCode" :data-name="content.praiserName">跟赞</div>
            </div>
            <div class="card-like" v-if="content.praiserId!=myuserid&&myfollowrecord.indexOf(content.appreciationCode)>=0">
              <div class="iconfont icon-zan"></div>
              <div class="like">已赞</div>
            </div>
          </div>

          <div class="card-follow-list" v-if="content.fzAppreciationFollowList.length>0">
            <div class="follow-list" v-for="(item,index) in content.fzAppreciationFollowList">
              <div class="follow-name">{{item.presenterName}}：</div>
              <!-- <div class="follow-content">{{item.content.length>20?item.content.substr(0,16)+'...':item.content}}</div> -->
              <div class="follow-content">{{item.content}}</div>
              <div class="clear-float"></div>
            </div>
          </div>
          <div class="card-line" v-if="index!=total-1" :data-id="index"></div>
          <!-- <div class="card-more" @click="showEdit">
                <div class="iconfont icon-gengduo1"></div>
              </div> -->
          <div class="clear-float"></div>
        </div>
        <load-more class="loading-more" v-if="showLoadingmore" tip="正在加载" background-color="#eee"></load-more>
        <load-more v-if="showLoadingend" :show-loading="false" tip="没有更多了" background-color="#eee"></load-more>

        <!-- </v-infinite-scroll> -->

      </div>
      <!-- </quick-loadmore> -->
    </pull-to>
    <div class="cover" v-if="showCover" @click="hideCover"></div>

    <div :class="['edit-win',showEditWin?'edit-win-show':'']">
      <div class="edit">
        <div class="iconfont icon-bianji"></div>
        <div class="edit-text">编辑</div>
      </div>
      <div class="cancel" @click="hideEditWin">取消</div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import BScroll from 'better-scroll'

import { mapGetters } from 'vuex'
import {letterFilter} from '@/common/js/letterFilter'
import { setInterval, clearInterval } from 'timers';
import { Loading,LoadMore } from 'vux'

import PullTo from 'vue-pull-to'

export default {
  data(){
    return {
      
      // options: {
      //   pullDownRefresh: {
      //     threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
      //     stop: 33 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
      //   },
      //   pullUpLoad: {
      //     threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
      //   },
      //   // pullDownRefresh: false, //关闭下拉
      //   pullDownRefreshObj: {
      //     threshold: 90,
      //     stop: 40
      //   },
      //   // pullUpLoad: false, // 关闭上拉
      //   click: true,
      //   probeType: 3,
      //   startY: 0,
      //   scrollbar: false,
      //   mouseWheel: true, 
      //   click: true, 
      //   tap: true,
      //   // preventDefault: false
      //   preventDefaultException: {
      //     tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV)$/
      //   }
      // },
      fullHeight: document.documentElement.clientHeight,
      showCover: false,
      showEditWin: false,
      content:[],
      pageNo: 1,
      pageSize: 10,
      total:0,
      myfollowrecord: [],
      myuserid: '',
      oldPageNo: 0,
      fromFollow: false,
      fromRefresh: false,
      createLoadMore: false,
      showRefresh: false,
      showLoadingmore: false,
      showLoadingend: false,
      canLoadmore: true,
      hallHeight:0,
      scrollTop: 0,
      scrollHeight:0,
      canToFollow: false,
      fromloadmore: false,
      createTime:'',
      loadFirstTime: false,
      default_img:'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/201891211337557E4A3C58-73D2-4EA0-B66E-9178874CB73F.jpeg'
    }
  },
  components:{
    Loading,
    LoadMore,
    PullTo
  },
  filters:{
    letterFilter
  },
  beforeRouteUpdate(to,from,next){
    // console.log("from:"+from)
    if(from.path=="/hall/follow"){
      // debugger
      // this.$vux.loading.show({
      //   text: '正在加载'
      // })
      // // this.oldPageNo = this.pageNo
      // this.fromFollow = true
      // this.pageNo = 1
      // this.pageSize = this.content.length
      // // this.content = []
      // this.loadLikeData()
      this.getUserFollowRecord()
    }
    next()
  },
  created(){
    var _this = this;
    this.$vux.loading.show({
      text: '正在加载'
    })
    // console.log(this.user);
    this.loadFirstTime = true
    this.loadLikeData()
    this.myuserid = this.user.userid
  },
  mounted(){
    // this.$nextTick(() => {
    //   this.hallwrapper = new BScroll(this.$refs.hallwrapper, this.options)
    //   this.hallwrapper.on("pullingUp", () => {
    //     this.pageNo++
    //     if(this.pageNo * this.pageSize - this.total > 10){
    //       return
    //     }
    //     // this.pageSize+=10
    //     this.loadLikeData()
    //   })

    //   this.hallwrapper.on("pullingDown",()=>{
    //     this.pageNo = 1
    //     this.fromRefresh = true
    //     this.showRefresh = true
    //     this.loadLikeData()
    //   })
    // })

    
    const that = this
    // window.onresize = () => {
    //   return (() => {
    //     window.fullHeight = document.documentElement.clientHeight
    //     that.fullHeight = window.fullHeight
    //   })()
    // }
    
    
    
  },
  computed: {
    ...mapGetters(['user','token'])
  },
  watch: {
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val
        this.timer = true
        setTimeout(()=> {
          this.timer = false
        }, 400)
      }
    }
  },
  methods:{
    handleTop(){
      this.refresh(loaded)
    },
    handleStatusChange(status){

    },
    handleBottomStatusChange(status){

    },
    handleBottom(){
      this.loadmore()
    },
    refresh(loaded){
      // this.showRefresh = true
      this.fromRefresh = true
      this.pageNo = 1
      this.createTime = ''
      this.loadLikeData(loaded)
    },
    loadmore(){
      if(!this.canLoadmore){
        return
      }
      this.canLoadmore = false
      this.showLoadingmore = true
      this.pageNo++
      if(this.pageNo * this.pageSize - this.total >= 10){
        this.showLoadingmore = false
        this.showLoadingend = true
        // this.$refs.vueLoad.onBottomLoaded(false);
        // loaded('done')
        return
      }
      this.fromloadmore = true
      // this.pageSize+=10
      this.loadLikeData()
    },
    toPersonalData(e){
      this.$router.push({
        name:"personalData2",
        params: { 
          id: e.target.dataset.id , 
          department: e.target.dataset.department,
          name: e.target.dataset.name
        }
      })
    },
    //展开隐藏的文本
    openMore(e){
      this.content[e.target.dataset.index].packup = false
    },
    //收起文本
    closeMore(e){
      this.content[e.target.dataset.index].packup = true
    },
    //编辑弹出按钮
    showEdit(){
      this.showEditWin = true
      this.showCover = true
    },
    //隐藏编辑弹出按钮
    hideEditWin(){
      this.showEditWin = false
      this.showCover = false
    },
    //隐藏遮罩层
    hideCover(){
      this.showCover = false
      this.showEditWin = false
    },
    //跟赞
    toFollow(e){
      if(!this.canToFollow){
        return
      }
      this.canToFollow = false
      this.oldPageNo = this.pageNo
      // console.log(e.target.dataset.id)
      this.$router.push({
        name: "follow",
        params: { id: e.target.dataset.id, name: e.target.dataset.name }
      });
    },
    //加载赞赏数据
    loadLikeData(loaded){
      let url = '/appreciation/fzAppreciationRecord/getList?pageNo='+this.pageNo+'&pageSize='+this.pageSize+'&createTime='+this.createTime
      this.$api.get(url)
      .then(res=>{
        this.createLoadMore = true
        this.showLoadingmore = true
        // console.log(res);
        // console.log(res)
        // if(res.code==200){
          if(this.fromFollow){
            this.content = res.data.list
            this.fromFollow = false
            this.pageSize = 10
            this.pageNo = this.oldPageNo
          }else if(this.fromRefresh){
            this.content = res.data.list
            this.createTime = res.data.list[0].createTime
            this.fromRefresh = false
            loaded('done')
            // this.$refs.vueLoad.onTopLoaded();
          }else{
            this.content = this.content.concat(res.data.list)
            // this.$refs.vueLoad.onBottomLoaded();
            if(this.fromloadmore){
              // loaded('done')
              this.fromloadmore = false
            }
            
          }
          if(this.loadFirstTime){
            this.createTime = res.data.list[0].createTime//记录当前加载的第一条数据的时间，用于取从当前时间戳开始的数据，避免在浏览的同时有新数据插入，导致页面数据重复
            this.loadFirstTime = false
          }
          // this.content = res.data.list
          // this.content = this.content.concat(res.list)
          this.total = res.data.count
          if(this.content.length == this.total){
            // this.$refs.vueLoad.onBottomLoaded(false);
            this.showLoadingmore = false
            this.showLoadingend = true
          }
          this.getUserFollowRecord()
          // this.total = res.count
          this.$vux.loading.hide()
          this.$nextTick(() => {
            setTimeout(() => {
              this.canLoadmore = true
              // this.showRefresh = false
              // this.hallHeight = this.$refs.hall.offsetHeight
              // this.pullingDownUp();
              this.$previewRefresh()
            }, 500);
          });
        // }
      })
    },
    //加载用户跟赞记录
    getUserFollowRecord(){
      let url = '/appreciation/fzAppreciationRecord/getFollowListByUserId'
      let query = '?userId='+this.user.userid
      let apiUrl = url+query
      this.$api.get(apiUrl)
      .then(res=>{
        // console.log(res.data)
        this.myfollowrecord = res.data
        this.canToFollow = true
      })
    },
    pullingDownUp() {
      // this.hallwrapper.finishPullUp(); //告诉 better-scroll 数据已加载
      // this.hallwrapper.finishPullDown(); //告诉 better-scroll 数据已加载
      // this.hallwrapper.refresh(); //重新计算元素高度
      // this.showRefresh = false
    }
  }
}

</script>
	
<style lang="less" scoped>
@import "~common/css/defult.less";
* {
  box-sizing: border-box;
}
img {
  object-fit: cover;
}
.hallwrapper {
  // overflow-y: hidden;
  background-color: #fff;
  // background: transparent;
  // overflow: hidden;
  padding-bottom: 100 / @rem;
  border-top: 1px solid #f2f2f2;

  // backface-visibility:hidden;
  // -webkit-backface-visibility: hidden;
  // -moz-backface-visibility:hidden;
  // -ms-backface-visibility:hidden;

  // transform: translate3d(0,0,0);
  // -webkit-transform: translate3d(0,0,0);
  // -moz-transform: translate3d(0,0,0);
  // -ms-transform: translate3d(0,0,0);
  .hall {
    // padding-bottom: 100/@rem;
    // .loadMore{
    //   margin-bottom:0;
    //   height: 0;
    //   transition: height 0.3s;
    // }
    // .loadMore-show{
    //   padding-top: 20/@rem;
    //   height: 66/@rem;
    // }
    .v-scroll {
      position: relative;
      transition: bottom 1s;
    }
    .loading-refresh {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    .loading-more {
      // margin: 0 auto;
      // margin-top: 10/@rem;
      // margin-bottom: 50/@rem;
    }
    .card {
      padding-top: 40 / @rem;
      padding-bottom: 32 / @rem;
      padding-right: 40 / @rem;
      padding-left: 40 / @rem;
      background-color: #fff;
      position: relative;
      overflow: hidden;
      .clear-float {
        clear: both;
      }
      .card-header {
        height: 90 / @rem;
        width: 100%;
        // padding-top: 20 / @rem;
        // padding-bottom: 20 / @rem;
        .header-img {
          width: 80 / @rem;
          height: 80 / @rem;
          // background-color: #000;
          // border: none;
          border-radius: 50%;
          overflow: hidden;
          float: left;
          margin-right: 20 / @rem;
        }
        .header-info {
          .header-name {
            font-size: 28 / @rem;
            line-height: 38 / @rem;
            // margin-bottom: 5 / @rem;
            font-weight: bold;
            color: #aaa;
            .name {
              color: #222;
              font-weight: bold;
              cursor: pointer;
            }
          }
          .header-time {
            // overflow: hidden;
            .time {
              float: left;
              // height: 34 / @rem;
              font-size: 20 / @rem;
              line-height: 34 / @rem;
              margin-right: 10 / @rem;
              color: #aaa;
            }
            .icon-new {
              float: left;
              // height: 34 / @rem;
              font-size: 24 / @rem;
              line-height: 34 / @rem;
              color: #eead00;
              margin-right: 10 / @rem;
            }
            .icon-hot1 {
              float: left;
              // height: 38 / @rem;
              font-size: 28 / @rem;
              line-height: 38 / @rem;
              color: #eb613d;
            }
          }
        }
      }
      .card-content {
        float: right;
        // width: 570 / @rem;
        width: 85%;
        font-size: 26 / @rem;
        line-height: 40 / @rem;
        color: #666;
        margin-bottom: 16 / @rem;
        .content-more {
          color: #888;
        }
        .content-open {
          color: #5e7fb3;
        }
      }
      .card-image {
        // width: 570 / @rem;
        width: 85%;
        height: 160 / @rem;
        margin-bottom: 30 / @rem;
        float: right;
        .image {
          // width: 160 / @rem;
          width: 28%;
          // height: 160 / @rem;
          height: 100%;
          // margin-top: 10/@rem;
          margin-right: 20 / @rem;
          // background-color: #000;
        }
      }

      .card-prize {
        float: right;
        // width: 570 / @rem;
        width: 85%;
        font-size: 22 / @rem;
        line-height: 35 / @rem;
        color: #a4a4a4;
        position: relative;
        .card-prize-num {
          color: #eb613d;
        }
        .card-tag {
          margin-left: 40 / @rem;
          font-size: 22 / @rem;
          line-height: 40 / @rem;
          color: #aaa;
        }
        .card-like1 {
          cursor: pointer;
        }
        .card-like {
          width: 90 / @rem;
          height: 40 / @rem;
          // overflow: hidden;
          position: absolute;
          bottom: 0;
          right: 0;
          .icon-dianzan {
            float: left;
            font-size: 28 / @rem;
            line-height: 35 / @rem;
            color: #666;
            margin-right: 10 / @rem;
          }
          .icon-zan {
            float: left;
            font-size: 28 / @rem;
            line-height: 35 / @rem;
            color: #eb613d;
            margin-right: 10 / @rem;
          }
          .like {
            float: left;
            font-size: 22 / @rem;
            line-height: 35 / @rem;
            color: #666;
          }
        }
      }
      .card-follow-list {
        float: right;
        // width: 570 / @rem;
        width: 85%;
        margin-top: 20 / @rem;
        margin-bottom: 6 / @rem;
        // margin-right: 20/@rem;
        // margin-left: 20/@rem;
        padding: 10 / @rem 20 / @rem;
        background-color: #f8f8f8;
        .follow-list {
          // overflow: hidden;
          font-size: 24 / @rem;
          line-height: 38 / @rem;
          .follow-name {
            float: left;
            height: 38 / @rem;
            color: #888;
          }
          .follow-content {
            float: left;
            line-height: 38 / @rem;
            color: #424242;
            // max-width: 410/@rem;
          }
          .clear-float {
            clear: both;
          }
        }
      }
      .card-line {
        // width: 570 / @rem;
        width: 76%;
        height: 1px;
        border-bottom: 1px solid #eee;
        position: absolute;
        right: 40 / @rem;
        bottom: 0;
      }
      .card-more {
        position: absolute;
        width: 44 / @rem;
        top: 40 / @rem;
        right: 20 / @rem;
        .icon-gengduo1 {
          font-size: 36 / @rem;
        }
      }
    }
  }

  .cover {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 102;
  }
  .edit-win {
    position: fixed;
    bottom: -250 / @rem;
    width: 100%;
    height: 218 / @rem;
    background-color: #e3e3e3;
    z-index: 103;
    transition: bottom 0.3s;
    .edit {
      width: 100%;
      height: 106 / @rem;
      padding-left: 40 / @rem;
      margin-bottom: 8 / @rem;
      background-color: #fff;
      .icon-bianji {
        float: left;
        color: #666;
        font-size: 38 / @rem;
        line-height: 106 / @rem;
        margin-right: 20 / @rem;
      }
      .edit-text {
        float: left;
        font-size: 32 / @rem;
        color: #6c6c6c;
        line-height: 106 / @rem;
      }
    }
    .cancel {
      height: 104 / @rem;
      background-color: #fff;
      font-size: 32 / @rem;
      text-align: center;
      line-height: 104 / @rem;
      color: #5e7fb2;
    }
  }
  .edit-win-show {
    bottom: 0;
  }
}
</style>
