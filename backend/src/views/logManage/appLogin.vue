<template>
  <a-table :columns="columns"
           :row-key="record => record.id"
           :data-source="data"
           :loading="loading"
           :pagination="pagination"
           class="reset-pagination"
           @change="appLoginChange">
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
    width: '20%',
  }, {
    title: '用户名',
    dataIndex: 'account',
    align: 'center',
    width: '10%',
  }, {
    title: '操作',
    dataIndex: 'remark',
    align: 'center',
    width: '10%',
  }, {
    title: '登录IP',
    dataIndex: 'ip',
    align: 'center',
    width: '10%',
  }, {
      title: '',
      dataIndex: 'hide',
      align: 'center',
      scopedSlots: { customRender: 'hide' },
    }];
  export default {
    name: 'AppLogin',
    mixins: [PageTableCreaterMix('appLogin')],
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
          this.appLoginFetch();
        }
      },
      rangeTime(newVal, oldVal) {
        this.init();
        this.appLoginFetch();
      }
    },
    created() {},
    mounted() {},
    methods: {
      init() {
        this.pagination.current = 1;
        this.appLoginFetch();
      },
    // 请求数据
      async appLoginFetchList(params) {
        const { projectid, rangeTime } = this;
        if (rangeTime[0]) {
          params.starttime = rangeTime[0].format(this.GLOBAL.TIME_START);
          params.endtime = rangeTime[1].format(this.GLOBAL.TIME_END);
        }
        const { errcode, data = {} } = await logManageAsk.getAppLogList({
          ...params,
          projectid: `${projectid}`,
          order: 'id',
          seq: 1,
        });
        data.alist && data.alist.forEach(v =>
        {
          if (v.createtime) {
            v.createtime = this.$moment(v.createtime).format(this.GLOBAL.TIME_FOEMAR);
          }
        });
        return { total: data.totalsize, data: data.alist };
      },
    },
  };
</script>

<style scoped>

</style>
