<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 13:57:01
 * @LastEditTime: 2019-09-29 17:05:26
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-table :columns="columns"
           :row-key="record => `${record.id}${Math.random()}`"
           :data-source="data"
           :loading="loading"
           :pagination="pagination"
           class="reset-pagination"
           @change="deviceReportChange">
      <template slot="status"
              slot-scope="text, record">
      <span>{{ record.status | status }}</span>
    </template>
      <template slot="price"
              slot-scope="text, record">
      <span>{{ record.price | price }}</span>
    </template>
     <template slot="device"
              slot-scope="text, record">
      <span>{{ record.devicename }}({{ record.deviceid }} -- {{record.subdevicename}})</span>
    </template>
     <template slot="site"
              slot-scope="text, record">
      <span>{{ record.stationname }}</span>
    </template>
     <template slot="timerange"
              slot-scope="text, record">
      <span v-if="record.status >= 3">{{ record.begintime }}</span> <span v-if="record.status >= 4"> ~ {{ record.endtime }}</span>
    </template>
  </a-table>
</template>

<script>
  import service from 'servicePath/index';
  import Mix from '@/mixins';
  import { mapState } from 'vuex';
import { now } from 'moment';

  const { dataDisplayAsk } = service;
  const { PageTableCreaterMix } = Mix;
  const columns = [
    {
      title: '时间',
      dataIndex: 'createtime',
      align: 'center',
      width: '10%',
    },
    {
      title: 'openid',
      dataIndex: 'wxmpopenid',
      align: 'center',
      width: '10%',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center',
      width: '10%',
    },
    {
      title: '编号',
      dataIndex: 'orderno',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      scopedSlots: { customRender: 'status' },
    },
    // {
    //   title: '商品名称',
    //   dataIndex: 'goodsname',
    //   align: 'center',
    // },
    {
      title: '价格',
      dataIndex: 'price',
      align: 'center',
      scopedSlots: { customRender: 'price' },
    },
    {
      title: '设备',
      align: 'center',
      scopedSlots: { customRender: 'device' },
      width: '20%',
    },
    {
      title: '站点',
      align: 'center',
      scopedSlots: { customRender: 'site' },
      width: '15%',
    },
    {
      title: '充电时间',
      align: 'center',
      scopedSlots: { customRender: 'timerange' },
    },
  ];
  export default {
    name: 'DeviceReport',
    mixins: [PageTableCreaterMix('deviceReport')],
    props: {},
    filters: {
      price(value) {
        return `￥ ${value/100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },
      status(key) {
        let str = '异常'
        switch (key) {
          case 0:
            str = '未支付'
            break;
          case 1:
            str = '支付失败'
            break;
          case 2:
            str = '支付成功'
            break;
          case 3:
            str = '服务中'
            break;
          case 4:
            str = '服务完成'
            break;
          default:
            break;
        }
        return str
      }
    },
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
      async deviceReportFetchList(params) {
        const { rangeTime } = this;
        if (rangeTime[0]) {
          params.starttime = rangeTime[0].format(this.GLOBAL.TIME_LOG);
          params.endtime = rangeTime[1].format(this.GLOBAL.TIME_LOG);
        }
        const { errcode, data = {} } = await dataDisplayAsk.orderList({
          ...params,
          order: 'createtime',
        });
        const { orders = [] } = data;
        orders.forEach(v => {
          if (v.createtime) {
            v.createtime = this.$moment(v.createtime).format(this.GLOBAL.TIME_FOEMAT);
          }
          if (v.begintime) {
            v.begintime = this.$moment(v.begintime).format(this.GLOBAL.TIME_FOEMAT);
          }
          if (v.endtime) {
            v.endtime= this.$moment(v.endtime).format(this.GLOBAL.TIME_FOEMAT);
          }
        });
        return { total: data.totalsize, data: data.orders };
      },
    },
  };
</script>

<style scoped>
</style>
