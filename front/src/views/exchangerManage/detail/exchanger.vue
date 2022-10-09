<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 11:04:03
 * @LastEditTime: 2021-06-02 14:35:41
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-spin :spinning="spinning">
    <div>
      <bl-header>
        <bl-breadcrumb slot="left" :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
        <div slot="right">
          <a-button v-if="defaultActiveKey==='deviceList'"
                    type="primary"
                    @click="addDevice">添加设备</a-button>
        </div>
      </bl-header>
      <bl-page-wrapper class="content-padding">
        <div slot="content">
          <a-tabs :default-active-key="defaultActiveKey"
                @change="changeTab">
          <a-tab-pane key="exchangerDetail"
                      tab="积分详情">
            <a-form :form="form" hide-required-mark >

            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="标题"
            >
              <a-input
                v-decorator="[
                  `name`,
                  {
                    initialValue: exchanger.name,
                    rules: [
                      {
                        required: true,
                        message: '输入标题名称长度不超过20个字符',
                        max: GLOBAL.NAME_MAX_LEN,
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
        
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="行"
            >
              <a-input-number
                :min="0"
                :precision="0"
                v-decorator="[
                  `xsize`,
                  {
                    initialValue: exchanger.xsize,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="列"
            >
              <a-input-number
                :min="0"
                :precision="0"
                v-decorator="[
                  `ysize`,
                  {
                    initialValue: exchanger.ysize,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="默认数量"
            >
              <a-input-number
                :min="0"
                :precision="0"
                v-decorator="[
                  `defcnt`,
                  {
                    initialValue: exchanger.defcnt||0,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="默认积分"
            >
              <a-input-number
                :min="0"
                :precision="0"
                v-decorator="[
                  `defscore`,
                  {
                    initialValue: exchanger.defscore||0,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="设备"
            >
              <span>{{exchanger.devicename}}</span>
              <a-button class="mr10" @click="addDevice">选择设备</a-button>
            </a-form-item>

            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="备注"
            >
              <a-textarea
                :min="0"
                :precision="0"
                v-decorator="[
                  `remark`,
                  {
                    initialValue: exchanger.remark,
                    rules: [
                    ],
                  },
                ]"
              />
            </a-form-item>

            <a-button v-if="showqrcode === false" @click="genqrview"> 生成二维码 </a-button>
            <a-form-item v-if="showqrcode === true" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="积分二维码">
              <span class="tips" >{{ exchanger.qrcode }}</span>
              <img v-if="exchanger.qrcodeurl!==''" :src="exchanger.qrcodeurl"  style="width: 80%" />
            </a-form-item>

            <a-form-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              :colon="false"
              label=""
              style="margin-top: 100px"
            >
              <a-button class="mr10" @click="cancel">取消</a-button>
              <a-button v-if="exchangerid" class="mr10" type="danger" @click="showDelModal">删除</a-button>
              <a-button class="mr10" type="primary" @click="ok">确定 </a-button>
            </a-form-item>
          </a-form>
          </a-tab-pane>
          <!-- <a-tab-pane v-if="exchangerid"
                      key="deviceList"
                      tab="设备列表">
            <a-table
              :columns="columns"
              :row-key="(record) => `${record.id}`"
              :data-source="data"
              :loading="loading"
              :pagination="pagination"
              class="reset-pagination"
              @change="exchangerdeviceChange"
            >

              <template slot="index" slot-scope="text, record, index">
                <span>{{ index + 1 }}</span>
              </template>

              <template slot="operation" slot-scope="text, record">
                <a @click="showDelDeviceModal(record)">删除</a>
              </template>

            </a-table>
          </a-tab-pane> -->

          <a-tab-pane v-if="exchangerid"
                      key="cellList"
                      tab="兑换列表">
         <div class="flex-panel">
      <div v-for="item in cellList"
           :key="item.no"
           class="flex-item mb20">
        <a-card hoverable
                class="reset-padding"
                @click="()=>detail(item)"
                >
          <!-- <img slot="cover"
               :src="item.goods.picurl || defaultImg"
               alt="site" 
               /> -->
          <a-card-meta :title="exchanger.name + '-' + item.no + '号'">
               <template slot="description">
                    <div class="extra mt10">总量：{{ item.size }}</div>
                    <div class="extra">剩余：{{ item.available }}</div>
                    <div class="extra">积分：{{ item.score }}</div>
                      <!-- <a-input-number
                :min="0"
                :max="item.size"
                :precision="0"
                v-model="item.available"
              /> -->

              <!-- <a-button class="mr10" @click="putOnSale(item)">补货</a-button> -->
                  </template>
          </a-card-meta>
        </a-card>
      </div>
    </div>
          </a-tab-pane>
        </a-tabs>
      
        </div>
      </bl-page-wrapper>
    </div>
    <DeviceModal
      v-if="isDeviceModal"
      :data="dids"
      title="添加设备"
      @cancel="handleCancelDevice"
      @ok="handleOkDevice"
    />
  </a-spin>
</template>
<script>
import QRCode from 'qrcode';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
import Mix from '@/mixins';
import DeviceModal from 'viewsPath/taskManage/detail/deviceModal.vue';
const { appAsk, exchangerManageAsk, deviceManageAsk } = service;
const { PageTableCreaterMix } = Mix;
import defaultImg from 'stylesPath/images/goods.jpg';


export default {
  name: 'ExchangerDetail',
  components: {
    DeviceModal,
  },
  mixins: [],
  props: {},
  data() {
    return {
      defaultImg,
      data: {
      },
      showqrcode: false,
      spinning: false,
      form: this.$form.createForm(this),
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      breadcrumbRoutes: [
        {
          name: 'exchangerList',
          breadcrumbName: '全部积分',
        },
        {
          name: 'exchangerDetail',
          breadcrumbName: '积分详情',
        },
      ],
      exchangerid: this.$route.params.exchangerid,
      devices: [],
      exchanger: {},
      isDeviceModal: false,
      defaultActiveKey: 'exchangerDetail',
      isPowerActionModal: false,
      attributes: [],
      poweractions: [
      ],
      exchangerdevice: null,
      thirdconfurl: "https://osimdev.ibroadlink.com/ctuoYqEGqY",
      cellList: []
    };
  },
  computed: {
    ...mapState('app', ['projectInfo']),
    dids: function() {
      return this.devices.map((v) => v.deviceid);
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    if (this.exchangerid) {
      exchangerManageAsk.getExchanger({id: parseInt(this.exchangerid)}).then(res => {
        const { errcode, exchanger = {} } = res.data
        const { cells = [] } = exchanger
        this.exchanger = exchanger

        this.form.setFieldsValue({
            name: this.exchanger.name,
            xsize: this.exchanger.xsize,
            ysize: this.exchanger.ysize,
            remark: this.exchanger.remark,
        })
        this.cellList = new Array(exchanger.xsize * exchanger.ysize)
        for (let i = 0; i < this.cellList.length; i++) {
          this.cellList[i] = {no: i, goods: {}, size:0, available: 0}
        }
        cells.forEach(item => {
          item = {goods: {}, no: 0, size:0,available: 0, ...item}
          this.cellList[item.no] = item
        })
      }).catch(err => {

      })
    }
  },
  methods: {
    putOnSale(item) {
      exchangerManageAsk.putOnSale({exchangerid:parseInt(this.exchangerid), no:item.no, number: item.available})
          .then(res => {})
          .catch(err => {})
    },
    async genqrview() {
      var pdataobjlist = JSON.parse(this.projectInfo.privatedata)
      var qrcodeurl = ""
      pdataobjlist.some(function(pditem) {
        if (pditem.key == "qrcodeurl") {
          qrcodeurl = pditem.value
          return true
        }
      })
      if (qrcodeurl && qrcodeurl != "" ) {
        var param1 = "-accessexchanger"
        var param2 = "id="+this.exchanger.deviceid
        qrcodeurl = qrcodeurl.replace("$$1", param1)
        qrcodeurl = qrcodeurl.replace("$$2", param2)
        this.exchanger.qrcode = qrcodeurl
      } else {
        this.exchanger.qrcode = this.thirdconfurl + "&id=" + this.exchanger.deviceid + "&accesstype=exchanger" + "&pname=" + this.projectInfo.projectname 
      }
      
      this.exchanger.qrcodeurl = await QRCode.toDataURL(this.exchanger.qrcode)
      
      this.showqrcode = true
    },
    detail(item) {
      this.$router.push({name:"exchangerCellDetail", params: {no: item.no}})
    },
    cancelPowerAction() {
      this.isPowerActionModal = false
    },
    confirmPowerAction() {
      this.isPowerActionModal = false
      const { exchangerdevice } = this
      let extend = {}
      try {
        extend = JSON.parse(exchangerdevice.extend) || {}
      } catch (error) {
      }
      try {
        extend.actions = this.poweractions
        exchangerdevice.extend = JSON.stringify(extend)
  
        exchangerManageAsk.modDevice(exchangerdevice)
          .then(res => {})
          .catch(err => {})
      } catch (error) {
        console.error(error)
      }
    },
    showDeviceAction(record) {
      this.exchangerdevice = record
      try {
        let extend = JSON.parse(record.extend)
        this.poweractions = extend.actions || []
      } catch (error) {
        this.poweractions = []
      }
      this.isPowerActionModal = true
    },
    addAction() {
      const { deviceid } = this.exchangerdevice
      this.poweractions.push({deviceid})
    },
    delAction(index) {
      this.poweractions.splice(index, 1)
    },

    exchangerdeviceColumns() {
      const columns = [
        {
          title: '设备名称',
          dataIndex: 'devicename',
          width: '20%',
          align: 'center',
        },

        {
          title: '设备id',
          dataIndex: 'deviceid',
          align: 'center',
        },

        {
          title: '操作',
          dataIndex: 'operate',
          width: '30%',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ];
      return columns;
    },
    // async exchangerdeviceFetchList(params) {
    //   const { search } = this;
    //   params = {
    //     ...params,
    //     exchangerid: parseInt(this.exchangerid)
    //   };
    //   const { errcode, data = {} } = await  exchangerManageAsk.deviceList(params)
    //   const { totalsize = 0, devices=[] } = data;
    //   this.devices = devices
    //   return { total: totalsize, data: devices };
    // },
    changeTab(activeKey) {
      this.defaultActiveKey = activeKey;
      // this.search = '';
      // this.updateSearch(this.search);
    },
    // 取消
    cancel() {
      this.$router.back();
    },
    // 删除确认弹窗
    showDelModal() {
      const that = this;
      this.$confirm({
        title: '确定要删除商品？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          that.del();
        },
        onCancel() {},
      });
    },
        // 删除确认弹窗
    showDelDeviceModal(record) {
      const that = this;
      this.$confirm({
        title: '确定要删除设备？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          that.delDevices(record);
        },
        onCancel() {},
      });
    },
        // 按设备添加
    addDevice() {
      const { devices = [] } = this;
      this.isDeviceModal = true;
    },
    // 删除设备
    delDevices(record) {
      // this.data = Object.assign({}, this.data, { devices });
      exchangerManageAsk.unbindDevice({
        id: record.id
      })
      .then(res => {

      this.exchangerdeviceFetch()
      })
      .catch(err => {})
    },
        // 取消按设备添加
    handleCancelDevice() {
      this.isDeviceModal = false;
    },
    // 确定按设备添加
    handleOkDevice(params = []) {
      params.forEach(item => {
        // exchangerManageAsk.bindDevice({
        //     exchangerid: parseInt(this.exchangerid),
        //     deviceid: item.id, 
        //     devicename: item.displayname
        //   })
        //   .then(res => {

      // this.devices.push({deviceid: item.id, devicename: item.displayname}) 
      this.exchanger.deviceid= item.id
      this.exchanger.devicename= item.displayname 
          // })
          // .catch(err => {})

      });
      this.handleCancelDevice();
    },
    // 确定
    ok() {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
          // 添加
          this.add( fieldsValue);
      });
    },
    // 添加
    add(record) {
      this.spinning = true;
      const params = {
        ...record,
        id: parseInt(this.exchangerid),
        deviceid: this.exchanger.deviceid,
        devicename: this.exchanger.devicename,
      };
      if (this.exchangerid) {
        exchangerManageAsk
        .modExchanger(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'exchangerList' });
            this.spinning = false;
          }
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
      } else {
        exchangerManageAsk
        .newExchanger(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'exchangerList' });
            this.spinning = false;
          }
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
      }
    },
    del() {
      this.spinning = true;
      const { exchangerid } = this;
      const params = {
        ids: [parseInt(exchangerid)],
      };
      exchangerManageAsk
        .delExchanger(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'exchangerList', params: { siteid: this.siteid, deviceid: this.deviceid} });
          }
          this.spinning = false;
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
    },

  },
};
</script>

<style lang="less" scoped>
.tips {
  display: table-cell;
  vertical-align: bottom;
  line-height: 1.5;
  height: 102px;
}

  .flex-panel {
    display: flex;
    flex-wrap: wrap;
    // margin-top: 10px;
      margin-left: 20px;
      margin-right: 20px;
    .flex-item {
      margin-top: 20px;
      margin-right: 20px;
      width: 17%;
    }
  }
  .extra {
    color: @bl-gray-3;
  }
  img {
    border-radius: @bl-border-radius-base;
    object-fit: cover;
    overflow: hidden;
  }
  .location {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
