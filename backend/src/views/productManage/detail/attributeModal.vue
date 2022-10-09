<template>
  <a-modal v-model="isModal"
           :mask-closable="false"
           :width="720"
           :footer="null"
           :title="modalTitle"
           ok-text="确定"
           cancel-text="取消"
           @cancel="cancel">
    <a-row type="flex"
           align="middle">
      <a-col :span="11">
        <a-form :form="form"
                hide-required-mark>
          <a-form-item :label-col="labelCol"
                       :wrapper-col="wrapperCol"
                       :colon="false"
                       label=" ">
            <span class="title">云端属性</span>
          </a-form-item>
          <a-form-item :label-col="labelCol"
                       :wrapper-col="wrapperCol"
                       :colon="false"
                       label="属性名称">
            <a-input v-decorator="formRules.displayname" />
          </a-form-item>
          <a-form-item :label-col="labelCol"
                       :wrapper-col="wrapperCol"
                       :colon="false"
                       label="属性参数">
            <a-input v-decorator="formRules.dnakit" />
          </a-form-item>
          <a-form-item :label-col="labelCol"
                       :wrapper-col="wrapperCol"
                       :colon="false"
                       label="参数类型">
            <a-select v-model="attribute.valuetype">
              <a-select-option v-for="item in valueType"
                               :key="item.value"
                               :value="item.value">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label-col="labelCol"
                       :wrapper-col="wrapperCol"
                       :colon="false"
                       label="操作类型"
                       @change="selectOperationType">
            <a-select v-model="attribute.operationtype">
              <a-select-option v-for="item in operationType"
                               :key="item.value"
                               :value="item.value">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label-col="labelCol"
                       :wrapper-col="wrapperCol"
                       :colon="false"
                       label="属性值">
            <a-tooltip placement="topLeft"
                       title="例：(1)连续性：0-100；(2)枚举型：ON,OFF；(3)字符型：poweron">
              <a-input v-decorator="formRules.dnavalue" />
            </a-tooltip>
          </a-form-item>
          <a-form-item v-if="attribute.valuetype==2"
                       :label-col="labelCol"
                       :wrapper-col="wrapperCol"
                       :colon="false"
                       label="属性名称">
            <a-tooltip placement="topLeft"
                       title="例：属性值为：ON,OFF；属性名称为：开,关">
              <a-input placeholder="例如：开,关"
                       v-decorator="formRules.openname" />
            </a-tooltip>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="4"
             class="link-icon theme-color">
        <div class="iconfont iconbianzu1"></div>
      </a-col>
      <a-col :span="8">
        <a-form :form="form"
                hide-required-mark>
          <a-form-item :label-col="{span:0}"
                       :wrapper-col="{span:24}"
                       :colon="false"
                       label=" ">
            <span class="title">本地属性</span>
          </a-form-item>
          <a-form-item :label-col="{span:0}"
                       :wrapper-col="{span:24}"
                       :colon="false"
                       label="属性名称">
            <a-input :disabled="true"
                     v-decorator="formRules.displayname" />
          </a-form-item>
          <a-form-item :label-col="{span:0}"
                       :wrapper-col="{span:24}"
                       :colon="false"
                       label="属性参数">
            <a-input v-decorator="formRules.openproxy" />
          </a-form-item>
          <a-form-item :label-col="{span:0}"
                       :wrapper-col="{span:24}"
                       :colon="false"
                       label="参数类型">
            <a-select :disabled="true"
                      v-model="attribute.valuetype">
              <a-select-option v-for="item in valueType"
                               :key="item.value"
                               :value="item.value">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label-col="{span:0}"
                       :wrapper-col="{span:24}"
                       :colon="false"
                       label="操作类型">
            <a-select :disabled="true"
                      v-model="attribute.operationtype"
                      @change="selectOperationType">
              <a-select-option v-for="item in operationType"
                               :key="item.value"
                               :value="item.value">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label-col="{span:0}"
                       :wrapper-col="{span:24}"
                       :colon="false"
                       label="value">
            <a-tooltip placement="topLeft"
                       title="例：(1)连续性：0-100；(2)枚举型：ON,OFF；(3)字符型：poweron">
              <a-input v-decorator="formRules.openvalue" />
            </a-tooltip>
          </a-form-item>
          <a-form-item v-if="attribute.valuetype==2"
                       :label-col="{span:0}"
                       :wrapper-col="{span:24}"
                       :colon="false"
                       label="属性名称">
            <a-input :disabled="true"
                     v-decorator="formRules.openname" />
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

    <div class="modal-footer-btn">
      <a-button class="mr10"
                @click="cancel">取消</a-button>
      <a-button v-if="attribute.index!=null"
                type="danger"
                class="mr10"
                @click="del">删除</a-button>
      <a-button type="primary"
                @click="ok">确定</a-button>
    </div>
  </a-modal>
