<template>
  <div class="personal" ref="personalWrapper">
    <!-- <quick-loadmore :top-method="handleTop" ref="vueLoad" 
                    :top-status-change="handleStatusChange" 
                    :bottom-method="handleBottom" 
                    :bottom-status-change="handleBottomStatusChange" 
                    :disable-top="false" :disable-bottom="false"> -->
    <pull-to :top-load-method="handleTop" @infinite-scroll="handleBottom" :top-config="{triggerText:'释放刷新',loadingText:'刷新中...',doneText:'刷新完成'}" :is-bottom-bounce="!showLoadingend">
      <div class="personalWrapper">
        <header>
          <!-- <div class="record">
            <div>
              <i class="icon-fangwenliang iconfont"></i>
            </div>
            <div class="dataRecord">
              <span class="nows">今日访问：1人</span>
              <span>历史访问：5人</span>
            </div>
          </div> -->
          <div class="userInfo">
            <!-- <img :src="user_avatar==''?user.avatar:user_avatar" /> -->
            <img v-lazy="user_avatar"/>
            <div>
              <!-- <span class="nickName">{{user_name==''?user.name:user_name}}</span>
              <span>{{user_department==''?user.department:user_department}}</span> -->
              <span class="nickName">{{user_name}}</span>
              <span>{{user_department}}</span>
            </div>
          </div>
          <div class="praise">
            <div class="left">
              <span>获赞&nbsp;&nbsp;
                <span class="num">{{praiserCount}}</span>
              </span>
            </div>
            <div class="right">
              <span>送赞&nbsp;&nbsp;
                <span class="num">{{presenterCount}}</span>
              </span>
            </div>
          </div>
          <div class="hBackground">
            <!-- <img src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/9129f8d2de644951a14a58d909bbe655" /> -->
            <img src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/67295907c89d4caea56e3c19dddc501a" />
          </div>
        </header>
        <section>
          <div class="tab">
            <div class="tabItem" @click="chooseItem(0)">
              <span :class="{'changeColor':itemID==0}">获赞</span>
            </div>
            <div class="tabItem" @click="chooseItem(1)">
              <span :class="{'changeColor':itemID==1}">送赞</span>
            </div>
          </div>
          <div class="border"></div>
          <div class="catchPraise" v-if="itemID==0">
            <div class="card" v-for="(content,index) in DiamondList" :key="index">
              <div class="card-header">
                <img class="header-img" :src="content.user_img" />
                <div class="header-info">
                  <div class="header-name">
                    <!-- {{content.praiserName|letterFilter}} -->
                    <!-- {{content.presenterName|letterFilter}} -->
                    <span class="name" 
                      @click="toPersonalData($event)"
                      :data-id="content.praiserId" 
                      :data-department="content.praiserDepartment" 
                      :data-name="content.praiserName">{{content.praiserName}} </span>获得
                    <span class="name" 
                      @click="toPersonalData($event)" 
                      :data-id="content.presenterId" 
                      :data-department="content.presenterDepartment" 
                      :data-name="content.presenterName"> {{content.presenterName}} </span>的赞赏
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
              <!-- <div style="overflow: hidden;"> -->
              <div class="card-content" v-if="content.packup">
                  <div style="word-wrap:break-word">{{content.content.length>60?content.content.substr(0,59):content.content}}<span v-if="content.content.length>60" :data-index="index" @click="openMore($event)" style="color:#5e7fb3;">...展开</span></div>
                  <!-- {{content.content.length>60?content.content.substr(0,59):content.content}}
                  <span class="content-more" v-if="content.content.length>60">...</span>
                  <span class="content-open" v-if="content.content.length>60" @click="openMore($event)" :data-index="index">展开</span> -->
                </div>
                <div class="card-content" v-if="content.content.length>60&&!content.packup">
                  {{content.content}}
                  <span class="content-open" @click="closeMore($event)" :data-index="index">收起</span>
                </div>
                <div class="card-image" v-if="content.imgList.length!=0">
                  <img class="image" :preview="content.id" v-for="(img,index) in content.imgList" :src="img" :key="index" v-if="index<3" />

                </div>

                <div class="card-prize">
                  <span class="card-prize-num">+{{content.coinCount||content.coinNumber}}</span> 梵钻
                  <span class="card-tag">
                    # {{content.tag}} #
                  </span>
                  <!-- <div class="card-like" v-if="content.praiserId!=myuserid">
                <div class="iconfont icon-dianzan"></div>
                <div class="like" @click="toFollow($event)" :data-id="content.appreciationCode" :data-name="content.praiserName">跟赞</div>
              </div> -->
                </div>
              <!-- </div> -->
              <div class="card-follow-list" v-if="content.fzAppreciationFollowList.length>0">
                <div class="follow-list" v-for="(item,index) in content.fzAppreciationFollowList" :key="index">
                  <div class="follow-name">{{item.presenterName}}：</div>
                  <div class="follow-content">{{item.content}}</div>
                  <div class="clear-float"></div>
                </div>
              </div>
              <div class="card-line" v-if="index!=total-1"></div>
              <div class="clear-float"></div>
            </div>
            <!--  <div class="content" v-for="(item,index) in DiamondList" :key="index">
              <div class="cWrapper">
                <img :src="item.user_img" />
                <div class="newMessage">
                  <div>
                    <span class="text">{{item.praiserName|letterFilter}}</span>&nbsp;获得&nbsp;
                    <span class="text">{{item.presenterName|letterFilter}}</span>的赏赞</div>
                  <div class="date">
                    <span>{{((new Date()).getTime()/1000-item.createTime)/60/60/24>=1?parseInt(((new Date()).getTime()/1000-item.createTime)/60/60/24)+'天前':
                      (((new Date()).getTime()/1000-item.createTime)/60/60>=1?parseInt(((new Date()).getTime()/1000-item.createTime)/60/60)+'小时前':
                      (((new Date()).getTime()/1000-item.createTime)/60>=1?parseInt(((new Date()).getTime()/1000-item.createTime)/60)+'分钟前':'刚刚'))}}</span>
                    <i class="iconfont icon-hot"></i>
                  </div>
                </div>
              </div>
              <div class="comments">{{item.remarks}}</div>
              <div class="photo">
                <div class="p1" v-for="(photoItem,index) in item.imgList" :key="index"><img v-if="item.imgList.length<3" :src="photoItem" /></div>
                </div>
                <div class="mark"># {{item.tag}} #</div>
                <div class="requireCion">
                  <span>获得{{item.praiserNumber}}颗梵钻</span>
                   <span class="like" @click="toFollow($event)" :data-id="item.appreciationCode">
                    <i class="icon-dianzan1 iconfont"></i>跟赞</span> -->
            <!--   </div>
                <div class="reply">
                  <div class="card-follow-list" v-if="item.fzAppreciationFollowList.length>0">
                    <div class="follow-list" v-for="(followItem,index) in item.fzAppreciationFollowList" :key="index">
                      <div class="follow-name">{{followItem.presenterName}}：</div>
                      <div class="follow-content">{{followItem.content}}</div>
                    </div>
                  </div>
                </div>
              </div> -->
          </div>
          <div class="sendPraise" v-if="itemID==1">
            <div class="card" v-for="(content,index) in DiamondList" :key="index">
              <div class="card-header">
                <img class="header-img" :src="content.user_img" 
                @click="toPersonalData($event)"
                :data-id="content.praiserId" 
                :data-department="content.praiserDepartment" 
                :data-name="content.praiserName"/>
                <div class="header-info">
                  <div class="header-name">
                    <!-- {{content.praiserName|letterFilter}} -->
                    <!-- {{content.presenterName|letterFilter}} -->
                    <span class="name" 
                      @click="toPersonalData($event)"
                      :data-id="content.praiserId" 
                      :data-department="content.praiserDepartment" 
                      :data-name="content.praiserName">{{content.praiserName}} </span>获得
                    <span class="name" 
                      @click="toPersonalData($event)" 
                      :data-id="content.presenterId" 
                      :data-department="content.presenterDepartment" 
                      :data-name="content.presenterName"> {{content.presenterName}} </span>的赞赏
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
              <!-- <div style="overflow: hidden;"> -->
              <div class="card-content" v-if="content.packup">
                  <div style="word-wrap:break-word">{{content.content.length>60?content.content.substr(0,59):content.content}}<span v-if="content.content.length>60" :data-index="index" @click="openMore($event)" style="color:#5e7fb3;">...展开</span></div>
                  <!-- {{content.content.length>60?content.content.substr(0,59):content.content}}
                  <span class="content-more" v-if="content.content.length>60">...</span>
                  <span class="content-open" v-if="content.content.length>60" @click="openMore($event)" :data-index="index">展开</span> -->
                </div>
                <div class="card-content" v-if="content.content.length>60&&!content.packup">
                  {{content.content}}
                  <span class="content-open" @click="closeMore($event)" :data-index="index">收起</span>
                </div>
                <div class="card-image" v-if="content.imgList.length!=0">
                  <img class="image" :preview="content.id" v-for="(img,index) in content.imgList" :src="img" :key="index" v-if="index<3" />

                </div>

                <div class="card-prize">
                  <span class="card-prize-num">+{{content.coinCount||content.coinNumber}}</span> 梵钻
                  <span class="card-tag">
                    # {{content.tag}} #
                  </span>
                  <!-- <div class="card-like" v-if="content.praiserId!=myuserid&&myfollowrecord.indexOf(content.appreciationCode)<0">
                    <div class="iconfont icon-dianzan"></div>
                    <div class="like" @click="toFollow($event)" :data-id="content.appreciationCode" :data-name="content.praiserName">跟赞</div>
                  </div> -->
                  <!-- <div class="card-like" v-if="content.praiserId!=myuserid&&myfollowrecord.indexOf(content.appreciationCode)>=0">
                    <div class="iconfont icon-zan"></div>
                    <div class="like">已赞</div>
                  </div> -->
                </div>
              <!-- </div> -->
              <div class="card-follow-list" v-if="content.fzAppreciationFollowList.length>0">
                <div class="follow-list" v-for="(item,index) in content.fzAppreciationFollowList" :key="index">
                  <div class="follow-name">{{item.presenterName}}：</div>
                  <div class="follow-content">{{item.content}}</div>
                  <div class="clear-float"></div>
                </div>
              </div>
              <div class="card-line" v-if="index!=total-1"></div>
              <div class="clear-float"></div>
            </div>
          </div>
          <load-more class="loading-more" v-if="showLoadingmore&&DiamondList.length!=0" tip="正在加载" background-color="#eee"></load-more>
          <load-more v-if="showLoadingend&&DiamondList.length!=0" :show-loading="false" tip="没有更多了" background-color="#eee"></load-more>
          <div class="noRecord" v-if="DiamondList.length==0">
            <span>暂无记录</span>
          </div>
        </section>
      </div>
      <!-- </quick-loadmore> -->
    </pull-to>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { mapGetters } from "vuex";
