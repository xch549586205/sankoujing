<template>
  <bl-page-wrapper>
    <div slot="content"
         class="content">
      <a-row style="height:100%">
        <a-col :span="14"
               class="contentLeft">
          <div>
            <div class="title">
              项目概况
            </div>
            <a-row class="num-row">
              <a-col :span="6"
                     class="num-col">
                <p>累计项目数量</p>
                <p>12 <span>个</span></p>
              </a-col>
              <a-col :span="6"
                     class="num-col">
                <p>累计项目数量</p>
                <p>12 <span>个</span></p>
              </a-col>
              <a-col :span="6"
                     class="num-col">
                <p>累计项目数量</p>
                <p>12 <span>个</span></p>
              </a-col>
              <a-col :span="6"
                     class="num-col"
                     l>
                <p>累计项目数量</p>
                <p>12 <span>个</span></p>
              </a-col>
            </a-row>
            <MapCharts />
            <a-row class="list">
              <a-col :span="15"
                     class="listLeft">
                <a-row class="header"
                       style="padding-right:10px">
                  <a-col :span="5"
                         style="text-align:center">序号</a-col>
                  <a-col :span="7">项目名称</a-col>
                  <a-col :span="6">所在地区</a-col>
                  <a-col :span="6">设备数量</a-col>
                </a-row>
                <div class="listLeftContent">
                  <div v-for="(item, i) in leftList"
                       :key="i"
                       @click="changeCurrentProductId(item.id)">
                    <a-row :style="{
                        background:
                          item.id === currentProductId ? 'rgba(46, 140, 240, 0.2)' : '#fff',
                      }"
                           class="header">
                      <div v-if="item.id === currentProductId"
                           class="currentLabel">
                        <img :src="labelIcon" />
                      </div>
                      <a-col :span="5"
                             style="text-align:center">{{ i + 1 }}</a-col>
                      <a-col :span="7">{{ item.name }}</a-col>
                      <a-col :span="6">{{ item.city }}</a-col>
                      <a-col :span="5">{{ item.num }}</a-col>
                    </a-row>
                  </div>
                </div>
              </a-col>
              <a-col :span="9"
                     class="listRight">
                <div class="header">
                  选中项目当前状态
                </div>
                <div v-for="(item, i) in rightList"
                     :key="i"
                     class="list">
                  <div class="listCol">
                    <div class="text">
                      <p>{{ item.name }}</p>
                      <p>{{ item.num }}</p>
                    </div>
                    <div class="circular">
                      <div :style="{
                          width: (item.num / maxCircular) * 100 + '%',
                          background: item.color,
                        }"
                           class="inCircular"></div>
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :span="10"
               class="contentRight">
          <div>
            <div class="title">
              设备概况
            </div>
            <div class="status">
              <a-row class="onlineDevice">
                <a-col :span="12"
                       class=""
                       style="display:flex">
                  <div class="liquidfillCharts">
                    <LiquidfillCharts />
                  </div>
                  <div>
                    <p>当前在线设备</p>
                    <p><span>2598</span>个</p>
                  </div>
                </a-col>
                <a-col :span="12">
                  <p>
                    <span>日活率</span>
                    <a-icon type="caret-up"
                            style="color: rgba(212, 75, 69, 1);margin:0 12px" />
                    <span class="num">23%</span>
                  </p>
                  <p>
                    <span>激活率</span>
                    <a-icon type="caret-down"
                            style="color: rgba(0, 186, 173, 1);margin:0 12px" />
                    <span class="num">23%</span>
                  </p>
                </a-col>
              </a-row>
            </div>
            <div class="statusList">
              <div v-for="(item, i) in statusList"
                   :key="i">
                <div>
                  <p>{{ item.name }}</p>
                  <p>
                    <span>{{ item.num }}</span>个
                  </p>
                </div>
                <div>
                  <img :src="item.icon" />
                </div>
              </div>
            </div>
            <a-tabs :tab-bar-style="{background:'#fff'}"
                    :default-active-key="activeKey"
                    class="tabs"
                    @change="changeActiveKey">
              <a-tab-pane key="tab1"
                          tab="每日新增">
                <LineCharts id="tab1" />

              </a-tab-pane>
              <a-tab-pane key="tab2"
                          tab="日活设备">
                <LineCharts id="tab2" />

              </a-tab-pane>
              <a-tab-pane key="tab3"
                          tab="累计激活">
                <LineCharts id="tab3" />
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-col>
      </a-row>
    </div>
  </bl-page-wrapper>
