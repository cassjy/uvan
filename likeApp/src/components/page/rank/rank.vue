<template>
  <div class="rankwrapper" :style="{height: fullHeight-53+'px'}" ref="rankwrapper">
    <div class="loading-win" v-if="showLoading">
      <loading></loading>
    </div>
    <div class="rank">
      <div class="rank-topThree-wrapper">
        <div class="rank-topThree">
          <div class="rank-header" @click.stop="showRankCateBtn">{{nowFlagName}}
            <span class="iconfont icon-xiala3"></span>
          </div>
          <div class="rank-top-two" 
          :data-id="ranklist.length!=0&&rankTopThree[1]!=undefined?rankTopThree[1].userid:''" 
          :data-name="ranklist.length!=0&&rankTopThree[1]!=undefined?rankTopThree[1].name:''" 
          @click="ranklist.length!=0&&rankTopThree[1]!=undefined?toPersonalData($event):''">
            <div class="rank-top-two-win">
              <img class="top-img" v-if="rankTopThree[1]" :src="rankTopThree[1].avatar" />
              <div class="top-num-win">
                <div class="top-num">2</div>
              </div>
            </div>
            <div class="rank-top-info">
              <div class="rank-top-info-name" v-if="rankTopThree[1]">{{rankTopThree[1].name|letterFilter}}</div>
              <div class="rank-top-info-name" v-else>暂无上榜</div>
              <div class="rank-top-info-score" v-if="rankTopThree[1]">{{rankTopThree[1].praiserNumber}} 梵钻</div>
            </div>
          </div>
          <div class="rank-top-one" 
          :data-id="ranklist.length!=0&&rankTopThree[0]!=undefined?rankTopThree[0].userid:''" 
          :data-name="ranklist.length!=0&&rankTopThree[0]!=undefined?rankTopThree[0].name:''" 
          @click="ranklist.length!=0&&rankTopThree[0]!=undefined?toPersonalData($event):''">
            <div class="rank-top-one-win">
              <img class="top-img-head" v-if="rankTopThree[0]" src="../../../common/images/rank/head.png" />
              <img class="top-img-big" v-if="rankTopThree[0]" :src="rankTopThree[0].avatar" />
              <img class="top-img-bottom" src="../../../common/images/rank/bottom.png" />
            </div>
            <div class="rank-top-info">
              <div class="rank-top-info-name" v-if="rankTopThree[0]">{{rankTopThree[0].name|letterFilter}}</div>
              <div class="rank-top-info-name" v-else>暂无上榜</div>
              <div class="rank-top-info-score" v-if="rankTopThree[0]">{{rankTopThree[0].praiserNumber}} 梵钻</div>
            </div>
          </div>
          <div class="rank-top-three" 
          :data-id="ranklist.length!=0&&rankTopThree[2]!=undefined?rankTopThree[2].userid:''" 
          :data-name="ranklist.length!=0&&rankTopThree[2]!=undefined?rankTopThree[2].name:''" 
          @click="ranklist.length!=0&&rankTopThree[2]!=undefined?toPersonalData($event):''">
            <div class="rank-top-three-win">
              <img class="top-img" v-if="rankTopThree[2]" :src="rankTopThree[2].avatar" />
              <div class="top-num-win">
                <div class="top-num">3</div>
              </div>
            </div>
            <div class="rank-top-info">
              <div class="rank-top-info-name" v-if="rankTopThree[2]">{{rankTopThree[2].name|letterFilter}}</div>
              <div class="rank-top-info-name" v-else>暂无上榜</div>
              <div class="rank-top-info-score" v-if="rankTopThree[2]">{{rankTopThree[2].praiserNumber}} 梵钻</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="rank-topThree" style="text-align: center;font-size: 16px;color: #ccc;" v-else>暂无人上榜</div> -->

      <div class="rank-mine">
        <div class="num">我</div>
        <div class="rank-img" 
        :data-id="myRankInfo.userid!=undefined?myRankInfo.userid:''" 
        :data-name="myRankInfo.name!=undefined?myRankInfo.name:''" 
        @click="toPersonalData($event)">
          <img class="img" :src="myRankInfo.avatar||myavatar" />
          <!-- <img class="img" :src="myavatar" /> -->
        </div>
        <div class="rank-mine-name" 
        :data-id="myRankInfo.userid!=undefined?myRankInfo.userid:''" 
        :data-name="myRankInfo.name!=undefined?myRankInfo.name:''" 
        @click="toPersonalData($event)">
          <!-- <div class="name">{{myRankInfo.name||myname}}</div> -->
          <!-- <div class="name">{{myname}}</div> -->
          <div class="info">{{!myRankInfo.sotNo||myRankInfo.sotNo==0?'暂未上榜':'第'+myRankInfo.sotNo+'名'}}</div>
        </div>
        <div class="rank-mine-score">{{myRankInfo.praiserNumber||'0'}} 梵钻</div>
      </div>

      <div class="rank-list" v-for="(rankItem,index) in rankLast" :key="index">
        <div class="num">{{index+4}}</div>
        <div class="rank-img" 
        :data-id="rankLast.length!=0&&rankItem!=undefined?rankItem.userid:''" 
        :data-name="rankLast.length!=0&&rankItem!=undefined?rankItem.name:''" 
        @click="rankLast.length!=0&&rankItem!=undefined?toPersonalData($event):''">
          <img class="img" :src="rankItem.avatar" />
        </div>
        <div class="rank-mine-name" 
        :data-id="rankLast.length!=0&&rankItem!=undefined?rankItem.userid:''" 
        :data-name="rankLast.length!=0&&rankItem!=undefined?rankItem.name:''" 
        @click="rankLast.length!=0&&rankItem!=undefined?toPersonalData($event):''">
          <div class="name">{{rankItem.name}}</div>
        </div>
        <div class="rank-mine-score">{{rankItem.praiserNumber}} 梵钻</div>
      </div>

    </div>
    <!-- 排行榜分类 -->
    <div :class="['rank-cate',showRankCate?'rank-cate-show':'']">
      <div :class="['rank-cate-name', showRankCate?'rank-cate-name-show':'', nowFlag==index+1?'rank-cate-name-select':'']" v-for="(flag,index) in flagList" :key="index" @click="index==4?showMoreRankBtn():selectRankFlag($event)" :data-flag="index+1" :data-name="flag">{{flag}}</div>
    </div>
    <!-- 遮罩层 -->
    <div class="cover" v-if="showMoreRank"></div>
    <!-- 更多筛选 -->
    <div :class="['rank-more',showMoreRank?'rank-more-show':'']">
      <div class="rank-more-head">
        <div class="head-title">选择时间</div>
        <div class="head-tag">
          <div :class="['tag-name',nowFlag2==index+1?'tag-name-select':'',index==3?'tag-name-nomargin':'']" v-for="(flag,index) in flagList.slice(0,4)" :key="index" :data-flag="index+1" :data-name="flag" @click="selectFlag($event)">{{flag}}</div>
        </div>
      </div>
      <div class="rank-more-tags">
        <div class="rank-tags-head">
          <div class="head-title">选择标签</div>
        </div>
        <div class="tagswrapper" ref="tagswrapper" style="height: 260px;">
          <div class="tags">
            <div :class="['tags-name',nowTypeIndex==index?'tags-name-select':'']" v-for="(type,index) in typeList" :key="index" :data-index="index" :data-type="type.typeName" @click="selectType($event)" v-if="type.typeName!=''">{{type.typeName}}</div>
            <div class="clearfloat"></div>
          </div>
        </div>
        <div class="rank-more-bottom">
          <div class="bottom-cancel" @click="hideMoreRank">取消</div>
          <div class="bottom-comfirm" @click="confirmRank">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import { mapGetters } from 'vuex'
