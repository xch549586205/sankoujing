<template>
  <div class="chart1">

    <p class="unit">单位：个</p>
    <div v-if="id==='tab1'"
         id="tab1"
         style="width: 100%; height: 320px"></div>
    <div v-if="id==='tab2'"
         id="tab2"
         style="width: 100%; height: 320px"></div>
    <div v-if="id==='tab3'"
         id="tab3"
         style="width: 100%; height: 320px"></div>
  </div>
</template>
<script>
  import * as echarts from 'echarts';
  import moment from 'moment';

  const lastThirtyDays = [...new Array(14)]
    .map((i, idx) => {
      const mmdd = moment().startOf('day').subtract(idx, 'days').format('MM-DD');
      return mmdd === moment().format('MM-DD') ? '今日' : mmdd;
    })
    .reverse();
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      id: {
        type: String,
        default: 'tab1',
      },
    },
    data() {
      return {
        // 'date':日期，'month':月份，'year':年份
        dateType: 'date',
        date: moment(),
        dateShowOne: false,
      };
    },
    mounted() {
      this.drawLine();
    },

    methods: {
      drawLine() {
        const myChart = echarts.init(document.getElementById(this.id), null, {
          renderer: 'svg',
        });
        // 绘制图表
        myChart.setOption({
          color: 'rgba(52, 139, 247, 1)',
          grid: {
            top: '20px',
            left: '40px',
            right: '10px',
            bottom: '20px',
          },
          xAxis: {
            boundaryGap: false,
            type: 'category',
            data: lastThirtyDays,
          },
          yAxis: {
            type: 'value',
            splitLine: {
              //网格线
              lineStyle: {
                type: 'dashed', //设置网格线类型 dotted：虚线   solid:实线
              },
              show: true, //隐藏或显示
            },
          },
          series: [
            {
              symbol: 'none',
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true,
              areaStyle: {
                normal: {
                  color: 'rgba(52, 139, 247, 0.3)',
                },
              },
            },
          ],
        });
        window.addEventListener('resize', this.drawLine);
      },
    },
  };
</script>
<style scoped lang="less">
  .unit {
    margin: 10px 0 15px 0;
    height: 18px;
    color: rgba(128, 128, 128, 1);
    font-size: 12px;
    line-height: 18px;
  }
</style>
