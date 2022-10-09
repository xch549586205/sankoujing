<template>
  <div class="list-l">
    <a-table :columns="columns"
             :row-key="record => `${record.id}${record.did}`"
             :data-source="data"
             :loading="loading"
             :pagination="pagination"
             size="middle"
             class="reset-pagination"
             @change="sceneChange">
      <template slot="operate"
                slot-scope="text,record">
            <a-switch v-model="record.enable"
                      @change="(val)=>onChange(val,record)" />
      </template>
    </a-table>
  </div>
</template>


<script>
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
  import service from 'servicePath/index';
  import Mix from '@/mixins';

  const { timeLinkageAsk } = service;
  const { PageTableCreaterMix } = Mix;
  export default {
    name: 'SceneList',
    components: {
    },
    mixins: [PageTableCreaterMix('scene')],
    props: {},
    data() {
      return {
        pagination: {
          defaultCurrent: 1,
          current: 1,
          pageSize: 5,
          total: 0,
        },
      };
    },
    computed: {
    },
    created() {},
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {
      ...mapGetters('timeLinkage', ['formatRepeat']),
      // 表头
      sceneColumns() {
        const columns = [
          {
            title: '定时名称',
            width: 150,
            dataIndex: 'name',
            align: 'center',
          },
          {
            title: '启用/禁用',
            dataIndex: 'operate',
            width: '80px',
            align: 'center',
            scopedSlots: { customRender: 'operate' },
          },
        ];
        return columns;
      },
      // 请求数据
      async sceneFetchList(params) {
        const { errcode, data = {} } = await timeLinkageAsk.getTimeLinkageList({
          ...params,
          order: 'createtime',
          seq: 1,
          type: 1,
        });

        if (data.taskinfo) {
          data.taskinfo.forEach(v => {
            const { weekday } = v;
            v.enable = v.enable === 1;
            v.weekday = this.formatRepeat(weekday);
          });
        }
        return { total: data.totalsize, data: data.taskinfo };
      },
      onChange(val, item) {
        const newData = [...this.data];
        const edit = newData.filter(v => v.id === item.id)[0];
        if (edit) {
          edit.enable = val;
          this.data = newData;
        }
        const params = {
          ...item,
          enable: val ? 1 : 0,
        };

        timeLinkageAsk
        .modTimeLinkage(params)
        .then(result => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
          } else {
            this.reset(params);
          }
        })
        .catch(e => {
          this.reset(params);
          console.error(e);
        });
      },
      reset(params) {
        const newData = [...this.data];
        const { id, enable } = params;
        const edit = newData.filter(v => v.id === id)[0];
        if (edit) {
          edit.enable = enable !== 1;
        }
        this.data = newData;
      },
    },
  };
</script>

<style lang="less" scoped>
  .disabled {
    background: @bl-disabled-color;
    cursor: not-allowed;
  }
  .list-l {
    overflow: hidden;
    // width: 100%;
    width: 30%;
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.1);
    // border-radius: 4px;
  }
  .reset-pagination {
    overflow: hidden;
  }
  .ant-table-body::-webkit-scrollbar {
    width: 5px;
    background-color: rgba(0, 0, 0, 0);
  }
  /*定义滚动条的轨道，内阴影及圆角*/
  .ant-table-body::-webkit-scrollbar-track {
    width: 2px;
    border-radius: 10px;
  }
  /*定义滑块，内阴影及圆角*/
  .ant-table-body::-webkit-scrollbar-thumb {
    width: 10px;
    height: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 10px 0 #a9efff;
    /* 滑动条背景颜色 */
    background-color: #c8f5ff;
  }
  .ant-table-body {
    &::-webkit-scrollbar {
      height: 5px;
      width: 10px;
      overflow-y: auto;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      box-shadow: inset 0 0 5px rgba(89, 89, 89, 0.2);
      background: #939392;
    }
    &::-webkit-scrollbar-track {
      box-shadow: 0;
      border-radius: 0;
      background: #f0f2f5;
    }
  }
</style>