import {letterFilter} from '@/common/js/letterFilter2'
import { Loading } from 'vux'
export default {
  data(){
    return {
      fullHeight: document.documentElement.clientHeight,
      showRankCate: false,
      showMoreRank: false,
      ranklist: [],
      rankTopThree: [
        {avatar:'',name:'',praiserNumber:'',userid:'',praiserDepartment:''},
        {avatar:'',name:'',praiserNumber:'',userid:'',praiserDepartment:''},
        {avatar:'',name:'',praiserNumber:'',userid:'',praiserDepartment:''}
      ],
      rankLast: [{avatar:'',name:'',praiserNumber:'',userid:'',praiserDepartment:''}],
      flagList: ['周榜','月榜','季榜','年榜','更多'],
      // typeList: ['全部榜单','超出客户预期','沟通高效不尬聊','快速响应配合好','结果向导能闭环','积极拥抱变化','快速交付质量高','主动担当','创业心态','奇思妙想点子多','乐于分享'],
      typeList:[{typeName:''}],
      nowFlag: 2,//当前flag
      nowFlag2: 2,
      nowFlagName: '月榜',
      nowType:'',
      nowTypeIndex: 0,
      oldFlag2: 2,
      oldTypeIndex: 0,
      oldType: '',
      myRankInfo: {name:'',praiserNumber:'',sotNo:'',avatar:'',userid:'',praiserDepartment:''},
      canConfrim: true,
      showLoading: true,
      myavatar:""
    }
  },
  components:{
    Loading
  },
  filters:{
    letterFilter
  },

  created(){
    document.addEventListener('click',(e)=>{
      this.showRankCate = false
    })
    this.$vux.loading.show({
      text: '正在加载'
    })
    var _this = this;
    let time = setInterval(()=>{
      if(_this.token!=123  && _this.token){
        _this.getRank(2,'')//初始状态，月排名
        _this.myname = this.user.name
        _this.myavatar = this.user.avatar
        _this.getType()
        clearInterval(time)
      }
    },500)
  },
  mounted(){
    setTimeout(()=>{
      this.$nextTick(() => {
        this.rankwrapper = new BScroll(this.$refs.rankwrapper, { mouseWheel: true, click: true, tap: true,bounce: {
          top: false,
          bottom: false,
          left: false,
          right: false
        } })
        // this.tagswrapper = new BScroll(this.$refs.tagswrapper, { mouseWheel: true, click: true, tap: true })
      })
    },1000)
    

    

    const that = this
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight
        that.fullHeight = window.fullHeight
      })()
    }
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
    toPersonalData(e){
      this.$router.push({
        name:"personalData2",
        params: { 
          id: e.currentTarget.dataset.id , 
          name: e.currentTarget.dataset.name
        }
      })
    },
    showRankCateBtn(){
      this.showRankCate = !this.showRankCate
    },
    showMoreRankBtn(){
      this.nowFlag2 = this.oldFlag2
      this.nowTypeIndex = this.oldTypeIndex
      this.nowType = this.oldType
      this.showMoreRank = true
      this.showRankCateBtn()
      this.$nextTick(() => {
        this.rankwrapper.disable()
        this.tagswrapper = new BScroll(this.$refs.tagswrapper, { mouseWheel: true, click: true, tap: true, bounce: {
          top: false,
          bottom: false,
          left: false,
          right: false
        } })
      })
    },
    hideMoreRank(){
      this.showMoreRank = false
      this.rankwrapper.enable()
      // this.$nextTick(() => {
      //   this.rankwrapper = new BScroll(this.$refs.rankwrapper, { mouseWheel: true, click: true, tap: true })
      // })
    },
    //选择榜单筛选条件
    selectFlag(e){
      // console.log(e.target.dataset.flag)
      this.nowFlag2 = e.target.dataset.flag
      this.nowFlagName = e.target.dataset.name
    },
    selectType(e){
      this.nowTypeIndex = e.target.dataset.index
      this.nowType = (e.target.dataset.type=='全部榜单'?'':e.target.dataset.type)
    }, 
    confirmRank(){
      if(!this.canConfrim){
        return
      }
      this.rankwrapper.enable()
      // this.$nextTick(() => {
      //   this.rankwrapper = new BScroll(this.$refs.rankwrapper, { mouseWheel: true, click: true, tap: true })
      // })
      this.canConfrim = false
      this.getRank(this.nowFlag2,this.nowType)
      this.showMoreRank = false
      this.oldFlag2 = this.nowFlag2
      this.oldTypeIndex = this.nowTypeIndex
      this.oldType = this.nowType
      this.nowFlag = this.nowFlag2
    },
    //选择榜单类别
    selectRankFlag(e){
      this.nowFlag = e.target.dataset.flag
      this.nowFlagName = e.target.dataset.name
      this.showRankCate = false
      this.getRank(this.nowFlag,'')
    },
    getRank(flag,type){
      /*
      1表示周，2表示月，3表示年,4表示季度，不传默认按月排行
      */
      let url = 'appreciation/FzLeaderboard/getZsLeaderboard'
      let query = 'pageSize=10&pageNo=1&flag='+flag+'&type='+type
      let userId = '&userId='+this.user.userid
      let apiUrl = url+'?'+query+userId
      this.$api.get(apiUrl)
      .then(res=>{
        // console.log(res)
        if(res.code==200){
          this.ranklist = res.data.list || []
          this.rankTopThree = this.ranklist.slice(0,3)||[]
          this.rankLast = this.ranklist.slice(3) || []
          this.myRankInfo = res.data.entity || {}
          this.canConfrim = true
        }else if(res.code==500){
          this.rankTopThree = ''
          this.rankLast = ''
        }
        // this.$nextTick(() => {
        //   this.rankwrapper = new BScroll(this.$refs.rankwrapper, { mouseWheel: true, click: true, tap: true })
        // })
      })
    },
    //获取赞赏类型
    getType(){
      let url = 'appreciation/fzAppreciationType/getList'
      this.$api.get(url)
      .then(res=>{
        // console.log("进入排行榜"+JSON.stringify(res));
        // console.log(res)
        this.typeList = res.data
        this.showLoading = false
        this.$vux.loading.hide()
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
img {
  object-fit: cover;
}

.rankwrapper {
  background-color: #f8f8f8;
  overflow: hidden;
  padding-bottom: 100 / @rem;
  position: relative;
  .loading-win {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 11;
  }
  .rank {
    .rank-header {
      font-size: 24 / @rem;
      color: #424242;
      position: absolute;
      top: 40 / @rem;
      right: 40 / @rem;
      .icon-xiala3 {
        font-size: 32 / @rem;
        color: #666;
      }
    }
    .rank-topThree-wrapper {
      width: 100%;
      background-color: #fff;
      padding-left: 70 / @rem;
      padding-right: 70 / @rem;
    }
    .rank-topThree {
      width: 100%;
      display: flex;
      height: 430 / @rem;
      background-color: #fff;
      padding-top: 80 / @rem;
      padding-bottom: 60 / @rem;
      // padding-left: 70/@rem;
      // padding-right: 70/@rem;
      margin-bottom: 20 / @rem;
      .rank-top-info {
        text-align: center;
        margin-top: 40 / @rem;
        .rank-top-info-name {
          font-size: 28 / @rem;
          line-height: 47 / @rem;
          color: #424242;
          font-weight: bold;
          overflow: hidden;
        }
        .rank-top-info-score {
          font-size: 28 / @rem;
          line-height: 47 / @rem;
          color: #888;
        }
      }
      .rank-top-two {
        // width: 180/@rem;
        // width: 25%;
        cursor: pointer;
        flex: 4.5;
        // float: left;
        height: 100%;
        .rank-top-two-win {
          margin: 0 auto;
          text-align: center;
          width: 118 / @rem;
          height: 146 / @rem;
          position: relative;
          .top-img {
            width: 120 / @rem;
            height: 120 / @rem;
            // background-color: #000;
            border-radius: 50%;
            overflow: hidden;
            position: absolute;
            bottom: 0;
            left: 0;
          }
          .top-num-win {
            width: 100%;
            position: absolute;
            bottom: -17 / @rem;
            .top-num {
              width: 35 / @rem;
              height: 35 / @rem;
              border-radius: 50%;
              background-color: #75c780;
              font-size: 30 / @rem;
              color: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 auto;
            }
          }
        }
      }
      .rank-top-one {
        cursor: pointer;
        // width: 200/@rem;
        // width: 40%;
        flex: 5;
        // margin-left: 25/@rem;
        // margin-right: 25/@rem;
        // float: left;
        height: 100%;
        .rank-top-one-win {
          margin: 0 auto;
          width: 150 / @rem;
          height: 150 / @rem;
          text-align: center;
          position: relative;
          .top-img-head {
            position: absolute;
            top: -30 / @rem;
            left: -20 / @rem;
            z-index: 10;
            width: 80 / @rem;
          }
          .top-img-big {
            width: 146 / @rem;
            height: 146 / @rem;
            // background-color: #000;
            border-radius: 50%;
            overflow: hidden;
            position: absolute;
            bottom: 0;
            left: 0;
          }
          .top-img-bottom {
            position: absolute;
            bottom: -17 / @rem;
            left: 0;
          }
        }
      }
      .rank-top-three {
        cursor: pointer;
        // width: 180/@rem;
        // width: 25%;
        flex: 4.5;
        // float: left;
        height: 100%;
        .rank-top-three-win {
          margin: 0 auto;
          width: 118 / @rem;
          height: 146 / @rem;
          text-align: center;
          position: relative;
          .top-img {
            width: 120 / @rem;
            height: 120 / @rem;
            // background-color: #000;
            border-radius: 50%;
            overflow: hidden;
            position: absolute;
            bottom: 0;
            left: 0;
          }
          .top-num-win {
            width: 100%;
            position: absolute;
            bottom: -17 / @rem;
            .top-num {
              width: 35 / @rem;
              height: 35 / @rem;
              border-radius: 50%;
              background-color: #5691f7;
              font-size: 30 / @rem;
              color: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 auto;
            }
          }
        }
      }
    }
    .rank-mine {
      width: 100%;
      height: 140 / @rem;
      background-color: #fff;
      padding-left: 40 / @rem;
      padding-right: 30 / @rem;
      margin-bottom: 20 / @rem;
      .num {
        float: left;
        font-size: 28 / @rem;
        color: #484848;
        width: 40 / @rem;
        height: 140 / @rem;
        line-height: 140 / @rem;
        margin-right: 30 / @rem;
      }
      .rank-img {
        float: left;
        height: 140 / @rem;
        line-height: 140 / @rem;
        margin-right: 20 / @rem;
        .img {
          width: 80 / @rem;
          height: 80 / @rem;
          border-radius: 50%;
          overflow: hidden;
          // background-color: #000;
        }
      }
      .rank-mine-name {
        float: left;
        height: 140 / @rem;
        .name {
          margin-top: 40 / @rem;
          font-size: 26 / @rem;
          line-height: 35 / @rem;
          color: #424242;
        }
        .info {
          cursor: pointer;
          margin-bottom: 25 / @rem;
          font-size: 26 / @rem;
          line-height: 140 / @rem;
          color: #888;
        }
      }
      .rank-mine-score {
        float: right;
        height: 140 / @rem;
        line-height: 140 / @rem;
        font-size: 28 / @rem;
      }
    }
    .rank-list {
      width: 100%;
      height: 140 / @rem;
      background-color: #fff;
      padding-left: 40 / @rem;
      padding-right: 30 / @rem;
      .num {
        float: left;
        font-size: 28 / @rem;
        color: #424242;
        width: 40 / @rem;
        height: 140 / @rem;
        line-height: 140 / @rem;
        margin-right: 30 / @rem;
      }
      .rank-img {
        float: left;
        height: 140 / @rem;
        line-height: 140 / @rem;
        margin-right: 20 / @rem;
        .img {
          width: 72 / @rem;
          height: 72 / @rem;
          border-radius: 50%;
          overflow: hidden;
          // background-color: #000;
        }
      }
      .rank-mine-name {
        float: left;
        height: 140 / @rem;
        .name {
          cursor: pointer;
          font-size: 26 / @rem;
          line-height: 140 / @rem;
          color: #424242;
        }
      }
      .rank-mine-score {
        float: right;
        height: 140 / @rem;
        line-height: 140 / @rem;
        font-size: 28 / @rem;
      }
    }
  }
  .rank-cate {
    width: 0;
    height: 0;
    background-color: #fff;
    position: fixed;
    top: 60 / @rem;
    right: 20 / @rem;
    border-radius: 8 / @rem;
    transition: all 0.4s;
    .rank-cate-name {
      width: 0;
      height: 0;
      font-size: 0;
      color: #333;
      line-height: 0;
      padding-left: 80 / @rem;
      transition: all 0.4s;
    }
    .rank-cate-name-show {
      width: 280 / @rem;
      height: 100 / @rem;
      font-size: 28 / @rem;
      line-height: 100 / @rem;
      border-bottom: 1px solid #f3f3f3;
    }
    .rank-cate-name-select {
      color: #5e7fb2;
    }
  }
  .rank-cate-show {
    width: 280 / @rem;
    height: 500 / @rem;
    box-shadow: #ddd 0 0 50 / @rem;
  }
  .cover {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .rank-more {
    width: 100%;
    height: 1036 / @rem;
    background-color: #ffffff;
    position: fixed;
    bottom: -1200 / @rem;
    left: 0;
    transition: bottom 0.5s;
    z-index: 111;
    .rank-more-head {
      // width: 100%;
      padding-top: 18 / @rem;
      margin-left: 40 / @rem;
      margin-right: 40 / @rem;
      // margin-bottom: 40/@rem;
      border-bottom: 1px solid #eee;
      .head-title {
        height: 108 / @rem;
        // border-bottom: 1px solid #eee;
        font-size: 28 / @rem;
        color: #888;
        line-height: 108 / @rem;
      }
      .head-tag {
        // margin-top: 40/@rem;
        margin-bottom: 40 / @rem;
        overflow: hidden;
        .tag-name {
          float: left;
          width: 153 / @rem;
          height: 58 / @rem;
          font-size: 24 / @rem;
          line-height: 58 / @rem;
          text-align: center;
          color: #424242;
          background-color: #fff;
          // border-radius: 8/@rem;
          margin-right: 19 / @rem;
          border: 1px solid #bfbfbf;
        }
        .tag-name-select {
          border: 1px solid #666;
          background-color: #666;
          color: #fff;
        }
        .tag-name-nomargin {
          margin-right: 0;
        }
      }
    }
    .rank-more-tags {
      .rank-tags-head {
        width: 100%;
        padding-left: 40 / @rem;
        .head-title {
          height: 108 / @rem;
          // border-bottom: 1px solid #f3f3f3;
          font-size: 28 / @rem;
          color: #888;
          line-height: 108 / @rem;
        }
      }
      .tagswrapper {
        overflow: hidden;
        .tags {
          // margin-top: 40/@rem;
          padding-left: 40 / @rem;
          padding-right: 40 / @rem;
          .tags-name {
            float: left;
            // width: 210/@rem;
            height: 58 / @rem;
            // border-radius: 8/@rem;
            border: 1px solid #bfbfbf;
            background-color: #fff;
            font-size: 24 / @rem;
            color: #424242;
            margin-right: 20 / @rem;
            margin-bottom: 40 / @rem;
            line-height: 58 / @rem;
            text-align: center;
            padding-left: 18 / @rem;
            padding-right: 18 / @rem;
          }
          .tags-name-select {
            border: 1px solid #666;
            background-color: #666;
            color: #fff;
          }
          .clearfloat {
            clear: both;
          }
        }
      }
    }
    .rank-more-bottom {
      height: 100 / @rem;
      width: 100%;
      font-size: 28 / @rem;
      position: absolute;
      bottom: 0;
      .bottom-cancel {
        float: left;
        height: 96 / @rem;
        width: 50%;
        text-align: center;
        line-height: 100 / @rem;
        background-color: #f6f6f6;
        color: #4a4a4a;
      }
      .bottom-comfirm {
        float: left;
        height: 96 / @rem;
        width: 50%;
        text-align: center;
        line-height: 100 / @rem;
        background-color: #424242;
        color: #fff;
      }
    }
  }
  .rank-more-show {
    bottom: 0;
  }
}
</style>
