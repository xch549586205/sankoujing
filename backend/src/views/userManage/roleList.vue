<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-19 09:49:40
 * @LastEditTime: 2021-02-22 11:29:50
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-table :columns="columns"
             :row-key="record => record.id"
             :data-source="data"
             :loading="loading"
             :pagination="pagination"
             class="reset-pagination"
             @change="roleListChange">
      <template slot="index"
                slot-scope="text, record,index">
        <span>{{ index+1 }}</span>
      </template>
      <template slot="operation"
                slot-scope="text, record">
        <a @click="edit(record)">编辑</a>
      </template>
    </a-table>
    <!-- 人员弹窗 -->
    <a-modal v-if="isModal"
             ref="modalBlack"
             :title="modalTitle"
             v-model="isModal"
             :mask-closable="false"
             :width="800"
             :closable="false"
             ok-text="确定"
             cancel-text="取消">
      <a-form :form="form"
              hide-required-mark>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="名称">
          <a-input v-decorator="[ `rolename`,{
            initialValue: current.rolename,
            rules: [{ required: true, message: '请输入角色名称' }],} ]" />
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="登录类型">
          <a-checkbox-group v-model="checkedList"
                            :options="plainOptions" />
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="权限">
          <a-row>
            <a-col :span="12">
              <span>api权限</span>
              <a-checkbox-group v-model="selected1"
                                class="modal-border-panel"
                                @change="onSaveConnect">
                <a-row v-for="item in apiList"
                       :key="item.id"
                       class="mb10">
                  <a-checkbox :value="item.id">{{ item.urlname }}</a-checkbox>
                </a-row>
              </a-checkbox-group>

            </a-col>
            <a-col :span="12">
              <span>网页权限</span>
              <a-checkbox-group v-model="selected2"
                                class="modal-border-panel"
                                @change="onSaveConnect">
                <a-row v-for="item in webList"
                       :key="item.id"
                       class="mb10">
                  <a-checkbox :value="item.id">{{ item.urlname }}</a-checkbox>
                </a-row>
              </a-checkbox-group>

            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back"
                  @click="handleCancel">取消</a-button>
        <a-button v-show="isEdit"
                  type="danger"
                  @click="showDelModal">删除</a-button>
        <a-button key="submit"
                  type="primary"
                  @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
  import service from 'servicePath/index';
  import Mix from '@/mixins';
  const plainOptions = [
    { label: '网页', value: 'web' },
    { label: '安卓', value: 'android' },
    { label: '苹果', value: 'ios' },
    { label: '微信小程序', value: 'wxx' },
    { label: '微信公众号', value: 'wxg' },
    { label: '第三方登录', value: '3rd' },
  ];
  const { userManageAsk } = service;
  const { PageTableCreaterMix } = Mix;
  // 表头
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: '10%',
      align: 'center',
      scopedSlots: { customRender: 'index' },
    },
    {
      title: '角色名称',
      dataIndex: 'rolename',
      width: '10%',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: '10%',
      align: 'center',
      scopedSlots: { customRender: 'operation' },
    },
    {
      title: '',
      dataIndex: 'hide',
      align: 'center',
      scopedSlots: { customRender: 'hide' },
    },
  ];
  export default {
    name: 'RoleList',
    mixins: [PageTableCreaterMix('roleList')],
    data() {
      return {
        form: this.$form.createForm(this),
        isModal: false,
        isEdit: false,
        urlSiteList: [],
        rid: '',
        selected: [],
        selected2: [],
        selected1: [],
        ruids: [],
        current: {},
        columns,
        checkedList: [],
        plainOptions,
      };
    },
    computed: {
      ...mapState('userManage', ['projectid']),
      modalTitle() {
        const { isEdit } = this;
        return `${isEdit ? '编辑' : '添加'}角色`;
      },
      apiList() {
        return this.urlSiteList.filter((item) => {
          return item.status === 1;
        });
      },
      webList() {
        return this.urlSiteList.filter((item) => {
          return item.status === 2;
        });
      },
    },
    watch: {
      projectid(newVal, oldVal) {
        this.init();
        if (oldVal === null) {
          this.roleListFetch();
        }
      },
      selected(selected) {
        this.selected1 = [];
        this.selected2 = [];
        console.log('select', this.urlSiteList);
        selected.forEach((v) => {
          let url = this.urlSiteList.find((item) => item.id === v);
          if (url) {
            console.log(url);
            if (url.status === 1) {
              this.selected1.push(v);
            } else {
              this.selected2.push(v);
            }
          }
        });
      },
    },
    created() {
      console.log(this.data);
    },
    methods: {
      // handleChange(val) {
      //   this.setroleProjectid(val);
      //   this.getUrlsite();
      // },
      init() {
        this.pagination.current = 1;
        this.roleListFetch();
      },
      // 添加
      add() {
        this.checkedList = [];
        this.isModal = true;
        this.isEdit = false;
        this.current = {};
        this.selected = [];
        this.selected1 = [];
        this.selected2 = [];
        this.getAllUrl();
      },
      // 编辑
      async edit(record) {
        this.checkedList = [];
        this.isModal = true;
        this.isEdit = true;
        this.current = {
          ...record,
        };
        this.checkedList = this.current.logintype;
        await this.getAllUrl();
        const { id } = this.current;
        const { projectid } = this;
        const params = {
          pid: `${projectid}`,
          rid: `${id}`,
        };
        userManageAsk
          .getRU(params)
          .then(
            (result) => {
              const { errcode, data = {} } = result;
              if (errcode === 200) {
                const { alist = [] } = data;
                this.selected = alist && alist.map((v) => v.urlid);
                this.ruids = alist && alist.map((v) => v.id);
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
      // 删除
      showDelModal() {
        const { status } = this.current;
        if (status === 1) {
          // 系统初始化角色不能删除
          this.$message.warning('系统初始化角色不能删除!');
          return;
        }
        const that = this;
        this.$confirm({
          title: '确定要删除角色？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            that.del();
          },
          onCancel() {},
        });
      },
      // 取消
      handleCancel() {
        this.isModal = false;
      },
      // 删除
      del() {
        const { id } = this.current;
        const { projectid } = this;
        const params = {
          uid: id,
          pid: `${projectid}`,
        };
        userManageAsk
          .delRole(params)
          .then(
            (result) => {
              const { errcode } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.roleListFetch();
                this.isModal = false;
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
      // 获得选择项
      onSaveConnect(val) {
        console.log(val);
      },
      //编辑角色权限
      getAllUrl() {
        const { projectid } = this;
        const params = {
          limit: this.GLOBAL.MAX_LEN,
          offset: 1,
          pid: `${projectid}`,
        };
        userManageAsk
          .getUrlsite(params)
          .then(
            (result) => {
              const { errcode, data = {} } = result;
              if (errcode === 200) {
                const { alist = [], totalsize } = data;
                this.urlSiteList = alist;
                this.total = totalsize;
              } else {
                this.urlSiteList = [];
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
      // 确定弹窗
      handleOk() {
        console.log('ok');
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          console.log('checkedList', this.checkedList);
          fieldsValue.logintype = this.checkedList;
          const { isEdit } = this;
          if (isEdit) {
            // 编辑
            this.modRoletable(fieldsValue);
          } else {
            // 添加
            this.addRoletable(fieldsValue);
          }
        });
      },
      //编辑
      modRoletable(fieldsValue) {
        const { rolename, logintype } = fieldsValue;
        const { projectid } = this;
        const { id } = this.current;
        const Params = {
          pid: `${projectid}`,
          id,
          rolename,
          logintype,
        };
        userManageAsk
          .modRole(Params)
          .then(
            (result) => {
              const { errcode } = result;
              if (errcode === 200) {
                this.roleListFetch();
                this.modRoleUrl(id);
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
      //解绑再绑定
      async modRoleUrl(id) {
        const { ruids, projectid, selected1, selected2 } = this;
        let selected = [];
        selected.push(...selected1, ...selected2);
        const params = {
          pid: `${projectid}`,
          ruids: ruids,
          roleid: id,
        };
        const urlParams = {
          pid: `${projectid}`,
          roleid: id,
          urlid: selected,
        };
        await userManageAsk.unbindRU(params).catch((e) => {
          console.error(e);
        });
        if (selected.length !== 0) {
          userManageAsk.bindRU(urlParams).catch((e) => {
            console.error(e);
          });
        }
        this.$message.success('操作成功！');
        this.isModal = false;
      },
      //添加角色
      async addRole(fieldsValue) {
        const { rolename, logintype } = fieldsValue;
        const { projectid } = this;
        const params = {
          pid: `${projectid}`,
          rolename,
          status: 2,
          logintype,
        };
        console.log('params', params);
        await userManageAsk
          .addRole(params)
          .then(
            (result) => {
              const { errcode, data = {} } = result;
              if (errcode === 200) {
                this.rid = `${data.uid}`;
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
      //角色与url绑定
      async addRoletable(fieldsValue) {
        const { projectid, selected1, selected2 } = this;
        let selected = [];
        selected.push(...selected1, ...selected2);
        if (selected.length !== 0) {
          await this.addRole(fieldsValue);
          const { rid } = this;
          if (rid) {
            this.current = {
              pid: `${projectid}`,
              roleid: rid,
              urlid: selected,
            };
            const params = {
              ...this.current,
            };
            userManageAsk
              .bindRU(params)
              .then(
                (result) => {
                  const { errcode } = result;
                  if (errcode === 200) {
                    this.roleListFetch();
                    this.$message.success('操作成功！');
                    this.isModal = false;
                  }
                },
                () => {}
              )
              .catch((e) => {
                console.error(e);
              });
          }
        } else {
          const { rolename } = fieldsValue;
          const params = {
            pid: `${projectid}`,
            rolename,
            status: 2,
          };
          userManageAsk
            .addRole(params)
            .then(
              (result) => {
                const { errcode } = result;
                if (errcode === 200) {
                  this.roleListFetch();
                  this.$message.success('操作成功！');
                  this.isModal = false;
                }
              },
              () => {}
            )
            .catch((e) => {
              console.error(e);
            });
        }
      },

      // 请求数据
      async roleListFetchList(params) {
        const { projectid } = this;
        const { errcode, data = {} } = await userManageAsk.getRole({
          ...params,
          projectid: projectid,
        });
        return { total: data.totalsize, data: data.alist };
      },
    },
  };
</script>

<style scoped>
</style>
