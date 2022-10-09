<template>
  <a-table :columns="columns"
           :row-key="record => record.id"
           :data-source="data"
           :loading="loading"
           :pagination="pagination"
           class="reset-pagination"
           @change="wechatLoginChange">
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
    name: 'WechatLogin',
    mixins: [PageTableCreaterMix('wechatLogin')],
    props: {},
    data() {
      return {
        columns,
      };
    },
    computed: {
      ...mapState('logManage', ['projectid', 'rangeTime']),
    },
    watch: {
      projectid(newVal, oldVal) {
        this.init();
        if (oldVal === null) {
          this.wechatLoginFetch();
          console.log('oldVal');
        }
      },
      rangeTime(newVal, oldVal) {
        this.init();
        this.wechatLoginFetch();
      }
    },
    created() {
      console.log('projectid', this.projectid);
    },
    mounted() {},
    methods: {
      init() {
        this.pagination.current = 1;
        this.wechatLoginFetch();
        console.log('init');
      },
    // 请求数据
      async wechatLoginFetchList(params) {
        const { projectid, rangeTime } = this;
        if (rangeTime[0]) {
          params.starttime = rangeTime[0].format(this.GLOBAL.TIME_START);
          params.endtime = rangeTime[1].format(this.GLOBAL.TIME_END);
        }
        const { errcode, data = {} } = await logManageAsk.getLogList({
          ...params,
          projectid: `${projectid}`,
          order: 'id',
          seq: 1,
          type: 5
        });
        data.alist && data.alist.forEach(v => {
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
