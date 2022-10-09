<template>
  <a-modal
    :visible="isAddModal"
    :closable="false"
    :width="800"
    :title="mdlTitle"
    @ok="handleAddOk(form)"
  >
    <a-form :form="form">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="设备did">
        <a-input
          v-decorator="[
            'did',
            {
              initialValue: currentDevice.did,
              rules: [{ required: true, message: '请输入设备did!' }],
            },
          ]"
        />
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="网关类型">
        <a-select
          v-decorator="[
            'productid',
            {
              initialValue: currentDevice.productid,
              rules: [{ required: true, message: '请选择产品类型!' }],
            },
          ]"
          class="component-w-240"
          @change="handleProductChange"
        >
          <a-select-option
            v-for="item in productlist.filter((dev) => dev.devicetype === 'gateway')"
            :key="item.id"
            :value="item.id"
          >
            <a-tag v-if="item.projectid == 0" color="#108ee9"> 公共项目 </a-tag>
            <span>{{ item.productname }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="设备名称">
        <a-input
          v-decorator="[
            'displayname',
            {
              initialValue: currentDevice.displayname,
              rules: [{ required: true, message: '请输入设备名称!' }],
            },
          ]"
        />
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="地图经度">
        <a-input
          placeholder="请输入经度"
          style="width: 50%"
          v-decorator="[
            'longitude',
            {
              initialValue: currentDevice.longitude,
            },
          ]"
        />
        <a-button type="primary" style="margin-left: 10px" @click="chooseMapPoint"
          >地图上选择</a-button
        >
        <BaiduMapPoint
          v-if="showBaiduMap"
          :pointInfo="currentDevice"
          @cancel="cancelBaiduMapModal"
          @savePoint="baiduMapSavePoint"
        />
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="地图纬度">
        <a-input
          placeholder="请输入纬度"
          style="width: 50%"
          v-decorator="[
            'latitude',
            {
              initialValue: currentDevice.latitude,
            },
          ]"
        />
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="备注">
        <a-input
          placeholder="备注"
          v-decorator="[
            'remark',
            {
              initialValue: currentDevice.remark,
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        v-if="issubdev == true"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :colon="false"
        label="网关设备"
      >
        <a-select
          v-decorator="[
            'sdid',
            {
              initialValue: currentDevice.sdid,
              rules: [{ required: true, message: '请选择网关设备!' }],
            },
          ]"
          class="component-w-240"
          @change="handleGatewayChange"
        >
          <a-select-option v-for="item in gatewayList" :key="item.id" :value="item.id">
            {{ item.displayname }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="拓展数据">
        <a-input
          v-decorator="[
            'privatedata',
            {
              initialValue: currentDevice.privatedata,
              rules: [{ required: false, message: '' }],
            },
          ]"
          placeholder="请填入网关did"
        />
        <!-- <a-button @click="add">新增</a-button>
        <div>
          <a-table :columns="columns" class="prrivate_table" :data-source="privateDataList">
            <template v-for="col in ['name', 'value']" :slot="col" slot-scope="text, record">
              <div :key="col">
                <a-input
                  v-if="record.editable"
                  :value="text"
                  @change="e => handleChange(e.target.value, record.key, col)"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
            <template slot="operation" slot-scope="text, record">
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => save(record.key)">保存</a>
                  <a @click="() => del(record.key)">删除</a>
                  <a @click="() => cancel(record.key)">取消</a>
                </span>
                <span v-else>
                  <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
                </span>
              </div>
            </template>
          </a-table>
        </div> -->
      </a-form-item>
    </a-form>
    <template slot="footer">
      <a-button key="back" @click="handleAddCancel(form)"> 取消 </a-button>
      <a-button v-if="currentDevice.id" type="danger" @click="handleDel(form)"> 删除 </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleAddOk(form, privateDataList)"
      >
        确定
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';
const { deviceManageAsk, productManageAsk, projectManageAsk } = service;
import BaiduMapPoint from '../components/baiduMapModal.vue';

const { userManageAsk } = service;
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '20%',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '值',
    dataIndex: 'value',
    width: '55%',
    scopedSlots: { customRender: 'value' },
  },
  {
    title: '操作',
    width: '25%',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];
const privateDataList = [];

