<template>
  <div class="likewrapper" ref="likewrapper">
    <div class="likeform">
      <div v-if="!edit" class="colleague" @click="chooseColleague" :class="{'red-border': startcheck && colleague.id ==''}">
        <img class='person-atr' :src='colleague.avatar' style="float:left;background-color: #f2f2f2;">
        <div class="colleague-name">{{colleague.name}}</div>
        <i class="iconfont icon-arrow-right1"></i>
      </div>
      <div class="line-border"></div>
      <div v-if="!edit" class="fanzhuan" :class="{'red-border': startcheck && (submitData.diamond== ''||this.submitData.diamond <=0)}">
        <div class="diamondinput-title">赞赏数量</div>
        <!-- <input type="number" @input="handleInput" :value="submitData.diamond" :placeholder="cangitLikeCount" name='diamond' disabled @click.stop="showDiamondList" /> -->
        <!-- <div class="diamondinput" @click.stop="showDiamondList">{{submitData.diamond[0]==''?cangitLikeCount:submitData.diamond[0]}}</div> -->
        <div class="diamondinput" @click.stop="showDiamondList" v-html="submitData.diamond[0]==''?cangitLikeCount:submitData.diamond[0]"></div>
      </div>
      <div class="line-border"></div>
      <div class="reasonBody">
        <div class="reasonBody-head">赞赏理由</div>
        <div class="textarea">
          <textarea name="" id="" :rows="row" v-model="submitData.detailReason" :class="{'red-border': startcheck && submitData.detailReason== ''}" placeholder="请认真输入赞赏理由"></textarea>
          <div class="detail" v-html="detail"></div>
        </div>
        <div class="uploadPhoto">
          <div v-if="addImg.length !==0" class="hadupload" v-for="(pic,index) in addImg" :key="index">
            <div class="delete-btn">
              <i class="iconfont icon-cha" @click="deletUploadPic(index)"></i>
            </div>
            <img :src="pic.fileEntity.fileUrl" alt="">
          </div>

          <div v-if="addImg.length<3" class="rect" @click="addpic">
            <i class="iconfont icon-jia"></i>
            <input type="file" id="upload" accept="image/jpg" multiple @change="upload">
          </div>
        </div>
      </div>
      <div class="line-border"></div>
      <div class="chooseType">

        <div class="type-list">
          <div v-for="(type,index) in typeList" :key="index" @click="setType($event,index)" :class="{'chooseTypeclass':type.typeName == nowTypeName }" :data-typename="type.typeName" v-if="type.typeName!=''&&(type.privilegePhone==''||type.privilegePhone==myphone)">
            {{type.typeName}}
          </div>
        </div>

        <div class="button-submit">
          <button class="sendGood" @click="submit">我要赞赏</button>
        </div>
      </div>

      <div class=""></div>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
      <div v-if="showDiamond" class="cover1"></div>

    </div>
    <div v-if="showDiamond" class="picker">
      <!-- <div class="pickerconfirm" @click="hideDiamondList">确定</div> -->
      <!-- <picker :data='diamondlist' v-model="submitData.diamond"></picker> -->
      <div class="picker-title">请选择赞赏数量</div>
      <div class="picker-tags">
        <div v-for="(diamond,index) in diamondlist" :key :class="['picker-tag-name',nowDiamond==diamond?'picker-tag-name-selected':'']" :data-num="diamond" @click="selectDiamond($event)">
          <div class="picker-tag-num">{{diamond}}</div>
          <div class="picker-tag-text">梵钻</div>
        </div>
        <div class="clear-float"></div>
      </div>
      <div class="picker-tag-confirm" @click="hideDiamondList">确定</div>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import { mapGetters , mapMutations} from 'vuex'
import Exif from 'exif-js'
import { debug } from 'util'
import {formatTime , getuuid, dataURLtoBlob} from 'common/js/common.js'
import { Loading, Picker } from 'vux'

import { URL } from "api/url"

