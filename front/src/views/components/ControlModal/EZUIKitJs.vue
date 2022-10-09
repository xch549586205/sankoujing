<template>
  <div class="hello-ezuikit-js">
    <div id="video-container" style="width:800px;height:600px"></div>
    <div>
      <a-button @click="toTop">向上</a-button>
      <a-button @click="toBottom">向下</a-button>
      <a-button @click="toLeft">向左</a-button>
      <a-button @click="toRight">向右</a-button>
      <a-button @click="toStop">停止</a-button>
    </div>
  </div>
</template>

<script>
import EZUIKit from "ezuikit-js";
 import axios from 'axios';
export default {
  name: "HelloWorld",
  props: {
    msg: String,
    accessToken:String,
    url:String,
    deviceSerial:String,
    channelNo:String
  },
  created(){
    console.log("accessToken",this.accessToken)
    console.log("url",this.url)
  },
  mounted() {
    var __this = this;
    console.group("mounted 组件挂载完毕状态===============》",__this);
    var player =  new EZUIKit.EZUIKitPlayer({
      autoplay: true,
      id: "video-container",
      accessToken:__this.accessToken,
      url: __this.url,
      template: "voice", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
      // 视频上方头部控件
      //header: ["capturePicture", "save", "zoom"], // 如果templete参数不为simple,该字段将被覆盖
      //plugin: ['talk'],                       // 加载插件，talk-对讲
      // 视频下方底部控件
      // footer: ["talk", "broadcast", "hd", "fullScreen"], // 如果template参数不为simple,该字段将被覆盖
      // audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
      // openSoundCallBack: data => console.log("开启声音回调", data),
      // closeSoundCallBack: data => console.log("关闭声音回调", data),
      // startSaveCallBack: data => console.log("开始录像回调", data),
      // stopSaveCallBack: data => console.log("录像回调", data),
      // capturePictureCallBack: data => console.log("截图成功回调", data),
      // fullScreenCallBack: data => console.log("全屏回调", data),
      // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
      width: 800,
      height: 500
    });
    console.log("player",player);
    // setTimeout(()=>{
    //   player.stop(); // 方法调用示例，10秒后关闭视频
    // },10000)
  },
  methods:{
    toTop(){
      this.control(0)
    },
    toBottom(){
      this.control(1)
    },
    toLeft(){
      this.control(2)
    },
    toRight(){
      this.control(3)
    },
    toStop(){
      this.stop(0)
    },
    control(direction) {

        return axios({
          method: 'post',
          url: 'https://open.ys7.com/api/lapp/device/ptz/start?'+"accessToken="+this.accessToken+"&deviceSerial="+this.deviceSerial+"&channelNo="+this.channelNo+"&direction="+direction+"&speed=1",
          data: {}, //参数
        });
      },
      stop(direction) {

        return axios({
          method: 'post',
          url: 'https://open.ys7.com/api/lapp/device/ptz/stop?'+"accessToken="+this.accessToken+"&deviceSerial="+this.deviceSerial+"&channelNo="+this.channelNo+"&direction="+direction+"&speed=1",
          data: {}, //参数
        });
      },
  }
};
</script>
