<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-08 14:52:18
 * @LastEditTime: 2019-11-01 11:44:15
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-modal
      v-model="isModal"
      :mask-closable="false"
      :width="560"
      :footer="null"
      :title="title"
      @cancel="cancel"
    >
      <a-row :gutter="10">
        <a-col :span="12">
          <a-input-search
            v-model.trim="searchInfo.search"
            placeholder="请输入人员名称搜索"
            enter-button
            @search="doSearch"
          />
        </a-col>
        <a-col :span="12">
          <a-input-search
            v-model.trim="searchInfo.phone"
            placeholder="请输入手机号搜索"
            enter-button
            @search="doSearch"
          />
        </a-col>
      </a-row>

      <a-spin :spinning="spinning">
        <div class="modal-border-panel mt20">
          <div>
            <a-checkbox
              :checked="checkAll"
              :indeterminate="indeterminate"
              style="margin-bottom: 10px"
              @change="onCheckAllChange"
              >全选</a-checkbox
            >
          </div>
          <a-checkbox-group v-model="checkedList">
            <a-row v-for="item in filterUser" :key="item.accountname" class="mb10">
              <a-checkbox :value="item.accountname">{{
                `${item.displayname}(${item.accountname})`
              }}</a-checkbox>
            </a-row>
          </a-checkbox-group>
        </div>

        <div class="modal-footer-btn mt20">
          <a-button @click="cancel">取消</a-button>
          <a-button class="ml10" type="primary" @click="ok">确定 </a-button>
        </div>
      </a-spin> </a-modal
    >>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';

const { userManageAsk } = service;
export default {
  name: 'DeviceModal',
  components: {},
  mixins: [],
  props: {
    title: {
      type: String,
      default: '选择人员',
    },
    data: {
      type: Array,
      default: () => [],
    },
    flag: {
      type: String,
      default: 'null',
    },
    productid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isModal: true,
      userList: [],
      checkedList: [],
      spinning: false,
      searchInfo:{
        search: '',
        phone:""
      },
    };
  },
  computed: {
    indeterminate() {
      const { checkedList, filterUser } = this;
      return !!checkedList.length && checkedList.length < filterUser.length;
    },
    filterUser() {
      // 已选中的设备不显示在弹窗中
      const {userList } = this;
      const devices = userList;
      return devices || [];
    },
    checkAll() {
      const { checkedList, filterUser } = this;
      return checkedList.length === filterUser.length && checkedList.length > 0;
    },
  },
  watch: {},
  created() {
    this.getUser();
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 取消
    cancel() {
      this.$emit('cancel');
    },
    // 确定
    ok() {
      this.spinning = true;
      const { checkedList, userList } = this;
      if (checkedList.length < 1) {
        this.$message.warning('请先选择人员！');
        this.spinning = false;
        return;
      }
      const params = [];
      checkedList.forEach((v) => {
        const index = userList.findIndex((k) => k.accountname === v);
        if (index > -1) {
          params.push(userList[index]);
        }
      });
      this.$emit('ok', params);
    },
    onCheckAllChange(e) {
      const { filterUser } = this;
      Object.assign(this, {
        checkedList: e.target.checked ? filterUser && filterUser.map((v) => v.accountname) : [],
      });
    },
    doSearch() {
      this.checkedList = [];
      this.getUser();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },

    // 查询设备列表
    getUser() {
      this.spinning = true;
      const { search,phone } = this.searchInfo;
      const params = {
        limit: this.GLOBAL.MAX_LEN,
        offset: 1,
        displayname: search,
        accountname:phone
      };

      userManageAsk
        .getAccounttable(params)
        .then((result) => {
          const { errcode, data = {} } = result;
          if (errcode === 200) {
            this.userList = data.alist || [];
            this.spinning = false;
          }
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
