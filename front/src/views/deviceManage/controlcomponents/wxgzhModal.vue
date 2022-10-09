<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-02-22 09:33:01
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="mycontent">
    <!-- 添加人员-->
    <WXGZHListModal
      :showModal="isAddUserModal"
      :data="selectedUserList"
      :did="deviceInfo.id"
      @cancel="handleCancelUserModal"
      @ok="handleOkUserModal"
    />
    <!-- 添加设备-->
    <DeviceModal
      :showModal="isAddDeviceModal"
      :data="selectedDeviceList"
      @cancel="handleCancelDeviceModal"
      @ok="handleOkDeviceModal"
    />
    <a-form class="reset-form-item-10 myform">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" key="sourceto" label="接收方">
        <a-input
          class="userinput"
          :disabled="true"
          v-model="controlParams.sourceList"
          size="large"
        />
        <a-button @click="showAddUserModal" size="large" class="choosebutton" type="primary"
          >选择人员</a-button
        >
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" key="touser" label="接收方">
        <a-input
          :disabled="controlParams.sourceList.length != 0"
          class="input"
          placeholder="测试使用(手动输入openid)"
          v-model="controlParams.touser"
          size="large"
        />
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" key="first" label="消息头">
        <a-input v-model="controlParams.first" class="input" size="large" @change="() => {}" />
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" key="keyword1" label="报警内容">
        <a-input v-model="controlParams.keyword1" class="input" size="large" @change="() => {}" />
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" key="keyword2" label="报警设备">
        <a-input v-model="controlParams.keyword2" class="input" size="large" @change="() => {}" />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        key="keyword3"
        label="当前报警值"
      >
        <a-input v-model="controlParams.keyword3" class="input" size="large" @change="() => {}" />
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" key="keyword4" label="报警级别">
        <a-input v-model="controlParams.keyword4" class="input" size="large" @change="() => {}" />
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" key="remark" label="备注">
        <a-input v-model="controlParams.remark" class="input" size="large" @change="() => {}" />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        key="notedevicename"
        label="通知设备"
      >
        <a-input
          class="userinput"
          :disabled="true"
          v-model="controlParams.notedevicename"
          size="large"
        />
        <a-button @click="showAddDeviceModal" size="large" class="choosebutton" type="primary"
          >选择设备</a-button
        >
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" key="url" label="跳转地址">
        <a-input
          :disabled="controlParams.notedeviceid != ''"
          v-model="controlParams.url"
          class="input"
          size="large"
          @change="() => {}"
        />
      </a-form-item>
    </a-form>
    <a-button class="controlbutton" type="primary" @click="devControlBatch">发送</a-button>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
import WXGZHListModal from './common/wxgzhlistModal';
import DeviceModal from './common/deviceModal.vue';
let Base64 = require('js-base64').Base64;
const { deviceManageAsk } = service;
export default {
  name: 'CentralControlModal',
  components: {
    WXGZHListModal,
    DeviceModal,
  },
  props: {
    isSingle: {
      type: Boolean,
      default: true,
    },
    deviceInfo: Object,
    formatAttributes: Array,
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      spinning: false,
      isAddUserModal: false,
      isAddDeviceModal: false,
      controlParams: {
        sourceList: '',
        first: '',
        keyword1: '',
        keyword2: '',
        keyword3: '',
        keyword4: '',
        keyword5: '',
        remark: '',
        templateid: '',
        url: '',
        touser: '',
        cmd: 'sendtmpmsg',
        notedeviceid: '',
        notedevicetype: '',
      },
      selectedUserList: [],
      selectedDeviceList: [],
    };
  },
  computed: {
    ...mapState('deviceManage', ['valueType']),
    ...mapState('app', ['projectInfo']),

    // 选中按钮
  },
  watch: {},
  created() {
    if (this.deviceInfo.privatedata) {
      var privatedataStr = Base64.decode(this.deviceInfo.privatedata);
      var privatedata = JSON.parse(privatedataStr);
      console.log('privatedata', privatedata);
      this.controlParams.templateid = privatedata.templateid;
      // this.controlParams.url = privatedata.url;
    }
  },
  mounted() {},
  methods: {
    handleCancelUserModal() {
      this.isAddUserModal = false;
      this.isAddDeviceModal = false;
    },
    handleOkUserModal(e) {
      this.isAddUserModal = false;
      this.controlParams.sourceList = e.map((item) => item.nickname).join(';');
      this.controlParams.touser = e.map((item) => item.openid).join(';');
    },

    handleCancelDeviceModal() {
      this.isAddUserModal = false;
      this.isAddDeviceModal = false;
    },
    handleOkDeviceModal(e) {
      this.isAddDeviceModal = false;
      console.log('====', e);

      if (e && e[0] && e[0].did) {
        this.controlParams.notedeviceid = e[0].did;
        this.controlParams.notedevicename = e[0].displayname;
        this.getPorduct(e[0].productid);
      }
    },
    showAddDeviceModal() {
      console.log('showAddUserModal');
      this.isAddDeviceModal = true;
    },
    showAddUserModal() {
      this.isAddUserModal = true;
    },

    async getPorduct(id) {
      var resp = await deviceManageAsk.getProductDetail({
        id: id,
        projectid: this.projectInfo.id + '',
      });
      console.log('resp', resp);
      if (resp && resp.data && resp.data.devicetype) {
        this.controlParams.notedevicetype = resp.data.devicetype;
      }
    },
    devControlBatch() {
      this.spinning = true;
      const id = this.deviceInfo.id;
      // 判断是否是集中控制
      var devctrs = [];
      console.log('this.selectedUserList', this.selectedUserList);
      if (this.selectedUserList && this.selectedUserList.length != 0) {
        let controldata = {
          ...this.controlParams,
        };
        devctrs.push({
          did: id,
          data: controldata,
        });
      } else {
        let controldata = {
          ...this.controlParams,
        };
        devctrs.push({
          did: id,
          data: controldata,
        });
      }

      const params = {
        devctrs,
      };

      deviceManageAsk
        .devControl(params)
        .then((result) => {
          const { errcode } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
          }
          this.spinning = false;
        })
        .catch((e) => {
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
.controlbutton {
  width: 400px;
}
.userinput {
  width: 200px;
}
.input {
  width: 300px;
}
.mycontent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.choosebutton {
  width: 100px;
}
.myform {
  width: 450px;
}
</style>
