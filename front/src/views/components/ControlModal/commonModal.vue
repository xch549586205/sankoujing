<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-10 15:10:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-modal title="设备控制"
              v-model="visible"
             :mask-closable="false"
             :width="900"
             :footer="null"
             ok-text="确定"
             cancel-text="取消"
             @cancel="cancel">
        <iframe class="myiframe" v-if="h5url" :src="h5url" frameborder="0"></iframe>
    </a-modal>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import service from 'servicePath/index';
  import EZUIKitJs from './EZUIKitJs.vue'
  const { deviceManageAsk } = service;
  export default {
    name: 'CentralControlModal',
    components: {EZUIKitJs},
    // props: {
    //   h5url:String
    // },
    data() {
      return {
        isModal: true,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        spinning: false,
        url:"",
        accessToken:"",
        deviceSerial:"",
        channelNo:"",
        visible: false,
        h5url: null,
      };
    },
    watch: {
      visible (val) {
        console.log("visible", val)
      }
    },
    created(){
      console.log("h5url",this.h5url)
    },
    computed: {
      ...mapState('deviceManage', ['deviceInfo', 'valueType']),
      ...mapState('groupManage', ['node']),
      ...mapState({
        deviceStatus: state => state.deviceManage.deviceInfo.status || {},
      }),
      ...mapGetters('deviceManage', ['formatAttributes']),
      disabled() {
        const { online } = this.deviceInfo;
        return online !== '1';
      },
      // 选中按钮
      setStatus() {
        return function(key, val) {
          const { status } = this.deviceInfo;
          if (status) {
            return status[key] === val ? 'primary' : null;
          }
          return null;
        };
      },
    },
    watch: {},
    mounted() {},
    methods: {
      ...mapMutations('deviceManage', ['updateDevice']),
      // 取消弹窗
      cancel() {
        this.$emit('cancel');
      },
      // 控制设备
      devControl(key, val) {
        this.spinning = true;
        const { status, did } = this.deviceInfo;
        status[key] = val;
        const deviceInfo = { ...this.deviceInfo, status };
        this.updateDevice(deviceInfo);
        const { isSingle } = this;
        // 判断是否是集中控制
        const dids = isSingle ? [did] : did;
        const devctrs = dids.map(v => ({
          did: v,
          pname: key,
          pstate: `${val}`,
        }));
        const params = {
          devctrs,
        };

        deviceManageAsk
          .devControl(params)
          .then(result => {
            const { errcode } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
            }
            this.spinning = false;
          })
          .catch(e => {
            this.spinning = false;
            console.error(e);
          });
      },

    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    }
    },
  };
</script>

<style lang="less" scoped>
  .extra {
    text-align: center;
    height: 1px;
    background: #efefef;
  }
  .myiframe{
    width: 800px;
    height: 600px;
  }
</style>