</template>
<script>
  import service from 'servicePath/index';
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
  import MapCharts from './mapCharts.vue';
  import LineCharts from './lineCharts.vue';
  import LiquidfillCharts from './liquidfillCharts.vue';

  import labelIcon from './images/label.png';
  import icon1 from './images/icon1.png';
  import icon2 from './images/icon2.png';
  import icon3 from './images/icon3.png';
  import icon4 from './images/icon4.png';
  import icon5 from './images/icon5.png';
  import icon6 from './images/icon6.png';

  const { appAsk } = service;
  export default {
    name: 'Main',
    components: { MapCharts, LineCharts, LiquidfillCharts },
    props: {},
    data() {
      return {
        activeKey: 'tab1',
        currentProductId: 1,
        labelIcon,
        statusList: [
          {
            name: '出厂设备',
            num: 4600,
            icon: icon1,
          },
          {
            name: '日活设备',
            num: 4600,
            icon: icon2,
          },
          {
            name: '激活设备',
            num: 4600,
            icon: icon3,
          },
          {
            name: '在线网关',
            num: 4600,
            icon: icon4,
          },
          {
            name: '在线微断',
            num: 4600,
            icon: icon5,
          },
          {
            name: '离线设备',
            num: 4600,
            icon: icon6,
          },
        ],
        leftList: [
          {
            name: '三口井智慧用电',
            city: '南京',
            id: 1,
            num: 358,
          },
          {
            name: '三口井智慧用电',
            city: '南京',
            id: 2,
            num: 358,
          },
          {
            name: '三口井智慧用电',
            city: '南京',
            id: 3,
            num: 358,
          },
          {
            id: 4,
            name: '三口井智慧用电',
            city: '南京',
            num: 358,
          },
          {
            name: '三口井智慧用电',
            city: '南京',
            id: 5,
            num: 358,
          },
          {
            name: '三口井智慧用电',
            id: 6,
            city: '南京',
            num: 358,
          },
          {
            name: '三口井智慧用电',
            id: 7,
            city: '南京',
            num: 358,
          },
          {
            name: '三口井智慧用电',
            id: 8,
            city: '南京',
            num: 358,
          },
          {
            name: '三口井智慧用电',
            city: '南京',
            id: 9,
            num: 358,
          },
        ],
        rightList: [
          { name: '今日告警', num: 122, color: 'rgba(255, 124, 119, 1)' },
          { name: '设备异常', num: 12, color: 'rgba(0, 186, 173, 1)' },
          { name: '用电安全告警', num: 28, color: 'rgba(255, 183, 26, 1)' },
          { name: '分合位次数', num: 128, color: 'rgba(46, 140, 240, 1)' },
        ],
      };
    },
    computed: {
      ...mapState('app', ['userInfo']),
      maxCircular() {
        return this.rightList.sort((a, b) => a.num - b.num)[this.rightList.length - 1].num;
      },
    },
    watch: {},
    created() {},
    mounted() {},
    methods: {
      changeCurrentProductId(id) {
        this.currentProductId = id;
      },
      changeActiveKey(key) {
        this.activeKey = key;
      },
    },
  };
</script>

