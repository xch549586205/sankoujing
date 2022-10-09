<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-07-23 10:35:12
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <div class="header-panel">
      <bl-header>
        <bl-breadcrumb slot="left" :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
        <div slot="right" style="display: flex; flex-direction: row-reverse">
          <Filters
            :show="['cascaderOptions', 'gatewayListOption', 'onlineOption', 'inputSearch']"
            @emitCascaderOptions="emitCascaderOptions"
          />

          <!-- 暂时不放开web新增设备，由app录入数据 -->
          <!-- <a-button type="primary" @click="showAddDeviceModal">新增设备</a-button> -->
        </div>
      </bl-header>
    </div>
    <bl-page-wrapper>
      <div slot="content">
        <a-table
          :columns="columns"
          :row-key="(record) => `${record.id}${record.did}`"
          :data-source="renderData"
          :loading="loading"
          :pagination="pagination"
          class="reset-pagination"
          @change="deviceChange"
        >
          <template slot="index" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
          <template slot="devicetype" slot-scope="text, record">
            <!-- <a-tag color="#108ee9" style="width: 80px"> -->
            {{ getDevicetype(record.devicetype).name }}
            <!-- </a-tag> -->
          </template>
          <template slot="online" slot-scope="text, record">
            <!-- <a-tag color="#108ee9" style="width: 80px"> -->
            {{ record.online === '1' ? '在线' : '离线' }}
            <!-- </a-tag> -->
          </template>
          <template slot="running" slot-scope="text, record">
            <span class="status_detail" @click="showStatusDetail(record)">详情</span>
          </template>
          <template slot="operation" slot-scope="text, record">
            <!-- <a class="control" @click="control(record)">控制</a> -->
            <!-- 暂时不放开web增删改查，由app录入数据 -->
            <!-- <a @click="showEditModal(record)">编辑</a> -->
            <!-- <a-divider type="vertical" /> -->
            <a @click="detail(record)">详情</a>
          </template>
        </a-table>
      </div>
    </bl-page-wrapper>
    <ControlModalAdapter v-if="isControlModal" @cancel="cancelControlModal" />

    <a-modal v-model="isShowStatus" title="运行状态" @ok="handleOk">
      <!-- <div v-if="currentDevice.statusmap">
        <p v-for="item in currentDevice.statusmap" :key="item.name">
          <span class="statusmodal_name">{{ item.name_cn }}</span>
          <span>:{{ item.value_cn }}</span>
        </p>
      </div> -->
      <a-descriptions v-if="currentDevice.statusmap" bordered>
        <a-descriptions-item
          v-for="item in currentDevice.statusmap"
          :span="3"
          :key="item.name"
          :label="item.name_cn"
        >
          {{ item.value_cn }}
        </a-descriptions-item>
      </a-descriptions>
      <div v-else>
        <p>暂无状态</p>
      </div>
    </a-modal>

    <DeviceEditModal
      v-if="isAddModal"
      :loading="loading"
      :is-add-modal="isAddModal"
      :productlist="productlist"
      :current-device="currentDevice"
      :handle-add-cancel="handleAddCancel"
      :handle-del="handleDel"
      :handle-add-ok="handleAddOk"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';
import Cascader from 'ant-design-vue';
import Mix from '@/mixins';
import ControlModalAdapter from './../detail/ControlModalAdapter.vue';
import DeviceEditModal from './../detail/deviceEditModal.vue';
import Message from 'ant-design-vue/lib/message';
import { getDevice } from '@/util.js';
import Filters from '@/views/components/filters.vue';
import moment from 'moment';
// import { Base64 } from 'js-base64';

const { deviceManageAsk, productManageAsk, groupManageAsk } = service;
const { PageTableCreaterMix } = Mix;

