<template>
  <div class="common-container">
    <div :style="{ height: minHeight + 'px', 'min-height': minHeight + 'px' }" class="common-side">
      <SideBar />
    </div>
    <div
      :style="{
        height: minHeight + 'px',
        'min-height': minHeight + 'px',
        'max-height': minHeight + 'px',
      }"
      class="common-content"
    >
      <Topbar />

      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Topbar from './Topbar.vue';
import SideBar from './SideBar.vue';

export default {
  name: 'Main',
  components: {
    Topbar,
    SideBar,
  },
  data() {
    return {};
  },
  computed: {
    minHeight() {
      return this.$store.state.app.window.height;
    },
  },
  created() {},
  mounted() {},
  beforeMount() {},
  methods: {},
};
</script>
<style lang="less" scoped>
.common-container {
  // background: #eef2f5;
}
.common-side {
  display: flex;
  flex-direction: column;
  position: absolute;
  background: #1c2b36;
  width: 200px;
}
.common-content {
  display: flex;
  flex-direction: column;

  margin-left: 200px;
  overflow: auto;
}
</style>
