<template>
  <div class="right">
    <!-- <div class="title">
      <div>每日用电量<span>单位：kW·h</span></div>
    </div> -->
    <div id="chartLeft1" style="width: 100%; height: 243px"></div>
  </div>
</template>
<script>
import moment from 'moment';
import service from 'servicePath/index';
import * as echarts from 'echarts';
import { mapState } from 'vuex';

const { mainPageAsk } = service;

function groupArr(list, field) {
  let fieldList = [];
  const att = [];
  list.map((e) => {
    fieldList.push(e[field]);
  });
  //数组去重
  fieldList = fieldList.filter((e, i, self) => {
    return self.indexOf(e) == i;
  });
  // eslint-disable-next-line no-plusplus
  for (let j = 0; j < fieldList.length; j++) {
    const arr = list.filter((e) => e.uuid == fieldList[j]);
    att.push({
      uuid: arr[0].uuid,
      list: arr,
    });
  }
  return att;
}
function getkwhData(parseList, timeLimit, checkedDevices) {
  const dataGroupList = groupArr(
    parseList.filter((_data) => checkedDevices.indexOf(_data.uuid) !== -1),
    'uuid'
  );
  let kwhData = 0;
  // 计算每一个设备的用电量，并且使它们的用电量相加取和
  dataGroupList.map(({ uuid, list }) => {
    // 时间从小到大排序
    const sortList = list.sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf());
    const firstDataList = sortList
      .filter((d) => moment(d.time).format('YYYY-MM-DD') === timeLimit.firstDataTime)
      .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
    const lastDataList = sortList
      .filter((d) => moment(d.time).format('YYYY-MM-DD') === timeLimit.lsatDataTime)
      .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
    if (firstDataList.length && lastDataList.length) {
      const firstValue = firstDataList[0].RtlWh * 1 + firstDataList[0].SupWh * 1;
      const lastValue = lastDataList[0].RtlWh * 1 + lastDataList[0].SupWh * 1;
      if (lastValue > firstValue) {
        kwhData += lastValue - firstValue;
      }
    }
  });
  return kwhData > 0 ? kwhData.toFixed(2) : 0;
}
const getList = (List = [], prevMonthOrThisMonth, checkedDevices) => {
  const x = Array.call(null, ...Array(31)).map((_, d) => d + 1);
  const y = Array.call(null, ...Array(31)).map((_, d) => 0);

  x.map((DD, i) => {
    // getkwhData(parseList, timeLimit)
    const firstDataTime = moment(
      moment()
        .add(prevMonthOrThisMonth === 'thisMonth' ? 0 : -1, 'M')
        .format(`YYYY-MM-${DD < 10 ? `0${DD}` : DD}`)
    ).format('YYYY-MM-DD');
    const lsatDataTime = moment(firstDataTime).add(1, 'd').format('YYYY-MM-DD');
    const kw = getkwhData(List, { firstDataTime, lsatDataTime }, checkedDevices);
    y[i] = kw;
  });
  return { x, y };
};

export default {
  name: 'Main',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      thisMonthList: {
        x: Array.call(null, ...Array(31)).map((_, d) => d + 1),
        y: Array.call(null, ...Array(31)).map((_, d) => 0),
      },
      prevMonthList: {
        x: Array.call(null, ...Array(31)).map((_, d) => d + 1),
        y: Array.call(null, ...Array(31)).map((_, d) => 0),
      },
    };
  },
  computed: {
    ...mapState('mainPage', ['checkedDevices']),

    option() {
      return {
        title: {
          show: true,
          text: ['{a|用电统计}', '{b|单位：kW·h}'].join('   '), // 主副标题
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
        color: 'rgba(60, 144, 247, 1)',
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
            data: ['本月', '上月'],
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
          data: this.thisMonthList.x,
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
            data: this.thisMonthList.y,
            type: 'bar',
            name: '本月',
            color: '#2e8cf0',
            emphasis: {
              focus: 'series',
            },
          },
          {
            name: '上月',
            data: this.prevMonthList.y,
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            color: '#dbdbdd',
          },
        ],
      };
    },
  },
  watch: {
    checkedDevices(newVal, oldVal) {
      if (newVal.length) {
        this.drawLine();
        this.getThisMonthPrevMonthKw();
      }
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    drawLine() {
      const myChart = echarts.init(document.getElementById('chartLeft1'), null, {
        renderer: 'svg',
      });
      myChart.setOption(this.option);
    },
    async getThisMonthPrevMonthKw() {
      const params = {
        order: 'createtime',
        limit: 99999999,
        seq: 1,
        offset: 1,
        msgtype: 'frozen',
        username: 'day',
      };
      const prevMonthFisrtDayTime = moment()
        .add(-1, 'M')
        .add(-1, 'd')
        .format('YYYY-MM-01 00:00:00');
      const prevMonthLastDayTime = moment()
        .add(-1, 'M')
        .endOf('month')
        .add(3, 'd')
        .format('YYYY-MM-DD 01:00:00');
      const thisMonthFirstDayTime = moment(moment().format('YYYY-MM-01 00:00:00'))
        .add(-1, 'd')
        .format('YYYY-MM-DD 00:00:00');
      const thisMonthLastDayTime = moment()
        .endOf('month')
        .add(1, 'd')
        .format('YYYY-MM-DD 23:59:59');
      const resPrevMonth = await mainPageAsk.getDevtasklog({
        ...params,
        starttime: prevMonthFisrtDayTime,
        endtime: prevMonthLastDayTime,
      });
      const resThisMonth = await mainPageAsk.getDevtasklog({
        ...params,
        starttime: thisMonthFirstDayTime,
        endtime: thisMonthLastDayTime,
      });

      const prevMonthList = getList(
        resPrevMonth.data.devicetaskinfos
          .map((d) => ({ ...JSON.parse(d.eventresult) }))
          .sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf()),
        'prevMonth',
        this.checkedDevices
      );
      const thisMonthList = getList(
        resThisMonth.data.devicetaskinfos
          .map((d) => ({ ...JSON.parse(d.eventresult) }))
          .sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf()),
        'thisMonth',
        this.checkedDevices
      );
      this.thisMonthList = thisMonthList;
      this.prevMonthList = prevMonthList;
      this.drawLine();
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
