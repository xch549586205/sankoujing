<template>
  <div>
    <div class="screen">
      <a-select
        :value="currentEvent"
        class="component-w-224"
        placeholder="全部事件"
        @change="handleChangeEvent"
      >
        <a-select-option v-for="(item, i) in eventOption" :key="i" :value="item.value">
          {{ item.label }}
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
      <Json-excel :data="json_data" class="export-excel-wrapper" name="事件记录.xls">
        <a-button style="margin-left: 20px" type="primary">导出</a-button>
      </Json-excel>
    </div>
    <list :custom-params="customParams" :columns="columns" @updateList="updateList" />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import service from 'servicePath/index';
import list from '@/views/dataDisplay/detailedLog/deviceReport.vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import JsonExcel from 'vue-json-excel';
import { eventsOption } from '../../../util.js';

const { deviceManageAsk } = service;

export default {
  name: 'ControlLog',
  components: { list, JsonExcel },
  mixins: [],
  props: {},
  data() {
    return {
      id: this.$route.params.id,
      currentProductInfo: {},
      currentEvent: '',
      json_data: [],
    };
  },
  computed: {
    ...mapState('dataDisplay', ['rangeTime']),
    ...mapState('deviceManage', ['deviceInfo', 'currentWatchDeviceInfo', 'productInfo']),
    ...mapState('app', ['projectInfo']),
    eventOption() {
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
      if (this.currentProductInfo && this.currentProductInfo.pid) {
        const _eventsOption = eventsOption[getPid(this.currentProductInfo.pid)];
        return _eventsOption;
      }
      return [];
    },
    customParams() {
      return {
        currentEvent: this.currentEvent,
        account: this.currentWatchDeviceInfo.did,
        did: this.currentWatchDeviceInfo.did,
      };
    },
    columns() {
      if (!this.eventOption || !this.eventOption.length || !this.currentEvent) {
        return [];
      }
      const sub = this.eventOption.filter((e) => e.value === this.currentEvent)[0].sub || [];
      const newSub = [...sub].map((s) => {
        return {
          title: s.name,
          dataIndex: s.key,
          align: 'center',
        };
      });

      return [
        {
          title: '时间',
          dataIndex: 'time',
          key: 'logTime',
        },
        ...newSub,
      ];
    },
  },
  watch: {
    eventOption: {
      async handler(newVal, oldVal) {
        if (newVal) {
          this.currentEvent = newVal[0].value;
          this.init();
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
    ...mapMutations('dataDisplay', ['setRangeTime']),
    updateList(list) {
      this.json_data = list;
    },
    handleChangeEvent(e) {
      this.currentEvent = e;
    },
    onChangeRangeTime(e) {
      this.setRangeTime(e);
    },
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
            this.handleChangeEvent(eventsOption[data.pid][0].value);
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
