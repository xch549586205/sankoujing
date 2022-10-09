<template>
  <div>
    <a-modal v-model="showEditModal.show" title="编辑" @ok="handleOk">
      <div style="display: flex; line-height: 32px">
        <div>{{ showEditModal.name }}:</div>
        <div style="margin-left: 10px">
          <a-input
            @change="
              (e) => {
                showEditModal = { ...showEditModal, inputValue: e.target.value };
              }
            "
          />
        </div>
      </div>
    </a-modal>
    <a-select
      :value="currentSelect"
      class="component-w-224"
      placeholder="全部事件"
      @change="handleChange"
    >
      <a-select-option v-for="item in selectOption" :key="item.param" :value="item.param">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <a-button type="primary" @click="getList(currentSelect)"> 刷新数据 </a-button>
    <div class="table">
      <a-table
        :columns="columns"
        :row-key="(record, i) => `${record.dnakit}${i}`"
        :data-source="currentParamsList"
        :loading="loading"
        :pagination="false"
        class="reset-pagination"
      >
        <template slot="operation" slot-scope="text, record">
          <a
            v-if="record.operationtype !== '2'"
            @click="showEdit({ name: record.displayname, param: record.dnakit })"
          >
            编辑
          </a>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import service from 'servicePath/index';
import { message } from 'ant-design-vue';
import moment from 'moment';
import AddModal from '@/views/groupManage/list/addModal.vue';

const columns = [
  {
    title: '更新时间',
    dataIndex: 'time',
  },
  {
    title: '参数名',
    dataIndex: 'displayname',
  },
  {
    title: '参数值',
    dataIndex: 'value',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
  },
];

const { deviceManageAsk, dataDisplayAsk } = service;
export default {
  name: 'ParamsHandle',
  components: { AddModal },
  mixins: [],
  props: {},
  data() {
    return {
      rangeTime: [],
      loading: false,
      id: this.$route.params.id,
      columns,
      currentProductInfo: {},
      currentSelect: '',
      showEditModal: { show: false },
      currentParamsList: [],
    };
  },
  computed: {
    ...mapState('productManage', ['devicetypeList']),
    ...mapState('deviceManage', ['deviceInfo', 'currentWatchDeviceInfo', 'productInfo']),
    ...mapState('app', ['projectInfo']),

    rwParams() {
      return this.currentProductInfo.attributes && this.currentProductInfo.attributes.length
        ? this.currentProductInfo.attributes.filter((a) => a.dnakit.indexOf('-') !== -1)
        : [];
    },
    selectOption() {
      const rwParams =
        this.currentProductInfo.attributes && this.currentProductInfo.attributes.length
          ? this.currentProductInfo.attributes.filter((a) => a.dnakit.indexOf('-') !== -1)
          : [];

      const option = [];
      rwParams.map((param) => {
        if (option.filter((o) => o.param === param.dnakit.split('-')[0]).length === 0) {
          option.push({ param: param.dnakit.split('-')[0], name: param.displayname.split('-')[0] });
        }
      });
      return option;
    },
  },
  watch: {
    selectOption: {
      async handler(newVal, oldVal) {
        if (newVal) {
          this.handleChange(newVal[0].param);
        }
      },
      deep: true,
    },
    currentSelect: {
      async handler(newVal, oldVal) {
        if (newVal) {
          this.getParamsList();
        }
      },
      deep: true,
    },
  },
  created() {
    this.getDetailProduct();
  },
  mounted() {},
  destroyed() {},
  methods: {
    ...mapMutations('deviceManage', ['updateCurrentWatchDeviceInfo']),
    handleOk() {
      const { inputValue, param } = this.showEditModal;
      this.devControl({ value: inputValue, param });
    },
    showEdit({ name = '', param = '' }) {
      this.showEditModal = { name, param, show: true };
    },
    //查询参数列表
    async getList(name) {
      this.loading = true;

      try {
        const { errcode, data = {} } = await dataDisplayAsk.getReportLog({
          limit: 15,
          offset: 1,
          order: 'createtime',
          seq: 1,
          uuid: this.currentWatchDeviceInfo.did,
          value: `%${name}%`,
        });
        return data.alist && data.alist.length ? data.alist[0] : {};
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    handleChange(currentSelect) {
      this.currentSelect = currentSelect;
    },
    async getParamsList() {
      const rwParams =
        this.currentProductInfo.attributes && this.currentProductInfo.attributes.length
          ? this.currentProductInfo.attributes.filter((a) => a.dnakit.indexOf('-') !== -1)
          : [];
      const currentParamsList = rwParams.filter(
        (p) => p.dnakit.split('-')[0] === this.currentSelect
      );
      const data = await this.getList(this.currentSelect);
      const value = JSON.parse(data.value);
      this.currentParamsList = [...currentParamsList].map((p) => {
        const param = p.dnakit.split('-')[1];
        return {
          ...p,
          time: moment(data.createtime).format('YYYY-MM-DD HH:mm:ss'),
          value: value[param],
        };
      });
    },

    // 查询产品详情
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
    // 控制设备
    async devControl({ param, value }) {
      const params = {
        datatype: 'service',
        devtype: 'gw',
        msgtype: 'params',
        action: 'set',
        // enable: 'yes', //是否启用
        user_code: 'root',
        src: 'local',
        [param.split('-')[1]]: value,
      };
      const res = await deviceManageAsk.devControl({
        devctrs: [
          {
            did: this.currentWatchDeviceInfo.id,
            data: { action: JSON.stringify(params) },
          },
        ],
      });
      this.showEditModal = { show: false };
      this.getList(this.currentSelect);
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
}
.table {
  margin-top: 15px;
}
</style>
