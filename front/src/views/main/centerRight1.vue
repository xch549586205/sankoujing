/* eslint-disable camelcase */
<template>
  <div class="content">
    <div class="left">
      <div
        :style="{
          background:
            parseFloat(DoD) * 1 > 0 ? 'rgba(255, 83, 73, 0.1)' : 'rgba(33, 145, 121, 0.1)',
        }"
        class="lastDay"
      >
        <div>
          <div
            :style="{
              color: parseFloat(DoD) > 0 ? 'rgba(255, 83, 73, 1)' : 'rgba(33, 145, 121, 1)',
            }"
          >
            {{ abs(DoD) }}
          </div>
          <div class="icon">
            <a-icon
              v-if="parseFloat(DoD) !== 0 && DoD !== '--'"
              :style="{
                color: parseFloat(DoD) > 0 ? 'rgba(255, 83, 73, 1)' : 'rgba(33, 145, 121, 1)',
              }"
              :type="parseFloat(DoD) > 0 ? 'rise' : 'fall'"
            />
          </div>
        </div>
        <div>上一日用电量</div>
      </div>
      <div
        :style="{
          background:
            parseFloat(MoM) * 1 > 0 ? 'rgba(255, 83, 73, 0.1)' : 'rgba(33, 145, 121, 0.1)',
        }"
        class="lastMonth"
      >
        <div>
          <div
            :style="{
              color: parseFloat(MoM) > 0 ? 'rgba(255, 83, 73, 1)' : 'rgba(33, 145, 121, 1)',
            }"
          >
            {{ abs(MoM) }}
          </div>
          <div class="icon">
            <a-icon
              v-if="parseFloat(MoM) !== 0 && MoM !== '--'"
              :style="{
                color: parseFloat(MoM) > 0 ? 'rgba(255, 83, 73, 1)' : 'rgba(33, 145, 121, 1)',
              }"
              :type="parseFloat(MoM) > 0 ? 'rise' : 'fall'"
            />
          </div>
        </div>
        <div>上一月用电量</div>
      </div>
    </div>
    <div class="right">
      <div class="title">
        <div style="" class="picker">
          <p
            v-for="(type, i) in ['day', 'mon', 'year']"
            :class="dateType === type ? 'select' : ''"
            :key="'dateType' + i"
            @click="changeDateType(type)"
          >
            <a
              :style="{
                color: dateType === type ? 'rgba(46, 140, 240, 1)' : 'rgba(128, 128, 128, 1)',
                fontWeight: dateType === type ? 'bold' : 'normal',
              }"
            >
              {{ { year: '年', mon: '月', day: '日' }[type] }}
            </a>
          </p>
        </div>
        <div class="set">
          <div style="cursor: pointer" @click="showModal">分项设置</div>
        </div>
      </div>
      <div class="right-content">
        <div class="right-content-left" style="width: 100%">
          <div id="myChartRing" style="width: 90%; height: 160px"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import upIcon from './images/up.svg';
import downIcon from './images/down.svg';
import { mapState, mapMutations } from 'vuex';
import moment from 'moment';
import * as echarts from 'echarts';
import service from 'servicePath/index';
import { getStr } from './util';

const { mainPageAsk } = service;
function toPercent(point) {
  let str = Number(point * 100).toFixed(1) !== 'NaN' ? Number(point * 100).toFixed(1) : 0;
  str += '%';
  return str;
}
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

