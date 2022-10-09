<template>
  <a-spin :spinning="spinning">
    <div>
      <div v-if="!id" class="title">基本信息</div>

      <!-- <div v-if="progress && progress.curCount!=progress.totalCount">项目创建中</div> -->
      <a-form
        v-if="project"
        :form="form"
        hide-required-mark
        class="reset-line-height"
        style="width:50%"
      >
        <a-form-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 10 }"
          :colon="false"
          :max-length="20"
          label="项目名称"
        >
          <a-input
            v-decorator="[
              `projectname`,
              {
                initialValue: project.projectname,
                rules: [
                  {
                    required: true,
                    message: '请输入项目名称长度不超过20个字符',
                    max: GLOBAL.NAME_MAX_LEN,
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
          :colon="false"
          label="项目logo"
        >
          <div class="upload-div">
            <a-upload
              :multiple="false"
              :file-list="picList"
              :remove="file => handleRemove(file, 'picList')"
              :disabled="picList.length > 0"
              :before-upload="file => beforeUploadPic(file, 'picList')"
            >
              <div
                class="upload-left"
                v-if="picList.length == 0 || (picList.length > 0 && picList[0].name)"
              >
                <a-icon type="plus" class="add-icon"></a-icon>
                上传图片
              </div>
              <div class="upload-left" v-if="picList.length > 0 && !picList[0].name">
                <img :src="picList[0]" class="logoIcon" />
                <a-icon
                  type="close-circle"
                  class="del-icon"
                  @click="file => handleRemove(file, 'picList')"
                />
              </div>
            </a-upload>
            <div class="upload-right">
              <p>图片大小:300*300px</p>
              <p>文件格式:png格式</p>
            </div>
          </div>
        </a-form-item>

        <a-form-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
          :colon="false"
          label="登录背景（前台）"
        >
          <div class="upload-div">
            <a-upload
              :multiple="false"
              :file-list="bgPicList"
              :remove="file => handleRemove(file, 'bgPicList')"
              :disabled="bgPicList.length > 0"
              :show-upload-list="false"
              :before-upload="file => beforeUploadPic(file, 'bgPicList')"
            >
              <div
                class="upload-left"
                v-if="bgPicList.length == 0 || (bgPicList.length > 0 && bgPicList[0].name)"
              >
                <a-icon type="plus" class="add-icon"></a-icon>
                上传图片
              </div>
              <div class="upload-left" v-if="bgPicList.length > 0 && !bgPicList[0].name">
                <img :src="bgPicList[0]" class="logoIcon" />
                <a-icon
                  type="close-circle"
                  class="del-icon"
                  @click="file => handleRemove(file, 'bgPicList')"
                />
              </div>
            </a-upload>
            <div class="upload-right">
              <p>图片大小:300*300px</p>
              <p>文件格式:png格式</p>
            </div>
          </div>
        </a-form-item>

        <a-form-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
          :colon="false"
          label="项目简介"
        >
          <a-textarea
            v-model="project.projectremark"
            :max-length="500"
            :autosize="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
        <a-form-item
          v-if="id"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 10 }"
          :colon="false"
          label="创建时间"
        >
          <a-input v-model="createtime" disabled />
        </a-form-item>
        <!-- <a-form-item :label-col="{ span: 4}"
                     :wrapper-col="{ span: 12 }"
                     :colon="false"
                     label="关联产品">
          <a-row :gutter="10">
            <a-col :span="20">
              <div :class="{'empty-box':products&&products.length===0,'tag-box':true}">
                <div v-for="(item,index) in products"
                     :key="item.id"
                     class="tag">
                  {{ item.productname }}
                  <a-icon type="close-circle"
                          class="extra-icon cursor"
                          @click="delConnectProduct(index)" />
                </div>
              </div>
            </a-col>
            <a-col :span="4">
              <a-button type="primary"
                        @click="contectProduct">选择</a-button>
            </a-col>
          </a-row>
        </a-form-item> -->
        <!-- 前端设置 -->
        <!-- <div v-if="!id">
          <div class="title">前端设置</div>
          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :max-length="20"
                       label="前端资源包">
            <a-upload :multiple="false"
                      :remove="handleRemove"
                      :before-upload="beforeUpload"
                      accept=".zip"
                      name="file">
              <a-button :disabled="!id">上传</a-button>
            </a-upload>
          </a-form-item>
          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :max-length="20"
                       label="APK资源包">
            <a-upload :multiple="false"
                      :remove="handleRemove"
                      :before-upload="beforeUpload"
                      accept=".zip"
                      name="file">
              <a-button :disabled="!id">上传</a-button>
            </a-upload>
          </a-form-item>
          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :max-length="20"
                       label="前端功能模块">
            <a-row :gutter="10">
              <a-col :span="20">
                <div :class="{'empty-box':funcModules&&funcModules.length===0,'tag-box':true}">
                  <div v-for="(item,index) in funcModules"
                       :key="item.id"
                       class="tag">
                    {{ item.productname }}
                    <a-icon type="close-circle"
                            class="extra-icon cursor"
                            @click="delConnectProduct(index)" />
                  </div>
                </div>
              </a-col>
              <a-col :span="4">
                <a-button type="primary"
                          :disabled="!id"
                          @click="selectFucModule">选择</a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :max-length="20"
                       label="使用有效期">
            <div class="use-time">
              <div @click="switchEffectPeriod">
                <img :src="effectPeriod?'static/images/unselect.png':'static/images/select.png'" />
                永久
              </div>
              <div @click="switchEffectPeriod">
                <img :src="!effectPeriod?'static/images/unselect.png':'static/images/select.png'" />
                时间段
              </div>
              <div wx-if="!effectPeriod">
                <a-range-picker @change="calendarChange"
                                :disabled="!effectPeriod" />
              </div>
            </div>
          </a-form-item>
          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :max-length="20"
                       label="登陆人数">
            <div class="flex-div">
              <span> 最多：</span>
              <a-input v-decorator="[ `maxusers`,{
              initialValue:project.maxusers,} ]" />
              <span> 人</span>
            </div>
          </a-form-item>
          <a-form-item :label-col="{ span: 4}"
                       :wrapper-col="{ span: 10 }"
                       :colon="false"
                       :max-length="20"
                       label="接入设备">
            <div class="flex-div">
              <span> 最多：</span>
              <a-input v-decorator="[ `maxdevices`,{
              initialValue:project.maxdevices,}]" />
              <span> 个</span>
            </div>
          </a-form-item>
        </div> -->
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" :colon="false" label=" ">
          <a-button class="mr10" @click="cancel">取消</a-button>
          <a-button v-if="id" class="mr10" type="danger" @click="showDelModal">删除</a-button>
          <a-button class="mr10" type="primary" @click="ok">确定 </a-button>
        </a-form-item>
      </a-form>
      <!-- 关联弹窗 -->
      <a-modal
        v-if="isModal"
        v-model="isModal"
        :mask-closable="false"
        :width="360"
        :closable="false"
        title="关联产品"
        ok-text="确定"
        cancel-text="取消"
        @ok="handleOk"
      >
        <a-checkbox-group v-model="selected" class="modal-border-panel" @change="onSaveConnect">
          <a-row v-for="item in productList" :key="item.id" class="mb10">
            <a-checkbox :value="item.id">{{ item.productname }}</a-checkbox>
          </a-row>
        </a-checkbox-group>
      </a-modal>
      <!-- 功能模块弹窗 -->
      <a-modal
        v-if="funcModal"
        v-model="isModal"
        :mask-closable="false"
        :width="360"
        :closable="false"
        title="功能模块"
        ok-text="保存"
        cancel-text="取消"
        @ok="handleOk"
      >
        <a-checkbox-group v-model="selected" class="modal-border-panel" @change="onSaveConnect">
          <a-row v-for="item in funcModules" :key="item.id" class="mb10">
            <a-checkbox :value="item.id">{{ item.productname }}</a-checkbox>
          </a-row>
        </a-checkbox-group>
      </a-modal>
    </div>
  </a-spin>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

