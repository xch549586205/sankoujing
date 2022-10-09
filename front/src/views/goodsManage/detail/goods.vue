<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 11:04:03
 * @LastEditTime: 2021-06-02 14:38:32
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
          <a-tab-pane key="goodsDetail"
                      tab="商品详情">
            <a-form :form="form" hide-required-mark >

            <!-- <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="商品id"
            >
              <a-input
                v-decorator="[
                  `id`,
                  {
                    initialValue: goods.id,
                  },
                ]"
                :disabled="true"
              />
            </a-form-item> -->
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="商品标题"
            >
              <a-input
                v-decorator="[
                  `title`,
                  {
                    initialValue: goods.title,
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
              :wrapper-col="{ span: 10 }"
              :colon="false"
              label="商品图片"
            >
              <a-upload
                :file-list="fileList"
                :default-file-list="defaultfileList"
                :before-upload="beforeUpload"
                :remove="handleRemove"
                list-type="picture-card"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传照片</div>
                </div>
              </a-upload>
              <span class="tips">
                <!-- <span>图片大小:{{ GLOBAL.ICON_IMG_WIDTH }}*{{ GLOBAL.ICON_IMG_HEIGHT }}px</span>
                <br /> -->
                <span>文件格式:jpg或png</span>
              </span>
              <a-modal
                :visible="previewVisible"
                :footer="null"
                :width="500"
                @cancel="handleCancelModal"
              >
                <img :src="previewImage" alt="big" style="width: 95%" />
              </a-modal>
            </a-form-item>

            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="商品价格"
            >
              <a-input-number
                v-decorator="[
                  `price`,
                  {
                    initialValue: goods.price,
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
              label="服务时间"
            >
              <a-input-number
                :min="0"
                :precision="0"
                v-decorator="[
                  `duration`,
                  {
                    initialValue: goods.duration,
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
              label="积分"
            >
              <a-input-number
                :min="0"
                :precision="0"
                v-decorator="[
                  `score`,
                  {
                    initialValue: goods.duration,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
            <a-button v-if="showqrcode === false" @click="genqrview"> 生成二维码 </a-button>
            <a-form-item v-if="showqrcode === true" :label-col="labelCol" :wrapper-col="{wrapperCol}" :colon="false" label="商品二维码">
              <span class="tips">{{ goods.qrcode }}</span>
              <img v-if="goods.qrcodeurl!==''" :src="goods.qrcodeurl"  style="width: 20%" />
            </a-form-item>
            <!-- <a-form-item
              v-if="goodsid"
              :label-col="labelCol"
              :wrapper-col="{ md: { span: 20 } }"
              :colon="false"
              label="设备列表"
            >
              <div>
                <a-button type="primary" @click="addDevice">添加设备</a-button>
              </div>
              <div v-if="devices && devices.length > 0" class="tag-box mt10">
                <div v-for="(item, index) in devices" :key="item.deviceid" class="tag">
                  <a-row>
                    <a-col :span="22">
                      {{ `${item.devicename}-(${item.deviceid})` || '' }}
                    </a-col>
                    <a-col :span="2">
                      <a-icon
                        type="close-circle"
                        class="extra-icon cursor error"
                        @click="delDevices(item, index)"
                      />
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-form-item> -->

            <a-form-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              :colon="false"
              label=""
              style="margin-top: 100px"
            >
              <a-button class="mr10" @click="cancel">取消</a-button>
              <a-button v-if="goodsid" class="mr10" type="danger" @click="showDelModal">删除</a-button>
              <a-button class="mr10" type="primary" @click="ok">确定 </a-button>
            </a-form-item>
          </a-form>
          </a-tab-pane>
          <a-tab-pane v-if="goodsid"
                      key="deviceList"
                      tab="设备列表">
            <a-table
              :columns="columns"
              :row-key="(record) => `${record.id}`"
              :data-source="data"
              :loading="loading"
              :pagination="pagination"
              class="reset-pagination"
              @change="goodsdeviceChange"
            >

              <template slot="index" slot-scope="text, record, index">
                <span>{{ index + 1 }}</span>
              </template>

              <template slot="operation" slot-scope="text, record">
                <!-- <a @click="showDeviceAction(record)">断电设置</a>
                <a-divider type="vertical" /> -->
                <a @click="showDelDeviceModal(record)">删除</a>
              </template>

              <!-- <template slot="powertrigger" slot-scope="text, record">
                <span>{{ text }}</span>
        {
          title: '自动断电',
          dataIndex: 'powertrigger',
          width: '30%',
          align: 'center',
          scopedSlots: { customRender: 'powertrigger' },
        },
              </template> -->
            </a-table>
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

    <a-modal v-model="isPowerActionModal"
             :mask-closable="false"
             :width="600"
             :footer="null"
             title="执行操作"
             @cancel="cancelPowerAction">

      <a-form :form="form"
              hide-required-mark
              style="width:940px;">
              <div>
              <a-button @click="addAction(false)">添加
              </a-button>
              <div v-for="(item,index) in poweractions"
                   :key="`${item.deviceid}${Math.random()}`"
                   class="mtb10">
                <a-row>
                  <a-col :span="12">
                    <power-action-modal :factor="item" />
                  </a-col>
                  <a-col :span="2">
                    <a-icon type="close-circle"
                            class="extra-icon cursor error input-icon"
                            @click="delAction(index)" />
                  </a-col>
                </a-row>

              </div>
              </div>

            <div class="modal-footer-btn mt20">
              <a-button @click="cancelPowerAction">取消</a-button>
              <a-button class="ml10"
                        type="primary"
                        @click="confirmPowerAction">确定
              </a-button>
            </div>
      </a-form>
    </a-modal>
  </a-spin>
</template>
<script>
import QRCode from 'qrcode';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
import Mix from '@/mixins';
import DeviceModal from 'viewsPath/taskManage/detail/deviceModal.vue';
import PowerActionModal from './poweraction'
const { appAsk, goodsManageAsk, deviceManageAsk } = service;
const { PageTableCreaterMix } = Mix;


export default {
  name: 'GoodsDetail',
  components: {
    DeviceModal,
    PowerActionModal
  },
  mixins: [PageTableCreaterMix('goodsdevice')],
  props: {},
  data() {
    return {
      data: {
      },
      showqrcode: false,
      spinning: false,
      form: this.$form.createForm(this),
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      breadcrumbRoutes: [
        {
          name: 'goodsList',
          breadcrumbName: '全部商品',
        },
      ],
      goodsid: this.$route.params.goodsid,
      devices: [],
      goods: {},
      isDeviceModal: false,
      defaultActiveKey: 'goodsDetail',
      isPowerActionModal: false,
      attributes: [],
      poweractions: [
      ],
      goodsdevice: null,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      thirdconfurl: "https://osimdev.ibroadlink.com/ctuoYqEGqY",
      defaultfileList: []
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
    if (this.goodsid) {
      goodsManageAsk.goodsList({id: parseInt(this.goodsid)}).then(res => {
        const { errcode, goodss = [] } = res.data
        this.goods = goodss[0] || {}

        this.form.setFieldsValue({
            title: this.goods.title,
            price: this.goods.price,
            duration: this.goods.duration,
            score: this.goods.score,
        })
        if (this.goods.picurl) {
        this.previewImage =  this.goods.picurl
        this.fileList = [
         {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: this.goods.picurl,
          thumbUrl: this.goods.picurl,
        },
        ]
        }
      }).catch(err => {

      })
    }
  },
  methods: {
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
        var param1 = "-accessgood"
        var param2 = "id="+this.goods.id
        qrcodeurl = qrcodeurl.replace("$$1", param1)
        qrcodeurl = qrcodeurl.replace("$$2", param2)
        this.goods.qrcode = qrcodeurl
      } else {
        this.goods.qrcode = this.thirdconfurl + "&id=" + this.goods.id + "&accesstype=good" + "&pname=" + this.projectInfo.projectname 
      }
      
      this.goods.qrcodeurl = await QRCode.toDataURL(this.goods.qrcode)
      
      this.showqrcode = true
    },
    cancelPowerAction() {
      this.isPowerActionModal = false
    },
    confirmPowerAction() {
      this.isPowerActionModal = false
      console.log("poweraction", this.poweractions)
      const { goodsdevice } = this
      let extend = {}
      try {
        extend = JSON.parse(goodsdevice.extend) || {}
      } catch (error) {
      }
      try {
        extend.actions = this.poweractions
        goodsdevice.extend = JSON.stringify(extend)
  
        goodsManageAsk.modDevice(goodsdevice)
          .then(res => {})
          .catch(err => {})
      } catch (error) {
        console.error(error)
      }
    },
    showDeviceAction(record) {
      this.goodsdevice = record
      try {
        let extend = JSON.parse(record.extend)
        this.poweractions = extend.actions || []
      } catch (error) {
        this.poweractions = []
      }
      this.isPowerActionModal = true
    },
    addAction() {
      const { deviceid } = this.goodsdevice
      this.poweractions.push({deviceid})
    },
    delAction(index) {
      this.poweractions.splice(index, 1)
    },

    goodsdeviceColumns() {
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
    async goodsdeviceFetchList(params) {
      const { search } = this;
      params = {
        ...params,
        goodsid: parseInt(this.goodsid)
      };
      const { errcode, data = {} } = await  goodsManageAsk.deviceList(params)
      const { totalsize = 0, devices=[] } = data;
      this.devices = devices
      return { total: totalsize, data: devices };
    },
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
      goodsManageAsk.unbindDevice({
        id: record.id
      })
      .then(res => {

      this.goodsdeviceFetch()
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
        console.log(item)
        goodsManageAsk.bindDevice({
            goodsid: parseInt(this.goodsid),
            deviceid: item.id, 
            devicename: item.displayname
          })
          .then(res => {

      this.devices.push({deviceid: item.id, devicename: item.displayname}) 
          })
          .catch(err => {})

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
        id: parseInt(this.goodsid),
        picurl: this.goods.picurl,
      };
      if (this.goodsid) {
        goodsManageAsk
        .modGoods(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'goodsList' });
            this.spinning = false;
          }
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
      } else {
        goodsManageAsk
        .newGoods(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'goodsList' });
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
      const { goodsid } = this;
      const params = {
        ids: [parseInt(goodsid)],
      };
      goodsManageAsk
        .delGoods(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'goodsList', params: { siteid: this.siteid, deviceid: this.deviceid} });
          }
          this.spinning = false;
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
    },

        handleCancelModal() {
      this.previewVisible = false;
    },
    // 预览
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {},
    // 删除文件
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.data.picurl = '';
    },
    // 手动上传文件
    async beforeUpload(file) {
      const isValid = await this.checkFile(file);
      if (isValid) {
        const url = await this.handleUpload(file);
        file.url = url;
        this.fileList = [...this.fileList, file];
      }
      return false;
    },
    // 检查文件有效性
    async checkFile(file) {
      const { GLOBAL } = this;
      const types = ['image/png', 'image/jpeg'];
      const { type, size } = file;
      console.log(file);
      const isType = types.includes(type);
      if (!isType) {
        this.$message.error('请上传jpg或png格式文件!');
      }
      const isSize = size / 1024 / 1024 <= 2;
      if (!isSize) {
        this.$message.error('文件大小不能超过2MB!');
      }
      // const isValid = await this.checkImageWH(file, GLOBAL.ICON_IMG_WIDTH, GLOBAL.ICON_IMG_HEIGHT);
      const isValid = true
      return isType && isSize && isValid;
    },
    // 检查图片尺寸
    async checkImageWH(file, width, height) {
      const that = this;
      return new Promise((resolve, reject) => {
        const filereader = new FileReader();
        filereader.onload = (e) => {
          const src = e.target.result;
          const image = new Image();
          image.onload = function () {
            if ((width && this.width != width) || (height && this.height != height)) {
              that.$message.warning(`请上传尺寸为${width}*${height}的图片`);
              reject();
            } else {
              resolve(true);
            }
          };
          image.onerror = reject;
          image.src = src;
        };
        filereader.readAsDataURL(file);
      });
    },
    // 上传图片
    handleUpload(file) {
      const { GLOBAL } = this;
      const formData = new FormData();
      formData.append('foldertype', GLOBAL.FOLDER_TYPE.sitelocation);
      formData.append('upfile', file);
      return appAsk
        .uploadPic(formData)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.goods.picurl= data.url;
            return data.url;
          }
          return '';
        })
        .catch((e) => {
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
</style>
