<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 10:02:54
 * @LastEditTime: 2021-02-19 10:15:54
 * @LastEditors: Please set LastEditors
 -->
<!-- 数据展示 -->
<template>
  <bl-page-wrapper class="chart-content">
    <div slot="content">
      <div style="padding: 30px 0">
        <NumberList />
      </div>
      <div class="data-o">
        <ProceduresUsing />
        <DataSta />
        <DeviceBroken />

        <DeviceUsing />
      </div>
      <div class="data-o2">
        <Scene/>
        <Linkage/>
        <Time/>
      </div>
    </div>
  </bl-page-wrapper>
</template>
<script>
import service from 'servicePath/index';
import { mapGetters, mapMutations } from 'vuex';
import ProceduresUsing from './../components/proceduresUsing.vue';
import DataSta from './../components/dataSta.vue';
import SiteSta from './../components/siteSta.vue';
import NumberList from './../components/numberList.vue';
import DeviceUsing from './../components/deviceUsing.vue';
import DeviceBroken from './../components/deviceBroken.vue';
import Scene from './../components/scene.vue';
import Linkage from './../components/linkage.vue';
import Time from './../components/time.vue';

const { dataDisplayAsk,deviceManageAsk } = service;
export default {
  name: 'DataPresentation',
  components: {
    ProceduresUsing,
    DataSta,
    SiteSta,
    DeviceUsing,
    DeviceBroken,
    NumberList,
    Scene,
    Linkage,
    Time,
  },
  props: {},
  data() {
    return {
      
    };
  },
  computed: {
    minHeight() {
      return this.$store.state.app.window.height - 120;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
   
  },
};
</script>

<style lang="less" scoped>
.chart-content {
  background-color: #efefef;
}
.data-o {
  height: 340px;
  display: flex;
  justify-content: space-between;
}
.data-o2 {
  margin-top: 30px;
  height: 400px;
  display: flex;
  justify-content: space-between;
}
.data-s {
  margin-top: 30px;

  height: 540px;
}

</style>
