<template>
  <a-spin :spinning="spinning">
    <div>
      <a-form v-if="project"
              :form="form"
              hide-required-mark
              class="reset-line-height"
              style="width:50%">
        <!-- 前端设置 -->
        <div>
          <a-form-item v-if="project.projecturl"
                       :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :maxlength="20"
                       label="前端地址">

            <a :href="project.projecturl">{{project.projecturl}}</a>
          </a-form-item>
          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :maxlength="20"
                       label="前端资源包">
            <a-descriptions v-if="project.projecturl"
                            title=""
                            layout="vertical"
                            bordered>
              <a-descriptions-item label="资源包名称">
                {{project.resourcename}}
              </a-descriptions-item>
              <a-descriptions-item label="上传日期">
                {{project.resourceuploaddate}}
              </a-descriptions-item>
            </a-descriptions>
            <a-upload :multiple="false"
                      :file-list="fileList"
                      :remove="(file)=>handleRemove(file,'fileList')"
                      :before-upload="(file)=>beforeUpload(file,'fileList')"
                      accept=".zip"
                      name="file">

              <a-button :disabled="!id">{{project.projecturl?'重新上传':'上传'}}</a-button>
            </a-upload>
          </a-form-item>

          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :maxlength="20"
                       label="APK资源包">
            <a-upload :multiple="false"
                      :file-list="apkList"
                      :remove="(file)=>handleRemove(file,'apkList')"
                      :before-upload="(file)=>beforeUpload(file,'apkList')"
                      name="file">
              <a-button :disabled="!id">上传</a-button>
            </a-upload>
          </a-form-item>

          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :maxlength="20"
                       label="前端功能模块">
            <a-row :gutter="10">
              <a-col :span="20">
                <div :class="{'empty-box':funcModules&&funcModules.length===0,'tag-box':true}">
                  <div v-for="(item,index) in funcModules"
                       :key="item.id"
                       class="tag">
                    {{ item.urlname }}
                    <a-icon type="close-circle"
                            class="extra-icon cursor"
                            @click="delFuncModules(index)" />
                  </div>
                </div>
              </a-col>
              <a-col :span="4">
                <a-button type="primary"
                          @click="selectFucModule">选择</a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :maxlength="20"
                       label="使用有效期">
            <div class="use-time">
              <div class="flex-title"
                   @click="switchEffectPeriod">永久</div>
              <div class="flex-title"
                   @click="switchEffectPeriod">
                <img :src="!ispermanent?'static/images/unselect.png':'static/images/select.png'" />
                时间段
              </div>
              <div wx-if="!effectPeriod">
                <a-range-picker v-model="validityTime"
                                :format="dateFormat"
                                @change="calendarChange"
                                :disabled="!ispermanent" />
              </div>
            </div>
          </a-form-item>
          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :maxlength="20"
                       label="登陆人数">
            <div class="flex-div">
              <span class="flex-title">最多：</span>
              <a-input v-decorator="[ `maxusers`,{
            initialValue:project.maxusers,} ]" />
              <span>人</span>
            </div>
          </a-form-item>
          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :maxlength="20"
                       label="接入设备">
            <div class="flex-div">
              <span class="flex-title">最多：</span>
              <a-input v-decorator="[ `maxdevices`,{
            initialValue:project.maxdevices,}]" />
              <span>个</span>
            </div>
          </a-form-item>
        </div>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 16}"
                     :colon="false"
                     label=" ">
          <a-button class="mr10"
                    type="primary"
                    @click="ok">保存</a-button>
        </a-form-item>
      </a-form>
      <!-- 功能模块弹窗 -->
      <a-modal v-if="funcModal"
               v-model="funcModal"
               :mask-closable="false"
               :width="360"
               :closable="false"
               title="功能模块"
               ok-text="保存"
               cancel-text="取消"
               @ok="handleOk">
        <a-checkbox-group v-model="selected"
                          class="modal-border-panel"
                          @change="onSaveConnect">
          <a-row v-for="item in funcModuleList"
                 :key="item.id"
                 class="mb10">
            <a-checkbox :value="item.id">{{ item.urlname }}</a-checkbox>
          </a-row>
        </a-checkbox-group>
      </a-modal>
    </div>
  </a-spin>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';
  import service from 'servicePath/index';
  import moment from 'moment';
  const { projectManageAsk, productManageAsk, userManageAsk, urlManageAsk, appAsk } = service;
  export default {
    name: 'BaseInfo',
    components: {},
    props: {},
    data() {
      return {
        dateFormat: 'YYYY-MM-DD',
        project: {},
        id: this.$route.params.id,
        isModal: false,
        funcModuleList: [],
        selected: [],
        form: this.$form.createForm(this),
        createtime: '',
        ids: [],
        spinning: false,
        fileList: [],
        apkList: [],
        funcModules: [],
        effectPeriod: false,
        ispermanent: false,
        funcModal: false,
        validityTime: [],
        uploadUrl:
          'https://cmpd.ibroadlink.com/userspace/v1/openlimit/uploadfile?mtag=SCb0491bc574dfa1',
      };
    },
    computed: {},
    watch: {},
    created() {
      console.log(this.id);
      if (this.id) {
        this.getInfoProject();
      }
    },
    mounted() {},
    methods: {
      moment,
      // 删除功能模块
      delFuncModules(index) {
        this.funcModules.splice(index, 1);
      },
      // 选择功能模块
      selectFucModule() {
        this.funcModal = true;
        console.log('this.funcModules', this.funcModules);
        this.selected = this.funcModules.map((v) => v.id);
        console.log('this.selected ', this.selected);

        this.getFuncModules();
      },
      // 关联产品弹窗确认
      handleOk() {
        const { selected = [], funcModuleList = [] } = this;
        this.funcModules = selected.map((v) => {
          const index = funcModuleList.findIndex((k) => v === k.id);
          return {
            ...funcModuleList[index],
          };
        });
        this.funcModal = false;
      },
      //切换有效期
      switchEffectPeriod() {
        this.ispermanent = this.ispermanent ? false : true;
      },
      handleChange(info) {
        console.log(info, '.....图片信息.....');
      },
      // 删除文件
      handleRemove(pic, filetype) {
        const index = this[filetype].indexOf(pic);
        const newPicList = this[filetype].slice();
        newPicList.splice(index, 1);
        this[filetype] = newPicList;
        if (filetype == 'fileList') {
          this.project.resourceurl = '';
        }
      },
      // 手动上传文件
      beforeUpload(file, filetype) {
        const isValid = filetype == 'fileList' ? this.checkFile(file) : true;
        if (isValid) {
          this[filetype] = [...this[filetype], file];
        }
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
      //选择时间
      calendarChange(val) {
        console.log(val);
        this.effectPeriod = val;
      },
      // 获得选择项
      onSaveConnect(val) {
        console.log(val);
      },
      // 取消
      cancel() {
        this.$router.back();
      },
      // 删除弹窗
      showDelModal(record) {
        const that = this;
        this.$confirm({
          title: '确定要删除该项目？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            that.delProject();
          },
          onCancel() {},
        });
      },
      // 删除
      delProject() {
        const { id } = this.project;
        const params = {
          id,
        };
        projectManageAsk
          .delProject(params)
          .then(
            (result) => {
              const { errcode, data } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.$router.push({ name: '项目列表' });
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
      // 确定
      ok() {
        this.form.validateFields((err, fieldsValue) => {
          if (err) {
            return;
          }
          const { id } = this;
          this.spinning = true;
          const { projectname, maxusers, maxdevices } = fieldsValue;
          console.log(fieldsValue, this.project);
          this.project = {
            ...this.project,
            maxdevices: maxdevices * 1,
            maxusers: maxusers * 1,
          };
          this.ids = this.funcModules.map((v) => v.id || v.urlid);

          // 上传文件
          const waitUpload = this.getUploadFiles();
          const waitUploadApks = this.getUploadApks();

          if (waitUpload.length > 0 || waitUploadApks.length > 0) {
            // TODO优化async

            (async () => {
              const isUpload = await this.handleUpload();
              const isUploadApk = await this.handleUploadApk();
              console.log(isUpload, '..上传文件..');
              if (isUpload && isUploadApk) {
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
        });
      },
      // 修改
      modProject() {
        const params = {
          ...this.project,
          urlmodule: this.ids,
          pids: this.products.map((v) => v.pid),
          ispermanent: this.ispermanent ? 0 : 1,
          // resourcename: '前端v1',
          // resourceuploaddate: '2020-12-28 11:12:12',
        };
        if (this.effectPeriod) {
          params.starttime = this.$moment(this.effectPeriod[0]).format(this.GLOBAL.TIME_FOEMAR);
          params.endtime = this.$moment(this.effectPeriod[1]).format(this.GLOBAL.TIME_FOEMAR);
        }
        console.log(params, this.effectPeriod, '..this.effectPeriod.');
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
          urlmodule: this.ids,
          pids: this.products.map((v) => v.pid),
          ispermanent: this.ispermanent ? 0 : 1,
        };
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
            console.log(data, 'frontSet..project detail....');
            if (errcode === 200) {
              const { project = {}, products = [] } = data;
              this.project = project;
              this.products = products;

              if (data.modules) {
                data.modules.forEach((module, idx) => {
                  data.modules[idx].id = module.urlid;
                });
                this.funcModules = data.modules;
              } else {
                this.funcModules = [];
              }

              const { createtime } = this.project;
              this.createtime = this.$moment(createtime).format(this.GLOBAL.TIME_FOEMAR);
              if (this.project.resourceuploaddate) {
                this.project.resourceuploaddate = this.$moment(
                  this.project.resourceuploaddate
                ).format(this.GLOBAL.TIME_FOEMAR);
              }
              project.resourceuploaddate;
              if (this.project.starttime || this.project.endtime) {
                this.validityTime = [
                  this.$moment(this.project.starttime),
                  this.$moment(this.project.endtime),
                ];
                if (this.project.ispermanent != 1) {
                  this.ispermanent = true;
                }
              }
            }
          })
          .catch((e) => {
            console.error(e);
          });
      },
      // 查询产品
      getFuncModules() {
        const { id } = this;
        const params = {
          offset: 1,
          limit: this.GLOBAL.MAX_LEN,
          status: 2,
          pid: id,
        };
        urlManageAsk
          .getUrlsite(params)
          .then(
            (result) => {
              const { errcode, data } = result;
              if (errcode === 200) {
                this.funcModuleList = data.alist || [];
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
      getUploadFiles() {
        const { fileList } = this;
        return fileList.filter((v) => !v.id);
      },
      getUploadApks() {
        const { apkList } = this;
        return apkList.filter((v) => !v.id);
      },
      // 上传H5资源包
      async handleUpload() {
        const waitUpload = this.getUploadFiles();
        if (waitUpload.length == 0) {
          return true;
        }
        const fileName = waitUpload[0].name;
        const formData = new FormData();
        waitUpload.forEach((file) => {
          formData.append('upfile', file);
        });

        const res = await appAsk
          .uploadBusiness(formData)
          .then((result) => {
            const { errcode, data } = result;
            console.log(errcode);
            if (errcode === 200) {
              this.project.resourceurl = data.url;
              this.project.resourcename = fileName;
              this.project.resourceuploaddate = moment().format(this.GLOBAL.TIME_FOEMAR);
              return true;
            }
            return false;
          })
          .catch((e) => {
            console.error(e);
          });
        return res;
      },
      // 上传apk资源包
      async handleUploadApk() {
        const waitUpload = this.getUploadApks();
        console.log(waitUpload, '.....waitUpload...');
        if (waitUpload.length == 0) {
          return true;
        }
        const formData = new FormData();
        waitUpload.forEach((file) => {
          formData.append('upfile', file);
          formData.append('projectid', this.id);
        });
        const res = await appAsk
          .uploadApk(formData)
          .then((result) => {
            const { errcode, data } = result;
            console.log(errcode);
            if (errcode === 200) {
              let params = {
                downloadurl: data.url,
                projectid: this.id * 1,
                // remark: 'string',
                // version: 'string',
              };

              projectManageAsk
                .setapk(params)
                .then((result) => {
                  const { errcode, data } = result;
                  if (errcode === 200) {
                    console.log('上传成功');
                  }
                })
                .catch((e) => {
                  console.error(e);
                });
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
                this.project.resourceurl = ''; // 上传文件成功后的回调
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

<style lang="less">
  .reset-line-height .ant-form-item-control .tag-box {
    line-height: 1.5;
  }
</style>

<style lang="less" scoped>
  .content-panel {
    background: #fff;
  }
  .tag-box {
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    padding: 5px;
    .tag {
      padding: 3px;
    }
    .extra-icon {
      float: right;
      line-height: 1.5;
    }
    &.empty-box {
      padding: 16px;
    }
  }
  .upload-div {
    display: flex;
    .upload-left {
      width: 104px;
      height: 104px;
      border: 1px dashed #d9d9d9;
      cursor: pointer;
      border-radius: 4px;
      text-align: center;
      position: relative;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .add-icon {
        line-height: 1.5;
      }
    }
    .upload-right {
      margin-left: 10px;
      font-size: 12px;
      p:nth-child(1) {
        margin-top: 40px;
        margin-bottom: 0;
      }
    }
  }
  .title {
    color: #333333;
    font-size: 16px;
    margin: 40px 20px;
    font-weight: 600;
  }
  .use-time {
    display: flex;
    width: 400px;
    img {
      margin-right: 5px;
    }
  }
  .flex-div {
    display: flex;
    span {
      // flex: 0 0 80px;
    }
  }
  .flex-title {
    flex: 0 0 80px;
  }
</style>
