<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-07-13 17:00:36
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-modal
      :title="modalTitle"
      v-model="isModal"
      :mask-closable="false"
      :width="700"
      :footer="null"
      ok-text="确定"
      cancel-text="取消"
      @cancel="cancel"
    >
      <MqtipcModal
        v-if="productInfo.devicetype == 'device' && productInfo.categoryname == 'mqtipc'"
        :productInfo="productInfo"
        :deviceInfo="deviceInfo"
        :formatAttributes="formatAttributes"
      />

      <CommonModal
        v-else-if="productInfo.devicetype == 'device' || 'subdevice'"
        :productInfo="productInfo"
        :deviceInfo="deviceInfo"
        :formatAttributes="formatAttributes"
      />
     
      <NoteModal
        v-else-if="productInfo.devicetype == 'note'"
        :productInfo="productInfo"
        :deviceInfo="deviceInfo"
        :formatAttributes="formatAttributes"
      />
      <WXGZHModal
        v-else-if="productInfo.devicetype == 'official'"
        :productInfo="productInfo"
        :deviceInfo="deviceInfo"
        :formatAttributes="formatAttributes"
      />
      <H5Modal
        v-else-if="productInfo.h5url != '' && productInfo.h5url != undefined"
        :productInfo="productInfo"
        :deviceInfo="deviceInfo"
        :formatAttributes="formatAttributes"
      />
      <WaitSupportModal
        v-else
        :isHome="isHome"
        :productInfo="productInfo"
        :deviceInfo="deviceInfo"
        :formatAttributes="formatAttributes"
      />
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
import CommonModal from './../controlcomponents/commonModal.vue';
import MqtipcModal from './../controlcomponents/mqtipcModal.vue';
import H5Modal from './../controlcomponents/h5Modal.vue';
import NoteModal from './../controlcomponents/noteModal.vue';
import WXGZHModal from './../controlcomponents/wxgzhModal.vue';
import WaitSupportModal from './../controlcomponents/waitSupportModal.vue';


const { deviceManageAsk } = service;
export default {
  name: 'ControlModalAdapter',
  components: {
    CommonModal,
    MqtipcModal,
    H5Modal,
    NoteModal,
    WXGZHModal,
    WaitSupportModal
  },
  props: {
    isHome: Boolean
  },
  data() {
    return {
      isModal: true,
      controlType: 'device',
    };
  },
  computed: {
    ...mapState('deviceManage', ['deviceInfo', 'valueType', 'productInfo']),
    ...mapGetters('deviceManage', ['formatAttributes']),
    ...mapState('app', ['projectInfo']),

    modalTitle() {
      // 单个控制显示设备名称，集中控制显示分组名称
      const title = this.deviceInfo.displayname;
      return `设备控制-${title}`;
    },
  },
  watch: {},
  created() {
    this.getAttributes();
  },
  mounted() {
  },
  methods: {
    ...mapMutations('deviceManage', ['updateDevice']),
    ...mapActions('deviceManage', ['getProductAttributes']),
    // 获得产品属性，自动生成控制界面
    getAttributes() {
      const { isSingle } = this;
      const { productid } = this.deviceInfo;
      const params = {
        productid: productid,
        projectid:this.projectInfo.id
      };
      this.getProductAttributes(params);
    },
    // 取消弹窗
    cancel() {
      this.$emit('cancel');
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
.modal {
  display: flex;
  justify-content: center;
}
</style>
