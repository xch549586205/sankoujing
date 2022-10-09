<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 13:57:01
 * @LastEditTime: 2019-10-10 10:29:01
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-table
    :columns="columns"
    :row-key="(record) => `${record}${Math.random()}`"
    :data-source="data"
    :loading="loading"
    :pagination="pagination"
    class="reset-pagination"
    @change="remoteControlChange"
  >
    <template slot="remark" slot-scope="text, record">
      <div class="">
        <a-tooltip placement="bottomLeft">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <div class="ellipsis" style="width: 60px">{{ text }}</div>
        </a-tooltip>
      </div>
    </template>
    <template slot="type" slot-scope="text, record">
      <div class="" style="max-width: 400px; text-align: center; margin: 0 auto">
        <a-tooltip placement="bottomLeft">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <div class="ellipsis">{{ text }}</div>
        </a-tooltip>
      </div>
    </template>
    <template slot="ip" slot-scope="text, record">
      <div class="">
        <a-tooltip placement="bottomLeft">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <div class="ellipsis" style="width: 40px">{{ text }}</div>
        </a-tooltip>
      </div>
    </template>
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
    width: '10%',
  },
  {
    title: '操作源',
    dataIndex: 'account',
    align: 'center',
    width: '10%',
  },
  {
    title: '操作人',
    dataIndex: 'account',
    align: 'center',
    width: '10%',
  },
  // {
  //   title: '设备did',
  //   dataIndex: 'did',
  //   align: 'center',
  //   width: '10%',
  // },
  {
    title: '操作动作',
    dataIndex: 'actionname',
    align: 'center',
    width: '10%',
  },
  {
    title: '操作指令',
    dataIndex: 'param',
    align: 'center',
    width: '20%',
  },
  // {
  //   title: '操作参数',
  //   dataIndex: 'param',
  //   align: 'center',
  //   width: '10%',
  // },
  // {
  //   title: '备注',
  //   dataIndex: 'remark',
  //   align: 'center',
  //   scopedSlots: { customRender: 'remark' },
  // },
  {
    title: '操作类型',
    width: '30%',
    dataIndex: 'type',
    align: 'center',
    scopedSlots: { customRender: 'type' },
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    align: 'center',
    width: '10%',
    // scopedSlots: { customRender: 'ip' },
  },
  // {
  //   title: '数据类型',
  //   dataIndex: 'msgtype',
  //   align: 'center',
  //   width: '10%',
  // },
];
export default {
  name: 'RemoteControl',
  mixins: [PageTableCreaterMix('remoteControl')],
  props: {
    customParams: {
      type: Object,
      default: {},
    },
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
    customParams(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.init();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 请求数据
    async remoteControlFetchList(params) {
      const { rangeTime } = this;
      if (rangeTime[0]) {
        params.starttime = rangeTime[0].format(this.GLOBAL.TIME_LOG);
        params.endtime = rangeTime[1].format(this.GLOBAL.TIME_LOG);
      }
      // if (this.customParams.account) {
      //   params.account = `${this.customParams.account}`;
      // }
      if (this.customParams.did) {
        params.did = `${this.customParams.did}`;
      }
      if (this.customParams.selectKey) {
        params.param = `%${this.customParams.selectKey}%`;
      }
      const { errcode, data = {} } = await dataDisplayAsk.getControlLog({
        ...params,
        order: 'createtime',
      });
      const { devicecontrolinfos = [] } = data;
      devicecontrolinfos.forEach((v) => {
        if (v.createtime) {
          v.createtime = this.$moment(v.createtime).format(this.GLOBAL.TIME_FOEMAT);
        }
      });
      this.$emit('updateDataList', data.devicecontrolinfos || []);
      return { total: data.totalsize, data: data.devicecontrolinfos || [] };
    },
  },
};
</script>

<style scoped></style>
