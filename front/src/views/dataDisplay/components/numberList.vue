<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-19 10:09:18
 * @LastEditTime: 2021-02-24 14:35:54
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="container">
    <div class="item">
      <div class="item_pic_container" style="background: #4d8fcc">
        <img src="static/icons/dashborad/account.png" class="item_pic" alt="" />
      </div>
      <div class="item_info">
        <div class="item_name">总登录数</div>
        <div class="item_number">{{ count }}</div>
      </div>
    </div>
    <div class="item">
      <div class="item_pic_container" style="background: #348ba9">
        <img src="static/icons/dashborad/device.png" class="item_pic" alt="" />
      </div>
      <div class="item_info">
        <div class="item_name">总设备数</div>
        <div class="item_number">{{ devcount }}</div>
      </div>
    </div>
    <div class="item">
      <div class="item_pic_container" style="background: #52c41a">
        <img src="static/icons/dashborad/using.png" class="item_pic" alt="" />
      </div>
      <div class="item_info">
        <div class="item_name">设备使用次数</div>
        <div class="item_number">{{ usedPrecent }}</div>
      </div>
    </div>
    <div class="item">
      <div class="item_pic_container" style="background: #f5222d">
        <img src="static/icons/dashborad/broken.png" class="item_pic" alt="" />
      </div>
      <div class="item_info">
        <div class="item_name">设备故障率</div>
        <div class="item_number">{{ broeknPrecent }}%</div>
      </div>
    </div>
  </div>
</template>
<script>
import service from 'servicePath/index';
import { mapGetters, mapMutations } from 'vuex';
import echarts from 'echarts';

const { dataDisplayAsk, deviceManageAsk } = service;
export default {
  name: 'NumberList',
  components: {},
  props: {},
  data() {
    return {
      procedureYear: new Date().getFullYear(),
      count: 0,
      devcount: 0,
      usedPrecent: 0,
      broeknPrecent: 0,
    };
  },
  computed: {},
  watch: {},
  async created() {
    this.getLoginNum();
    this.getDeviceNum();
    this.getUsingRate();
    this.getBrokenRate();
  },

  mounted() {},
  methods: {
    async getLoginNum() {
      const { procedureYear } = this;
      const params = {
        limit: this.GLOBAL.MAX_LEN,
        offset: 1,
        order: 'logindate',
        seq: 0,
        // type: 5,
        starttime: `${procedureYear}-00`,
        endtime: `${procedureYear}-12`,
      };
      await dataDisplayAsk
        .getLoginCountList(params)
        .then(
          (result) => {
            const { errcode, data = {} } = result;
            if (errcode === 200) {
              this.count = data.count;
            }
          },
          () => {}
        )
        .catch((e) => {
          console.error(e);
        });
    },
    async getUsingRate() {
      const params = {
        limit: this.GLOBAL.MAX_LEN,
        offset: 1,
      };
      await dataDisplayAsk
        .getUsingRate(params)
        .then(
          (result) => {
            const { errcode, data = {} } = result;
            if (errcode === 200) {
              if (data.utilization == undefined) {
                this.usedPrecent = 0;
                return;
              }
              // this.usedPrecent = parseInt(data.utilization * 100);
              this.usedPrecent = parseInt(data.utilization);
            }
          },
          () => {}
        )
        .catch((e) => {
          console.error(e);
        });
    },
    async getDeviceNum() {
      const { procedureYear } = this;
      const params = {
        limit: 1,
        offset: 1,
      };
      await deviceManageAsk
        .getDevice(params)
        .then(
          (result) => {
            const { errcode, data = {} } = result;
            if (errcode === 200) {
              this.devcount = data.totalsize;
            }
          },
          () => {}
        )
        .catch((e) => {
          console.error(e);
        });
    },
    async getBrokenRate() {
      const params = {
        limit: this.GLOBAL.MAX_LEN,
        offset: 1,
      };
      await dataDisplayAsk
        .getBrokenRate(params)
        .then(
          (result) => {
            const { errcode, data = {} } = result;
            if (errcode === 200) {
              if (data.total == 0) {
                this.broeknPrecent = 0;
                return;
              }
              this.broeknPrecent = parseInt((data.broken / data.total) * 100);
            }
          },
          () => {}
        )
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: space-between;
}
.item {
  width: 23%;
  padding: 0 80px 0 20px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 10px 1px rgba(150, 148, 148, 0.479);
}
.item_info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item_name {
  color: rgba(75, 74, 74, 0.877);
}
.item_pic_container {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background: #4d8fcc;
  box-shadow: 0 0 5px 5px rgba(14, 13, 13, 0.192);
}
.item_pic {
  width: 50px;
  height: 50px;
}
.item_number {
  color: rgba(14, 13, 13, 0.877);
  font-size: 50px;
}
</style>
