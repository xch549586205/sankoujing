<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-03 17:10:04
 * @LastEditTime: 2019-08-27 11:17:53
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-modal
      :visible="editDeviceNameModal"
      title="修改设备名称"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-input
        :placeholder="currentWatchDeviceInfo.displayname || ''"
        :value="deviceName"
        @change="changeName"
      />
    </a-modal>
    <div class="header-panel">
      <bl-header>
        <bl-breadcrumb slot="left" :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
      </bl-header>
    </div>
    <bl-page-wrapper>
      <div slot="content">
        <div class="status">
          <div class="row">
            <div>
              <p>设备类型</p>
              <p>{{ currentWatchDeviceInfo.devicetype === 'device' ? '断路器' : '网关' }}</p>
            </div>
          </div>
          <div class="row">
            <div>
              <p>设备型号</p>
              <p>
                {{ currentWatchDeviceInfo.detail ? currentWatchDeviceInfo.detail.productname : '' }}
              </p>
            </div>
          </div>
          <div class="row">
            <div>
              <p>UUID</p>
              <p>{{ currentWatchDeviceInfo.did }}</p>
            </div>
          </div>
          <div class="row">
            <div>
              <p>设备名称</p>
              <p>
                {{ currentWatchDeviceInfo.displayname
                }}<a-icon
                  :style="{ marginLeft: '5px', color: '#e1e1e1' }"
                  type="edit"
                  @click="handleEditDeviceNameModal"
                />
              </p>
            </div>
          </div>
          <div class="row">
            <div>
              <p>设备状态</p>
              <p class="online">{{ currentWatchDeviceInfo.online === '1' ? '在线' : '离线' }}</p>
            </div>
          </div>
        </div>
        <div class="content">
          <a-tabs :default-active-key="defaultActiveKey" @change="changeTab">
            <a-tab-pane key="baseInfo" tab="基本信息"> </a-tab-pane>
            <a-tab-pane
              v-if="currentWatchDeviceInfo.devicetype === 'gateway'"
              key="paramsHandle"
              tab="参数读写"
              force-render
            >
            </a-tab-pane>
            <a-tab-pane
              v-if="currentWatchDeviceInfo.devicetype === 'device'"
              key="currentData"
              tab="实时数据"
              force-render
            >
            </a-tab-pane>
            <a-tab-pane
              v-if="currentWatchDeviceInfo.devicetype === 'device'"
              key="deviceControl"
              tab="远程控制"
              force-render
            >
            </a-tab-pane>
            <a-tab-pane
              v-if="currentWatchDeviceInfo.devicetype === 'device'"
              key="controlLog"
              tab="控制日志"
              force-render
            >
            </a-tab-pane>
            <a-tab-pane
              v-if="currentWatchDeviceInfo.devicetype === 'device'"
              key="eventLog"
              tab="事件记录"
              force-render
            >
            </a-tab-pane>
            <a-tab-pane
              v-if="currentWatchDeviceInfo.devicetype === 'device'"
              key="freeze"
              tab="冻结"
              force-render
            >
            </a-tab-pane>
            <a-tab-pane
              v-if="currentWatchDeviceInfo.devicetype === 'device'"
              key="timer"
              tab="定时"
              force-render
            >
            </a-tab-pane>
          </a-tabs>
          <router-view
            :class="{ bottom: true, plr20: defaultActiveKey === 'baseInfo' }"
          ></router-view>
        </div>
      </div>
    </bl-page-wrapper>
  </div>
</template>
<script>
// import { mapGetters, mapMutations } from 'vuex';
import service from 'servicePath/index';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { getCascaderOptions, getAllGatewayList } from '@/util.js';
import moment from 'moment';