export default {
  data(){
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
        },
        bounce: {
          top: false,
          bottom: false,
          left: false,
          right: false
        }
      },
      edit:false,
      // typeList:["超出客户预期","沟通高效不尬聊","快速响应配合好","结果导向能闭环","积极拥抱变化","快速交付质量高","主动担当","创业心态","奇思妙想点子多","乐于分享"],
      typeList:[{typeName:''}],
      fullHeight: document.documentElement.clientHeight,
      startcheck:false,
      submitData:{
        colleague:23543,
        type:"",
        detailReason:"",
        diamond:[''],
        picformid:""

      },
      nowDiamond: '1',
      headerImage:'',
      fileArr:[],
      alyData : {
        policy: '',
        OSSAccessKeyId: '',  // 密钥
        success_action_status: "200",  // 状态
        signature: '',  // 签名
        key: '',
        callback: ''  // 回调
      },
      aliyunHost:'',
      appreciationCode:'',//图片表单id
      addImg:[],
      cangitLikeCount:0,
      nowTypeName:'',
      myphone: '',
      // diamondlist: [['2','4','6','8','10']],
      diamondlist: ['1','2','3','4','5'],
      showDiamond: false,
      firstTime: true,
      row: 1,
      condition: 48,
      cansubmit: true,
      baseUrl: 'http://am.frp.uvanart.com:9200',//开发
      // baseUrl: 'http://amfz.frp.uvanart.com:9200',//稳定
      // baseUrl: 'https://amfz.uvanart.com',//正式
    }
  },
  components:{
    Loading,
    Picker
  },
  created(){
    if(window.localStorage.getItem('addImg')!==null&&window.localStorage.getItem('addImg')!=''){
      this.addImg = JSON.parse(window.localStorage.getItem('addImg'))
      console.log(JSON.parse(window.localStorage.getItem('addImg')))
    }
    if(URL.mode == 'dev'){
      this.baseUrl = "http://am.frp.uvanart.com:9200"
    }else if(URL.mode == 'pre'){
      this.baseUrl = "https://amuat.uvanart.com"
    }else{
      this.baseUrl = "https://amfz.uvanart.com"
    }
    this.$vux.loading.show({
      text: '正在加载'
    })
    //获得剩余赞数
    var _this = this;
    var data={
      userId:this.user.userid
    }

    if(window.localStorage.getItem('likeReason')!==null&&window.localStorage.getItem('likeReason')!=''){
      this.submitData.detailReason = window.localStorage.getItem('likeReason')
      this.row = this.getByteLen(this.submitData.detailReason)/43 + 1
    }
    this.myphone = this.user.phone
    this.$api.get("/ding/dingUser/getUserByUserId",data).then(res=>{
        var count = res.data.inDepartmentGold+res.data.outDepartmentGold
        _this.cangitLikeCount="<span style='color: #888;'>剩余部门内梵钻"+res.data.inDepartmentGold+"，跨部门梵钻"+res.data.outDepartmentGold+"</span>"
        this.$vux.loading.hide()
    })
    this.getType()

  },
  mounted(){
    
  },
  computed: {
   detail:function(){
     var l = ""
     if(this.trim2(this.submitData.detailReason,'g').length<10){l="还需要输入<span style='color: #888;'>"+(10-this.trim2(this.submitData.detailReason,'g').length)+"</span>个字"}else{l="已经输入了<span style='color: #888;'>"+this.trim2(this.submitData.detailReason,'g').length+"</span>个字"}
        return l
   },
    ...mapGetters(["likeperson","user"]),
    colleague:function(){
      return this.likeperson
    }
  },
  watch: {
    "submitData.detailReason"(){
      window.localStorage.setItem('likeReason',this.submitData.detailReason)
      if(this.getByteLen(this.submitData.detailReason)>this.condition){
        if(this.getByteLen(this.submitData.detailReason)>this.condition&&this.getByteLen(this.submitData.detailReason)<this.condition+43){
          return
        }
        this.row++
        this.condition+=43
        
      }else if(this.getByteLen(this.submitData.detailReason)<this.condition){
        this.row = this.getByteLen(this.submitData.detailReason)/43 + 1
        
      }
    }
  },
  methods:{
    showDiamondList(){
      if(this.firstTime){
        this.submitData.diamond[0]='1'
        this.firstTime = false
      }
      this.showDiamond = true
      this.likewrapper.disable()
    },
    hideDiamondList(){
      this.showDiamond = false
      this.likewrapper.enable()
    },
    selectDiamond(e){
      console.log(e.currentTarget.dataset.num)
      this.nowDiamond = e.currentTarget.dataset.num
      this.submitData.diamond[0] = e.currentTarget.dataset.num
    },
    setType:function(e,index){
      this.submitData.type= e.target.dataset.typename;
      this.nowTypeName = e.target.dataset.typename
      console.log(this.nowTypeName)
    },
    submit:function(){
      if(!this.cansubmit){
        return
      }
      this.cansubmit = false
      var o =this.check();
      var _this = this;
      //关联照片
      if(o && _this.addImg.length != 0){
      _this.$api.get('appreciation/fzAppreciationRecord/getId')
      .then(res=>{
        _this.appreciationCode = res.data;
        _this.addImg =_this.addImg.map(function(pic){
             pic.bizKey = res.data
             return pic
        })
        debugger
        _this.$vux.loading.show({
          text: '正在发布'
        })
        var picdata = {
            "addImg": _this.addImg, 
            "delImg": []
        }
        return this.$api.post(_this.baseUrl+'/a/file/saveFile',picdata,"application/json")
        .then(res=>{
          if(res.code == 200){
            //上传图片关联再提交表单
            var data={
              appreciationCode:_this.appreciationCode,
              praiserId: _this.colleague.id,
              presenterId:_this.user.userid,
              presenterDepartment: "",
              praiserDepartment: "",
              coinNumber: _this.submitData.diamond[0],
              content: _this.submitData.detailReason,
              tag: _this.submitData.type,
              praiserNumber: "",
              imgUrl: "",
              fullPath: "",
              coinCount: "",
              remarks: _this.submitData.detailReason,
              fzAppreciationRecord_image: "",
              fzAppreciationRecord_image__del: "",
              file: "",
              file: ""
            }
            _this.$api.post('appreciation/fzAppreciationRecord/saveRecord',data).then(res=>{
              if(res.code == 200){
                console.log(res);
                console.log("上传成功")
                _this.$vux.loading.hide()
                _this.$vux.toast.show({
                  text: "赞赏成功",
                  type: "success",
                  width: "10em",
                  time: 1000
                });
                window.localStorage.setItem('likeReason','')
                window.localStorage.setItem('addImg','')
                setTimeout(()=>{
                  _this.$router.replace({ path: "/hall" })
                },1000)
              }else{
                _this.addImg = _this.addImg.map(function(item){
                  item.id = getuuid()
                  return item
                })//重新插入表单设置新的id值
                _this.$vux.loading.hide()
                _this.$vux.toast.show({
                  text: res.msg,
                  type: "text",
                  width: "20em"
                });
                _this.cansubmit = true
              }
            })
          }
        })
      })
    }else if(o){
      //上传图片关联再提交表单
      _this.$vux.loading.show({
        text: '正在发布'
      })
      var data={
        appreciationCode:_this.appreciationCode,
        praiserId: _this.colleague.id,
        presenterId: _this.user.userid,
        presenterDepartment: "",
        praiserDepartment: "",
        coinNumber: _this.submitData.diamond[0],
        content: _this.submitData.detailReason,
        tag: _this.submitData.type,
        praiserNumber: "",
        imgUrl: "",
        fullPath: "",
        coinCount: "",
        remarks: _this.submitData.detailReason,
        fzAppreciationRecord_image: "",
        fzAppreciationRecord_image__del: "",
        file: "",
        file: ""
      }
      _this.$api.post('appreciation/fzAppreciationRecord/saveRecord',data).then(res=>{
          if(res.code == 200){
            console.log(res);
            console.log("上传成功")
            _this.$vux.loading.hide()
            _this.$vux.toast.show({
              text: "赞赏成功",
              type: "success",
              width: "10em",
              time: 1000
            });
            window.localStorage.setItem('likeReason','')
            window.localStorage.setItem('addImg','')
            setTimeout(()=>{
              _this.$router.replace({ path: "/hall" })
            },1000)
            
          }else{
            _this.$vux.loading.hide()
            _this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: "20em"
            });
            _this.cansubmit = true
          }
        })
      }else{
        _this.cansubmit = true
      }
    },
    chooseColleague:function(){
      this.$router.push({ name: "organize" })
    },
    check:function(){
      this.startcheck = true;
      debugger;
      if(this.trim(this.submitData.detailReason).length<10){
        this.$vux.toast.show({
          text: "赞赏理由不得少于10个字",
          type: "text",
          width: "16em"
        });
      }
      if(this.trim(this.submitData.detailReason).length>500){
        this.$vux.toast.show({
          text: "赞赏理由不得多于500个字",
          type: "text",
          width: "17em"
        });
      }
      //内容必须包含中文或英文
      if(this.trim(this.submitData.detailReason).length>=10){
        let regCN = new RegExp("[\\u4E00-\\u9FFF]+","g")
        let regEN = new RegExp("[a-zA-Z]+","g")
        if(!regCN.test(this.trim(this.submitData.detailReason)) && !regEN.test((this.trim(this.submitData.detailReason)))){
          this.$vux.toast.show({
            text: "请认真填写赞赏理由",
            type: "text",
            width: "15em"
          });
          this.cansubmit = true
          return
        }
      }
      if(this.submitData.diamond[0] ==''||this.trim(this.submitData.detailReason)==''){
        this.$vux.toast.show({
          text: "赠送数量和赞赏理由不能为空喔",
          type: "text",
          width: "20em"
        });
      }
      if(this.submitData.diamond[0] !=''&&this.trim(this.submitData.detailReason)!=''&&this.submitData.type==''){
        this.$vux.toast.show({
          text: "请选择赞赏标签",
          type: "text",
          width: "14em"
        });
      }
      if(this.submit.colleague=="" ||this.submitData.diamond[0] ==''||this.submitData.diamond[0] <=0 || this.trim(this.submitData.detailReason)=='' ||this.colleague.id ==''||this.trim(this.submitData.detailReason).length<10 || this.submitData.type=='' || this.trim(this.submitData.detailReason).length>500){
        this.cansubmit = true
        return false
      }
      else{
        this.startcheck = true;
        return true
      }
    },
    handleInput:function(e){      
      this.submitData.diamond[0]=e.target.value.replace(/[^\d]/g,'');
    },
    deletUploadPic:function(index){
       this.addImg.splice(index,1);
       window.localStorage.setItem('addImg',JSON.stringify(this.addImg))
    },
    addpic:function(){
      //上传图片
    },
    upload (e) {
      var _this = this;
      var files = e.target.files || e.dataTransfer.files;
      debugger;
      var a=false;
      for(var i= 0;i<files.length;i++){
        if(files[i].type.indexOf("image") == -1){a=true}
      }
      if(a){
        this.$vux.toast.show({
          text: "请选择图片文件",
          type: "text",
          width: "15em"
        });
        return;
      }
      debugger;
      var l =files.length;
      if (!l) return;
      if(this.addImg.length+l>3){
        this.$vux.toast.show({
          text: "图片最多上传三张",
          type: "text",
          width: "15em"
        });
        return
      }
      this.$vux.loading.show({
          text:"正在上传"
        })
      // var f = length => Array.from({length}).map((v,k) => k);
      // var arr = f(l);
      // var i =arr.map((item)=>{
      //   _this.imgPreview(files[item],files.length-1,item);
      //   return i
      // })
      _this.fileArr = files;
      _this.imgPreview(files[0],files.length-1,0);
      
    
    },
  
    imgPreview (file,h,i) {
      debugger;
      console.log(i);
      let self = this;
      let Orientation;
      debugger
      //去获取拍照时的信息，解决拍出来的照片旋转问题
       Exif.getData(file, function(){
           Orientation = Exif.getTag(this, 'Orientation');
       });
      // 看支持不支持FileReader  
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
          // 创建一个reader
          let reader = new FileReader();
          // 将图片2将转成 base64 格式
          reader.readAsDataURL(file);
          // 读取成功后的回调
          reader.onloadend = function () {
            let result = this.result;
            let img = new Image();
            img.src = result;
            //判断图片是否大于100K,是就直接上传，反之压缩图片
            if (this.result.length <= (100 * 1024) || file.type =="image/gif") {
              self.headerImage = this.result;
              self.postImg(file,h,i);
            }else {
              img.onload = function () {
                let data = self.compress(img,Orientation);
                self.headerImage = data;
                debugger;
                console.log(i);
                self.postImg(file,h,i);
              }
            }
          }
        }
      },
      postImg (file,h,i) {
        var _this = this;
        //这里写接口
        this.$api.get(_this.baseUrl+"/a/aliyunimage/amAliyunImage/getPolicy",{}).then(res=>{
              _this.aliyunHost= res.data.host;
              _this.alyData.policy = res.data.policy;
              _this.alyData.OSSAccessKeyId = res.data.accessId;
              _this.alyData.signature = res.data.signature;
              _this.alyData.key = res.data.dir;
              _this.alyData.callback = res.data.callBack;


              var dataDay = new Date(),
    dnum = dataDay.getFullYear().toString() + dataDay.getMonth().toString() + dataDay.getDate().toString() + dataDay.getMinutes().toString() + dataDay.getMilliseconds().toString() + dataDay.getSeconds().toString();//文件上传加上时间戳，防止阿里服务器上的文件被覆盖
          var file2=dataURLtoBlob(_this.headerImage)
          var formData = new FormData;
          formData.append('OSSAccessKeyId', _this.alyData.OSSAccessKeyId)
          formData.append('policy', _this.alyData.policy)
          formData.append('signature', _this.alyData.signature)
          formData.append('key', _this.alyData.key + dnum +file.name)
          formData.append('success_action_status', _this.alyData.success_action_status)
          formData.append('callback', _this.alyData.callback)
          formData.append('file', file2)
          debugger;
          console.log(formData);

          _this.$api.post(_this.aliyunHost,formData,"multipart/form-data").then(res=>{
            if (res.code === 200) {
              debugger;
              var str = _this.aliyunHost+res.data
              var date = formatTime(new Date());
              var uuid =getuuid();
              var picdata = 
                {
                  "bizKey": "", 
                  "bizType": "fzAppreciationRecord_image", 
                  "createBy": "fanzhan", 
                  "createByName": "梵赞",
                  "createDate": date, 
                  "fileEntity": {
                      "fileContentType": file.type, 
                      "fileExtension": "jpg", 
                      "fileId": dnum+file.name, 
                      "fileMd5": "", 
                      "filePath": res.data, 
                      "fileRealPath": str, 
                      "fileSize": file.size, 
                      "fileSizeFormat": "", 
                      "fileUrl": str, 
                      "id": uuid, 
                      "status": 0
                  }, 
                  "fileName": file.name, 
                  "fileType": "file", 
                  "id": uuid, 
                  "status": 0, 
                  "updateBy": "fanzhan", 
                  "updateByName": "梵赞", 
                  "updateDate": date, 
                  "message": ""
              }
              _this.addImg.push(picdata);
              if(h==i){_this.$vux.loading.hide()}
              debugger;
              window.localStorage.setItem('addImg',JSON.stringify(_this.addImg))
              console.log(JSON.stringify(_this.addImg))
              console.log(i);
              console.log(i+1)
              console.log(_this.fileArr)
              console.log(_this.fileArr[i+1])
              if(_this.fileArr[i+1]){_this.imgPreview(_this.fileArr[i+1],_this.fileArr.length-1,i+1)};

            }else{ 
              // _this.$vux.loading.hide()
              // _this.$vux.toast.show({
              //   text: "网络请求超时",
              //   type: "text",
              //   width: "10em"
              // });
              if(_this.fileArr[i+1]){_this.imgPreview(_this.fileArr[i+1],_this.fileArr.length-1,i+1)};
              return false
            }

          }).catch(res=>{

            if(res.code){
              debugger
              // handleCodeLoading(_this,res.code,res.data);
              _this.showCodeMes(_this,res.code,res.data);
              if(_this.fileArr[i+1]){_this.imgPreview(_this.fileArr[i+1],_this.fileArr.length-1,i+1)};
                return false
            }
          })
        })

      },
      rotateImg (img, direction,canvas) {
        //最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0;
        const max_step = 3;
        if (img == null)return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = img.height;
        let width = img.width;
        let step = 2;
        if (step == null) {
            step = min_step;
        }
        if (direction == 'right') {
            step++;
            //旋转到原位置，即超过最大值
            step > max_step && (step = min_step);
        } else {
            step--;
            step < min_step && (step = max_step);
        }
        //旋转角度以弧度值为参数
        let degree = step * 90 * Math.PI / 180;
        let ctx = canvas.getContext('2d');
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
    compress(img,Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
        //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素")
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
      if ((count = width * height / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
  //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if(Orientation != "" && Orientation != 1){
        debugger
        switch(Orientation){
          case 6://需要顺时针（向左）90度旋转
              this.rotateImg(img,'left',canvas);
              break;
          case 8://需要逆时针（向右）90度旋转
              this.rotateImg(img,'right',canvas);
              break;
          case 3://需要180度旋转
              this.rotateImg(img,'right',canvas);//转两次
              this.rotateImg(img,'right',canvas);
              break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    //获取赞赏类型
    getType(){
      let url = 'appreciation/fzAppreciationType/getList'
      this.$api.get(url)
      .then(res=>{
        console.log(res)
        this.typeList = res.data,
        // this.submitData.type = res.data[0].typeName
        // this.nowTypeName = res.data[0].typeName
        this.$nextTick(() => {
          this.likewrapper = new BScroll(this.$refs.likewrapper, this.options)
        })
      })
    },
    //获取字符串长度
    getByteLen(val) {
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
          len += 2;
        }
        else {
          len += 1;
        }
      }
      return len;
    },
    //去前后空格
    trim(s) {
      return s.replace(/(^\s*)|(\s*$)/g, "");
    },
    //去空格
    trim2(str,is_global)
    {
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g,"");
      if(is_global.toLowerCase()=="g")
      {
        result = result.replace(/\s/g,"");
      }
      return result;
    }

  }
}