</template>
<script>
  import { mapState, mapGetters, mapMutations } from 'vuex';
  import service from 'servicePath/index';

  const { productManageAsk } = service;

  export default {
    name: 'AttributeDetail',
    components: {},
    props: {
      data: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        attribute: { ...this.data },
        isModal: true,
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
        form: this.$form.createForm(this),
        formRules: {
          displayname: [
            'displayname',
            {
              initialValue: this.data.displayname,
              rules: [{ required: true, message: '请输入属性名称' }],
            },
          ],
          dnakit: [
            'dnakit',
            {
              initialValue: this.data.dnakit,
              rules: [{ required: true, message: '请输入属性参数' }],
            },
          ],
          openproxy: [
            'openproxy',
            {
              initialValue: this.data.openproxy,
              rules: [{ required: true, message: '请输入属性参数' }],
            },
          ],
          dnavalue: [
            'dnavalue',
            {
              initialValue: this.data.dnavalue,
              rules: [{ required: true, message: '请输入参数值' }],
            },
          ],
          openvalue: [
            'openvalue',
            {
              initialValue: this.data.openvalue,
              rules: [{ required: true, message: '请输入参数值' }],
            },
          ],
          dnaname: [
            'dnaname',
            {
              initialValue: this.data.dnaname,
              rules: [{ required: true, message: '请输入name' }],
            },
          ],
          openname: [
            'openname',
            {
              initialValue: this.data.openname,
              rules: [{ required: true, message: '请输入name' }],
            },
          ],
          dnanamespace: [
            'dnanamespace',
            {
              initialValue: this.data.dnanamespace,
              rules: [{ required: true, message: '请输入nameSpace' }],
            },
          ],
          opennamespace: [
            'opennamespace',
            {
              initialValue: this.data.dnanamespace,
              rules: [{ required: true, message: '请输入nameSpace' }],
            },
          ],
          dnaversion: [
            'dnaversion',
            {
              initialValue: this.data.dnaversion,
              rules: [{ required: true, message: '请输入interfaceVersion' }],
            },
          ],
          openversion: [
            'openversion',
            {
              initialValue: this.data.openversion,
              rules: [{ required: true, message: '请输入interfaceVersion' }],
            },
          ],
        },
      };
    },
    computed: {
      ...mapState('productManage', ['valueType', 'operationType']),
      modalTitle() {
        const { id } = this.attribute;
        return `${id ? '编辑' : '添加'}产品属性`;
      },
    },
    watch: {},
    created() {},
    mounted() {},
    methods: {
      // 取消
      cancel() {
        this.$emit('cancel');
      },
      // 选择操作类型
      selectOperationType(val) {
        // this.attribute=this.attribute
      },
      // 删除提示
      del() {
        this.$emit('delete', this.attribute);
      },
      // 确定
      ok() {
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          this.attribute = {
            ...this.attribute,
            ...fieldsValue,
          };
          this.$emit('ok', this.attribute);
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  .link-icon {
    text-align: center;
    font-size: 40px;
  }
</style>
