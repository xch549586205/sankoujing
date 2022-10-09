<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 13:57:01
 * @LastEditTime: 2019-09-29 13:26:06
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-table :columns="columns"
           :row-key="record => record.id"
           :data-source="data"
           :loading="loading"
           :pagination="pagination"
           class="reset-pagination"
           @change="taskRunChange">
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
      dataIndex: 'eventtime',
      align: 'center',
      width: '10%',
    },
    {
      title: '任务名称',
      dataIndex: 'taskname',
      align: 'center',
      width: '10%',
    },
    {
      title: '执行设备名称',
      dataIndex: 'effectname',
      align: 'center',
      width: '20%',
    },
    {
      title: '执行设备id',
      dataIndex: 'effectdid',
      align: 'center',
      width: '20%',
    },
    {
      title: '执行设备动作',
      dataIndex: 'effectactions',
      align: 'center',
      width: '30%',
    },
    // {
    //   title: '',
    //   dataIndex: 'hide',
    //   align: 'center',
    //   scopedSlots: { customRender: 'hide' },
    // },
    {
      title: '执行结果',
      dataIndex: 'remark',
      align: 'center',
      width: '10%',
    },
  ];
  export default {
    name: 'TaskRun',
    mixins: [PageTableCreaterMix('taskRun')],
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
      async taskRunFetchList(params) {
        const { rangeTime } = this;
        if (rangeTime[0]) {
          params.starttime = rangeTime[0].format(this.GLOBAL.TIME_LOG);
          params.endtime = rangeTime[1].format(this.GLOBAL.TIME_LOG);
        }
        const { errcode, data = {} } = await dataDisplayAsk.getTaskRunLog({
          ...params,
          type: "场景",
          order: 'eventtime',
        });
        const { logs = [] } = data;
        logs.forEach(v => {
          if (v.eventtime) {
            v.eventtime = this.$moment(v.eventtime).format(this.GLOBAL.TIME_FOEMAT);
          }
        });
        return { total: data.totalsize, data: data.logs };
      },
    },
  };
</script>

<style scoped>
</style>
