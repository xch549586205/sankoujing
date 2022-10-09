<template>
  <a-modal :visible="visible" title="展示设置" @ok="handleOk" @cancel="handleCancel">
    <p>选择用电告警需统计的参数（最多6个）</p>
    <a-checkbox-group v-model="checkedList" :options="paramsfilter" @change="onChange" />
  </a-modal>
</template>
<script>
export default {
  props: {
    paramsfilter: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    selectParams: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
  },
  data() {
    return {
      checkedList: [],
    };
  },
  created() {
    this.checkedList = this.selectParams;
  },
  methods: {
    onChange(e) {
      if (e.length > 6) {
        // return;
      }
      this.checkedList = e.filter((e, index) => index < 6);
    },
    handleCancel() {
      this.$emit('setShowModal', false);
    },
    handleOk() {
      this.$emit('setShowModal', false);
      this.$emit('setParamsfilter', this.checkedList);
    },
  },
};
</script>
<style scoped>
.check {
  margin: 5px 0;
}
</style>
