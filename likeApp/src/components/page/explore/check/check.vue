<template>
  <div class="cWrapper">
    <div class="check">
      <div class="title" v-if="headerShow">
        <h2>复选规则</h2>
        <p>请投选5位候选人，您的一票很重要，请认真投选；</p>
        <p>投选同二级部门，分数将折半。</p>
      </div>
      <div class="content">
        <div class="votingList">
          <div class="ipt">
            <input placeholder="输入部门/名称检索" v-model="information" />
            <div class="sousuo-icon" @click="search">
              <i class="iconfont icon-sousuo1"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="userList">
        <pull-to :is-top-bounce="false" :is-throttle-scroll="false" @infinite-scroll="loadmore" @scroll="scroll">
          <div class="wrapper" v-for="(item,index) in userList" :key="index">
            <div class="item">
              <div class="user-info">
                <div class="left">
                  <img :src="item.avatar?item.avatar:'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/696ee4f1455e43b88b78a110d0b803fb'" />
                  <div class="message">
                    <h3>{{item.userName}}</h3>
                    <p v-if="item.department.length<=12">{{item.department}}</p>
                    <p v-if="item.department.length>12">{{item.department.substr(0,12)}}...</p>
                    <p>{{item.position}}</p>
                  </div>
                </div>
                <div class="right" v-if="!item.checked" @click="chooseIt(index)">
                  <div class="cancel">选择TA</div>
                </div>
                <div class="right" v-if="item.checked" @click="cancelIt(index)">
                  <div class="cancel changeColor">取消选择</div>
                </div>
              </div>
              <div class="user-profile">
                <div class="card-content" v-if="item.packup">
                  <div style="word-wrap:break-word" v-if="(item.personalProfile).length<=23">{{(item.personalProfile).substr(0,23)}}
                    <span @click="openMore(index)" v-if="(item.photoList).length>0">...<a style="text-decoration:underline;color:#4491fa;">展开</a></span>
                  </div>
                  <div style="word-wrap:break-word" v-if="(item.personalProfile).length>23">{{(item.personalProfile).substr(0,46)}}
                    <span @click="openMore(index)">...<a style="text-decoration:underline;color:#4491fa;">展开</a></span>
                  </div>
                </div>
                <div class="card-content" style="word-wrap:break-word" v-if="!item.packup">
                  {{item.personalProfile}}
                  <span class="content-open" v-if="(item.personalProfile).length>60&&(item.photoList).length==0" @click="closeMore(index)" style="color:#4491fa;">收起</span>
                </div>
              </div>
              <div class="user-photo" v-if="!item.packup">
                <div class="addPhoto">
                  <!-- <div class="photo" v-for="(item,index) in item.photoList" :key="index"> -->
                  <img v-for="(item,id) in item.photoList" :key="id" :preview="index" v-lazy="item.img" />
                  <!-- </div> -->
                </div>
              </div>
              <p v-if="item.photoList.length>0&&!item.packup"><a @click="closeMore(index)">收起</a></p>
            </div>
            <div class="border"></div>
          </div>
          <load-more class="loading-more" v-if="showLoadingmore" tip="正在加载" background-color="#eee"></load-more>
          <load-more v-if="showLoadingend" :show-loading="false" tip="没有更多了" background-color="#eee"></load-more>
          <div class="not-anything" v-if="without">未找到相关信息哦~</div>
          <div class="whitePlace" v-if="isIos"></div>
        </pull-to>
        <!-- <div class="noRecord" v-if="noRecord">暂无数据，请稍后重试~</div> -->
      </div>
      <!-- <div class="whitePlace" v-if="isIos"></div> -->
      <router-view></router-view>
    </div>
    <div class="Ckecked">
      <button @click="toCheckList">查看已选</button>
    </div>
  </div>
