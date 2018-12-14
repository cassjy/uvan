<template>
  <div class="checkList">
    <div class="title1">我的已选信息</div>
    <div class="content-list">
      <div
        class="wrapper"
        v-for="(item,index) in selectedCandidates"
        :key="index"
      >
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
            <div
              class="right"
              @click="cancelIt(index)"
            >
              <div class="cancel">取消选择</div>
            </div>
          </div>
          <div class="user-profile">
            <div
              class="card-content"
              v-if="item.packup"
            >
              <div
                style="word-wrap:break-word"
                v-if="(item.personalProfile).length<=23"
              >{{(item.personalProfile).substr(0,23)}}
                <span
                  @click="openMore(index)"
                  v-if="(item.photoList).length>0"
                >...<a style="text-decoration:underline;color:#4491fa;">展开</a></span>
              </div>
              <div
                style="word-wrap:break-word"
                v-if="(item.personalProfile).length>23"
              >{{(item.personalProfile).substr(0,46)}}
                <span @click="openMore(index)">...<a style="text-decoration:underline;color:#4491fa;">展开</a></span>
              </div>
            </div>
            <div
              class="card-content"
              style="word-wrap:break-word"
              v-if="!item.packup"
            >
              {{item.personalProfile}}
              <span
                class="content-open"
                v-if="(item.personalProfile).length>60&&(item.photoList).length==0"
                @click="closeMore(index)"
                style="color:#4491fa;"
              >收起</span>
            </div>
          </div>
          <div
            class="user-photo"
            v-if="!item.packup"
          >
            <div class="addPhoto">
              <!-- <div class="photo"> -->
              <img
                :src="item.img"
                v-for="(item,id) in item.photoList"
                :preview="index"
                :key="id"
              />
              <!-- </div> -->
            </div>
          </div>
          <p v-if="item.photoList.length>0&&!item.packup"><a @click="closeMore(index)">收起</a></p>
        </div>
        <div class="border"></div>
      </div>
      <div
        class="whitePlace"
        v-if="isIos"
      ></div>
      <div
        class="norecord"
        v-if="selectedCandidates.length==0"
      >暂无已选信息~</div>
    </div>
    <div class="submitSelected">
      <button
        class="cancelBtn"
        @click="returnPage"
      >取消</button>
      <button
        :class="[selectedCandidates.length==5?'chagesColor':'']"
        @click="submitSelected"
      >提交（{{selectedCandidates.length}}/5）</button>
    </div>
  </div>
