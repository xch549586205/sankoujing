<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-10 15:11:03
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-modal v-model="isModal"
             :mask-closable="false"
             :width="560"
             :footer="null"
             title="执行操作"
             @cancel="cancel">
      <a-spin :spinning="spinning">
        <a-form class="reset-form-item-10">
            <a-form-item 
                         :label-col="labelCol"
                         :wrapper-col="wrapperCol"
                         label="接收方">
              
              <a-input v-model="deviceStatus['sourceto']">
                <!-- <a-checkbox slot="addonAfter"  :checked="hasStatus(item.key)"  @click="()=>{setAction(item,deviceStatus[item.key])}"/> -->
                <a-button
                  slot="addonAfter"
                  class="reset-btn"
                  @click="showPerson">选择人员</a-button>
              </a-input>
            </a-form-item>

            <a-form-item 
                         :label-col="labelCol"
                         :wrapper-col="wrapperCol"
                         label="设备名称">
              
              <a-input v-model="deviceStatus['devicename']">
              </a-input>
            </a-form-item>
            <a-form-item 
                         :label-col="labelCol"
                         :wrapper-col="wrapperCol"
                         label="设备位置">
              
              <a-input v-model="deviceStatus['devlocation']">
              </a-input>
            </a-form-item>
            <a-form-item 
                         :label-col="labelCol"
                         :wrapper-col="wrapperCol"
                         label="报警级别">
              
              <a-input v-model="deviceStatus['level']">
              </a-input>
            </a-form-item>
            <a-form-item 
                         :label-col="labelCol"
                         :wrapper-col="wrapperCol"
                         label="报警原因">
              
              <a-input v-model="deviceStatus['alarmreason']">
              </a-input>
            </a-form-item>
               
            <a-form-item 
                         :label-col="labelCol"
                         :wrapper-col="wrapperCol"
                         label="备注信息">
              <a-textarea v-model="deviceStatus['message']">
              </a-textarea>

            </a-form-item>

          <div class="modal-footer-btn mt20">
            <a-button @click="cancel">取消</a-button>
            <a-button class="ml10"
                      type="primary"
                      @click="ok">确定
            </a-button>
          </div>
        </a-form>
      </a-spin>
    </a-modal>


    <UserListModal
      v-if="isAddUserModal"
      :data="selectedUserList"
      flag="groupid"
      @cancel="handleCancelUserModal"
      @ok="handleOkUserModal"
    />
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import service from 'servicePath/index';
  import UserListModal from '@/views/deviceManage/controlcomponents/common/userlistModal.vue'

  const { deviceManageAsk } = service;
  export default {
    name: 'StatusModal',
    components: {
      UserListModal
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
        selectedUserList: []
      };
    },
    computed: {
      ...mapGetters('deviceManage', ['formatAttributes', 'formatConfs']),
      ...mapState('deviceManage', ['valueType']),
      // 选中按钮
      getFormatStatus() {
        // 格式化属性
        const { deviceStatus = {}, formatAttributes = [], formatConfs = [], valueType } = this;
        console.log(deviceStatus);
        const formatStatus = [];
        Object.keys(deviceStatus).forEach(v => {
            const item = formatAttributes.filter(k => k.key === v)[0] || formatConfs.filter(k => k.key === v)[0]
            if (item) {
              if (deviceStatus[v] == null || deviceStatus[v] == "") {
                return
              }
              const newItem = {
                key: v,
                value: `${deviceStatus[v]}`,
              };
              newItem.attrtype = item.attrtype
              newItem.text = `${item.text}`
              if (item.valuetype === valueType.enum || item.valuetype === valueType.string) {
                // 枚举 | 字符串
                const status = item.status.filter(k => k.value === deviceStatus[v])[0] || {};
                newItem.text = `${item.text}-${status.text || deviceStatus[v]}`;
              }
              if (item.valuetype === valueType.range) {
                // 连续型
                newItem.text = `${item.text}-${deviceStatus[v]}`;
              }
              formatStatus.push(newItem);
            }
        });

        return formatStatus;
      },
    },
    watch: {
      deviceStatus(newVal, oldVal) {
        this.selectedUserList = (newVal['sourceto'] || '').split(',')
      }
    },
    async created() {
      // 获得产品属性，自动生成控制界面
      const { productid } = this;
      await this.getProductAttributes({ productid });
    },
    mounted() {},
    methods: {
      ...mapActions('deviceManage', ['getProductAttributes']),
      // 选择设备状态
      showPerson() {
        this.isAddUserModal = true
      },
      handleCancelUserModal() {
        this.isAddUserModal = false
      },
      handleOkUserModal(e) {
        this.isAddUserModal = false;
        this.selectedUserList = e
        this.deviceStatus['sourceto'] = (e.map(item=>item.accountname)).join(",")
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
