<template>
  <div>
    <a-modal :title="modalTitle"
             v-model="isModal"
             :mask-closable="false"
             :width="400"
             :footer="null"
             ok-text="确定"
             cancel-text="取消"
             @cancel="cancel">
      <a-form :form="form"
              hide-required-mark>
        <a-form-item :label-col="labelCol"
                     :wrapper-col="wrapperCol"
                     :colon="false"
                     label="名称">
          <a-input v-decorator="formRules.name" />
        </a-form-item>
        <a-form-item :label-col="labelCol"
                     :wrapper-col="wrapperCol"
                     :colon="false"
                     label="编码">
          <a-input v-decorator="formRules.code" />
        </a-form-item>
      </a-form>
      <div class="modal-footer-btn-right">
        <a-button class="mr10"
                  @click="cancel">取消</a-button>
        <a-button v-if="data.id"
                  type="danger"
                  class="mr10"
                  @click="showDelModal">删除</a-button>
        <a-button type="primary"
                  @click="ok">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
  import service from 'servicePath/index';

  const { platformManageAsk } = service;
  export default {
    name: 'MoreModal',
    components: {},
    props: {
      data: {
        type: Object,
        default: () => {},
        required: true,
      },
    },
    data() {
      return {
        form: this.$form.createForm(this),
        isModal: true,
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
        url: { ...this.data },
        disabled: !!this.data.id,
        formRules: {
          name: [
            'name',
            {
              initialValue: this.data.name,
              rules: [
                {
                  required: true,
                  message: '请输入名称长度不超过20个字符',
                  max: this.GLOBAL.NAME_MAX_LEN,
                },
              ],
            },
          ],
          code: [
            'code',
            {
              initialValue: this.data.code,
              rules: [{ required: true, message: '请输入URL', max: 255 }],
            },
          ],
        },
      };
    },
    computed: {
      ...mapState('projectManage', ['projectList']),
      modalTitle() {
        const { id } = this.data;
        return `${id ? '编辑' : '添加'}平台`;
      },
    },
    watch: {},
    created() {
      console.log(this.data);
    },
    mounted() {},
    methods: {
      // 删除提示
      showDelModal(record) {
        const that = this;
        this.$confirm({
          title: '确定删除该平台？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            that.del(record);
          },
          onCancel() {},
        });
      },
      // 关闭弹窗
      cancel() {
        this.$emit('cancel');
      },
      // 确定
      ok() {
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          const { name, code } = fieldsValue;
          console.log('this.url ', this.url);
          this.url = {
            ...this.url,
            name,
            code,
          };
          const { id } = this.url;
          if (id) {
            // 编辑
            this.mod();
          } else {
            // 添加
            this.add();
          }
        });
      },
      // 添加
      add() {
        const params = {
          ...this.url,
        };
        platformManageAsk
          .addPlatform(params)
          .then(
            (result) => {
              const { errcode } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.$emit('ok');
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
      // 添加
      mod() {
        const params = {
          ...this.url,
        };
        platformManageAsk
          .modPlatform(params)
          .then(
            (result) => {
              const { errcode } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.$emit('ok');
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
      // 删除
      del() {
        const { id, projectid } = this.url;
        const params = {
          id: id,
        };
        platformManageAsk
          .delPlatform(params)
          .then(
            (result) => {
              const { errcode } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.$emit('del');
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
    },
  };
</script>

<style lang="less" scoped>
</style>
