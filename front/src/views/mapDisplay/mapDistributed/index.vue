<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 10:02:54
 * @LastEditTime: 2021-02-19 11:01:18
 * @LastEditors: Please set LastEditors
 -->
<!-- 数据展示 -->
<template>
  <div>
    <div class="header-panel">
      <bl-header>
        <bl-breadcrumb slot="left" :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
      </bl-header>
    </div>
    <bl-page-wrapper>
      <div slot="content">
        <div class="data-s">
          <BaiduMap/>
        </div>
      </div>
    </bl-page-wrapper>
  </div>
</template>
<script>
import BaiduMap from './../components/baidumap.vue';
export default {
  name: 'MapDistributed',
  components: {
    BaiduMap,
  },
  props: {},
  data() {
    return {
      breadcrumbRoutes: [
        {
          name: '地图分布',
          breadcrumbName: '地图分布',
        },
      ],
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
  methods: {},
};
</script>

<style lang="less" scoped>
.data-s {
  height: 100%;
}
</style>
