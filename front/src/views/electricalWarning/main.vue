<template>
  <div class="header-panel">
    <showSettingModalVue
      :visible="showModal"
      :checked-list="checkedList"
      @setCheckedList="setCheckedList"
      @setShowModal="setShowModal"
    ></showSettingModalVue>
    <bl-header>
      <div slot="left" style="display: flex" class="left">
        <Filters
          :show="[
            'rangePicker',
            'cascaderOptions',
            'gatewayListOption',
            'selectFirstDevice',
            'hideAllDevice',
          ]"
        />
      </div>
    </bl-header>
    <div style="padding: 0 20px">
      <div class="statistics">
        <div class="title">
          <p>用电告警统计</p>
          <div>
            <a-button @click="setShowModal">展示设置</a-button>
          </div>
        </div>
        <a-row class="chart">
          <a-col :span="24">
            <chart :data-name="dataName" :data-value="dataValue" />
          </a-col>
        </a-row>
      </div>
      <div style="display: flex; margin-top: 20px" class="left">
        <Filters :show="['subDeviceListOption', 'selectFirstDevice', 'hideAllDevice']" />
        <a-select
          style="margin-left: 20px; width: 240px"
          placeholder="全部警告事件"
          @change="changeTableEvent"
        >
          <a-select-option value="-1"> 全部警告事件 </a-select-option>
          <a-select-option
            v-for="(check, i) in eventCheckedList"
            :key="i + 'checkEvent333'"
            :value="check"
          >
            {{ check }}
          </a-select-option>
        </a-select>
      </div>
      <div class="warningList">
        <a-table
          :columns="columns"
          :row-key="(record, i) => `${i}warningList`"
          :loading="loading"
          :data-source="tableDataList"
          :pagination="pagination"
          class="reset-pagination"
          @change="handleTableChangePage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import showSettingModalVue from './showSettingModal.vue';
import chart from './chart.vue';
import service from 'servicePath/index';
import Filters from '@/views/components/filters.vue';
import { warningList } from '../main/util';
import moment from 'moment';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