export default {
  name: 'DeviceList',
  components: {
    ControlModalAdapter,
    DeviceEditModal,
    Cascader,
    Filters,
  },
  mixins: [PageTableCreaterMix('device')],
  props: {},
  data() {
    return {
      cascaderSelect: [],
      gatewaySelect: undefined,
      breadcrumbRoutes: [
        {
          name: '设备管理',
          breadcrumbName: '全部设备',
        },
      ],
      loading: false,
      productlist: [],
      onlineStatusList: this.$store.state.app.online,
      search: '',
      searchVal: '',
      location: '',
      locationVal: '',
      isControlModal: false,
      controlType: 'openproxy',
      timeOut: null,
      isSingle: true,
      isShowStatus: false,
      isAddModal: false,
      currentDevice: {},
      groupInfo: [],
    };
  },
  computed: {
    ...mapState('app', ['projectInfo']),
    ...mapState('productManage', ['devicetypeList']),
    ...mapState('filters', ['filterParams']),
    ...mapState('deviceManage', ['deviceInfo', 'runningStatus', 'onlineStatus']),
    ...mapState('deviceManage', []),

    getStatus() {
      return function (statusArray, val) {
        const status = this[statusArray].filter((v) => v.key === val)[0];
        return status ? status.text : '';
      };
    },
    getDevicetype() {
      return function (val) {
        const status = this.devicetypeList.filter((v) => v.key == val)[0];
        return status || '';
      };
    },
    renderData() {
      const _this = this;
      const { gatewayListOption, online } = this.filterParams;
      console.log(online, 'online');
      const render = this.data.map((device) => {
        const info = {
          group: '',
          box: '',
          gateway: '',
          model: '',
        };
        if (gatewayListOption && gatewayListOption.length) {
          gatewayListOption.map((gateway) => {
            if (
              device.devicetype === 'device' &&
              gateway.did === JSON.parse(device.privatedata).gatewayId
            ) {
              info.model = JSON.parse(device.privatedata).model;
              info.gateway = gateway.displayname;
            }
          });
        }
        if (device.groupid && _this.groupInfo.length) {
          _this.groupInfo.map((group) => {
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
        // "1"在线 "0"离线
        let _online = '0';
        if (device.devicetype === 'gateway') {
          const subDevices = this.data.filter(
            (d) => d.privatedata && JSON.parse(d.privatedata).gatewayId === device.did
          );
          subDevices.map((_device) => {
            const lastTimer = moment(_device.lastreport, 'YYYY-MM-DD HH:mm:ss');
            const dura = moment().diff(lastTimer, 'minute');
            if (dura < 11) {
              _online = '1';
            }
          });
        } else {
          const lastTimer = moment(device.lastreport, 'YYYY-MM-DD HH:mm:ss');
          const dura = moment().diff(lastTimer, 'minute');

          if (dura < 11) {
            _online = '1';
          }
        }
        return {
          ...device,
          ...info,
          online: _online,
        };
      });
      return render.filter((d) => (online === '-1' ? true : d.online === online));
    },
  },
  watch: {
    filterParams: {
      async handler(newVal, oldVal) {
        if (
          newVal.gatewaySelected !== oldVal.gatewaySelected ||
          newVal.cascaderSelected !== oldVal.cascaderSelected ||
          newVal.rangePicker !== oldVal.rangePicker ||
          newVal.subDeviceSelect !== oldVal.subDeviceSelect ||
          newVal.inputSearchValue !== oldVal.inputSearchValue
        ) {
          this.init();
        }
      },
      deep: true,
    },
    renderData: {
      async handler(newVal, oldVal) {
        if (newVal && newVal.length) {
          this.updateRenderDeviceList(newVal);
        }
      },
      deep: true,
    },
  },
  created() {},
  updated() {},
  async mounted() {},
  beforeDestroy() {
    this.stopTime();
  },
  methods: {
    ...mapMutations('deviceManage', ['updateRenderDeviceList']),

    emitCascaderOptions(option) {
      this.groupInfo = option;
    },

    handleGateway(value) {
      this.gatewaySelect = value;
    },

    ...mapMutations('deviceManage', ['updateDevice']),
    // 表头
    deviceColumns() {
      const columns = [
        {
          title: '序号',
          dataIndex: 'index',
          width: '6%',
          align: 'center',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '设备类型',
          dataIndex: 'devicetype',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'devicetype' },
        },
        {
          title: '设备型号',
          dataIndex: 'model',
          width: '10%',
          align: 'center',
        },

        {
          title: 'UUID',
          dataIndex: 'did',
          align: 'center',
        },
        {
          title: '名称',
          dataIndex: 'displayname',
          align: 'center',
        },
        {
          title: '设备状态',
          dataIndex: 'online',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'online' },
        },
        {
          title: '所属网关',
          dataIndex: 'gateway',
          width: '10%',
          align: 'center',
        },
        {
          title: '所属配电箱',
          dataIndex: 'box',
          width: '10%',
          align: 'center',
        },

        {
          title: '所属分组',
          width: '15%',
          dataIndex: 'group',
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operate',
          width: '15%',
          align: 'left',
          scopedSlots: { customRender: 'operation' },
        },
      ];
      return columns;
    },
    // 控制
    control(record) {
      this.updateDevice(record);
      this.isControlModal = true;
    },
    showAddDeviceModal() {
      this.currentDevice = {};
      this.isAddModal = true;
      this.getProductList();
    },
    async showEditModal(record) {
      const _record = JSON.parse(JSON.stringify(record));
      this.currentDevice = _record;
      this.isAddModal = true;
      await this.getProductList();
    },

    // 取消控制弹窗
    cancelControlModal() {
      this.isControlModal = false;
      this.controlType = '';
    },
    // 更多
    detail(record) {
      this.$router.push({ name: 'deviceDetail', params: { id: record.id } });
    },
    showStatusDetail(record) {
      this.isShowStatus = true;
      this.currentDevice = record;
    },
    handleOk() {
      this.isShowStatus = false;
      this.currentDevice = {};
    },

    async handleGateWayDel() {
      const dev = this.currentDevice;
      const that = this;
      this.$confirm({
        title: '确定删除网关及关联子设备吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          const delList = [dev.id];
          // 查询子设备
          getDevice({ sdid: dev.id }).then(async ({ deviceInfos }) => {
            if (deviceInfos != undefined && deviceInfos.lenght != 0) {
              // eslint-disable-next-line guard-for-in
              for (const index in deviceInfos) {
                delList.push(deviceInfos[index].id);
              }
            }
            await deviceManageAsk.delDevice({ dids: delList });
            that.currentDevice = {};
            that.isAddModal = false;
            that.init();
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    async handleDel() {
      const dev = this.currentDevice;
      var that = this;
      if (dev.devicetype == 'gateway') {
        this.handleGateWayDel();
        return;
      }
      this.$confirm({
        title: '确定删除该设备吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          var delList = [dev.id];
          deviceManageAsk.delDevice({ dids: delList });
          that.currentDevice = {};
          that.isAddModal = false;
          that.init();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    handleAddCancel() {
      this.isAddModal = false;
    },
    async handleAddOk(form, privatedata) {
      try {
        var flag = true;
        form.validateFields((err, values) => {
          if (err) {
            flag = false;
          }
        });
        if (!flag) {
          return;
        }
        this.loading = true;

        this.currentDevice.productid = form.getFieldsValue().productid;
        this.currentDevice.privatedata = form.getFieldsValue().privatedata;
        this.currentDevice.did = form.getFieldsValue().did.trim();
        this.currentDevice.displayname = form.getFieldsValue().displayname;
        this.currentDevice.remark = form.getFieldsValue().remark;
        if (form.getFieldsValue().longitude) {
          this.currentDevice.longitude = form.getFieldsValue().longitude + '';
        }
        if (form.getFieldsValue().latitude) {
          this.currentDevice.latitude = form.getFieldsValue().latitude + '';
        }

        // var privateObj = {};
        // if (privatedata && privatedata.lenght != 0) {
        //   for (var item of privatedata) {
        //     privateObj[item.name] = item.value;
        //   }
        // }
        // this.currentDevice.privatedata = JSON.stringify(privateObj);

        if (this.currentDevice.productid) {
          for (const index in this.productlist) {
            if (this.productlist[index].id == this.currentDevice.productid) {
              this.currentDevice.platform = this.productlist[index].platform;
            }
          }
        }

        // if (this.currentDevice.privatedata) {
        //   this.currentDevice.privatedata = Base64.encode(this.currentDevice.privatedata);
        // }
        if (this.currentDevice.id) {
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
          } = this.currentDevice;
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

          await deviceManageAsk.modDevice(modDev);
        } else {
          await deviceManageAsk.addDevice(this.currentDevice);
        }

        this.isAddModal = false;
        this.loading = false;
        this.currentDevice = {};
        this.init();
      } catch (error) {
        console.log('error', error);
        this.loading = false;
        if (error && error.errcode == 551 && error.errmsg.indexOf('Duplicate entry') != -1) {
          Message.error('设备已存在');
          return;
        } else if (error && error.errcode == 551) {
          Message.error(error.errmsg);
        }
      }
    },
    stopTime() {
      clearTimeout(this.timeOut);
    },

    async getProductList() {
      var projectid = this.projectInfo.id;
      const { errcode, data = {} } = await productManageAsk.getProduct({
        projectid: projectid + '',
      });
      this.productlist = data.productsinfo;
    },
    // 请求数据
    async deviceFetchList(params = { offset: 1, limit: 15, seq: 1 }) {
      this.stopTime();
      const { location } = this;
      const { online, inputSearchValue, cascaderSelected, gatewaySelected } = this.filterParams;
      const gatewayId = gatewaySelected && gatewaySelected.length ? gatewaySelected[0] : '';
      const newParams = {
        ...params,
        privatedata: gatewayId ? `%${gatewayId}%` : '',
        displayname: inputSearchValue,
        devicetype: gatewayId ? 'device' : '',
        location,
      };
      if (cascaderSelected && cascaderSelected.length && cascaderSelected[1]) {
        // eslint-disable-next-line prefer-destructuring
        newParams.groupid = cascaderSelected[1];
      }
      const { deviceInfos, totalsize } = await getDevice(newParams);
      if (!deviceInfos) {
        this.updateCurrent([]);
        return {
          total: 0,
          data: [],
        };
      }
      for (const index in deviceInfos) {
        if (deviceInfos[index].lastreport) {
          deviceInfos[index].lastreport = this.$moment(deviceInfos[index].lastreport).format(
            this.GLOBAL.TIME_FOEMAT
          );

          if (deviceInfos[index].longitude && deviceInfos[index].latitude) {
            deviceInfos[index].longandlat =
              deviceInfos[index].longitude + '，' + deviceInfos[index].latitude;
          }
          deviceInfos[index].online =
            this.$moment(deviceInfos[index].lastreport) > this.$moment().subtract(5, 'm')
              ? '1'
              : '0';
        }
      }
      if (deviceInfos) {
        this.updateCurrent(deviceInfos);
      }
      return {
        total: totalsize,
        data: deviceInfos,
      };
    },
    // 更新当前操作的设备状态
    updateCurrent(data) {
      const { deviceInfo = {} } = this;
      const current = data.filter((v) => v.did === deviceInfo.did)[0];
      if (current) {
        this.updateDevice(current);
      }
    },
  },
};
</script>

<style lang="less">
.header-panel .component-w-224:nth-child(1) > span {
  padding: 0 30px 0 12px;
}
.table-border .ant-table-thead > tr > th {
  border: none;
}

.disabled {
  background: @bl-disabled-color;
  cursor: not-allowed;
}
.statusmodal_name {
  font-weight: 600;
}
.status_detail {
  color: rgb(0, 89, 255);
  cursor: pointer;
}
.product_select {
  width: 200px;
}
</style>