export default {
  name: 'DeviceEditModal',
  components: {
    BaiduMapPoint,
  },
  mixins: [],
  props: {
    isAddModal: Boolean,
    loading: Boolean,
    currentDevice: {
      type: Object,
      default: null,
    },
    productlist: {
      type: Array,
      default: null,
    },
    handleAddCancel: Function,
    handleDel: Function,
    handleAddOk: Function,
  },
  data() {
    this.cacheData = privateDataList.map((item) => ({ ...item }));
    return {
      columns,
      privateDataList,
      editingKey: '',
      gatewayList: [],
      issubdev: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: this.$form.createForm(this, {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      }),
      showBaiduMap: false,
    };
  },
  computed: {
    mdlTitle() {
      const { currentDevice } = this;
      return `${currentDevice.id ? '编辑' : '添加'}设备`;
    },

    showModal() {
      return this.isAddModal;
    },
  },
  watch: {},
  created() {
    if (this.currentDevice && this.currentDevice.productid) {
      this.handleProductChange(this.currentDevice.productid);
    }
    // this.convPrivateData();
  },
  mounted() {},
  destroyed() {},
  methods: {
    convPrivateData() {
      var privateDataList = [];
      var cacheData = [];
      if (this.currentDevice.privatedata) {
        var dataMap = JSON.parse(this.currentDevice.privatedata);
        var index = 0;
        for (var name in dataMap) {
          index++;
          const data = {
            key: index,
            name: name,
            value: dataMap[name],
          };
          privateDataList.push(data);
          cacheData.push(data);
        }
      }
      this.privateDataList = privateDataList;
      this.cacheData = cacheData;
      console.log('this.privateDataList', this.privateDataList);
    },
    handleChange(value, key, column) {
      const newData = [...this.privateDataList];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.privateDataList = newData;
      }
    },
    edit(key) {
      const newData = [...this.privateDataList];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.privateDataList = newData;
      }
    },
    add() {
      const data = {
        key: Date.parse(new Date()),
        name: '',
        value: '',
        editable: true,
      };
      this.privateDataList.push(data);
      this.cacheData.push(data);
    },
    save(key) {
      const newData = [...this.privateDataList];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0];
      const targetCache = newCacheData.filter((item) => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.privateDataList = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
    },
    del(key) {
      const newData = [...this.privateDataList];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0];
      newCacheData.forEach((item, index) => {
        if (key === item.key) {
          newCacheData.splice(index, 1);
          this.cacheData = newCacheData;
        }
      });
      newData.forEach((item, index) => {
        if (key === item.key) {
          newData.splice(index, 1);
          this.privateDataList = newData;
        }
      });

      this.editingKey = '';
    },
    chooseMapPoint() {
      this.showBaiduMap = true;
    },
    cancelBaiduMapModal() {
      this.showBaiduMap = false;
    },
    baiduMapSavePoint(e) {
      this.currentDevice.longitude = e.lng;
      this.currentDevice.latitude = e.lat;
    },
    cancel(key) {
      const newData = [...this.privateDataList];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter((item) => key === item.key)[0]);
        delete target.editable;
        this.privateDataList = newData;
      }
    },
    handleAddPrivateData() {},
    async handleGatewayChange(e) {
      for (var item of this.gatewayList) {
        if (item.id == e) {
          this.currentDevice.sdid = item.id;
          this.currentDevice.spid = item.productid;
        }
      }
    },
    async getDeviceList(params) {
      const { errcode, data = {} } = await deviceManageAsk.getDevice(params);

      // this.timeOut = setTimeout(() => {
      //   this.deviceFetch();
      // }, this.GLOBAL.TIME_INTERVAL);
      const { deviceInfos = [] } = data;
      return deviceInfos;
    },
    async handleProductChange(e) {
      this.gatewayList = [];
      if (this.productlist) {
        var productItem = undefined;

        for (var item of this.productlist) {
          if (item.id == e) {
            productItem = item;
          }

          if (item.id == e && item.devicetype == 'subdevice') {
            this.issubdev = true;
          } else if (item.id == e && item.devicetype != 'subdevice') {
            this.issubdev = false;
          }
        }
        if (this.currentDevice.privatedata == '' && productItem) {
          switch (productItem.platform) {
            case 'yingshi':
              this.currentDevice.privatedata = `{"url":"","appkey":"","secret":"","deviceSerial":"","channelNo":""}`;
              break;
            case 'broadlink':
              this.currentDevice.privatedata = `{"mac":"","cookie":""}`;
              break;
            default:
              this.currentDevice.privatedata = '';
              break;
          }
        }

        if (productItem) {
          this.gatewayList = await this.getDeviceList({
            platform: productItem.platform,
            devicetype: 'gateway',
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.prrivate_table {
  width: 600px;
}
</style>
