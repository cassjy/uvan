<template>
  <div class="primary">
    <div class="banner">
      <img src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/42f7be0da9d942f2921f2496f784682e" />
    </div>
    <div class="content">
      <div class="role">
        <h2>投票规则</h2>
        <p>请选择<span>5位</span>在双11期间（10-11月）表现优异的同学并附上具体提名理由。</p>
      </div>
      <div class="vote-list" id="list">
        <h2>投票列表</h2>
        <div class="list-wrapper">
          <div class="item" v-for="(person,index) in localSelectedPerson" :key="index" :id="index">
            <div class="header">
              <div class="left">
                <img :src="person.avatar?person.avatar:'https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/696ee4f1455e43b88b78a110d0b803fb'" />
                <h3>{{person.name?person.name:'候选人'+(index+1)}}</h3>
              </div>
              <div class="right" @click="toOrganizePage(index)">
                <span>{{person.name?'重选':'请选择'}}</span>
                <i class="iconfont icon-arrow-right1"></i>
              </div>
            </div>
            <div class="text">
              <textarea placeholder="请输入投票理由" @input="monitorIn($event,index)" :value="words[index].value" oninput="if(value.length>125)value=value.slice(0,250)" maxlength="250"></textarea>
              <div class="number-of-words" v-if="words[index].length<10">还需输入<span>{{words[index].num}}</span>个字</div>
            </div>
          </div>
          <button :class="[personNum==5&&!isVote?'chagesColor':'']" @click="submit" :disabled="isVote">提交（{{personNum}}/5）</button>
        </div>
      </div>
    </div>
    <!-- <div @click="toOrganizePage"><span>初选</span></div>
        <div>
            <ul v-for="(item,index) in localSelectedPerson" :key="index">
                <li>{{item.name}}</li>
            </ul>
        </div> -->
    <!-- <router-view></router-view> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Loading, Toast } from "vux";
