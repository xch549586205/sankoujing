<template>
  <div>
    <GatewayShowSettingModel
      :paramsfilter="
        paramsfilter.map((p) => {
          return {
            label: p.displayname,
            value: p.openproxy,
          };
        })
      "
      :visible="showModal"
      :select-params="selectParams"
      @setParamsfilter="setParamsfilter"
      @setShowModal="setShowModal"
    ></GatewayShowSettingModel>
    <a-row class="header">
      <a-col :span="12">
        <Filters
          :show="['cascaderOptions', 'gatewayListOption', 'subDeviceListOption']"
          hide-all-gateway
        />
      </a-col>
      <!-- <a-col :span="12" style="padding-left: 10px">
        <a-select class="component-w-224" placeholder="全部微段">
          <Filters :show="['cascaderOptions', 'gatewayListOption']" />
        </a-select>
      </a-col> -->
    </a-row>
    <a-row type="flex" class="content">
      <a-col :span="12" class="content_col_left">
        <div>
          <div class="title">
            <p>网关详情</p>
            <a-row class="title_content" type="flex">
              <a-col
                :span="8"
                style="cursor: pointer"
                class="title_content_col"
                @click="intoPrevGatway"
              >
                <div><a-icon type="left" /></div>
              </a-col>
              <a-col :span="8" class="title_content_col">
                <p>{{ gatewaySelected }}</p>
                <p>包含微断：{{ deviceListFromGateway.length }}</p>
              </a-col>
              <a-col
                :span="8"
                style="cursor: pointer"
                class="title_content_col"
                @click="intoNextGatway"
              >
                <div><a-icon type="right" /></div>
              </a-col>
            </a-row>
            <div class="showSet" style="margin-left: auto; display: flex">
              <a-button style="margin: auto 0 auto auto" @click="setShowModal(true)"
                >展示设置</a-button
              >
            </div>
          </div>

          <div class="picList">
            <div class="item">
              <div>
                <p></p>
                <p class="id"></p>
                <img height="100px" width="120px" style="opacity: 0" />
                <div
                  v-for="(item, i) in paramsSelected"
                  :key="i + 'title'"
                  :style="{ background: isOdd(i) ? 'rgba(243, 243, 243, 1)' : '#fff' }"
                  class="titleItem data"
                >
                  {{ item.displayname }}
                </div>
              </div>
            </div>
            <div v-for="item in deviceListFromGateway_filter" :key="item" class="item">
              <div>
                <p>{{ item.displayname }}</p>
                <p class="id">{{ item.did }}</p>

                <div class="img">
                  <img
                    :class="item.imgWidthClass"
                    :src="item.statusPic"
                    height="100px"
                    width="100%"
                  />
                </div>
                <div
                  v-for="(select, i) in paramsSelected"
                  :key="i + 'data'"
                  :style="{ background: isOdd(i) ? 'rgba(243, 243, 243, 1)' : '#fff' }"
                  class="data"
                >
                  {{
                    item.statusArr.filter((p) => p.name === select.openproxy).length
                      ? item.statusArr.filter((p) => p.name === select.openproxy)[0].value
                      : ''
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="12" class="content_col_right">
        <chart1 :devices= "deviceListFromGateway_filter"/>
      </a-col>
      <div class="chart2">
        <chart2 :devices= "deviceListFromGateway_filter"/>
      </chart1></div>
    </a-row>
  </div>
</template>

<script>
import service from 'servicePath/index';
import GatewayShowSettingModel from './gatewayShowSettingModel';
import chart1 from './chart1.vue';
import chart2 from './chart2.vue';
import Filters from '@/views/components/filters.vue';
import { getCascaderOptions, getDevice, getAllGatewayList } from '@/util.js';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import devicePic from '../devicePic';
function getPid(pid) {
  if (!pid) {
    return;
  }
  if (pid.toLowerCase().indexOf('1p') !== -1) {
    return '1p';
  }
  if (pid.toLowerCase().indexOf('2p') !== -1) {
    return '2p';
  }
  if (pid.toLowerCase().indexOf('3p') !== -1) {
    return '3p';
  }
  if (pid.toLowerCase().indexOf('4p') !== -1) {
    return '4p';
  }
}
const { deviceManageAsk } = service;

export default {
  name: 'RealTimeMonitoringMain',
  components: {
    GatewayShowSettingModel,
    chart1,
    chart2,
    Filters,
  },
  props: {},
  data() {
    return {
      selectParams: ['V_phsA', 'A_phsA', 'Tmp_PhsA', 'TotW', 'Wh_c', 'Wh_l'],
      showModal: false,
      deviceListFromGateway: [],
      breadcrumbRoutes: [
        {
          name: '设备管理',
          breadcrumbName: '全部设备',
        },
      ],
      productInfo: {},
    };
  },
  computed: {
    ...mapState('filters', ['filterParams']),
    ...mapState('app', ['projectInfo']),
    gatewayListOption() {
      return this.filterParams.gatewayListOption || [];
    },
    gatewaySelected() {
      return this.filterParams.gatewaySelected && this.filterParams.gatewaySelected.length
        ? this.filterParams.gatewaySelected[0]
        : '';
    },
    subDeviceSelect() {
      return this.filterParams.subDeviceSelect && this.filterParams.subDeviceSelect.length
        ? this.filterParams.subDeviceSelect[0]
        : '';
    },
    paramsfilter() {
      const params = [];
      this.deviceListFromGateway.map((dev) => {
        const { attributes } = dev.detail;
        if (attributes && attributes.length) {
          attributes.map(({ openproxy, displayname, openvalue }) => {
            if (!params.filter((p) => p.openproxy === openproxy).length) {
              params.push({ openproxy, displayname, openvalue });
            }
          });
        }
      });
      const _paramsfilter = params.filter(({ openvalue }) => openvalue === 'current') || [];
      return _paramsfilter;
    },
    paramsSelected() {
      const select = this.paramsfilter.filter(
        (param) => this.selectParams.indexOf(param.openproxy) !== -1
      );
      return select.length ? select : this.paramsfilter.filter((param, i) => i < 6);
    },
    next() {
      if (this.gatewayListOption && this.gatewaySelected) {
        const _index = this.gatewayListOption.map((p) => p.did).indexOf(this.gatewaySelected);
        return _index < this.gatewayListOption.length - 1;
      }
      return false;
    },
    prev() {
      if (this.gatewayListOption && this.gatewaySelected) {
        const _index = this.gatewayListOption.map((p) => p.did).indexOf(this.gatewaySelected);
        return _index !== 0;
      }
      return false;
    },
    deviceListFromGateway_filter() {
      if (this.subDeviceSelect) {
        return this.deviceListFromGateway.filter((dev) => this.subDeviceSelect === dev.did);
      }
      return this.deviceListFromGateway;
    },
  },
  watch: {
    gatewaySelected: {
      async handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getDevice();
        }
      },
    },
  },
  created() {
    this.$message.loading({ content: 'Loading...', key: this.gatewaySelected });
  },
  mounted() {
    // this.getDevice();
  },
  beforeDestroy() {},
  methods: {
    ...mapMutations('filters', ['updateFilters']),

    intoPrevGatway() {
      if (this.gatewayListOption && this.gatewaySelected) {
        const _index = this.gatewayListOption.map((p) => p.did).indexOf(this.gatewaySelected);
        this.updateFilters({ gatewaySelected: [this.gatewayListOption[_index - 1].did] });
      }
    },
    intoNextGatway() {
      if (this.gatewayListOption && this.gatewaySelected) {
        const _index = this.gatewayListOption.map((p) => p.did).indexOf(this.gatewaySelected);
        this.updateFilters({ gatewaySelected: [this.gatewayListOption[_index + 1].did] });
      }
    },
    setParamsfilter(selectParams) {
      this.selectParams = selectParams;
    },
    isOdd: (num) => num % 2 === 1,
    async getDetailProduct(productid) {
      const params = {
        id: productid,
        projectid: `${this.projectInfo.id}`,
      };
      if (this.productInfo) {
        Promise.resolve(this.productInfo[productid]);
      }
      const { errcode, data } = await deviceManageAsk.getProductDetail(params);
      if (errcode === 200) {
        this.productInfo[productid] = data;
        return data;
      }
    },
    setShowModal(e) {
      this.showModal = e;
    },
    async asyncWorker(device) {
      const detail = await this.getDetailProduct(device.productid);
      let currentOnOff = device.statusmap ? device.statusmap.action.value : 'open';
      if (currentOnOff === 'nil') {
        currentOnOff = 'close';
      }
      const arr = [];
      // eslint-disable-next-line guard-for-in
      for (const i in device.statusmap) {
        arr.push(device.statusmap[i]);
      }
      return {
        ...device,
        imgWidthClass: `img_${getPid(detail.pid)}`,
        statusPic: devicePic[currentOnOff][getPid(detail.pid)],
        detail,
        statusArr: arr,
      };
    },
    updateDeviceListFromGateway(deviceListFromGateway) {
      this.deviceListFromGateway = deviceListFromGateway;
    },
    async getDevice() {
      const _this = this;
      const { cascaderSelected, gatewaySelected } = this.filterParams;
      const params = {
        privatedata: gatewaySelected ? `%${gatewaySelected}%` : '',
        devicetype: 'device',
      };
      if (cascaderSelected && cascaderSelected.length && cascaderSelected[1]) {
        params.groupid = cascaderSelected[1];
      }
      try {
        const { deviceInfos } = await getDevice(params);
        console.log(deviceInfos, 'deviceInfos');
        if (!deviceInfos || !deviceInfos.length) {
          this.deviceListFromGateway = [];
          return [];
        }
        const results = await Promise.all(
          deviceInfos.map(async (item) => await _this.asyncWorker(item))
        );
        this.updateDeviceListFromGateway(results || []);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  padding: 10px 20px;
}
.col {
  padding: 0 20px;
}
.title {
  display: flex;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid rgba(229, 229, 229, 1);
  p,
  .showSet {
    width: 25%;
  }
  .title_content {
    width: 50%;
    .icon {
      padding: 5px;
    }
    .title_content_col:nth-child(1),
    .title_content_col:nth-child(3) {
      width: 36px;
      display: flex;
      > div {
        width: 36px;
        height: 36px;
        margin: auto;
        display: flex;
        box-shadow: rgba(204, 204, 204, 1) solid 1px;
        border-radius: 4px;
        border: 1px solid rgba(204, 204, 204, 1);
        i {
          margin: auto;
        }
      }
    }
    .title_content_col:nth-child(2) {
      width: calc(100% - 72px);
      text-align: center;
      p {
        margin: 0;
        width: 100%;
      }
      > p:nth-child(1) {
        color: rgba(0, 0, 0, 1);
        font-size: 18px;
        text-align: center;
        font-weight: bold;
        height: 21px;
        line-height: 21px;
        margin-top: 11px;
      }
      > p:nth-child(2) {
        text-align: center;
        // margin-top: 5px;
        line-height: 19px;
        height: 19px;
        color: rgba(56, 56, 56, 1);
        font-size: 14px;
      }
    }
  }
}
.content {
  padding: 0 20px 20px 20px;
  .content_col_left {
    height: 500px;
    background: #fff;
    padding: 0 10px 0 20px;
    > div {
      height: 500px;
      padding: 0 20px 20px 0;
    }
  }
  .content_col_right {
    padding: 0 0 0 10px;

    > div {
      padding: 0 20px 20px 20px;
      height: 500px;
      background: #fff;
    }

    .chart1 {
    }
  }
  .chart2 {
    margin-top: 20px;
    background: #fff;
    width: 100%;
  }
}

.picList::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.picList::-webkit-scrollbar-track {
  background-color: #fff;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
}
.picList::-webkit-scrollbar-thumb {
  background-color: rgba(229, 229, 229, 1);
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
}

.picList {
  padding-top: 20px;
  height: 428px;
  overflow-x: scroll;
  display: flex;
  .item {
    > div {
      .img {
        display: flex;
        padding: 0 30px;
        height: 100px;
        img {
          height: 100px;
          margin: auto;
        }
        .img_1p {
          width: 25px;
        }
        .img_2p {
          width: 50px;
        }
        .img_3p {
          width: 66px;
        }
        .img_4p {
          width: 82px;
        }
      }
      > p {
        padding: 0 30px;
        height: 19px !important;
        color: rgba(0, 0, 0, 1);
        font-size: 13px;
        line-height: 19px;
        margin-bottom: 0;
        text-align: center;
      }

      .id {
        color: rgba(56, 56, 56, 1);
        margin: 1px 0 20px 0;
      }
    }
    .data {
      height: 48px;
      line-height: 48px;
      text-align: center;
      color: rgba(0, 0, 0, 1);
      font-size: 12px;
    }
    .titleItem {
      color: rgba(0, 0, 0, 1);
      font-weight: bold;
      text-align: left;
    }
  }
}
</style>
