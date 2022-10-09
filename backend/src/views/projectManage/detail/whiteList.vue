<template>
  <div>
    <a-table :columns="columns"
             :row-key="record => record.id"
             :data-source="data"
             :loading="loading"
             :pagination="pagination"
             @change="whiteListChange">
      <template slot="iptype"
                slot-scope="text, record">
        <span>{{ record.iptype===1?'黑名单':'白名单' }} </span>
      </template>
      <template slot="operation"
                slot-scope="text, record">
        <a @click="edit(record)">编辑</a>
      </template>
    </a-table>
    <!-- 名单弹窗 -->
    <a-modal v-if="isModal"
             ref="modalBlack"
             :title="modalTitle"
             v-model="isModal"
             :mask-closable="false"
             :width="360"
             :closable="false"
             ok-text="确定"
             cancel-text="取消">
      <a-form :form="form"
              hide-required-mark>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="类型">
          <a-select v-model="current.iptype"
                    style="width: 100%">
            <a-select-option v-for="item in blackListStatus"
                             :key="item.value"
                             :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="IP">
          <a-input v-decorator="[ `ipstr`,{
          initialValue:current.ipstr,
          rules: [{ required: true, message: '请输入正确格式IP地址' ,pattern:ipRegExp}]} ]" />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button key="back"
                  @click="handleCancel">取消</a-button>
        <a-button v-show="current.id"
                  type="danger"
                  @click="showDelModal">删除</a-button>
        <a-button key="submit"
                  type="primary"
                  @click="handleOk">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import Mix from '@/mixins';
  import service from 'servicePath/index';
  // import { ipRegExp } from 'commonPath/utils';

  const { projectManageAsk, appAsk } = service;
  const { PageTableCreaterMix } = Mix;
  export default {
    name: 'WhiteList',
    components: {},
    mixins: [PageTableCreaterMix('whiteList')],
    props: {},
    data() {
      return {
        form: this.$form.createForm(this),
        projectid: this.$route.params.id,
        isModal: false,
        current: {},
        ipRegExp: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      };
    },
    computed: {
      ...mapState('projectManage', ['blackIptype']),
      ...mapState('projectManage', ['blackListStatus']),
      modalTitle() {
        const { id } = this.current;
        return `${id ? '修改' : '添加'}名单`;
      },
    },
    watch: {
      blackIptype(newVal, oldVal) {
        this.init();
        this.whiteListFetch();
      },
    },
    created() {},
    mounted() {},
    methods: {
      init() {
        this.pagination.current = 1;
        this.whiteListFetch();
      },
      // 表头
      whiteListColumns() {
        const columns = [
          {
            title: '类型',
            dataIndex: 'iptype',
            width: '20%',
            align: 'center',
            scopedSlots: { customRender: 'iptype' },
          },
          {
            title: 'IP',
            dataIndex: 'ipstr',
            width: '20%',
            align: 'center',
          },
          {
            title: '操作',
            dataIndex: 'operate',
            align: 'left',
            scopedSlots: { customRender: 'operation' },
          },
        ];
        return columns;
      },
      // 添加
      add() {
        this.isModal = true;
        this.current = {
          iptype: this.blackIptype || 1,
          pid: this.projectid,
        };
      },
      // 编辑
      edit(record) {
        this.isModal = true;
        this.current = {
          ...record,
          pid: this.projectid,
        };
      },
      // 删除
      showDelModal() {
        const that = this;
        this.$confirm({
          title: '确定要删除该数据？',
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
      // 确定弹窗
      handleOk() {
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          const { id } = this.current;
          const { ipstr } = fieldsValue;
          this.current = {
            ...this.current,
            ipstr,
          };
          if (id) {
            // 修改
            this.modIptable();
          } else {
            // 修改
            this.addIptable();
          }
        });
      },
      // 删除
      del(record) {
        const { id } = this.current;
        const params = {
          uid: id,
          pid: this.projectid,
        };
        appAsk
          .delIptable(params)
          .then(result => {
            const { errcode } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.whiteListFormatPagination('del');
              this.whiteListFetch();
              this.isModal = false;
            }
          })
          .catch(e => {
            console.error(e);
          });
      },
      modIptable() {
        const params = {
          ...this.current,
        };
        appAsk
          .modIptable(params)
          .then(result => {
            const { errcode } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.whiteListFetch();
              this.isModal = false;
            }
          })
          .catch(e => {
            console.error(e);
          });
      },
      addIptable() {
        const params = {
          ...this.current,
        };
        appAsk
          .addIptable(params)
          .then(result => {
            const { errcode } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.whiteListFormatPagination('add');
              this.whiteListFetch();
              this.isModal = false;
            }
          })
          .catch(e => {
            console.error(e);
          });
      },

      // 请求数据
      async whiteListFetchList(params) {
        const { blackIptype, projectid } = this;
        params.iptype = blackIptype;
        params.pid = projectid;
        const { errcode, data = {} } = await appAsk.getIptable(params);
        return { total: data.totalsize, data: data.alist };
      },
    },
  };
</script>

<style lang="less" scoped>
</style>
