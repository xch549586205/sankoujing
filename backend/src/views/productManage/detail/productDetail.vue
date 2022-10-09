<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-12 10:38:34
 * @LastEditTime: 2021-02-25 15:15:53
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-spin :spinning="spinning">
    <div>
      <bl-page-wrapper>
        <div class="header-panel" slot="header">
          <bl-header>
            <bl-breadcrumb slot="left" :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
          </bl-header>
        </div>
        <div slot="content">
          <a-form
            :form="form"
            hide-required-mark
            class="reset-line-height form-item-label-left"
            style="width:85%"
          >
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="{ span: 8 }"
              :colon="false"
              label="产品品类"
            >
              <a-row :gutter="10">
                <a-col :span="18">
                  <a-select
                    v-model="product.categoryid"
                    :disabled="!isEditable"
                    :default-value="product.categoryid"
                  >
                    <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="6">
                  <a-button type="primary" :disabled="!isEditable" @click="editCategory"
                    >编辑品类</a-button
                  >
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="{ span: 8 }"
              :colon="false"
              label="所属平台"
            >
              <a-row :gutter="10">
                <a-col :span="18">
                  <a-select v-model="product.platform" :disabled="!isEditable">
                    <a-select-option v-for="item in platformList" :key="item.key" :value="item.key">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="{ span: 8 }"
              :colon="false"
              label="产品类型"
            >
              <a-row :gutter="10">
                <a-col :span="18">
                  <a-select
                    v-model="product.devicetype"
                    :disabled="!isEditable"
                    :default-value="product.devicetype"
                  >
                    <a-select-option
                      v-for="item in devicetypeList"
                      :key="item.key"
                      :value="item.key"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="产品名称"
            >
              <a-input
                v-decorator="[
                  `productname`,
                  {
                    initialValue: product.productname,
                    rules: [
                      {
                        required: true,
                        message: '请输入产品名称长度不超过40个字符',
                        max: GLOBAL.NAME_LARGER_LEN,
                      },
                    ],
                  },
                ]"
                :disabled="!isEditable"
              />
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="产品型号"
            >
              <a-input
                v-decorator="[
                  `productversion`,
                  {
                    initialValue: product.productversion,
                    rules: [{ required: true, message: '请输入产品型号' }],
                  },
                ]"
                :disabled="!isEditable"
              />
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="产品编码"
            >
              <a-input
                v-decorator="[
                  `pid`,
                  {
                    initialValue: product.pid,
                    rules: [{ required: true, message: '请输入产品PID' }],
                  },
                ]"
                :disabled="!isEditable"
              />
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="产品属性"
            >
              <a-button type="primary" @click="addAttributes" :disabled="!isEditable"
                >添加</a-button
              >
            </a-form-item>
            <a-form-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              :colon="false"
              label=""
            >
              <a-table
                :columns="columns"
                :row-key="
                  record => `${record.name + record.dnavalue + record.openvalue + Math.random()}`
                "
                :pagination="false"
                :data-source="product.attributes"
                class="reset-table-th table-border"
                bordered
              >
                <template slot="openName" slot-scope="text, record">
                  <span>{{ record.displayname }}</span>
                </template>
                <template slot="valuetype" slot-scope="text, record">
                  <span>{{ formatValueType(record.valuetype) }}</span>
                </template>
                <template slot="openValuetype" slot-scope="text, record">
                  <span>{{ formatValueType(record.valuetype) }}</span>
                </template>
                <template slot="operationtype" slot-scope="text, record">
                  <span>{{ formatOperationType(record.operationtype) }}</span>
                </template>
                <template slot="openOperationtype" slot-scope="text, record">
                  <span>{{ formatOperationType(record.operationtype) }}</span>
                </template>
                <template slot="operation" slot-scope="text, record, index">
                  <a v-if="isEditable" @click="editAttribute(record, index)">编辑</a>
                </template>
              </a-table>
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="产品服务"
            >
              <a-button type="primary" @click="addprivate">添加</a-button>
              <div>
                <a-table
                  :columns="privatecolumns"
                  class="prrivate_table"
                  :data-source="privateDataList"
                >
                  <template v-for="col in ['name', 'value']" :slot="col" slot-scope="text, record">
                    <div :key="col">
                      <a-input
                        v-if="record.editable"
                        :value="text"
                        @change="e => handleChangePrivate(e.target.value, record.key, col)"
                      />
                      <template v-else>
                        {{ text }}
                      </template>
                    </div>
                  </template>
                  <template slot="operation" slot-scope="text, record">
                    <div class="editable-row-operations">
                      <span v-if="record.editable">
                        <a @click="() => saveprivate(record.key)">保存</a>
                        <a @click="() => delprivate(record.key)">删除</a>
                        <a @click="() => cancelprivate(record.key)">取消</a>
                      </span>
                      <span v-else>
                        <a :disabled="editingKey !== ''" @click="() => editprivate(record.key)"
                          >编辑</a
                        >
                      </span>
                    </div>
                  </template>
                </a-table>
              </div>
            </a-form-item>
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" label="">
              <a-upload
                :multiple="false"
                :disabled="!isEditable"
                :file-list="configList"
                :remove="handleRemoveConfig"
                :before-upload="beforeUploadConfig"
                accept=".xml"
                name="file"
              >
                <!-- <a-button :disabled="configList.length===1">上传配置文件</a-button> -->
              </a-upload>
            </a-form-item>
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="H5资源包"
            >
              <a-upload
                :multiple="false"
                :disabled="!isEditable"
                :file-list="fileList"
                :remove="handleRemove"
                :before-upload="beforeUpload"
                name="file"
              >
                <a-button :disabled="fileList.length === 1 || !isEditable" type="primary"
                  >上传</a-button
                >
              </a-upload>
            </a-form-item>
            <a-form-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              :colon="false"
              label=""
            >
              <a-button class="mr10" @click="cancel">取消</a-button>
              <a-button
                v-if="productId"
                class="mr10"
                type="danger"
                :disabled="!isEditable"
                @click="showDelModal"
                >删除</a-button
              >
              <a-button class="mr10" type="primary" :disabled="!isEditable" @click="ok"
                >确定
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </bl-page-wrapper>
      <CategoryModal v-if="isCategoryModal" @cancel="cancelCategory" />
      <AttributeModal
        v-if="isAttributeModal"
        :data="current"
        @cancel="cancelAttribute"
        @delete="deleteAttribute"
        @ok="okAttribute"
      />
    </div>
  </a-spin>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
