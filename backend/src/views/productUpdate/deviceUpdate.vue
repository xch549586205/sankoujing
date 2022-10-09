<template>
  <div>
    666
  </div>
</template>


<script>
  export default {
    name: 'DeviceUpdate',
    components: {},
    props: {},
    data() {
      return {};
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
      add() {
        this.$router.push({ path: 'editionDetail' });
      },
      tabsChange(targetKey) {
        if (this.$router.currentRoute.path.indexOf(targetKey) === -1) {
          this.$router.push({ path: targetKey });
        }
      },
    },
  };
</script>

<style lang="less" scoped>
</style>
