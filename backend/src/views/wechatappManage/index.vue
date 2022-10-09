<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-29 14:07:00
 * @LastEditTime: 2019-08-19 18:59:30
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <bl-page-wrapper>
      <div slot="header" class="header-panel">
        <bl-header>
          <span slot="left" class="title">全部微信应用</span>
          <div slot="right">
            <a-select v-model="projectid" class="component-w-224" @change="doSearch">
              <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                {{ item.projectname }}
              </a-select-option>
            </a-select>
            <!-- <a-select v-model="online"
                    default-value="-1"
                    class="component-w-224"
                    style="margin:0 10px;"
                    @change="doSearch">
            <a-select-option v-for="item in onlineStatusList"
                             :key="item.value"
                             :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select> -->
            <a-input-search
              v-model.trim="search"
              placeholder="输入微信应用名称搜索"
              class="component-w-224"
              enter-button
              @search="doSearch"
            />
            <a-button class="ml10" type="primary" @click="add">添加微信应用 </a-button>
          </div>
        </bl-header>
      </div>
      <div slot="content">
        <a-table
          :columns="columns"
          :row-key="record => `${record.id}${record.did}`"
          :data-source="data"
          :loading="loading"
          :pagination="pagination"
          class="reset-pagination"
          @change="wechatappChange"
        >
          <template slot="index" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
          <template slot="online" slot-scope="text, record">
            <span :class="{ error: record.online === '0' }">{{
              record.online === '0' ? '离线' : '在线'
            }}</span>
          </template>
          <template slot="operation" slot-scope="text, record">
            <!--  <a :class="{disabled:record.online!=='1'}"
               @click="control(record)">控制</a>
            <a-divider type="vertical" /> -->
            <a @click="mod(record)">修改</a>
          </template>
        </a-table>

        <a-modal
          v-if="isModal"
          ref="modalBlack"
          :title="isEdit ? '修改' : '添加'"
          v-model="isModal"
          k-closable="false"
          :width="332"
          :closable="false"
          ok-text="确定"
          cancel-text="取消"
        >
          <a-form :form="form" hide-required-mark>
            <a-form-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              :colon="false"
              label="名称"
            >
              <a-input
                v-decorator="[
                  `name`,
                  {
                    initialValue: current.name,
                    rules: [{ required: true, message: '请输入微信应用名称' }],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              :colon="false"
              label="appid"
            >
              <a-input
                v-decorator="[
                  `appid`,
                  {
                    initialValue: current.appid,
                    rules: [{ required: true, message: '请输入appid' }],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
              :colon="false"
              label="appsecret"
            >
              <a-input
                v-decorator="[
                  `appsecret`,
                  {
                    initialValue: current.appsecret,
                    rules: [{ required: true, message: '请输入appsecret' }],
                  },
                ]"
                type="password"
              />
            </a-form-item>
          </a-form>
          <template slot="footer">
            <a-button key="back" @click="handleCancel">取消</a-button>
            <a-button v-show="isEdit" type="danger" @click="handleDelete">删除</a-button>
            <a-button key="submit" type="primary" @click="handleOk">保存</a-button>
          </template>
        </a-modal>
      </div>
    </bl-page-wrapper>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';
import Mix from '@/mixins';

const { wechatappManageAsk } = service;
const { PageTableCreaterMix } = Mix;
export default {
  name: 'DeviceManage',
  components: {},
  mixins: [PageTableCreaterMix('wechatapp')],
  props: {},
  data() {
    return {
      form: this.$form.createForm(this),
      projectid: null,
      search: '',
      isModal: false,
      isEdit: false,
      current: {},
    };
  },
  computed: {
    ...mapState('projectManage', ['projectList', 'currentProjectid']),
  },
  watch: {
    projectid(newVal, oldVal) {
      console.log('project', newVal, oldVal);
      if (oldVal !== null) {
        this.wechatappFetch();
      }
    },
  },
  created() {
    this.projectid = this.currentProjectid;
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    ...mapActions('projectManage', ['setProjectList']),
    ...mapMutations('projectManage', ['setCurrentProjectid']),
    // init() {
    //   this.pagination.current = 1;
    //   this.wechatappFetch();
    // },
    // 表头
    wechatappColumns() {
      const columns = [
        {
          title: '序号',
          dataIndex: 'index',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '名称',
          width: '10%',
          dataIndex: 'name',
          align: 'center',
        },
        {
          title: 'appid',
          dataIndex: 'appid',
          align: 'center',
        },
        // {
        //   title: 'appsecret',
        //   dataIndex: 'appsecret',
        //   align: 'center',
        // },
        {
          title: '操作',
          dataIndex: 'operate',
          align: 'left',
          scopedSlots: { customRender: 'operation' },
        },
      ];
      return columns;
    },
    doSearch() {
      this.setCurrentProjectid(this.projectid);
      // this.init();
    },
    add() {
      this.isModal = true;
    },
    mod(record) {
      this.current = record;
      this.isEdit = true;
      this.isModal = true;
    },
    // 确定删除
    handleDelete(record) {
      // this.wechatappFormatPagination('del');
      this.wechatappFetch();
      this.isModal = false;

      wechatappManageAsk
        .delApp({ ids: [this.current.id], projectid: `${this.currentProjectid}` })
        .then(res => {
          this.wechatappFetch();
        })
        .catch(res => {
          console.error(res);
        });
    },
    handleCancel() {
      this.isModal = false;
      this.current = {};
    },
    handleOk() {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          console.error(err);
          return;
        }

        const { isEdit } = this;
        if (isEdit) {
          // 编辑
          wechatappManageAsk
            .modApp(
              Object.assign({}, fieldsValue, {
                id: this.current.id,
                projectid: `${this.currentProjectid}`,
              })
            )
            .then(res => {
              this.wechatappFetch();
            })
            .catch(res => {
              console.error(res);
            });
        } else {
          // 添加
          wechatappManageAsk
            .newApp(Object.assign({}, fieldsValue, { projectid: `${this.currentProjectid}` }))
            .then(res => {
              this.wechatappFetch();
            })
            .catch(res => {
              console.error(res);
            });
        }
      });
      this.isModal = false;
    },
    // 请求数据
    async wechatappFetchList(params) {
      if (!this.currentProjectid) {
        await this.setProjectList();
        const { projectList } = this;
        this.setCurrentProjectid(projectList[0].id);
        this.projectid = projectList[0].id;
      }

      const { currentProjectid, search } = this;
      const { errcode, data = {} } = await wechatappManageAsk.getApp({
        ...params,
        projectid: `${currentProjectid}`,
        name: search,
      });

      return { total: data.totalsize, data: data.apps || [] };

      return { total: 0, data: [] };
    },
    formatPagination(operate) {
      const { data, pagination } = this;
      if (operate === 'add') {
        if (data.length === pagination.pageSize) {
          this.pagination.current = pagination.current + 1;
        }
      } else if (data.length === 1) {
        if (pagination.current > 1) {
          this.pagination.current = pagination.current - 1;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
