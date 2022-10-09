<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-10 15:10:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-modal
      title="地图"
      v-model="isModal"
      :mask-closable="false"
      :width="700"
      :footer="null"
      ok-text="确定"
      cancel-text="取消"
      @cancel="cancel"
    >
      <baidu-map
        :center="center"
        :zoom="20"
        :scroll-wheel-zoom="true"
        @dragging="true"
        @dblclick="createPoint"
        class="map"
      >
        <bm-control :offset="{ width: 120, height: 10 }">
          <a-button type="primary" @click="savePoint">保存</a-button>
          <a-alert message="双击地图创建标志点" type="info" show-icon />
          <a-alert message="拖动标志点修改定位" type="info" show-icon />
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
          <bm-marker v-if="marker"  @dragend="dragend" :dragging="true" :position="{ lng: marker.lng, lat: marker.lat }"></bm-marker>
      </baidu-map>
    </a-modal>
  </div>
</template>
<script>
import screenfull from 'screenfull';
import BaiduMap from 'vue-baidu-map';
import Vue from 'vue';
Vue.use(BaiduMap, {
  ak: '5ff3ffc4092bcefa1da71b1ee7cba36e',
  // 我自己申请的钥匙 ak 'QFgFQorrB84maOZh0pPGC8kUiP0mGIhx'
});
export default {
  props:{
    pointInfo:Object
  },
  data() {
    return {
      center: {
        //经纬度
        lng: 118.829246,
        lat: 32.043219,
      },
      zoom: 15, //地图展示级别
      isModal: true,
      marker: null,
      
    };
  },
  created() {
    console.log("this.pointInfo",this.pointInfo)
    if (this.pointInfo && this.pointInfo.longitude && this.pointInfo.latitude){
      this.marker = {
        lng:this.pointInfo.longitude,
        lat:this.pointInfo.latitude
      }
    }
    console.log(" this.marker", this.marker)
  },
  methods: {
    savePoint(){
      this.$emit('savePoint',this.marker);
      this.$emit('cancel');

    },

    cancel() {
      this.$emit('cancel');
    },
    createPoint(e){
      console.log("createPoint",e,e.Ag,e.Ag.lng,e.Ag.lat)
      this.marker = e.Ag
    },
    dragend(e){
      console.log("dragend",e,e.Ag,e.Ag.lng,e.Ag.lat)
      this.marker = e.Ag
    }
  },
};
</script>

<style scoped>
.map {
  opacity: 0.9;
  margin-bottom: 50px;
  height: 650px;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgb(20, 120, 214);
}
</style>