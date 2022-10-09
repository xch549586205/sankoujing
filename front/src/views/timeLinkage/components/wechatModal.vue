<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-10 15:11:03
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-modal
      v-model="isModal"
      :mask-closable="false"
      :width="560"
      :footer="null"
      title="执行操作"
      @cancel="cancel"
    >
      <a-spin :spinning="spinning">
        <a-form class="reset-form-item-10">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="接收方">
            <a-input v-model="sourceList" :disabled="true">
              <a-button slot="addonAfter" class="reset-btn" @click="showPerson">选择人员</a-button>
            </a-input>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="消息头">
            <a-input v-model="deviceStatus['first']">
              <a-button
                slot="addonAfter"
                class="reset-btn"
                @click="setDefault('first', '{{ActionName}}')"
                >关联触发条件</a-button
              >
            </a-input>
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="报警内容">
            <a-input v-model="deviceStatus['keyword1']">
              <a-button
                slot="addonAfter"
                class="reset-btn"
                @click="setDefault('keyword1', '{{AttrName}}')"
                >关联触发条件</a-button
              >
            </a-input>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="报警设备">
            <a-input v-model="deviceStatus['keyword2']">
              <a-button
                slot="addonAfter"
                class="reset-btn"
                @click="setDefault('keyword2', '{{DeviceName}}')"
                >关联触发条件</a-button
              >
            </a-input>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="当前报警值">
            <a-input v-model="deviceStatus['keyword3']">
              <a-button
                slot="addonAfter"
                class="reset-btn"
                @click="setDefault('keyword3', '{{ValueName}}')"
                >关联触发条件</a-button
              >
            </a-input>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="报警级别">
            <!-- <a-input v-model="deviceStatus['keyword4']">
              </a-input> -->
            <a-row :gutter="10">
              <a-col :span="6">
                <a-button
                  :type="setStatus('keyword4', '提示')"
                  class="reset-btn"
                  @click="
                    () => {
                      setAction('keyword4', '提示');
                    }
                  "
                >
                  {{ '提示' }}
                </a-button>
              </a-col>
              <a-col :span="6">
                <a-button
                  :type="setStatus('keyword4', '警告')"
                  class="reset-btn"
                  @click="
                    () => {
                      setAction('keyword4', '警告');
                    }
                  "
                >
                  {{ '警告' }}
                </a-button>
              </a-col>
              <a-col :span="6">
                <a-button
                  :type="setStatus('keyword4', '危险')"
                  class="reset-btn"
                  @click="
                    () => {
                      setAction('keyword4', '危险');
                    }
                  "
                >
                  {{ '危险' }}
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注">
            <a-input v-model="deviceStatus['remark']"> </a-input>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="通知设备">
            <a-input v-model="notedeviceName" @blur="devicenameChange">
              <a-button slot="addonAfter" class="reset-btn" @click="showDevice">选择设备</a-button>
            </a-input>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="跳转地址">
            <a-input v-model="deviceStatus['url']"> </a-input>
          </a-form-item>
          <div class="modal-footer-btn mt20">
            <a-button @click="cancel">取消</a-button>
            <a-button class="ml10" type="primary" @click="ok">确定 </a-button>
          </div>
        </a-form>
      </a-spin>
    </a-modal>

    <UserListModal
      :showModal="isAddUserModal"
      :data="selectedUserList"
      :did="deviceid"
      flag="groupid"
      @cancel="handleCancelUserModal"
      @ok="handleOkUserModal"
    />

    <!-- 添加设备-->
    <DeviceModal
      :showModal="isDeviceModal"
      :data="dids"
      title="添加设备"
      flag="timeLinkage"
      @cancel="handleCancelDevice"
      @ok="handleOkDevice"
    />
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
import UserListModal from '@/views/deviceManage/controlcomponents/common/wxgzhlistModal.vue';
import DeviceModal from '@/views/deviceManage/controlcomponents/common/deviceModal.vue';

