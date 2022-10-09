<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-14 15:38:17
 * @LastEditTime: 2019-08-21 17:42:38
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <bl-page-wrapper>
      <div class="header-panel" slot="header">
        <bl-header>
          <span slot="left" class="title">全部平台</span>
          <div slot="right">
            <a-button type="primary" class="ml10" @click="add">添加平台</a-button>
          </div>
        </bl-header>
      </div>
      <div slot="content">
        <a-table
          :columns="columns"
          :row-key="record => record.id"
          :data-source="data"
          :loading="loading"
          :pagination="pagination"
          class="reset-pagination"
        >
          <template slot="index" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
          <template slot="operation" slot-scope="text, record">
            <a @click="edit(record)">编辑</a>
          </template>
        </a-table>
      </div>
    </bl-page-wrapper>
    <EditModal
      v-if="isEditModal"
      :data="current"
      @cancel="handleCancel"
      @del="handleDel"
      @ok="handleOk"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';
import Mix from '@/mixins';
import EditModal from './editModal.vue';

const { platformManageAsk } = service;
const { PageTableCreaterMix } = Mix;
export default {
  name: 'URLList',
  components: {
    EditModal,
  },
  mixins: [PageTableCreaterMix('platform')],
  props: {},
  data() {
    return {
      data: [],
      projectid: null,
      isEditModal: false,
      searchInfo: {
        limit: 20,
        offset: 1,
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '名称',
          dataIndex: 'name',
          width: '20%',
          align: 'center',
        },
        {
          title: '编码',
          dataIndex: 'code',
          width: '20%',
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operate',
          align: 'center',
          width: '10%',
          scopedSlots: { customRender: 'operation' },
        },
        {
          title: '',
          dataIndex: 'hide',
          align: 'center',
          scopedSlots: { customRender: 'hide' },
        },
      ],
    };
  },
  computed: {
    ...mapState('projectManage', ['projectList']),
  },
  watch: {
    projectid(newVal, oldVal) {
      if (oldVal === null) {
        this.platformFetchList();
      }
    },
  },
  async created() {},
  mounted() {},
  methods: {
    init() {
      this.pagination.current = 1;
      this.platformFetchList();
    },
    // 切换
    handelChange(val) {
      this.init();
    },

    // 添加URL
    add() {
      this.current = {
        projectid: this.projectid,
        status: 2,
      };
      this.isEditModal = true;
    },
    // 编辑URL
    edit(record) {
      this.current = {
        ...record,
        projectid: this.projectid,
      };
      this.isEditModal = true;
    },
    // 取消弹窗
    handleCancel() {
      this.isEditModal = false;
      this.platformFetchList();
    },
    // 删除弹窗
    handleDel() {
      this.handleCancel();
    },
    // 确认弹窗
    handleOk() {
      const { id } = this.current;
      this.handleCancel();
    },
    // 请求数据
    async platformFetchList(params) {
      const { errcode, data = {} } = await platformManageAsk.getPlatform(this.searchInfo);
      this.data = data.list;
      return { total: data.totalsize, data: data.list };
    },
  },
};
</script>

<style lang="less" scoped></style>