import { Loading, Toast, LoadMore } from "vux";
import { letterFilter } from "@/common/js/letterFilter";

import PullTo from 'vue-pull-to'

var stateM = "";
var page = 1;
var count = 10;
export default {
  inject: ['reload'],
  data() {
    return {
      itemID: 0,
      options: {
        pullDownRefresh: {
          threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
          stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
        },
        pullUpLoad: {
          threshold: -20 // 在上拉到超过底部 20px 时，触发 pullingUp 事件
        },
        pullDownRefresh: false, //关闭下拉
        // pullUpLoad: false, // 关闭上拉
        click: true,
        probeType: 3,
        startY: 0,
        scrollbar: false,
        mouseWheel: true,
        click: true,
        tap: true,
        // preventDefault: false
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV)$/
        }
      },
      DiamondList: [], //梵钻记录列表
      praiserCount: 0,
      presenterCount: 0,
      totalPage: "", //总页码
      praiserInfo: "",
      presenterInfo: "",
      myfollowrecord: [],
      myuserid:'',
      user_id: '',
      user_avatar:'',
      user_name:'',
      user_department: '',
      showLoadingend: false,
      fromrefresh: false,
      fromloadmore: false,
      total: 0,
      showLoadingmore: false
    };
  },
  created() {
    console.log('测试路径')
    console.log(this.$route.query.index)
   
    if(this.$route.params.id){
      this.user_id = this.$route.params.id
      this.user_name = this.$route.params.name
      // this.user_department = this.$route.params.department
      let url = 'ding/dingUser/getUserByUserId?userId='+this.user_id
      this.$api.get(url)
      .then(res=>{
        this.user_avatar = res.data.avatar
        this.user_department = res.data.departmentNames
      })
    }else{
      this.user_avatar = this.user.avatar
      this.user_name = this.user.name
      this.user_department = this.user.department
    }
    // if (stateM == "songzeng") {
    //   var praiserInfo = ""; //用于辨别是请求获赞数据
    //   var presenterInfo = 1;
    //   this.itemID = 1;
    // } else {
    //   var praiserInfo = 1; //用于辨别是请求获赞数据
    //   var presenterInfo = "";
    //   this.itemID = 0;
    // }
      var praiserInfo = 1;
      var presenterInfo = '';
     if(!!this.$route.query.index){
      if(parseInt(this.$route.query.index)==0||parseInt(this.$route.query.index)==1){
        this.itemID = parseInt(this.$route.query.index)
        if(parseInt(this.$route.query.index)==0){
           praiserInfo = 1;
           presenterInfo = '';
        }else{
          praiserInfo = '';
           presenterInfo = 1;
        }
      }
    }
    this.$vux.loading.show({
      text: "加载中..."
    });
    this.requireData(praiserInfo, presenterInfo); //请求获取用户数据
    this.requirediamon();
    this.getUserFollowRecord()
    this.myuserid = this.user.userid
  },
  mounted() {
    this.$nextTick(() => {
      // this.personalWrapper = new BScroll(
      //   this.$refs.personalWrapper,
      //   this.options
      // );
      // this.personalWrapper.on("pullingUp", () => {
      //   console.log("上拉加载");
      //   console.log(this.totalPage);
      //   console.log(page);
      //   if (this.totalPage == page) {
      //     console.log("加载完成");
      //     return;
      //   } else {
      //     page++;
      //     this.requireData(this.praiserInfo, this.presenterInfo);
      //   }
      // });
    });
  },
  // beforeRouteEnter(to, from, next) {
  //   // console.log("测试测试是");
  //   if (from.fullPath == "/hall/follow") {
  //     stateM = "songzeng";
  //   } else {
  //     stateM = "";
  //   }
  //   next();
  // },
  computed: {
    ...mapGetters(["user"])
  },
  components:{
    PullTo,
    LoadMore
  },
  filters: {
    letterFilter
  },
  methods: {
    handleTop(loaded){
      // this.refresh()
      page = 1
      this.DiamondList = []
      if (stateM == "songzeng") {
        var praiserInfo = ""; //用于辨别是请求获赞数据
        var presenterInfo = 1;
        this.itemID = 1;
      } else {
        var praiserInfo = 1; //用于辨别是请求获赞数据
        var presenterInfo = "";
        this.itemID = 0;
      }
      this.$vux.loading.show({
        text: "加载中..."
      });
      this.fromrefresh = true
      this.requireData(praiserInfo, presenterInfo,loaded); //请求获取用户数据
      this.requirediamon();
      this.getUserFollowRecord()
      this.myuserid = this.user.userid
    },
    // handleStatusChange(status){

    // },
    // handleBottomStatusChange(status){
      
    // },
    handleBottom(){
      if (this.totalPage == page) {
        // this.$refs.vueLoad.onBottomLoaded(false);
        this.showLoadingmore = false
        // console.log("加载完成");
        this.showLoadingend = true
        return;
      } else {
        page++;
        this.fromloadmore = true
        this.requireData(this.praiserInfo, this.presenterInfo);
      }
    },
    //展开隐藏的文本
    openMore(e){
      this.DiamondList[e.target.dataset.index].packup = false
    },
    //收起文本
    closeMore(e){
      this.DiamondList[e.target.dataset.index].packup = true
    },
    toPersonalData(e){
      // this.reload();
      this.$router.push({
        name:"personalData2",
        params: { 
          id: e.target.dataset.id , 
          department: e.target.dataset.department,
          name: e.target.dataset.name
        }
      })
    },
    chooseItem(id) {
      this.$vux.loading.show({
        text: "加载中..."
      });
      this.itemID = id;
      page = 1; //页码复原
      this.DiamondList = []; //数组清空
      this.showLoadingend = false
      this.showLoadingmore = false
      if (id == 0) {
        let praiserInfo = 1; //用于辨别是请求获赞数据
        let presenterInfo = "";
        this.requireData(praiserInfo, presenterInfo);
      } else if (id == 1) {
        let praiserInfo = "";
        let presenterInfo = 1; //用于辨别是请求送赞数据
        this.requireData(praiserInfo, presenterInfo);
      }
    },
    toFollow(e) {
      // console.log(e.target.dataset.name);
      this.$router.push({
        name: "follow",
        params: { id: e.target.dataset.id, name: e.target.dataset.name }
      });
    },
    requireData(praiserInfo, presenterInfo,loaded) {
      this.praiserInfo = praiserInfo;
      this.presenterInfo = presenterInfo;
      // console.log(`输入${JSON.stringify(this.user)}`);
      let urlQuery = {
        pageNo: page,
        pageSize: count,
        userId: this.user_id==''?this.user.userid:this.user_id,
        praiserInfo: praiserInfo,
        presenterInfo: presenterInfo
      };
      this.$api
        .get("/appreciation/fzAppreciationRecord/getList", urlQuery)
        .then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.showLoadingmore = true
            this.totalPage = Math.ceil(res.data.count / count);
            this.total = res.data.count
            let list = this.DiamondList;
            for (let i = 0; i < res.data.list.length; i++) {
              list.push(res.data.list[i]);
            }
            // this.$refs.vueLoad.onTopLoaded();
            // this.$refs.vueLoad.onBottomLoaded();
            this.DiamondList = list;
            if(this.DiamondList.length == this.total){
              this.showLoadingmore = false
              this.showLoadingend = true
            }
            // console.log(this.DiamondList);
            // console.log(this.totalPage);
            if(this.fromrefresh){
              loaded('done')
              this.fromrefresh = false
            }
            if(this.fromloadmore){
              this.fromloadmore = false
            }
            
          } else if (res.code == 11001) {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "14em"
            });
            this.DiamondList = [];
            if(this.fromrefresh){
              loaded('done')
              this.fromrefresh = false
            }
            if(this.fromloadmore){
              this.fromloadmore = false
            }
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "14em"
            });
            if(this.fromrefresh){
              loaded('done')
              this.fromrefresh = false
            }
            if(this.fromloadmore){
              this.fromloadmore = false
            }
          }
          this.$vux.loading.hide();
          this.$nextTick(() => {
            setTimeout(() => {
              // this.pullingDownUp();
              // this.$previewRefresh()
            }, 500);
          });
        });
    },
    //加载用户跟赞记录
    getUserFollowRecord(){
      let url = '/appreciation/fzAppreciationRecord/getFollowListByUserId'
      let query = '?userId='+(this.user_id==''?this.user.userid:this.user_id)
      let apiUrl = url+query
      this.$api.get(apiUrl)
      .then(res=>{
        // console.log(res.data)
        this.myfollowrecord = res.data
      })
    },
    // pullingDownUp() {
    //   this.personalWrapper.finishPullUp(); //告诉 better-scroll 数据已加载
    //   this.personalWrapper.refresh(); //重新计算元素高度
    // },
    requirediamon() {
      let diaData = {
        userid: this.user_id==''?this.user.userid:this.user_id
      };
      this.$api.post("ding/dingUser/getRecordByUserId", diaData).then(res => {
        // console.log(res);
        this.praiserCount = res.data.praiserCount;
        this.presenterCount = res.data.presenterCount;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/css/defult.less";
* {
  box-sizing: border-box;
}
img {
  object-fit: cover;
}
.personal {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 10;
  padding-bottom: 100 / @rem;
  .personalWrapper {
  }
  header {
    width: 100%;
    height: 425 / @rem;
    padding: 60 / @rem 0 40 / @rem;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    .hBackground {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      // filter: blur(2px);
      // -webkit-filter: blur(2px);
      // -webkit-backdrop-filter: blur(2px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .record {
      position: absolute;
      right: 0;
      width: 280 / @rem;
      height: 75 / @rem;
      background: rgba(0, 0, 0, 0.4);
      border-top-left-radius: 50 / @rem;
      border-bottom-left-radius: 50 / @rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 24 / @rem;
      box-sizing: border-box;
      .icon-fangwenliang {
        color: #e06b3d;
        font-size: 44 / @rem;
        margin-right: 15 / @rem;
      }
      .dataRecord {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        font-size: 20 / @rem;
        .nows {
          display: flex;
          margin-bottom: 4 / @rem;
        }
      }
    }
    .userInfo {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .empty-img{
        background-color: rgba(0,0,0,0);
      }
      img {
        width: 150 / @rem;
        height: 150 / @rem;
        border-radius: 100%;
        // background-image: no-repeat center;
        background-size: 100% 100%;
        border-radius: 100%;
        border: none;
      }
      div {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #ddf2ff;
        font-size: 22 / @rem;
        .nickName {
          color: #fff;
          font-size: 32 / @rem;
          font-weight: bold;
          margin: 15 / @rem 0;
        }
      }
    }
    .praise {
      color: #ddf2ff;
      width: 100%;
      height: 40 / @rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 35 / @rem;
      padding: 0 40 / @rem;
      box-sizing: border-box;
      .left {
        border-right: 1px solid #fff;
      }
      .left,
      .right {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .num {
          color: #fff;
          font-size: 36 / @rem;
          font-weight: bold;
        }
      }
    }
  }
  section {
    .tab {
      color: #888888;
      width: 100%;
      height: 105 / @rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #fff;
      border-bottom: 1px solid #eaeaea;
      .tabItem {
        cursor: pointer;
        height: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30 / @rem;
        box-sizing: border-box;
        span {
          height: 105 / @rem;
          line-height: 105 / @rem;
          text-align: center;
        }
        .changeColor {
          color: #424242;
          border-bottom: 4 / @rem solid #424242;
          box-sizing: border-box;
        }
      }
    }
    .border {
      width: 100%;
      height: 1 / @rem;
      background-color: #f5f5f5;
    }
    .catchPraise,
    .sendPraise {
      width: 100%;
      box-sizing: border-box;
      background-color: #f5f5f5;
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
                // height: 38 / @rem;
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
            width: 28%;
            height: 100%;
            // margin-top: 5/@rem;
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
          .card-like {
            overflow: hidden;
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
          box-sizing: border-box;
          float: right;
          // width: 560 / @rem;
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
              height: 38 / @rem;
              color: #424242;
            }
            .clear-float {
              clear: both;
            }
          }
        }
        .card-line {
          box-sizing: border-box;
          // width: 560 / @rem;
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
  }
  .noRecord {
    color: #999;
    font-size: 28 / @rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 120 / @rem;
  }
  .hBackground img {
    width: 100%;
    height: 400 / @rem;
  }
  .like {
    font-size: 20 / @rem;
    color: #5e7fb3;
  }
  .card-follow-list {
    margin-top: 20 / @rem;
    // margin-right: 20/@rem;
    // margin-left: 20/@rem;
    padding: 20 / @rem 20 / @rem;
    background-color: #f3f3f3;
    .follow-list {
      overflow: hidden;
      font-size: 24 / @rem;
      line-height: 38 / @rem;
      .follow-name {
        float: left;
        height: 38 / @rem;
      }
      .follow-content {
        float: left;
        height: 38 / @rem;
      }
    }
  }
}
</style>
