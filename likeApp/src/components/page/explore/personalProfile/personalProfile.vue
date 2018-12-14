<template>
  <div class="personalProfile">
    <div class="header">
      <img src="https://after-sales-photo.oss-cn-shanghai.aliyuncs.com/stores/after-ales-photo/data/03bbddf0fd954b82842a2c377905edf8" />
    </div>
    <div class="content">
      <div class="title">个人简介</div>
      <div class="textarea">
        <textarea
          name=""
          id=""
          :rows="row"
          v-model="detailReason"
          placeholder="请从个人介绍、数据/工作展示等方面展示双11期间的工作成果"
        ></textarea>
        <div
          class="detail"
          v-html="detail"
        ></div>
      </div>
      <div class="addPhoto">
        <div
          class="photo"
          v-for="(item,index) in photoList"
          :key="index"
        >
          <img :src="item.img" />
          <div class="delete-btn">
            <i
              class="iconfont icon-cha"
              @click="deletUploadPic(index)"
            ></i>
          </div>
        </div>
        <div
          class="add"
          v-if="photoList.length<6"
        >
          <i class="icon-jia iconfont"></i>
          <input
            type="file"
            id="upload"
            accept="image/jpg"
            multiple
            @change="upload"
          >
        </div>
      </div>
    </div>
    <div class="btn">
      <button
        :class="[isMeet?'chagesColor':'']"
        @click="submit"
      >提交</button>
    </div>
  </div>
