<template>
  <a-modal :visible="visible" title="展示设置" @ok="handleOk" @cancel="handleCancel">
    <p>选择用电告警需统计的参数（最多16个）</p>
    <a-checkbox-group v-model="checkedList" :options="list" @change="onChange" />
  </a-modal>
</template>
<script>
import { warningList } from '../main/util';

function dedupe(array) {
  return Array.from(new Set(array));
}
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    checkedList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      list: dedupe(warningList.map((warn) => warn.group)),
    };
  },

  methods: {
    onChange(e) {
      this.checkedList = e;
    },
    handleCancel() {
      this.$emit('setShowModal', false);
    },
    handleOk() {
      this.$emit('setShowModal', false);
      this.$emit('setCheckedList', this.checkedList);
    },
  },
};
</script>
<style scoped>
.check {
  margin: 5px 0;
}
</style>
