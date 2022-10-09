/* eslint-disable import/extensions */
<template>
  <div>
    <a-modal
      :visible="addItemModal.show"
      :title="addItemModal.type === 'add' ? '添加分项' : '编辑分项'"
      @ok="addItem"
      @cancel="addItemModal = { show: false }"
    >
      <a-input v-model="addItemModal.text" @change="e => (addItemModal.text = e.target.value)" />
    </a-modal>
    <a-modal
      v-model="showSetModal.show"
      :visible="true"
      title="展示设置"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-tree :tree-data="treeData" :checked-keys="checkeds" checkable @check="onCheck"> </a-tree>
    </a-modal>
    <a-modal
      v-model="classifyModal.show"
      :visible="true"
      :body-style="{
        'border-top': '1px solid #e1e1e1',
        'border-bottom': '1px solid #e1e1e1',
        padding: '0 20px',
      }"
      :footer="null"
      width="800px"
      class="classifyModalOut"
      title="分项设置"
    >
      <div class="classifyModal">
        <div class="classifyModal-left">
          <div class="classifyModal-left-title">
            <p>选择需展示分项</p>
            <div>
              <a-icon
                :style="{
                  'font-size': '20px',
                  'margin-left': '10px',
                  color: 'rgba(166, 166, 166, 1)',
                }"
                type="folder-add"
                @click="addItemModal = { show: true, type: 'add', text: '' }"
              />
            </div>
          </div>
          <div class="classifyModal-left-content">
            <div
              v-for="(item, i) in itemData.classifyList"
              :key="'itemData.classifyList' + i"
              class="classifyList"
            >
              <a-checkbox
                :checked="getChecked(item.groupName)"
                @change="onChangeChecked(item.groupName)"
              >
                {{ item.groupName }}
              </a-checkbox>
              <div class="icon">
                <a-icon
                  :style="{ 'font-size': '15px', color: 'rgba(215, 215, 215, 1)' }"
                  theme="filled"
                  type="edit"
                  @click="
                    addItemModal = { show: true, type: 'edit', text: item.groupName, index: i }
                  "
                />
              </div>
            </div>
          </div>
        </div>
        <div class="classifyModal-right">
          <div class="classifyModal-right-title">设置微断分项</div>
          <a-tree :tree-data="treeData">
            <template slot="custom" slot-scope="item">
              <div style="display: flex">
                <span>{{ item.title }}</span>
                <a-select
                  :value="getGroup(item.did)"
                  class="component-w-224"
                  style="margin-left: 20px"
                  placeholder="请选择设备所在分项"
                  @change="groupName => changeItemGroup(groupName, item.did)"
                >
                  <a-select-option :value="''"> 不设置分项 </a-select-option>
                  <a-select-option
                    v-for="(classify, i) in itemData.classifyList"
                    :value="classify.groupName"
                    :key="i + 'classify'"
                  >
                    {{ classify.groupName }}
                  </a-select-option>
                </a-select>
              </div>
            </template>
          </a-tree>
        </div>
      </div>
    </a-modal>
    <top />
    <a-row class="center">
      <a-col :span="14" style="padding-right: 25px">
        <center-left1></center-left1>
      </a-col>
      <a-col :span="10" style="padding-left: 25px">
        <center-right1 :classify-list="itemData.classifyList"></center-right1>
      </a-col>
    </a-row>
    <a-row class="center">
      <a-col :span="14" style="padding-right: 25px">
        <center-left2></center-left2>
      </a-col>
      <a-col :span="10" style="padding-left: 25px">
        <center-right2></center-right2>
      </a-col>
    </a-row>
    <bottom />
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import bg1 from './images/bg1.png';
import bg2 from './images/bg2.png';
import bg3 from './images/bg3.png';
import { getDevice, getGroup } from '@/util.js';
import bg4 from './images/bg4.png';
import bg5 from './images/bg5.png';
import centerLeft1 from './centerLeft1.vue';
import centerRight1 from './centerRight1.vue';
import centerLeft2 from './centerLeft2.vue';
import centerRight2 from './centerRight2.vue';
import bottom from './bottom.vue';
import top from './top1.vue';
import addIcon from './images/add.svg';
import service from 'servicePath/index';

const { taskManageAsk } = service;
function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
  console.log('It is not a string!');
}

