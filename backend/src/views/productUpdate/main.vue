<template>
  <div>
    <bl-page-wrapper class="reset-background">
      <div slot="header"
           class="header-panel">
        <bl-header>
          <span slot="left"
                class="title">远程升级</span>
          <a-button v-if="!isUpdatePage"
                    slot="right"
                    type="primary"
                    @click="add">添加版本</a-button>
          <div v-if="isUpdatePage"
               slot="right">
            <a-select v-model="projectid"
                      class="component-w-224"
                      @change="doSearch">
              <a-select-option v-for="item in projectList"
                               :key="item.id"
                               :value="item.id">
                {{ item.projectname }}
              </a-select-option>
            </a-select>
            <a-input-search v-model.trim="search"
                            placeholder="输入设备名称搜索"
                            class="component-w-224"
                            enter-button
                            @search="doSearch" />
          </div>
        </bl-header>
      </div>
      <div slot="content">
        <div class="tabs">
          <a-tabs :tab-bar-style="{background:'#fff'}"
                  :default-active-key="defaultActiveKey"
                  class="tabs"
                  @change="tabsChange">
            <a-tab-pane key="editionManage"
                        tab="版本管理">
            </a-tab-pane>
            <a-tab-pane key="deviceUpdate"
                        tab="版本升级">
            </a-tab-pane>
          </a-tabs>
          <router-view ref="editionManage"></router-view>
        </div>
      </div>
    </bl-page-wrapper>
  </div>
</template>


<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
  import service from 'servicePath/index';

  const { deviceManageAsk } = service;
  export default {
    name: 'DeviceUpdate',
    components: {},
    props: {},
    data() {
      return {
        defaultActiveKey: 'editionManage',
        projectid: null,
        search: '',
      };
    },
    computed: {
      ...mapState('projectManage', ['projectList', 'currentProjectid']),
      ...mapState('productManage', ['devicetypeList']),
      isUpdatePage() {
        return this.$route.path.indexOf('deviceUpdate') !== -1;
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

    methods: {
      ...mapActions('projectManage', ['setProjectList']),
      ...mapMutations('projectManage', ['setCurrentProjectid']),
      doSearch() {
        this.setCurrentProjectid(this.projectid);
        this.init();
      },

      add() {
        this.$router.push({ path: 'editionDetail' });
      },

      tabsChange(activeKey) {
        this.defaultActiveKey = activeKey;
        this.$router.push({ path: activeKey });
      }, // 请求数据
      async deviceFetchList(params) {
        const { projectid, search } = this;
        const { errcode, data = {} } = await deviceManageAsk.getDevice({
          ...params,
          projectid: `${projectid}`,
          displayname: search,
        });
        if (data.deviceInfos != undefined) {
          for (var dev of data.deviceInfos) {
            console.log('dev', dev);
            for (var item of this.devicetypeList) {
              if (dev.devicetype == item.key) {
                dev.devicetype = item.name;
              }
            }
          }
        }
        return { total: data.totalsize, data: data.deviceInfos || [] };
      },
      formatPagination(operate) {
        const { data, pagination } = this;
        if (operate === 'add') {
          if (data.length === pagination.pageSize) {
            this.pagination.current = pagination.current + 1;
          }
        } else if (data.length === 1) {
          if (pagination.current > 1) {
            this.pagination.current = pagination.current - 1;
          }
        }
      },
      init() {
        this.pagination.current = 1;
        this.deviceFetch();
      },
    },
  };
</script>

<style lang="less" scoped>
</style>
