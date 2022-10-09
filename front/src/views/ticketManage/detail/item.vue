<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 11:04:03
 * @LastEditTime: 2019-10-10 17:29:22
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-spin :spinning="spinning">
    <!-- <div>
         <bl-header>
      <bl-breadcrumb slot="left"
                     :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
      <div slot="right">

      </div>
    </bl-header>
    <bl-page-wrapper>
      <div slot="content"> -->
        <div class="pt20">

            <a-form :form="form" hide-required-mark >

            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="商品"
            >
              <a-select class="component-w-108"
                  v-decorator="[
                  `goodsid`,
                  {
                    initialValue: item.goodsid,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
                  >
                <a-select-option v-for="goods in goodsList"
                           :key="goods.id"
                           :value="goods.id"
                           @change="goodsChange">
                  {{ goods.title }} 
                </a-select-option>
              </a-select>
                
            </a-form-item>
 
            <!-- <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="商品价格"
            >
              <span>￥{{item.price*item.number}}</span>
            </a-form-item> -->

             
            <a-form-item
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="商品数量"
            >
              <a-input-number
                :min="1"
                :precision="0"
                v-decorator="[
                  `number`,
                  {
                    initialValue: item.number,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>

            <a-form-item
              :label-col="{ span: 0 }"
              :wrapper-col="{ span: 24 }"
              :colon="false"
              label=""
              style="margin-top: 100px"
            >
              <a-button class="ml30 mr10" @click="cancel">取消</a-button>
              <a-button v-if="itemid" class="mr10" type="danger" @click="showDelModal">删除</a-button>
              <a-button class="mr10" type="primary" @click="ok">确定 </a-button>
            </a-form-item>
          </a-form>
              </div>
      <!-- </div>
    </bl-page-wrapper>
    </div> -->
  </a-spin>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
const { appAsk, ticketManageAsk, goodsManageAsk } = service;


export default {
  name: 'TicketDetail',
  components: {
  },
  mixins: [],
  props: {},
  data() {
    return {
      data: {
      },
      spinning: false,
      form: this.$form.createForm(this),
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      breadcrumbRoutes: [
        {
          name: 'ticketList',
          breadcrumbName: '全部票据',
        },
        {
            name: 'ticketDetail',
            breadcrumbName: '票据详情',
        },
      ],
      ticketid: this.$route.params.ticketid,
      itemid: this.$route.params.itemid,
      item: {},
      goodsList: [],
     
    };
  },
  computed: {
    ...mapState('app', ['projectInfo']),
    dids: function() {
      return this.devices.map((v) => v.deviceid);
    }
  },
  watch: {},
  created() {
      goodsManageAsk.goodsList({a:1}).then(result => {
        const { errcode, data = {} } = result;
          if (errcode === 200) {
            this.goodsList = data.goodss;
          }
      })
  },
  mounted(){
    if (this.itemid) {
      ticketManageAsk.ticketItemList({id: parseInt(this.itemid)}).then(res => {
        const { errcode, items = [] } = res.data
        this.item = items[0] || {}
        console.log(this.ticket)

        this.form.setFieldsValue({
            goodsid: this.item.goodsid,
            number: this.item.number
            // icon: this.ticket.icon,
        })
      }).catch(err => {

      })
    }
  },
  methods: {
        // 删除确认弹窗
    showDelModal() {
      const that = this;
      this.$confirm({
        title: '确定要删除商品？',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          that.del();
        },
        onCancel() {},
      });
    },
    cancel() {
      this.$router.push({ name: 'ticketList'})
    },
    goodsChange(val) {
      this.item.number = 1
    },
    // 确定
    ok() {
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
          // 添加
          this.add( fieldsValue);
      });
    },
    // 添加
    add(record) {
      this.spinning = true;
      const params = {
        ...record,
        id: parseInt(this.itemid),
        ticketid: parseInt(this.ticketid)
      };
      let goods = this.goodsList.find(item => {
        return item.id ==  record.goodsid
      })
      if (goods) {
        params.remark = JSON.stringify(goods)
      }
      if (this.itemid) {
        ticketManageAsk
        .modTicketItem(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'ticketItemList' });
            this.spinning = false;
          }
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
      } else {
        ticketManageAsk
        .newTicketItem(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'ticketItemList' });
            this.spinning = false;
          }
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
      }
    },
    del() {
      this.spinning = true;
      const { itemid } = this;
      const params = {
        ids: [parseInt(itemid)],
      };
      ticketManageAsk
        .delTicketItem(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'ticketItemList' });
          }
          this.spinning = false;
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
.tips {
  display: table-cell;
  vertical-align: bottom;
  line-height: 1.5;
  height: 102px;
}
</style>
