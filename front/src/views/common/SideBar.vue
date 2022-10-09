<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-09-18 09:35:28
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="sidebar">
    <div style="width: 200px">
      <!-- <div class="side-menu">导航</div> -->
      <a-menu
        :default-selected-keys="defaultSelectedKeys"
        mode="inline"
        theme="dark"
        @click="selectMenu"
      >
        <a-menu-item v-for="(item, i) in menuList" :key="'menuList' + i" :value="item.path">
          <span :class="['iconfont', item.icon]"></span>
          <span>{{ item.name }}</span>
        </a-menu-item>
      </a-menu>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { asyncRoutes } from 'routerPath';

export default {
  name: 'SideBar',
  components: {},
  props: {},
  data() {
    return {
      menuList: [],
      selectKey: '',
    };
  },
  computed: {
    defaultSelectedKeys() {
      return this.routes
        .filter((route) => this.$route.path.startsWith(route.path))
        .map((v) => v.name);
    },
    ...mapGetters(['routes']),
  },
  watch: {},
  created() {},
  mounted() {
    this.getMenu();
  },
  methods: {
    // 生成menu菜单 TODO浏览器后台高亮menu
    getMenu() {
      const menu = this.routes.filter((v) => v.show);
      const sortIndex = ['首页', '实时监测', '用电警告', '设备管理', '分组管理', '人员管理'];
      menu.sort((a, b) => sortIndex.indexOf(a.name) - sortIndex.indexOf(b.name));
      this.menuList = menu;
    },
    // 选择菜单
    selectMenu({ item, key, keyPath }) {
      this.selectKey = key;
      this.$router.push({ path: item.value });
    },
  },
};
</script>

<style lang="less" scoped>
.side-menu {
  padding-left: 24px;
  line-height: 40px;
  color: #fff;
}
.ant-menu.ant-menu-dark .ant-menu-item-selected,
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
  background: rgba(33, 52, 87, 1);
}
</style>
