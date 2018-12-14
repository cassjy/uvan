<template>
  <div class="exchangewrapper" ref="exchangewrapper">
    <div>
      <div class="exchange">
        <div class="exchange-head">
          <img class="exchange-head-img" src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/3716e9b0540d44cf8f1aca77d115f86c" />
          <div class="exchange-text">可兑换梵钻</div>
          <div class="exchange-money">
            {{convertibleNum|priceFilter}}
          </div>
        </div>
        <div class="exchange-tab">
          <div class="tab-name" v-for="(option,index) in optionTab" :key="index" :data-index="index" @click="selectOption($event)">
            <div :data-index="index" :class="['name',nowOptionIndex==index?'border-bottom':'']">{{option}}</div>
          </div>
          <!-- <div class="tab-name"><div class="name">收入</div></div>
        <div class="tab-name"><div class="name">支出</div></div>. -->
        </div>

        <div class="exchange-list">
          <!-- <img class="list-img" src="../../../../common/images/mine/无记录.png"> -->
          <div class="list" v-for="(item,index) in DiamondList " :key="index">
            <div class="list-text">
              <span class="list-type">{{user.userid==item.praiserId?'[收入]':'[支出]'}}</span>
              <span class="list-content">{{item.praiserName}} 获得 {{item.presenterName}} 的赞赏</span>
              <!-- 长度大于16的截取14个+省略号 -->
            </div>
            <div class="list-time">
              <div> {{((new Date()).getTime()/1000-item.createTime)/60/60/24>=1?parseInt(((new Date()).getTime()/1000-item.createTime)/60/60/24)+'天前': (((new Date()).getTime()/1000-item.createTime)/60/60>=1?parseInt(((new Date()).getTime()/1000-item.createTime)/60/60)+'小时前': (((new Date()).getTime()/1000-item.createTime)/60>=1?parseInt(((new Date()).getTime()/1000-item.createTime)/60)+'分钟前':'刚刚'))}}</div>
              <div class="list-score">
                <span class="change-color">{{user.userid==item.praiserId?'+':'-'}}{{item.praiserNumber+item.coinNumber}}</span> 梵钻</div>
            </div>
            <!-- <div class="list-score">{{user.userid==item.praiserId?'+':'-'}}{{item.praiserNumber+item.coinNumber}}</div> -->
            <div class="list-line"></div>
          </div>
        </div>
        <div class="noRecord" v-if="DiamondList.length==0">
          <span>暂无记录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import { mapGetters } from "vuex";
import { Loading, Toast } from "vux";
import { priceFilter } from "@/common/js/letterFilter";
var page = 1;
var count = 6;
export default {
  data() {
    return {
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
      fullHeight: document.documentElement.clientHeight,
      optionTab: ["全部", "收入", "支出"],
      nowOptionIndex: 0,
      DiamondList: [],
      totalPage: "",
      praiserInfo: "",
      presenterInfo: "",
      convertibleNum: 0,
    };
  },
  created() {
    // this.diamondNum = this.$route.params.diamondNum;
    var praiserInfo = 1;
    var presenterInfo = "";
    this.$vux.loading.show({
      text: "加载中..."
    });
    this.requireData(praiserInfo, presenterInfo);
    this.requireUserPraise();
  },
  mounted() {
    this.$nextTick(() => {
      this.exchangewrapper = new BScroll(
        this.$refs.exchangewrapper,
        this.options
      );
      this.exchangewrapper.on("pullingUp", () => {
        // console.log("上拉加载");
        // console.log(this.totalPage);
        // console.log(page);
        if (this.totalPage == page) {
          // console.log("加载完成");
          return;
        } else {
          page++;
          this.requireData(this.praiserInfo, this.presenterInfo);
        }
      });
    });
  },
  computed: {
    ...mapGetters(["user"])
  },
   filters: {
    priceFilter
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
  methods: {
     // 请求接口获取用户赞数量
    requireUserPraise(){
      let url = 'ding/dingUser/getUserByUserId?userId='+this.user.userid
      this.$api.get(url).then(res=>{
        if(res.code==200){
          this.convertibleNum = res.data.convertibleGold
          this.$vux.loading.hide()
        }else{
          this.$vux.loading.hide()
        } 

      })
    },
    selectOption(e) {
      this.$vux.loading.show({
        text: "加载中..."
      });
      page = 1;
      this.DiamondList = [];
      this.nowOptionIndex = e.target.dataset.index;
      switch (parseInt(e.target.dataset.index)) {
        case 0:
          var praiserInfo = 1;
          var presenterInfo = "";
          this.requireData(praiserInfo, presenterInfo);
          break;
        case 1:
          var praiserInfo = 1;
          var presenterInfo = "";
          this.requireData(praiserInfo, presenterInfo);
          break;
        case 2:
          this.$vux.loading.hide();
          this.DiamondList = [];
          // var praiserInfo = "";
          // var presenterInfo = 1;
          // this.requireData(praiserInfo, presenterInfo);
          break;
      }
    },
    requireData(praiserInfo, presenterInfo) {
      this.praiserInfo = praiserInfo;
      this.presenterInfo = presenterInfo;
      let urlQuery = {
        pageNo: page,
        pageSize: count,
        userId: this.user.userid,
        praiserInfo: praiserInfo,
        presenterInfo: presenterInfo
      };
      this.$api
        .get("/appreciation/fzAppreciationRecord/getList", urlQuery)
        .then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.totalPage = Math.ceil(res.data.count / count);
            let list = this.DiamondList;
            for (let i = 0; i < res.data.list.length; i++) {
              list.push(res.data.list[i]);
            }
            this.DiamondList = list;
            // console.log(this.DiamondList);
            // console.log(this.totalPage);
          } else if (res.code == 11001) {
            this.DiamondList = [];
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "14em"
            });
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "14em"
            });
          }
          this.$vux.loading.hide();
          this.$nextTick(() => {
            setTimeout(() => {
              this.pullingDownUp();
            }, 500);
          });
        });
    },
    pullingDownUp() {
      this.exchangewrapper.finishPullUp(); //告诉 better-scroll 数据已加载
      this.exchangewrapper.refresh(); //重新计算元素高度
    }
  }
};
</script>
  
