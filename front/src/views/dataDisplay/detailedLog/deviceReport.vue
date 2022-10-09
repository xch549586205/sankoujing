<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 13:57:01
 * @LastEditTime: 2019-09-29 17:05:26
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-table
    :columns="columns"
    :row-key="(record) => `${record.taskid}${Math.random()}`"
    :data-source="datalist"
    :loading="loading"
    :pagination="pagination"
    class="reset-pagination"
    @change="deviceReportChange"
  >
  </a-table>
</template>

<script>
import service from 'servicePath/index';
import Mix from '@/mixins';
import { mapState } from 'vuex';
import moment from 'moment';

const { deviceManageAsk, dataDisplayAsk } = service;
const { PageTableCreaterMix } = Mix;
export default {
  name: 'DeviceReport',
  mixins: [PageTableCreaterMix('deviceReport')],
  props: {
    customParams: {
      type: Object,
      default: {},
    },
    columns: {
      type: Object,
      default: [],
    },
  },
  data() {
    return {
      currentProductInfo: {},
    };
  },
  computed: {
    ...mapState('app', ['projectInfo']),
    ...mapState('dataDisplay', ['rangeTime']),
    datalist() {
      const _arr = [];
      try {
        this.data.map((event) => {
          if (event.remark) {
            const remark = JSON.parse(event.remark);
            // const value = JSON.parse(event.value);
            const { content } = remark.items.prop_upData.value[0];
            const { time } = remark.items.prop_upData;
            const str = content
              .replaceAll('*', '"')
              .replaceAll('\n\t', '')
              .replaceAll('\t', '')
              .replaceAll('\n', '')
              .replaceAll("'", '"');
            _arr.push({ ...JSON.parse(str), time: moment(time).format('YYYY-MM-DD HH:mm:ss') });
          }
        });
      } catch (error) {
        console.error(error, 666);
      }
      return _arr;
    },
  },
  watch: {
    rangeTime(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init();
      }
    },
    customParams: {
      async handler(newVal, oldVal) {
        if (newVal) {
          console.log(newVal, 'newval');
          this.init();
        }
      },
      deep: true,
    },
    datalist: {
      async handler(newVal, oldVal) {
        if (newVal && newVal.length) {
          this.$emit('updateList', newVal);
        }
      },
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    async deviceReportFetchList(params) {
      const { rangeTime } = this;
      if (rangeTime[0]) {
        params.starttime = rangeTime[0].format(this.GLOBAL.TIME_LOG);
        params.endtime = rangeTime[1].format(this.GLOBAL.TIME_LOG);
      }
      // if (this.customParams.account) {
      //   params.account = `${this.customParams.account}`;
      // }
      if (this.customParams.did) {
        params.uuid = `${this.customParams.did}`;
      }
      if (this.customParams.currentEvent && this.customParams.currentEvent != '') {
        params.value = `%${this.customParams.currentEvent}%`;
      }
      const { errcode, data = {} } = await dataDisplayAsk.getReportLog({
        ...params,
        order: 'createtime',
      });
      const { alist = [] } = data;
      alist.forEach((v) => {
        if (v.createtime) {
          v.createtime = this.$moment(v.createtime).format(this.GLOBAL.TIME_FOEMAT);
        }
      });
      return { total: data.totalsize, data: data.alist };
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
  },
};
</script>

<style scoped></style>
