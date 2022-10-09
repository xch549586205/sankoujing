<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-10 15:10:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-modal :title="modalTitle"
             v-model="isModal"
             :mask-closable="false"
             :width="900"
             :footer="null"
             ok-text="确定"
             cancel-text="取消"
             @cancel="cancel">
        <EZUIKitJs v-if="url && accessToken" :url="url" :accessToken="accessToken" :deviceSerial="deviceSerial" :channelNo="channelNo"/>
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
    props: {
      isSingle: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        isModal: true,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        spinning: false,
        url:"",
        accessToken:"",
        deviceSerial:"",
        channelNo:""
      };
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
      modalTitle() {
        // 单个控制显示设备名称，集中控制显示分组名称
        const title = this.isSingle ? this.deviceInfo.displayname : this.node.dataRef.name;
        return `设备控制-${title}`;
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
    created() {
        const { privatedata } = this.deviceInfo;
        console.log("privatedata",privatedata)
        var obj =JSON.parse(privatedata)
        this.url = obj.url
        this.accessToken = obj.token
        this.deviceSerial = obj.deviceSerial
        this.channelNo = obj.channelNo
        console.log(" this.accessToken", this.url, this.accessToken)
    },
    mounted() {},
    methods: {
      ...mapMutations('deviceManage', ['updateDevice']),
      ...mapActions('deviceManage', ['getProductAttributes']),
      // 取消弹窗
      cancel() {
        this.$emit('cancel');
      },
      // 获得产品属性，自动生成控制界面

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
    },
  };
</script>

<style lang="less" scoped>
  .extra {
    text-align: center;
    height: 1px;
    background: #efefef;
  }
</style>
