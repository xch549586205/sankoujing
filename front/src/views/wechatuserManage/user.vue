<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-16 17:33:56
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
             @change="wechatUserListChange">
      <template slot="index"
                slot-scope="text, record,index">
        <span>{{ index+1 }}</span>
      </template>
      <template slot="balance" slot-scope="text, record">
          <span class="extra mt10">{{ record.balance/100 }}</span>
        </template>
      <template slot="scores" slot-scope="text">
          <span class="extra mt10">{{ text ? text : 0}}</span>
        </template>
       <template slot="roletype"
                slot-scope="text, record">
          <span>{{ record.roletype | roletype }}</span>
      </template>
      <template slot="operation"
                slot-scope="text, record">
        <a @click="edit(record)">{{ '修改角色' }}</a>
      </template>
    </a-table>
    <!-- 人员弹窗 -->
    <a-modal v-if="isModal"
             ref="modalBlack"
             title="用户信息修改"
             v-model="isModal"
             :mask-closable="false"
             :width="332"
             :closable="false"
             ok-text="确定"
             cancel-text="取消">
      <a-form :form="form"
              hide-required-mark>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="昵称">
          <span>{{current.nickname}}</span>
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="openid">
          <span>{{current.openid}}</span> 
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="类型">
          <a-select v-model="current.roletype"
                    style="width: 100%">
            <a-select-option v-for="(item,index) in roleList"
                             :key="index"
                             :value="item.key">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
      <template slot="footer">
        <a-button key="back"
                  @click="handleCancel">取消</a-button>
        <!-- <a-button v-show="current.id"
                  type="danger"
                  @click="showDelModal">删除</a-button> -->
        <a-button key="submit"
                  type="primary"
                  @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import service from 'servicePath/index';
  import Mix from '@/mixins';
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

  const { wechatuserManageAsk } = service;
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
      title: 'openid',
      dataIndex: 'openid',
      width: '20%',
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: '10%',
      align: 'center',
    },
    {
      title: '余额（元）',
      dataIndex: 'balance',
      width: '10%',
      align: 'center',
      scopedSlots: { customRender: 'balance' },
    },
    {
      title: '积分',
      dataIndex: 'scores',
      width: '10%',
      align: 'center',
      scopedSlots: { customRender: 'scores' },
    },
    {
      title: '类型',
      dataIndex: 'roletype',
      width: '10%',
      align: 'center',
      scopedSlots: { customRender: 'roletype' },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: '30%',
      align: 'center',
      scopedSlots: { customRender: 'operation' },
    },
  ];
  export default {
    name: 'UserList',
    mixins: [PageTableCreaterMix('wechatUserList')],
    data() {
      return {
        form: this.$form.createForm(this),
        isModal: false,
        installerid: '',
        roleList: [
          {
            key: 'payment',
            label: '付费用户'
          },
          {
            key: 'test',
            label: '测试用户'
          }
        ],
        current: {},
        accountVer: /^1[34578][0-9]{9}$/,
        columns,
      };
    },
    filters: {
      roletype : function (params) {

        let str = ''
        switch (params) {
          case 'payment':
            str = '付费用户'
            break;
          case 'test':
            str = '测试用户'
            break;
          default:
            str = '受限用户'
          break;
        } 
        return str
      }
    },
    computed: {
      ...mapState('app', ['userInfo', 'projectInfo']),
    },
    methods: {
      ...mapMutations('app', ['setUserInfo']),
      doSearch() {
        this.init();
      },

      // 编辑
      async edit(record) {
        this.isModal = true;
        this.current = {
          ...record,
        };
       
      },

      // 删除
      showDelModal() {
        const { id } = this.current;
        if (id === this.userInfo.id) {
          this.$message.warning('不能删除自己的账户!');
          return;
        }
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
          pid: `${this.projectInfo.id}`,
        };
        userManageAsk
          .delAccounttable(params)
          .then(result => {
            const { errcode } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.formatPagination();
              this.wechatUserListFetch();
              this.isModal = false;
            }
          })
          .catch(e => {
            console.error(e);
          });
      },
      // 确定弹窗
      handleOk() {

          wechatuserManageAsk.changeRoletype({openid: this.current.openid, roletype: this.current.roletype}).then(result => {
            const { errcode } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.wechatUserListFetch();
              this.isModal = false;
            }
          }).catch(err => {
              this.isModal = false;
          })
      },

      // 请求数据
      async wechatUserListFetchList(params) {
        const { roleID, displayName } = this;
        const { errcode, data = {} } = await wechatuserManageAsk.wechatuserList({
          ...params,
          order: 'id',
          seq: 1
        });
        return { total: data.totalsize, data: data.users };
      },
    },
  };
</script>

<style scoped>
</style>