export default {
  name: 'Main',
  components: {},
  mixins: [],
  props: {
    classifyList: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
  },
  data() {
    return {
      // 分项数据（类型为 日）
      values: [],
      DoD: '--',
      MoM: '--',
      upIcon,
      downIcon,
      dateType: 'day',
      listData: {
        A: {
          bgColor: 'rgba(46, 140, 240, 1)',
          left: 'A栋-本月用电量 ',
          num: 896.78,
        },
        B: {
          bgColor: 'rgba(0, 186, 173, 1)',
          left: 'B栋-本月用电量 ',
          num: 652.36,
        },
        C: {
          bgColor: 'rgba(255, 195, 0, 1)',
          left: 'C栋-本月用电量 ',
          num: 552.2,
        },
        D: {
          bgColor: 'rgba(121, 72, 234, 1)',
          left: 'D栋-本月用电量 ',
          num: 624,
        },
      },
    };
  },
  computed: {
    ...mapState('mainPage', ['kw', 'checkedDevices']),
    upOrDown() {
      return 'down';
    },
    classifyData() {
      const _data = [];
      let _total = 0;
      this.values.map((v) => {
        _total += v.value * 1;
      });
      this.classifyList
        .filter((c) => c.checked)
        .map((classify, i) => {
          _data.push({
            value: this.values[i].value,
            name: classify.groupName,
            scale:
              _total === 0 || this.values[i].value === 0
                ? 0
                : ((this.values[i].value / _total) * 100).toFixed(1),
          });
        });
      return _data;
    },
    option() {
      return {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          show: true,
          right: 0,
          icon: 'circle',
          data: this.classifyData,
          top: 10,
          textStyle: {
            fontSize: 12,
            width: 120,
            rich: {
              a: {
                align: 'left',
                color: 'rgba(0, 0, 0, 1)',
                padding: [0, 0, 0, 0],
              },
              b: {
                align: 'left',
                color: 'rgba(0, 0, 0, 1)',
                padding: [0, 0, 0, 5],
              },
              c: {
                align: 'right',
                color: 'rgba(217, 217, 217, 1)',
                padding: [0, 0, 0, 0],
              },
              d: {
                align: 'right',
                padding: [0, 0, 0, 20],
                color: 'rgba(33, 145, 121, 1)',
              },
              e: {
                align: 'right',
                padding: [0, 0, 0, 20],
                color: 'rgba(212, 48, 48, 1)',
              },
            },
          },
          // formatter(name) {
          //   const _name = name.length > 8 ? `${name.slice(0, 8)}...` : name;
          //   const current = data.filter((d) => d.name === name)[0];
          //   const { value, scale } = current;
          //   return `a|${_name} ${value} kW·h ${scale}% `;
          // },
          formatter: (name) => {
            const _name = name.length > 8 ? `${name.slice(0, 8)}...` : name;
            const current = this.classifyData.filter((d) => d.name === name)[0];
            const { value, scale } = current;
            const arr = [`{a|${_name}}`, `{b|${value}}`, `{c|${'丨'}}`];
            arr.push(scale < 0 ? `{d|${parseInt(scale)}%}` : `{e|${parseInt(scale)}%}`);
            return arr.join('');
          },
        },

        series: [
          {
            name: '用电量 KW·h',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            center: ['60px', '60px'],

            emphasis: {
              label: {
                show: true,
                fontSize: '15',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: this.classifyData,
          },
        ],
      };
    },
  },
  watch: {
    classifyList: {
      async handler(newVal) {
        this.getClassifyData();
      },
      deep: true,
    },
    dateType: {
      async handler(newVal, oldVal) {
        this.getClassifyData();
      },
    },
    checkedDevices(newVal, oldVal) {
      if (newVal.length) {
        this.getDayData();
        this.getMonthData();
      }
    },
  },
  created() {
    this.getClassifyData();
  },
  mounted() {},
  destroyed() {},
  methods: {
    ...mapMutations('mainPage', ['setClassifyModal', 'updateTreeData']),
    abs(num) {
      return num.indexOf('%') !== -1 ? `${Math.abs(num.split('%')[0] * 1)}%` : '--';
    },
    async getDayData() {
      //1、上一日用电量和上两日用电量及他们的环比率
      //1、上一日用电量：当日0点日冻结-上日0点日冻结；上两日用电量：前天0点日冻结减去大前天0点日冻结；
      //2、上一月用电量和上两月用电量及他们的环比
      //2、上一月用电量：当月1日0点月冻结-上月1号0点月冻结；上俩月用电量：上月1日0点月冻结-上上月1号0点月冻结
      const params = {
        order: 'createtime',
        limit: 999999,
        offset: 1,
        msgtype: 'frozen',
        username: 'day',
      };
      const starttime = moment().add(-2, 'd').format('YYYY-MM-DD 00:00:00');
      const endtime = moment().add(1, 'd').format('YYYY-MM-DD HH:mm:ss');
      const res = await mainPageAsk.getDevtasklog({
        ...params,
        starttime,
        endtime,
      });
      const list = res.data.devicetaskinfos.map((info) => ({
        ...JSON.parse(info.eventresult),
        eventtime: info.eventtime,
      }));

      const twoDaysAgoKw = this.getkwhData(list, {
        firstDataTime: moment().add(-2, 'd').format('YYYY-MM-DD'),
        lsatDataTime: moment().add(-1, 'd').format('YYYY-MM-DD'),
        format: 'YYYY-MM-DD',
      });
      const yesterdayKw = this.getkwhData(list, {
        firstDataTime: moment().add(-1, 'd').format('YYYY-MM-DD'),
        lsatDataTime: moment().format('YYYY-MM-DD'),
        format: 'YYYY-MM-DD',
      });

      const DoD = (yesterdayKw - twoDaysAgoKw) / twoDaysAgoKw;

      this.DoD = twoDaysAgoKw * 1 === 0 ? '--' : toPercent(DoD);
    },
    getkwhData(parseList, timeLimit) {
      const dataGroupList = groupArr(
        parseList.filter((_data) => this.checkedDevices.indexOf(_data.uuid) !== -1),
        'uuid'
      );
      let kwhData = 0;
      // 计算每一个设备的用电量，并且使它们的用电量相加取和
      dataGroupList.map(({ uuid, list }) => {
        // 时间从小到大排序
        const sortList = list.sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf());
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
      });
      return kwhData > 0 ? kwhData.toFixed(2) : 0;
    },
    async getMonthData() {
      // 2、上一月用电量：当月1日0点月冻结-上月1号0点月冻结；上俩月用电量：上月1日0点月冻结-上上月1号0点月冻结
      const params = {
        order: 'createtime',
        limit: 999999,
        offset: 1,
        msgtype: 'frozen',
        username: 'mon',
        seq: 1,
      };
      const starttime = moment().add(-3, 'M').format('YYYY-MM-DD 00:00:00');
      const endtime = moment().add(1, 'M').format('YYYY-MM-DD HH:mm:ss');
      const res = await mainPageAsk.getDevtasklog({
        ...params,
        starttime,
        endtime,
      });
      const list = res.data.devicetaskinfos
        .map((info) => ({
          ...JSON.parse(info.eventresult),
          eventtime: info.eventtime,
        }))
        .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
      // 前月1日0点日冻结M
      const twoMonthAgoKw = this.getkwhData(list, {
        firstDataTime: moment().add(-2, 'M').format('YYYY-MM'),
        lsatDataTime: moment().add(-1, 'M').format('YYYY-MM'),
        format: 'YYYY-MM',
      });
      // 上月1日0点日冻结
      const prevMonthKw = this.getkwhData(list, {
        firstDataTime: moment().add(-1, 'M').format('YYYY-MM'),
        lsatDataTime: moment().format('YYYY-MM'),
        format: 'YYYY-MM',
      });
      console.log('上月用电111', prevMonthKw);
      console.log('前月用电111', twoMonthAgoKw);
      const MoM = (prevMonthKw - twoMonthAgoKw) / twoMonthAgoKw;
      this.MoM = twoMonthAgoKw * 1 === 0 ? '--' : toPercent(MoM);
    },
    async getClassifyData() {
      if (!this.classifyList.length) {
        return;
      }
      const timeLimit = {
        day: {
          starttime: moment().add(-3, 'd').format('YYYY-MM-DD 00:00:00'),
          endtime: moment().add(1, 'd').format('YYYY-MM-DD 00:00:00'),
        },
        mon: {
          starttime: moment().add(-2, 'M').format('YYYY-MM-01'),
          endtime: moment().add(1, 'M').format('YYYY-MM-02'),
        },
        year: {
          starttime: moment().add(-2, 'Y').format('YYYY-01-01'),
          endtime: moment().format('YYYY-03-02'),
        },
      }[this.dateType];
      const promiseList = [];
      this.classifyList
        .filter((c) => c.checked)
        .map((classify) => {
          promiseList.push(this.getTask(classify.devices, timeLimit));
        });
      const res = await Promise.all(promiseList);
      this.renderData(
        res.map((r) => (r.data && r.data.devicetaskinfos ? r.data.devicetaskinfos : []))
      );
    },
    getTask(devices, timeLimit) {
      if (!devices || !devices.length) {
        return Promise.resolve([]);
      }
      const params = {
        order: 'createtime',
        limit: 999999,
        offset: 1,
        msgtype: 'frozen',
        username: this.dateType === 'day' ? 'day' : 'mon',
        eventresult: getStr(devices),
        starttime: timeLimit.starttime,
        endtime: timeLimit.endtime,
      };
      return mainPageAsk.getDevtasklog({
        ...params,
      });
    },
    renderData(datalist) {
      if (this.dateType === 'day') {
        const values = [];
        datalist.map((datas, i) => {
          const dataGroupList = groupArr(
            datas.map((d) => JSON.parse(d.eventresult)),
            'uuid'
          );
          let kwhData = 0;
          let isRise = false;

          dataGroupList.map(({ uuid, list }) => {
            const sortList = list
              .sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf())
              .filter((d) => d.RtlWh * 1 > 0 || d.SupWh * 1 > 0);
            const todayData = sortList.filter(
              (l) => moment(l.time).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
            );
            const yesterdayData = sortList
              .filter(
                (l) =>
                  moment(l.time).format('YYYY-MM-DD') === moment().add(-1, 'd').format('YYYY-MM-DD')
              )
              .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));

            const twoDaysAgoData = sortList
              .filter(
                (l) =>
                  moment(l.time).format('YYYY-MM-DD') === moment().add(-2, 'd').format('YYYY-MM-DD')
              )
              .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));

            if (todayData.length && yesterdayData.length) {
              const todayValue = todayData[0].RtlWh * 1 + todayData[0].SupWh * 1;
              const yesterdayValue = yesterdayData[0].RtlWh * 1 + yesterdayData[0].SupWh * 1;
              const twoDaysAgoValue = twoDaysAgoData[0].RtlWh * 1 + twoDaysAgoData[0].SupWh * 1;

              kwhData += todayValue - yesterdayValue;
              isRise = twoDaysAgoValue < yesterdayValue;
            }
            if (twoDaysAgoData.length && yesterdayData.length) {
              const yesterdayValue = yesterdayData[0].RtlWh * 1 + yesterdayData[0].SupWh * 1;
              const twoDaysAgoValue = twoDaysAgoData[0].RtlWh * 1 + twoDaysAgoData[0].SupWh * 1;
              isRise = twoDaysAgoValue < yesterdayValue;
            }
          });
          values.push({ value: kwhData > 0 ? kwhData.toFixed(2) : 0, isRise });
        });
        this.values = values;
        this.drawLine();
      }
      if (this.dateType === 'mon') {
        const _values = [];
        datalist.map((datas, i) => {
          const dataGroupList = groupArr(
            datas.map((d) => JSON.parse(d.eventresult)),
            'uuid'
          );
          let kwhData = 0;
          let isRise = false;
          dataGroupList.map(({ uuid, list }) => {
            const sortList = list
              .sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf())
              .filter((d) => d.RtlWh * 1 > 0 || d.SupWh * 1 > 0);

            const thisData = sortList
              .filter((l) => moment(l.time).format('YYYY-MM') === moment().format('YYYY-MM'))
              .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
            const prevData = sortList
              .filter(
                (l) => moment(l.time).format('YYYY-MM') === moment().add(-1, 'M').format('YYYY-MM')
              )
              .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
            const twoAgoData = sortList.filter(
              (l) => moment(l.time).format('YYYY-MM') === moment().add(-2, 'M').format('YYYY-MM')
            );
            if (thisData.length && prevData.length) {
              const thisValue = thisData[0].RtlWh * 1 + thisData[0].SupWh * 1;
              const prevDataValue = prevData[0].RtlWh * 1 + prevData[0].SupWh * 1;
              if (thisValue > prevDataValue) {
                kwhData += thisValue - prevDataValue;
              }
            }
            if (twoAgoData.length && prevData.length) {
              const prevDataValue = prevData[0].RtlWh * 1 + prevData[0].SupWh * 1;
              const twoAgoValue = twoAgoData[0].RtlWh * 1 + twoAgoData[0].SupWh * 1;
              isRise = twoAgoValue < prevDataValue;
            }
          });
          _values.push({ value: kwhData > 0 ? kwhData.toFixed(2) : 0, isRise });
        });
        this.values = _values;
        this.drawLine();
      }
      if (this.dateType === 'year') {
        const _values = [];
        datalist.map((datas, i) => {
          const dataGroupList = groupArr(
            datas.map((d) => JSON.parse(d.eventresult)),
            'uuid'
          );
          let kwhData = 0;
          let isRise = false;
          dataGroupList.map(({ uuid, list }) => {
            const sortList = list
              .sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf())
              .filter((d) => d.RtlWh * 1 > 0 || d.SupWh * 1 > 0);
            const thisData = sortList
              .filter((l) => moment(l.time).format('YYYY') === moment().format('YYYY'))
              .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
            const prevData = sortList
              .filter((l) => moment(l.time).format('YYYY') === moment().add(-1, 'Y').format('YYYY'))
              .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
            const twoAgoData = sortList
              .filter((l) => moment(l.time).format('YYYY') === moment().add(-2, 'Y').format('YYYY'))
              .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
            if (thisData.length && prevData.length) {
              const thisValue = thisData[0].RtlWh * 1 + thisData[0].SupWh * 1;
              const prevDataValue = prevData[0].RtlWh * 1 + prevData[0].SupWh * 1;
              if (thisValue > prevDataValue) {
                kwhData += thisValue - prevDataValue;
              }
            }
            if (twoAgoData.length && prevData.length) {
              const prevDataValue = prevData[0].RtlWh * 1 + prevData[0].SupWh * 1;
              const twoAgoValue = twoAgoData[0].RtlWh * 1 + twoAgoData[0].SupWh * 1;
              isRise = twoAgoValue < prevDataValue;
            }
          });
          _values.push({ value: kwhData, isRise });
        });
        this.values = _values;
        this.drawLine();
      }
    },
    showModal() {
      this.setClassifyModal({ show: true });
    },
    changeDateType(dateType) {
      this.dateType = dateType;
    },
    drawLine() {
      if (this.myChart) {
        this.myChart.dispose();
      }
      const myChart = echarts.init(document.getElementById('myChartRing'), null, {
        renderer: 'svg',
      });
      this.myChart = myChart;

      myChart.setOption(this.option);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 260px;
  background: #fff;
  padding: 20px 20px 30px 0;
  display: flex;
  .left {
    padding-top: 6px;
    .lastDay,
    .lastMonth {
      width: 160px;
      padding-top: 17px;
      height: 100px;
      left: 1257px;
      top: 213px;
      color: rgba(80, 80, 80, 1);
      background-color: rgba(212, 48, 48, 0.11);
      font-size: 14px;
      padding-left: 15px;
      line-height: 150%;
      > div:nth-child(1) {
        color: rgba(212, 48, 48, 1);
        font-size: 28px;
        font-weight: bold;
        display: flex;
        .icon {
          margin-left: 9px;
          display: flex;
          img {
            margin: auto;
            width: 25px;
            height: 25px;
          }
        }
      }
      > div:nth-child(2) {
        color: rgba(128, 128, 128, 1);
        font-size: 16px;
        margin-top: 5px;
      }
    }
    .lastMonth {
      background-color: rgba(33, 145, 121, 0.1);
      margin-top: 10px;
      > div:nth-child(1) {
        color: rgba(33, 145, 121, 1);
      }
    }
  }
  .right {
    margin-left: 52px;
    flex-grow: 1;
    .check {
      margin: 5px 0;
    }
    .title {
      display: flex;
      height: 46px;
      border-bottom: 1px solid rgba(229, 229, 229, 1);
      text-align: left;
      // padding-bottom: 10px;
    }
    .picker {
      text-align: left;
      display: flex;
      > p {
        padding-bottom: 9px;
        line-height: 37px;
        height: 46px;
        margin-right: 25px;
      }
      .select {
        border-bottom: 4px solid rgba(46, 140, 240, 1);
      }
    }
    .set {
      padding-bottom: 9px;
      margin-left: auto;
      > div {
        width: 80px;
        height: 36px;
        color: rgba(80, 80, 80, 1);
        background-color: rgba(255, 255, 255, 1);
        box-shadow: rgba(204, 204, 204, 1) solid 1px;
        border-radius: 4px;
        font-size: 14px;
        line-height: 36px;
        text-align: center;
        border: 1px solid rgba(204, 204, 204, 1);
      }
    }
    .right-content {
      display: flex;
      padding-top: 20px;
      .right-content-left {
      }
      .right-content-right {
        .column {
          height: 18px;
          line-height: 18px;
          margin-top: 5px;
          display: flex;
          .vertical {
            width: 1px;
            height: 16px;
            margin-top: 1px;
            background-color: rgba(217, 217, 217, 1);
            margin-left: 25px;
          }
          > div:nth-child(2) {
            margin-left: 20px;
            width: 40px;
          }
          > div:nth-child(3) {
            margin-left: 7px;
          }
        }
      }
    }
  }
}
</style>
