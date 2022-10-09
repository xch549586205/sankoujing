<template>
  <div>
    <a-form-item :label-col="{ span: 4}"
                 :wrapper-col="{ span: 10 }"
                 :colon="false"
                 :maxlength="20"
                 label="定时备份周期">
      <a-input type="number"
               v-model="backupVal"
               class="backup_input" />
      <a-select v-model="backupUnit"
                class="backup_select">
        <a-select-option v-for="item in backupTimerUnits"
                         :key="item.val"
                         :value="item.val">
          {{ item.name }}
        </a-select-option>
      </a-select>

    </a-form-item>

    <a-form-item :label-col="{ span: 4}"
                 :wrapper-col="{ span: 10 }"
                 :colon="false"
                 :maxlength="20"
                 label="数据备份下载">
      <a-button @click="download">下载</a-button>

    </a-form-item>
    <a-form-item :label-col="{ span: 4}"
                 :wrapper-col="{ span: 10 }"
                 :colon="false"
                 :maxlength="20"
                 label="数据库恢复">
      <a-upload :multiple="false"
                :file-list="fileList"
                :remove="handleRemove"
                :before-upload="beforeUpload"
                accept=".zip"
                name="file">
        <a-button>上传</a-button>
      </a-upload>
    </a-form-item>
    <a-form-item :label-col="{ span: 4 }"
                 :wrapper-col="{ span: 16}"
                 :colon="false"
                 label=" ">
      <a-button class="mr10"
                type="primary"
                @click="ok">保存
      </a-button>
    </a-form-item>
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
        backupTimerUnits: [
          { name: '天', val: 'd' },
          { name: '周', val: 'w' },
          { name: '月', val: 'm' },
          { name: '年', val: 'y' },
        ],
        backupVal: 3,
        backupUnit: 'm',
        fileList: [],
        id: this.$route.params.id,
        project: {},
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
    created() {
      if (this.id) {
        this.getInfoProject();
      }
    },
    mounted() {},
    methods: {
      // 删除文件
      handleRemove(pic) {
        const index = this.fileList.indexOf(pic);
        const newfileList = this.fileList.slice();
        newfileList.splice(index, 1);
        this.fileList = newfileList;
        // this.project.url = '';
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
      // 检查文件有效性
      checkFile(file) {
        const types = ['application/zip', 'application/x-zip-compressed'];
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
      //下载资源
      download() {
        if (this.project.downloadurl) {
          window.location.href = this.project.downloadurl;
        } else {
          this.$message.error('项目没有可用备份!');
        }
      },
      // 确定
      ok() {
        const { id } = this;
        this.spinning = true;

        // 上传文件
        const waitUpload = this.getUploadFiles();
        if (waitUpload.length > 0) {
          // TODO优化async
          (async () => {
            const isUpload = await this.handleUpload();
            console.log(isUpload, '..上传文件..');
            if (isUpload) {
              if (id) {
                // 编辑
                this.modProject();
              } else {
                // 添加
                this.addProject();
              }
            } else {
              this.spinning = false;
              this.$message.error('上传文件失败！');
            }
          })();
        } else if (id) {
          // 编辑
          this.modProject();
        } else {
          // 添加
          this.addProject();
        }
      },
      // 修改
      modProject() {
        let params = {
          ...this.project,
          pids: this.products ? this.products.map((v) => v.pid) : [],
          urlmodule: this.urlmodule ? this.urlmodule.map((v) => v.urlid) : [],
        };
        params.period = this.backupVal + this.backupUnit;
        console.log(params);
        projectManageAsk
          .modProject(params)
          .then((result) => {
            const { errcode, data } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.$router.push({ name: '项目列表' });
            }
            this.spinning = false;
          })
          .catch((e) => {
            this.spinning = false;
            console.error(e);
          });
      },
      addProject() {
        const params = {
          ...this.project,
        };
        params.period = this.backupVal + this.backupUnit;
        console.log(this, params, '.........addProject.........');
        projectManageAsk
          .addProject(params)
          .then((result) => {
            const { errcode, data } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.$router.push({ name: '项目列表' });
            }
            this.spinning = false;
          })
          .catch((e) => {
            this.spinning = false;
            console.error(e);
          });
      },
      // 查询项目详情
      getInfoProject() {
        const { id } = this;
        const params = {
          id: parseInt(id),
        };
        projectManageAsk
          .getInfoProject(params)
          .then((result) => {
            const { errcode, data } = result;
            console.log(data, '..project detail....');
            if (errcode === 200) {
              const { project = {}, products = [], modules } = data;
              this.project = project;
              this.products = products;
              if (
                project.period.includes('d') ||
                project.period.includes('w') ||
                project.period.includes('m') ||
                project.period.includes('y')
              ) {
                this.backupVal = project.period.substring(0, project.period.length - 1);
                this.backupUnit = project.period.substring(
                  project.period.length - 1,
                  project.period.length
                );
                // console.log('backupVal', this.backupVal, '==', this.backupUnit);
              } else {
                this.backupVal = project.period;
                this.backupUnit = 'm';
              }
              // this.backupVal = project.period;
              this.urlmodule = modules;

              const { createtime } = this.project;
              this.createtime = this.$moment(createtime).format(this.GLOBAL.TIME_FOEMAR);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      },
      getUploadFiles() {
        const { fileList } = this;
        return fileList.filter((v) => !v.id);
      },
      // 上传H5资源包
      async handleUpload() {
        const waitUpload = this.getUploadFiles();
        const formData = new FormData();
        waitUpload.forEach((file) => {
          formData.append('file', file);
          formData.append('id', this.project.id);
        });
        const res = await appAsk
          .uploadRestore(formData)
          .then((result) => {
            const { errcode, data } = result;
            console.log(errcode);
            if (errcode === 200) {
              // this.project.url = data.url;
              return true;
            }
            return false;
          })
          .catch((e) => {
            console.error(e);
          });
        return res;
      },
      // 删除资源包
      async deleteFiles() {
        const { fileList } = this;
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('files[]', file);
        });
        await appAsk
          .delFiles(formData)
          .then(
            (result) => {
              const { errcode, data } = result;
              if (errcode === 200) {
                console.log('删除成功');
                // this.project.url = ''; // 上传文件成功后的回调
                return true;
              }
              return false;
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
  .backup_input {
    width: 100px;
  }
  .backup_select {
    width: 70px;
  }
</style>