import CategoryModal from './categoryModal.vue';
import AttributeModal from './attributeModal.vue';
const privateDataList = [];
const privatecolumns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: '20%',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '值',
    dataIndex: 'value',
    width: '55%',
    scopedSlots: { customRender: 'value' },
  },
  {
    title: '操作',
    width: '25%',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
];
const { appAsk, productManageAsk } = service;
export default {
  name: 'ProductDetail',
  components: {
    CategoryModal,
    AttributeModal,
  },
  props: {},
  data() {
    this.cacheData = privateDataList.map(item => ({ ...item }));
    return {
      privatecolumns,
      privateDataList,
      editingKey: '',
      form: this.$form.createForm(this),
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      breadcrumbRoutes: [],
      productId: this.$route.query.id,
      projectId: this.$route.query.projectid,
      isEditable: true,
      product: {
        attributes: [],
        platform: '',
      },
      funcs: [],
      columns: [],
      data: [],
      isCategoryModal: false,
      isAttributeModal: false,
      fileList: [],
      configList: [],
      current: {}, //  当前操作的功能
      spinning: false,
    };
  },
  computed: {
    ...mapState('productManage', ['categoryList', 'platformList', 'devicetypeList']),
    ...mapState('productManage', ['valueType', 'operationType']),
    ...mapState('projectManage', ['projectList', 'currentProjectid']),

    formatValueType() {
      return function(val) {
        if (val) {
          const item = this.valueType.filter(v => v.value === val)[0];
          return item ? item.text : '';
        }
        return '';
      };
    },
    formatOperationType() {
      return function(val) {
        if (val) {
          const item = this.operationType.filter(v => v.value === val)[0];
          return item ? item.text : '';
        }
        return '';
      };
    },
  },
  watch: {
    categoryList: {
      handler(newV, oldV) {
        const { categoryid } = this.product;
        const index = this.categoryList.findIndex(v => v.id === categoryid);
        if (index === -1) {
          this.product = Object.assign({}, this.product, { categoryid: null });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  async created() {
    this.$store.dispatch('projectManage/setCurrentProjectid', this.projectId);
    console.log('productId', this.productId, this.currentProjectid);
    this.setBreadcrumb();
    this.getColumns();
    await this.getPlatformList({ a: 1 });
    await this.setCategoryList({ projectid: this.projectId + '' });
    if (this.productId) {
      this.getDetailProduct();
    }
  },
  mounted() {},
  methods: {
    ...mapActions('productManage', ['setCategoryList', 'getPlatformList']),
    handleChange(val) {
      this.product = Object.assign({}, this.product, { categoryid: val });
    },
    // 设置面包屑
    setBreadcrumb() {
      const breadcrumbRoutes = [
        {
          name: '产品管理',
          breadcrumbName: '全部产品',
        },
      ];
      if (this.productId) {
        // 详情
        this.breadcrumbRoutes = [
          ...breadcrumbRoutes,
          {
            name: '',
            breadcrumbName: '产品详情',
          },
        ];
      } else {
        // 创建项目
        this.breadcrumbRoutes = [
          ...breadcrumbRoutes,
          {
            name: '',
            breadcrumbName: '添加产品',
          },
        ];
      }
    },
    getColumns() {
      this.columns = [
        {
          title: '云端',
          children: [
            {
              title: '名称',
              dataIndex: 'displayname',
              align: 'center',
            },
            {
              title: '属性参数',
              dataIndex: 'dnakit',
              align: 'center',
            },
            {
              title: '参数类型',
              dataIndex: 'valuetype',
              align: 'center',
              scopedSlots: { customRender: 'valuetype' },
            },
            {
              title: '操作类型',
              dataIndex: 'operationtype',
              align: 'center',
              scopedSlots: { customRender: 'operationtype' },
            },
            {
              title: '属性值',
              dataIndex: 'dnavalue',
              align: 'center',
            },
            {
              title: '属性名称',
              dataIndex: 'openname',
              align: 'center',
            },
          ],
        },
        {
          title: '本地',
          children: [
            // {
            //   title: '名称',
            //   dataIndex: 'openName',
            //   align: 'center',
            //   scopedSlots: { customRender: 'openName' },
            // },
            {
              title: '属性参数',
              dataIndex: 'openproxy',
              align: 'center',
            },
            // {
            //   title: '参数类型',
            //   dataIndex: 'openValuetype',
            //   align: 'center',
            //   scopedSlots: { customRender: 'openValuetype' },
            // },
            // {
            //   title: '操作类型',
            //   dataIndex: 'openOperationtype',
            //   align: 'center',
            //   scopedSlots: { customRender: 'openOperationtype' },
            // },
            {
              title: '属性值',
              dataIndex: 'openvalue',
              align: 'center',
            },
          ],
        },
        {
          title: '',
          children: [
            {
              title: '操作',
              dataIndex: 'operate',
              align: 'center',
              scopedSlots: { customRender: 'operation' },
            },
          ],
        },
      ];
    },

    /* 产品类型 */
    // 编辑产品类型
    editCategory() {
      this.isCategoryModal = true;
    },
    // 关闭产品类型弹窗
    cancelCategory() {
      this.isCategoryModal = false;
    },

    /* 产品属性 */
    // 添加产品属性
    addAttributes() {
      const { productId } = this;
      this.current = {
        productId,
        index: null,
        isEdit: false,
        valuetype: '1', // 默认为字符串
        operationtype: '1', // 默认为可读写
      };
      this.isAttributeModal = true;
    },
    convPrivateData() {
      var privateDataList = [];
      var cacheData = [];
      console.log('currentDevice', this.confs);
      if (this.confs) {
        var dataMap = this.confs;
        for (var index in dataMap) {
          let item = dataMap[index];
          const data = {
            key: index,
            name: item.name,
            value: item.remark,
            productid: item.productid,
          };
          privateDataList.push(data);
          cacheData.push(data);
        }
      }
      this.privateDataList = privateDataList;
      this.cacheData = cacheData;
      console.log('this.privateDataList', this.privateDataList);
    },
    addprivate() {
      const data = {
        key: Date.parse(new Date()),
        name: '',
        value: '',
        editable: true,
      };
      this.privateDataList.push(data);
      this.cacheData.push(data);
    },
    editprivate(key) {
      const newData = [...this.privateDataList];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.privateDataList = newData;
      }
    },
    saveprivate(key) {
      const newData = [...this.privateDataList];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.privateDataList = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = '';
    },
    delprivate(key) {
      const newData = [...this.privateDataList];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      newCacheData.forEach((item, index) => {
        console.log('newCacheData', index, item);
        if (key === item.key) {
          newCacheData.splice(index, 1);
          this.cacheData = newCacheData;
        }
      });
      newData.forEach((item, index) => {
        if (key === item.key) {
          newData.splice(index, 1);
          this.privateDataList = newData;
        }
      });

      this.editingKey = '';
    },
    cancelprivate(key) {
      const newData = [...this.privateDataList];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        delete target.editable;
        this.privateDataList = newData;
      }
    },

    handleChangePrivate(value, key, column) {
      const newData = [...this.privateDataList];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.privateDataList = newData;
      }
    },
    //添加产品服务
    addFunc() {
      const { funcs } = this;
      this.funcs = funcs.concat([{ name: '', remark: '', productid: this.productId }]);
      console.log(this);
    },
    //删除产品服务
    deleteFunc(index) {
      console.log(index, 'index');
      const funcs = [...this.funcs];
      funcs.splice(index, 1);
      console.log(funcs);
      this.funcs = funcs;
    },
    // 编辑产品属性
    editAttribute(record, index) {
      this.current = { ...record, index, productId: this.productId, isEdit: true };
      this.isAttributeModal = true;
    },
    cancelAttribute() {
      this.isAttributeModal = false;
    },
    // 删除产品属性
    deleteAttribute(params) {
      const { attributes = [] } = this.product;
      attributes.splice(params.index, 1);
      this.product = Object.assign({}, this.product, { attributes });
      this.cancelAttribute();
    },
    // 确认保存弹窗
    okAttribute(params) {
      const { isEdit } = params;
      const { attributes = [] } = this.product;

      if (isEdit) {
        // 修改
        const edit = attributes[params.index];
        Object.keys(params).forEach(v => {
          edit[v] = params[v];
        });
      } else {
        // 保存
        attributes.push(params);
      }
      this.product = Object.assign({}, this.product, { attributes });
      this.cancelAttribute();
    },
    //产品服务输入框值监听
    handleFunc(e) {
      console.log(e);
    },
    /* 文件上传功能 */
    // 删除文件
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.product.h5url = '';
    },
    //删除配置文件
    handleRemoveConfig(file) {
      const index = this.configList.indexOf(file);
      const newFileList = this.configList.slice();
      newFileList.splice(index, 1);
      this.configList = newFileList;
      this.product.configurl = '';
    },
    // 手动上传文件
    beforeUpload(file) {
      const isValid = this.checkFile(file);
      if (isValid) {
        this.fileList = [...this.fileList, file];
      }
      console.log(this.fileList);
      return false;
    },
    //手动上传配置文件
    beforeUploadConfig(file) {
      // const isValid = this.checkFile(file);
      // if (isValid) {
      this.configList = [...this.configList, file];
      // }
      return false;
    },
    // 检查文件有效性
    checkFile(file) {
      const types = ['application/tar.gz', 'application/x-gzip'];
      const { type, size } = file;
      console.log(file);
      const isType = types.includes(type);
      if (!isType) {
        this.$message.error('请上传zip格式文件!');
      }
      const isSize = size / 1024 / 1024 <= 5;
      if (!isSize) {
        this.$message.error('文件大小不能超过5MB!');
      }
      return isType && isSize;
    },
    // 获得未上传的文件
    getUploadFiles(fileType) {
      return [...this[fileType].filter(v => !v.id)];
    },
    // 上传H5资源包
    async handleUpload() {
      const waitUpload = this.getUploadFiles('fileList');
      if (waitUpload.length == 0) {
        return;
      }
      const formData = new FormData();
      waitUpload.forEach(file => {
        formData.append('upfile', file);
        formData.append('projectid', this.projectId);
        formData.append('productid', this.product.pid);
      });
      const res = await appAsk
        .uploadFiles(formData)
        .then(result => {
          const { errcode, data } = result;
          console.log(errcode);
          if (errcode === 200) {
            this.product.h5url = data.url;
            return true;
          }
          return false;
        })
        .catch(e => {
          console.error(e);
        });
      return res;
    },
    // 删除资源包
    async deleteFiles() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files[]', file);
        formData.append('projectid', this.projectId);
        formData.append('productid', this.product.pid);
      });
      await appAsk
        .delFiles(formData)
        .then(
          result => {
            const { errcode, data } = result;
            if (errcode === 200) {
              console.log('删除成功');
              this.product.h5url = ''; // 上传文件成功后的回调
              return true;
            }
            return false;
          },
          () => {}
        )
        .catch(e => {
          console.error(e);
        });
    },
    // 上传配置文件
    async handleUploadConfig() {
      const waitUpload = this.getUploadFiles('configList');
      if (waitUpload.length == 0) {
        return;
      }
      const formData = new FormData();
      waitUpload.forEach(file => {
        formData.append('upfile', file);
        formData.append('projectid', this.projectId);
        formData.append('productid', this.product.pid);
      });
      const res = await appAsk
        .uploadConfig(formData)
        .then(result => {
          const { errcode, data } = result;
          console.log(errcode);
          if (errcode === 200) {
            this.product.configurl = data.url;
            return true;
          }
          return false;
        })
        .catch(e => {
          console.error(e);
        });
      return res;
    },
    // 删除资源包
    async deleteConfigFiles() {
      const { configList } = this;
      const formData = new FormData();
      configList.forEach(file => {
        formData.append('files[]', file);
        formData.append('projectid', this.projectId);
        formData.append('productid', this.product.pid);
      });
      await appAsk
        .delFiles(formData)
        .then(
          result => {
            const { errcode, data } = result;
            if (errcode === 200) {
              console.log('删除成功');
              this.product.configurl = ''; // 上传文件成功后的回调
              return true;
            }
            return false;
          },
          () => {}
        )
        .catch(e => {
          console.error(e);
        });
    },
    /* 产品相关操作 */
    // 取消
    cancel() {
      this.$router.back();
    },
    // 删除确认弹窗
    showDelModal() {
      const that = this;
      this.$confirm({
        title: '确定要删除产品？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          that.del();
        },
        onCancel() {},
      });
    },
    // 删除产品
    del() {
      const { productId, product, projectId } = this;
      const params = {
        id: productId,
        pid: product.pid,
        projectid: projectId + '',
      };
      productManageAsk
        .delProduct(params)
        .then(result => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: '产品列表' });
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 保存产品
    async ok() {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        console.log('privateDataList', this.privateDataList);
        console.log(fieldsValue);
        var confs = this.privateDataList.map(item => {
          return {
            id: item.id,
            name: item.name,
            remark: item.value,
          };
        });
        this.spinning = true;
        const { productId, fileList, categoryList } = this;
        const { productname, productversion, pid } = fieldsValue;
        this.product = {
          ...this.product,
          productname,
          productversion,
          pid,
          confs,
        };
        const { categoryid } = this.product;
        if (categoryid) {
          const index = categoryList.findIndex(v => v.id === categoryid);
          if (index > -1) {
            this.product.categoryname = categoryList[index].name;
          }
        }

        // 上传文件
        const waitUpload = [
          ...this.getUploadFiles('fileList'),
          ...this.getUploadFiles('configList'),
        ];
        if (waitUpload.length > 0) {
          // TODO优化async
          (async () => {
            const isUpload = await this.handleUpload();
            // const isUploadConfig = await this.handleUploadConfig();
            console.log(isUpload);
            if (isUpload) {
              if (productId) {
                // 编辑
                this.modProduct();
              } else {
                // 添加
                this.addProduct();
              }
            } else {
              this.spinning = false;
              this.$message.error('上传文件失败！');
            }
          })();
        } else if (productId) {
          // 编辑
          this.modProduct();
        } else {
          // 添加
          this.addProduct();
        }
      });
    },
    // 添加产品
    async addProduct() {
      const params = {
        ...this.product,
        projectid: this.projectId + '',
      };
      await productManageAsk
        .addProduct(params)
        .then(result => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$router.push({ name: '产品列表' });
          }
          this.spinning = false;
        })
        .catch(e => {
          this.spinning = false;
          console.error(e);
        });
    },
    // 修改产品
    async modProduct() {
      const params = {
        ...this.product,
        projectid: this.projectId + '',
      };
      console.log(params, 'params');
      await productManageAsk
        .modProduct(params)
        .then(result => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$router.push({ name: '产品列表' });
          }
          this.spinning = false;
        })
        .catch(e => {
          this.spinning = false;
          console.error(e);
        });
    },
    // 查询产品详情
    getDetailProduct() {
      const { productId, projectId } = this;
      const params = {
        id: productId,
        projectid: projectId + '',
      };
      productManageAsk
        .getDetailProduct(params)
        .then(result => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.product = data;
            if (data.projectid != this.projectId) {
              this.isEditable = false;
            }
            this.confs = data.confs || [];
            this.getFiles();
            this.convPrivateData();
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 初始化文件列表
    getFiles() {
      const { h5url } = this.product;
      if (h5url && h5url.includes('/upload/')) {
        const pos = h5url.indexOf('upload');
        const name = h5url;
        this.fileList = [
          {
            id: '1',
            uid: '1',
            name,
            status: 'done',
            url: h5url,
          },
        ];
      }
    },
  },
};
</script>
<style lang="less">
.table-border .ant-table-placeholder,
.table-border .ant-table-tbody > tr > td {
  border-bottom: 1px solid #e8e8e8;
}
.func-div {
  display: flex;
  width: 523px;
  margin-bottom: 10px;
  align-items: center;
  input:nth-child(1) {
    flex: 0 0 93px;
    border-right: 0px;
  }
  .func-icon {
    width: 20px;
    height: 20px;
    color: #eb415f;
    transform: translateX(-150%);
  }
}
</style>

<style lang="less" scoped>
.prrivate_table {
  width: 600px;
}
</style>
