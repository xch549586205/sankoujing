<template>
  <div id="myChart1" style="width: 100%; height: 280px; margin-top: 10px"></div>
</template>
<script>
import * as echarts from 'echarts';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dataName: {
      type: Array,
      default: [],
    },
    dataValue: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  watch: {
    dataName: {
      async handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.drawLine();
        }
      },
      deep: true,
    },
    dataValue: {
      async handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.drawLine();
        }
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    drawLine() {
      const myChart = echarts.init(document.getElementById('myChart1'), null, { renderer: 'svg' });
      // 绘制图表
      myChart.setOption({
        color: ['rgba(46, 140, 240, 1)'],
        tooltip: {},
        legend: {
          data: ['销量'],
        },

        xAxis: {
          data: this.dataName,
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        grid: {
          x: 30,
          y: 47,
          x2: 0,
          y2: 30,
        },
        series: [
          {
            type: 'bar',
            barWidth: 40,
            data: this.dataValue,
            label: { normal: { show: true, position: 'top', formatter: '{c} 次' } },
          },
        ],
      });
      window.addEventListener('resize', this.drawLine);
    },
  },
};
</script>
<style scoped>
.check {
  margin: 5px 0;
}
</style>