<style lang="less" scoped>
  .content {
    height: 100%;
  }
  .contentLeft,
  .contentRight {
    > div {
      background: #fff;
      height: 100%;
      padding: 0 20px;
    }
    .title {
      height: 59px;
      border-bottom: 1px solid rgba(229, 229, 229, 1);
      color: rgba(56, 56, 56, 1);
      font-size: 16px;
      line-height: 59px;
      font-weight: bold;
    }
  }
  .contentLeft {
    background: #eef2f5;
    padding-right: 10px;
    height: 100%;
    .num-row {
      text-align: center;
      padding: 20px 0;
      .num-col {
        > p:nth-child(1) {
          color: rgba(119, 119, 119, 1);
          font-size: 16px;
          margin: 0;
        }
        > p:nth-child(2) {
          margin: 9px 0 0 0;
          color: rgba(0, 0, 0, 1);
          font-size: 24px;
          font-weight: bold;
          span {
            color: rgba(128, 128, 128, 1);
            font-size: 16px;
          }
        }
      }
    }
    .list {
      margin-top: 20px;
      .listLeft {
        padding-right: 40px;

        .header {
          border-bottom: 1px solid rgba(229, 229, 229, 1);
          > div {
            height: 48px;
            color: rgba(0, 0, 0, 0.85);
            font-size: 12px;
            font-weight: bold;
            line-height: 48px;
          }
        }
        .listLeftContent {
          padding-right: 10px;
          max-height: 245px;
          overflow-y: scroll;
          .header {
            > div {
              font-weight: normal;
            }
            position: relative;
            .currentLabel {
              position: absolute;
              width: 15px;
              display: flex;
              border-left: 8px solid rgba(46, 140, 240, 1);
              left: 0;
              top: 0;
              height: 100%;
              img {
                transform: rotate(-90deg);
                height: 40px;
                margin: auto 0 auto -18px;
              }
            }
          }
        }
      }
      .listRight {
        .header {
          height: 48px;
          color: rgba(0, 0, 0, 0.85);
          font-size: 12px;
          font-weight: bold;
          line-height: 48px;
          margin-bottom: 6px;
        }
        .list {
          .listCol {
            .text {
              margin-top: 20px;
              height: 21px;
              line-height: 21px;
              display: flex;
              > p:nth-child(1) {
                color: rgba(56, 56, 56, 1);
                font-size: 14px;
              }
              > p:nth-child(2) {
                margin-left: auto;
                color: rgba(0, 0, 0, 1);
                font-size: 14px;
                text-align: right;
                font-weight: bold;
              }
            }
            .circular {
              height: 8px;
              margin-top: 10px;
              background: rgba(229, 229, 229, 1);
              border-radius: 4px;
              .inCircular {
                height: 8px;
                border-radius: 4px;
              }
            }
          }
        }
      }
    }
  }
  .contentRight {
    background: #eef2f5;
    padding-left: 10px;
    height: 100%;
    .status {
      padding: 60px 60px 16px 60px;
      .onlineDevice {
        .liquidfillCharts {
          position: relative;
        }
        > div {
          text-align: right;
        }
        > div:nth-child(1) {
          text-align: right;
          white-space: nowrap;
          > div:nth-child(2) {
            text-align: left;
            padding: 30px 0 0 165px;
            > p:nth-child(1) {
              color: rgba(0, 0, 0, 1);
              font-size: 18px;
              margin-bottom: 6px;
            }
            > p:nth-child(2) {
              color: rgba(0, 0, 0, 1);
              font-size: 16px;
              line-height: 40px;
              span {
                color: rgba(46, 140, 240, 1);
                font-size: 28px;
                font-weight: bold;
                margin: 0 7px 0 0;
              }
            }
          }
        }
        > div:nth-child(2) {
          color: rgba(119, 119, 119, 1);
          font-size: 16px;
          padding-top: 30px;
          > p {
            margin: 0;
            .num {
              color: #000;
              font-size: 18px;
            }
          }
          > p:nth-child(2) {
            margin-top: 15px;
          }
        }
      }
    }
    .statusList {
      display: flex;
      flex-wrap: wrap;
      padding: 0 50px 0 0px;
      > div {
        width: 33.333333%;
        display: flex;
        margin-top: 44px;
        flex-direction: row-reverse;
        > div:nth-child(2) {
          display: flex;
          img {
            margin: auto;
            width: 48px;
          }
        }
        > div:nth-child(1) {
          margin-left: 22px;
          p {
            margin: 0;
          }
          > p:nth-child(1) {
            margin-bottom: 3px;
            color: rgba(119, 119, 119, 1);
            font-size: 16px;
          }
          > p:nth-child(2) {
            span {
              color: rgba(0, 0, 0, 1);
              font-size: 20px;
            }
          }
        }
      }
    }
    .tabs {
      margin-top: 70px;
      background: #fff;
    }
  }
</style>
