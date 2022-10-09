<template>
  <div
    :style="{ height: minHeight + 'px', 'min-height': minHeight + 'px', flexDirection: 'column' }"
    class="content-panel"
  >
    <slot name="header"></slot>
    <slot name="content"></slot>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'PageWrapper',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    minHeight() {
      return this.$store.state.app.window.height - 50;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped></style>