const { deviceManageAsk } = service;
export default {
  name: 'DeviceDetail',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      breadcrumbRoutes: [],
      defaultActiveKey: this.$route.name,
      editDeviceNameModal: false,
      deviceName: this.currentWatchDeviceInfo ? this.currentWatchDeviceInfo.displayname : '',
    };
  },
  computed: {
    ...mapState('deviceManage', ['currentWatchDeviceInfo']),
    ...mapState('productManage', ['devicetypeList']),
    ...mapState('app', ['running', 'projectInfo']),
    ...mapState('deviceManage', ['renderDeviceList']),
  },
  watch: {},
  updated() {
  },
  created() {
    this.$message.loading({ content: 'Loading...', key: this.deviceName });
    this.setBreadcrumb();
    this.$router.push({ name: 'baseInfo' });
    this.getDevice();
  },

  mounted() {},
  destroyed() {
    this.updateCurrentWatchDeviceInfo({});
  },
  methods: {
    // 设置面包屑
    ...mapMutations('deviceManage', ['updateCurrentWatchDeviceInfo']),
    changeName(e) {
      this.deviceName = e.target.value;
    },
    handleEditDeviceNameModal() {
      this.editDeviceNameModal = true;
    },
    async handleOk() {
      const {
        id,
        did,
        sdid,
        spid,
        displayname,
        privatedata,
        productid,
        projectid,
        platform,
        longitude,
        latitude,
        remark,
      } = this.currentWatchDeviceInfo;
      const modDev = {
        id,
        did,
        sdid,
        spid,
        displayname,
        privatedata,
        productid,
        projectid,
        platform,
        longitude,
        latitude,
        remark,
      };
      await deviceManageAsk.modDevice({
        ...modDev,
        displayname: this.deviceName,
      });
      this.updateCurrentWatchDeviceInfo({
        ...this.currentWatchDeviceInfo,
        displayname: this.deviceName,
      });
      this.editDeviceNameModal = false;
    },
    handleCancel() {
      this.editDeviceNameModal = false;
    },
    setBreadcrumb() {
      const breadcrumbRoutes = [
        {
          name: '设备管理',
          breadcrumbName: '全部设备',
        },
        {
          name: '',
          breadcrumbName: '设备详情',
        },
      ];
      this.breadcrumbRoutes = breadcrumbRoutes;
    },
    // 切换Tab
    changeTab(activeKey) {
      this.defaultActiveKey = activeKey;
      this.$router.push({ name: activeKey });
    },
    // 查询产品详情
    async getDetailProduct(productid) {
      const params = {
        id: productid,
        projectid: `${this.projectInfo.id}`,
      };
      const { errcode, data } = await deviceManageAsk.getProductDetail(params);
      if (errcode === 200) {
        return data;
      }
      return {};
    },
    // 查询设备详情
    async getDevice() {
      const { errcode, data = {} } = await deviceManageAsk.getDevice();
      if (errcode === 200) {
        const devices = data.deviceInfos;
        const device = devices.filter((d) => d.id === this.$route.params.id)[0];
        //拿到所属分组和配电箱
        const groupInfo = await getCascaderOptions();
        //拿到所属网关
        const allGatewayList = await getAllGatewayList();
        //拿到产品信息
        const detail = await this.getDetailProduct(device.productid);
        const info = {
          group: '',
          box: '',
          gateway: '',
        };
        if (
          allGatewayList.length &&
          device.devicetype !== 'gateway' &&
          device.devicetype !== 'gw'
        ) {
          allGatewayList.map((gateway) => {
            if (gateway.did === JSON.parse(device.privatedata).gatewayId) {
              info.gateway = gateway.displayname;
            }
          });
        }
        if (device.groupid && groupInfo.length) {
          groupInfo.map((group) => {
            if (group.children && group.children.length) {
              group.children.map((box) => {
                if (box.value === device.groupid) {
                  info.box = box.label;
                  info.group = group.label;
                }
              });
            }
          });
        }
        const { installdate, running } = device;
        device.installdate = installdate
          ? this.$moment(installdate).format(this.GLOBAL.TIME_FOEMAT)
          : '';
        if (running) {
          const status = this.running.filter((v) => v.value === running)[0];
          device.running = status ? status.text : '';
        }
        if (device.longitude && device.latitude) {
          device.longandlat = `${device.longitude}，${device.latitude}`;
        }
        // "1"在线 "2"离线
        let online = '2';
        if (device.devicetype === 'gateway') {
          const subDevices = devices.filter((d) => d.privatedata && d.privatedata === device.did);
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
        this.updateCurrentWatchDeviceInfo({ ...device, ...info, detail, online });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.bottom {
  padding-bottom: 50px;
}
.content {
  background-color: rgba(255, 255, 255, 1);
  padding-left: 34px;
  height: 100%;
}
.status {
  height: 100px;
  color: rgba(80, 80, 80, 1);
  background-color: rgba(255, 255, 255, 1);
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  display: flex;
  margin-bottom: 20px;
  .row {
    text-align: center;
    flex: 1;
    padding: 20px 0;
    > div {
      border-right: 1px solid rgba(229, 229, 229, 1);
      > p:nth-child(1) {
        height: 22px;
        color: rgba(119, 119, 119, 1);
        font-size: 15px;
        line-height: 22px;
        margin: 0;
      }
      > p:nth-child(2) {
        height: 33px;
        color: rgba(0, 0, 0, 1);
        font-size: 22px;
        line-height: 33px;
        font-weight: bold;
        margin-top: 5px;
      }
    }
    > div:nth-child(5) {
      border: none;
    }
    .online {
      color: rgba(42, 130, 78, 1) !important;
    }
  }
}
</style>