</script>
	
<style lang="less" scoped>
@import "~common/css/defult.less";
img {
  object-fit: cover;
}
.likewrapper {
  box-sizing: border-box;
  position: fixed;
  overflow: hidden;
  top: 0;
  height: 100%;
  // padding-bottom: 96 / @rem;
}
.likeform {
  position: relative;
  // background-color: #f8f8f8;
  // overflow: scroll;
  min-height: 100%;
  width: 100vw;
  font-size: 28 / @rem;
}
.colleague {
  cursor: pointer;
  box-sizing: border-box;
  height: 170 / @rem;
  // margin-bottom: 20 / @rem;
  background-color: #fff;
  padding: 40 / @rem;
  display: flex;
  .person-atr {
    flex: 0 0 90 / @rem;
    width: 90 / @rem;
    height: 90 / @rem;
    border-radius: 50%;
  }
  .colleague-name {
    flex: 0 0 550 / @rem;
    color: #242424;
    font-size: 28 / @rem;
    line-height: 90 / @rem;
    margin-left: 20 / @rem;
  }
  .icon-arrow-right1 {
    flex: 0 0 28 / @rem;
    color: #666;
    font-size: 32 / @rem;
    line-height: 90 / @rem;
  }
}
.fanzhuan {
  cursor: pointer;
  box-sizing: border-box;
  width: 100vw;
  height: 100 / @rem;
  background-color: #fff;
  padding: 35 / @rem 40 / @rem;
  // margin-bottom: 20 / @rem;
  color: #242424;
  font-size: 28 / @rem;
  display: flex;
  input {
    flex: 0 0 540 / @rem;
    text-align: right;
    line-height: 30 / @rem;
  }
  .diamondinput-title {
    line-height: 30 / @rem;
  }
  .diamondinput {
    flex: 0 0 540 / @rem;
    text-align: right;
    line-height: 30 / @rem;
  }
}
.reasonBody {
  // min-height: 630 / @rem;
  background-color: #fff;
  // margin-bottom: 20 / @rem;
  .reasonBody-head {
    height: 28 / @rem;
    padding: 35 / @rem 40 / @rem;
    padding-top: 40 / @rem;
    padding-bottom: 30 / @rem;
    border-bottom: #eeeeee 1 / @rem solid;
    color: #090909;
  }
  .textarea {
    // height: 300 / @rem;
    padding: 26 / @rem 40 / @rem 0 40 / @rem;
    textarea {
      // height: 255 / @rem;
      border: 0;
      width: 100%;
      line-height: 36 / @rem;
      font-size: 28 / @rem;
      color: #8b8b8b;
      outline: none;
      overflow: scroll;
    }
    textarea[disabled],
    textarea:disabled,
    textarea.disabled {
      color: #888;
      -webkit-text-fill-color: #888;
      -webkit-opacity: 1;
      opacity: 1;
    }
    .detail {
      text-align: right;
      color: #c7c7c7;
      font-size: 20 / @rem;
      .detailnum {
        color: #888;
      }
    }
  }
  .uploadPhoto {
    padding: 26 / @rem 40 / @rem;
    display: flex;
    overflow-x: scroll;
    flex-wrap: wrap;
    .hadupload {
      overflow: visible;

      width: 160 / @rem;
      height: 160 / @rem;
      margin: 0 20 / @rem 20 / @rem 0;
      position: relative;
      .delete-btn {
        position: absolute;
        top: -20 / @rem;
        right: -20 / @rem;
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
        height: 100%;
      }
    }
    .rect {
      position: relative;
      width: 160 / @rem;
      height: 160 / @rem;
      background-color: #f2f2f2;
      color: #dadada;
      margin-right: 20 / @rem;
      cursor: pointer;
      #upload {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 160 / @rem;
        height: 160 / @rem;
        z-index: 10;
      }
      .icon-jia {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -19 / @rem;
        margin-top: -19 / @rem;
        font-size: 38 / @rem;
        color: #666;
        font-weight: bold;
        z-index: 9;
      }
    }
  }
}
.button-submit {
  width: 100%;
  text-align: center;
  margin-bottom: 40 / @rem;
}
.sendGood {
  cursor: pointer;
  width: 670 / @rem;
  height: 96 / @rem;
  background-color: #424242;
  color: #fff;
  font-size: 28 / @rem;
  font-weight: bold;
  border-radius: 50px;
  margin: 0 auto;
}

