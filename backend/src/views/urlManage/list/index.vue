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
      <div slot="header" class="header-panel">
        <bl-header>
          <span slot="left" class="title">全部URL</span>
          <div slot="right">
            <a-select v-model="projectid" class="component-w-224" @change="handelChange">
              <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                {{ item.projectname }}
              </a-select-option>
            </a-select>
            <a-button type="primary" class="ml10" @click="add">添加URL</a-button>
          </div>
        </bl-header>
      </div>

      <div slot="content">
        <a-tabs :default-active-key="defaultActiveKey" @change="changeTab">
          <a-tab-pane key="1" tab="api列表"> </a-tab-pane>
          <a-tab-pane key="2" tab="网页列表" force-render> </a-tab-pane>
        </a-tabs>
        <a-table
          :columns="columns"
          :row-key="record => record.id"
          :data-source="data"
          :loading="loading"
          :pagination="pagination"
          class="reset-pagination"
          @change="urlChange"
        >
          <template slot="index" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
          <template slot="h5url" slot-scope="text, record, index">
            <span>{{ record.h5url ? '有' : '无' }}</span>
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

const { urlManageAsk } = service;
const { PageTableCreaterMix } = Mix;
export default {
  name: 'URLList',
  components: {
    EditModal,
  },
  mixins: [PageTableCreaterMix('url')],
  props: {},
  data() {
    return {
      projectid: null,
      isEditModal: false,
      defaultActiveKey: '1',
    };
  },
  computed: {
    ...mapState('projectManage', ['projectList', 'currentProjectid']),
    status() {
      return parseInt(this.defaultActiveKey);
    },
  },
  watch: {
    projectid(newVal, oldVal) {
      if (oldVal === null) {
        this.urlFetch();
      }
    },
  },
  async created() {
    await this.setProjectList();
    const { projectList } = this;
    if (this.currentProjectid == 0 || this.currentProjectid == undefined) {
      this.setCurrentProjectid(projectList[0].id);
    }
    this.projectid = this.currentProjectid;
  },
  mounted() {},
  methods: {
    ...mapMutations('projectManage', ['setCurrentProjectid']),

    ...mapActions('projectManage', ['setProjectList']),
    init() {
      this.pagination.current = 1;
      this.urlFetch();
    },
    // 切换
    handelChange(val) {
      this.setCurrentProjectid(val);
      this.init();
    },
    // 表头
    urlColumns() {
      const columns = [
        {
          title: '序号',
          dataIndex: 'index',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '名称',
          dataIndex: 'urlname',
          width: '20%',
          align: 'center',
        },
        {
          title: 'URL',
          dataIndex: 'urlpath',
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
      ];
      return columns;
    },
    // 添加URL
    add() {
      this.current = {
        projectid: this.projectid,
        status: this.status,
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
    },
    // 删除弹窗
    handleDel() {
      this.urlFormatPagination('del');
      this.urlFetch();
      this.handleCancel();
    },
    // 确认弹窗
    handleOk() {
      const { id } = this.current;
      if (!id) {
        // 添加
        this.urlFormatPagination('add');
      }
      this.urlFetch();
      this.handleCancel();
    },
    changeTab(activeKey) {
      console.log(activeKey);
      this.defaultActiveKey = activeKey;
      this.urlFetch();
    },
    // 请求数据
    async urlFetchList(params) {
      const { projectid } = this;
      const { errcode, data = {} } = await urlManageAsk.getUrlsite({
        ...params,
        pid: `${projectid}`,
        status: this.status,
      });
      return { total: data.totalsize, data: data.alist };
    },
  },
};
</script>

<style lang="less" scoped></style>
