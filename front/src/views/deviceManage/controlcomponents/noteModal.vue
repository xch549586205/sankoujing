<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-10 15:10:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="mycontent">
    <!-- 添加设备-->
    <UserListModal
      v-if="isAddUserModal"
      :data="selectedUserList"
      flag="groupid"
      @cancel="handleCancelUserModal"
      @ok="handleOkUsserModal"
    />
    <a-form class="reset-form-item-10 myform">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" key="sourceto" label="接收方">
        <a-input class="userinput" v-model="controlParams.sourceList" size="large" />
        <a-button @click="showAddUserModal" size="large" class="choosebutton" type="primary"
          >选择人员</a-button
        >
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" key="message" label="发送信息">
        <a-input v-model="controlParams.message" class="input" size="large" @change="() => {}" />
      </a-form-item>
    </a-form>
    <a-button class="controlbutton" type="primary" @click="devControlBatch">发送</a-button>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
import UserListModal from './common/userlistModal';
const { deviceManageAsk } = service;
export default {
  name: 'CentralControlModal',
  components: {
    UserListModal,
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
      controlParams: {
        sourceto: '',
        message: '',
        sourceList: '',
      },
      selectedUserList: [],
    };
  },
  computed: {
    ...mapState('deviceManage', ['valueType']),
    // 选中按钮
  },
  watch: {},
  created() {
    console.log('formatAttributes', this.formatAttributes);
  },
  mounted() {},
  methods: {
    handleCancelUserModal() {
      this.isAddUserModal = false;
    },
    handleOkUsserModal(e) {
      this.isAddUserModal = false;
      console.log('====', e);
      this.selectedUserList = e;
      this.controlParams.sourceList = e.map((item) => item.accountname).join(',');
    },
    showAddUserModal() {
      this.isAddUserModal = true;
    },
    devControlBatch() {
      this.spinning = true;
      const id = this.deviceInfo.id;
      // 判断是否是集中控制
      var devctrs = [];
      console.log("id",id,this.deviceInfo)
      if (this.controlParams.sourceList) {
        var list = this.controlParams.sourceList.split(',');
        list.forEach((item) => {
          let controldata = {
            sourceto: item,
            message: this.controlParams.message,
          };
          devctrs.push({
            did: id,
            data: controldata,
          });
        });
      }

      if (devctrs.length==0){
        return 
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
  width: 400px;
}
</style>
