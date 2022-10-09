<template>
  <div>
    <div class="screen">
      <a-select
        :value="selectKey || (formatAttributes[0] ? formatAttributes[0].key : '')"
        class="component-w-224"
        placeholder="请选择参数"
        @change="(e) => (selectKey = e)"
      >
        <a-select-option v-for="(item, i) in formatAttributes" :key="i" :value="item.key">
          {{ item.text }}
        </a-select-option>
      </a-select>
      <a-range-picker
        :value="rangeTime"
        style="margin-left: 20px"
        class="component-w-224"
        @change="onChangeRangeTime"
      >
        <a-icon slot="suffixIcon" type="smile" />
      </a-range-picker>
      <Json-excel :data="dataList" class="export-excel-wrapper" name="控制日志.xls">
        <a-button style="margin-left: 20px" type="primary">导出</a-button>
      </Json-excel>
    </div>
    <list :custom-params="customParams" @updateDataList="updateDataList" />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import service from 'servicePath/index';
import list from '@/views/dataDisplay/detailedLog/remoteControl.vue';
import JsonExcel from 'vue-json-excel';

const { deviceManageAsk } = service;

const valueType = {
  string: '1', // 字符串
  enum: '2', // 枚举
  range: '3', // 连续型
};
export default {
  name: 'ControlLog',
  components: { list, JsonExcel },
  mixins: [],
  props: {},
  data() {
    return {
      selectKey: '',
      currentProductInfo: {},
      id: this.$route.params.id,
      dataList: [],
    };
  },
  computed: {
    ...mapState('dataDisplay', ['rangeTime']),
    ...mapState('deviceManage', ['deviceInfo', 'currentWatchDeviceInfo', 'productInfo']),
    ...mapState('app', ['projectInfo']),
    // 格式化产品属性
    formatAttributes() {
      const { attributes = [] } = this.currentProductInfo;
      if (attributes) {
        const operateAttr = attributes.filter((v) => v.operationtype !== '2') || []; // 过滤只读属性
        // console.log(attributes);
        const newAttributes = operateAttr.map((v) => {
          const { valuetype } = v;
          const item = {
            text: v.displayname,
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
          return item;
        });

        return newAttributes;
      }
      return [];
    },
    customParams() {
      return {
        selectKey: this.selectKey,
        did: this.currentWatchDeviceInfo.did,
      };
    },
  },
  watch: {},
  created() {
    this.getDetailProduct();
  },
  mounted() {},
  destroyed() {},
  methods: {
    ...mapMutations('dataDisplay', ['setRangeTime']),
    onChangeRangeTime(e) {
      this.setRangeTime(e);
    },
    updateDataList(dataList) {
      this.dataList = dataList;
    }, // 查询产品详情
    getDetailProduct() {
      const params = {
        id: this.currentWatchDeviceInfo.productid,
        projectid: `${this.projectInfo.id}`,
      };
      deviceManageAsk
        .getProductDetail(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.currentProductInfo = data;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.screen {
  margin-bottom: 24px;
  display: flex;
}
</style>
