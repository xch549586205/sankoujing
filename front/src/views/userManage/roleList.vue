<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-02-22 13:48:54
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-modal
      v-model="permissionModal.show"
      :visible="true"
      title="设备权限"
      @ok="handleOkCheck"
      @cancel="handleCancel"
    >
      <a-tree :tree-data="treeData" :checked-keys="checkedDevices" checkable @check="onCheck">
      </a-tree>
    </a-modal>
    <a-table
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="data"
      :loading="loading"
      :pagination="pagination"
      class="reset-pagination"
      @change="roleListChange"
    >
      <template slot="index" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </template>
      <template slot="devicePermission" slot-scope="text, record">
        <a @click="openModal(record)"> 详情</a>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a @click="edit(record)">编辑</a>
      </template>
    </a-table>
    <!-- 人员弹窗 -->
    <a-modal
      v-if="isModal"
      ref="modalBlack"
      :title="modalTitle"
      v-model="isModal"
      :mask-closable="false"
      :width="800"
      :closable="false"
      ok-text="确定"
      cancel-text="取消"
    >
      <a-form :form="form" hide-required-mark>
        <a-form-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          :colon="false"
          label="名称"
        >
          <a-input
            v-decorator="[
              `rolename`,
              {
                initialValue: current.rolename,
                rules: [{ required: true, message: '请输入角色名称' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          :colon="false"
          label="登录类型"
        >
          <a-checkbox-group
            v-model="checkedList"
            :options="plainOptions"
            @change="loginTypeChanged"
          />
        </a-form-item>
        <a-form-item
          v-if="hasWXX"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          :colon="false"
          label="微信小程序"
        >
          <a-row>
            <a-col :span="4">
              <span>appid</span>
            </a-col>
            <a-col :span="12">
              <a-input v-model="remark.wxx.appid" />
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="4">
              <span>appsecret</span>
            </a-col>
            <a-col :span="12">
              <a-input v-model="remark.wxx.appsecret" />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item
          v-if="hasWXG"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          :colon="false"
          label="微信公众号"
        >
          <a-row>
            <a-col :span="4">
              <span>appid</span>
            </a-col>
            <a-col :span="12">
              <a-input v-model="remark.wxg.appid" />
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="4">
              <span>appsecret</span>
            </a-col>
            <a-col :span="12">
              <a-input v-model="remark.wxg.appsecret" />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          :colon="false"
          label="权限"
        >
          <a-row>
            <a-col :span="12">
              <span>api权限</span>
              <a-checkbox-group v-model="selected1" class="modal-border-panel">
                <a-row v-for="item in apiList" :key="item.id" class="mb10">
                  <a-checkbox :value="item.id">{{ item.urlname }}</a-checkbox>
                </a-row>
              </a-checkbox-group>
            </a-col>
            <a-col :span="12">
              <span>网页权限</span>
              <a-checkbox-group v-model="selected2" class="modal-border-panel">
                <a-row v-for="item in webList" :key="item.id" class="mb10">
                  <a-checkbox :value="item.id">{{ item.urlname }}</a-checkbox>
                </a-row>
              </a-checkbox-group>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button v-show="current.id" type="danger" @click="showDelModal">删除</a-button>
        <a-button key="submit" type="primary" @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';
import { getDevice, getGroup } from '@/util.js';
import Mix from '@/mixins';

const { deviceManageAsk } = service;

function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
  console.log('It is not a string!');
}
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
    title: '设备权限',
    width: '10%',
    scopedSlots: { customRender: 'devicePermission' },
  },
  {
    title: '操作',
    dataIndex: 'operate',
    align: 'left',
    scopedSlots: { customRender: 'operation' },
  },
];
const plainOptions = [
  { label: '网页', value: 'web' },
  { label: '安卓', value: 'android' },
  { label: '苹果', value: 'ios' },
  { label: '微信小程序', value: 'wxx' },
  { label: '微信公众号', value: 'wxg' },
  { label: '第三方登录', value: '3rd' },
];
export default {
  name: 'RoleList',
  mixins: [PageTableCreaterMix('roleList')],
  data() {
    return {
      treeData: [],
      allDevices: [],
      checkedDevices: [],
      form: this.$form.createForm(this),
      isModal: false,
      urlSiteList: [],
      selected: [],
      selected1: [],
      selected2: [],
      ruids: [],
      current: {},
      checkedList: [],
      columns,
      plainOptions,
      remark: { wxg: {}, wxx: {} },
      permissionModal: {
        show: false,
      },
    };
  },

  computed: {
    ...mapState('app', ['userInfo', 'projectInfo']),

    hasWXX() {
      return this.checkedList.findIndex((item) => item === 'wxx') > -1;
    },
    hasWXG() {
      return this.checkedList.findIndex((item) => item === 'wxg') > -1;
    },
    modalTitle() {
      const { current } = this;
      return `${current.id ? '编辑' : '添加'}角色`;
    },
    apiList() {
      return this.urlSiteList.filter((item) => {
        return item.status === 1;
      });
    },
    webList() {
      return this.urlSiteList.filter((item) => {
        const { modules = [] } = this.projectInfo;

        return item.status === 2 && modules.findIndex((m) => m.urlid === item.id) > -1;
      });
    },
    ...mapState('app', ['projectInfo']),
  },

  watch: {
    selected(selected) {
      this.selected1 = [];
      this.selected2 = [];
      console.log('select', this.urlSiteList);
      selected.forEach((v) => {
        let url = this.urlSiteList.find((item) => item.id === v);
        if (url) {
          // console.log(url)
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
    this.getTreeData();
  },
  methods: {
    openModal(record) {
      this.permissionModal = { show: true, rolename: record.rolename };
      const checkedDevices = [];
      if (this.allDevices.length) {
        this.allDevices.map((device) => {
          if (device.worker.indexOf(record.rolename) !== -1) {
            checkedDevices.push(device.id);
          }
        });
      }
      this.checkedDevices = checkedDevices;
    },
    onCheck(select) {
      const filterGroupAndGateway = select.filter((s) => s.indexOf('isGroup') === -1);
      this.checkedDevices = filterGroupAndGateway;
    },
    async handleOkCheck() {
      const promiseList = [];
      const { id } = this.projectInfo;
      const authInfo = JSON.parse(localStorage[`userInfoB_${id}`]);
      this.allDevices.map((deviceInfo) => {
        const modDevParams = {
          id: deviceInfo.id,
          did: deviceInfo.did,
          sdid: deviceInfo.sdid,
          spid: deviceInfo.spid,
          displayname: deviceInfo.displayname,
          privatedata: deviceInfo.privatedata,
          productid: deviceInfo.productid,
          projectid: deviceInfo.projectid,
          platform: deviceInfo.platform,
          longitude: deviceInfo.longitude,
          latitude: deviceInfo.latitude,
        };
        const isCheck = this.checkedDevices.indexOf(deviceInfo.id) !== -1;

        if (isCheck) {
          if (
            deviceInfo.worker &&
            deviceInfo.worker.indexOf('^^') !== -1 &&
            deviceInfo.worker.split('^^')[1]
          ) {
            const worker =
              deviceInfo.worker.split('^^')[0] || deviceInfo.worker || authInfo.accountname;
            const roleList = deviceInfo.worker.split('^^')[1].split('__');
            // 如果当前角色没有该设备的权限
            if (roleList.indexOf(this.permissionModal.rolename) === -1 && isCheck) {
              roleList.push(this.permissionModal.rolename);
              promiseList.push(
                this.modDevice({
                  ...modDevParams,
                  worker: `${worker}^^${roleList.join('__')}`,
                })
              );
            }
          } else {
            promiseList.push(
              this.modDevice({
                ...modDevParams,
                worker: `${deviceInfo.worker || authInfo.accountname}^^${
                  this.permissionModal.rolename
                }`,
              })
            );
          }
        }
        // 如果当前角色之前有该设备的权限， 现在取消该设备的权限
        if (deviceInfo.worker.indexOf(this.permissionModal.rolename) !== -1 && !isCheck) {
          const worker = deviceInfo.worker.split('^^')[0] || deviceInfo.worker || authInfo.accountname
          const roleList = deviceInfo.worker.split('^^')[1].split('__');
          roleList.splice(roleList.indexOf(this.permissionModal.rolename), 1);
          promiseList.push(
            this.modDevice({
              ...modDevParams,
              worker: `${worker || authInfo.accountname}${
                roleList.length ? '^^' : ''
              }${roleList.join('__')}`,
            })
          );
        }
      });
      await Promise.all(promiseList);
      this.permissionModal = { show: false };
      this.$message.success('设置成功!');
      this.getAllDevice();
    },
    modDevice(params) {
      return deviceManageAsk.modDevice({
        ...params,
      });
    },
    async getAllDevice() {
      const allDevices = (await getDevice({ noWorker: true })).deviceInfos;
      this.allDevices = allDevices;
      return allDevices;
    },
    async getTreeData() {
      try {
        let tree = [];
        // 获取地址
        const level1List = await getGroup();
        // 获取配电箱
        if (level1List && level1List.length) {
          tree = await Promise.all(
            level1List.map(async (level1) =>
              (async () => {
                const children = await getGroup(level1.id);
                return {
                  ...level1,
                  title: level1.name,
                  key: `${level1.id}-isGroup`,
                  children: children
                    ? children.map((level2) => ({
                        title: level2.name,
                        key: `${level2.id}-isGroup`,
                        ...level2,
                      }))
                    : [],
                };
              })()
            )
          );
          const allDevices = await this.getAllDevice();
          // 获取网关
          tree.map((level1) => {
            if (level1.children) {
              level1.children.map((level2, i) => {
                const children = [...allDevices].filter(
                  (device) => device.groupid === level2.id && device.devicetype === 'gateway'
                );
                level1.children[i].children = children.map((gateway) => ({
                  ...gateway,
                  key: `${gateway.id}`,
                  title: gateway.displayname,
                }));
              });
            }
          });
          // 获取网关内的设备
          tree.map((level1) => {
            if (level1.children) {
              level1.children.map((level2, i) => {
                level2.children.map((gateway, j) => {
                  const children = [...allDevices].filter(
                    (device) =>
                      device.devicetype === 'device' &&
                      JSON.parse(device.privatedata).gatewayId === gateway.did
                  );
                  level1.children[i].children[j].children = children.map((gateway) => ({
                    ...gateway,
                    key: gateway.id,
                    scopedSlots: {
                      title: 'custom',
                    },
                    title: gateway.displayname,
                  }));
                });
              });
            }
          });
          this.treeData = tree;
        }
      } catch (error) {
        console.error(error);
      }
    },
    loginTypeChanged(e) {
      console.log(e);
    },
    // 添加
    add() {
      this.checkedList = [];
      this.isModal = true;
      this.current = {};
      this.remark = { wxg: {}, wxx: {} };
      this.getAllUrl();
    },
    // 编辑
    async edit(record) {
      this.checkedList = [];
      this.isModal = true;
      this.current = {
        ...record,
      };
      try {
        let remark = JSON.parse(record.remark);
        this.remark = Object.assign({ wxg: {}, wxx: {} }, remark);
      } catch (error) {
        console.error('remark', error);
        this.remark = { wxg: {}, wxx: {} };
      }
      this.checkedList = this.current.logintype;
      await this.getAllUrl();
      const { id } = this.current;
      const params = {
        rid: `${id}`,
      };
      userManageAsk
        .getRU(params)
        .then((result) => {
          const { errcode, data = {} } = result;
          if (errcode === 200) {
            const { alist = [] } = data;
            this.selected = alist && alist.map((v) => v.urlid);
            this.ruids = alist && alist.map((v) => v.id);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 获取权限
    getAllUrl() {
      const params = {
        limit: this.GLOBAL.MAX_LEN,
        offset: 1,
      };
      userManageAsk
        .getUrlsite(params)
        .then((result) => {
          const { errcode, data = {} } = result;
          if (errcode === 200) {
            const { alist = [] } = data;
            this.urlSiteList = alist;
          } else {
            this.urlSiteList = [];
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 删除
    showDelModal(record) {
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
          that.del(record);
        },
        onCancel() {},
      });
    },
    // 确定弹窗
    handleOk() {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        const { current } = this;
        console.log('checkedList', this.checkedList);
        fieldsValue.logintype = this.checkedList;
        if (!this.hasWXX) {
          delete this.remark.wxx;
        }
        if (!this.hasWXG) {
          delete this.remark.wxg;
        }
        let remark = '';
        try {
          remark = JSON.stringify(this.remark);
        } catch (error) {
          console.error('remark', error);
        }
        this.current = {
          ...current,
          rolename: fieldsValue.rolename,
          logintype: fieldsValue.logintype,
          remark,
        };
        if (current.id) {
          // 编辑
          this.modRoletable();
        } else {
          // 添加
          this.addRoletable();
        }
      });
    },
    // 取消
    handleCancel() {
      this.selected = [];
      this.selected2 = [];
      this.selected1 = [];
      this.isModal = false;
    },
    // 添加
    async addRoletable() {
      const roleid = await this.addRole();
      this.roleListFetch();
      this.modRoleUrl(roleid);
    },
    // 添加角色
    async addRole() {
      const params = {
        rolename: this.current.rolename,
        status: 2,
        logintype: this.current.logintype,
      };
      return userManageAsk
        .addRole(params)
        .then((result) => {
          const { errcode, data = {} } = result;
          if (errcode === 200) {
            return `${data.uid}`;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 编辑
    modRoletable() {
      const { id, rolename, logintype, remark } = this.current;
      const Params = {
        id,
        rolename,
        logintype,
        remark,
      };
      userManageAsk
        .modRole(Params)
        .then((result) => {
          const { errcode } = result;
          if (errcode === 200) {
            this.roleListFetch();
            this.modRoleUrl(id);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 删除
    del() {
      const { id } = this.current;
      const params = {
        uid: id,
      };
      userManageAsk
        .delRole(params)
        .then((result) => {
          const { errcode } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.formatPagination();
            this.roleListFetch();
            this.handleCancel();
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 解绑再绑定
    async modRoleUrl(id) {
      const { ruids, selected1, selected2 } = this;
      let selected = [];
      selected.push(...selected1, ...selected2);
      const params = {
        ruids,
        roleid: id,
      };
      const urlParams = {
        roleid: id,
        urlid: selected,
      };
      // 解绑
      userManageAsk
        .unbindRU(params)
        .then((result) => {
          const { errcode } = result;
          if (errcode === 200) {
            if (selected.length !== 0) {
              // 重新绑定
              userManageAsk.bindRU(urlParams).catch((e) => {
                console.error(e);
              });
            }
            this.$message.success('操作成功！');
            this.handleCancel();
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    // 请求数据
    async roleListFetchList(params) {
      const { errcode, data = {} } = await userManageAsk.getRole({
        ...params,
        order: 'id',
      });
      return { total: data.totalsize, data: data.alist };
    },
  },
};
</script>

<style lang="less" scoped>
.card {
  .content {
    margin: 16px;
  }
}
</style>
