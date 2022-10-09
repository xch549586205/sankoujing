<template>
  <div>
    <a-table :columns="columns"
             :row-key="record => record.id"
             :data-source="data"
             :loading="loading"
             :pagination="pagination"
             class="reset-pagination"
             @change="userListChange">
      <template slot="index"
                slot-scope="text, record,index">
        <span>{{ index+1 }}</span>
      </template>
      <template slot="operation"
                slot-scope="text, record">
        <a @click="edit(record)">{{ record.rolename==='超级管理员'?'':'编辑' }}</a>
      </template>
    </a-table>
    <!-- 人员弹窗 -->
    <a-modal v-if="isModal"
             ref="modalBlack"
             :title="modalTitle"
             v-model="isModal"
             :mask-closable="false"
             :width="332"
             :closable="false"
             ok-text="确定"
             cancel-text="取消">
      <a-form :form="form"
              hide-required-mark>
        <a-form-item v-if="isAdd"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="角色">
          <a-select v-model="addroleid"
                    style="width: 100%">
            <a-select-option v-for="item in roleList"
                             :key="item.id"
                             :value="item.id">
              {{ item.rolename }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="isEdit"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="角色">
          <a-select v-model="current.roleid"
                    style="width: 100%">
            <a-select-option v-for="item in roleList"
                             :key="item.id"
                             :value="item.id">
              {{ item.rolename }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="名称">
          <a-input v-decorator="[ `displayname`,{
            initialValue: current.displayname,
            rules: [{ required: true, message: '请输入用户名称' }],} ]" />
        </a-form-item>
        <a-form-item v-if="isAdd"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="账号">
          <a-input v-decorator="[ `accountname`,{
            initialValue: current.accountname,
            rules: [{ required: true, message: '请输入正确手机号', pattern:accountVer }],} ]" />
        </a-form-item>
        <a-form-item v-if="isEdit"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="账号">
          <a-input v-decorator="[ `accountname`,{
                   initialValue: current.accountname} ]"
                   :disabled = "true"/>
        </a-form-item>
        <a-form-item v-if="isEdit"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 12 }"
                     :colon="false"
                     label="密码">
          <a-input v-decorator="[ `accountpwd`,{
                     initialValue: current.accountpwd,
                     rules: [{ required: true, message: '请输入密码' }],} ]"
                   type="password"
                   style="width: 56%;margin-right: 5px"/>
          <a-button key="submit"
                    type="primary"
                    style="padding: 0 6px;font-size: 10px;line-height: 1.699"
                    @click="resetPwd">重置为初始密码</a-button>
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
                  @click="handleOk">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import service from 'servicePath/index';
  import Mix from '@/mixins';
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

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
      title: '账号',
      dataIndex: 'accountname',
      width: '10%',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'displayname',
      width: '10%',
      align: 'center',
    },
    {
      title: '角色',
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
    name: 'UserList',
    mixins: [PageTableCreaterMix('userList')],
    data() {
      return {
        form: this.$form.createForm(this),
        isModal: false,
        isEdit: false,
        isAdd: false,
        roleid: this.roleList && this.roleList[0] && this.roleList[0].id,
        installerid: '',
        addroleid: null,
        roleList: [],
        current: {},
        accountVer: /^1[34578][0-9]{9}$/,
        columns,
      };
    },
    computed: {
      ...mapState('userManage', ['projectid']),
      modalTitle() {
        const { isEdit } = this;
        return `${isEdit ? '编辑' : '添加'}人员`;
      },
    },
    watch: {
      projectid(newVal, oldVal) {
        this.init();
        if (oldVal === null) {
          this.userListFetch();
        }
      },
    },
    created() {},
    methods: {
      init() {
        this.pagination.current = 1;
        this.userListFetch();
      },
      // 添加
      add() {
        this.isModal = true;
        this.isEdit = false;
        this.isAdd = true;
        const { projectid } = this;
        this.current = {
          pid: `${projectid}`,
        };
        this.getRole();
      },
      // 编辑
      edit(record) {
        this.isModal = true;
        this.isEdit = true;
        this.isAdd = false;
        const { projectid } = this;
        this.current = {
          ...record,
          pid: `${projectid}`,
        };
        this.getRole();
      },
      //重置密码
      resetPwd() {
        const { accountname } = this.current;
        this.form.setFieldsValue({
          accountpwd: accountname.substr(-6),
        });
      },
      // 删除
      showDelModal() {
        const that = this;
        this.$confirm({
          title: '确定要删除人员？',
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
        const { accountname, id } = this.current;
        const params = {
          ...this.current,
          accountname,
          uid: id,
        };
        userManageAsk
          .delAccounttable(params)
          .then(
            result => {
              const { errcode } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.userListFetch();
                this.isModal = false;
              }
            },
            () => {}
          )
          .catch(e => {
            console.error(e);
          });
      },
      // 确定弹窗
      handleOk() {
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          const { isEdit } = this;
          if (isEdit) {
            // 修改
            this.modUsertable(fieldsValue);
          } else {
            // 添加
            this.addUsertable(fieldsValue);
          }
        });
      },
      modUsertable(fieldsValue) {
        const { roleid, roleList, $md5 } = this;
        if (roleid) {
          const index = roleList.findIndex(v => v.id === roleid);
          if (index > -1) {
            this.rolename = roleList[index].rolename;
          }
        }
        const { displayname, accountname, accountpwd } = fieldsValue;
        const initAccountpwd = this.current.accountpwd;
        const params = {
          ...this.current,
          rolename: this.rolename,
          displayname,
          accountname,
          accountpwd: initAccountpwd === accountpwd ? accountpwd : $md5(accountpwd),
        };
        userManageAsk
          .modAccounttable(params)
          .then(
            result => {
              const { errcode } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.userListFetch();
                this.isModal = false;
              }
            },
            () => {}
          )
          .catch(e => {
            console.error(e);
          });
      },
      addUsertable(fieldsValue) {
        const { roleList, addroleid, $md5 } = this;
        if (addroleid) {
          const index = roleList.findIndex(v => v.id === addroleid);
          if (index > -1) {
            this.rolename = roleList[index].rolename;
          }
        }
        const { displayname, accountname } = fieldsValue;
        const params = {
          ...this.current,
          rolename: this.rolename,
          roleid: `${addroleid}`,
          displayname,
          accountname,
          accountpwd: $md5(accountname.substr(-6)),
        };
        userManageAsk
          .addAccounttable(params)
          .then(
            result => {
              const { errcode } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.userListFetch();
                this.isModal = false;
              }
            },
            () => {}
          )
          .catch(e => {
              console.error(e);
          });
      },
      async getRole() {
        const { projectid } = this;
        const params = {
          limit: this.GLOBAL.MAX_LEN,
          offset: 1,
          projectid: projectid,
        };
        await userManageAsk
          .getRole(params)
          .then(
            result => {
              const { errcode, data = {} } = result;
              if (errcode === 200) {
                const { alist = [] } = data;
                this.roleList = alist;
                const index = this.roleList.findIndex(v => v.rolename === '安装工');
                if (index > -1) {
                  this.installerid = this.roleList[index].id;
                }
                if (this.roleList[0]) {
                  this.addroleid = this.roleList[0].id;
                }
              } else {
                this.roleList = [];
              }
            },
            () => {}
          )
          .catch(e => {
            console.error(e);
          });
      },
      // 请求数据
      async userListFetchList(params) {
        await this.getRole();
        const { projectid, installerid } = this;
        const { errcode, data = {} } = await userManageAsk.getAccounttable({
          ...params,
          pid: projectid,
          roleid: `-${installerid}`
        });
        return { total: data.totalsize, data: data.alist };
      },
    },
  };
</script>

<style scoped>
</style>
