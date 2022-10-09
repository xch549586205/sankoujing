<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 11:04:03
 * @LastEditTime: 2019-10-10 17:29:22
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-spin :spinning="spinning">
    <div>
         <bl-header>
      <bl-breadcrumb slot="left"
                     :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
      <div slot="right">

      </div>
    </bl-header>
    <bl-page-wrapper>
      <div slot="content">
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
                    rules: [
                      {
                        required: false,
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
              label="数量"
            >
              <a-input-number
                :min="1"
                :precision="0"
                v-decorator="[
                  `size`,
                  {
                    initialValue: cell.size,
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
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="剩余"
            >
              <a-input-number
                :min="1"
                :max="cell.size"
                :precision="0"
                v-decorator="[
                  `available`,
                  {
                    initialValue: cell.available,
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
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :colon="false"
              label="积分"
            >
              <a-input-number
                :min="1"
                :precision="0"
                v-decorator="[
                  `score`,
                  {
                    initialValue: cell.score,
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
              <a-button v-if="cell.id>0" class="mr10" type="danger" @click="showDelModal">删除</a-button>
              <a-button class="mr10" type="primary" @click="ok">确定 </a-button>
            </a-form-item>
          </a-form>
              </div>
      </div>
    </bl-page-wrapper>
    </div>
  </a-spin>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import service from 'servicePath/index';
const { appAsk, exchangerManageAsk, goodsManageAsk } = service;


export default {
  name: 'ExchangerDetail',
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
          name: 'exchangerList',
          breadcrumbName: '全部积分',
        },
        {
            name: 'exchangerDetail',
            breadcrumbName: '积分详情',
        },
        {
            name: 'exchangerCellDetail',
            breadcrumbName: '兑换详情',
        },
      ],
      exchangerid: this.$route.params.exchangerid,
      no: this.$route.params.no,
      cell: {},
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
      exchangerManageAsk.getExchangerCell({id: parseInt(this.exchangerid), no: parseInt(this.no)}).then(res => {
        const { errcode, cell = {} } = res.data
        this.cell = cell 
        console.log(this.exchanger)

        this.form.setFieldsValue({
            goodsid: cell.goodsid,
            size: cell.size
            // icon: this.exchanger.icon,
        })
      }).catch(err => {

      })
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
      this.$router.push({ name: 'exchangerList'})
    },
    goodsChange(val) {
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
        no: parseInt(this.no),
        exchangerid: parseInt(this.exchangerid)
      };
        exchangerManageAsk
        .bindGoods(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'exchangerList' });
            this.spinning = false;
          }
        })
        .catch((e) => {
          this.spinning = false;
          console.error(e);
        });
    },
    del() {
      this.spinning = true;
      const { exchangerid } = this;
      const params = {
        ids: [parseInt(exchangerid)],
      };
      exchangerManageAsk
        .delExchanger(params)
        .then((result) => {
          const { errcode, data } = result;
          if (errcode === 200) {
            this.$message.success('操作成功！');
            this.$router.push({ name: 'exchangerList', params: { siteid: this.siteid, deviceid: this.deviceid} });
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
