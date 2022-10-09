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
                     <a-button :disabled="record.execute"
                    type="primary"
                    style="width:100px;"
                    @click="execute(record)">{{ record.execute?'正在执行...':'执行' }}</a-button>
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
      // 表头
      sceneColumns() {
        const columns = [
          {
            title: '场景名称',
            width: 150,
            dataIndex: 'name',
            align: 'center',
          },
          {
            title: '执行',
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
          type: 6,
        });
        return { total: data.totalsize, data: data.taskinfo };
      },
      execute(item) {
        item.execute = true;
        const params = {
          id: item.id,
        };
        timeLinkageAsk
          .execute(params)
          .then(result => {
            const { errcode, data } = result;
            if (errcode === 200) {
              this.$message.success('操作成功！');
            }
            item.execute = false;
          })
          .catch(e => {
            item.execute = false;
            console.error(e);
          });
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