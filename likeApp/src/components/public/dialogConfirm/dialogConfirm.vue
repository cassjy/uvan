<template>
    <div class="greycover" :class="{'nocover':dialogshow}">
        <div class="dialog">
            <div class="title">{{dialogConfig.dialogtitle}}</div>
            <div class="message">{{dialogConfig.dialogmessage}}</div>
            <div class="buttons">
                <div v-if="dialogConfig.type !=2" class="quit" @click="dialogquit('取消')">取消</div>
                <div v-if="dialogConfig.type !=1" class="confirm" @click="dialogconfirm('确定')">确定</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:"dialogConfirm",
        props:['dialogshow','dialogConfig'],
        methods:{
            dialogquit(str){//取消
                this.$emit('update:dialogshow', false);
                window.eventHub.$emit('dialogquit')
            },
            dialogconfirm(){//确认
                this.$emit('update:dialogshow', false);
                window.eventHub.$emit('dialogconfirm')
            }
        }
    }
</script>

<style scoped lang="less">
@import "~common/css/defult.less";
.greycover{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 90;
    display: none;
}
.nocover{
    display: block;
    overflow: hidden;
}
.dialog{
    position: absolute;
    width:585/@rem;
    height: 260/@rem;
    position: absolute;
    top:50%;
    left:50%;
    margin-left:-146px;
    margin-top:-75px;
    background-color: #fff;
    border-radius: 5/@rem;
    text-align: center;
    font-size: 32/@rem;
    .title{
        width: 100%;
        color: #424242;
        margin-top:30/@rem;
        line-height: 1;
    }
    .message{
        color: #aaa;
        margin: 38/@rem 0;
    }
    .buttons{
        border-top:#eee 1/@rem solid;
        display: flex;
        .quit{
            flex:1;
            color:#888;
            line-height: 80/@rem;
            border-right:#eee 1/@rem solid;
        }
        .confirm{
            flex:1;
            color:#4c9ffb;
            line-height: 80/@rem;
        }
    }
}

</style>