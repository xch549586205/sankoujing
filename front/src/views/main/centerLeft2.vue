<template>
  <div class="right">
    <!-- <div class="title">
      <div>每日用电量<span>单位：kW·h</span></div>
    </div> -->
    <div id="chartLeft2" style="width: 100%; height: 243px"></div>
  </div>
</template>
<script>
import moment from 'moment';
import * as echarts from 'echarts';
import { warningList } from './util';
import { mapState } from 'vuex';
import { getStrReport } from './util';
import service from 'servicePath/index';

const { mainPageAsk } = service;

const lastThirtyDays = [...new Array(30)]
  .map((i, idx) => {
    const mmdd = moment()
      .startOf('day')
      .subtract(idx + 1, 'days')
      .format('DD');
    return mmdd;
  })
  .reverse();
console.log(lastThirtyDays, 'lastThirtyDays');
export default {
  name: 'Main',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      yData: [],
    };
  },
  computed: {
    ...mapState('mainPage', ['checkedDevices']),

    option() {
      return {
        title: {
          show: true,
          text: ['{a|用电警告}', '{b|单位：个}'].join('   '), // 主副标题
          left: 'left',
          textStyle: {
            rich: {
              a: {
                fontSize: 18,
                fontWeight: 'bolder',
              },
              b: {
                fontSize: 12,
                fontWeight: 'normal',
              },
            },
          },
        },
        color: 'rgba(255, 141, 26, 1)',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: [
          {
            x: 'right', //可设定图例在左、右、居中
            y: 'top', //可设定图例在上、下、居中
            data: ['每日警告'],
            icon: 'circle',
            padding: [5, 0, 0, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
          },
        ],

        grid: {
          top: '45px',
          left: '40px',
          right: '0',
          bottom: '40px',
        },
        xAxis: {
          type: 'category',
          data: lastThirtyDays,
          axisLabel: {
            interval: 0,
            rotate: 40,
          },
        },

        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: this.yData,
            type: 'line',
            name: '每日警告',
            color: 'rgba(255, 141, 26, 1)',
            emphasis: {
              focus: 'series',
            },
          },
        ],
      };
    },
  },
  watch: {
    checkedDevices(newVal, oldVal) {
      if (newVal.length) {
        this.drawLine();
        this.getData();
      }
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    drawLine() {
      const myChart = echarts.init(document.getElementById('chartLeft2'), null, {
        renderer: 'svg',
      });
      myChart.setOption(this.option);
    },
    async getData() {
      const warningQueryStr = (() => {
        // "value": "%\"Wave_rcd\":\"1\"%,%\"Sw_close\":\"1\"%"
        let _str = '';
        warningList.map(({ param }) => {
          _str += `%\"${param}\":\"1\"%,`;
        });
        return _str.slice(0, _str.length - 1);
      })();
      const starttime = moment().add(-30, 'd').format('YYYY-MM-DD HH:mm:ss');
      const endtime = moment().format('YYYY-MM-DD HH:mm:ss');
      const params = {
        offset: 1,
        limit: 150000,
        // account: getStrReport(this.checkedDevices),
        seq: 0,
        order: 'createtime',
        starttime,
        endtime,
        key: 'soe',
        value: warningQueryStr,
        groupfield: "DATE_FORMAT(createtime,'%Y-%m-%d')",
      };
      try {
        const res = await mainPageAsk.getReportLog({
          ...params,
        });
        const dataList = res.data.alist
          .filter((d) => this.checkedDevices.indexOf(d.account) !== -1)
          .map((d) => ({
            ...JSON.parse(d.groupcnt),
            createtime: d.createtime,
          }));
        const yData = Array.call(null, ...Array(30)).map((_, d) => 0);
        dataList.map((data) => {
          const date = moment(data.createtime).format('DD');
          const _indexOf = lastThirtyDays.indexOf(date);
          yData[_indexOf] = data.totalcnt;
        });
        this.yData = yData;
        this.drawLine();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.right {
  height: 260px;
  background: #fff;
  padding: 17px 0 0 28px;
  .title {
    line-height: 24px;
    height: 24px;
    display: flex;
    > div:nth-child(1) {
      height: 24px;
      line-height: 24px;
      color: rgba(56, 56, 56, 1);
      font-size: 16px;
      font-weight: bold;
      span {
        margin-left: auto;
        height: 18px;
        line-height: 18px;
        color: rgba(128, 128, 128, 1);
        font-size: 12px;
        margin-left: 14px;
      }
    }
    > div:nth-child(2) {
      display: flex;
      margin-left: auto;
      .thisMonth {
        display: flex;
        div {
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background: #2a82e4;
          margin: auto 5px;
        }
      }
      .lastMonth {
        display: flex;
        div {
          width: 10px;
          height: 10px;
          border-radius: 5px;
          margin: auto 5px;
          background: #a6a6a6;
        }
      }
    }
  }
}
</style>
