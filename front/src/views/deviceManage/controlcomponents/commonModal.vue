<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-07-15 16:33:49
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-spin :spinning="spinning">
      <a-form class="reset-form-item-10">
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          label="批量控制"
          style="margin-bottom: 0px"
        >
          <a-switch v-model="isbatchcontrol"
                    default-checked
                    @change="onChangeSwitch" />
        </a-form-item>
        <template v-for="(item, index) in formatAttributes">
          <a-form-item
            v-if="item.valuetype === valueType.range"
            :key="`${item.key}${index}`"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :label="item.text"
            style="margin-bottom: 0px"
          >
            <a-slider
              :marks="{ [item.min]: item.min, [item.max]: item.max }"
              :max="item.max"
              :min="item.min"
              :step="item.step"
              v-model="deviceStatus[item.key].value"
              @change="
                (val) => {
                  isbatchcontrol?inputChange(item.key, val):devControl(item.key, val);
                }
              "
            />
          </a-form-item>

          <a-form-item
            v-else-if="item.valuetype === valueType.string"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :key="`${item.key}${index}`"
            :label="item.text"
          >
            <a-row :gutter="10">
              <a-input-search
                v-if="!isbatchcontrol"
                enter-button="控制"
                size="large"
                @change="
                  (e) => {
                    inputChange(item.key, e.target.value);
                  }
                "
                @search="(e)=>{devControl(item.key, e)}"
              />
              <a-input
                v-else
                size="large"
                @change="
                  (e) => {
                    inputChange(item.key, e.target.value);
                  }
                "
              />
            </a-row>
          </a-form-item>
          <a-form-item
            v-else
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :key="`${item.key}${index}`"
            :label="item.text"
          >
            <a-row :gutter="10">
              <a-col v-for="v in item.status"
                     :span="4"
                     :key="`${v.value}`">
                <a-button
                  :type="setStatus(item.key, v.value)"
                  class="reset-btn"
                  @click="
                    () => {
                      isbatchcontrol?inputChange(item.key, v.value):devControl(item.key, v.value);
                    }
                  "
                >
                  {{ v.text }}
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>

        </template>
      </a-form>
      <a-button v-if="isbatchcontrol"
                class="batchcontrol"
                type="primary"
                @click="devControlBatch">批量控制</a-button>
      <div>
        <p>控制结果</p>
        <template v-for="(mapitem, mapind) in ipcmap">
          {{ "mapitem:" + mapitem[0] }}
          <!-- <span v-for="ipcdata in mapitem"> {{ "mapitem:" + ipcdata }} </span> -->
          <a-form-item
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :key="`${mapind}`"
            :label="mapitem[0]"
          >
            <a-row :gutter="10">
              <a-input-search
                enter-button="增加设备"
                size="large"
                @change="
                  (e) => {
                    inputipcChange(mapitem[0], e.target.value);
                  }
                "
                @search="(e)=>{devAddipc(mapitem[0], e)}"
              />
            </a-row>
          </a-form-item>
        </template>
        <!-- <p> {{ cmdres }} </p> -->
      </div>
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
    console.log('formatAttributes:', this.formatAttributes);
  },
  mounted() {},
  methods: {
    ...mapMutations('deviceManage', ['updateDevice']),
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
        'did': ipv4,
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
      const did = this.deviceInfo.did;
      var statusmapvirtual = this.deviceInfo.statusmapvirtual;  
      console.log('this.deviceInfo', this.deviceInfo, key, val);
      if (statusmapvirtual == undefined) {
        statusmapvirtual = {};
      }
      if (statusmapvirtual[key] == undefined) {
        statusmapvirtual[key] = { value: '' };
      }
      statusmapvirtual[key].value = val;
      const deviceInfo = { ...this.deviceInfo, statusmapvirtual };
      console.log('deviceInfo', deviceInfo);
      this.updateDevice(deviceInfo);
    },
    // 控制设备
    async devControl(key, val) {
      this.spinning = true;
      const did = this.deviceInfo.id;
      let statusmap = this.deviceInfo.statusmap;
      console.log('this.deviceInfo', this.deviceInfo, key, val);
      if (statusmap == undefined) {
        statusmap = {};
      }
      if (statusmap[key] == undefined) {
        statusmap[key] = {};
      }
      // hex是特殊给礼品机用的，可能需要进行转换
      // 礼品机厂家要求，除了头AA和尾0A外，所有的字符都要变成ASCII的HEX
      let sendval = val;
      if (key === 'hex') {
        sendval = 'AA';
        for (let i = 2; i < val.length - 2; i += 1) {
          console.log(val.charCodeAt(i));
          sendval += val.charCodeAt(i).toString(16);
        }
        sendval += '0A';
      }
      const that = this;
      const status = statusmap;
      statusmap[key].value = sendval;
      const deviceInfo = { ...this.deviceInfo, status };
      this.updateDevice(deviceInfo);
      
      const daparams = { 'offset': 1, 'limit': 15, 'seq': 1 };
      const { errcode, data = {} } = await deviceManageAsk.getDevice({
        ...daparams,
        displayname: 'mqtipc',
      });
      console.log('devicemanage list:', data);
      const mqtipclist = data.deviceInfos;

      const { isSingle } = this;
      // 判断是否是集中控制
      const dids = isSingle ? [did] : did;
      const controldata = {};
      controldata[key] = `${sendval}`;
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
            this.$message.success('操作成功！');
            that.cmdres = data.responses;
            // console.log('cmdres:', that.cmdres);
            // console.log('this.deviceInfo:', that.deviceInfo);
            // 如果是ipc设备，需要解析
            const cindex = that.deviceInfo.displayname.indexOf('mqtipc');
            if (cindex >= 0) {
              const jsonobj = JSON.parse(data.responses[0].result);
              // console.log('jsonobj:', jsonobj);
              for (let objkey in jsonobj) {
                const ipcitemobj = JSON.parse(jsonobj[objkey]);
                const keyval = ipcitemobj.discentry.ipv4;
                console.log("objkey: ", objkey, "jsonparse:", JSON.parse(jsonobj[objkey]), "keyval:", keyval);
                let isexist = false
                if (mqtipclist) {
                  for (let ind=0; ind<mqtipclist.length; ind++) {
                    if (mqtipclist[ind].did == keyval) {
                      isexist = true;
                      break;
                    }
                  }
                }
                if (!isexist) {
                  that.ipcmap.set(keyval, jsonobj[objkey]);
                }
                
              };
            }
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