export default {
  name: 'Main',
  components: {
    centerLeft1,
    centerRight1,
    centerLeft2,
    centerRight2,
    bottom,
    top,
  },
  mixins: [],
  props: {},
  data() {
    return {
      addIcon,
      allDevices: [],
      checkeds: [],
      itemData: {
        classifyList: [],
      },
      addItemModal: {
        type: 'add',
        show: false,
        text: '',
        index: -1,
      },
    };
  },
  computed: {
    ...mapState('mainPage', ['showSetModal', 'classifyModal', 'treeData', 'checkedDevices']),
  },
  watch: {
    checkedDevices(val) {
      console.log(val, '34232');
      if (val && val.length) {
        this.checkeds = val;
      }
    },
  },
  created() {},
  mounted() {
    this.getTreeData();
    this.getClassifyList();
  },
  destroyed() {},
  methods: {
    ...mapMutations('mainPage', ['setShowSetModal', 'updateTreeData', 'updateCheckedDevices']),
    getGroup(did) {
      let groupName = '';
      this.itemData.classifyList.map(classify => {
        if (classify.devices.indexOf(did) !== -1) {
          // eslint-disable-next-line prefer-destructuring
          groupName = classify.groupName;
        }
      });
      return groupName;
    },
    getChecked(groupName) {
      let checked = false;
      this.itemData.classifyList.map(classify => {
        if (classify.groupName === groupName && classify.checked) {
          checked = true;
        }
      });
      return checked;
    },
    onChangeChecked(groupName) {
      const checked = this.getChecked(groupName);
      const itemData = { ...this.itemData };
      const classifyList = [...itemData.classifyList];
      itemData.classifyList = classifyList.map(classify => {
        return {
          ...classify,
          checked: classify.groupName === groupName ? !checked : classify.checked,
        };
      });
      this.addOrEditClassifyList(itemData);
    },
    changeItemGroup(groupName, did) {
      const itemData = { ...this.itemData };
      const classifyList = [...itemData.classifyList];
      classifyList.map((classify, i) => {
        const indexIdx = classify.devices.indexOf(did);
        const devices = [...classify.devices];
        if (indexIdx !== -1) {
          devices.splice(indexIdx, 1);
        }
        classifyList[i].devices = devices;
      });
      if (groupName) {
        itemData.classifyList = classifyList.map(classify => {
          return {
            ...classify,
            devices:
              classify.devices.indexOf(did) === -1 && classify.groupName === groupName
                ? [...classify.devices, did]
                : [...classify.devices],
          };
        });
      }
      this.addOrEditClassifyList(itemData);
    },
    async getClassifyList() {
      const res = await taskManageAsk.getAssignment();
      if (res.data && res.data.assignmentInfos && res.data.assignmentInfos.length) {
        const list = res.data.assignmentInfos.filter(d => d.remark && isJSON(d.remark));
        if (!list.length) {
          return null;
        }
        const data = JSON.parse(list[0].remark);
        this.itemData = data.itemData;
        return list[0].id;
      }
      return null;
    },
    async addOrEditClassifyList(itemData = this.itemData) {
      const id = await this.getClassifyList();
      const param = {
        remark: JSON.stringify({
          itemData,
        }),
        type: '1',
      };
      if (!id) {
        await taskManageAsk.addAssignment(param);
      } else {
        await taskManageAsk.modAssignment({ ...param, id });
      }
      setTimeout(() => {
        this.getClassifyList();
        this.$message.success('设置成功');
      }, 300);

      this.addItemModal = { show: false };
    },
    async addItem() {
      const { text, type, index } = this.addItemModal;
      const itemData = { ...this.itemData };
      if (type === 'add') {
        itemData.classifyList.push({ groupName: text, devices: [] });
      } else {
        itemData.classifyList[index] = { ...itemData.classifyList[index], groupName: text };
      }
      await this.addOrEditClassifyList(itemData);
    },
    async getTreeData() {
      try {
        let tree = [];
        // 获取地址
        const level1List = await getGroup();
        // 获取配电箱
        if (level1List && level1List.length) {
          tree = await Promise.all(
            level1List.map(async level1 =>
              (async () => {
                const children = await getGroup(level1.id);
                return {
                  ...level1,
                  title: level1.name,
                  key: `${level1.id}-isGroup`,
                  children: children
                    ? children.map(level2 => ({
                        title: level2.name,
                        key: `${level2.id}-isGroup`,
                        ...level2,
                      }))
                    : [],
                };
              })()
            )
          );
          const allDevices = (await getDevice()).deviceInfos;

          // 获取网关
          tree.map(level1 => {
            if (level1.children) {
              level1.children.map((level2, i) => {
                const children = [...allDevices].filter(
                  device => device.groupid === level2.id && device.devicetype === 'gateway'
                );
                level1.children[i].children = children.map(gateway => ({
                  ...gateway,
                  key: `${gateway.id}-isGateway`,
                  title: gateway.displayname,
                }));
              });
            }
          });
          // 默认选中展示设备中的所有设备
          const subDevices = [];
          // 获取网关内的设备
          tree.map(level1 => {
            if (level1.children) {
              level1.children.map((level2, i) => {
                level2.children.map((gateway, j) => {
                  const children = [...allDevices].filter(
                    device =>
                      device.devicetype === 'device' &&
                      JSON.parse(device.privatedata).gatewayId === gateway.did
                  );
                  level1.children[i].children[j].children = children.map(device => {
                    subDevices.push(device.did);
                    return {
                      ...device,
                      key: device.did,
                      scopedSlots: {
                        title: 'custom',
                      },
                      title: device.displayname,
                    };
                  });
                });
              });
            }
          });
          // 默认选中展示设备中的所有设备
          this.updateCheckedDevices(subDevices);
          this.updateTreeData(tree);
        }
      } catch (error) {
        console.error(error);
      }
    },
    handleOk() {
      this.updateCheckedDevices(this.checkeds);
      this.setShowSetModal({ show: false });
    },
    handleCancel() {
      this.checkeds = this.checkedDevices;
    },
    onCheck(select) {
      const filterGroupAndGateway = select.filter(
        s => s.indexOf('isGroup') === -1 && s.indexOf('isGateway') === -1
      );
      console.log(filterGroupAndGateway, '342322');
      this.checkeds = filterGroupAndGateway;
    },
    onChange() {},
  },
};
</script>