const { deviceManageAsk } = service;
export default {
  name: 'StatusModal',
  components: {
    UserListModal,
    DeviceModal,
  },
  props: {
    status: {
      type: Object,
      default: () => {},
    },
    productid: {
      type: String,
      required: true,
    },
    deviceid: {
      type: String,
      required: true,
    },
    // first: {
    //   type: String,
    //   required: true,
    // },
    // keyword1: {
    //   type: String,
    //   required: true,
    // },
    // keyword2: {
    //   type: String,
    //   required: true,
    // },
    // keyword3: {
    //   type: String,
    //   required: true,
    // },
    // keyword4: {
    //   type: String,
    //   required: true,
    // },
  },
  data() {
    return {
      isModal: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      spinning: false,
      deviceStatus: { ...this.status },
      formartStatus: [],
      slider: 0,
      isAddUserModal: false,
      selectedUserList: [],
      isDeviceModal: false,
      dids: [],
      sourceList: '',
      notedeviceName: '',
    };
  },
  computed: {
    ...mapGetters('deviceManage', ['formatAttributes', 'formatConfs']),
    ...mapState('deviceManage', ['valueType']),
    ...mapState('app', ['projectInfo']),
    setStatus() {
      return function (key, val) {
        const { deviceStatus } = this;
        if (deviceStatus) {
          return deviceStatus[key] === val ? 'primary' : null;
        }
        return null;
      };
    },
    // 选中按钮
    getFormatStatus() {
      // 格式化属性
      const { deviceStatus = {}, formatAttributes = [], formatConfs = [], valueType } = this;
      console.log(deviceStatus);
      const formatStatus = [];
      deviceStatus['cmd'] = 'sendtmpmsg';
      // if (deviceStatus['first'] == undefined) {
      //   deviceStatus['first'] = "{{ActionName}}"
      //   deviceStatus['ketword1'] = "{{AttrName}}"
      //   deviceStatus['ketword2'] = "{{DeviceName}}"
      //   deviceStatus['ketword3'] = "{{ValueName}}"
      //   // deviceStatus['ketword4'] = "{{factorname}}"
      // }
      Object.keys(deviceStatus).forEach((v) => {
        const item =
          formatAttributes.filter((k) => k.key === v)[0] ||
          formatConfs.filter((k) => k.key === v)[0];
        if (item) {
          if (deviceStatus[v] == null || deviceStatus[v] == '') {
            return;
          }
          const newItem = {
            key: v,
            value: `${deviceStatus[v]}`,
          };
          newItem.attrtype = item.attrtype;
          newItem.text = `${item.text}`;
          if (item.valuetype === valueType.enum || item.valuetype === valueType.string) {
            // 枚举 | 字符串
            const status = item.status.filter((k) => k.value === deviceStatus[v])[0] || {};
            newItem.text = `${item.text}-${status.text || deviceStatus[v]}`;
          }
          if (item.valuetype === valueType.range) {
            // 连续型
            newItem.text = `${item.text}-${deviceStatus[v]}`;
          }
          formatStatus.push(newItem);
        }
      });
      // formatStatus.push({key:'notedevicetype', value: 'device'})

      return formatStatus;
    },
  },
  // watch: {
  //   deviceStatus(newVal, oldVal) {
  //     this.selectedUserList = (newVal['touser'] || '').split(';')
  //     this.dids = [newVal['notedeviceid'] || '']
  //     console.log("did changed", dids)
  //   }
  // },
  async created() {
    // 获得产品属性，自动生成控制界面
    const { productid } = this;
    await this.getProductAttributes({ productid });
  },
  mounted() {
    this.selectedUserList = (this.deviceStatus['touser'] || '').split(';');
    // this.sourceList = this.deviceStatus['toname']
    this.dids = [this.deviceStatus['notedeviceid']];
    console.log('did mont', this.dids, this.selectedUserList, this.deviceStatus);
  },
  methods: {
    ...mapActions('deviceManage', ['getProductAttributes']),
    devicenameChange(e) {
      console.log(e);
      this.dids = [this.notedeviceName];
    },
    setDefault(key, val) {
      this.deviceStatus = Object.assign({}, this.deviceStatus, { [key]: val });
    },
    // 选择设备状态
    setAction(key, val) {
      console.log(key, val);
      const { deviceStatus } = this;
      let value;
      // 枚举取消选中
      value = deviceStatus[key] === val ? null : val;

      this.deviceStatus = Object.assign({}, this.deviceStatus, { [key]: value });
    },
    showPerson() {
      this.isAddUserModal = true;
    },
    handleCancelUserModal() {
      this.isAddUserModal = false;
    },
    handleOkUserModal(e) {
      this.isAddUserModal = false;
      // this.selectedUserList = e
      this.sourceList = e.map((item) => item.nickname).join(';');
      this.deviceStatus['touser'] = e.map((item) => item.openid).join(';');
      this.deviceStatus['toname'] = e.map((item) => item.nickname).join(';');
    },
    showDevice() {
      this.isDeviceModal = true;
    },
    handleCancelDevice() {
      this.isDeviceModal = false;
    },
    async handleOkDevice(e) {
      console.log(e);
      // this.dids = e
      this.notedeviceName = e[0].displayname || '';
      this.deviceStatus['notedeviceid'] = e[0].did || '';
      this.isDeviceModal = false;
      try {
        let resp = await deviceManageAsk.getProductDetail({
          id: e[0].productid,
          projectid: `${this.projectInfo.id}`,
        });
        if (resp && resp.data && resp.data.devicetype) {
          this.deviceStatus['notedevicetype'] = resp.data.devicetype || 'device';
        } else {
          this.deviceStatus['notedevicetype'] = 'device';
        }
      } catch (error) {
        this.deviceStatus['notedevicetype'] = 'device';
      }
    },
    // 取消弹窗
    cancel() {
      this.$emit('cancel');
    },
    // 确定弹窗
    ok() {
      console.log(this.getFormatStatus);
      const { getFormatStatus } = this;
      if (getFormatStatus.length <= 0) {
        this.$message.warning('请选择要执行的操作！');
        return;
      }
      this.$emit('ok', getFormatStatus);
      this.cancel();
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
