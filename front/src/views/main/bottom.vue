<template>
  <a-row class="bottom">
    <div class="warningList">
      <a-table
        :columns="columns"
        :row-key="(record, i) => `${record.title + i}`"
        :data-source="data"
        :loading="loading"
        class="reset-pagination"
        @change="handleTableChangePage"
      />
    </div>
  </a-row>
</template>
<script>
import service from 'servicePath/index';
import { warningList } from './util';
import moment from 'moment';
import { mapState } from 'vuex';

const { dataDisplayAsk, deviceManageAsk } = service;
function getStr(deviceList) {
  // "value": "%\"Wave_rcd\":\"1\"%,%\"Sw_cluuidose\":\"1\"%"
  let _str = '';
  deviceList.map((deviceid) => {
    // eslint-disable-next-line no-useless-escape
    _str += `%\"did\":\"${deviceid}\"%,`;
  });
  return _str.slice(0, _str.length - 1);
}
export default {
  name: 'Main',
  components: {},
  mixins: [],
  props: {},

  data() {
    return {
      pagination: {},
      data: [],
      loading: false,
      columns: [
        {
          title: '发生时间',
          dataIndex: 'createtime',
          align: 'center',
        },
        {
          title: 'UUID',
          dataIndex: 'did',
          align: 'center',
        },
        {
          title: '名称',
          dataIndex: 'deviceName',
          align: 'center',
        },

        {
          title: '操作者',
          dataIndex: 'account',
          align: 'center',
        },

        {
          title: '操作类型',
          dataIndex: 'type',
          align: 'center',
        },
        {
          title: '结果',
          dataIndex: 'result',
          align: 'center',
        },
      ],
    };
  },
  computed: {
    ...mapState('mainPage', ['checkedDevices']),
  },
  watch: {
    checkedDevices(newVal, oldVal) {
      if (newVal.length) {
        this.getData({ page: 1 });
      }
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    async handleTableChangePage(pagination) {
      this.pagination = pagination;
      this.getData({ page: pagination.current });
    },
    // 查询设备
    async getAllDevice() {
      const params = {
        offset: 1,
        limit: 999999999,
      };
      const { errcode, data = {} } = await deviceManageAsk.getDevice(params);

      return data.deviceInfos;
    },
    async getData({ page = 1 }) {
      this.loading = true;
      try {
        const devices = await this.getAllDevice();
        const params = {
          limit: 200,
          offset: page,
          order: 'createtime',
          seq: 1,
        };
        const { errcode, data = {} } = await dataDisplayAsk.getControlLog({
          ...params,
          order: 'createtime',
        });
        this.pagination = {
          ...this.pagination,
          total: data.totalsize || 0,
        };
        const { devicecontrolinfos } = data;
        console.log(devicecontrolinfos, 'devicecontrolinfos');
        this.data = devicecontrolinfos
          .filter((d) => this.checkedDevices.indexOf(d.did) !== -1)
          .slice(0, 5)
          .map((log) => {
            const { param } = log;
            let type = '';
            let _param = param.replace('map[action:', '');
            _param = _param.substr(0, _param.length - 1);
            const parseParam = JSON.parse(_param);
            if (parseParam.msgtype === 'timedtask' && parseParam.action === 'get') {
              type = '获取定时';
            }
            if (parseParam.msgtype === 'timedtask' && parseParam.action === 'set') {
              type = '设置定时';
            }
            if (parseParam.msgtype === 'params' && parseParam.action === 'set') {
              type = '网关参数读写';
            }
            if (parseParam.devtype === 'mcb' && parseParam.msgtype === 'control') {
              type = '微断控制';
            }
            return {
              ...log,
              type,
              deviceName: devices.filter((d) => d.did === log.did)[0].displayname,
              createtime: moment(log.createtime).format('YYYY-MM-DD HH:mm:ss'),
              result: JSON.parse(log.result).Success ? '成功' : '失败',
            };
          });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.warningList {
  margin-top: 20px;
  background: #fff;
}
</style>
