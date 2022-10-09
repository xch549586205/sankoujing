<template>
  <div>
    <bl-page-wrapper class="reset-background">
      <div slot="header" class="header-panel">
        <bl-header>
          <span slot="left" class="title">全部项目</span>
          <a-button slot="right" type="primary" @click="add">创建项目</a-button>
        </bl-header>
      </div>
      <div slot="content">
        <!-- <bl-card v-for="item in projectList"
                 :title="item.projectname"
                 :key="item.id"
                 @click="goDetail(item)"></bl-card> -->
        <div
          v-for="item in projectList"
          :title="item.projectname"
          :key="item.id"
          class="content-card"
          @click="goDetail(item)"
        >
          <div class="content-card-top">
            <img :src="item.logourl || 'static/images/logo.png'" />
          </div>
          <div class="content-card-bottom">
            <img src="static/images/lable.png" />{{ item.projectname }}
          </div>
        </div>
        <div>
          <a-pagination
            v-if="total > 0"
            :total="total"
            :current="current"
            :page-size="pageSize"
            @change="change"
          />
        </div>
      </div>
    </bl-page-wrapper>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';
import { Modal } from 'ant-design-vue';
const { projectManageAsk } = service;
export default {
  name: 'ProjectManage',
  components: {},
  props: {},
  data() {
    return {
      projectList: [],
      current: 1,
      pageSize: 10,
      total: 0,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getProject();
  },
  mounted() {},
  methods: {
    // 创建项目
    add() {
      this.$router.push({ name: '创建项目' });
    },
    // 项目详情
    goDetail(item) {
      console.log('item', item);

      projectManageAsk.getProgress({ projectid: item.id + '' }).then(resp => {
        console.log('resp', resp);
        const { data = {}, errcode } = resp;
        if (data.curCount != data.totalCount) {
          const content2 =
            '项目正在创建中，创建进度：' + parseInt((data.curCount / data.totalCount) * 100) + '%';
          Modal.info({
            title: '提示',
            content: content2,
            onOk() {},
          });
        } else {
          this.$router.push({ name: '项目详情', params: { id: item.id } });
        }
      });
    },

    change(page, pageSize) {
      this.current = page;
      this.getProject();
    },
    getProject() {
      const { current, pageSize } = this;
      const params = {
        limit: pageSize,
        offset: current,
      };
      projectManageAsk
        .getProject(params)
        .then(
          result => {
            const { errcode, data = {} } = result;
            if (errcode === 200) {
              const { projects = [], totalsize } = data;
              this.projectList = projects;
              this.total = totalsize;
            } else {
              this.projectList = [];
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
.content-card {
  width: 210px;
  height: 218px;
  display: inline-block;
  background: #fff;
  margin: 0 10px 10px;
  border-radius: 4px;
  .content-card-bottom {
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #333333;
    img {
      margin-right: 5px;
    }
  }
  .content-card-top {
    height: 157px;
    width: 100%;
    line-height: 157px;
    text-align: center;
    border-bottom: 1px solid #eef2f5;
    img {
      width: 126px;
    }
  }
}
</style>
