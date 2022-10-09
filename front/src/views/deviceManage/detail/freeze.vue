<template>
  <div class="freeze">
    <div class="selectBox">
      <div class="dateType">
        <div
          v-for="(type, i) in ['mon', 'day', 'hour']"
          :key="i"
          :class="{ type: true, activeType: type === dateType }"
          @click="changeDateType(type)"
        >
          {{ ['月', '日', '整点'][i] }}
        </div>
      </div>
      <a-range-picker class="picker" @change="onChangeDate">
        <a-icon slot="suffixIcon" type="smile" />
      </a-range-picker>
      <a-button
        style="margin-left: 20px"
        type="primary"
        @click="
          () => {
            getData({});
            pagination = { current: 1 };
          }
        "
      >
        刷新数据
      </a-button>
      <Json-excel :data="data" class="export-excel-wrapper" name="冻结.xls">
        <a-button style="margin-left: 20px" type="primary">导出</a-button>
      </Json-excel>
    </div>
    <a-table
      :columns="columns"
      :row-key="(record) => `${record.key}`"
      :data-source="data"
      :loading="loading"
      :pagination="pagination"
      class="listTable"
      @change="handleTableChangePage"
    >
    </a-table>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import service from 'servicePath/index';
import JsonExcel from 'vue-json-excel';
import { MONTH_FREEZE_MONTH_TITLE, MONTH_FREEZE_DAY_TITLE, MONTH_FREEZE_HOUR_TITLE } from './util';

export default {
  name: 'ControlLog',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      loading: false,
      dateType: 'mon',
      timerLimit: [],
      data: [],
      pagination: {},
    };
  },
  computed: {
    ...mapState('productManage', ['devicetypeList']),
    ...mapState('deviceManage', ['currentWatchDeviceInfo']),
    ...mapState('app', ['running', 'projectInfo']),
    columns() {
      const titles = {
        mon: MONTH_FREEZE_MONTH_TITLE,
        day: MONTH_FREEZE_DAY_TITLE,
        hour: MONTH_FREEZE_HOUR_TITLE,
      }[this.dateType];
      const columns = titles.map((title) => ({
        dataIndex: title.param,
        title: title.name,
        key: title.param + title.name,
      }));

      return [
        {
          title: '冻结时间',
          dataIndex: 'time',
          key: 'freezeTime',
        },
        ...columns,
      ];
    },
  },
  watch: {},
  created() {
    this.getData({});
  },
  mounted() {},
  destroyed() {},
  methods: {
    changeDateType(dateType) {
      this.dateType = dateType;
      this.pagination = { current: 1 };
      this.getData({ dateType });
    },
    onChangeDate(e) {
      this.timerLimit = e;
      this.pagination = { current: 1 };
      this.getData({ timerLimit: e });
    },
    async getData({ page = 1, timerLimit = this.timerLimit, dateType = this.dateType }) {
      try {
        this.loading = true;
        const res = await service.mainPageAsk.getDevtasklog({
          starttime: timerLimit[0] && timerLimit[0].format('YYYY-MM-DD HH:mm:ss'),
          endtime: timerLimit[1] && timerLimit[1].format('YYYY-MM-DD HH:mm:ss'),
          order: 'createtime',
          limit: 10,
          uuid: this.currentWatchDeviceInfo.did,
          // "eventresult": "%A_phsA\"%",
          seq: 1,
          offset: page,
          msgtype: 'frozen',
          username: dateType,
        });
        const hasData = res.data.totalsize > 0;
        const data = hasData ? res.data.devicetaskinfos.map((d) => JSON.parse(d.eventresult)) : [];
        this.data = data;
        this.pagination = {
          ...this.pagination,
          total: res.data.totalsize || 0,
        };
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async handleTableChangePage(pagination) {
      this.pagination = pagination;
      this.getData({ page: pagination.current });
    },
  },
};
</script>

<style lang="less" scoped>
.freeze {
  background: #fff;
  .selectBox {
    display: flex;
    .dateType {
      margin-right: 20px;
      display: flex;
      .type {
        width: 77px;
        height: 32px;
        line-height: 32px;
        color: rgba(24, 144, 255, 1);
        border: 1px solid rgba(24, 144, 255, 1);
        text-align: center;
      }
      .activeType {
        color: #fff;
        background: rgba(24, 144, 255, 1);
      }
      .type:nth-child(1),
      .type:nth-child(2) {
        border-right: none;
      }
      .type:nth-child(1) {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      .type:nth-child(3) {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
  }
  .listTable {
    margin-top: 20px;
  }
}
</style>
