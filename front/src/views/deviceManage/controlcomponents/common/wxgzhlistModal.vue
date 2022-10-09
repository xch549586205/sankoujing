<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-08 14:52:18
 * @LastEditTime: 2021-02-05 14:04:55
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
            @search="doSearch2"
          />
        </a-col>
        <a-col :span="12">
          <a-button @click="syncUser">同步用户列表</a-button>
        </a-col>
      </a-row>

      <a-spin :spinning="spinning">
        <div class="modal-border-panel mt20">
          <!-- <div>
            <a-checkbox
              :checked="checkAll"
              :indeterminate="indeterminate"
              style="margin-bottom: 10px"
              @change="onCheckAllChange"
              >全选</a-checkbox
            >
          </div> -->
          <a-checkbox-group v-model="checkedList">
            <a-row v-for="item in filterUser" :key="item.openid" class="mb10">
              <a-checkbox @change="changeCheckedList" :value="item.openid">{{
                `${item.nickname}`
              }}</a-checkbox>
            </a-row>
          </a-checkbox-group>
        </div>
        <div class="modal-footer-btn mt20">
          <a-row :gutter="10">
            <a-col :span="12">
              <a-input-search
                v-model="searchInfo.page"
                enter-button="跳转（页）"
                @search="doSearch"
              />
            </a-col>
            <a-col :span="4">
              <a-button @click="doSearchPre">上一页</a-button>
            </a-col>
            <a-col :span="4">
              <a-button @click="doSearchNext">下一页</a-button>
            </a-col>
          </a-row>
        </div>
        <div class="modal-footer-btn mt20">
          <a-button @click="cancel">取消</a-button>
          <a-button class="ml10" type="primary" @click="ok">确定 </a-button>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';

const { userManageAsk, deviceManageAsk } = service;
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
      default: [],
    },
    did: String,
    flag: {
      type: String,
      default: 'null',
    },
    productid: {
      type: String,
      default: '',
    },
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isModal: false,
      userList: [],
      checkedList: [],
      allUserList: {},
      spinning: false,
      searchInfo: {
        search: '',
        phone: '',
        page: 1,
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
      const { userList } = this;
      const devices = userList;
      return devices || [];
    },
    checkAll() {
      const { checkedList, filterUser } = this;
      return checkedList.length === filterUser.length && checkedList.length > 0;
    },
  },
  watch: {
    data(newVal, oldVal) {
      console.log('userList watch', newVal, oldVal);
      // if (newVal==undefined || newVal.length==0){
      //   return
      // }
      if (newVal == undefined || newVal.length == 0 || newVal == '') {
        return;
      }
      var opsenidStr = newVal.join(';');
      this.getUser(1, '', opsenidStr).then((resp) => {
        this.$emit('ok', resp);
      });
    },
    showModal(newVal, oldVal) {
      this.isModal = newVal;
    },
  },
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
      const { checkedList, userList } = this;
      if (checkedList.length < 1) {
        this.$message.warning('请先选择人员！');
        return;
      }
      const params = [];

      for (var openid in this.allUserList) {
        let v = this.allUserList[openid];

        if (v.choosed) {
          params.push(v);
        }
      }
      this.$emit('ok', params);
    },
    onCheckAllChange(e) {
      const { filterUser } = this;
      Object.assign(this, {
        checkedList: e.target.checked ? filterUser && filterUser.map((v) => v.openid) : [],
      });
    },
    changeCheckedList(e) {
      if (this.allUserList[e.target.value]) {
        if (e.target.checked) {
          this.allUserList[e.target.value].choosed = true;
        } else {
          this.allUserList[e.target.value].choosed = false;
        }
      }
    },
    doSearch() {
      // this.checkedList = [];
      this.getUser(this.searchInfo.page, this.searchInfo.search);
    },
    doSearch2() {
      // this.checkedList = [];
      this.getUser(1, this.searchInfo.search);
      this.searchInfo.page = 1;
    },
    doSearchNext() {
      this.searchInfo.page = this.searchInfo.page + 1;
      this.doSearch();
    },
    doSearchPre() {
      this.searchInfo.page = this.searchInfo.page - 1;
      if (this.searchInfo.page < 1) {
        this.searchInfo.page = 1;
      }
      this.doSearch();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },

    devControl(page, nickname, openidList) {
      return new Promise((resolve, reject) => {
        if (this.data) {
          for (var item of this.data) {
            this.allUserList[item.openid] = item;
          }
        }
        // this.data = []
        this.spinning = true;
        const did = this.did;
        var devctrs = [];

        let controldata = {
          nickname: nickname,
          openidList: openidList,
          cmd: 'getuser',
          limit: '20',
          offset: 20 * (page - 1) + '',
        };
        devctrs.push({
          did: did,
          data: controldata,
        });

        const params = {
          devctrs,
        };

        deviceManageAsk
          .devControl(params)
          .then((result) => {
            const { errcode, data = {} } = result;
            if (errcode === 200) {
              if (data.responses && data.responses[0] && data.responses[0].status) {
                var userList = [];
                for (var index in data.responses[0].status) {
                  let info = JSON.parse(data.responses[0].status[index]);

                  if (!this.allUserList[info.openid]) {
                    this.allUserList[info.openid] = info;
                  } else {
                    if (this.allUserList[info.openid].choosed) {
                      this.checkedList.push(info.openid);
                    }
                  }
                  userList.push(info);
                }
              }
              resolve(userList);
              this.userList = userList;
              console.log('userList', userList);
            }
            this.spinning = false;
          })
          .catch((e) => {
            resolve([]);

            this.spinning = false;
            console.error(e);
          });
      });
    },

    syncUser() {
      const did = this.did;
      var devctrs = [];

      let controldata = {
        cmd: 'syncuser',
      };
      devctrs.push({
        did: did,
        data: controldata,
      });

      const params = {
        devctrs,
      };

      deviceManageAsk
        .devControl(params)
        .then((result) => {})
        .catch((e) => {
          console.error(e);
        });
    },
    // 查询设备列表
    async getUser(page = 1, nickname = '', openidList = '') {
      this.spinning = true;
      var resp = await this.devControl(page, nickname, openidList);
      return resp;
    },
  },
};
</script>

<style lang="less" scoped></style>
