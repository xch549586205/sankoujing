<template>
  <a-spin :spinning="spinning">
  
          <a-button @click="add">新增</a-button>
            <a-table :columns="columns"
                     class="prrivate_table"
                     :data-source="privateDataList"
                     :row-key="record => record.index"
                     >
              <template v-for="col in ['name', 'value', 'key']"
                        :slot="col"
                        slot-scope="text, record">
                <div :key="col">
                  <a-input v-if="record.editable"
                          :defaultValue="text"
                          v-model="editData[record.index][col]"
                           />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>
              <template slot="operation"
                        slot-scope="text, record, index">
                <div class="editable-row-operations">
                  <span v-if="record.editable">
                    <a @click="() => save(record,index)">保存</a>
                    <a @click="() => del(record,index)">删除</a>
                    <a @click="() => cancel(record,index)">取消</a>
                  </span>
                  <span v-else>
                    <a @click="() => edit(record,index)">编辑</a>
                  </span>
                </div>
              </template>
            </a-table>
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
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: '20%',
      scopedSlots: { customRender: 'name' },
    },
    {
      title: '键',
      dataIndex: 'key',
      width: '20%',
      scopedSlots: { customRender: 'key' },
    },
    {
      title: '值',
      dataIndex: 'value',
      width: '35%',
      scopedSlots: { customRender: 'value' },
    },
    {
      title: '操作',
      width: '25%',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];
      return {
        spinning: false,
        columns,
        project: {},
        id: this.$route.params.id,
        privateDataList: [],
        editData: {},
      };
    },
    computed: {
      ...mapState('projectManage', ['projectList', 'currentProjectid']),
    },
    watch: {},
    created() {
      if (this.id) {
        this.getInfoProject();
      }
    },
    mounted() {},
    methods: {
      ...mapMutations('projectManage', ['setCurrentProjectid']),
      edit(item,index) {
        this.editData[index] = item
        item.editable = true
      },
      del(item,index) {
        this.privateDataList.splice(index,1)
      },
      cancel(item, index) {
        item.editable = false
      },
      add() {
        let index = this.privateDataList.length
        this.editData[index] = {name: '', value:'', key: ''}
        this.privateDataList.push({index: index, name: '', value:'', key: '', editable: true})
      },
      save(item, index) {
        item = this.editData[index]
        item.editable = false
        let list = this.privateDataList.map(item => {
          return {
            name: item.name,
            key: item.key,
            value: item.value,
          }
        })

        let privatedata = JSON.stringify(list) 
          this.spinning = true;
          this.project = {
            ...this.project,
            privatedata
          }; 

        const params = {
          ...this.project,
          urlmodule: this.urlmodule.map((v) => v.urlid),
          pids: this.products.map((v) => v.pid),
        };

        projectManageAsk
          .modProject(params)
          .then((result) => {
            const { errcode, data } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
              // this.$router.push({ name: '项目列表' });
            }
            this.spinning = false;
          })
          .catch((e) => {
            this.spinning = false;
            console.error(e);
          });
      },

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
            if (errcode === 200) {
              const { project = {}, products = [], modules } = data;
              this.project = project;
              this.products = products;
              this.urlmodule = modules;
              try {
                let privatedata = JSON.parse(project.privatedata)
                privatedata.forEach((item,index) => {
                  item.index = index
                  item.editable = false
                })
                this.privateDataList = privatedata
              } catch (error) {
                this.privateDataList = []
              }
            }
          })
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
 
</style>
