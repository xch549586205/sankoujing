<template>
  <div class="chart1">
    <lineChartSettingModel
      :visible="showModal"
      :checked-list="checkedList"
      @setShowModal="setShowModal"
      @setCheckedList="setCheckedList"
    />

    <div class="title">
      <span>实时数据 - {{ devices.length ? devices[0].displayname : '' }}</span>
      <div style="margin-left: auto; display: flex">
        <a-button style="margin: auto" @click="setShowModal(true)">展示设置</a-button>
      </div>
    </div>
    <a-row>
      <a-col span="11">
        <p class="unit">{{ checkedList[0] }}</p>

        <div id="chartLeft" style="width: 100%; height: 250px"></div>
      </a-col>
      <a-col span="2"> </a-col>
      <a-col span="11">
        <p class="unit">{{ checkedList[1] }}</p>
        <div id="chartRight" style="width: 100%; height: 250px"></div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import moment from 'moment';
import lineChartSettingModel from './lineChartSettingModel.vue';
import service from 'servicePath/index';
import { showList } from './util';

const { mainPageAsk } = service;
const hours = [...new Array(24)]
  .map((i, idx) => {
    return moment().startOf('H').subtract(idx, 'H');
  })
  .reverse();
console.log(hours, 'hours');
export default {
  components: {
    lineChartSettingModel,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    devices: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
  },
  data() {
    return {
      // 'date':日期，'month':月份，'year':年份
      dateType: 'date',
      date: moment(),
      dateShowOne: false,
      showModal: false,
      checkedList: ['相电压(ADC)', '总有功功率'],
      xData: hours.map((hour) => hour.format('HH:00')),
      yData: [[], []],
    };
  },

  computed: {},
  watch: {
    devices: {
      async handler(newVal, oldVal) {
        if (newVal.length) {
          await this.getYData(0);
          await this.getYData(1);
          this.drawLine();
        }
      },
    },
  },
  mounted() {},
  created() {},
  methods: {
    async setCheckedList(checkedList) {
      this.checkedList = checkedList;
      await this.getYData(0);
      await this.getYData(1);
      this.drawLine();
    },
    setShowModal(e) {
      this.showModal = e;
    },
    // 弹出日历和关闭日历的回调
    openChangeOne(status) {
      if (status) {
        this.dateShowOne = true;
      }
    },
    // 得到年份选择器的值
    panelChangeOne(value) {
      this.date = value;
      this.dateShowOne = false;
    },
    ChangeOne(value) {
      this.date = value;
      this.dateShowOne = false;
    },
    changeDateType(dateType) {
      this.dateType = dateType;
    },
    changeDate(date) {
      this.date = date;
    },
    async getData(param) {
      const params = {
        offset: 1,
        seq: 0,
        order: 'createtime',
        key: 'measurement',
        account: this.devices.length ? this.devices[0].did : '',
        starttime: moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss'),
        endtime: moment().format('YYYY-MM-DD HH:mm:ss'),
        value: `%${param}%`,
      };
      return mainPageAsk.getReportLog({
        ...params,
      });
    },
    async getYData(idx) {
      const promiseList = [];
      const yDataParams = [];
      showList.map((check) => {
        if (this.checkedList[idx] === check.name) {
          if (check.child) {
            check.child.map((_child) => {
              yDataParams.push({ param: _child.param, name: _child.name });
              promiseList.push(this.getData(_child.param));
            });
          } else {
            yDataParams.push({ param: check.param, name: check.name });
            promiseList.push(this.getData(check.param));
          }
        }
      });
      if (!promiseList.length) {
        return [];
      }
      const res = await Promise.all(promiseList);
      const dataList = res.map((data) => {
        return data.data.alist || [];
      });
      const parseData =
        dataList &&
        dataList.length &&
        dataList.map((data) => {
          return data.map((_data) => {
            return { ...JSON.parse(_data.value), createtime: _data.createtime };
          });
        });
      const yData = [];
      yDataParams.map(({ param, name }, i) => {
        yData[i] = [];
        const datas = parseData[i];
        datas.map((data) => {
          const indexOfXY = this.xData.indexOf(moment(data.createtime).format('HH:00'));
          if (!yData[i] || !yData[i][indexOfXY] || !yData[i][indexOfXY].value) {
            yData[i][indexOfXY] = {};
            yData[i][indexOfXY].value = data[param];
            yData[i][indexOfXY].name = name;
          }
        });
      });
      this.yData[idx] = yData;
    },

    drawLine() {
      if (this.myChartLeft) {
        this.myChartLeft.dispose();
      }
      if (this.myChartRight) {
        this.myChartRight.dispose();
      }
      const myChartLeft = echarts.init(document.getElementById('chartLeft'), null, {
        renderer: 'svg',
      });
      const myChartRight = echarts.init(document.getElementById('chartRight'), null, {
        renderer: 'svg',
      });
      this.myChartLeft = myChartLeft;
      this.myChartRight = myChartRight;
      const datas1 = this.yData[0];
      let series1 = [];
      series1 = datas1.map((data) => {
        const name = data.filter((_data) => _data.name).length
          ? data.filter((_data) => _data.name)[0].name
          : '';
        const _data = data.map((d) => ({
          ...d,
          name,
          value: d.value || 0,
        }));
        return {
          name,
          type: 'line',
          barWidth: 20,
          stack: 'total',
          label: {
            show: false,
          },
          emphasis: {
            focus: 'series',
          },
          data: _data.map((d) => d.value),
        };
      });

      const datas2 = this.yData[1];
      let series2 = [];
      series2 = datas2.map((data) => {
        const name = data.filter((_data) => _data.name).length
          ? data.filter((_data) => _data.name)[0].name
          : '';
        const _data = data.map((d) => ({
          ...d,
          name,
          value: d.value || 0,
        }));
        return {
          name,
          type: 'line',
          barWidth: 20,
          stack: 'total',
          label: {
            show: false,
          },
          emphasis: {
            focus: 'series',
          },
          data: _data.map((d) => d.value),
        };
      });
      const option = (series) => {
        return {
          color: [
            'rgba(42, 130, 228, 1)',
            'rgba(0, 186, 173, 1)',
            'rgba(255, 195, 0, 1)',
            'rgba(121, 72, 234, 1)',
          ],

          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // Use axis to trigger tooltip
              type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
            },
          },
          legend: {
            bottom: '8%',
            icon: 'circle',
            itemWidth: 10, // 设置宽度class
            itemHeight: 10, // 设置高度im
            itemGap: 20, // 设置间距img
          },
          grid: {
            top: '10px',
            left: '0',
            right: '0',
            bottom: '20%',
            containLabel: true,
          },

          xAxis: {
            type: 'category',
            data: this.xData,
          },
          yAxis: {
            type: 'value',
          },
          series,
        };
      };
      // 绘制图表
      this.myChartLeft.setOption(option(series1));
      this.myChartRight.setOption(option(series2));
    },
  },
};
</script>
<style scoped lang="less">
.chart1 {
  padding: 20px;
}
.check {
  margin: 5px 0;
}
.title {
  color: rgba(56, 56, 56, 1);
  display: flex;
  padding-bottom: 10px;
  font-size: 16px;
  padding-right: 10px;
  border-bottom: 1px solid rgba(229, 229, 229, 1);
}
.unit {
  margin: 10px 0 15px 0;
  height: 18px;
  color: rgba(128, 128, 128, 1);
  font-size: 12px;
  line-height: 18px;
}
.picker {
  margin-left: auto;
  display: flex;
  > p {
    margin: 0 25px;
  }
}
</style>