</template>
<script>
import { URL } from "api/url";
import Exif from "exif-js";
import { mapGetters } from "vuex";
import { Confirm, ConfirmPlugin } from "vux";
import { formatTime, getuuid, dataURLtoBlob } from "common/js/common.js";
export default {
  data() {
    return {
      row: 3,
      condition: 65,
      detailReason: "",
      baseUrl: "http://am.frp.uvanart.com:9200", //开发
      policyData: {},
      imgNum: 0, //已上传的图片数量
      fileArr: [],
      headerImage: "",
      photoList: [],
      isMeet: false, //输入字数是否满足要求
      // isVote: false
    };
  },
  created() {
    // 权限设置
    this.qualification();
    if (URL.mode == "dev") {
      this.baseUrl = "http://am.frp.uvanart.com:9200";
    } else if (URL.mode == "pre") {
      this.baseUrl = "https://amuat.uvanart.com";
    } else {
      this.baseUrl = "https://amfz.uvanart.com";
    }

    // 获取阿里图片上传签名
    this.getPolicy();
  },
  components: {
    Confirm
  },
  computed: {
    ...mapGetters(["user"]),
    detail: function() {
      var l = "";
      if (this.trim2(this.detailReason, "g").length < 20) {
        l =
          "还需要输入<span style='color: #888;'>" +
          (20 - this.trim2(this.detailReason, "g").length) +
          "</span>个字";
        this.isMeet = false;
      } else {
        this.isMeet = true;
      }
      return l;
    }
  },
  watch: {},
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
            if (res.data.shortlist == 2) {
              // 自动跳转
              this.$router.replace({ name: "completeProfile" });
            }
          } else {
            console.log("获取权限失败");
          }
        })
        .catch(err => {
          this.$vux.loading.hide();
        });
    },
    // 提交
    submit() {
      if (!this.isMeet) {
        this.$vux.toast.show({
          text: "请先完善个人简介！",
          type: "text",
          width: "20em",
          time: "1000"
        });
        return;
      }
      console.log(this.user);
      console.log(this.detailReason);
      this.$vux.loading.show({
        text: "提交中..."
      });
      let data = {
        userId: this.user.userid,
        personalProfile: this.detailReason,
        photoList: this.photoList
      };
      this.$api
        .post("wish/wishShortlist/addPersonalProfile", data, "application/json")
        .then(res => {
          console.log(res);
          this.$vux.loading.hide();
          if (res.code == 200) {
            this.$router.replace({ name: "completeProfile" });
          } else if (res.code == 12005) {
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
              type: "text",
              width: "20em",
              time: "1000"
            });
          }
        });
    },
    // 删除图片
    deletUploadPic(index) {
      console.log(this.photoList);
      var _this = this;
      this.$vux.confirm.show({
        title: "操作提示！",
        content: "是否删除所选图片？",
        onCancel() {
          console.log("取消");
        },
        onConfirm() {
          console.log("确认");
          _this.photoList.splice(index, 1);
          _this.photoList = _this.photoList;
          console.log(_this.photoList);
        }
      });
    },
    // 阿里图片获取签证
    getPolicy() {
      this.$api
        .get(this.baseUrl + "/a/aliyunimage/amAliyunImage/getPolicy", {})
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.policyData = {
              aliyunHost: res.data.host,
              policy: res.data.policy,
              OSSAccessKeyId: res.data.accessId,
              signature: res.data.signature,
              key: res.data.dir,
              callback: res.data.callBack
            };
            console.log("获取签证信息成功:");
            console.log(this.policyData);
          } else {
            console.log("获取签证失败");
          }
        });
    },

    //选择图片
    upload(e) {
      var _this = this;
      var files = e.target.files || e.dataTransfer.files;
      debugger;
      var a = false;
      for (var i = 0; i < files.length; i++) {
        if (files[i].type.indexOf("image") == -1) {
          a = true;
        }
      }
      if (a) {
        this.$vux.toast.show({
          text: "请选择图片文件",
          type: "text",
          width: "15em"
        });
        return;
      }
      var l = files.length;
      if (this.imgNum + l > 6) {
        this.$vux.toast.show({
          text: "图片最多上传六张",
          type: "text",
          width: "15em"
        });
        return;
      }
      this.$vux.loading.show({
        text: "正在上传"
      });
      console.log("图片文件");
      console.log(files);
      this.fileArr = files;
      this.imgPreview(files[0], files.length - 1, 0);
    },
    imgPreview(file, h, i) {
      console.log(i);
      let self = this;
      let Orientation;
      debugger;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= 100 * 1024 || file.type == "image/gif") {
            self.headerImage = this.result;
            self.postImg(file, h, i);
          } else {
            img.onload = function() {
              let data = self.compress(img, Orientation);
              self.headerImage = data;
              debugger;
              console.log(i);
              self.postImg(file, h, i);
            };
          }
        };
      }
    },
    postImg(file, h, i) {
      var _this = this;
      var dataDay = new Date(),
        dnum =
          dataDay.getFullYear().toString() +
          dataDay.getMonth().toString() +
          dataDay.getDate().toString() +
          dataDay.getMinutes().toString() +
          dataDay.getMilliseconds().toString() +
          dataDay.getSeconds().toString(); //文件上传加上时间戳，防止阿里服务器上的文件被覆盖
      var file2 = dataURLtoBlob(this.headerImage);
      console.log(this.policyData);
      var formData = new FormData();
      formData.append("OSSAccessKeyId", this.policyData.OSSAccessKeyId);
      formData.append("policy", this.policyData.policy);
      formData.append("signature", this.policyData.signature);
      formData.append("key", this.policyData.key + dnum + file.name);
      formData.append("success_action_status", "200");
      formData.append("callback", this.policyData.callback);
      formData.append("file", file2);
      this.$api
        .post(this.policyData.aliyunHost, formData, "multipart/form-data")
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            let src = {
              img: _this.policyData.aliyunHost + res.data
            };
            this.photoList.push(src);
            console.log("图片数组");
            console.log(this.photoList);
            if (h == i) {
              _this.$vux.loading.hide();
            }
            if (_this.fileArr[i + 1]) {
              _this.imgPreview(
                _this.fileArr[i + 1],
                _this.fileArr.length - 1,
                i + 1
              );
            }
          } else {
            if (_this.fileArr[i + 1]) {
              _this.imgPreview(
                _this.fileArr[i + 1],
                _this.fileArr.length - 1,
                i + 1
              );
            }
            return false;
          }
        })
        .catch(err => {
          console.log(err);
          if (_this.fileArr[i + 1]) {
            _this.imgPreview(
              _this.fileArr[i + 1],
              _this.fileArr.length - 1,
              i + 1
            );
          }
          return false;
        });
    },
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = (step * 90 * Math.PI) / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = (width * height) / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        debugger;
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jepg", 0.1);
      console.log("压缩前：" + initSize);
      console.log("压缩后：" + ndata.length);
      console.log(
        "压缩率：" + ~~((100 * (initSize - ndata.length)) / initSize) + "%"
      );
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },

    //获取字符串长度
    getByteLen(val) {
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }
      return len;
    },
    //去空格
    trim2(str, is_global) {
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g, "");
      if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
      }
      return result;
    }
  }
};
</script>
<style lang="less">
@import "~common/css/defult.less";
.personalProfile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 10;
  overflow: scroll;
  .header {
    width: 100%;
    height: auto;
    margin-bottom: 20 / @rem;
  }
  .content {
    .title {
      width: 100%;
      height: 66 / @rem;
      color: #222222;
      font-size: 28 / @rem;
      padding-left: 40 / @rem;
      box-sizing: border-box;
      line-height: 66 / @rem;
      border-bottom: 1px solid #f5f5f5;
    }
    .textarea {
      padding: 28 / @rem 40 / @rem 0;
      position: relative;
      textarea {
        width: 100%;
        box-sizing: border-box;
        line-height: 42 / @rem;
        font-size: 26 / @rem;
        color: #666;
        outline: none;
        border: none;
        background-color: #fff;
      }
      .detail {
        width: 250 / @rem;
        text-align: right;
        color: #c7c7c7;
        font-size: 20 / @rem;
        position: absolute;
        right: 44 / @rem;
        bottom: 8 / @rem;
        .detailnum {
          color: #888;
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
    .addPhoto {
      margin-top: 20 / @rem;
      padding: 0 40 / @rem;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      .photo {
        width: 31%;
        height: 210 / @rem;
        margin-right: 20 / @rem;
        margin-bottom: 20 / @rem;
        font-size: 0;
        position: relative;
        .delete-btn {
          position: absolute;
          top: -18 / @rem;
          right: -12 / @rem;
          width: 40 / @rem;
          height: 40 / @rem;
          background-color: #eb613d;
          border-radius: 50%;
          // text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-cha {
            display: inline-block;
            // width: 20 / @rem;
            // height: 20 / @rem;
            color: #fff;
            font-size: 18 / @rem;
            line-height: 40 / @rem;
            font-weight: bolder;
          }
        }
        img {
          width: 100%;
          height: 210 / @rem;
          z-index: 10;
        }
      }
      .photo:nth-of-type(3n) {
        margin-right: 0;
      }
      .add {
        width: 202 / @rem;
        height: 210 / @rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f5f5f5;
        position: relative;
        cursor: pointer;
        #upload {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          width: 210 / @rem;
          height: 210 / @rem;
          z-index: 10;
        }
        .icon-jia {
          color: #666;
          font-size: 36 / @rem;
        }
      }
    }
  }
  .btn {
    position: absolute;
    bottom: 40 / @rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0 40 / @rem;
    button {
      width: 100%;
      height: 95 / @rem;
      line-height: 95 / @rem;
      text-align: center;
      font-size: 30 / @rem;
      color: #6d6d6d;
      border-radius: 60 / @rem;
      background-color: #424242;
    }
    .chagesColor {
      color: #fff;
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
