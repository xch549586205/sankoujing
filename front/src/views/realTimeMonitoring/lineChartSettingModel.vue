<template>
  <a-modal :visible="visible" title="展示设置" @ok="handleOk" @cancel="handleCancel">
    <p>选择用电告警需统计的参数（最多2个）</p>
    <a-checkbox-group v-model="checked" :options="list" @change="onChange" />
  </a-modal>
</template>
<script>
import { showList } from './util';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    checkedList: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
  },
  data() {
    return {
      list: showList.map((list) => list.name),
      checked: [],
    };
  },
  created() {
    this.checked = this.checkedList;
  },
  methods: {
    onChange(checked) {
      if (checked.length > 2) {
        this.$message.error('最多选择2个');
      } else {
        this.checked = checked;
      }
    },
    handleCancel(e) {
      this.$emit('setShowModal', false);
    },
    handleOk(e) {
      this.$emit('setCheckedList', this.checked);
      this.$emit('setShowModal', false);
    },
  },
};
</script>
<style scoped>
.check {
  margin: 5px 0;
}
</style>
