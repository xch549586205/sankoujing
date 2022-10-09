<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 11:07:11
 * @LastEditTime: 2019-09-18 15:59:20
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <div class="header-panel">
      <bl-header>
        <bl-breadcrumb slot="left"
                       :breadcrumb-routes="breadcrumbRoutes"></bl-breadcrumb>
        <div slot="right">
          <a-input-search v-model.trim="search"
                          placeholder="输入名称搜索"
                          class="component-w-224"
                          style="margin:0 10px;"
                          enter-button
                          @change="getSearch"
                          @search="doSearch" />
        <a-button type="primary"
          @click="add">添加积分兑换</a-button>
        </div>
      </bl-header>
    </div>
    <bl-page-wrapper>
      <div slot="content">

        <a-spin :spinning="spinning">
          <div class="flex-panel">
            <div v-for="item in data"
                 :key="item.id"
                 class="flex-item mb20">
              <a-card hoverable
                      class="reset-padding"
                      @click="()=>detail(item)">
                <img slot="cover"
                     :src="defaultImg"
                     alt="site" />
                <a-card-meta :title="item.name">
                  <template slot="description">
                    <div class="extra mt10">尺寸：{{ item.xsize }}x{{item.ysize}}</div>
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
        </a-spin>
      </div>
    </bl-page-wrapper>
  </div>
</template>
<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import service from 'servicePath/index';
  import Mix from '@/mixins';
  import defaultImg from 'stylesPath/images/goods.jpg';

  const { exchangerManageAsk } = service;
  const { PageTableCreaterMix } = Mix;
  export default {
    name: 'ExchangerList',
    components: {},
    mixins: [PageTableCreaterMix('exchangerList')],
    props: {},
    data() {
      return {
        defaultImg,
          spinning: false,
        total: 0,

        breadcrumbRoutes: [
          {
            name: 'exchangerList',
            breadcrumbName: '全部积分',
          },
        ],
        search: "",
        deviceid: this.$route.params.deviceid,
      };
    },
    computed: {

    },
    watch: {},
    created() {
    },
    mounted() {},
    methods: {
      detail(item) {
        this.$router.push({ name: `exchangerDetail`, params: { exchangerid: item.id } });
      },
      doSearch() {
        this.init()
      },
      getSearch() {
        const { search} = this;
        // this.updateSearch(searchdata);
      },
      add() {
        this.$router.push({ name: 'exchangerAdd'  });
      },
     async exchangerListFetchList(params) {
        const { errcode, data = {} } = await exchangerManageAsk.queryExchanger({
          ...params,
          order: 'createtime',
          seq: -1,
        });
        return { total: data.totalsize, data: data.exchangers };
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
