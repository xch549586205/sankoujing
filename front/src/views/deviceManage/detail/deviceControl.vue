<template>
  <a-form layout="horizontal" label-align="right">
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      label="微断状态"
    >
      <img :src="statusPic" />
    </a-form-item>
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      label="控制命令"
    >
      <div>
        <p>选择需要执行的命令后，点击执行</p>
        <a-select
          :value="selectKey || formatAttributes[0].key"
          placeholder="请选择参数"
          @change="e => (selectKey = e)"
        >
          <a-select-option v-for="(item, i) in formatAttributes" :key="i" :value="item.key">
            {{ item.text }}
          </a-select-option>
        </a-select>
        <a-select :value="selectVal" placeholder="请选择" @change="e => (selectVal = e)">
          <a-select-option v-for="(item, i) in status" :key="i" :value="item.value">
            {{ item.text }}
          </a-select-option>
        </a-select>
      </div>
    </a-form-item>
    <div v-for="(item, i) in params" :key="i"></div>
    <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
      <a-button type="primary" @click="devControl"> 执行 </a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import QRCode from 'qrcode';
import { mapState, mapMutations } from 'vuex';
import service from 'servicePath/index';
import devicePic from '../../devicePic';

function getPid(pid) {
  if (!pid) {
    return;
  }
  if (pid.toLowerCase().indexOf('1p') !== -1) {
    return '1p';
  }
  if (pid.toLowerCase().indexOf('2p') !== -1) {
    return '2p';
  }
  if (pid.toLowerCase().indexOf('3p') !== -1) {
    return '3p';
  }
  if (pid.toLowerCase().indexOf('4p') !== -1) {
    return '4p';
  }
}
const { deviceManageAsk } = service;
const valueType = {
  string: '1', // 字符串
  enum: '2', // 枚举
  range: '3', // 连续型
};
export default {
  name: 'DeviceControl',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      id: this.$route.params.id,
      device: {},
      isChargingdev: false,
      hasChargingport: false,
      thirdconfurl: 'https://osimdev.ibroadlink.com/ctuoYqEGqY',
      currentProductInfo: {},
      selectKey: '',
      selectVal: undefined,
    };
  },
  computed: {
    ...mapState('productManage', ['devicetypeList']),
    ...mapState('deviceManage', ['deviceInfo', 'currentWatchDeviceInfo', 'productInfo']),
    ...mapState('app', ['projectInfo']),
    formItemLayout() {
      return {
        labelCol: { span: 2 },
        wrapperCol: { span: 3, offset: '20px' },
      };
    },
    buttonItemLayout() {
      return {
        wrapperCol: { span: 14, offset: 2 },
      };
    },
    // 格式化产品属性
    formatAttributes() {
      const { attributes = [] } = this.currentProductInfo;
      if (attributes) {
        const operateAttr =
          attributes.filter(v => v.operationtype !== '2' && v.dnakit.indexOf('-') === -1) || []; // 过滤只读属性 以及网关读写参数
        // console.log(attributes);
        const newAttributes = operateAttr.map(v => {
          const { valuetype } = v;
          const item = {
            text: v.displayname === 'action' ? '远程控制' : v.displayname,
            key: v.openproxy,
            valuetype,
            status: [],
            attrtype: 'device',
          };
          // 枚举 | 字符串
          if (valuetype === valueType.enum) {
            v.openvalue = v.openvalue.replace(/，/g, ',');
            v.openname = v.openname.replace(/，/g, ',');
            const values = (v.openvalue && v.openvalue.split(',')) || [];
            const texts = (v.openname && v.openname.split(',')) || [];
            item.status = values.map((k, index) => ({ text: texts[index] || k, value: k }));
          }
          if (valuetype === valueType.string) {
            item.status = [{ text: v.openproxy || v.openvalue, value: v.openvalue }];
          }
          // 连续型
          if (valuetype === valueType.range) {
            const range = (v.openvalue && v.openvalue.split('-')) || [];
            if (range) {
              item.min = parseInt(range[0]);
              item.max = parseInt(range[1]);
              item.step = 1;
            }
          }
          if (valuetype === '1' && v.dnakit === 'action') {
            const values = ['open', 'close'];
            const texts = ['开', '关'];
            item.status = values.map((k, index) => ({ text: texts[index] || k, value: k }));
          }
          return item;
        });

        return newAttributes;
      }
      return [];
    },
    statusPic() {
      const currentOnOff =
        this.currentWatchDeviceInfo.statusmap &&
        this.currentWatchDeviceInfo.statusmap.action.value !== 'nil'
          ? this.currentWatchDeviceInfo.statusmap.action.value
          : 'close';
      const { pid } = this.currentProductInfo;
      return devicePic[currentOnOff][getPid(pid)];
    },
    status() {
      const selected = this.formatAttributes.filter(
        attr => attr.key === (this.selectKey || this.formatAttributes[0].key)
      );
      return selected && selected.length ? selected[0].status : [];
    },
  },
  watch: {},
  created() {
    this.getDetailProduct();
  },
  mounted() {},
  destroyed() {},
  updated() {},

  methods: {
    // 查询产品详情
    getDetailProduct() {
      const params = {
        id: this.currentWatchDeviceInfo.productid,
        projectid: `${this.projectInfo.id}`,
      };
      deviceManageAsk
        .getProductDetail(params)
        .then(result => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.currentProductInfo = data;
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 控制设备
    devControl() {
      const key = this.selectKey || this.formatAttributes[0].key;
      const val = this.selectVal;
      const { id } = this.currentWatchDeviceInfo;
      let statusmap = { ...this.currentWatchDeviceInfo }.statusmap;
      if (statusmap == undefined) {
        statusmap = {};
      }
      if (statusmap[key] == undefined) {
        statusmap[key] = {};
      }
      const sendval = val;
      statusmap[key].value = sendval;
      const dids = [id];
      // const controldata = {};
      // controldata[key] = `${sendval}`;
      const action = {
        [key]: val,
        datatype: 'service',
        devtype: 'mcb',
        msgtype: 'control',
        src: 'local',
        target: 'breaker',
        user_code: 'root',
      };
      const devctrs = dids.map(v => ({
        did: v,
        data: {
          action: JSON.stringify(action),
        },
      }));

      const params = {
        devctrs,
      };
      deviceManageAsk
        .devControl(params)
        .then(result => {
          const { errcode } = result;
          if (errcode === 200) {
            this.$message.success('命令下发成功!');
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

<style lang="less" scoped></style>
