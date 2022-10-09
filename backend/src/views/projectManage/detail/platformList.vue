<template>
  <div>
    <div class="title">
      <a-button type="primary"
                @click="add">新增平台绑定</a-button>
    </div>
    <a-table :columns="columns"
             :row-key="record => record.id"
             :data-source="data"
             :loading="loading"
             :pagination="pagination"
             @change="projectPlatformChange">
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
             :width="800"
             :closable="false"
             ok-text="确定"
             cancel-text="取消">
      <a-form :form="form"
              hide-required-mark>
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="平台">
          <a-select :disabled="current.id!=undefined"
                    v-model="current.platform"
                    :default-value="-1"
                    class="component-w-224">
            <a-select-option v-for="item in platformList"
                             :key="item.code"
                             :value="item.code">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="平台私有数据">
          <a-input type="textarea"
                   :rows="10"
                   v-decorator="[ `privatedata`,{
          initialValue:current.privatedata} ]" />
        </a-form-item> -->
        <a-form-item :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     :colon="false"
                     label="拓展数据">

          <a-button @click="addprivate">新增</a-button>
          <div>
            <a-table :columns="privatecolumns"
                     class="prrivate_table"
                     :data-source="privateDataList">
              <template v-for="col in ['name', 'value']"
                        :slot="col"
                        slot-scope="text, record">
                <div :key="col">
                  <a-input v-if="record.editable"
                           :value="text"
                           @change="(e) => handleChange(e.target.value, record.key, col)" />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>
              <template slot="operation"
                        slot-scope="text, record">
                <div class="editable-row-operations">
                  <span v-if="record.editable">
                    <a @click="() => saveprivate(record.key)">保存</a>
                    <a @click="() => delprivate(record.key)">删除</a>
                    <a @click="() => cancelprivate(record.key)">取消</a>
                  </span>
                  <span v-else>
                    <a :disabled="editingKey !== ''"
                       @click="() => editprivate(record.key)">编辑</a>
                  </span>
                </div>
              </template>
            </a-table>
          </div>
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
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import Mix from '@/mixins';
  import service from 'servicePath/index';
  // import { ipRegExp } from 'commonPath/utils';
  const privateDataList = [];
  const { projectManageAsk, appAsk, platformManageAsk } = service;
  const { PageTableCreaterMix } = Mix;
  export default {
    name: 'WhiteList',
    components: {},
    mixins: [PageTableCreaterMix('projectPlatform')],
    props: {},
    data() {
      this.cacheData = privateDataList.map((item) => ({ ...item }));
      return {
        editingKey: '',
        privatecolumns,
        privateDataList,
        form: this.$form.createForm(this),
        projectid: this.$route.params.id,
        isModal: false,
        current: {},
        platformList: [],
        ipRegExp: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
      };
    },
    computed: {
      ...mapState('projectManage', ['blackIptype', 'platformMap']),
      ...mapState('projectManage', ['blackListStatus']),
      modalTitle() {
        const { id } = this.current;
        return `${id ? '修改' : '添加'}名单`;
      },
    },
    watch: {
      blackIptype(newVal, oldVal) {
        this.init();
        this.projectPlatformFetch();
      },
    },
    created() {},
    mounted() {},
    methods: {
      init() {
        this.pagination.current = 1;
        this.projectPlatformFetch();
      },
      // 表头
      projectPlatformColumns() {
        const columns = [
          {
            title: '平台名称',
            dataIndex: 'platformName',
            width: '50%',
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
      convPrivateData() {
        var privateDataList = [];
        var cacheData = [];
        console.log('current', this.current.privatedata);
        if (this.current.privatedata) {
          var dataMap = JSON.parse(this.current.privatedata);
          var index = 0;
          for (var name in dataMap) {
            index++;
            const data = {
              key: index,
              name: name,
              value: dataMap[name],
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
        const target = newData.filter((item) => key === item.key)[0];
        this.editingKey = key;
        if (target) {
          target.editable = true;
          this.privateDataList = newData;
        }
      },
      saveprivate(key) {
        const newData = [...this.privateDataList];
        const newCacheData = [...this.cacheData];
        const target = newData.filter((item) => key === item.key)[0];
        const targetCache = newCacheData.filter((item) => key === item.key)[0];
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
        const target = newData.filter((item) => key === item.key)[0];
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
        const target = newData.filter((item) => key === item.key)[0];
        this.editingKey = '';
        if (target) {
          Object.assign(target, this.cacheData.filter((item) => key === item.key)[0]);
          delete target.editable;
          this.privateDataList = newData;
        }
      },
      handleChange(value, key, column) {
        const newData = [...this.privateDataList];
        const target = newData.filter((item) => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.privateDataList = newData;
        }
      },
      // 添加
      add() {
        this.isModal = true;
        this.current = {
          projectid: this.projectid,
        };
        this.privateDataList = [];
      },
      // 编辑
      edit(record) {
        this.isModal = true;
        this.current = {
          ...record,
          pid: this.projectid,
        };
        this.convPrivateData();
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
          const privatedata = this.privateDataList;

          var privateObj = {};
          if (privatedata && privatedata.lenght != 0) {
            for (var item of privatedata) {
              privateObj[item.name] = item.value;
            }
          }
          this.current.privatedata = JSON.stringify(privateObj);
          this.current = {
            ...this.current,
          };
          if (id) {
            // 修改
            this.modProjectPlatform();
          } else {
            // 修改
            this.addProjectPlatform();
          }
        });
      },
      // 删除
      del(record) {
        const { id } = this.current;
        const params = {
          projectid: this.projectid,
          id: id,
        };
        projectManageAsk
          .delProjectPlatform(params)
          .then((result) => {
            const { errcode } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.projectPlatformFormatPagination('del');
              this.projectPlatformFetch();
              this.isModal = false;
            }
          })
          .catch((e) => {
            console.error(e);
          });
      },
      modProjectPlatform() {
        const params = {
          ...this.current,
          projectid: this.projectid,
        };
        projectManageAsk
          .modProjectPlatform(params)
          .then((result) => {
            const { errcode } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.projectPlatformFetch();
              this.isModal = false;
            }
          })
          .catch((e) => {
            console.error(e);
          });
      },
      addProjectPlatform() {
        const params = {
          ...this.current,
        };
        projectManageAsk
          .addProjectPlatform(params)
          .then((result) => {
            const { errcode } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              this.projectPlatformFormatPagination('add');
              this.projectPlatformFetch();
              this.isModal = false;
            }
          })
          .catch((e) => {
            console.error(e);
            if (e.errcode == 551 && e.errmsg && e.errmsg.indexOf('Duplicate entry')) {
              this.$message.error('平台重复绑定！');
            }
          });
      },
      async getPlatformList() {
        const resp = await platformManageAsk.getPlatform({ a: 1 });
        this.platformList = resp.data.list;
        console.log('this.platformList', this.platformList, resp);

        return this.platformList || [];
      },
      // 请求数据
      async projectPlatformFetchList(params) {
        const { blackIptype, projectid } = this;
        // params.iptype = blackIptype;
        params.projectid = projectid;
        const { errcode, data = {} } = await projectManageAsk.getProjectPlatform(params);
        console.log('data', data);

        var projectPlatformList = [];
        if (data && data.platformlist != undefined) {
          projectPlatformList = [...data.platformlist];
        }
        const platformList = await this.getPlatformList();
        let platformMap = new Map();
        for (var platform of platformList) {
          platformMap.set(platform.code, platform);
        }

        console.log('platformMap', platformMap);
        for (var index in projectPlatformList) {
          console.log('projectPlatformList[index].platform', projectPlatformList[index].platform);
          var platform = platformMap.get(projectPlatformList[index].platform);
          if (!platform) {
            continue;
          }
          projectPlatformList[index].platformName = platform.name
            ? platform.name
            : projectPlatformList[index].platform;
        }
        return { total: data.totalsize, data: projectPlatformList || [] };
      },
    },
  };
</script>

<style lang="less" scoped>
  .title {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }
</style>
