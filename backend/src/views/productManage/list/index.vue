<template>
  <div>
    <bl-page-wrapper>
      <div class="header-panel" slot="header">
        <bl-header>
          <span slot="left" class="title">全部产品</span>
          <div slot="right">
            <a-select v-model="projectid" class="component-w-224" @change="doSearch">
              <a-select-option key="0" value="0">
                公共项目
              </a-select-option>
              <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                {{ item.projectname }}
              </a-select-option>
            </a-select>
            <a-select
              v-model="categoryid"
              :default-value="-1"
              class="component-w-224"
              @change="doSearch"
            >
              <a-select-option key="0" :value="0">
                全部类型
              </a-select-option>
              <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-input-search
              v-model.trim="search"
              placeholder="输入产品名称搜索"
              style="margin:0 10px;"
              class="component-w-224"
              enter-button
              @search="doSearch"
            />
            <a-button type="primary" @click="add">添加产品</a-button>
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
          @change="appChange"
        >
          <template slot="index" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
          <template slot="productname" slot-scope="text, record, index">
            <a-tag v-if="record.projectid != projectid" color="#108ee9">
              公共项目
            </a-tag>
            <span>{{ text }}</span>
          </template>

          <template slot="h5url" slot-scope="text, record, index">
            <span>{{ record.h5url ? '有' : '无' }}</span>
          </template>
          <template slot="operation" slot-scope="text, record">
            <a v-if="record.projectid == projectid" @click="edit(record)">编辑</a>
            <a v-else @click="edit(record)">查看</a>
          </template>
        </a-table>
      </div>
    </bl-page-wrapper>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';
import Mix from '@/mixins';

const { productManageAsk } = service;
const { PageTableCreaterMix } = Mix;
export default {
  name: 'DeviceList',
  components: {},
  mixins: [PageTableCreaterMix('app')],
  props: {},
  data() {
    return {
      categoryid: 0,
      search: '',
      projectid: null,
    };
  },
  computed: {
    ...mapState('productManage', ['categoryList']),
    ...mapState('projectManage', ['projectList', 'currentProjectid']),
  },
  async created() {
    await this.setProjectList();
    const { projectList } = this;
    if (this.currentProjectid == undefined) {
      this.setCurrentProjectid(projectList[0].id);
    }
    this.projectid = this.currentProjectid;
    await this.setCategoryList({ projectid: this.projectid + '' });
  },
  watch: {
    projectid(newVal, oldVal) {
      console.log('========', newVal);
      this.data = [];
      if (oldVal === null) {
        this.appFetch();
      }
    },
  },
  mounted() {},
  methods: {
    ...mapActions('productManage', ['setCategoryList']),
    ...mapActions('projectManage', ['setProjectList']),
    ...mapMutations('projectManage', ['setCurrentProjectid']),
    init() {
      console.log('init');
      this.setCategoryList({ projectid: this.projectid + '' });

      this.pagination.current = 1;
      this.appFetch();
    },
    // 表头
    appColumns() {
      const columns = [
        {
          title: '序号',
          dataIndex: 'index',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '产品品类',
          dataIndex: 'categoryname',
          align: 'center',
        },
        {
          title: '产品名称',
          dataIndex: 'productname',
          align: 'center',
          scopedSlots: { customRender: 'productname' },
        },
        {
          title: '产品型号',
          dataIndex: 'productversion',
          align: 'center',
        },
        {
          title: 'H5',
          dataIndex: 'h5url',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'h5url' },
        },
        {
          title: '操作',
          dataIndex: 'operate',
          width: '10%',
          align: 'left',
          scopedSlots: { customRender: 'operation' },
        },
      ];
      return columns;
    },
    doSearch() {
      this.setCurrentProjectid(this.projectid);
      this.init();
    },
    // 添加产品
    add() {
      console.log({ projectid: this.projectid });
      this.$router.push({ name: '添加产品', query: { projectid: this.projectid } });
    },
    // 编辑产品
    edit(record) {
      console.log({ id: record.id, projectid: this.projectid });
      this.$router.push({ name: '产品详情', query: { id: record.id, projectid: this.projectid } });
    },
    // 请求数据
    async appFetchList(params) {
      const { categoryid, projectid, search } = this;
      if (projectid == null) {
        return;
      }
      const { errcode, data = {} } = await productManageAsk.getProduct({
        ...params,
        categoryid,
        productname: search,
        projectid: (projectid || 0) + '',
      });
      return { total: data.totalsize, data: data.productsinfo };
    },
  },
};
</script>

<style lang="less" scoped></style>
