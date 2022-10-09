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
          @click="add">添加商品</a-button>
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
          <!-- <img slot="cover"
               :src="item.picurl||defaultImg"
               alt="site" /> -->
          <a-card-meta :title="item.title">
            <template slot="description">
              <div class="extra mt10">商品单价：{{ item.price/100 }}元</div>
              <div class="extra">充电时长：{{ item.duration }}分钟</div>
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
  import defaultImg from 'stylesPath/images/default.png';

  const { goodsManageAsk } = service;
  const { GoodsListCreaterMix } = Mix;
  export default {
    name: 'SiteGoodsList',
    components: {},
    mixins: [GoodsListCreaterMix('sitegoods')],
    props: {},
    data() {
      return {
        defaultImg,

        breadcrumbRoutes: [
          {
            name: 'goodssiteList',
            breadcrumbName: '全部站点',
          },
          {
            name: 'sitegoodsList',
            breadcrumbName: '站点商品',
          },
        ],
        search: "",
        siteid: '',
      };
    },
    computed: {

    },
    watch: {},
    created() {
      this.siteid = this.$route.params.id
    },
    mounted() {},
    methods: {
      detail(location) {
        this.$router.push({ name: `sitegoodsDetail`, params: { id: this.siteid } });
      },
      getSearch() {
        const { search} = this;
        // this.updateSearch(searchdata);
      },
      add() {
        this.$router.push({ name: 'sitegoodsAdd', params: { siteid: this.siteid }  });
      },
    },
  };
</script>

<style lang="less" scoped>
  .flex-panel {
    display: flex;
    flex-wrap: wrap;
    // margin-top: 10px;
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
