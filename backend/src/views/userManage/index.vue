<template>
  <div>
    <bl-page-wrapper>
      <div class="header-panel"
           slot="header">
        <bl-header>
          <p slot="left"
             class="top-title">全部人员</p>
          <div slot="right"
               class="top-right">
            <a-select v-model="projectid"
                      class="component-w-224"
                      @change="handleChange">
              <a-select-option v-for="item in projectList"
                               :key="item.id"
                               :value="item.id">
                {{ item.projectname }}
              </a-select-option>
            </a-select>
            <a-button v-show="defaultActiveKey === 'userList'"
                      class="ml10"
                      type="primary"
                      @click="add">添加人员
            </a-button>
            <a-button v-show="defaultActiveKey === 'installerList'"
                      class="ml10"
                      type="primary"
                      @click="add">添加人员
            </a-button>
            <a-button v-show="defaultActiveKey === 'roleList'"
                      class="ml10"
                      type="primary"
                      @click="add">添加角色
            </a-button>
          </div>
        </bl-header>
      </div>
      <div slot="content">
        <div class="tab-panel">
          <a-tabs :default-active-key="defaultActiveKey"
                  @change="changeTab">
            <a-tab-pane key="userList"
                        tab="普通人员"> </a-tab-pane>
            <!-- <a-tab-pane key="installerList"
                        tab="安装工"
                        force-render>
            </a-tab-pane> -->
            <a-tab-pane key="roleList"
                        tab="角色列表"
                        force-render> </a-tab-pane>
          </a-tabs>
          <router-view ref="listModal"></router-view>
        </div>
      </div>
    </bl-page-wrapper>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

  export default {
    name: 'UserManage',
    components: {},
    props: {},
    data() {
      return {
        projectid: null,
        defaultActiveKey: this.$route.name,
        id: this.$route.params.id,
      };
    },
    computed: {
      ...mapState('projectManage', ['projectList', 'currentProjectid']),
    },
    watch: {},
    async created() {
      await this.setProjectList();
      const { projectList } = this;

      if (this.currentProjectid == 0 || this.currentProjectid == undefined) {
        this.setCurrentProjectid(projectList[0].id);
      }
      this.projectid = this.currentProjectid;
      this.handleChange(this.projectid);
    },
    mounted() {},
    methods: {
      // 添加人员
      ...mapMutations('userManage', ['setProjectid']),
      ...mapActions('projectManage', ['setProjectList']),
      ...mapMutations('projectManage', ['setCurrentProjectid']),

      handleChange(val) {
        this.setCurrentProjectid(val);
        this.setProjectid(val);
      },

      add() {
        this.$refs.listModal.add();
      },
      // 切换Tab
      changeTab(activeKey) {
        this.defaultActiveKey = activeKey;
        const { id } = this;
        if (id) {
          // 详情
          this.$router.push({ name: activeKey });
        } else {
          // 添加
          this.$router.push({ path: activeKey });
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .log-top {
    height: 50px;
    background-color: #fff;
  }
  .top-title {
    display: inline-block;
    line-height: 25px;
    margin: 13px 0 0 20px;
  }
  .top-right {
    margin-top: 9px;
    margin-right: 20px;
    float: right;
  }
  .ll {
    width: 124px;
    text-align: center;
  }
  .menu-list {
    height: 760px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    background-color: #fff;
  }
</style>