import service from 'servicePath/index';
const { projectManageAsk, productManageAsk, userManageAsk, urlManageAsk, appAsk } = service;
export default {
  name: 'BaseInfo',
  components: {},
  props: {},
  data() {
    return {
      project: {},
      id: this.$route.params.id,
      isModal: false,
      products: [],
      selected: [],
      form: this.$form.createForm(this),
      createtime: '',
      productList: [],
      pids: [],
      spinning: false,
      picList: [],
      bgPicList: [],
      funcModules: [],
      effectPeriod: false,
      funcModal: '',
      progress: null,
      uploadUrl:
        'https://cmpd.ibroadlink.com/userspace/v1/openlimit/uploadfile?mtag=SCb0491bc574dfa1',
    };
  },
  computed: {
    ...mapState('projectManage', ['projectList', 'currentProjectid']),
  },
  watch: {},
  created() {
    if (this.id) {
      this.getInfoProject();
      this.getProgress();
    }
  },
  mounted() {},
  methods: {
    ...mapMutations('projectManage', ['setCurrentProjectid']),

    // 删除关联产品
    delConnectProduct(index) {
      this.products.splice(index, 1);
    },
    // 删除功能模块
    delFuncModules(index) {
      this.funcModules.splice(index, 1);
    },
    //  关联产品
    contectProduct() {
      this.isModal = true;
      this.selected = this.products.map(v => v.id);
      console.log('this.products', this.products);
      this.getProduct();
    },
    // 选择功能模块
    selectFucModule() {
      console.log(233);
      this.isModal = true;
      this.selected = this.funcModules.map(v => v.id);
      this.getFuncModules();
    },
    // 关联产品弹窗确认
    handleOk() {
      const { selected = [], productList = [] } = this;
      this.products = selected.map(v => {
        const index = productList.findIndex(k => v === k.id);
        return {
          ...productList[index],
        };
      });
      this.isModal = false;
    },
    //切换有效期
    switchEffectPeriod() {
      this.effectPeriod = this.effectPeriod ? false : true;
    },
    // 手动上传图片
    beforeUploadPic(file, pictype) {
      const isValid = true;
      if (isValid) {
        this[pictype] = [file];
      }
      return false;
    },
    handleCancel() {},
    // 删除文件
    handleRemove(pic, pictype) {
      console.log(pic, pictype);
      const index = this[pictype].indexOf(pic);
      const newPicList = this[pictype].slice(0);
      newPicList.splice(index, 1);
      this[pictype] = newPicList;
      if (pictype == 'picList') {
        this.project.logourl = '';
      } else {
        this.project.loginuiurl = '';
      }
    },
    // 手动上传文件
    beforeUpload(file, pictype) {
      const isValid = this.checkFile(file);
      if (isValid) {
        this[pictype] = [...this[pictype], file];
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
      // 如果删除的项目是当前项目，则重置当前项目的id
      if (this.currentProjectid == id) {
        this.setCurrentProjectid(this.projectList[0].id);
      }
      projectManageAsk
        .delProject(params)
        .then(
          result => {
            const { errcode, data } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.$router.push({ name: '项目列表' });
            }
          },
          () => {}
        )
        .catch(e => {
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
        this.project = {
          ...this.project,
          projectname,
          maxdevices: maxdevices * 1,
          maxusers: maxusers * 1,
        };
        this.pids = this.products.map(v => v.id);

        // 上传文件
        const waitUpload = this.getUploadFiles();
        const waitBgUpload = this.getUploadBgpic();
        if (waitUpload.length > 0 || waitBgUpload > 0) {
          // TODO优化async
          (async () => {
            console.log(waitUpload.length > 0, waitBgUpload > 0);
            const isUpload = await this.handleUpload();
            const isBgUpload = await this.handleBgUpload();
            console.log(isUpload && isBgUpload, 'isUpload&&isBgUpload');
            if (isUpload && isBgUpload) {
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
    //上传文件后
    uploadCallback() {},
    // 修改
    modProject() {
      const params = {
        ...this.project,
        pids: this.pids,
      };

      if (this.urlmodule) {
        params.urlmodule = this.urlmodule.map(v => v.urlid);
      }

      if (this.effectPeriod) {
        params.starttime = this.$moment(this.effectPeriod[0]).format(this.GLOBAL.TIME_FOEMAR);
        params.endtime = this.$moment(this.effectPeriod[1]).format(this.GLOBAL.TIME_FOEMAR);
      }
      console.log('modProject', params);
      projectManageAsk
        .modProject(params)
        .then(result => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: '项目列表' });
          }
          this.spinning = false;
        })
        .catch(e => {
          this.spinning = false;
          console.error(e);
        });
    },
    addProject() {
      const params = {
        ...this.project,
        pids: this.pids,
        ispermanent: this.effectPeriod ? 1 : 0,
      };
      if (this.effectPeriod) {
        params.starttime = this.$moment(this.effectPeriod[0]).format(this.GLOBAL.TIME_FOEMAR);
        params.endtime = this.$moment(this.effectPeriod[1]).format(this.GLOBAL.TIME_FOEMAR);
      }
      console.log(this, params, '.........addProject.........');
      projectManageAsk
        .addProject(params)
        .then(result => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: '项目列表' });
          }
          this.spinning = false;
        })
        .catch(e => {
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
        .then(result => {
          const { errcode, data } = result;
          if (errcode === 200) {
            const { project = {}, products = [], logourl, modules } = data;
            this.project = project;
            this.products = products;
            this.urlmodule = modules;
            this.picList = this.project.logourl ? [this.project.logourl] : [];
            this.bgPicList = this.project.loginuiurl ? [this.project.loginuiurl] : [];
            console.log(this.picList, ' this.picList');
            const { createtime } = this.project;
            this.createtime = this.$moment(createtime).format(this.GLOBAL.TIME_FOEMAR);
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 查询产品
    getProduct() {
      const { id } = this;
      const params = {
        offset: 1,
        limit: this.GLOBAL.MAX_LEN,
      };
      productManageAsk
        .getProduct(params)
        .then(
          result => {
            const { errcode, data } = result;
            if (errcode === 200) {
              this.productList = data.productsinfo || [];
            }
          },
          () => {}
        )
        .catch(e => {
          console.error(e);
        });
    },
    // 查询产品
    getFuncModules() {
      const { id } = this;
      const params = {
        offset: 1,
        limit: this.GLOBAL.MAX_LEN,
        pid: this.id,
      };
      urlManageAsk
        .getUrlsite(params)
        .then(
          result => {
            const { errcode, data } = result;
            if (errcode === 200) {
              this.productList = data.productsinfo || [];
            }
          },
          () => {}
        )
        .catch(e => {
          console.error(e);
        });
    },
    getUploadFiles() {
      const { picList } = this;
      return this.picList.filter(v => !v.id);
    },
    getUploadBgpic() {
      const { picList } = this;
      return this.bgPicList.filter(v => !v.id);
    },
    // 上传H5资源包
    async handleUpload() {
      const waitUpload = this.getUploadFiles();
      if (waitUpload.length == 0 || (waitUpload.length > 0 && !waitUpload[0].name)) {
        return true;
      }
      const formData = new FormData();
      waitUpload.forEach(file => {
        formData.append('upfile', file);
        formData.append('foldertype', 1);
      });
      console.log(formData, waitUpload, '.formData');
      const res = await appAsk
        .uploadPic(formData)
        .then(result => {
          const { errcode, data } = result;
          console.log(result, '..上传结果..');
          console.log(errcode);
          if (errcode === 200) {
            this.project.logourl = data.url;
            return true;
          }
          return false;
        })
        .catch(e => {
          console.error(e);
        });
      return res;
    },
    getProgress() {
      projectManageAsk.getProgress({ projectid: this.id }).then(resp => {
        console.log('resp', resp);
        const { data = {}, errcode } = resp;
        this.progress = data;
      });
    },
    // 上传背景资源包
    async handleBgUpload() {
      const waitUpload = this.getUploadBgpic();
      if (waitUpload.length == 0 || (waitUpload.length > 0 && !waitUpload[0].name)) {
        return true;
      }
      const formData = new FormData();
      waitUpload.forEach(file => {
        formData.append('upfile', file);
        formData.append('foldertype', 1);
      });
      console.log(formData, waitUpload, '.formData');
      const res = await appAsk
        .uploadPic(formData)
        .then(result => {
          const { errcode, data } = result;
          console.log(result, '..上传结果..');
          console.log(errcode);
          if (errcode === 200) {
            this.project.loginuiurl = data.url;
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
      const { picList } = this;
      const formData = new FormData();
      picList.forEach(file => {
        formData.append('files[]', file);
      });
      await appAsk
        .delFiles(formData)
        .then(
          result => {
            const { errcode, data } = result;
            if (errcode === 200) {
              console.log('删除成功');
              this.project.logourl = ''; // 上传文件成功后的回调
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
    position: relative;
    .add-icon {
      line-height: 1.5;
    }
    .del-icon {
      line-height: 1;
      top: 0;
      right: -20px;
      position: absolute;
      color: red;
    }
    .logoIcon {
      max-width: 88px;
      max-height: 50px;
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
  div {
    flex: 0 0 80px;
  }
  img {
    margin-right: 5px;
  }
}
.flex-div {
  display: flex;
  span {
    flex: 0 0 80px;
  }
}
</style>
