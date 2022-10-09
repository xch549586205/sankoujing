<template>
  <div>
    <bl-page-wrapper>
      <div class="header-panel" slot="header">
        <bl-header>
          <p slot="left" class="top-title">全部日志</p>
          <div class="top-right" slot="right">
            <a-select v-model="projectid" class="component-w-224" @change="handleChange">
              <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                {{ item.projectname }}
              </a-select-option>
            </a-select>
            <div class="top-time">
              <a-range-picker @change="calendarChange" />
            </div>
          </div>
        </bl-header>
      </div>
      <div slot="content">
        <div class="tab-panel">
          <a-tabs :default-active-key="defaultActiveKey" @change="changeTab">
            <a-tab-pane key="wechatLogin" tab="微信登录"> </a-tab-pane>
            <a-tab-pane key="webLogin" tab="网页登录" force-render> </a-tab-pane>
            <a-tab-pane key="appLogin" tab="安装APP登录" force-render> </a-tab-pane>
            <a-tab-pane key="remoteControl" tab="设备远程控制" force-render> </a-tab-pane>
            <a-tab-pane key="systemOperation" tab="系统操作" force-render> </a-tab-pane>
            <!-- <a-tab-pane key="installTask"
                        tab="安装任务"
                        force-render>
            </a-tab-pane>
            <a-tab-pane key="maintainTask"
                        tab="维护任务"
                        force-render>
            </a-tab-pane> -->
          </a-tabs>
          <router-view></router-view>
        </div>
      </div>
    </bl-page-wrapper>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'LogManage',
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
    ...mapMutations('logManage', ['setRangeTime']),
    calendarChange(value) {
      this.setRangeTime(value);
    },
    // 添加人员
    ...mapMutations('logManage', ['setProjectid']),
    ...mapMutations('projectManage', ['setCurrentProjectid']),
    ...mapActions('projectManage', ['setProjectList']),
    handleChange(val) {
      this.setProjectid(val);
      this.setCurrentProjectid(val);
    },
    // 切换Tab
    changeTab(activeKey) {
      this.defaultActiveKey = activeKey;
      this.$router.push({ name: activeKey });
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
  font-size: 18px;
  color: #333;
  font-weight: 600;
  display: inline-block;
  line-height: 25px;
  margin: 13px 0 0 20px;
}
.top-right {
  margin-top: 9px;
  float: right;
}
.top-time {
  display: inline-block;
  width: 224px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
