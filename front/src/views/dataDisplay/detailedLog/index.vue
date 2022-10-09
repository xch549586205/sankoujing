<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 10:02:54
 * @LastEditTime: 2021-02-24 13:55:52
 * @LastEditors: Please set LastEditors
 -->
<template>
  <bl-page-wrapper>
    <div slot="content">
      <div>
        <a-tabs :default-active-key="defaultActiveKey"
                @change="changeTab">
          <a-tab-pane key="wechatLogin"
                      tab="微信登录">
          </a-tab-pane>
          <a-tab-pane key="webLogin"
                      tab="网页登录"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="appLogin"
                      tab="安装APP登录"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="remoteControl"
                      tab="设备远程控制"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="deviceAlarm"
                      tab="设备报警"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="systemOperation"
                      tab="系统操作"
                      force-render>
          </a-tab-pane>
          <!-- <a-tab-pane key="installTask"
                      tab="安装任务"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="maintainTask"
                      tab="维护任务"
                      force-render>
          </a-tab-pane> -->
          <a-tab-pane key="deviceReport"
                      tab="数据上报"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="smsReport"
                      tab="短信通知"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="wxgzhReport"
                      tab="微信公众号通知"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="timingTask"
                      tab="定时任务"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="sceneTask"
                      tab="场景任务"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="linkageTask"
                      tab="联动任务"
                      force-render>
          </a-tab-pane>
          <a-tab-pane key="order"
                      tab="充电订单"
                      force-render>
          </a-tab-pane>
        </a-tabs>
        <router-view></router-view>
      </div>
    </div>
  </bl-page-wrapper>
</template>


<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

  export default {
    name: 'DetailedLog',
    components: {},
    props: {},
    data() {
      return {
        defaultActiveKey: this.$route.name,
        id: this.$route.params.id,
      };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
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
</style>
