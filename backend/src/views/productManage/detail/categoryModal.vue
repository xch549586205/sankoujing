<template>
  <a-modal v-model="isModal"
           :mask-closable="false"
           :width="400"
           :footer="null"
           title="编辑类型"
           ok-text="确定"
           cancel-text="取消"
           @cancel="cancel">
    <a-row class="mb10">
      <a-col :span="18">
        <a-input v-model.trim="name"
                 :maxlength="GLOBAL.NAME_MAX_LEN"
                 placeholder="填写新类型名称" />
      </a-col>
      <a-col :span="6"
             style="text-align:right">
        <a-button type="primary"
                  @click="add">添加</a-button>
      </a-col>
    </a-row>

    <div class="modal-border-panel">
      <a-row v-for="item in categoryList"
             :key="item.id">
        <a-col :span="18">{{ item.name }}</a-col>
        <a-col :span="6"
               class="mb10"
               style="text-align:right">
          <span class="error cursor"
                @click="()=>{showDelModal(item)}">删除</span>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import service from 'servicePath/index';

  const { productManageAsk } = service;
  export default {
    name: 'AttributeModal',
    components: {},
    props: {},
    data() {
      return {
        isModal: true,
        name: '',
      };
    },
    computed: {
      ...mapState('productManage', ['categoryList']),
      ...mapState('projectManage', ['projectList', 'currentProjectid']),
    },
    watch: {},
    created() {
      this.setCategoryList({ projectid: this.currentProjectid + '' });
    },
    mounted() {},
    methods: {
      ...mapActions('productManage', ['setCategoryList']),
      // 添加设备类型
      add() {
        const { name } = this;
        if (name) {
          const params = {
            name,
            projectid: this.currentProjectid + '',
          };
          productManageAsk
            .addCategory(params)
            .then(
              (result) => {
                const { errcode, data } = result;
                if (errcode === 200) {
                  this.name = '';
                  this.$message.success('操作成功！');
                  this.setCategoryList({ projectid: this.currentProjectid + '' });
                }
              },
              () => {}
            )
            .catch((e) => {
              console.error(e);
            });
        } else {
          this.$message.warning('设备类型不能为空！');
        }
      },
      // 删除确认弹窗
      showDelModal(item) {
        const that = this;
        this.$confirm({
          title: '确定要删除设备类型？',
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            that.del(item);
          },
          onCancel() {},
        });
      },
      // 删除设备类型
      del(item) {
        const { id } = item;
        const params = {
          categoryIDs: [id],
          projectid: this.currentProjectid + '',
        };
        productManageAsk
          .delCategory(params)
          .then(
            (result) => {
              const { errcode, data } = result;
              if (errcode === 200) {
                this.$message.success('操作成功！');
                this.setCategoryList({ projectid: this.currentProjectid + '' });
              }
            },
            () => {}
          )
          .catch((e) => {
            console.error(e);
          });
      },
      cancel() {
        this.$emit('cancel');
      },
    },
  };
</script>
<style lang="less">
  .reset-input {
    width: 150px;
    margin-right: 10px;
  }
</style>

<style lang="less" scoped>
</style>
