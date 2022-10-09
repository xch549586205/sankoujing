<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 11:04:03
 * @LastEditTime: 2021-06-11 14:32:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-spin :spinning="spinning">
    <!-- <div>
         <bl-header>
      <bl-breadcrumb slot="left"
                     :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
      <div slot="right">

      </div>
    </bl-header>
    <bl-page-wrapper>
      <div slot="content"> -->
        <div class="pt20">

            <a-form :form="form" hide-required-mark >

            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="标题"
            >
              <a-input
                v-decorator="[
                  `title`,
                  {
                    initialValue: ticket.title,
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
              :wrapper-col="{span: 100}"
              :colon="false"
              label="站点"
            >
              <a-select class="component-w-108"
                  v-decorator="[
                  `stationid`,
                  {
                    initialValue: ticket.stationid,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
                  >
                <a-select-option v-for="station in stationList"
                           :key="station.id"
                           :value="station.id">
                  {{ station.name}} 
                </a-select-option>
              </a-select>
                
            </a-form-item>
 
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="价格(分)"
            >
              <a-input-number
                v-decorator="[
                  `price`,
                  {
                    initialValue: ticket.price,
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
                    initialValue: ticket.score,
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
              :wrapper-col="{span: 100}"
              :colon="false"
              label="是否显示"
            >
              <a-select class="component-w-108"
                  v-decorator="[
                  `originalprice`,
                  {
                    initialValue: ticket.originalprice,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
                  >
                <a-select-option v-for="ynitem in yesnolist"
                           :key="ynitem.val"
                           :value="ynitem.val">
                  {{ ynitem.name}} 
                </a-select-option>
              </a-select>
                
            </a-form-item>

         <a-form-item
              :label-col="labelCol"
              :wrapper-col="{ span: 10 }"
              :colon="false"
              label="图片"
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
              label="项目描述"
            >
              <a-textarea
                placeholder="请输入内容"
                v-decorator="[
                  'desc',
                  {
                    initialValue: ticket.desc,
                  },
                ]"
              />
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="备注"
            >
              <a-textarea
                placeholder="请输入内容"
                v-decorator="[
                  'remark',
                  {
                    initialValue: ticket.remark,
                  },
                ]"
              />
            </a-form-item>

            <a-button v-if="showqrcode === false" @click="genqrview"> 生成二维码 </a-button>
            <a-form-item v-if="showqrcode === true" :label-col="labelCol" :wrapper-col="{wrapperCol}" :colon="false" label="票据二维码">
              <span class="tips">{{ ticket.qrcode }}</span>
              <img v-if="ticket.qrcodeurl!==''" :src="ticket.qrcodeurl"  style="width: 20%" />
            </a-form-item>

            <a-form-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              :colon="false"
              label=""
              style="margin-top: 100px"
            >
              <a-button class="ml30 mr10" @click="cancel">取消</a-button>
              <a-button v-if="ticketid" class="mr10" type="danger" @click="showDelModal">删除</a-button>
              <a-button class="mr10" type="primary" @click="ok">确定 </a-button>
            </a-form-item>
          </a-form>
              </div>
      <!-- </div>
    </bl-page-wrapper>
    </div> -->
  </a-spin>
</template>
<script>
import QRCode from 'qrcode';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
const { appAsk, ticketManageAsk, locationManageAsk } = service;


export default {
  name: 'TicketDetail',
  components: {
  },
  mixins: [],
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
      yesnolist: [{
        name: '显示',
        val: 1,
      },{
        name: '不显示',
        val: -1,
      }],
      breadcrumbRoutes: [
        {
          name: 'ticketList',
          breadcrumbName: '全部票据',
        },
        {
            name: 'ticketDetail',
            breadcrumbName: '票据详情',
        },
      ],
      ticketid: this.$route.params.ticketid,
      ticket: {},
      previewVisible: false,
      previewImage: '',
      fileList: [],
      defaultfileList: [],
      thirdconfurl: "https://osimdev.ibroadlink.com/ctuoYqEGqY",
      stationList: []
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
    locationManageAsk.siteList({limit:100, offset:1}).then(result => {
          const { errcode, data = {} } = result;
          if (errcode === 200) {
            this.stationList = data.sitelocations;
          }
          this.spinning = false;
        })
  },
  mounted() {
    if (this.ticketid) {
      ticketManageAsk.ticketList({id: parseInt(this.ticketid)}).then(res => {
        const { errcode, tickets = [] } = res.data
        this.ticket = tickets[0] || {}
        console.log(this.ticket)

        this.form.setFieldsValue({
            title: this.ticket.title,
            price: this.ticket.price,
            // icon: this.ticket.icon,
        })
        this.previewImage =  this.ticket.icon
        this.fileList = [
         {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: this.ticket.icon,
          thumbUrl: this.ticket.icon,
        },
        ]
      }).catch(err => {

      })
    }
  },
  methods: {
    addItem() {

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
        var param1 = "-accessticket"
        var param2 = "id="+this.ticket.id
        qrcodeurl = qrcodeurl.replace("$$1", param1)
        qrcodeurl = qrcodeurl.replace("$$2", param2)
        this.ticket.qrcode = qrcodeurl
      } else {
        this.ticket.qrcode = this.thirdconfurl + "&id=" + this.ticket.id + "&accesstype=ticket" + "&pname=" + this.projectInfo.projectname 
      }
      
      this.ticket.qrcodeurl = await QRCode.toDataURL(this.ticket.qrcode)
      
      this.showqrcode = true
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
    cancel() {
      this.$router.push({ name: 'ticketList'})
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
        id: parseInt(this.ticketid),
        icon: this.ticket.icon
      };
      if (this.ticketid) {
        ticketManageAsk
        .modTicket(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'ticketList' });
            this.spinning = false;
          }
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
      } else {
        ticketManageAsk
        .newTicket(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'ticketList' });
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
      const { ticketid } = this;
      const params = {
        ids: [parseInt(ticketid)],
      };
      ticketManageAsk
        .delTicket(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'ticketList', params: { siteid: this.siteid, deviceid: this.deviceid} });
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
            this.ticket.icon = data.url;
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