</template>
<script>
import PullTo from "vue-pull-to";
import { Loading, LoadMore, Toast } from "vux";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      content:
        "萨达速度阿快的萨德阿萨德萨达速度阿快的萨的萨德阿萨德萨达速度阿快的萨的萨德阿萨德萨达速度阿快的萨的萨德阿萨德萨达速度阿快的萨的萨德阿萨德萨达速度阿快的萨的萨德阿萨德萨达速度阿快的萨",
      packup: true,
      showLoadingmore: false, //是否启动加载更多动画
      showLoadingend: false, //是否加载完毕
      name: "", //部门名称
      pageNo: 1, //页码
      pageSize: 10, // 一页十条
      totalPageSize: 0,
      checkId: -1, //选中展开
      userList: [], //用户列表
      information: "", //用户输入的搜索信息
      without: false,
      headerShow: true, //滚动时隐藏头部
      noRecord: false, //暂无数据
      isIos: false
    };
  },
  beforeRouteUpdate(to, from, next) {
    console.log("路由更新");
    console.log(from);
    if (from.name == "checkList") {
      this.pageNo = 1; //页码重置
      this.pageSize = 10; // 一页十条重置
      this.totalPageSize = 0; //总页数
      this.userList = []; //数组置空
      this.showLoadingend = false;
      this.requireShortlistedData();
    }
    next();
  },
  created() {
    // 权限设置
    this.qualification();
    let selectedCandidates =
      JSON.parse(window.localStorage.getItem("selectedCandidates")) || [];
    selectedCandidates.forEach((item, index, arr) => {
      arr[index].packup = true;
    });
    window.localStorage.setItem(
      "selectedCandidates",
      JSON.stringify(selectedCandidates)
    );
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
      this.isIos = true;
    } else {
      this.isIos = false;
    }
    this.requireShortlistedData();
  },
  components: {
    Loading,
    LoadMore,
    PullTo
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    // 权限检测
    qualification() {
      this.$vux.loading.show({
        text: "加载中..."
      });
      let url = "wish/wishShortlist/qualification?userId=" + this.user.userid;
      this.$api
        .get(url)
        .then(res => {
          console.log(res);
          this.$vux.loading.hide();
          if (res.code == 200) {
            if (res.data.level == 2) {
              // 自动跳转
              this.$router.replace({ name: "checkComplete" });
            }
          } else {
            console.log("获取权限失败");
          }
        })
        .catch(err => {
          this.$vux.loading.hide();
        });
    },
    // 加载入围人员列表
    requireShortlistedData(loaded, state) {
      this.$vux.loading.show({
        text: "加载中..."
      });
      let url =
        "wish/wishShortlist/getQualification?name=" +
        this.name +
        "&pageNo=" +
        this.pageNo +
        "&pageSize=" +
        this.pageSize;
      this.$api.get(url).then(res => {
        this.$vux.loading.hide();
        if (res.code == 200) {
          this.without = false;
          let array = this.userList;
          for (let i = 0; i < res.data.list.length; i++) {
            array.push(res.data.list[i]);
          }
          this.totalPageSize = Math.ceil(res.data.count / this.pageSize);
          // 只有一页
          if(this.totalPageSize==1){
            this.showLoadingend = true
          }
          let peopleList =
            JSON.parse(window.localStorage.getItem("selectedCandidates")) || [];
          for (let x = 0; x < array.length; x++) {
            for (let y = 0; y < peopleList.length; y++) {
              if (array[x].id == peopleList[y].id) {
                console.log("true");
                array[x].checked = peopleList[y].checked;
                // array.splice(x, 1, peopleList[y]);
              }
            }
          }
          this.userList = array;
          console.log(
            "......................................整合后数组......................................."
          );
          console.log(this.userList);
          if (state == "refresh") {
            loaded("done");
          }
          this.$nextTick(() => {
            setTimeout(() => {
              this.$previewRefresh();
            }, 300);
          });
          // this.noRecord = false;
        } else if (res.code == 12001) {
          this.without = true;
          this.showLoadingmore = false;
          // this.noRecord = true;
        } else {
          this.without = true
          this.showLoadingmore = false;
          // this.noRecord = true;
        }
        console.log(res);
      });
    },

    //  滚动事件
    scroll(event) {
      if (event.target.scrollTop == 0) {
        this.headerShow = true;
      } else {
        this.headerShow = false;
      }
    },

    // 选择候选人
    chooseIt(index) {
      console.log(this.userList[parseInt(index)]);
      let selectedCandidates =
        JSON.parse(window.localStorage.getItem("selectedCandidates")) || [];
      console.log(selectedCandidates);
      if (selectedCandidates.length == 5) {
        this.$vux.toast.show({
          text: "亲！您已经选满五人了~",
          type: "text",
          width: "20em",
          time: "1000"
        });
        return;
      } else {
        this.userList[parseInt(index)].checked = true;
        // this.userList[parseInt(index)].packup = true;
        selectedCandidates.push(this.userList[parseInt(index)]);
        console.log(selectedCandidates);
        window.localStorage.setItem(
          "selectedCandidates",
          JSON.stringify(selectedCandidates)
        );
      }
    },

    // 取消选择候选人
    cancelIt(id) {
      this.userList[parseInt(id)].checked = false;
      console.log(this.userList[parseInt(id)]);
      let selectedCandidates =
        JSON.parse(window.localStorage.getItem("selectedCandidates")) || [];
      console.log("原来数组");
      console.log(selectedCandidates);
      selectedCandidates.forEach((item, index, arr) => {
        if (item.id == this.userList[parseInt(id)].id) {
          selectedCandidates.splice(index, 1);
        }
      });
      selectedCandidates = selectedCandidates;
      console.log("删除后数组");
      console.log(selectedCandidates);
      window.localStorage.setItem(
        "selectedCandidates",
        JSON.stringify(selectedCandidates)
      );
    },

    // 搜索功能
    search() {
      console.log(this.information);
      this.name = this.information;
      this.pageNo = 1; //页码重置
      this.pageSize = 10; // 一页十条重置
      this.totalPageSize = 0; //总页数
      this.userList = []; //数组置空
      this.showLoadingend = false;
      this.showLoadingmore = false;
      this.requireShortlistedData();
    },

    // 展示更多
    openMore(index) {
      console.log(parseInt(index));
      this.userList.forEach((item, id, arr) => {
        if (id == index) {
          arr[index].packup = false;
          console.log(arr[id]);
        }

        console.log(arr[index].packup);
      });
      this.userList = this.userList;
      console.log(this.userList);
      // this.userList[parseInt(index)].packup = false;
      // this.userList = this.userList
      // console.log(this.userList)
      this.$nextTick(() => {
        setTimeout(() => {
          this.$previewRefresh();
        }, 300);
      });
      // this.packup = false;
    },

    // 收起
    closeMore(index) {
      console.log(index);
      this.userList[parseInt(index)].packup = true;
    },

    // 已选类表页
    toCheckList() {
      this.$router.replace({ name: "checkList" });
    },

    // 下拉刷新
    // refresh(loaded) {
    //   console.log("刷新");
    //   this.pageNo = 1; //页码重置
    //   this.pageSize = 10; // 一页十条重置
    //   this.totalPageSize = 0; //总页数
    //   this.userList = []; //数组置空
    //   this.showLoadingend = false;
    //   this.requireShortlistedData(loaded, "refresh");
    // },

    // 加载更多
    loadmore() {
      if (this.pageNo == this.totalPageSize) {
        this.$vux.toast.show({
          text: "没有更多了~",
          type: "text",
          width: "14em",
          time: "1000"
        });
        this.showLoadingend = true;
        this.showLoadingmore = false;
      } else if (this.pageNo < this.totalPageSize) {
        this.showLoadingmore = true;
        this.pageNo++;
        this.showLoadingend = false;
        this.requireShortlistedData();
      }
    }
  }
};
</script>
<style lang="less">
@import "~common/css/defult.less";
.cWrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 10;
  // overflow: scroll;
}
.check {
  // position: fixed;
  // top: 0;
  // left: 0;
  width: 100%;
  height: 93%;
  background-color: #fff;
  z-index: 10;
  // overflow: scroll;
  .title {
    width: 100%;
    height: 200 / @rem;
    padding: 40 / @rem;
    box-sizing: border-box;
    background-color: #f7f9fa;
    h2 {
      color: #222222;
      font-size: 28 / @rem;
      font-weight: bold;
      margin-bottom: 10 / @rem;
    }
    p {
      color: #a8a9a9;
      font-size: 24 / @rem;
      line-height: 42 / @rem;
    }
  }
  .content {
    padding: 40 / @rem 40 / @rem 0;
    .votingList {
      background-color: #fff;
      margin-bottom: 40 / @rem;
      .ipt {
        width: 100%;
        height: 75 / @rem;
        padding: 0 40 / @rem;
        box-sizing: border-box;
        position: relative;
        input {
          width: 100%;
          height: 76 / @rem;
          line-height: 76 / @rem;
          color: #aaaaaa;
          font-size: 26 / @rem;
          border: 1px solid #d2d2d2;
          border-radius: 8 / @rem;
          padding-left: 20 / @rem;
          padding-right: 75 / @rem;
          box-sizing: border-box;
        }
        .sousuo-icon {
          width: 75 / @rem;
          height: 76 / @rem;
          position: absolute;
          right: 40 / @rem;
          top: 0 / @rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .icon-sousuo1 {
          color: #000000;
          font-size: 30 / @rem;
        }
      }
    }
  }
  .userList {
    height: 1080 / @rem;
    box-sizing: border-box;
    // overflow: scroll;
    // padding-bottom: 96 / @rem;
    // position: relative;
    .noRecord {
      position: absolute;
      left: 0;
      top: 20%;
      width: 100%;
      color: #aaa;
      font-size: 24 / @rem;
      text-align: center;
    }
    .item {
      padding: 40 / @rem 40 / @rem 25 / @rem;
      .user-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          img {
            width: 128 / @rem;
            height: 128 / @rem;
            border-radius: 100%;
            margin-right: 20 / @rem;
          }
          .message {
            font-size: 22 / @rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            h3 {
              color: #424242;
              font-weight: bold;
              margin-top: 4 / @rem;
              margin-bottom: 8 / @rem;
            }
            p {
              font-size: 18 / @rem;
              color: #888888;
              margin-top: 8 / @rem;
            }
          }
        }
        .right {
          .cancel {
            color: #666666;
            font-size: 28 / @rem;
            width: 156 / @rem;
            height: 74 / @rem;
            line-height: 74 / @rem;
            text-align: center;
            border-radius: 10 / @rem;
            border: 1px solid #d2d2d2;
            background-color: #f8f8f8;
          }
          .changeColor {
            color: #fff;
            background-color: #424242;
          }
        }
      }
      .user-profile {
        margin-top: 34 / @rem;
        .card-content {
          // float: right;
          width: 100%;
          font-size: 26 / @rem;
          line-height: 42 / @rem;
          color: #888888;
          margin-bottom: 16 / @rem;
          .content-more {
            color: #888;
          }
          .content-open {
            color: #5e7fb3;
          }
        }
      }
      .addPhoto {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        margin-top: 10 / @rem;
        img {
          width: 31%;
          height: 210 / @rem;
          margin-right: 20 / @rem;
          margin-bottom: 20 / @rem;
          font-size: 0;
          z-index: 10;
        }
        img:nth-of-type(3n) {
          margin-right: 0;
        }
      }
      p {
        text-align: right;
        a {
          color: #4491fa;
          font-size: 26 / @rem;
          text-decoration: underline;
        }
      }
    }
    .item:nth-of-type(1) {
      padding-top: 0;
    }
    .border {
      width: 100%;
      height: 10 / @rem;
      background-color: #fafafa;
    }
    .not-anything {
      color: #a8a9a9;
      font-size: 24 / @rem;
      text-align: center;
      margin-top: 120 / @rem;
    }
  }
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    font-size: 26 / @rem;
    color: #aaaaaa;
  }

  input:-moz-input-placeholder,
  textarea:-moz-input-placeholder {
    font-size: 26 / @rem;
    color: #aaaaaa;
  }

  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    font-size: 26 / @rem;
    color: #aaaaaa;
  }
}
.whitePlace {
  width: 100%;
  height:9%;
}
.Ckecked {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 7%;
  button {
    color: #fff;
    font-size: 28 / @rem;
    width: 100%;
    height: 100%;
    background-color: #424242;
  }
}
</style>
