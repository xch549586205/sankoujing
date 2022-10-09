<template>
  <div>
    <bl-page-wrapper>
      <div class="header-panel" slot="header">
        <bl-header>
          <bl-breadcrumb slot="left" :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
          <div v-show="defaultActiveKey === 'whiteList'" slot="right">
            <a-select v-model="blackIptype" class="component-w-224" @change="handleChange">
              <a-select-option :key="0" :value="0">
                全部名单
              </a-select-option>
              <a-select-option
                v-for="item in blackListStatus"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </a-select-option>
            </a-select>
            <a-button slot="right" class="ml10" type="primary" @click="add">添加名单</a-button>
          </div>
        </bl-header>
      </div>
      <div v-if="!id" slot="content">
        <div class="tab-panel">
          <router-view class="plr20"></router-view>
        </div>
      </div>
      <div v-if="id" slot="content">
        <div class="tab-panel">
          <a-tabs :default-active-key="defaultActiveKey" @change="changeTab">
            <a-tab-pane key="baseInfo" tab="基本信息"> </a-tab-pane>
            <a-tab-pane key="frontSet" tab="前端设置"> </a-tab-pane>
            <a-tab-pane key="projectBackup" tab="项目备份"> </a-tab-pane>
            <a-tab-pane key="whiteList" tab="黑白名单" force-render> </a-tab-pane>
            <a-tab-pane key="platformList" tab="绑定平台" force-render> </a-tab-pane>
            <a-tab-pane key="projectExtend" tab="扩展数据" force-render> </a-tab-pane>
          </a-tabs>
          <router-view ref="platformList"></router-view>
        </div>
      </div>
    </bl-page-wrapper>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';

const { projectManageAsk } = service;
export default {
  name: 'ProjectDetail',
  components: {},
  props: {},
  data() {
    return {
      breadcrumbRoutes: [],
      project: {},
      id: this.$route.params.id,
      iptype: '',
      defaultActiveKey: this.$route.name,
      blackIptype: 0,
    };
  },
  computed: {
    ...mapState('projectManage', ['blackListStatus']),
  },
  watch: {},
  async created() {
    this.setBreadcrumb();
  },
  mounted() {},
  methods: {
    ...mapMutations('projectManage', ['setBlackStauts']),
    // 设置面包屑
    setBreadcrumb() {
      const { params } = this.$route;
      const breadcrumbRoutes = [
        {
          name: '项目管理',
          breadcrumbName: '全部项目',
        },
      ];
      if (params.id) {
        // 详情
        this.breadcrumbRoutes = [
          ...breadcrumbRoutes,
          {
            name: '',
            breadcrumbName: '项目详情',
          },
        ];
      } else {
        // 创建项目
        this.breadcrumbRoutes = [
          ...breadcrumbRoutes,
          {
            name: '',
            breadcrumbName: '创建项目',
          },
        ];
      }
    },
    // 切换过滤条件
    handleChange(val) {
      this.setBlackStauts(val);
    },
    // 添加名单
    add() {
      this.$refs.whiteList.add();
    },
    // 切换Tab
    changeTab(activeKey) {
      this.defaultActiveKey = activeKey;
      const { id } = this;
      console.log(id, activeKey, 'id');
      if (id) {
        // 详情
        this.$router.push({ name: activeKey, params: { id: id } });
      } else {
        // 添加
        this.$router.push({ path: activeKey });
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
