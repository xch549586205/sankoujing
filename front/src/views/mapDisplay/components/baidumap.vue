<!--百度地图-->
<template>
  <baidu-map :center="center" :zoom="20" :scroll-wheel-zoom="true" @dragging="dragging" class="map">
    <bm-control :offset="{ width: 120, height: 10 }">
      <a-button type="primary" @click="setScreenfull">全屏显示</a-button>
    </bm-control>
    <!-- 控件将定位到地图的右上角 -->
    <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
    <!-- 平移缩放组件 -->
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
    <!-- 缩略图 -->
    <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
    <!-- 定位 -->
    <bm-geolocation
      anchor="BMAP_ANCHOR_BOTTOM_LEFT"
      :showAddressBar="true"
      :autoLocation="true"
    ></bm-geolocation>
    <bm-map-type
      :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
      anchor="BMAP_ANCHOR_TOP_LEFT"
    ></bm-map-type>
    <!-- 示例位置 -->
    <template v-for="item in deviceInfos">
      <bm-marker
        v-bind:key="item.id"
        :position="item"
        :data-item="item"
        animation="BMAP_ANIMATION_BOUNCE"
    
        @click="infoWindowOpen(item)"
      >
        <!-- <bm-label
              content="IHG"
              :labelStyle="{ color: 'red', fontSize: '24px' }"
              :offset="{ width: -35, height: 30 }"
            /> -->
      </bm-marker>
    </template>
    <ControlModalAdapter v-if="isShowInfo" :isHome="true" @cancel="cancelControlModal" />

    <!-- <bm-info-window :position="windowInfo" :show="isShowInfo" @close="infoWindowClose">
      <a-descriptions title="设备信息" bordered>
        <a-descriptions-item label="名称" :span="3">{{
          windowInfo.displayname
        }}</a-descriptions-item>
        <a-descriptions-item label="安装时间" :span="2">{{
          windowInfo.installdate
        }}</a-descriptions-item>
        <a-descriptions-item label="最后上报时间" :span="2">
          {{ windowInfo.lastreport }}
        </a-descriptions-item>
        <a-descriptions-item label="设备状态">
          <div v-bind:key="key" v-for="(value, key) in windowInfo.statusmap">
            {{ value.name_cn + ':' + value.value_cn }}
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </bm-info-window> -->
  </baidu-map>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

import screenfull from 'screenfull';
import BaiduMap from 'vue-baidu-map';
import Vue from 'vue';
import service from 'servicePath/index';
import ControlModalAdapter from 'viewsPath/deviceManage/detail/ControlModalAdapter.vue';

const { dataDisplayAsk, deviceManageAsk } = service;
Vue.use(BaiduMap, {
  ak: '5ff3ffc4092bcefa1da71b1ee7cba36e',
  // 我自己申请的钥匙 ak 'QFgFQorrB84maOZh0pPGC8kUiP0mGIhx'
});
export default {
  components: {
    ControlModalAdapter,
  },
  data() {
    return {
      center: {
        //经纬度
        lng: 118.829246,
        lat: 32.043219,
      },
      windowInfo: {},
      zoom: 15, //地图展示级别
      isShowInfo: false,
      deviceInfos: [],
    };
  },
  created() {
    this.deviceFetchList();
  },
  methods: {
    ...mapMutations('deviceManage', ['updateDevice']),
    cancelControlModal() {
      this.isShowInfo = false;
    },
    setScreenfull() {
      const element = document.querySelector('.map');
      if (!screenfull.isEnabled) {
        // 如果不允许进入全屏，发出不允许提示
        this.$message({
          message: '暂不不支持全屏',
          type: 'warning',
        });
        return false;
      }
      screenfull.toggle(element);
    },
    dragging(type, target, pixel, point) {
      console.log('type, target, pixel, point', type.Ag);
      type.Ag;
    },

    infoWindowClose() {
      //弹框关闭
      this.isShowInfo = false;
    },

    infoWindowOpen(e) {
      //弹框打开
      this.updateDevice(e);
      this.windowInfo = e;
      console.log(this.windowInfo);
      this.isShowInfo = true;
    },

    // 请求数据
    async deviceFetchList() {
      const { errcode, data = {} } = await deviceManageAsk.getDevice({ a: 1 });
      var { deviceInfos = [] } = data;
      var averageLng = 0;
      var averageLat = 0;
      var totalCount = 0
      for (var item of deviceInfos) {
        item.lng = item.longitude;
        item.lat = item.latitude;
        item.installdate = this.$moment(item.installdate).format(this.GLOBAL.TIME_FOEMAT);
        item.lastreport = this.$moment(item.lastreport).format(this.GLOBAL.TIME_FOEMAT);
        if (!isNaN(item.lng)) {
          totalCount++
          averageLng += parseFloat(item.lng);
          averageLat += parseFloat(item.lat);
        }
      }
      if (totalCount != 0) {
        averageLng = averageLng /totalCount;
        averageLat = averageLat /totalCount;
        console.log("averageLng",averageLng)
        console.log("averageLat",averageLat)

        var centerPoint = {
          lng:0,
          lat:0
        }
        var minNum = averageLng+averageLat
        for (var item of deviceInfos) {
          let a = Math.abs(averageLng -  parseFloat(item.lng))+Math.abs(averageLat -  parseFloat(item.lat))
          if (a<minNum){
            minNum = a
            centerPoint.lng = parseFloat(item.lng)
            centerPoint.lat = parseFloat(item.lat)
          }
        }
        console.log("centerPoint",centerPoint)
        this.center = centerPoint
      }
      this.deviceInfos = deviceInfos;
    },
  },
};
</script>

<style scoped>
.map {
  opacity: 0.9;
  /* margin-bottom: 50px; */
  height: 800px;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgb(20, 120, 214);
}
</style>