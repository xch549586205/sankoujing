<template>
  <div>
    <a-table :columns="columns"
             :row-key="record => record.id"
             :data-source="data"
             :loading="loading"
             :pagination="pagination"
             class="reset-pagination"
             @change="installerListChange">
      <template slot="index"
                slot-scope="text, record,index">
        <span>{{ index+1 }}</span>
      </template>
      <template slot="operation"
                slot-scope="text, record">
        <a @click="generate(record)">生成二维码</a>
        <a-divider type="vertical" />
        <a @click="edit(record)">编辑</a>
      </template>
    </a-table>
    <!-- 二维码弹窗 -->
    <a-modal v-if="isModal"
             ref="modalBlack"
             :title="modalTitle"
             v-model="isModal"
             :mask-closable="false"
             :width="400"
             :closable="true"
             class="qrcodeModal">
      <p v-show="isgenerate"
         class="settime">请设置授权有限期限</p>
      <a-range-picker v-show="isgenerate"
                      :default-value="defaultTime"
                      :format="dateFormat"
                      @change="timeChange"/>
      <div v-show="isdownload"
           class="showqrcode">
        <img :src="imgUrl"
             style="width: 50%"/>
        <span class="qrcodeTip">请使用安装APP扫码</span>
      </div>
      <template slot="footer">
        <a-button v-show="isgenerate"
                  key="submit"
                  type="primary"
                  @click="handlegenerate">生成二维码</a-button>
        <a-button v-show="isdownload"
                  type="primary"
                  @click="handledownload">
          <a :href="imgUrl"
             download="二维码.png"
             class="aUnderline">下载</a>
        </a-button>
      </template>
    </a-modal>
    <!-- 人员弹窗 -->
    <a-modal v-if="isMdl"
             ref="modalBlack"
             :title="mdlTitle"
             v-model="isMdl"
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
                     label="角色">
          <a-select :disabled = "true"
                    default-value="安装工"
                    style="width: 100%">
            <a-select-option :value="editRole">
              {{ editRole }}
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
                     :wrapper-col="{ span: 20 }"
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
                  @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import service from 'servicePath/index';
  import Mix from '@/mixins';
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
  import moment from 'moment';
  import QRCode from 'qrcode';
  import atob from 'atob';
  import Blob from 'blob';


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
      title: '二维码时效',
      dataIndex: 'vetimestr',
      width: '20%',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: '20%',
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
    name: 'InstallerList',
    mixins: [PageTableCreaterMix('installerList')],
    data() {
      return {
        form: this.$form.createForm(this),
        isModal: false,
        isgenerate: true,
        isdownload: false,
        isMdl: false,
        isEdit: false,
        isAdd: false,
        roleList: [],
        roleid: '',
        current: {},
        accountToken: '',
        imgUrl: '',
        dateFormat: 'YYYY/MM/DD',
        defaultTime: [],
        qrcodeTime: [],
        editRole: '安装工',
        accountVer: /^1[34578][0-9]{9}$/,
        columns,
      };
    },
    computed: {
      ...mapState('userManage', ['projectid']),
      mdlTitle() {
        const { isEdit } = this;
        return `${isEdit ? '编辑' : '添加'}人员`;
      },
      modalTitle() {
        return '安装APP授权';
      }
    },
    watch: {
      projectid(newVal, oldVal) {
        this.init();
        if (oldVal === null) {
          this.installerListFetch();
        }
      },
    },
    methods: {
      moment,
      init() {
        this.pagination.pageSize = this.GLOBAL.MAX_LEN;
        this.installerListFetch();
      },
      // 添加
      add() {
        this.isMdl = true;
        this.isAdd = true;
        this.isEdit = false;
        const { projectid } = this;
        this.current = {
          pid: `${projectid}`
        };
        this.getRole();
      },
      // 编辑
      edit(record) {
        this.isMdl = true;
        this.isEdit = true;
        this.isAdd = false;
        const { projectid } = this;
        this.current = {
          ...record,
          pid: `${projectid}`
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
      // 生成
      generate(record) {
        this.current = {
          ...record,
        };
        this.isModal = true;
        this.isgenerate = true;
        this.isdownload = false;
        const { dateFormat } = this;
        const { validtime, expiretime, vetimestr } = this.current;
        if (vetimestr && vetimestr != '-') {
          this.defaultTime = [moment(validtime, dateFormat), moment(expiretime, dateFormat)];
        } else {
          this.defaultTime = [];
        }
      },
      //删除
      showDelModal(record) {
        const that = this;
        this.$confirm({
          title: '确定要删除人员？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            that.del(record);
          },
          onCancel() {},
        });
      },
      //取消
      handleCancel() {
        this.isMdl = false;
      },
      //删除
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
                this.installerListFetch();
                this.isMdl = false;
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
            // 编辑
            this.modInstallertable(fieldsValue);
          } else {
            // 添加
            this.addInstallertable(fieldsValue);
          }
        });
      },
      modInstallertable(fieldsValue) {
        const { $md5 } = this;
        const { displayname, accountpwd } = fieldsValue;
        const initAccountpwd = this.current.accountpwd;
        const params = {
          ...this.current,
          roleid: `${this.roleid}`,
          displayname,
          accountpwd: initAccountpwd === accountpwd ? accountpwd : $md5(accountpwd),
        };
        userManageAsk
          .modAccounttable(params)
          .then(
            result => {
              const { errcode } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.installerListFetch();
                this.isMdl = false;
              }
            },
            () => {}
          )
          .catch(e => {
            console.error(e);
          });
      },
      addInstallertable(fieldsValue) {
        const { $md5 } = this;
        const { displayname, accountname } = fieldsValue;
        const params = {
          ...this.current,
          roleid: `${this.roleid}`,
          displayname,
          accountname,
          accountpwd: $md5(accountname.substr(-6))
        };
        userManageAsk
          .addAccounttable(params)
          .then(
            result => {
              const { errcode } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.installerListFetch();
                this.isMdl = false;
              }
            },
            () => {}
          )
          .catch(e => {
            console.error(e);
          });
      },
      //生成二维码
      async handlegenerate() {
        const { projectid, qrcodeTime, defaultTime } = this;
        const { id, accountpwd, accountname } = this.current;
        console.log('qrcodeTime', qrcodeTime);
        if (qrcodeTime.length !== 0) {
          await this.getQRcodeTime(id, accountname, projectid, qrcodeTime);
          this.generateQRcode(accountpwd, accountname);
        } else if (defaultTime.length !== 0) {
          console.log('defaultTime', defaultTime);
          const params = {
            id,
            accountname,
            pid: `${projectid}`,
            validtime: defaultTime[0].format(this.GLOBAL.TIME_EFFECETIVE),
            expiretime: defaultTime[1].format(this.GLOBAL.TIME_EFFECETIVE)
          };
          await userManageAsk
            .modAccounttable(params)
            .then(
              result => {
                const { errcode } = result;
                if (errcode === 200) {
                  this.installerListFetch();
                }
              },
              () => {}
            )
            .catch(e => {
              console.error(e);
            });
          this.generateQRcode(accountpwd, accountname);
        }
      },
      //二维码时效
      getQRcodeTime(id, accountname, projectid, qrcodeTime) {
        const params = {
          id,
          accountname,
          pid: `${projectid}`,
          validtime: qrcodeTime[0].format(this.GLOBAL.TIME_EFFECETIVE),
          expiretime: qrcodeTime[1].format(this.GLOBAL.TIME_EFFECETIVE)
        };
        userManageAsk
          .modAccounttable(params)
          .then(
            result => {
              const { errcode } = result;
              if (errcode === 200) {
                this.installerListFetch();
              }
            },
            () => {}
          )
          .catch(e => {
            console.error(e);
          });
      },
      //显示二维码
      generateQRcode(accountpwd, accountname) {
        console.log('accountname', accountname);
        const qrcodeText = accountname + ',' + accountpwd;
        QRCode.toDataURL(JSON.stringify(qrcodeText))
          .then(url => {
            console.log(url);
            this.imgUrl = url;
            this.isgenerate = false;
            this.isdownload = true;
          })
          .catch(err => {
            console.error(err);
          });
      },
      //二维码时效
      timeChange(date) {
        console.log('date', date);
        this.qrcodeTime = date;
      },
      //下载
      handledownload() {
        const { imgUrl } = this;
        if (imgUrl) {
          if (window.navigator.msSaveOrOpenBlob) {
            const bstr = atob(imgUrl.split(',')[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n) {
              n -= 1;
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr]);
            window.navigator.msSaveOrOpenBlob(blob, '二维码.png');
          }
        }
      },
      //获取角色
      getRole() {
        const { projectid } = this;
        const params = {
          limit: this.GLOBAL.MAX_LEN,
          offset: 1,
          projectid: projectid,
        };
        userManageAsk
          .getRole(params)
          .then(
            result => {
              const { errcode, data = {} } = result;
              if (errcode === 200) {
                const { alist = [] } = data;
                this.roleList = alist;
                const index = this.roleList.findIndex(v => v.rolename === '安装工');
                if (index > -1) {
                  this.roleid = this.roleList[index].id;
                  console.log('roleid为', this.roleid);
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
      async installerListFetchList(params) {
        const { projectid } = this;
        const { errcode, data = {} } = await userManageAsk.getAccounttable({
          ...params,
          pid: projectid,
        });
        const installerList = data.alist && data.alist.filter(v => v.rolename === '安装工');
        return { total: data.totalsize, data: installerList };
      },
    }
  };
</script>

<style scoped>
  .qrcodeModal{
  text-align: center;
  }
  .showqrcode{
    text-align: center;
  }
  .qrcodeTip{
    display: block;
  }
  .aUnderline{
    text-decoration: none;
  }
</style>