<style lang="less" scoped>
@import "~common/css/defult.less";
* {
  box-sizing: border-box;
}
.exchangewrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 110;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
  .exchange {
    .exchange-head {
      width: 100%;
      height: 340 / @rem;
      padding: 48 / @rem 0 75 / @rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      background-color: #f8f8f8;
      .exchange-head-img {
        width: 83 / @rem;
        height: 83 / @rem;
      }

      .exchange-money {
        font-size: 48 / @rem;
        font-weight: bold;
        color: #222222;
        text-align: center;
        margin-top: 38 / @rem;
      }
      .exchange-text {
        font-size: 26 / @rem;
        color: #888888;
        text-align: center;
        margin-top: 25 / @rem;
      }
    }
    .exchange-tab {
      display: flex;
      background-color: #fff;
      .tab-name {
        flex: 1;
        text-align: center;
        cursor: pointer;
        .name {
          display: inline-block;
          width: 70 / @rem;
          height: 113 / @rem;
          font-size: 32 / @rem;
          color: #888888;
          line-height: 113 / @rem;
        }
        .border-bottom {
          color: #424242;
          border-bottom: 2px solid #424242;
        }
      }
    }
    .exchange-list {
      margin-top: 20 / @rem;
      .list-img {
        margin-top: 140 / @rem;
      }
      .list {
        width: 100%;
        height: 154 / @rem;
        padding: 20 / @rem 40 / @rem;
        // border-bottom: 1px solid #f0f0f0;
        background-color: #fff;
        position: relative;
        .list-text {
          display: flex;
          flex-direction: row;
          align-items: center;
          .list-type {
            display: inline-block;
            height: 50 / @rem;
            line-height: 50 / @rem;
            font-size: 28 / @rem;
            color: #363636;
            font-weight: bold;
          }
          .list-content {
            width: 560 / @rem;
            margin-left: 28 / @rem;
            height: 50 / @rem;
            line-height: 50 / @rem;
            font-size: 30 / @rem;
            color: #666666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .list-time {
          height: 40 / @rem;
          font-size: 22 / @rem;
          line-height: 40 / @rem;
          color: #aaa;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-left: 107 / @rem;
          margin-top: 10 / @rem;
          .change-color {
            color: #eb613d;
          }
        }
        .list-line {
          position: absolute;
          left: 0;
          bottom: 0;
          margin-left: 148 / @rem;
          width: 602 / @rem;
          height: 1px;
          background-color: #eee;
        }
        // .list-score {
        //   height: 136 / @rem;
        //   line-height: 136 / @rem;
        //   font-size: 28 / @rem;
        //   color: #555;
        // }
      }
    }
    .noRecord {
      color: #666;
      font-size: 24 / @rem;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 120 / @rem;
    }
  }
}
</style>
