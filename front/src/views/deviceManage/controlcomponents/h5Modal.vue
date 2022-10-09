<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-02-05 10:52:59
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
       <iframe class="myiframe" v-if="productInfo.h5url" :src="productInfo.h5url+'?data='+deviceInfo.privatedata" frameborder="0"></iframe>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';

const { deviceManageAsk } = service;
export default {
  name: 'CentralControlModal',
  components: {},
  props: {
    deviceInfo:Object,
    productInfo:Object,
    formatAttributes:Array,
  },
  data() {
    return {};
  },
  computed: {
    
  },
  watch: {},
  created() {

    console.log("productInfo",this.productInfo)
    console.log("h5url",this.h5url)
    this.devControl()
  },
  mounted() {},
  methods: {
        // 控制设备
    devControl() {
      this.spinning = true;
      const did = this.deviceInfo.id;
      var controldata = {};
      const devctrs =[{
        did: did,
        data: controldata,
      }]

      const params = {
        devctrs,
      };

      deviceManageAsk
        .devControl(params)
        .then((result) => {
          const { errcode } = result;
          if (errcode === 200) {
            // this.$message.success('操作成功！');
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
  .myiframe{
    width: 800px;
    height: 600px;
  }
</style>
