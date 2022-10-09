<template>
  <div id="liquidFillCharts"
       style="width:260px; height: 260px; position:absolute;left:-65px;top:-65px ">

  </div>
</template>
<script>
  import * as echarts from 'echarts';
  import 'echarts-liquidfill';

  const option = {
    grid: {
      top: '20px',
      left: '40px',
      right: '10px',
      bottom: '20px',
    },
    series: [
      {
        type: 'liquidFill',
        background: '#fff',
        backgroundStyle: {
          borderWidth: 3, //内边框宽度
          borderColor: 'rgba(158, 205, 255, 1)', //背景内边框
        },
        outline: {
          borderDistance: 0, //边框距离
          itemStyle: {
            borderWidth: 0,
            borderColor: 'rgba(158, 205, 255, 1)',
          },
        },

        name: '在线率',
        data: ['0.6'],
        color: ['rgba(24, 144, 255, 1)'],
        label: {
          formatter: '{a}\n\n60%',
          fontSize: 15,
        },
        itemStyle: {
          //普通样式
          opacity: 0.6,
        },
        emphasis: {
          itemStyle: {
            //悬停样式
            opacity: 0.9,
          },
        },
      },
    ],
  };
  export default {
    props: {},
    data() {
      return {};
    },
    mounted() {
      this.drawLine();
    },

    methods: {
      drawLine() {
        const myChart = echarts.init(document.getElementById('liquidFillCharts'), null, {
          renderer: 'svg',
        });
        // 绘制图表
        myChart.setOption(option);
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
