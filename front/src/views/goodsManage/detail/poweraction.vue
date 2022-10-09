<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-31 10:37:49
 * @LastEditTime: 2021-01-29 16:55:26
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-row :gutter="5">
      <!-- <a-col :span="6">
        <div class="label-input">{{ devFactor.devicename }}</div>
      </a-col>
      <a-col :span="1"
             style="text-align:center">
        --
      </a-col> -->
      <a-col :span="4">
        <a-select v-model="action.triggermethod"
                  @change="(val)=>setMethod(val,true)">
          <a-select-option v-for="item in formatAttributes"
                           :key="item.key"
                           :value="item.key">{{ item.text }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="1"
             style="text-align:center">
        --
      </a-col>

      <!-- <template v-if="action.triggertype==='3'">
        <a-col :span="4">
          <a-select v-model="action.trend"
                    @change="(val)=>{setFactor({trend:val})}">
            <a-select-option v-for="item in trendArray"
                             :key="item.value"
                             :value="item.value">{{ item.text }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="1"
               style="text-align:center">
          --
        </a-col>
      </template> -->

      <a-col :span="4">
        <a-select v-model="action.triggervalue"
                  @change="(val)=>{setFactor({triggervalue:val})}">
          <a-select-option v-for="item in valueRange"
                           :key="item.value"
                           :value="`${item.value}`">{{ item.text }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="2"
             style="text-align:center">
        断电动作
      </a-col>
    
      <a-col :span="4">
        <a-select v-model="action.domethod"
                  @change="(val)=>setDoMethod(val,true)">
          <a-select-option v-for="item in formatAttributes"
                           :key="item.key"
                           :value="item.key">{{ item.text }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="1"
             style="text-align:center">
        --
      </a-col>
      <a-col :span="4">
        <a-select v-model="action.dovalue"
                  @change="(val)=>{setFactor({dovalue:val})}">
          <a-select-option v-for="item in valueRange2"
                           :key="item.value"
                           :value="`${item.value}`">{{ item.text }}</a-select-option>
        </a-select>
      </a-col>

    </a-row>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
  import service from 'servicePath/index';

  const { deviceManageAsk } = service;

  export default {
    name: 'Factor',
    components: {},
    mixins: [],
    props: {
      factor: {
        type: Object,
        default: () => {},
      },
      index: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        devFactor: this.factor,
        attributes: [],
        status: {},
        isStatusModal: false,
        valueRange: [],
        valueRange2: [],
      };
    },
    computed: {
      ...mapState('timeLinkage', ['trendArray']),
      ...mapState('deviceManage', ['valueType']),
       ...mapState('app', ['projectInfo']),

      // 设备的触发条件
      action() {
        return this.factor || {};
      },

      // 格式化产品属性
      formatAttributes() {
        const { attributes = [], valueType } = this;
        if (attributes) {
          const newAttributes = attributes.map(v => {
            const { valuetype } = v;
            const item = {
              text: v.displayname,
              key: v.openproxy,
              valuetype,
              status: [],
            };
            // 枚举 | 字符串
            if (valuetype === valueType.enum || item.valuetype === valueType.string) {
              v.openvalue = v.openvalue.replace(/，/g, ',');
              v.openname = v.openname.replace(/，/g, ',');
              const values = (v.openvalue && v.openvalue.split(',')) || [];
              const texts = (v.openname && v.openname.split(',')) || [];
              item.status = values.map((k, index) => ({ text: texts[index] || k, value: k }));
            }
            // 连续型
            if (valuetype === valueType.range) {
              const range = (v.openvalue && v.openvalue.split('-')) || [];
              if (range) {
                item.min = parseInt(range[0]);
                item.max = parseInt(range[1]);
                item.step = 1;
              }
            }
            return item;
          });
          console.log(newAttributes);
          return newAttributes;
        }
        return [];
      },
    },
    watch: {
      formatAttributes(newVal, oldVal) {
        if (newVal !== oldVal && newVal.length > 0) {
          const { action = {} } = this;
          this.setMethod(action.triggermethod || newVal[0].key, false);
          this.setDoMethod(action.domethod || newVal[0].key , false)
        }
      },
      factor(newVal, oldVal) {
        if (newVal && oldVal && newVal.length != oldVal) {
          const { deviceid } = newVal;
          this.getDeviceAttributes(deviceid)
        }
      }
    },
    created() {
    },
    mounted() {
      const { deviceid } = this.factor;
      this.getDeviceAttributes(deviceid)
    },
    destroyed() {},
    methods: {
      // 设置属性,flag表示是否为手动切换属性
      setMethod(val, flag) {
        const { formatAttributes, action } = this;
        const selected = formatAttributes.filter((v, index) => v.key === val)[0];
        console.log(selected);
        if (selected) {
          const map = {
            triggermethod: val,
            triggertype: selected.valuetype,
            triggervalue: flag ? null : action.triggervalue || null,
            trend: flag ? -1 : action.trend ||  -1,
          };
          this.setFactor(map);
        }
        this.getValueRange();
      },
      setDoMethod(val, flag) {
        const { formatAttributes, action } = this;
        const selected = formatAttributes.filter((v, index) => v.key === val)[0];
        console.log(selected);
        if (selected) {
          const map = {
            domethod: val,
            dovalue:flag ? null : action.dovalue || null,
          };
          this.setFactor(map);
        }
        this.getValueRange2();
      },
      // 设置触发条件
      setFactor(map) {
        console.log(map);
        const { actions = [] } = this.devFactor;
        actions[0] = {
          ...this.action,
          ...map,
        };
        const devFactor = {
          ...this.devFactor,
          actions,
        };
        this.devFactor = Object.assign({}, this.devFactor, devFactor);
        this.$emit('update:factor', devFactor);
      },
      // 生成连续型取值范围
      getValueRange() {
        let range = [];
        const { formatAttributes, devFactor, valueType, action } = this;
        const { triggermethod } = devFactor;
        const selected = formatAttributes.filter(v => v.key === triggermethod)[0];
        if (selected) {
          if (selected.valuetype === valueType.enum || selected.valuetype === valueType.string) {
            // 枚举型 | 字符串
            const { status = [] } = selected;
            range = status.map(v => ({ value: v.value, text: v.text }));
          }
          if (selected.valuetype === valueType.range) {
            // 连续型
            const { min, max } = selected;
            for (let i = min; i <= max; i += 1) {
              range.push({
                value: i,
                text: i,
              });
            }
            this.setFactor({ trend: action.trend || this.trendArray[0].value });
          }
        }
        if (range.length > 0) {
          this.setFactor({ triggervalue: `${action.triggervalue || range[0].value}` });
        }
        this.valueRange = range;
      },
      getValueRange2() {
        let range = [];
        const { formatAttributes, devFactor, valueType, action } = this;
        const { domethod } = devFactor;
        const selected = formatAttributes.filter(v => v.key === domethod)[0];
        if (selected) {
          if (selected.valuetype === valueType.enum || selected.valuetype === valueType.string) {
            // 枚举型 | 字符串
            const { status = [] } = selected;
            range = status.map(v => ({ value: v.value, text: v.text }));
          }
          if (selected.valuetype === valueType.range) {
            // 连续型
            const { min, max } = selected;
            for (let i = min; i <= max; i += 1) {
              range.push({
                value: i,
                text: i,
              });
            }
          }
        }
        if (range.length > 0) {
          this.setFactor({ dovalue: `${action.triggervalue || range[0].value}` });
        }
        this.valueRange2 = range;
      },
      // // 查询属性
      // getProductAttributes() {
      //   console.log(this.devFactor);
      //   const { productid } = this.devFactor;
      //   const params = {
      //     productid,
      //     projectid:this.projectInfo.id+""
      //   };
      //   deviceManageAsk
      //     .getProductAttributes(params)
      //     .then(result => {
      //       const { errcode, data = {} } = result;
      //       if (errcode === 200) {
      //         const { attributes = [] } = data;
      //         this.attributes = attributes;
      //       }
      //     })
      //     .catch(e => {
      //       console.error(e);
      //     });
      // },
      getDeviceAttributes(deviceid) {
      deviceManageAsk.getDevice({
        id: deviceid
      }).then(resp => {
        console.log(resp)
        const { deviceInfos = [] } = resp.data
        const device = deviceInfos[0] || {}
        const { productid } = device;
        const params = {
          productid,
          projectid:this.projectInfo.id+""
        };
        deviceManageAsk
          .getProductAttributes(params)
          .then(result => {
            const { errcode, data = {} } = result;
            if (errcode === 200) {
              const { attributes = [] } = data;
              this.attributes = attributes;
            }
          })
          .catch(e => {
            console.error(e);
          });
      })
    },
    },
  };
</script>

<style lang="less" scoped>
</style>
