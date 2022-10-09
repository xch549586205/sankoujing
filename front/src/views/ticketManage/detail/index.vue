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
          <a-button v-if="defaultActiveKey==='ticketItemList'"
                    type="primary"
                    @click="addItem">添加商品</a-button>
      </div>
    </bl-header>
    <bl-page-wrapper>
      <div slot="content">
        <div>
          <a-tabs v-if="defaultActiveKey=='ticketDetail' || defaultActiveKey=='ticketItemList'"
                 :default-active-key="defaultActiveKey"
                  class="log-list"
                  @change="changeTab">
            <a-tab-pane key="ticketDetail"
                        tab="票据详情">
            </a-tab-pane>

            <a-tab-pane key="ticketItemList"
                        tab="商品列表"
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
          name: 'ticketList',
          breadcrumbName: '全部票据',
        },
        {
            name: 'ticketDetail',
            breadcrumbName: '票据详情',
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
      addItem() {
        this.$router.push({ name: `ticketItemAdd`, params: { ticketid: this.$route.params.ticketid } });
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
</style>