<style lang="less" scoped>
.top {
  margin: 26px 10px 20px 10px;
  display: flex;
  .top-col1,
  .top-col3,
  .top-col2 {
    padding: 0 10px;
    width: calc(33.33333% - 30px);
    display: flex;
    white-space: nowrap;
    > div {
      height: 100px;
    }
  }
  .top-col1,
  .top-col2,
  .top-col3 {
    > div {
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border-radius: 5px;
      width: 100%;
      display: flex;
      padding-right: 100px;
      padding-left: 26px;
      > div {
        width: 33.3%;
        > p {
          margin: 0;
        }
        > p:nth-child(1) {
          height: 30px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 20px;
          line-height: 30px;
          margin-top: 15px;
        }
        > p:nth-child(2) {
          height: 39px;
          color: rgba(255, 255, 255, 1);
          font-size: 26px;
          line-height: 39px;
          font-weight: bold;
          span {
            opacity: 0.8;
            color: rgba(255, 255, 255, 1);
            font-size: 20px;
          }
        }
      }
    }
  }
  .top-col4 {
    padding: 0 10px;
    > div {
      width: 70px;
      height: 100px;
      color: rgba(80, 80, 80, 1);
      background-color: rgba(255, 255, 255, 1);
      box-shadow: rgba(204, 204, 204, 1) solid 1px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 50px;
      padding: 26px 0;
      text-align: center;
      > p {
        line-height: 22px;
        margin: 0;
        text-align: center;
      }
    }
  }
}
.total {
  display: flex;
  padding: 0 10px;
  > div {
    padding: 26px 10px 20px 10px;
    flex: 1;
    > div {
      width: 100%;
      position: relative;
      > div {
        position: absolute;
        left: 10%;
        top: 25%;
        height: 50%;
        line-height: 100%;
        display: flex;
        flex-direction: column;
        > p:nth-child(1) {
          color: rgba(255, 255, 255, 0.8);
          font-size: 20px;
        }
        > p:nth-child(2) {
          margin-top: auto;
          color: rgba(255, 255, 255, 1);
          font-size: 26px;
          font-weight: bold;
          span {
            opacity: 0.8;
            color: rgba(255, 255, 255, 1);
            font-size: 20px;
            text-align: left;
            font-weight: normal;
          }
          //   margin: 25% 0 0 0;
        }
      }
    }
  }
}
.center {
  margin: 0 20px;
  background: #fff;
}
.ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
  background-color: none !important;
}
.classifyModalOut {
  width: 2200px;
}
.classifyModal {
  display: flex;
  .classifyModal-left {
    width: 216px;
    border-right: 1px solid #e1e1e1;
    min-height: 470px;
    padding-top: 20px;
    .classifyModal-left-title {
      height: 21px;
      line-height: 21px;
      color: rgba(56, 56, 56, 1);
      font-size: 14px;
      display: flex;
      > p {
        margin: 0;
      }
      > div {
        height: 21px;
        width: 40px;
        display: flex;
        i {
          margin: auto;
        }
      }
    }
    .classifyModal-left-content {
      padding-top: 8px;
      .classifyList {
        display: flex;
        margin: 10px 0;
        .icon {
          margin-left: auto;
          padding-right: 17px;
          display: flex;
          i {
            margin: auto;
          }
        }
      }
    }
  }
  .classifyModal-right {
    padding: 22px 0 20px 28px;
    .classifyModal-right-title {
      margin-bottom: 18px;
      height: 21px;
      line-height: 21px;
      color: rgba(56, 56, 56, 1);
      font-size: 14px;
    }
  }
}
</style>
