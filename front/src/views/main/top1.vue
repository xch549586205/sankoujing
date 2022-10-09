<template>
  <div class="top">
    <div class="top-col1">
      <div
        :style="{
          backgroundImage: 'url(' + images.topBg1 + ')',
        }"
      >
        <div>
          <p>微断总数</p>
          <p>{{ deviceNum }}<span>个</span></p>
        </div>
        <div>
          <p>网关总数</p>
          <p>{{ gatewayNum }}<span>个</span></p>
        </div>
        <div>
          <p>设备在线</p>
          <p>{{ onlineDeviceNum }}<span>个</span></p>
        </div>
      </div>
    </div>
    <div class="top-col2">
      <div
        :style="{
          backgroundImage: 'url(' + images.topBg2 + ')',
        }"
      >
        <div>
          <p>昨日用电</p>
          <p :style="{ fontSize: parseFloat(kw.day).toFixed(1).length > 4 ? '22px' : '24px' }">
            {{ parseFloat(kw.day).toFixed(1) || 0 }}
            <span :style="{ fontSize: parseFloat(kw.day).toFixed(1).length > 4 ? '18px' : '20px' }">
              kWh
            </span>
          </p>
        </div>
        <div>
          <p>上月用电</p>
          <p :style="{ fontSize: parseFloat(kw.month).toFixed(1).length > 4 ? '22px' : '24px' }">
            {{ parseFloat(kw.month).toFixed(1) || 0 }}
            <span
              :style="{ fontSize: parseFloat(kw.month).toFixed(1).length > 4 ? '18px' : '20px' }"
            >
              kWh
            </span>
          </p>
        </div>
        <div>
          <p>今年用电</p>
          <p :style="{ fontSize: parseFloat(kw.year).toFixed(1).length > 4 ? '22px' : '24px' }">
            {{ parseFloat(kw.year).toFixed(1) || 0 }}
            <span
              :style="{ fontSize: parseFloat(kw.year).toFixed(1).length > 4 ? '18px' : '20px' }"
            >
              kWh
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="top-col3">
      <div
        :style="{
          backgroundImage: 'url(' + images.topBg3 + ')',
        }"
      >
        <div>
          <p>昨日告警</p>
          <p>{{ parseInt(warning.yesterday) || 0 }}<span>个</span></p>
        </div>
        <div>
          <p>近7日告警</p>
          <p>{{ parseInt(warning.day7) || 0 }}<span>个</span></p>
        </div>
        <div>
          <p>近30日告警</p>
          <p>{{ parseInt(warning.day30) || 0 }}<span>个</span></p>
        </div>
      </div>
    </div>
    <div class="top-col4" style="cursor: pointer" @click="showModal">
      <div>
        <p>展示</p>
        <p>设置</p>
      </div>
    </div>
  </div>
</template>
<script>
import { getDevice } from '@/util.js';
import moment from 'moment';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';
import topBg1 from './images/topBg1.png';
import topBg2 from './images/topBg2.png';
import topBg3 from './images/topBg3.png';
import { warningList, getKwFromDay } from './util';

const { mainPageAsk } = service;

