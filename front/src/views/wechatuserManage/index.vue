<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-02-23 19:29:18
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <bl-header>
      <bl-breadcrumb slot="left"
                     :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
      <div slot="right">
        <!-- <a-select v-show="defaultActiveKey==='userList'"
                  v-model="roleid"
                  class="component-w-224"
                  @change="handleChange">
          <a-select-option value="-1">
            全部角色
          </a-select-option>
          <a-select-option v-for="item in roleList"
                           :key="item.id"
                           :value="item.id">
            {{ item.rolename }}
          </a-select-option>
        </a-select> -->
      </div>
    </bl-header>
    <bl-page-wrapper>
      <div slot="content">
        <div>
          <a-tabs :default-active-key="defaultActiveKey"
                  class="log-list"
                  @change="changeTab">
            <a-tab-pane key="wechatuser"
                        tab="用户列表">
            </a-tab-pane>

            <a-tab-pane key="wechatloginlog"
                        tab="登录日志"
                        force-render>
            </a-tab-pane>

            <a-tab-pane key="wechatorder"
                        tab="历史订单"
                        force-render>
            </a-tab-pane>
            <a-tab-pane key="wechatgamelog"
                        tab="游戏记录"
                        force-render>
            </a-tab-pane>
            <a-tab-pane key="wechatscorelog"
                        tab="积分记录"
                        force-render>
            </a-tab-pane>
          </a-tabs>
          <router-view ref="listModal"></router-view>
        </div>
      </div>
    </bl-page-wrapper>
  </div>
</template>


<script>
  import service from 'servicePath/index';
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

  export default {
    name: 'BizuserManage',
    components: {},
    props: {},
    data() {
      return {
        breadcrumbRoutes: [
          {
            name: '用户管理',
            breadcrumbName: '全部用户',
          },
        ],
        id: this.$route.params.id,
        defaultActiveKey: this.$route.name,
        search: '',
        roleid: '-1',
        roleList: [],
      };
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {},
    methods: {
      // 切换Tab
      changeTab(activeKey) {
        this.defaultActiveKey = activeKey;
        this.$router.push({ name: activeKey });
      },
    },
  };
</script>

<style lang="less" scoped>
</style>
