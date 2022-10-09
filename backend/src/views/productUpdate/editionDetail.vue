<template>
  <div>
    <bl-page-wrapper class="reset-background">
      <div slot="header"
           class="header-panel">
        <bl-header>
          <span slot="left"
                class="title"><a @click="$router.back()">远程升级</a> > 版本详情</span>

        </bl-header>
      </div>
      <div slot="content">
        为谔谔谔谔谔谔谔谔23
      </div>
    </bl-page-wrapper>
  </div>
</template>


<script>
  export default {
    name: 'DeviceUpdate',
    components: {},
    props: {},
    data() {
      return {};
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
      add() {
        this.$router.push({ path: '/' });
      },
    },
  };
</script>


<template>
  <bl-page-wrapper class="reset-background">
    <div slot="header"
         class="header-panel">
      <bl-header>
        <span slot="left"
              class="title"><span @click="$router.back()">远程升级</span> > 版本详情</span>

      </bl-header>
    </div>
    <div slot="content"
         class="content">
      <a-form :form="form"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 4 }"
              @submit="handleSubmit">
        <!-- //版本名称 -->
        <a-form-item label="版本名称">
          <a-input placeholder="请输入版本名称"
                   v-decorator="['name', { rules: [{ required: true, message: '请输入版本名称!' }] }]" />
        </a-form-item>
        <a-form-item label=" "
                     :colon="false">
          <a-upload name="file"
                    :multiple="true"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    :headers="headers"
                    @change="uploadChange">
            <a-button>
              <a-icon type="upload" /> 上传
            </a-button>
          </a-upload>
        </a-form-item>
        <!-- //适用品类 -->
        <a-form-item label="适用品类"
                     has-feedback>
          <a-select v-decorator="[
          'type',
          { rules: [{ required: true, message: '请选择适用品类!' }] },
        ]"
                    placeholder="请选择适用品类">
            <a-select-option value="device">
              断路器
            </a-select-option>
            <a-select-option value="gateway">
              断路器网关
            </a-select-option>
          </a-select>
        </a-form-item>
        <!-- //适用型号 -->
        <a-form-item label="适用型号"
                     :wrapper-col="{ span: 8 }"
                     has-feedback>
          <a-select v-decorator="[
          'model',
          { rules: [{ required: true, message: '请选择适用型号!' }] },
        ]"
                    mode="multiple"
                    :default-value="[]"
                    style="width: 100%"
                    placeholder="请选择适用型号"
                    @change="handleChange">
            <a-select-option v-for="(model,i) in ['NZ3-1PLC63','NZ3-2PLC63','NZ3-3PLC63','NZ3-4PLC63']"
                             :key="i">
              {{ model}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!-- 版本说明 -->
        <a-form-item label="版本说明"
                     :wrapper-col="{ span: 8 }">
          <a-textarea placeholder="请输入版本说明"
                      v-decorator="['explain', { rules: [{ required: true, message: '请填写版本说明!' }] }]" />
        </a-form-item>
        <!-- 按钮 -->
        <a-form-item :wrapper-col="{ span: 12, offset: 1 }">
          <a-button @click="$router.back()">
            取消
          </a-button>
          <a-button type="primary"
                    style="margin-left: 12px"
                    html-type="submit">
            保存
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </bl-page-wrapper>

</template>

<script>
  export default {
    data() {
      return {
        formLayout: 'horizontal',
        form: this.$form.createForm(this, { name: 'coordinated' }),
        headers: {
          authorization: 'authorization-text',
        },
      };
    },

    methods: {
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      },
      
      uploadChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .content {
    background: #fff;
    padding: 50px 0;
  }
</style>