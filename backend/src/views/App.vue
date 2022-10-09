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
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    beforeDestroy() {
      localStorage.removeItem('auth');
    },
    methods: {},
  };
</script>
