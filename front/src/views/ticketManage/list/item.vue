<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 11:07:11
 * @LastEditTime: 2019-09-18 15:59:20
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
     <!-- <bl-header>
      <bl-breadcrumb slot="left"
                     :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
      <div slot="right">
          <a-button type="primary"
          @click="add">添加商品</a-button>
      </div>
    </bl-header>
    <bl-page-wrapper>
      <div slot="content">
        <div> -->

    <div class="flex-panel">
      <div v-for="item in data"
           :key="item.id"
           class="flex-item mb20">
        <a-card hoverable
                class="reset-padding"
                @click="()=>detail(item)">
          <img slot="cover"
               :src="item.goods.picurl || defaultImg"
               alt="site" />
          <a-card-meta :title="item.title">
            <template slot="description">
              <div class="extra mt10">单价：{{ item.goods.price/100 }}元</div>
              <div class="extra">总价：{{ item.goods.price/100 * item.number }}元</div>
              <div class="extra">数量：    
                
                    <!-- <a-button type="primary" shape="circle" icon="minus" @click="item.number--"/> -->
                    {{ item.number}}
                    <!-- <a-button type="primary" shape="circle" icon="plus"  @click="item.number++"/> -->
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </div>
    </div>
    <div>
      <a-pagination v-if="total>0"
                    :total="total"
                    :current="current"
                    :page-size="GLOBAL.PAGE_SIZE_S"
                    @change="change" />
    </div>
           </div>
      <!-- </div>
    </bl-page-wrapper>
  </div> -->
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import service from 'servicePath/index';
  import Mix from '@/mixins';
  import defaultImg from 'stylesPath/images/default.png';

  const { ticketManageAsk } = service;
  const { PageTableCreaterMix } = Mix;
  export default {
    name: 'TicketItemList',
    components: {},
    mixins: [PageTableCreaterMix('ticketItemList')],
    props: {},
    data() {
      return {
        defaultImg,

        spinning: false,
        total: 0,

        search: "",
        ticketid: this.$route.params.ticketid,
      };
    },
    computed: {
        breadcrumbRoutes() {
          return  [
            {
              name: 'ticketList',
              breadcrumbName: '全部票据',
            },
            {
              name: 'ticketDetail',
              breadcrumbName: '票据详情',
            },
          ]
        }
    },
    watch: {},
    created() {
    },
    mounted() {},
    methods: {
      detail(item) {
        this.$router.push({ name: `ticketItemDetail`, params: { ticketid: item.ticketid, itemid: item.id } });
      },
      getSearch() {
        const { search} = this;
        // this.updateSearch(searchdata);
      },
      add() {
        this.$router.push({ name: 'ticketItemAdd', params: { ticketid: item.ticketid }  });
      },
      async ticketItemListFetchList(params) {
        // const { ticketid } = this
        const ticketid = parseInt(this.ticketid)
        const { errcode, data = {} } = await ticketManageAsk.ticketItemList({
          ...params,
          ticketid,
          order: 'createtime',
          seq: -1,
        });
        return { total: data.totalsize, data: data.items };
      },
    },
  };
</script>

<style lang="less" scoped>
  .flex-panel {
    display: flex;
    flex-wrap: wrap;
    // margin-top: 10px;
      margin-left: 20px;
      margin-right: 20px;
    .flex-item {
      margin-top: 20px;
      margin-right: 20px;
      width: 17%;
    }
  }
  .extra {
    color: @bl-gray-3;
  }
  img {
    border-radius: @bl-border-radius-base;
    object-fit: cover;
    overflow: hidden;
  }
  .location {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
