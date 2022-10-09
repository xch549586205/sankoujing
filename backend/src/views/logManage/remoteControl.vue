<template>
  <a-table :columns="columns"
           :row-key="record => record.id"
           :data-source="data"
           :loading="loading"
           :pagination="pagination"
           class="reset-pagination"
           @change="remoteControlChange">
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
    dataIndex: 'account',
    align: 'center',
    width: '10%',
  }, {
    title: '设备did',
    dataIndex: 'did',
    align: 'center',
    width: '10%',
  }, {
    title: '操作动作名称',
    dataIndex: 'actionname',
    align: 'center',
    width: '10%',
  }, {
    title: '操作指令',
    dataIndex: 'command',
    align: 'center',
    width: '10%',
  }, {
    title: '操作参数',
    dataIndex: 'param',
    align: 'center',
    width: '10%',
  }, {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    width: '10%',
  }, {
    title: '操作类型',
    dataIndex: 'type',
    align: 'center',
    width: '10%',
  }, {
    title: 'IP',
    dataIndex: 'ip',
    align: 'center',
    width: '10%',
  }, {
    title: '数据类型',
    dataIndex: 'msgtype',
    align: 'center',
    width: '10%',
  }, {
    title: '',
    dataIndex: 'hide',
    align: 'center',
    scopedSlots: { customRender: 'hide' },
  }];
  export default {
    name: 'RemoteControl',
    mixins: [PageTableCreaterMix('remoteControl')],
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
          this.remoteControlFetch();
        }
      },
      rangeTime(newVal, oldVal) {
        this.init();
        this.remoteControlFetch();
      }
    },
    created() {},
    mounted() {},
    methods: {
      init() {
        this.pagination.current = 1;
        this.remoteControlFetch();
      },
    // 请求数据
      async remoteControlFetchList(params) {
        const { projectid, rangeTime } = this;
        if (rangeTime[0]) {
          params.starttime = rangeTime[0].format(this.GLOBAL.TIME_LOG);
          params.endtime = rangeTime[1].format(this.GLOBAL.TIME_LOG);
        }
        const { errcode, data = {} } = await logManageAsk.getControlLog({
          ...params,
          projectid: `${projectid}`,
          order: 'id',
          seq: 1,
        });
        data.devicecontrolinfos && data.devicecontrolinfos.forEach(v => {
          if (v.createtime) {
            v.createtime = this.$moment(v.createtime).format(this.GLOBAL.TIME_FOEMAR);
          }
        });
        return { total: data.totalsize, data: data.devicecontrolinfos};
      },
    },
  };
</script>

<style scoped>

</style>
