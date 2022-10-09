<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-02-20 14:13:05
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="topbar">
    <div class="header-brand">
      <img :src="projectInfo.logourl || logo" alt="" />
    </div>
    <div class="header-title ml20">
      {{ projectInfo.projectname }}
    </div>
    <div class="header-operate">
      <template>
        <a-dropdown class="topbar-dropdown">
          <span>
            <a-icon type="message" />
            <span>消息</span>
          </span>
          <template v-slot:overlay>
            <a-menu class="ant-pro-drop-down menu">
              <template v-if="messages && messages.length > 0">
                <a-menu-item
                  v-for="(message, index) in messages"
                  :value="message"
                  :key="index + 'messages'"
                  @click="readMessage(index)"
                >
                  <span style="padding-right: 30px">{{ message.name }}</span>
                </a-menu-item>

                <!-- </a-menu-item>
         <a-menu-item @click="showlog">
            <span style="padding-right:30px;">调试</span> -->
              </template>
              <template v-else>
                <a-menu-item>
                  <span style="padding-right: 30px">暂无新消息</span>
                </a-menu-item>
              </template>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
      <span class="mr10" />
      <template>
        <a-dropdown class="topbar-dropdown">
          <span class="ant-dropdown-link" href="#">
            <span class="iconfont icontouxiang"></span>
            {{ userInfo.displayname }}
            <!-- <a-icon type="down" /> -->
          </span>
          <a-menu slot="overlay">
            <a-menu-item @click="nextRoute('accountSet')">
              <span style="padding-right: 30px">账号设置 </span>
            </a-menu-item>
            <a-menu-item @click="qrCode">
              <span style="padding-right: 30px">显示登陆二维码 </span>
            </a-menu-item>
            <a-menu-item @click="nextRoute('projectSet')">
              <span style="padding-right: 30px">设置 </span>
            </a-menu-item>
            <a-menu-item @click="exit">
              <span style="padding-right: 30px">退出</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </div>
    <a-modal v-model="loginQrView" :width="300" title="登录二维码">
      <template slot="footer">
        <div></div>
      </template>
      <div class="qrmodal_view">
        <canvas id="canvas"></canvas>
      </div>
      <div class="qrmodal_view">扫码登录（有效期5分钟）</div>
    </a-modal>
  </div>
</template>

<script>
import QRCode from 'qrcode';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import service from 'servicePath/index';
import logo from 'stylesPath/images/logo.png';

const { deviceManageAsk, userManageAsk } = service;
const { appAsk } = service;

export default {
  name: 'Main',
  components: {},
  data() {
    return {
      messageList: [],
      logo,
      loginQrView: false,
      config: {
        value: 'https://www.baidu.com', //显示的值、跳转的地址
        BYTE_POS: 'green',
      },
    };
  },
  computed: {
    ...mapState('app', ['userInfo', 'projectInfo']),
    ...mapState('messageManage', ['messages']),

    ...mapGetters('messageManage', ['getMessges']),
  },
  created() {
    this.setUserInfo(JSON.parse(localStorage[`userInfoB_${this.projectInfo.id}`]));
  },
  mounted() {
    // this.qrCode();
  },
  methods: {
    /* 账号设置 */
    ...mapMutations('app', ['setUserInfo']),
    nextRoute(to) {
      const { name } = this.$route;
      const filters = ['accountSet', 'projectSet']; // 如果当前界面为账号设置或系统设置则使用replace
      const operate = filters.includes(name) ? 'replace' : 'push';
      this.$router[operate]({ path: `/${to}` });
    },
    /* 退出 */
    exit() {
      const { id } = this.projectInfo;
      const userInfo = JSON.parse(localStorage[`userInfoB_${id}`]);
      const params = {
        ...userInfo,
      };
      appAsk
        .logoutAccount(params)
        .then(
          (result) => {
            const { errcode, data } = result;
            if (errcode === 200) {
              this.taskEvent.close();
              localStorage.removeItem(`authB_${id}`);
              localStorage.removeItem(`userInfoB_${id}`);
              this.$router.push({ path: '/login' });
            }
          },
          () => {}
        )
        .catch((e) => {
          console.error(e);
        });
    },

    qrCode() {
      this.loginQrView = true;
      const { id } = this.projectInfo;

      var authInfo = JSON.parse(localStorage[`userInfoB_${id}`]);
      console.log('userInfo', authInfo, authInfo.token);

      userManageAsk.getLoginQr({ accountname: authInfo.accountname }).then((resp) => {
        console.log('resp', resp);
        if (resp.errcode == 200) {
          const code = resp.data.Code;
          QRCode.toCanvas(document.getElementById('canvas'), code, function (error) {
            if (error) {
              console.error(error);
            }
            console.log('success!');
          });
        }
      });
    },
    handleCancel() {
      this.loginQrView = false;
    },
    readMessage(index) {
      let data = this.messages[index];
      console.log('readMessage', data);
      if (data && data.type === 'service') {
        if (data.content) {
          let sdata = JSON.parse(data.content);
          if (sdata.effects) {
            sdata.effects.forEach((device) => {
              if (device.actions) {
                device.actions.forEach((action) => {
                  if (action.attrmethod === 'video') {
                    deviceManageAsk.getDevice({ id: device.deviceid }).then((devresp) => {
                      const { errcode, data = {} } = devresp;
                      const { deviceInfos = [] } = data;
                      if (!deviceInfos || deviceInfos.length == 0) {
                        return;
                      }
                      const dev = deviceInfos[0];
                      deviceManageAsk
                        .getProduct({ id: dev.productid })
                        .then((result) => {
                          const { errcode, data = {} } = result;
                          if (errcode === 200) {
                            const { productsinfo = [] } = data;
                            if (productsinfo && productsinfo[0] && productsinfo[0].h5url) {
                              let h5url = productsinfo[0].h5url + '?data=' + dev.privatedata;

                              this.$control.show({ h5url });
                              return;
                            }
                          }
                        })
                        .catch((e) => {
                          console.error(e);
                        });
                    });
                  }
                });
              }
            });
          }
        }
      } else {
        if (data.link == '普通定时' || data.link == '自定义定时') {
          this.$router.push({ name: 'timingTask' });
        } else if (data.link == '联动') {
          this.$router.push({ name: 'linkageTask' });
        } else if (data.link == '场景') {
          this.$router.push({ name: 'sceneTask' });
        }
      }

      this.$store.dispatch('messageManage/removeMessage', index);
    },
    showlog(e) {
      console.log(this.messages);
    },
  },
};
</script>

<style lang="less" scoped>
.qrmodal_view {
  display: flex;
  justify-content: center;
  align-items: center;
}
.topbar {
  height: 60px;
  padding-right: 24px;
  line-height: 60px;
  display: flex;
  .header-brand {
    height: 120px;
    width: 200px;
    background: #002140;
    text-align: center;
    display: flex !important;
    img {
      height: 55px;
      width: 60px;
      margin: auto;
      object-fit: cover;
    }
  }
  .header-brand,
  .header-title,
  .header-operate {
    display: inline-block;
  }
  .header-title {
    font-size: @bl-font-size-lg;
    font-weight: @bl-font-weight-base;
  }
  .header-operate {
    position: absolute;
    right: 24px;
    font-size: 16px;
  }
}
</style>