const { mainPageAsk } = service;
function dedupe(array) {
  return Array.from(new Set(array));
}
function getStr(_warningList) {
  // "value": "%\"Wave_rcd\":\"1\"%,%\"Sw_close\":\"1\"%"
  let _str = '';
  _warningList.map(({ name, param, belongTo }) => {
    _str += `%\"${param}\":\"1\"%,`;
  });
  return _str.slice(0, _str.length - 1);
}
export default {
  name: 'ElectricalWarningMain',
  components: {
    showSettingModalVue,
    chart,
    Filters,
  },
  props: {},
  data() {
    return {
      checkedList: dedupe(warningList.map((warn) => warn.group)),
      eventCheckedList: dedupe(warningList.map((warn) => warn.group)),
      data: [],
      tableDataList: [],
      dataName: [],
      tableEvent: dedupe(warningList.map((warn) => warn.group)),
      dataValue: [],
      pagination: {},
      loading: false,
      columns: [
        {
          title: '发生时间',
          dataIndex: 'createtime',
          align: 'center',
        },
        {
          title: '设备型号',
          dataIndex: 'devModel',
          align: 'center',
        },
        {
          title: 'UUID',
          dataIndex: 'uuid',
          align: 'center',
        },

        {
          title: '名称',
          dataIndex: 'displayname',
          align: 'center',
        },

        {
          title: '所属网关',
          dataIndex: 'gateway',
          align: 'center',
        },
        {
          title: '所属配电箱',
          dataIndex: 'group',
          align: 'center',
        },

        {
          title: '告警事件',
          dataIndex: 'eventGroup',
          align: 'center',
        },
        {
          title: '事件状态',
          dataIndex: 'status',
          align: 'left',
        },
        {
          title: '事件状态',
          dataIndex: 'event',
          align: 'left',
        },
      ],
      showModal: false,
    };
  },
  computed: {
    ...mapState('filters', ['filterParams']),
  },
  watch: {
    filterParams: {
      async handler(newVal, oldVal) {
        if (newVal.subDeviceSelect !== oldVal.subDeviceSelect) {
          this.getList({});
        }
        if (newVal.subDeviceListOption !== oldVal.subDeviceListOption) {
          this.getChartData();
        }
      },
      deep: true,
    },
    tableEvent: {
      async handler(newVal, oldVal) {
        if (newVal.length !== oldVal.length) {
          this.getList({});
        }
      },
      deep: true,
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    changeTableEvent(tableEvent) {
      if (tableEvent * 1 === -1) {
        this.tableEvent = this.eventCheckedList;
      } else {
        this.tableEvent = [tableEvent];
      }
    },
    async handleTableChangePage(pagination) {
      this.pagination = pagination;
      this.getList({ page: pagination.current });
    },
    setShowModal(e) {
      this.showModal = e;
    },
    setCheckedList(checkedList) {
      this.checkedList = checkedList;
      this.renderChart();
    },
    async getList({ page = 1 }) {
      this.loading = true;
      try {
        const {
          subDeviceListOption = [],
          subDeviceSelect = [],
          rangePicker,
          gatewayListOption,
          cascaderOptions,
        } = this.filterParams;

        const filterWarningList = warningList.filter(
          (warnning) => this.tableEvent.indexOf(warnning.group) !== -1
        );
        const warningQueryStr = getStr(filterWarningList);
        const params = {
          offset: page,
          limit: 8,
          seq: 1,
          order: 'createtime',
          account:
            subDeviceListOption && subDeviceSelect.length
              ? subDeviceSelect[0]
              : subDeviceListOption.length
              ? subDeviceListOption[0].did
              : '',
          key: 'soe',
          value: warningQueryStr,
          groupfield: "DATE_FORMAT(createtime,'%Y-%m-%d')",
        };
        if (rangePicker && rangePicker.length) {
          params.starttime = rangePicker[0].format(this.GLOBAL.TIME_LOG);
          params.endtime = rangePicker[1].format(this.GLOBAL.TIME_LOG);
        }
        const res = await mainPageAsk.getReportLog({
          ...params,
        });
        this.pagination = {
          ...this.pagination,
          pageSize: 8,
          total: res.data.totalsize || 0,
        };
        const tableDataList = res.data.alist || [];
        this.tableDataList = tableDataList.map((row) => {
          const devInfo = subDeviceListOption.filter((dev) => dev.id === row.did)[0] || {};
          let devModel = '';
          let gateway = '';
          let group = ''; // 所属配电箱
          // 解析出网关 配电箱 型号
          if (devInfo && devInfo.privatedata) {
            const { model, gatewayId } = JSON.parse(devInfo.privatedata);
            devModel = model;
            const gatewayInfo = gatewayListOption.filter((gate) => gate.did === gatewayId)[0];
            gateway = gatewayInfo.displayname;
            cascaderOptions.map(({ children, label }) => {
              const _label = `${label}/`;
              children.map((_group) => {
                if (_group.value === gatewayInfo.groupid) {
                  group = _label + _group.label;
                }
              });
            });
          }
          const content = JSON.parse(row.value);
          // 详情
          let event = '';
          // 事件
          let eventGroup = '';
          // 事件状态
          let status = '';
          // eslint-disable-next-line guard-for-in
          for (const key in content) {
            const warningListFilter = warningList.filter((w) => w.param === key);
            if (warningListFilter.length) {
              status = content[key] * 1 === 0 ? '恢复' : '发生';
              event = warningListFilter[0].name;
              eventGroup = warningListFilter[0].group;
            }
          }
          return {
            ...row,
            createtime: moment(row.createtime).format('YYYY-MM-DD HH:mm:ss'),
            devModel,
            displayname: devInfo && devInfo.displayname,
            uuid: devInfo.did,
            gateway,
            group,
            status,
            event,
            eventGroup,
          };
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async getChartData() {
      const { subDeviceListOption = [], subDeviceSelect = [] } = this.filterParams;
      const warningQueryStr = getStr(warningList);
      const params = {
        offset: 1,
        limit: 150000,
        seq: 0,
        order: 'createtime',
        key: 'soe',
        value: warningQueryStr,
        groupfield: "DATE_FORMAT(createtime,'%Y-%m-%d')",
      };

      try {
        const res = await mainPageAsk.getReportLog({
          ...params,
        });
        const dataList = res.data.alist.map((d) => ({
          ...JSON.parse(d.groupcnt),
          createtime: d.createtime,
          did: d.did,
        }));
        const num = {};
        let count = 0;
        warningList.map((warn) => {
          num[warn.group] = 0;
        });
        const filterList = dataList.filter((d) =>
          this.filterParams.subDeviceListOption
            ? this.filterParams.subDeviceListOption.map((_d) => _d.did).indexOf(d.did) !== -1
            : true
        );
        debugger;
        filterList.map((datas) => {
          // eslint-disable-next-line guard-for-in
          // eslint-disable-next-line guard-for-in
          for (const key in datas) {
            const current = warningList.filter((warnning) => `sum${warnning.param}1` === key);
            const fromGroup = current.length ? current[0].group : '';
            if (fromGroup) {
              num[fromGroup] = num[fromGroup] || 0;
              if (datas[key] * 1 > 0) {
                num[fromGroup] += datas[key] * 1;
                count += 1;
              }
            }
          }
        });

        this.data = num;
        this.renderChart(num);
      } catch (error) {
        console.error(error);
      }
    },
    renderChart(data = this.data) {
      const dataName = [];
      const dataValue = [];
      // eslint-disable-next-line guard-for-in
      for (const key in data) {
        if (this.checkedList.indexOf(key) !== -1) {
          dataName.push(key);
          dataValue.push(this.data[key]);
        }
      }

      this.dataName = dataName;
      this.dataValue = dataValue;
    },
  },
};
</script>

<style lang="less" scoped>
.number {
  margin-bottom: 10px;
  text-align: center;
  background: #fff;
  border-radius: 4px;
  padding: 19px 0 16px 0;
  > div {
    > p:nth-child(1) {
      color: rgba(119, 119, 119, 1);
      font-size: 15px;
      height: 22px;
      margin-bottom: 4px;
    }
    > p:nth-child(2) {
      color: rgba(46, 140, 240, 1);
      font-size: 26px;
      height: 40px;
      margin-bottom: 0;
    }
  }
  > div:nth-child(1),
  > div:nth-child(2) {
    border-right: 1px solid rgba(229, 229, 229, 1);
  }
}
.statistics {
  background: #fff;
  padding: 5px 30px 10px 30px;
  .title {
    height: 56px;
    line-height: 56px;
    display: flex;
    border-bottom: 1px solid rgba(229, 229, 229, 1);

    > p {
      color: rgba(56, 56, 56, 1);
      font-size: 16px;
      font-weight: bold;
    }
    > div {
      margin: auto 0 auto auto;
      > div {
        height: 36px;
        line-height: 36px;
      }
    }
  }
  .chart {
    > div:nth-child(1) {
    }
  }
  .ranking {
    padding-top: 28px;
    > div:nth-child(1) {
      color: rgba(56, 56, 56, 1);
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    .rankingItem {
      margin: 16px 0;
      display: flex;
      .left {
        > span {
          width: 24px;
          height: 24px;
          line-height: 24px;
          margin-right: 20px;
          font-size: 24px;
          color: rgba(0, 0, 0, 1);
          font-size: 16px;
          font-weight: bold;
          display: inline-block;
          text-align: center;
        }
        .top3 {
          background: rgba(46, 140, 240, 1);
          color: #fff;
          border-radius: 3px;
        }
      }
      .right {
        margin-left: auto;
      }
    }
  }
}
.warningList {
  margin-top: 20px;
  background: #fff;
}
</style>
