<template>
  <div>
    <!-- <a-radio-group
      :value="tab"
      default-value="current"
      button-style="solid"
      @change="(e) => (tab = e.target.value)"
    >
      <a-radio-button value="current" style="padding: 0 40px"> 快照值 </a-radio-button>
      <a-radio-button value="history" style="padding: 0 40px"> 历史值 </a-radio-button>
    </a-radio-group> -->
    <a-button v-if="tab === 'current'" type="primary" @click="getDevice"> 刷新数据 </a-button>
    <a-select
      v-if="tab === 'history'"
      style="margin-left: 20px"
      class="component-w-224"
      placeholder="全部事件"
      @change="handleChange"
    >
      <a-select-option value="-1"> 微断合闸事件 </a-select-option>
      <a-select-option value="1"> 微断拉闸事件 </a-select-option>
    </a-select>
    <a-select
      v-if="tab === 'history'"
      style="margin-left: 20px"
      class="component-w-224"
      placeholder="全部事件"
      @change="handleChange"
    >
      <a-select-option value="-1"> 微断合闸事件 </a-select-option>
      <a-select-option value="1"> 微断拉闸事件 </a-select-option>
    </a-select>
    <a-range-picker
      v-if="tab === 'history'"
      :value="rangeTime"
      style="margin-left: 20px"
      class="component-w-224"
      @change="onChangeRangeTime"
    >
      <a-icon slot="suffixIcon" type="smile" />
    </a-range-picker>
    <div class="currentData">
      <div class="data">
        <div class="title">模拟量</div>
        <div class="tabel">
          <a-table
            :columns="columns"
            :row-key="(record, i) => i"
            :data-source="currentList1"
            :loading="loading"
            :pagination="false"
            :scroll="{ y: 500 }"
            class="reset-pagination"
            @change="deviceChange"
          />
        </div>
      </div>
      <div class="data">
        <div class="title">数字量</div>
        <div class="tabel">
          <a-table
            :columns="columns"
            :row-key="record => `${record.id}${record.did}`"
            :data-source="currentList2"
            :loading="loading"
            :pagination="false"
            :scroll="{ y: 500 }"
            class="reset-pagination"
            @change="deviceChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import service from 'servicePath/index';
import { message } from 'ant-design-vue';

const columns = [
  {
    title: '属性',
    dataIndex: 'name_cn',
    width: 150,
  },
  {
    title: '数值',
    dataIndex: 'value',
    width: 150,
  },
];

const { deviceManageAsk } = service;
export default {
  name: 'CurrentData',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      rangeTime: [],
      id: this.$route.params.id,
      columns,
      currentProductInfo: {},
      tab: 'current',
      currentList1: [],
      currentList2: [],
    };
  },
  computed: {
    ...mapState('productManage', ['devicetypeList']),
    ...mapState('deviceManage', ['deviceInfo', 'currentWatchDeviceInfo', 'productInfo']),
    ...mapState('app', ['projectInfo']),
  },
  watch: {},
  async created() {
    await this.getDetailProduct();
    this.getList1();
    this.getList2();
  },
  mounted() {},
  destroyed() {},
  methods: {
    ...mapMutations('deviceManage', ['updateCurrentWatchDeviceInfo']),
    // 查询设备详情
    async getDevice() {
      await this.getList1();
      await this.getList2();
      message.success('刷新成功');
    },
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
    async getList1() {
      const digitalDataRes = await service.mainPageAsk.getDevtasklog({
        order: 'createtime',
        uuid: this.currentWatchDeviceInfo.did,
        // "eventresult": "%A_phsA\"%",
        seq: 1,
        limit: 10,
        offset: 1,
        msgtype: 'digitalData',
      });

      if (
        digitalDataRes.data &&
        digitalDataRes.data.devicetaskinfos &&
        digitalDataRes.data.devicetaskinfos.length
      ) {
        const data = JSON.parse(digitalDataRes.data.devicetaskinfos[0].eventresult)[0];
        const attributes = this.currentProductInfo.attributes || [];
        const arr = [];
        // eslint-disable-next-line guard-for-in
        for (const i in attributes) {
          const row = attributes[i];
          if (row.openvalue.indexOf('digitalData') !== -1) {
            if (data.hasOwnProperty(row.dnakit)) {
              arr.push({
                name: row.dnakit,
                name_cn: row.displayname,
                value: data[row.dnakit],
                value_cn: data[row.dnakit],
              });
            } else {
              arr.push({
                name: row.dnakit,
                name_cn: row.displayname,
                value: '--',
                value_cn: '--',
              });
            }
          }
        }
        this.currentList1 = arr;
      }
    },
    async getList2() {
      const digitalDataRes = await service.mainPageAsk.getDevtasklog({
        order: 'createtime',
        uuid: this.currentWatchDeviceInfo.did,
        // "eventresult": "%A_phsA\"%",
        seq: 1,
        limit: 10,
        offset: 1,
        msgtype: 'measurement',
      });
      if (
        digitalDataRes.data &&
        digitalDataRes.data.devicetaskinfos &&
        digitalDataRes.data.devicetaskinfos.length
      ) {
        const data = JSON.parse(digitalDataRes.data.devicetaskinfos[0].eventresult)[0];
        const attributes = this.currentProductInfo.attributes || [];
        const arr = [];
        // eslint-disable-next-line guard-for-in
        for (const i in attributes) {
          const row = attributes[i];
          if (row.openvalue.indexOf('measurement') !== -1) {
            if (data.hasOwnProperty(row.dnakit)) {
              arr.push({
                name: row.dnakit,
                name_cn: row.displayname,
                value: data[row.dnakit],
                value_cn: data[row.dnakit],
              });
            } else {
              arr.push({
                name: row.dnakit,
                name_cn: row.displayname,
                value: '--',
                value_cn: '--',
              });
            }
          }
        }
        this.currentList2 = arr;
      }
    },
    onChangeRangeTime(e) {
      this.rangeTime = e;
    },
  },
};
</script>

<style lang="less" scoped>
.currentData {
  padding-bottom: 50px;
  display: flex;
  background: #fff;
  width: 950px;
  padding-top: 27px;
  .data:nth-child(1) {
    width: 600px;
  }
  .data:nth-child(2) {
    width: 600px;
    margin-left: 150px;
  }
  .title {
    color: rgba(0, 0, 0, 1);
    font-size: 14px;
    font-weight: bold;
  }
  .tabel {
    margin-top: 15px;
  }
}
</style>
