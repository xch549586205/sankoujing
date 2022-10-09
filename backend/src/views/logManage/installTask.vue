<template>
  <a-table :columns="columns"
           :row-key="record => `${record.taskid}${Math.random()}`"
           :data-source="data"
           :loading="loading"
           :pagination="pagination"
           class="reset-pagination"
           @change="installTaskChange">
  </a-table>
</template>

<script>
  import service from 'servicePath/index';
  import Mix from '@/mixins';
  import { mapState } from 'vuex';

  const { logManageAsk } = service;
  const { PageTableCreaterMix } = Mix;
  const columns = [{
    title: '时间',
    dataIndex: 'createtime',
    align: 'center',
    width: '10%',
  }, {
    title: '用户名',
    dataIndex: 'workername',
    align: 'center',
    width: '10%',
  }, {
    title: '任务名称',
    dataIndex: 'taskname',
    align: 'center',
    width: '10%',
  }, {
    title: '任务ID',
    dataIndex: 'taskid',
    align: 'center',
    width: '10%',
  }, {
    title: '关联设备',
    dataIndex: 'did',
    align: 'center',
    width: '10%',
  }, {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '10%',
  }, {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    width: '10%',
  }, {
    title: '类型',
    dataIndex: 'asstype',
    align: 'center',
    width: '10%',
  }, {
    title: 'IP',
    dataIndex: 'ip',
    align: 'center',
    width: '10%',
  }, {
    title: '设备位置',
    dataIndex: 'location',
    align: 'center',
    width: '10%',
  }, {
      title: '',
      dataIndex: 'hide',
      align: 'center',
      scopedSlots: { customRender: 'hide' },
    }];
  export default {
    name: 'InstallTask',
    mixins: [PageTableCreaterMix('installTask')],
    props: {},
    data() {
      return {
        columns,
      };
    },
    computed: {
      ...mapState('logManage', ['rangeTime']),
      ...mapState('logManage', ['projectid']),
    },
    watch: {
      projectid(newVal, oldVal) {
        this.init();
        if (oldVal === null) {
          this.installTaskFetch();
        }
      },
      rangeTime(newVal, oldVal) {
        this.init();
        this.installTaskFetch();
      }
    },
    created() {},
    mounted() {},
    methods: {
      init() {
        this.pagination.current = 1;
        this.installTaskFetch();
      },
    // 请求数据
      async installTaskFetchList(params) {
        const { projectid, rangeTime } = this;
        if (rangeTime[0]) {
          params.starttime = rangeTime[0].format(this.GLOBAL.TIME_LOG);
          params.endtime = rangeTime[1].format(this.GLOBAL.TIME_LOG);
        }
        const { errcode, data = {} } = await logManageAsk.getAssignmentLog({
          ...params,
          asstype: '安装',
          projectid: `${projectid}`,
          order: 'id',
          seq: 1,
        });
        data.assignmentinfos && data.assignmentinfos.forEach(v => {
          if (v.createtime) {
            v.createtime = this.$moment(v.createtime).format(this.GLOBAL.TIME_FOEMAR);
          }
        });
        return { total: data.totalsize, data: data.assignmentinfos };
      },
    },
  };
</script>

<style scoped>

</style>
