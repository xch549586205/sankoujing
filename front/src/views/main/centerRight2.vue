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
              color: parseFloat(DoD) * 1 > 0 ? 'rgba(255, 83, 73, 1)' : 'rgba(33, 145, 121, 1)',
            }"
          >
            {{ abs(DoD) }}
          </div>
          <div class="icon">
            <a-icon
              v-if="parseFloat(DoD) !== 0 && DoD !== '--'"
              :style="{
                color: parseFloat(DoD) * 1 > 0 ? 'rgba(255, 83, 73, 1)' : 'rgba(33, 145, 121, 1)',
              }"
              :type="parseFloat(DoD) > 0 ? 'rise' : 'fall'"
            />
          </div>
        </div>
        <div>上一日告警数</div>
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
              color: parseFloat(MoM) * 1 > 0 ? 'rgba(255, 83, 73, 1)' : 'rgba(33, 145, 121, 1)',
            }"
          >
            {{ abs(MoM) }}
          </div>
          <div class="icon">
            <a-icon
              v-if="parseFloat(MoM) !== 0 && MoM !== '--'"
              :style="{
                color: parseFloat(MoM) * 1 > 0 ? 'rgba(255, 83, 73, 1)' : 'rgba(33, 145, 121, 1)',
              }"
              :type="parseFloat(MoM) > 0 ? 'rise' : 'fall'"
            />
          </div>
        </div>
        <div>上一月告警数</div>
      </div>
    </div>
    <div class="right">
      <div class="title">告警类型TOP5</div>
      <div class="ranking">
        <div v-for="(item, t) in ranking" :key="t + 'ranking'" class="rankingItem">
          <div class="left">
            <span :class="{ top3: t < 3 }">{{ t + 1 }}</span
            >{{ item.title }}
          </div>
          <div class="right">{{ toPercent(item.num / count) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import upIcon from './images/up.svg';
import { warningList } from './util';
import service from 'servicePath/index';
import downIcon from './images/down.svg';
import { mapState } from 'vuex';
import moment from 'moment';
import { getWarningFromDay, getWarningFromMonth } from './util';
// eslint-disable-next-line import/first

const { mainPageAsk } = service;
function toPercent(point) {
  let str = Number(point * 100).toFixed(1) !== 'NaN' ? Number(point * 100).toFixed(1) : 0;
  str += '%';
  return str;
}
const warningQueryStr = (() => {
  // "value": "%\"Wave_rcd\":\"1\"%,%\"Sw_close\":\"1\"%"
  let _str = '';
  warningList.map(({ name, param, belongTo }) => {
    _str += `%\"${param}\":\"1\"%,`;
  });
  return _str.slice(0, _str.length - 1);
})();
const params = {
  offset: 1,
  limit: 150000,
  seq: 0,
  order: 'createtime',
  key: 'soe',
  value: warningQueryStr,
  groupfield: "DATE_FORMAT(createtime,'%Y-%m-%d')",
};

export default {
  name: 'Main',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      upIcon,
      ranking: [],
      downIcon,
      DoD: '--',
      count: 0,
      MoM: '--',
    };
  },
  computed: {
    ...mapState('mainPage', ['checkedDevices']),

    upOrDown() {
      return 'down';
    },
  },
  watch: {
    checkedDevices(newVal, oldVal) {
      if (newVal.length) {
        this.getDData();
        this.getMData();
        this.getRanking();
      }
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    abs(num) {
      return num.indexOf('%') !== -1 ? `${Math.abs(num.split('%')[0] * 1)}%` : '--';
    },
    toPercent(point) {
      let str = Number(point * 100).toFixed(1) !== 'NaN' ? Number(point * 100).toFixed(1) : 0;
      str += '%';
      return str;
    },
    async getDData() {
      try {
        const starttime = moment().add(-2, 'd').format('YYYY-MM-DD 00:00:00');
        const endtime = moment().format('YYYY-MM-DD HH:mm:ss');
        const res = await mainPageAsk.getReportLog({
          ...params,
          starttime,
          groupfield: "DATE_FORMAT(createtime,'%Y-%m-%d')",
          endtime,
        });
        const dataList1 = res.data.alist
          .filter((d) => this.checkedDevices.indexOf(d.account) !== -1)
          .map((d) => ({
            ...JSON.parse(d.groupcnt),
            createtime: d.createtime,
          }));
        const twoDaysAgoNum = getWarningFromDay(
          moment().add(-2, 'd').format('YYYY-MM-DD'),
          dataList1
        );
        const yesterdayNum = getWarningFromDay(
          moment().add(-1, 'd').format('YYYY-MM-DD'),
          dataList1
        );
        const DoD = (yesterdayNum - twoDaysAgoNum) / twoDaysAgoNum;
        this.DoD = twoDaysAgoNum * 1 === 0 ? '0' : toPercent(DoD);
      } catch (error) {
        console.error(error);
      }
    },
    async getMData() {
      try {
        const starttime = moment().add(-2, 'M').format('YYYY-MM-DD 00:00:00');
        const endtime = moment().format('YYYY-MM-DD HH:mm:ss');
        const res2 = await mainPageAsk.getReportLog({
          ...params,
          groupfield: "DATE_FORMAT(createtime,'%Y-%m')",
          starttime,
          endtime,
        });
        const dataList2 = res2.data.alist
          .filter((d) => this.checkedDevices.indexOf(d.account) !== -1)
          .map((d) => ({
            ...JSON.parse(d.groupcnt),
            createtime: d.createtime,
          }))
          .sort((a, b) => a.totalcnt - b.totalcnt);

        const twoMonthAgoNum = getWarningFromMonth(
          moment().add(-2, 'M').format('YYYY-MM'),
          dataList2
        );
        const prevMonthNum = getWarningFromMonth(
          moment().add(-1, 'M').format('YYYY-MM'),
          dataList2
        );
        const MoM = (prevMonthNum - twoMonthAgoNum) / twoMonthAgoNum;
        this.MoM = twoMonthAgoNum * 1 === 0 ? '0' : toPercent(MoM);
      } catch (error) {
        console.error(error);
      }
    },
    async getRanking() {
      try {
        const starttime = moment().add(-30, 'd').format('YYYY-MM-DD HH:mm:ss');
        const endtime = moment().add(-1, 'd').format('YYYY-MM-DD HH:mm:ss');
        const res3 = await mainPageAsk.getReportLog({
          ...params,
          groupfield: "DATE_FORMAT(createtime,'%Y-%m-%d')",
          starttime,
          endtime,
        });
        const dataList3 = res3.data.alist
          .filter((d) => this.checkedDevices.indexOf(d.account) !== -1)
          .map((d) => ({
            ...JSON.parse(d.value),
            createtime: d.createtime,
          }));
        const num = {};
        let count = 0;
        dataList3.map((datas) => {
          // eslint-disable-next-line guard-for-in
          // eslint-disable-next-line guard-for-in
          for (const key in datas) {
            const current = warningList.filter((warnning) => warnning.param === key);
            const fromGroup = current.length ? current[0].group : '';
            if (fromGroup) {
              num[fromGroup] = num[fromGroup] || 0;
              if (datas[key] * 1 === 1) {
                num[fromGroup] += 1;
                count += 1;
              }
            }
          }
        });
        const ranking = [];
        // eslint-disable-next-line guard-for-in
        for (const key in num) {
          ranking.push({ title: key, num: num[key] });
        }
        this.ranking = ranking.sort((a, b) => b.num - a.num);
        this.count = count;
      } catch (error) {
        console.error(error);
      }
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
      background-color: rgba(33, 145, 121, 0.1) !important;
      margin-top: 10px;
      > div:nth-child(1) {
        color: rgba(33, 145, 121, 1) !important ;
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
      height: 24px;
      text-align: left;
      color: rgba(0, 0, 0, 1);
      font-size: 16px;
      line-height: 24px;
      text-align: left;
    }

    .ranking {
      margin-top: 12px;
      .rankingItem {
        padding: 9px 0;
        border-bottom: 1px solid rgba(205, 205, 205, 1);
        display: flex;
        .left {
          > span {
            width: 24px;
            height: 21px;
            line-height: 21px;
            margin-right: 20px;
            font-size: 24px;
            color: rgba(0, 0, 0, 1);
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
            text-align: center;
          }
          .top3 {
            background: rgba(255, 141, 26, 1);
            color: #fff;
            border-radius: 3px;
          }
        }
        .right {
          text-align: right;
          margin-left: auto;
        }
      }
      .rankingItem:last-child {
        border: none;
      }
    }
  }
}
</style>