</template>
<script>
import PullTo from "vue-pull-to";
import { Loading, LoadMore, Toast } from "vux";
import { mapGetters } from "vuex";
// import MobileDetect from "mobile-detect";
export default {
  data() {
    return {
      content:
        "萨达速度阿快的萨德阿萨德萨达速度阿快的萨的萨德阿萨德萨达速度阿快的萨的萨德阿萨德萨达速度阿快的萨的萨德阿萨德萨达速度阿快的萨的萨德阿萨德萨达速度阿快的萨的萨德阿萨德萨达速度阿快的萨",
      packup: true,
      selectedCandidates: [], //已选人员数组
      photoList: [
        "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/42f7be0da9d942f2921f2496f784682e",
        "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/42f7be0da9d942f2921f2496f784682e",
        "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/42f7be0da9d942f2921f2496f784682e",
        "https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/42f7be0da9d942f2921f2496f784682e"
      ],
      norecord: false,
      isIos: false, // 检测是否为苹果手机
    };
  },
  created() {
    this.selectedCandidates =
      JSON.parse(window.localStorage.getItem("selectedCandidates")) || [];
    console.log(this.selectedCandidates);
    var u = navigator.userAgent;

    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端.
    console.log("测试是否为ios11111111");
    console.log(isiOS);
    if (isiOS) {
      this.isIos = true;
    } else {
      this.isIos = false;
    }
  },
  computed: {
    ...mapGetters(["dingdingUser", "user"])
  },
  methods: {
    // 展示更多
    openMore(index) {
      console.log(parseInt(index));
      this.selectedCandidates[parseInt(index)].packup = false;
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
      this.selectedCandidates[parseInt(index)].packup = true;
    },
    // 取消选择候选人
    cancelIt(index) {
      console.log(this.selectedCandidates);
      this.selectedCandidates[parseInt(index)].checked = false;
      this.selectedCandidates.splice(parseInt(index), 1);
      console.log("删除后数组");
      console.log(this.selectedCandidates);
      window.localStorage.setItem(
        "selectedCandidates",
        JSON.stringify(this.selectedCandidates)
      );
    },
    // 返回上一层
    returnPage() {
      this.$router.replace({ name: "check" });
    },

    // 提交
    submitSelected() {
      if (this.selectedCandidates.length < 5) {
        this.$vux.toast.show({
          text: "亲！请选五位候选人哦~",
          type: "text",
          width: "20em",
          time: "1500"
        });
        return;
      }
      let userIdList = [];
      for (let i = 0; i < this.selectedCandidates.length; i++) {
        userIdList.push({ userId: this.selectedCandidates[i].userId });
      }
      console.log(userIdList);
      this.$vux.loading.show({
        text: "提交中..."
      });
      var departmentString = ""; //部门
      var departmentNameString = ""; //部门名称字符串
      for (let i = 0; i < this.dingdingUser.dingDepartmentList.length; i++) {
        departmentString +=
          this.dingdingUser.dingDepartmentList[i].departmentId + ",";
        departmentNameString +=
          this.dingdingUser.dingDepartmentList[i].name + " ";
      }
      let data = {
        userId: this.dingdingUser.userid,
        userName: this.dingdingUser.name,
        jobNumber: this.dingdingUser.jobnumber,
        position: this.dingdingUser.position,
        department: departmentNameString,
        departmentId: departmentString,
        avatar: this.dingdingUser.avatar,
        userIdList: userIdList
      };
      console.log(data);
      this.$api
        .post("wish/wishShortlist/secondBallot", data, "application/json")
        .then(res => {
          console.log(res);
          this.$vux.loading.hide();
          if (res.code == 200) {
            window.localStorage.setItem("selectedCandidates", "[]");
            this.$router.replace({ name: "checkComplete" });
          } else if (res.code == 12003) {
            // this.isVote = true;
            this.$vux.loading.hide();
            this.$vux.toast.show({
              text: "亲！该活动已经结束了！",
              type: "text",
              width: "18em",
              time: "1500"
            });
          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "warn",
              width: "10em",
              time: 1500
            });
          }
        })
        .catch(err => {
          this.$vux.loading.hide();
          console.log(err);
          this.$vux.toast.show({
            text: "服务器异常！",
            type: "warn",
            width: "10em",
            time: 1500
          });
        });
    }
  }
};
</script>
<style lang="less">
@import "~common/css/defult.less";
.checkList {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 10;
  // overflow: scroll;
  .title1 {
    color: #888888;
    font-size: 28 / @rem;
    width: 100%;
    height: 80 / @rem;
    padding-left: 40 / @rem;
    box-sizing: border-box;
    line-height: 80 / @rem;
    background-color: #fafafa;
  }
  .content-list {
    width: 100%;
    height: 1158 / @rem;
    overflow: scroll;
    padding-bottom: 240 / @rem;
    .whitePlace {
      width: 100%;
      height: 110 / @rem;
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
        // .photo {
        //   width: 210 / @rem;
        //   height: 210 / @rem;
        //   margin-right: 20 / @rem;
        //   margin-bottom: 20 / @rem;
        //   font-size: 0;
        //   position: relative;
        img {
          width: 31%;
          height: 210 / @rem;
          margin-right: 20 / @rem;
          margin-bottom: 20 / @rem;
          font-size: 0;
          position: relative;
          z-index: 10;
        }
        // }
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
    .border {
      width: 100%;
      height: 10 / @rem;
      background-color: #fafafa;
    }
    .norecord {
      color: #aaa;
      font-size: 24 / @rem;
      text-align: center;
      margin-top: 260 / @rem;
    }
  }
  .submitSelected {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    height: 100 / @rem;
    // padding: 0 80 / @rem;
    box-sizing: border-box;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    button {
      color: #6d6d6d;
      flex: 1;
      height: 100 / @rem;
      font-size: 28 / @rem;
      font-weight: bold;
      background-color: #424242;
      // border-radius: 60 / @rem;
    }
    .cancelBtn {
      color: #666666;
      background-color: #f6f6f6;
    }
    .chagesColor {
      color: #fff;
    }
  }
}
</style>
