<template>
  <div class="topbar">
    <div class="header-brand">叨叨智慧系统后台</div>
    <div class="header-operate">
      <span class="iconfont iconbianzu mr10"></span>
      <a-dropdown class="topbar-dropdown">
        <span class="ant-dropdown-link" href="#">
          {{ userInfo.displayname }}
          <a-icon type="down" />
        </span>
        <a-menu slot="overlay">
          <a-menu-item @click="exit">
            <span>退出</span>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import service from 'servicePath/index';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

const { appAsk } = service;

export default {
  name: 'Main',
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState('app', ['userInfo']),
  },
  created() {
    this.setUserInfo(JSON.parse(localStorage.userInfo));
  },
  mounted() {},
  methods: {
    /* 账号设置 */
    ...mapMutations('app', ['setUserInfo']),
    /* 退出 */
    exit() {
      const userInfo = JSON.parse(localStorage.userInfo);
      const params = {
        ...userInfo,
      };
      appAsk
        .logoutAccount(params)
        .then(
          result => {
            const { errcode, data } = result;
            if (errcode === 200) {
              localStorage.removeItem('auth');
              this.$router.push({ path: '/login' });
            }
          },
          () => {}
        )
        .catch(e => {
          console.error(e);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.topbar {
  color: rgba(0, 0, 0, 1);
  height: 50px;
  padding: 0 24px;
  line-height: 50px;
  .header-brand {
    font-size: 18px;
  }
  .header-brand,
  .header-operate {
    display: inline-block;
  }
  .header-operate {
    position: absolute;
    right: 24px;
    font-size: 16px;
  }
}
</style>
