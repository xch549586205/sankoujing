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
      <a-col :span="6">
        <div class="label-input">{{ devFactor.devicename }}</div>
      </a-col>
      <a-col :span="1"
             style="text-align:center">
        --
      </a-col>
      <a-col :span="5">
        <a-select v-model="action.attrmethod"
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

      <template v-if="action.valuetype==='3'">
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
      </template>

      <a-col :span="4">
        <a-select v-model="action.attrvalue"
                  @change="(val)=>{setFactor({attrvalue:val})}">
          <a-select-option v-for="item in valueRange"
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
        attributes: [],
        devFactor: this.factor,
        status: {},
        isStatusModal: false,
        valueRange: [],
      };
    },
    computed: {
      ...mapState('timeLinkage', ['trendArray']),
      ...mapState('deviceManage', ['valueType']),
       ...mapState('app', ['projectInfo']),

      // ?????????????????????
      action() {
        const { actions = [] } = this.devFactor;
        return actions[0] || {};
      },
      // ??????????????????
      getDevicePlaceholder() {
        const { devFactor } = this;
        return `${devFactor.displayname}`;
      },
      // ?????????????????????
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
            // ?????? | ?????????
            if (valuetype === valueType.enum || item.valuetype === valueType.string) {
              v.openvalue = v.openvalue.replace(/???/g, ',');
              v.openname = v.openname.replace(/???/g, ',');
              const values = (v.openvalue && v.openvalue.split(',')) || [];
              const texts = (v.openname && v.openname.split(',')) || [];
              item.status = values.map((k, index) => ({ text: texts[index] || k, value: k }));
            }
            // ?????????
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
          this.setMethod(action.attrmethod || newVal[0].key, false);
        }
      },
    },
    created() {
      const { productid } = this.devFactor;
      console.log("factor")
      this.getProductAttributes({ productid });
    },
    mounted() {},
    destroyed() {},
    methods: {
      // ????????????,flag?????????????????????????????????
      setMethod(val, flag) {
        const { formatAttributes, action } = this;
        const selected = formatAttributes.filter((v, index) => v.key === val)[0];
        console.log(selected);
        if (selected) {
          const map = {
            attrmethod: val,
            attrname: selected.text,
            valuetype: selected.valuetype,
            attrvalue: flag ? null : action.attrvalue || null,
            trend: flag ? -1 : action.trend || -1,
          };
          this.setFactor(map);
        }
        this.getValueRange();
      },
      // ??????????????????
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
      // ???????????????????????????
      getValueRange() {
        let range = [];
        const { formatAttributes, devFactor, valueType, action } = this;
        const { attrmethod } = devFactor.actions[0];
        const selected = formatAttributes.filter(v => v.key === attrmethod)[0];
        if (selected) {
          if (selected.valuetype === valueType.enum || selected.valuetype === valueType.string) {
            // ????????? | ?????????
            const { status = [] } = selected;
            range = status.map(v => ({ value: v.value, text: v.text }));
          }
          if (selected.valuetype === valueType.range) {
            // ?????????
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
          this.setFactor({ attrvalue: `${action.attrvalue || range[0].value}` });
        }
        this.valueRange = range;
      },
      // ????????????
      getProductAttributes() {
        console.log(this.devFactor);
        const { productid } = this.devFactor;
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
      },
    },
  };
</script>

<style lang="less" scoped>
</style>
