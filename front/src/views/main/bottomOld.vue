<template>
  <a-row class="bottom">
    <a-col :span="8" class="col">
      <div class="colContent">
        <div class="title">
          <div>近7日新增设备</div>
          <div>单位：个</div>
        </div>
        <div id="bChart1" style="width: 100%; height: 240px"></div>
      </div>
    </a-col>
    <a-col :span="8" class="col">
      <div class="colContent">
        <div class="title">
          <div>累计激活设备</div>
          <div>单位：个</div>
        </div>
        <div id="bChart2" style="width: 100%; height: 240px"></div>
      </div>
    </a-col>
    <a-col :span="8" class="col">
      <div class="colContent">
        <div class="title">
          <div>告警事件</div>
        </div>
        <div class="content">
          <div class="contentTop">
            <div>
              <p>告警次数</p>
              <p>256<span>次</span></p>
            </div>
            <div id="bChart3" style="width: 100%; height: 60px"></div>
          </div>
          <div class="contentBottom">
            <div class="contentBottom_sub">
              <div>
                <p>今日告警</p>
                <p>56<span>次</span></p>
              </div>
              <a-progress
                :width="80"
                :percent="35"
                stroke-color="#D44B45"
                stroke-width="10"
                stroke-linecap="square"
                type="circle"
              >
                <template #format="percent">
                  <span style="color: #d44b45; font-size: 18px">{{ percent }}%</span>
                </template>
              </a-progress>
            </div>
            <div class="contentBottom_sub">
              <div>
                <p>用电告警</p>
                <p>156<span>次</span></p>
              </div>
              <a-progress
                :width="80"
                :percent="75"
                stroke-color="#D44B45"
                stroke-width="10"
                stroke-linecap="square"
                type="circle"
              >
                <template #format="percent">
                  <span style="color: #d44b45; font-size: 18px">{{ percent }}%</span>
                </template>
              </a-progress>
            </div>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script>
import moment from 'moment';
import * as echarts from 'echarts';

const lastThirtyDays = [...new Array(7)]
  .map((i, idx) => {
    const mmdd = moment().startOf('day').subtract(idx, 'days').format('MM-DD');
    return mmdd === moment().format('MM-DD') ? '今日' : mmdd;
  })
  .reverse();
export default {
  name: 'Main',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      option1: {
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
            data: [820, 932, 901, 934, 1190, 1330, 1350],
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: 'rgba(52, 139, 247, 0.3)',
              },
            },
          },
        ],
      },
      option2: {
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
            data: [2620, 3001, 3690, 4020, 4463, 5600, 6090],
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: 'rgba(52, 139, 247, 0.3)',
              },
            },
          },
        ],
      },
      option3: {
        color: 'rgba(212, 75, 69, 1)',
        grid: {
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
        },
        xAxis: {
          boundaryGap: false,
          type: 'category',
          data: lastThirtyDays,
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false, //隐藏或显示
          },
        },
        series: [
          {
            symbol: 'none',
            data: [82, 332, 90, 540, 60, 330, 160],
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: 'rgba(215, 75, 69, 0.3)',
              },
            },
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.drawLine();
  },
  destroyed() {},
  methods: {
    drawLine() {
      const myChart1 = echarts.init(document.getElementById('bChart1'), null, {
        renderer: 'svg',
      });
      const myChart2 = echarts.init(document.getElementById('bChart2'), null, {
        renderer: 'svg',
      });
      const myChart3 = echarts.init(document.getElementById('bChart3'), null, {
        renderer: 'svg',
      });
      myChart1.setOption(this.option1);
      myChart2.setOption(this.option2);
      myChart3.setOption(this.option3);
    },
  },
};
</script>

<style lang="less" scoped>
.bottom {
  height: 340px;
  margin: 20px 10px;
  .col {
    padding: 0 10px;
    .colContent {
      height: 340px;
      background-color: #fff;
      padding: 0 20px 20px 20px;
      .title {
        display: flex;
        height: 58px;
        line-height: 58px;
        border-bottom: 1px solid rgba(229, 229, 229, 1);
        > div:nth-child(1) {
          color: rgba(0, 0, 0, 1);
          font-size: 16px;
          font-weight: bold;
        }
        > div:nth-child(2) {
          color: rgba(128, 128, 128, 1);
          font-size: 12px;
          margin-left: auto;
        }
      }
      .content {
        .contentTop {
          margin-left: 25px;
          margin-top: 42px;
          height: 60px;
          display: flex;
          > div:nth-child(1) {
            > p:nth-child(1) {
              height: 22px;
              color: rgba(128, 128, 128, 1);
              font-size: 15px;
              line-height: 22px;
              margin-bottom: 7px;
              width: 102px;
            }
            > p:nth-child(2) {
              height: 37px;
              color: rgba(0, 0, 0, 1);
              font-size: 25px;
              line-height: 37px;
              font-weight: bold;
              margin: 0;
              span {
                color: rgba(128, 128, 128, 1);
                font-size: 15px;
                font-weight: normal;
                margin-left: 9px;
              }
            }
          }
          > div:nth-child(2) {
            flex-grow: 1;
          }
        }
        .contentBottom {
          display: flex;
          margin-top: 45px;
          margin-left: 25px;
          .contentBottom_sub {
            width: 50%;
            display: flex;
            > div:nth-child(1) {
              > p:nth-child(1) {
                height: 22px;
                color: rgba(128, 128, 128, 1);
                font-size: 15px;
                line-height: 22px;
                margin-bottom: 7px;
                width: 102px;
              }
              > p:nth-child(2) {
                height: 37px;
                color: rgba(0, 0, 0, 1);
                font-size: 25px;
                line-height: 37px;
                font-weight: bold;
                margin: 0;
                span {
                  color: rgba(128, 128, 128, 1);
                  font-size: 15px;
                  font-weight: normal;
                  margin-left: 9px;
                }
              }
            }
            > div:nth-child(2) {
              width: 80px;
            }
          }
        }
      }
    }
  }
}
</style>
