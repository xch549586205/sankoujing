<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-02-19 11:31:12
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div v-if="!isHome">
    该设备暂不支持控制
  </div>
   <div v-else>
      <a-descriptions title="设备信息" bordered>
        <a-descriptions-item label="名称" :span="3">{{
          deviceInfo.displayname
        }}</a-descriptions-item>
        <a-descriptions-item label="安装时间" :span="2">{{
          deviceInfo.installdate
        }}</a-descriptions-item>
        <a-descriptions-item label="最后上报时间" :span="2">
          {{ deviceInfo.lastreport }}
        </a-descriptions-item>
        <a-descriptions-item label="设备状态">
          <div v-bind:key="key" v-for="(value, key) in deviceInfo.statusmap">
            {{ value.name_cn + ':' + value.value_cn }}
          </div>
        </a-descriptions-item>
      </a-descriptions>
  </div>
</template>
<script>
export default {
  name: 'unSupportModal',
  components: {},
  props: {
    isHome:Boolean,
    deviceInfo:Object
  },
  data() {
    return {};
  },
  computed: {
    
  },
  watch: {},
  created() {

  },
  mounted() {},
  methods: {
  },
};
</script>

<style lang="less" scoped>
</style>
