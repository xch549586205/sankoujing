<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-08 14:35:15
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="content-header">
    <div class="left">
      <slot name="left">
      </slot>
    </div>
    <div class="right">
      <slot name="right">
      </slot>
    </div>
  </div>
</template>

<script>
  // import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'HeaderPanel',
    components: {},
    props: {},
    data() {
      return {};
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {},
  };
</script>

<style lang="less" scoped>
  .content-header {
    //去掉头部背景颜色
    // background: #efefef;
    padding: 10px 20px;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    .left {
      display: inline-block;
      flex: 9;
    }
    .right {
      display: inline-block;
      flex: 24;
    }
    .left {
      font-size: @bl-font-weight-base;
    }
    .right {
      text-align: right;
    }
  }
</style>
