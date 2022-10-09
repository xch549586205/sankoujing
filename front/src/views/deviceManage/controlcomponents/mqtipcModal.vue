<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-07-14 17:36:20
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-spin :spinning="spinning">
      <a-form class="reset-form-item-10">
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :label="deviceInfo.did"
        >
          <a-row :gutter="10">
            <a-input-search
              enter-button="获取播放源"
              size="large"
              @change="
                (e) => {
                  inputChange(deviceInfo.did, e.target.value);
                }
              "
              @search="(e)=>{devControl(deviceInfo.did, e)}"
            />
          </a-row>
        </a-form-item>
      </a-form>
      <p>控制结果</p>
      <p @click="showstream()"> {{ cmdres }} </p>
    </a-spin>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
let Base64 = require('js-base64').Base64;

const { deviceManageAsk, productManageAsk } = service;
export default {
  name: 'CentralControlModal',
  components: {},
  props: {
    isSingle: {
      type: Boolean,
      default: true,
    },
    deviceInfo: Object,
    formatAttributes: Array
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      spinning: false,
      isbatchcontrol: false,
      deviceStatus: {},
      cmdres: 'NO RESULT',
      ipcmap: new Map(),
    };
  },
  computed: {
    ...mapState('app', ['projectInfo']),
    ...mapState('deviceManage', [ 'valueType']),
    // 选中按钮
    setStatus() {
      return function (key, val) {
        const statusmap = this.isbatchcontrol ?
          this.deviceInfo.statusmapvirtual : this.deviceInfo.statusmap;
        this.deviceStatus = statusmap;
        console.log('statusmap', statusmap, this.deviceInfo);
        if (statusmap && statusmap[key]) {
          return statusmap[key].value === val ? 'primary' : null;
        }
        return null;
      };
    },
  },
  watch: {},
  created() {
    console.log('deviceInfo:', this.deviceInfo);
  },
  mounted() {},
  methods: {
    ...mapMutations('deviceManage', ['updateDevice']),
    showstream() {
      console.log('showstream ----------');
      window.open(this.cmdres);
    },
    onChangeSwitch(e) {
      console.log(e, this.isbatchcontrol);
      this.deviceInfo.statusmapvirtual = JSON.parse(JSON.stringify(this.deviceInfo.statusmap))
    },
    devControlBatch() {
      const devctrs = [];
      const controldata = {};
      const statusmap = this.deviceInfo.statusmapvirtual;
      const id = this.deviceInfo.id;
      const that = this;
      this.spinning = true;
      const { isSingle } = this;
      // 判断是否是集中控制
      console.log('statusmap', statusmap);
      for (let index in this.formatAttributes) {
        let item = this.formatAttributes[index];
        if (
          statusmap[item.key] != undefined &&
          statusmap[item.key].value != undefined
        ) {
          controldata[item.key] = `${statusmap[item.key].value}`;
        }
      }
      devctrs.push({
        did: id,
        data: controldata,
      });
      const params = {
        devctrs,
      };

      deviceManageAsk
        .devControl(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            that.cmdres = data.responses;
            console.log('cmdres:', that.cmdres);
          }
          this.spinning = false;
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
    },
    inputipcChange(key, val) {
      console.log('inputipcChange', key, val);
    },
    async devAddipc(key, val) {
      console.log('devAddipc', key, val);
      const projectid = this.projectInfo.id;
      const { errcode, data = {} } = await productManageAsk.getProduct({
        projectid: projectid + '',
      });

      console.log('productManageAsk', data);
      let prodid = '';
      let prodpf = '';
      for (let off = 0; off < data.productsinfo.length; off++) {
        console.log('data.productsinfo[off].productname', data.productsinfo[off].productname);
        if (data.productsinfo[off].productname == 'mqtipc') {
          prodid = data.productsinfo[off].id;
          prodpf = data.productsinfo[off].platform;
          break;
        }
      }
      const ipcitem = this.ipcmap.get(key);
      const ipcobj = JSON.parse(ipcitem);
      const ipv4 = ipcobj.discentry.ipv4;
      const ipv4list = ipv4.split('.');
      let ipv4str = '';
      for (let off = 0; off < ipv4list.length; off++) {
        ipv4str += ipv4list[off];
      }
      const pridata = {
        'auth': val
      };
      const pridatastr = JSON.stringify(pridata);
      const base64str = Base64.encode(pridatastr);

      const devobj = {
        'productid': prodid,
        'did': ipv4str,
        'displayname': `mqtipc${ipv4str}`,
        'privatedata': base64str, //'eyJhdXRoIjoiYWRtaW46TFFYRUZLIn0=',
        'platform': prodpf
      };
      console.log('devobj:', devobj);
      try {
        await deviceManageAsk.addDevice(devobj);
      } catch (error) {
        console.log('error', error);
      }
    },
    inputChange(key, val) {
      console.log('this.deviceInfo', this.deviceInfo, key, val);
      // this.updateDevice(deviceInfo);
    },
    // 控制设备
    devControl(key, val) {
      const that = this;
      this.spinning = true;
      const did = this.deviceInfo.id;
      console.log('this.deviceInfo', this.deviceInfo, key, val);
      const pdata = this.deviceInfo.privatedata;
      const devid = this.deviceInfo.did;
      const base64str = Base64.decode(pdata);
      console.log('pdata.base64str', base64str);
      const pobj = JSON.parse(base64str);
      const { isSingle } = this;
      // 判断是否是集中控制
      const dids = isSingle ? [did] : did;
      const cmdkey = 'ffmpeg';
      const cmdparam = `${devid} ${pobj.auth}`;
      const controldata = {
        'cmd': 'fetchstream',
        'fscmd': cmdkey,
        'fsparam': cmdparam,
      };
      const devctrs = dids.map((v) => ({
        did: v,
        data: controldata,
      }));

      const params = {
        devctrs,
      };

      deviceManageAsk
        .devControl(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            params.devctrs[0].data.cmd = 'querystreamurl';
            deviceManageAsk
              .devControl(params)
              .then((result) => {
                const { errcode, data } = result;
                this.$message.success('操作成功！');
                console.log('devcontrol :', result);
                console.log('data.responses[0].result :', data.responses[0].result);
                const jsonstr = JSON.parse(data.responses[0].result);
                const jsonobj = JSON.parse(jsonstr);
                that.cmdres = jsonobj.msgstream;
                console.log('that.cmdres :', that.cmdres);
              })
              .catch((e) => {
                this.spinning = false;
                console.error(e);
              });
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
.extra {
  text-align: center;
  height: 1px;
  background: #efefef;
}
.batchcontrol{
  width: 500px;
}
</style>
