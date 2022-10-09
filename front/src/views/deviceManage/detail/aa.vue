<!--
 * @Author: your name
 * @Date: 2021-01-29 15:43:35
 * @LastEditTime: 2021-06-02 14:32:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front\src\views\deviceManage\detail\baseInfo.vue
-->
<template>
  <div>
    <a-form
      class="reset-form-item reset-form-item-label"
      style="width: 800px; padding-bottom: 20px"
    >
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="所属网关">
        <span>{{ device.displayname }}</span>
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :colon="false"
        label="所属配电箱"
      >
        <span>{{ device.did }}</span>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="所属分组">
        <span>{{ device.devicetype }}</span>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="添加账号">
        <span>{{ device.longandlat }}</span>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="添加时间">
        <span>{{ device.installdate }}</span>
      </a-form-item>
      <a-button
        v-if="isChargingdev === false"
        @click="deleteDevice"
        type="danger"
        :style="{ marginTop: '48px' }"
      >
        删除设备
      </a-button>
    </a-form>
  </div>
</template>
<script>
import QRCode from 'qrcode';
import { mapState, mapMutations } from 'vuex';
import service from 'servicePath/index';

const { deviceManageAsk } = service;
export default {
  name: 'BaseInfo',
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      id: this.$route.params.id,
      device: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      isChargingdev: false,
      hasChargingport: false,
      thirdconfurl: 'https://osimdev.ibroadlink.com/ctuoYqEGqY',
    };
  },
  computed: {
    ...mapState('productManage', ['devicetypeList']),
    ...mapState('deviceManage', ['renderDeviceList']),
    ...mapState('app', ['running', 'projectInfo']),
  },
  watch: {},
  created() {
    this.getDevice();
  },
  mounted() {},
  destroyed() {},
  methods: {
    deleteDevice() {
      this.$confirm({
        title: '确定删除该设备吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          const delList = [this.device.id];
          deviceManageAsk.delDevice({ dids: delList });
          this.$router.back();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    async genqrview() {
      var pdataobjlist = JSON.parse(this.projectInfo.privatedata);
      var qrcodeurl = '';
      pdataobjlist.some(function (pditem) {
        if (pditem.key == 'qrcodeurl') {
          qrcodeurl = pditem.value;
          return true;
        }
      });

      if (qrcodeurl && qrcodeurl != '') {
        var param1 = '-accessdevice';
        var param2 = 'id=' + this.device.id;
        qrcodeurl = qrcodeurl.replace('$$1', param1);
        qrcodeurl = qrcodeurl.replace('$$2', param2);
        this.device.devqrcode = qrcodeurl;
      } else {
        this.device.devqrcode =
          this.thirdconfurl +
          '&id=' +
          this.device.id +
          '&accesstype=device' +
          '&pname=' +
          this.projectInfo.projectname;
      }

      this.device.devqrcodeurl = await QRCode.toDataURL(this.device.devqrcode);
      //充电口二维码
      // let portqrcodelist = new Array(0)
      // for (let i=1; i<=10; i++) {
      //   let portqrcode = this.thirdconfurl + "&id=" + this.device.id + "&param=pwr" + i.toString()
      //   let dataurl = await QRCode.toDataURL(portqrcode)
      //   var qritem = {
      //     protqrcode: portqrcode,
      //     dataurl: dataurl,
      //   }

      //   portqrcodelist.push(qritem)

      //   // QRCode.toCanvas(document.getElementById('canvas'+i.toString()), portqrcode, function (error) {
      //   //   if (error) {
      //   //     console.error(error);
      //   //   }
      //   // })
      // }
      // this.device.portqrcodelist = portqrcodelist
      this.isChargingdev = true;
      // this.hasChargingport = true
      // console.log("portqrcodelist : ", this.device.portqrcodelist)
      // }
    },
    // 查询设备详情
    async getDevice() {
      const { id } = this;
      const device = this.renderDeviceList.filter((r) => r.id === id)[0];
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
      for (const item of this.devicetypeList) {
        if (item.key == device.devicetype) {
          device.devicetype = item.name;
        }
      }

      this.device = device;
    },
  },
};
</script>

<style lang="less" scoped></style>
