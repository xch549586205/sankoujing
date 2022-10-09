<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-08 14:35:15
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div style="display: flex">
    <a-range-picker
      v-if="show.indexOf('rangePicker') !== -1"
      :value="rangePicker"
      style="width: 240px"
      @change="changeRangePicker"
    >
      <a-icon slot="suffixIcon" type="smile" />
    </a-range-picker>
    <a-cascader
      v-if="show.indexOf('cascaderOptions') !== -1"
      :options="cascaderOptions"
      :value="cascaderSelected"
      class="component-w-224"
      style="margin-left: 20px"
      placeholder="全部配电箱"
      @change="changeCascader"
    />
    <a-select
      v-if="show.indexOf('gatewayListOption') !== -1"
      :value="gatewaySelected"
      class="component-w-224"
      style="margin-left: 20px"
      placeholder="全部网关"
      @change="changeGateway"
    >
      <a-select-option v-if="!hideAllGateway && gatewayListOption.length" value="">
        全部网关
      </a-select-option>
      <a-select-option v-for="(gateway, i) in gatewayListOption" :key="i" :value="gateway.did">
        {{ gateway.displayname }}
      </a-select-option>
    </a-select>
    <a-select
      v-if="show.indexOf('subDeviceListOption') !== -1"
      :value="subDeviceSelect"
      :filter-option="filterOption"
      option-filter-prop="children"
      class="component-w-224"
      show-search
      style="margin-left: 20px"
      placeholder="全部微断"
      @change="changeSubDevice"
    >
      <a-select-option
        v-if="subDeviceListOption.length && show.indexOf('hideAllDevice') === -1"
        value=""
      >
        全部微断
      </a-select-option>
      <a-select-option v-for="(device, i) in subDeviceListOption" :key="i" :value="device.did">
        {{ device.displayname }}
      </a-select-option>
    </a-select>
    <a-select
      v-if="show.indexOf('onlineOption') !== -1"
      :value="online"
      placeholder="全部状态"
      style="margin-left: 20px"
      class="component-w-224"
      @change="changeOnline"
    >
      <a-select-option value="-1"> 全部状态 </a-select-option>
      <a-select-option value="0"> 离线 </a-select-option>
      <a-select-option value="1"> 在线 </a-select-option>
    </a-select>
    <a-input-search
      v-if="show.indexOf('inputSearch') !== -1"
      :value="inputSearchValue"
      placeholder="搜索微断"
      style="margin-left: 20px"
      class="component-w-224"
      enter-button
      @change="
        (e) => {
          inputSearchValue = e.target.value;
        }
      "
      @search="
        (val) => {
          updateFilters({ inputSearchValue: inputSearchValue });
        }
      "
    />
  </div>
</template>

<script>
import { getCascaderOptions, getDevice, getAllGatewayList } from '@/util.js';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import Fragment from 'vue-fragment';

export default {
  name: 'Filter',
  components: { Fragment },
  props: {
    show: {
      type: Array,
      default: [],
    },
    hideAllGateway: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cascaderOptions: [],
      inputSearchValue: '',
    };
  },
  computed: {
    ...mapState('filters', ['filterParams']),
    subDeviceSelect() {
      return this.filterParams.subDeviceSelect && this.filterParams.subDeviceSelect.length
        ? this.filterParams.subDeviceSelect[0]
        : '';
    },
    cascaderSelected() {
      return this.filterParams.cascaderSelected || [];
    },
    gatewaySelected() {
      return this.filterParams.gatewaySelected && this.filterParams.gatewaySelected.length
        ? this.filterParams.gatewaySelected[0]
        : '';
    },
    gatewayListOption() {
      return this.filterParams.gatewayListOption || [];
    },
    subDeviceListOption() {
      return this.filterParams.subDeviceListOption || [];
    },
    online() {
      return this.filterParams.online || '-1';
    },
    rangePicker() {
      return this.filterParams.rangePicker || [];
    },
  },
  watch: {
    gatewayListOption: {
      async handler(newVal, oldVal) {
        if (newVal && newVal.length && this.hideAllGateway) {
          this.$emit('getGatewayListOption', newVal);
        }
      },
      deep: true,
    },
    gatewaySelected: {
      async handler() {
        await this.getSubDeviceListOption();
        if (this.show.indexOf('selectFirstDevice') === -1) {
          this.updateFilters({ subDeviceSelect: [] });
        } else {
          this.updateFilters({
            subDeviceSelect: this.subDeviceListOption.length
              ? [this.subDeviceListOption[0].did]
              : [],
          });
        }
      },
    },
  },
  async created() {
    const option = await getCascaderOptions();
    this.$emit('emitCascaderOptions', option);
    const cascaderOptions = [
      {
        value: '',
        label: '全部配电箱',
        children: [],
      },
      ...option,
    ];
    this.cascaderOptions = cascaderOptions;
    this.updateFilters({ cascaderOptions: this.cascaderOptions });
    await this.getGatewayListOption();
    await this.getSubDeviceListOption();
    if (this.show.indexOf('selectFirstDevice')) {
      this.updateFilters({
        subDeviceSelect: this.subDeviceListOption.length ? [this.subDeviceListOption[0].did] : [],
      });
    }
    if (this.hideAllGateway) {
      this.changeGateway(this.gatewayListOption[0].did);
      this.updateFilters({ gatewaySelected: [this.gatewayListOption[0].did] });
    }
  },
  destroyed() {
    this.updateFilters('rest');
  },
  async mounted() {
    this.updateFilters({ online: '-1' });
  },
  methods: {
    ...mapMutations('filters', ['updateFilters']),
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },

    async getDeviceListFromGateway(did) {
      const subDeviceListFromGateway = await getDevice({
        privatedata: `%${did}%`,
        devicetype: 'device',
      });
      return subDeviceListFromGateway.deviceInfos;
    },
    async getGatewayListOption(groupid) {
      const gatewayListOption = await getAllGatewayList({ groupid });
      this.updateFilters({ gatewayListOption });
    },
    async getSubDeviceListOption() {
      const promiseList = [];
      if (this.gatewaySelected) {
        promiseList.push(this.getDeviceListFromGateway(this.gatewaySelected));
      } else if (this.gatewayListOption && this.gatewayListOption.length) {
        this.gatewayListOption.map(({ did }) => {
          promiseList.push(this.getDeviceListFromGateway(did));
        });
      }
      const res = await Promise.all(promiseList);
      let subDeviceListOption = [];
      res.map((arr) => {
        if (arr && arr.length) {
          subDeviceListOption = subDeviceListOption.concat(arr);
        }
      });
      this.updateFilters({ subDeviceListOption });
      return subDeviceListOption;
    },

    async changeCascader(value) {
      this.updateFilters({ cascaderSelected: value, gatewaySelected: [] });
      try {
        this.getGatewayListOption(value[1]);
        this.getSubDeviceListOption();
      } catch (error) {
        console.error(error);
      }
    },

    changeRangePicker(rangePicker) {
      this.updateFilters({ rangePicker });
    },

    changeOnline(online) {
      this.updateFilters({ online });
    },

    async changeGateway(value) {
      this.updateFilters({ gatewaySelected: [value] });
    },

    changeSubDevice(subDeviceSelect) {
      this.subDeviceSelect = subDeviceSelect;
      this.updateFilters({ subDeviceSelect: [subDeviceSelect] });
    },

    changeInputSearchValue(value) {
      this.updateFilters({ inputSearchValue: value });
    },
  },
};
</script>

<style lang="less" scoped></style>
