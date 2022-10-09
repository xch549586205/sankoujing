<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-07-02 18:19:49
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-modal
      :title="modalTitle"
      v-model="isModal"
      :mask-closable="false"
      :width="560"
      :footer="null"
      ok-text="确定"
      cancel-text="取消"
      @cancel="cancel"
    >
      <a-spin :spinning="spinning">
        <a-form class="reset-form-item-10">
          <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            label="批量控制"
            style="margin-bottom: 0px">
            <a-switch v-model="isbatchcontrol"
                      default-checked
                      @change="onChangeSwitch" />
          </a-form-item>
          <template v-for="(item, index) in formatAttributes">
            <a-form-item
              v-if="item.valuetype === valueType.range"
              :key="`${item.key}${index}`"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :label="item.text"
              style="margin-bottom: 0px"
            >
              <a-slider
                :marks="{ [item.min]: item.min, [item.max]: item.max }"
                :max="item.max"
                :min="item.min"
                :step="item.step"
                v-model="deviceStatus[item.key].value"
                :disabled="disabled"
                @change="
                  (val) => {
                    isbatchcontrol?inputChange(item.key, val):devControl(item.key, val);
                  }
                "
              />
            </a-form-item>

            <a-form-item
              v-else-if="item.valuetype === valueType.string"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :key="`${item.key}${index}`"
              :label="item.text"
            >
              <a-row :gutter="10">
                <a-input-search
                  v-if="!isbatchcontrol"
                  enter-button="控制"
                  size="large"
                  @change="
                    (e) => {
                      inputChange(item.key, e.target.value);
                    }
                  "
                  @search="(e)=>{devControl(item.key, e)}"
                />
                <a-input
                  v-else
                  size="large"
                  @change="
                    (e) => {
                      inputChange(item.key, e.target.value);
                    }
                  "
                />
              </a-row>
            </a-form-item>
            <a-form-item
              v-else
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :key="`${item.key}${index}`"
              :label="item.text"
            >
              <a-row :gutter="10">
                <a-col v-for="v in item.status"
                       :span="6"
                       :key="`${v.value}`">
                  <a-button
                    :type="setStatus(item.key, v.value)"
                    :disabled="disabled"
                    class="reset-btn"
                    @click="
                      () => {
                        isbatchcontrol?inputChange(item.key, v.value):devControl(item.key, v.value);
                      }
                    "
                  >
                    {{ v.text }}
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </template>
        </a-form>
        <a-button v-if="isbatchcontrol"
                  class="batchcontrol"
                  type="primary"
                  @click="devControlBatch">批量控制</a-button>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';

const { deviceManageAsk } = service;
export default {
  name: 'CentralControlModal',
  components: {},
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
      isbatchcontrol: false,
      deviceStatus: {}
    };
  },
  computed: {
    ...mapState('deviceManage', ['deviceInfo', 'valueType']),
    ...mapState('groupManage', ['node']),
    ...mapState({
      // deviceStatus: (state) => {

      //  if (this.isbatchcontrol){
      //    console.log("deviceStatus",state)
      //    return state.deviceManage.deviceInfo.statusmapvirtual || {}
      //  }
      //    console.log("deviceStatus",state)

      //   return state.deviceManage.deviceInfo.statusmap || {}
      // },
    }),
    ...mapGetters('deviceManage', ['formatAttributes']),
    disabled() {
      // const { online } = this.deviceInfo;
      // return online !== '1';
      return this.$moment(this.deviceInfo.lastreport) < this.$moment().subtract(5, 'm');
    },

    modalTitle() {
      // 单个控制显示设备名称，集中控制显示分组名称
      const title = this.isSingle ? this.deviceInfo.displayname : this.node.dataRef.name;
      return `设备控制-${title}`;
    },
    // 选中按钮
    setStatus() {
      return function (key, val) {
        const statusmap = this.isbatchcontrol ?
                this.deviceInfo.statusmapvirtual : this.deviceInfo.statusmap;
        this.deviceStatus = statusmap;
        console.log('statusmap', statusmap, this.deviceInfo);
        if (statusmap && statusmap[key]) {
          return statusmap[key].value === val ? 'primary' : null;
        }
        return null;
      };
    },
  },
  watch: {},
  created() {
    this.getAttributes();
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
    async getAttributes() {
      const { isSingle } = this;
      const { productid } = this.deviceInfo;
      const productId = isSingle ? productid : productid[0];
      const params = {
        productid: productId,
      };
      console.log('formatAttributes', this.formatAttributes)

      await this.getProductAttributes(params);
      console.log('formatAttributes', this.formatAttributes)
    },
    onChangeSwitch(e) {
      console.log(e, this.isbatchcontrol);
      this.deviceInfo.statusmapvirtual = JSON.parse(JSON.stringify(this.deviceInfo.statusmap));
    },
    devControlBatch() {
      this.spinning = true;
      const did = this.deviceInfo.did;
      const statusmap = this.deviceInfo.statusmapvirtual;
      const { isSingle } = this;
      // 判断是否是集中控制
      console.log('statusmap', statusmap);
      const devctrs = [];
      const controldata = {};
      for (let index in this.formatAttributes) {
        let item = this.formatAttributes[index];
        if (statusmap[item.key] != undefined &&
          statusmap[item.key].value != undefined) {
          controldata[item.key] = `${statusmap[item.key].value}`;
        }
      }
      devctrs.push({
        did: did,
        data: controldata,
      });
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
    inputChange(key, val) {
      const did = this.deviceInfo.did;
      let statusmapvirtual = this.deviceInfo.statusmapvirtual;
      console.log('this.deviceInfo', this.deviceInfo, key, val);
      if (statusmapvirtual == undefined) {
        statusmapvirtual = {};
      }
      if (statusmapvirtual[key] == undefined) {
        statusmapvirtual[key] = { value: '' };
      }

      statusmapvirtual[key].value = val;
      const deviceInfo = { ...this.deviceInfo, statusmapvirtual };
      console.log('deviceInfo', deviceInfo);
      this.updateDevice(deviceInfo);
    },
    // 控制设备
    devControl(key, val) {
      this.spinning = true;
      const did = this.deviceInfo.did;
      let statusmap = this.deviceInfo.statusmap;
      console.log('this.deviceInfo', this.deviceInfo, key, val);
      if (statusmap == undefined) {
        statusmap = {};
      }
      if (statusmap[key] == undefined) {
        statusmap[key] = {};
      }
      const sendval = val;
      statusmap[key].value = sendval;
      const status = statusmap;
      const deviceInfo = { ...this.deviceInfo, status };
      this.updateDevice(deviceInfo);
      const { isSingle } = this;
      // 判断是否是集中控制
      const dids = isSingle ? [did] : did;
      const controldata = {};
      controldata[key] = `${sendval}`;
      const devctrs = dids.map((v) => ({
        did: v,
        data: controldata,
      }));

      const params = {
        devctrs,
      };
      console.log('devControl :', devctrs, key, val);
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
.batchcontrol{
  width: 500px;
}
</style>
