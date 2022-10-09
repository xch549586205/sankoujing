<template>
  <div class="editionList">
    <a-table :columns="columns"
             :data-source="mockDataList">
      <template slot="operation"
                slot-scope="text, record">
        <a @click="edit">编辑</a>
      </template>
    </a-table>
  </div>
</template>


<script>
  const columns = [
    {
      title: '时间',
      width: '20%',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '版本号',
      dataIndex: 'vesion',
      key: 'vesion',
      width: '10%',
    },
    {
      title: '设备类型',
      dataIndex: 'devicetpe',
      width: '10%',
      key: 'devicetpe',
    },
    {
      title: '适用型号',
      width: '40%',
      dataIndex: 'aa',
      key: 'aa',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: '10%',
      align: 'left',
      scopedSlots: { customRender: 'operation' },
    },
  ];
  export default {
    name: 'DeviceUpdate',
    components: {},
    props: {},
    data() {
      return {
        columns,
        mockDataList: [
          {
            id: 1,
            time: '2021-04-30 10:47:56',
            vesion: 'V.05',
            devicetpe: '微断',
            aa: 'NZ3-2PLC63、NZ3-1PLC63、NZ3-3PLC63、NZ3-4PLC63',
          },
          {
            id: 2,
            time: '2021-04-30 10:47:56',
            vesion: 'V.05',
            devicetpe: '微断',
            aa: 'NZ3-2PLC63、NZ3-1PLC63、NZ3-3PLC63、NZ3-4PLC63',
          },
          {
            time: '2021-04-30 10:47:56',
            id: 3,
            vesion: 'V.05',
            devicetpe: '微断',
            aa: 'NZ3-2PLC63、NZ3-1PLC63、NZ3-3PLC63、NZ3-4PLC63',
          },
          {
            time: '2021-04-30 10:47:56',
            id: 4,
            vesion: 'V.05',
            devicetpe: '微断',
            aa: 'NZ3-2PLC63、NZ3-1PLC63、NZ3-3PLC63、NZ3-4PLC63',
          },
          {
            time: '2021-04-30 10:47:56',
            id: 5,
            vesion: 'V.05',
            devicetpe: '微断',
            aa: 'NZ3-2PLC63、NZ3-1PLC63、NZ3-3PLC63、NZ3-4PLC63',
          },
          {
            time: '2021-04-30 10:47:56',
            vesion: 'V.05',
            devicetpe: '微断',
            aa: 'NZ3-2PLC63、NZ3-1PLC63、NZ3-3PLC63、NZ3-4PLC63',
          },
        ],
      };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
      add() {
        this.$router.push({ path: 'editionDetail' });
      },
      tabsChange(targetKey) {
        if (this.$router.currentRoute.path.indexOf(targetKey) === -1) {
          this.$router.push({ path: targetKey });
        }
      },
      // 编辑版本
      edit(record) {
        this.$router.push({
          path: 'editionDetail',
          query: { id: record.id },
        });
      },
    },
  };
</script>

<style lang="less" scoped>
</style>
