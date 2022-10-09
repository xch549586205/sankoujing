<template>
  <div class="content-header">
    <div class="left">
      <slot name="left"> </slot>
    </div>
    <div class="right">
      <slot name="right"> </slot>
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
      return {
        temp: '',
      };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {},
  };
</script>
<style lang="less">
  .content-header {
    .title {
      color: rgba(56, 56, 56, 1);
      font-size: 14px;
    }
  }
</style>

<style lang="less" scoped>
  .content-header {
    background: #eef2f5;
    display: flex;
    height: 50px;
    box-sizing: border-box;
    align-items: center;
    .left {
      display: inline-block;
      flex: 1;
    }
    .right {
      display: inline-block;
      flex: 2;
    }
    .left {
      font-size: 16px;
    }
    .right {
      text-align: right;
    }
  }
</style>