.chooseType {
  // height: 400 / @rem;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  .type-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 30 / @rem 40 / @rem 30 / @rem;
    div {
      cursor: pointer;
      box-sizing: border;
      border: 1 / @rem solid #bfbfbf;
      height: 58 / @rem;
      font-size: 24 / @rem;
      line-height: 58 / @rem;
      padding: 0 16 / @rem;
      color: #424242;
      margin-bottom: 20 / @rem;
      margin-right: 20 / @rem;
    }

    .chooseTypeclass {
      border: 0;
      background-color: #666666;
      border: 1 / @rem solid #666;
      color: #fff;
    }
  }
}
.red-border {
  border: 1 / @rem red solid !important;
}
input:disabled {
  background-color: #fff;
  opacity: 1;
}

.picker {
  // .pickerconfirm {
  //   text-align: right;
  //   font-size: 32 / @rem;
  //   padding-right: 40 / @rem;
  //   padding-top: 20 / @rem;
  // }
  .picker-title {
    box-sizing: border-box;
    line-height: 108 / @rem;
    padding-left: 40 / @rem;
    font-size: 28 / @rem;
    color: #aaa;
  }
  .picker-tags {
    box-sizing: border-box;
    padding-left: 30 / @rem;
    padding-right: 30 / @rem;
    .clear-float {
      clear: both;
    }
    .picker-tag-name {
      box-sizing: border-box;
      width: 210 / @rem;
      margin-left: 10 / @rem;
      margin-right: 10 / @rem;
      margin-bottom: 20 / @rem;
      padding-top: 10 / @rem;
      padding-bottom: 14 / @rem;
      text-align: center;
      background-color: #f7f7fa;
      float: left;
      .picker-tag-num {
        box-sizing: border-box;
        font-size: 36 / @rem;
        color: #888888;
        font-weight: bold;
        line-height: 58 / @rem;
      }
      .picker-tag-text {
        box-sizing: border-box;
        font-size: 24 / @rem;
        color: #aaa;
        line-height: 38 / @rem;
      }
    }
    .picker-tag-name-selected {
      background-color: #424242;
      .picker-tag-num {
        color: #fff;
      }
    }
  }
  .picker-tag-confirm {
    height: 96 / @rem;
    margin-top: 120 / @rem;
    background-color: #424242;
    font-size: 28 / @rem;
    font-weight: bold;
    color: #fff;
    text-align: center;
    line-height: 96 / @rem;
  }
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
}
.line-border {
  background-color: #f8f8f8;
  width: 100%;
  height: 20 / @rem;
}
.cover1 {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  font-size: 24 / @rem;
  color: #ccc;
}

input:-moz-input-placeholder,
textarea:-moz-input-placeholder {
  font-size: 24 / @rem;
  color: #ccc;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  font-size: 24 / @rem;
  color: #ccc;
}
</style>
