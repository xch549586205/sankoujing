<template>
  <div class="chart1">
    <div class="title">
      <span>用电计量</span>
      <div style="" class="picker">
        <p v-for="(type, i) in ['date', 'month', 'year']" :key="i" @click="changeDateType(type)">
          <a
            :style="{
              color: dateType === type ? 'rgba(46, 140, 240, 1)' : 'rgba(128, 128, 128, 1)',
            }"
          >
            {{ { year: '年', month: '月', date: '日' }[type] }}
          </a>
        </p>
        <p>
          <a-date-picker
            :mode="dateType"
            v-model="momentCurrentDate"
            :open="dateShowOne"
            :format="{ year: 'YYYY', month: 'YYYY-MM', date: 'YYYY-MM-DD' }[dateType]"
            @change="panelChangeOne"
            @openChange="openChangeOne"
            @panelChange="panelChangeOne"
          />
        </p>
      </div>
    </div>
    <p class="unit">单位：kW·h</p>
    <div id="myChart1" style="width: 100%; height: 320px"></div>
  </div>
</template>
<script>
import service from 'servicePath/index';
import * as echarts from 'echarts';
import moment from 'moment';

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
function getStr(deviceList) {
  // "value": "%\"Wave_rcd\":\"1\"%,%\"Sw_cluuidose\":\"1\"%"
  let _str = '';
  deviceList.map((deviceid) => {
    // eslint-disable-next-line no-useless-escape
    _str += `%\"uuid\":\"${deviceid}\"%,`;
  });
  return _str.slice(0, _str.length - 1);
}
export default {
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
      dateShowOne: false,
      yData: {
        Wh1: [],
        Wh2: [],
        Wh3: [],
        Wh4: [],
      },
      yData_date: [],
      currentDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  },
  computed: {
    momentCurrentDate() {
      return moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss');
    },
    xData() {
      const months = [...new Array(12)].map((i, idx) => {
        return moment(
          moment().format(
            `${this.momentCurrentDate.format('YYYY')}-${
              idx + 1 < 10 ? `0${idx + 1}` : idx + 1
            }-DD 23:59:59`
          )
        );
      });
      const days = [...new Array(moment().daysInMonth())].map((i, idx) => {
        // return moment().startOf('day').subtract(idx, 'days');
        return moment(
          moment().format(
            `${this.momentCurrentDate.format('YYYY-MM')}-${
              idx + 1 < 10 ? `0${idx + 1}` : idx + 1
            } 23:59:59`
          )
        );
      });
      const hours = [...new Array(24)].map((i, idx) => {
        return moment(moment().format(`YYYY-MM-DD ${idx < 10 ? `0${idx}` : idx}:00:00`));
      });
      const x = {
        date: hours,
        month: days,
        year: months,
      };
      const data = x[this.dateType].map((t) => {
        const formatTpye = {
          date: 'HH:00',
          month: 'MM-DD',
          year: 'YYYY-MM',
        };
        return t.format(formatTpye[this.dateType]);
      });
      return data;
    },
    // 每小时是统计 正向有功总电能+反向有功总电能
    optionD() {
      return {
        color: 'rgba(42, 130, 228, 1)',
        dataZoom: [
          //给x轴设置滚动条
          {
            start: 0, //默认为0
            end: this.xData.length > 15 ? 50 : 100, //默认为100
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            handleSize: 0, //滑动条的 左右2个滑动条的大小
            height: 10, //组件高度
            left: '0', //左边的距离
            bottom: '0', //下边的距离
            borderColor: '#fff',
            fillerColor: 'rgba(229, 229, 229, 1)',
            fillerRadius: 10,
            borderRadius: 10,
            backgroundColor: '#fff', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            realtime: true, //是否实时更新
            filterMode: 'filter',
          },
          //下面这个属性是里面拖到
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0],
            start: 0, //默认为1
            end: 100 - 1500 / 31, //默认为100
          },
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
        series: [
          {
            symbol: 'none',
            data: this.yData_date,
            name: '用电量',
            type: 'bar',
            barWidth: 20,
            stack: 'total',
            label: {
              show: false,
            },
            emphasis: {
              focus: 'series',
            },
          },
        ],
      };
    },
    // 每月、日是统计 尖、峰、平、谷
    optionMY() {
      return {
        color: [
          'rgba(42, 130, 228, 1)',
          'rgba(0, 186, 173, 1)',
          'rgba(255, 195, 0, 1)',
          'rgba(121, 72, 234, 1)',
        ],
        dataZoom: [
          //给x轴设置滚动条
          {
            start: 0, //默认为0
            end: this.xData.length > 15 ? 50 : 100, //默认为100
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            handleSize: 0, //滑动条的 左右2个滑动条的大小
            height: 10, //组件高度
            left: '0', //左边的距离
            bottom: '0', //下边的距离
            borderColor: '#fff',
            fillerColor: 'rgba(229, 229, 229, 1)',
            fillerRadius: 10,
            borderRadius: 10,
            backgroundColor: '#fff', //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            realtime: true, //是否实时更新
            filterMode: 'filter',
          },
          //下面这个属性是里面拖到
          {
            type: 'inside',
            show: true,
            xAxisIndex: [0],
            start: 0, //默认为1
            end: 100 - 1500 / 31, //默认为100
          },
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
        series: [
          {
            name: '尖电能',
            type: 'bar',
            barWidth: 20,
            stack: 'total',
            label: {
              show: false,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.yData.Wh1,
          },
          {
            name: '峰电能',
            type: 'bar',
            barWidth: 20,
            stack: 'total',
            label: {
              show: false,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.yData.Wh2,
          },
          {
            name: '平电能',
            type: 'bar',
            barWidth: 20,
            stack: 'total',
            label: {
              show: false,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.yData.Wh3,
          },
          {
            name: '谷电能',
            type: 'bar',
            barWidth: 20,

            stack: 'total',
            label: {
              show: false,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.yData.Wh4,
          },
        ],
      };
    },
  },
  watch: {
    dateType: {
      async handler(newVal, oldVal) {
        this.yData = {
          Wh1: [],
          Wh2: [],
          Wh3: [],
          Wh4: [],
        };
        this.getData({ dateType: newVal });
      },
    },
    currentDate: {
      async handler(newVal, oldVal) {
        this.getData({ dateType: this.dateType });
      },
    },
    devices: {
      async handler(newVal, oldVal) {
        if (newVal.length) {
          this.getData({});
        }
      },
    },
  },
  mounted() {},
  created() {},
  methods: {
    async getData({ dateType = this.dateType }) {
      const formatStyle1 = {
        year: 'YYYY-MM-05',
        month: 'YYYY-MM-DD',
        date: 'YYYY-MM-DD HH:mm:ss',
      }[dateType];
      const daysInMonth = moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss').daysInMonth();
      console.log(daysInMonth, 'daysInMonth');
      const timerLimit = {
        year: [
          moment(this.momentCurrentDate.format('YYYY-01-01 00:00:00'), 'YYYY-MM-DD HH:mm:ss'),
          moment(this.momentCurrentDate.format('YYYY-12-31 23:59:59'), 'YYYY-MM-DD HH:mm:ss'),
        ],
        month: [
          moment(this.currentDate, 'YYYY-MM-01 HH:mm:ss'),
          moment(
            this.momentCurrentDate.format(`YYYY-MM-${daysInMonth} HH:mm:ss`),
            'YYYY-MM-DD HH:mm:ss'
          ),
        ],
        date: [
          moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss').add(-1, 'd'),
          moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss'),
        ],
      }[dateType];

      try {
        const res = await service.mainPageAsk.getDevtasklog({
          starttime:
            timerLimit[0] &&
            timerLimit[0]
              .add({ year: 'Y', month: 'd', date: 'h' }[dateType], -1)
              .format(formatStyle1),
          endtime:
            timerLimit[1] &&
            timerLimit[1]
              .add({ year: 'Y', month: 'd', date: 'h' }[dateType], 1)
              .format(formatStyle1),
          order: 'createtime',
          limit: 10000000,
          offset: 1,
          //这里要把网关下所有的子设备拼起来
          eventresult: getStr(this.devices.map((d) => d.did)),
          msgtype: 'frozen',
          username: { month: 'day', date: 'hour', year: 'mon' }[dateType],
        });
        const hasData = res.data.totalsize > 0;
        const datas = hasData
          ? res.data.devicetaskinfos
              .map((d) => JSON.parse(d.eventresult))
              .sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf())
          : [];
        if (!hasData) {
          this.yData = { Wh1: [], Wh2: [], Wh3: [], Wh4: [] };
          this.yData_date = [];
          this.drawLine();
          return;
        }
        // eslint-disable-next-line camelcase
        if (dateType === 'date') {
          this.getYData_date(datas, timerLimit);
        } else if (dateType === 'month') {
          this.getYData_month(datas);
        } else {
          this.getYData_year1(datas);
        }
      } catch (error) {
        console.error(error);
      }
    },
    getYData_year(datas) {
      const yData = { Wh1: [], Wh2: [], Wh3: [], Wh4: [] };
      this.xData.map((YYYYMM) => {
        const lastData = datas.filter(
          (d) => moment(d.time, 'YYYY-MM-DD HH:mm:ss').add(1, 'M').format('YYYY-MM') === YYYYMM
        );
        const data = datas.filter(
          (d) => moment(d.time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM') === YYYYMM
        );
        const lastDataValue = lastData[lastData.length - 1];
        const dataValue = data[data.length - 1];
        if (lastData.length && data.length) {
          const Wh1 =
            dataValue.SupWh1 * 1 +
            dataValue.SupWh1 * 1 -
            (lastDataValue.SupWh1 * 1 + lastDataValue.SupWh1 * 1);
          const Wh2 =
            dataValue.SupWh2 * 1 +
            dataValue.SupWh2 * 1 -
            (lastDataValue.SupWh2 * 1 + lastDataValue.SupWh2 * 1);
          const Wh3 =
            dataValue.SupWh3 * 1 +
            dataValue.SupWh3 * 1 -
            (lastDataValue.SupWh3 * 1 + lastDataValue.SupWh3 * 1);
          const Wh4 =
            dataValue.SupWh4 * 1 +
            dataValue.SupWh4 * 1 -
            (lastDataValue.SupWh4 * 1 + lastDataValue.SupWh4 * 1);
          yData.Wh1.push((Wh1 > 0 ? Wh1 : 0) || 0);
          yData.Wh2.push((Wh2 > 0 ? Wh2 : 0) || 0);
          yData.Wh3.push((Wh3 > 0 ? Wh3 : 0) || 0);
          yData.Wh4.push((Wh4 > 0 ? Wh4 : 0) || 0);
        } else {
          yData.Wh1.push(0);
          yData.Wh2.push(0);
          yData.Wh3.push(0);
          yData.Wh4.push(0);
        }
      });
      this.yData = yData;
      this.drawLine();
    },
    getkwhData(parseList, timeLimit, param) {
      const dataGroupList = groupArr(
        parseList.filter((_data) => this.devices.map((d) => d.did).indexOf(_data.uuid) !== -1),
        'uuid'
      );
      let kwhData = 0;
      // 计算每一个设备的用电量，并且使它们的用电量相加取和
      dataGroupList.map(({ uuid, list }) => {
        // 时间从小到大排序
        const sortList = list.sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf());
        if (!param) {
          const firstDataList = sortList
            .filter((d) => moment(d.time).format(timeLimit.format) === timeLimit.firstDataTime)
            .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
          const lastDataList = sortList
            .filter((d) => moment(d.time).format(timeLimit.format) === timeLimit.lsatDataTime)
            .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
          if (firstDataList.length && lastDataList.length) {
            const firstValue = firstDataList[0].RtlWh * 1 + firstDataList[0].SupWh * 1;
            const lastValue = lastDataList[0].RtlWh * 1 + lastDataList[0].SupWh * 1;
            if (lastValue > firstValue) {
              kwhData += lastValue - firstValue;
            }
          }
        } else {
          const [param1, param2] = param;
          const _firstDataList = sortList
            .filter((d) => moment(d.time).format(timeLimit.format) === timeLimit.firstDataTime)
            .sort((a, b) => a[param1] * 1 + a[param2] * 1 - (b[param1] * 1 + b[param2] * 1));
          const _lastDataList = sortList
            .filter((d) => moment(d.time).format(timeLimit.format) === timeLimit.lsatDataTime)
            .sort((a, b) => a[param1] * 1 + a[param2] * 1 - (b[param1] * 1 + b[param2] * 1));
          if (_firstDataList.length && _lastDataList.length) {
            const _firstValue = _firstDataList[0][param1] * 1 + _firstDataList[0][param2] * 1;
            const _lastValue = _lastDataList[0][param1] * 1 + _lastDataList[0][param2] * 1;
            console.log(_firstValue, _lastValue, 'lastDataList');

            if (_lastValue > _firstValue) {
              kwhData += _lastValue - _firstValue;
            }
          }
        }
      });
      return kwhData > 0 ? kwhData.toFixed(2) : 0;
    },
    getYData_date(datas) {
      //昨天最后一条数据，用于计算今天0点的数据
      const yData = [];
      this.xData.map((HH) => {
        // eslint-disable-next-line prefer-destructuring
        const _HH = HH.split(':')[0];
        const xMoment = moment(
          moment(this.currentDate, 'YYYY-MM-DD HH:mm:ss').format(`YYYY-MM-DD ${_HH}:00:00`)
        );
        const firstDataTime = xMoment.format('YYYY-MM-DD HH');
        const lsatDataTime = xMoment.add(1, 'h').format('YYYY-MM-DD HH');
        const kw = this.getkwhData(datas, { firstDataTime, lsatDataTime, format: 'YYYY-MM-DD HH' });
        yData.push(kw > 0 ? kw : 0);
      });
      this.yData_date = yData;
      this.drawLine();
    },
    getYData_month(datas) {
      const yData = { Wh1: [], Wh2: [], Wh3: [], Wh4: [] };
      this.xData.map((MMDD) => {
        const xMoment = moment(this.momentCurrentDate.format(`YYYY-${MMDD}`, 'YYYY-MM-DD'));
        const firstDataTime = xMoment.format('YYYY-MM-DD');
        const lsatDataTime = xMoment.add(1, 'd').format('YYYY-MM-DD');
        const Wh1 = this.getkwhData(datas, { firstDataTime, lsatDataTime, format: 'YYYY-MM-DD' }, [
          'SupWh1',
          'RtlWh1',
        ]);
        const Wh2 = this.getkwhData(datas, { firstDataTime, lsatDataTime, format: 'YYYY-MM-DD' }, [
          'SupWh2',
          'RtlWh2',
        ]);
        const Wh3 = this.getkwhData(datas, { firstDataTime, lsatDataTime, format: 'YYYY-MM-DD' }, [
          'SupWh3',
          'RtlWh3',
        ]);
        const Wh4 = this.getkwhData(datas, { firstDataTime, lsatDataTime, format: 'YYYY-MM-DD' }, [
          'SupWh4',
          'RtlWh4',
        ]);
        yData.Wh1.push((Wh1 > 0 ? Wh1 : 0) || 0);
        yData.Wh2.push((Wh2 > 0 ? Wh2 : 0) || 0);
        yData.Wh3.push((Wh3 > 0 ? Wh3 : 0) || 0);
        yData.Wh4.push((Wh4 > 0 ? Wh4 : 0) || 0);
      });
      this.yData = yData;
      this.drawLine();
    },
    getYData_year1(datas) {
      const yData = { Wh1: [], Wh2: [], Wh3: [], Wh4: [] };
      this.xData.map((YYYYMM) => {
        const xMoment = moment(this.momentCurrentDate.format(YYYYMM, 'YYYY-MM'));
        const firstDataTime = xMoment.format('YYYY-MM');
        const lsatDataTime = xMoment.add(1, 'M').format('YYYY-MM');
        const Wh1 = this.getkwhData(datas, { firstDataTime, lsatDataTime, format: 'YYYY-MM' }, [
          'SupWh1',
          'RtlWh1',
        ]);
        const Wh2 = this.getkwhData(datas, { firstDataTime, lsatDataTime, format: 'YYYY-MM' }, [
          'SupWh2',
          'RtlWh2',
        ]);
        const Wh3 = this.getkwhData(datas, { firstDataTime, lsatDataTime, format: 'YYYY-MM' }, [
          'SupWh3',
          'RtlWh3',
        ]);
        const Wh4 = this.getkwhData(datas, { firstDataTime, lsatDataTime, format: 'YYYY-MM' }, [
          'SupWh4',
          'RtlWh4',
        ]);
        yData.Wh1.push((Wh1 > 0 ? Wh1 : 0) || 0);
        yData.Wh2.push((Wh2 > 0 ? Wh2 : 0) || 0);
        yData.Wh3.push((Wh3 > 0 ? Wh3 : 0) || 0);
        yData.Wh4.push((Wh4 > 0 ? Wh4 : 0) || 0);
      });
      this.yData = yData;
      this.drawLine();
    },
    getDataFromDate() {},
    // 弹出日历和关闭日历的回调
    openChangeOne(status) {
      if (status) {
        this.dateShowOne = true;
      }
    },
    // 得到年份选择器的值
    panelChangeOne(value) {
      this.currentDate = value.format('YYYY-MM-DD 23:59:59');
      this.dateShowOne = false;
    },
    ChangeOne(value) {
      this.date = value;
      this.dateShowOne = false;
    },
    changeDateType(dateType) {
      this.currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
      this.dateType = dateType;
    },
    changeDate(date) {
      this.date = date;
    },
    drawLine() {
      if (this.myChart) {
        this.myChart.dispose();
      }
      const myChart = echarts.init(document.getElementById('myChart1'), null, { renderer: 'svg' });
      this.myChart = myChart;
      // 绘制图表
      myChart.setOption(this.dateType === 'date' ? this.optionD : this.optionMY);
      window.addEventListener('resize', this.drawLine);
    },
  },
};
</script>
<style scoped lang="less">
.check {
  margin: 5px 0;
}
.title {
  display: flex;
  height: 60px;
  line-height: 60px;
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
  > p:last-child {
    margin-right: 0;
  }
}
</style>