var fromWhere;
export default {
  data() {
    return {
      localSelectedPerson: [],
      personNum: 0,
      isVote: false,
      fromWhere: "",
      words: [
        { num: 10, length: 0, value: "" },
        { num: 10, length: 0, value: "" },
        { num: 10, length: 0, value: "" },
        { num: 10, length: 0, value: "" },
        { num: 10, length: 0, value: "" }
      ] //字数数组
    };
  },
  beforeRouteEnter(to, from, next) {
    console.log("路由信息");
    console.log(from.name);
    if (from.name == "organize") {
      fromWhere = from.name;
      //  _this.$nextTick(function() {
      //   document.getElementById('0').scrollIntoView();
      // });
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log("我离开了路由");
    //  监听路由离开存储评选候选人理由
    window.localStorage.setItem("words", JSON.stringify(this.words));
    next();
  },
  created() {
    // 权限设置
    this.qualification();
    if (fromWhere == "organize") {
      this.$nextTick(function() {
        document.getElementById("list").scrollIntoView();
      });
    }
    if (!!JSON.parse(window.localStorage.getItem("localSelectedPerson"))) {
      this.localSelectedPerson = JSON.parse(
        window.localStorage.getItem("localSelectedPerson")
      );
      this.words =
        JSON.parse(window.localStorage.getItem("words")) || this.words;
      //  判断已选候选人数量
      let num = 0;
      for (let i = 0; i < this.localSelectedPerson.length; i++) {
        if (this.localSelectedPerson[i].name) {
          num += 1;
        }
      }
      this.personNum = num;
    } else {
      this.localSelectedPerson = [0, 1, 2, 3, 4]; //初始状态
      window.localStorage.setItem(
        "localSelectedPerson",
        JSON.stringify(this.localSelectedPerson)
      );
    }
    console.log(this.localSelectedPerson);
    // this.localSelectedPerson = JSON.parse(window.localStorage.getItem("localSelectedPerson")) || [0,1,2,3,4];
  },
  mounted() {},
  computed: {
    ...mapGetters(["dingdingUser", "user"])
  },
  components: {
    Loading
  },
  methods: {
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      console.log("scroll..............................");
      console.log(scrollTop);
    },
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
            if (res.data.primary == 1) {
              // 自动跳转
              this.$router.replace({ name: "voteComplete" });
            }
          } else {
            console.log("获取权限失败");
          }
        })
        .catch(err => {
          this.$vux.loading.hide();
        });
    },
    //  to通讯录页面
    toOrganizePage(index) {
      this.$router.push({
        name: "organize",
        params: { from: "primary", id: index }
      });
    },

    //提交
    submit() {
      // 检测候选人是否选择完毕
      let primaryDetailList = [];
      var obj = {};
      for (let i = 0; i < this.localSelectedPerson.length; i++) {
        if (!this.localSelectedPerson[i].name) {
          this.$vux.toast.show({
            text: "请选择5位候选人！",
            type: "text",
            width: "20em",
            time: "1000"
          });
          return;
        } else {
          obj.votersUserId = this.localSelectedPerson[i].userid;
          obj.userName = this.localSelectedPerson[i].name;
          obj.jobNumber = this.localSelectedPerson[i].jobnumber;
          obj.position = this.localSelectedPerson[i].position;
          obj.department = this.localSelectedPerson[i].departmentName;
          obj.departmentId = this.localSelectedPerson[i].departmentId;
          obj.avatar = this.localSelectedPerson[i].avatar;
          obj.reason = "";
        }
        primaryDetailList.push(obj);
        obj = {};
      }
      console.log(primaryDetailList);
      //   检测投票理由是否已经完善
      for (let x = 0; x < this.words.length; x++) {
        if (this.words[x].length < 10) {
          this.$vux.toast.show({
            text: "请完善投票理由！",
            type: "text",
            width: "20em",
            time: "1000"
          });
          return;
        } else {
          primaryDetailList[x].reason = this.words[x].value;
        }
      }
      this.$vux.loading.show({
        text: "提交中..."
      });
      console.log(primaryDetailList);
      console.log(
        "..............................测试.............................."
      );
      console.log(this.dingdingUser);
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
        nomineeBy: this.dingdingUser.name,
        jobNumber: this.dingdingUser.jobnumber,
        position: this.dingdingUser.position,
        department: departmentNameString,
        departmentId: departmentString,
        wishPrimaryDetailList: primaryDetailList
      };
      console.log(data);
      this.$api
        .post("wish/wishPrimary/addNomination", data, "application/json")
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.$vux.loading.hide();
            this.$router.replace({ name: "voteComplete" });
          } else if (res.code == 12002) {
            this.isVote = true;
            this.$vux.loading.hide();
            this.$vux.toast.show({
              text: "亲！您已经投过票了。",
              type: "text",
              width: "18em",
              time: "1500"
            });
          } else if (res.code == 12003) {
            this.isVote = true;
            this.$vux.loading.hide();
            this.$vux.toast.show({
              text: "亲！该活动已经结束了！",
              type: "text",
              width: "18em",
              time: "1500"
            });
          } else {
            this.$vux.loading.hide();
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "18em",
              time: "1500"
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: "系统错误！",
            type: "text",
            width: "18em",
            time: "1500"
          });
        });
      console.log("11111111111111111111111");
    },

    // 监听各个候选人投票理由
    monitorIn(event, id) {
      switch (parseInt(id)) {
        case 0:
          this.words.splice(0, 1, {
            num: 10 - this.stringTrim(event.target.value).length,
            length: this.stringTrim(event.target.value).length,
            value: event.target.value
          });
          break;
        case 1:
          this.words.splice(1, 1, {
            num: 10 - this.stringTrim(event.target.value).length,
            length: this.stringTrim(event.target.value).length,
            value: event.target.value
          });
          break;
        case 2:
          this.words.splice(2, 1, {
            num: 10 - this.stringTrim(event.target.value).length,
            length: this.stringTrim(event.target.value).length,
            value: event.target.value
          });
          break;
        case 3:
          this.words.splice(3, 1, {
            num: 10 - this.stringTrim(event.target.value).length,
            length: this.stringTrim(event.target.value).length,
            value: event.target.value
          });
          break;
        case 4:
          this.words.splice(4, 1, {
            num: 10 - this.stringTrim(event.target.value).length,
            length: this.stringTrim(event.target.value).length,
            value: event.target.value
          });
          break;
      }
    },
    // 字符串去空格
    stringTrim(str) {
      var result = str.replace(/\s/g, "");
      return result;
    }
  }
};
</script>
<style lang="less">
@import "~common/css/defult.less";
.primary {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  z-index: 10;
  overflow: scroll;
  .banner {
    width: 100%;
    height: auto;
  }
  .content {
    padding: 0 40 / @rem 60 / @rem;
    background-color: #060606;
    .role {
      width: 100%;
      height: 250 / @rem;
      padding: 40 / @rem 55 / @rem 55 / @rem;
      margin-bottom: 36 / @rem;
      box-sizing: border-box;
      background-color: #f8f8f8;
      h2 {
        color: #060606;
        text-align: center;
        font-size: 34 / @rem;
        font-weight: bold;
        margin-bottom: 30 / @rem;
      }
      p {
        color: #666;
        font-size: 24 / @rem;
        line-height: 48 / @rem;
        text-align: center;
        span {
          color: #eb613d;
        }
      }
    }
    .vote-list {
      background-color: #f8f8f8;
      h2 {
        color: #060606;
        text-align: center;
        font-size: 34 / @rem;
        font-weight: bold;
        height: 112 / @rem;
        line-height: 112 / @rem;
        border-bottom: 1px solid #dddddd;
      }
      .list-wrapper {
        width: 100%;
        box-sizing: border-box;
        padding: 40 / @rem 40 / @rem 60 / @rem;
        .item {
          margin-bottom: 80 / @rem;
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20 / @rem;
            .left {
              display: flex;
              flex-direction: row;
              align-items: center;
              color: #484848;
              font-size: 30 / @rem;
              font-weight: bold;
              img {
                width: 70 / @rem;
                height: 70 / @rem;
                border-radius: 100%;
                margin-right: 20 / @rem;
              }
            }
            .right {
              display: flex;
              flex-direction: row;
              align-items: center;
              color: #666666;
              height: 70 / @rem;
              padding-left: 30 / @rem;
              font-size: 30 / @rem;
              .icon-arrow-right1 {
                color: #ababab;
                font-size: 36 / @rem;
              }
            }
          }
          .text {
            position: relative;
            height: 112 / @rem;
            textarea {
              width: 100%;
              height: 110 / @rem;
              line-height: 42 / @rem;
              font-size: 28 / @rem;
              color: #8b8b8b;
              outline: none;
              border: none;
              padding: 20 / @rem;
              box-sizing: border-box;
              background-color: #ebebeb;
            }
            .number-of-words {
              position: absolute;
              right: 20 / @rem;
              bottom: 20 / @rem;
              color: #bebebe;
              font-size: 22 / @rem;
              span {
                color: #666666;
              }
            }
            textarea[disabled],
            textarea:disabled,
            textarea.disabled {
              color: #888;
              -webkit-text-fill-color: #888;
              -webkit-opacity: 1;
              opacity: 1;
            }
          }
          .border {
            border: 1px solid #f13f1b;
          }
        }
        button {
          color: #6d6d6d;
          font-size: 30 / @rem;
          font-weight: bold;
          width: 100%;
          height: 95 / @rem;
          background-color: #424242;
          border-radius: 60 / @rem;
        }
        .chagesColor {
          color: #fff;
        }
      }
    }
  }
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    font-size: 24 / @rem;
    color: #bebebe;
  }

  input:-moz-input-placeholder,
  textarea:-moz-input-placeholder {
    font-size: 24 / @rem;
    color: #bebebe;
  }

  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    font-size: 24 / @rem;
    color: #bebebe;
  }
}
</style>