function groupArr(list, field) {
  let fieldList = [];
  const att = [];
  list.map((e) => {
    fieldList.push(e[field]);
  });
  // 数组去重
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
  props: {},
  data() {
    return {
      images: {
        topBg1,
        topBg2,
        topBg3,
      },
      visible: false,
      allDevices: [],
      kw: {
        year: 0,
        month: 0,
        day: 0,
      },
      warning: {
        yesterday: 0,
        day7: 0,
        day30: 0,
      },
    };
  },
  computed: {
    ...mapState('mainPage', ['checkedDevices']),
    onlineDeviceNum() {
      return this.allDevices.filter(
        (device) => device.devicetype === 'device' && device.online === '1'
      ).length;
    },
    gatewayNum() {
      return this.allDevices.filter((device) => device.devicetype !== 'device').length;
    },
    deviceNum() {
      return this.allDevices.filter((device) => device.devicetype === 'device').length;
    },
  },
  watch: {
    checkedDevices(newVal, oldVal) {
      if (newVal.length) {
        ['day', 'month', 'year'].map((type) => this.getKw(type));
        this.getWarning();
        this.deviceFetchList();
      }
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    ...mapMutations('mainPage', ['setShowSetModal', 'setStoreKw']),

    showModal() {
      this.setShowSetModal({ show: true });
    },
    handleOk(e) {
      this.visible = false;
    },
    // 请求数据
    async deviceFetchList(params = { offset: 1, limit: 1000000, seq: 1 }) {
      const newParams = {
        devicetype: '',
        limit: 100000000,
        location: '',
        offset: 1,
        privatedata: '',
        seq: 1,
      };
      const { deviceInfos, totalsize } = await getDevice(newParams);
      this.allDevices = [...deviceInfos].map((device) => {
        // "1"在线 "2"离线
        let online = '2';
        if (device.devicetype === 'gateway') {
          const subDevices = deviceInfos.filter(
            (d) => d.privatedata && JSON.parse(d.privatedata).gatewayId === device.did
          );
          subDevices.map((_device) => {
            const lastTimer = moment(_device.lastreport, 'YYYY-MM-DD HH:mm:ss');
            const dura = moment().diff(lastTimer, 'minute');
            if (dura < 11) {
              online = '1';
            }
          });
        } else {
          const lastTimer = moment(device.lastreport, 'YYYY-MM-DD HH:mm:ss');
          const dura = moment().diff(lastTimer, 'minute');
          if (dura < 11) {
            online = '1';
          }
        }
        return {
          ...device,
          online,
        };
      });
    },
    async getKw(dateType) {
      const timeLimit = {
        day: {
          starttime: moment().add(-1, 'day').format('YYYY-MM-DD 00:00:00'),
          endtime: moment().add(1, 'day').format('YYYY-MM-DD 00:00:00'),
          firstDataTime: moment().add(-1, 'day').format('YYYY-MM-DD'),
          lsatDataTime: moment().format('YYYY-MM-DD'),
          dateType,
        },
        month: {
          starttime: moment().add(-1, 'M').format('YYYY-MM-01 00:00:00'),
          endtime: moment().add(1, 'M').format('YYYY-MM-01 00:00:00'),
          firstDataTime: moment().add(-1, 'M').format('YYYY-MM-01'),
          lsatDataTime: moment().format('YYYY-MM-01'),
          dateType,
        },
        year: {
          starttime: moment().format('YYYY-01-01 00:00:00'),
          endtime: moment().add(2, 'M').format('YYYY-MM-01 00:00:00'),
          firstDataTime: moment().format('YYYY-01-01'),
          lsatDataTime: moment().format('YYYY-MM-01'),
          dateType,
        },
      }[dateType];
      const username = {
        day: 'day',
        month: 'mon',
        year: 'mon',
      }[dateType];
      const params = {
        order: 'createtime',
        limit: 99999,
        offset: 1,
        msgtype: 'frozen',
        username,
        starttime: timeLimit.starttime,
        endtime: timeLimit.endtime,
      };
      try {
        const res = await mainPageAsk.getDevtasklog(params);
        if (!res.data.devicetaskinfos || !res.data.devicetaskinfos.length) {
          return;
        }
        let kwhData = this.getkwhData(res, timeLimit);

        // 如果是查今年数据，还得查出本月用电量
        if (dateType === 'year') {
          const _params = {
            ...params,
            username: 'day',
            starttime: moment(moment().format('YYYY-MM-01 00:00:00'))
              .add(-1, 'd')
              .format('YYYY-MM-DD 00:00:00'),
            endtime: moment().add(1, 'd').format('YYYY-MM-DD 00:00:00'),
          };
          const _res = await mainPageAsk.getDevtasklog(_params);
          if (_res.data.devicetaskinfos && _res.data.devicetaskinfos.length) {
            kwhData += this.getkwhData(
              _res,
              {
                firstDataTime: moment().format('YYYY-MM-01'),
                lsatDataTime: moment().format('YYYY-MM-DD'),
                dateType,
              },
              true
            );
          }
        }
        this.kw = {
          ...this.kw,
          [dateType]: kwhData > 0 ? kwhData.toFixed(2) : 0,
        };
      } catch (error) {
        console.error(error);
      }
    },
    getkwhData(res, timeLimit, isThisMonth) {
      const { dateType } = this;
      const parseList = res.data.devicetaskinfos
        .map((d) => ({ ...JSON.parse(d.eventresult) }))
        .sort((a, b) => moment(a.time).valueOf() - moment(b.time).valueOf());
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
          .filter((d) => {
            if (timeLimit.dateType === 'year') {
              return (
                moment(d.time).format('YYYY-MM-DD') === timeLimit.firstDataTime ||
                moment(d.time).isAfter(moment(timeLimit.firstDataTime))
              );
            }
            return moment(d.time).format('YYYY-MM-DD') === timeLimit.firstDataTime;
          })
          .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));

        const lastDataList = sortList
          .filter((d) => moment(d.time).format('YYYY-MM-DD') === timeLimit.lsatDataTime)
          .sort((a, b) => a.RtlWh * 1 + a.SupWh * 1 - (b.RtlWh * 1 + b.SupWh * 1));
        if (isThisMonth) {
          const firstValue = sortList[0].RtlWh * 1 + sortList[0].SupWh * 1;
          const lastValue =
            sortList[sortList.length - 1].RtlWh * 1 + sortList[sortList.length - 1].SupWh * 1;
          if (lastValue > firstValue) {
            kwhData += lastValue - firstValue;
          }
        } else if (firstDataList.length && lastDataList.length) {
          const firstValue = firstDataList[0].RtlWh * 1 + firstDataList[0].SupWh * 1;
          const lastValue = lastDataList[0].RtlWh * 1 + lastDataList[0].SupWh * 1;
          if (lastValue > firstValue) {
            kwhData += lastValue - firstValue;
          }
        }
      });
      return kwhData;
    },
    async getWarning() {
      const prevDayFisrtTime = moment().add(-1, 'day').format('YYYY-MM-DD 00:00:00');
      const prevDayLastTime = moment().add(-1, 'day').format('YYYY-MM-DD 23:59:59');
      const todayTime = moment().format('YYYY-MM-DD 23:59:59');
      const day7Time = moment().add(-7, 'day').format('YYYY-MM-DD 00:00:00');
      const day30Time = moment().add(-30, 'day').format('YYYY-MM-DD 00:00:00');

      const warningQueryStr = (() => {
        // "value": "%\"Wave_rcd\":\"1\"%,%\"Sw_close\":\"1\"%"
        let _str = '';
        warningList.map(({ name, param, belongTo }) => {
          _str += `%\"${param}\":\"1\"%,`;
        });
        return _str.slice(0, _str.length - 1);
      })();
      const params = {
        order: 'createtime',
        limit: 15,
        offset: 1,
        key: 'soe',
        value: warningQueryStr,
      };
      // 昨日
      try {
        const res = await mainPageAsk.getReportLog({
          starttime: prevDayFisrtTime,
          endtime: prevDayLastTime,
          ...params,
          seq: 1,
        });
        this.warning = { ...this.warning, yesterday: res.data.totalsize };
      } catch (error) {
        console.error(error);
      }
      // 近7日
      try {
        const res = await mainPageAsk.getReportLog({
          starttime: day7Time,
          endtime: todayTime,
          ...params,
          seq: 1,
        });
        this.warning = { ...this.warning, day7: res.data.totalsize };
      } catch (error) {
        console.error(error);
      }
      // 近30日
      try {
        const res = await mainPageAsk.getReportLog({
          starttime: day30Time,
          endtime: todayTime,
          ...params,
          seq: 1,
        });
        this.warning = { ...this.warning, day30: res.data.totalsize };
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.top {
  margin: 26px 10px 20px 10px;
  display: flex;
  .top-col1,
  .top-col3,
  .top-col2 {
    padding: 0 10px;
    width: calc(33.33333% - 30px);
    display: flex;
    white-space: nowrap;
    > div {
      height: 100px;
    }
  }
  .top-col1,
  .top-col2,
  .top-col3 {
    > div {
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border-radius: 5px;
      width: 100%;
      display: flex;
      padding-right: 100px;
      padding-left: 26px;
      > div {
        width: 33.3%;
        > p {
          margin: 0;
        }
        > p:nth-child(1) {
          height: 30px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 20px;
          line-height: 30px;
          margin-top: 15px;
        }
        > p:nth-child(2) {
          height: 39px;
          color: rgba(255, 255, 255, 1);
          font-size: 24px;
          line-height: 39px;
          font-weight: bold;
          span {
            opacity: 0.8;
            color: rgba(255, 255, 255, 1);
            font-size: 20px;
            margin-left: 3px;
          }
        }
      }
    }
  }
  .top-col2 {
    > div {
      > div {
        > p:nth-child(2) {
          span {
            margin-left: 0px;
          }
        }
      }
    }
  }
  .top-col4 {
    padding: 0 10px;
    > div {
      width: 70px;
      height: 100px;
      color: rgba(80, 80, 80, 1);
      background-color: rgba(255, 255, 255, 1);
      box-shadow: rgba(204, 204, 204, 1) solid 1px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 50px;
      padding: 26px 0;
      text-align: center;
      > p {
        line-height: 22px;
        margin: 0;
        text-align: center;
      }
    }
  }
}
</style>
