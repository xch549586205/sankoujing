<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 13:57:01
 * @LastEditTime: 2021-02-23 18:31:47
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-table
    :columns="columns"
    :row-key="(record) => record.id"
    :data-source="data"
    :loading="loading"
    :pagination="pagination"
    class="reset-pagination"
    @change="systemOperationChange"
  >
  </a-table>
</template>

<script>
import service from 'servicePath/index';
import Mix from '@/mixins';
import { mapState } from 'vuex';

const { dataDisplayAsk } = service;
const { PageTableCreaterMix } = Mix;
const columns = [
  {
    title: '时间',
    dataIndex: 'createtime',
    align: 'center',
    width: '20%',
  },
  {
    title: '用户名',
    dataIndex: 'account',
    align: 'center',
    width: '10%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '10%',
  },
  {
    title: '数据表',
    dataIndex: 'object',
    align: 'center',
    width: '10%',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    width: '30%',
  },
  {
    title: '登录IP',
    dataIndex: 'ip',
    align: 'center',
    width: '20%',
  },
  {
    title: '',
    dataIndex: 'hide',
    align: 'center',
    scopedSlots: { customRender: 'hide' },
  },
];
export default {
  name: 'SystemOperation',
  mixins: [PageTableCreaterMix('systemOperation')],
  props: {},
  data() {
    return {
      columns,
    };
  },
  computed: {
    ...mapState('dataDisplay', ['rangeTime']),
  },
  watch: {
    rangeTime(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 请求数据
    async systemOperationFetchList(params) {
      const { rangeTime } = this;
      if (rangeTime[0]) {
        params.starttime = rangeTime[0].format(this.GLOBAL.TIME_LOG);
        params.endtime = rangeTime[1].format(this.GLOBAL.TIME_LOG);
      }
      const { errcode, data = {} } = await dataDisplayAsk.getSystemLog({
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
  },
};
</script>

<style scoped>
</style>
