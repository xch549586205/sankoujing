<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-15 17:01:25
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-config-provider :locale="locale">
    <div>
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

moment.locale('zh-cn');

export default {
  name: 'App',
  components: {},
  props: {},
  data() {
    return {
      locale: zhCN,
    };
  },
  computed: {
    ...mapState('app', ['projectInfo']),
  },
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {
    const { id } = this.projectInfo;
    localStorage.removeItem(`authB_${id}`);
    localStorage.removeItem(`userInfoB_${id}`);
  },
  methods: {},
};
</script>
