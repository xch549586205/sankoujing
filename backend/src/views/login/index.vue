<template>
  <div>
    <div class="title">
      <div class="title_icon">
        AIOT物联网平台
      </div>
      <div class="title_func">
        <div class="title_func_register">立即注册</div>
      </div>
    </div>

    <div class="content">
      <div class="content_top">
        <div class="content_top_img">
          <div class="content_top_loginview">
            <div class="loginview_title">登录</div>
            <div class="loginview_changetype"
                 @click="changeLoginType">

              <div class="loginview_changetype_pass"
                   v-if="userNameAndPass">
                <a>使用账号登录</a>
              </div>
              <img v-else
                   src="https://res.wx.qq.com/mpres/zh_CN/htmledition/pages/login/loginpage/images/qr4b3e56.svg"
                   alt="">
            </div>
            <!-- 登录窗口内容（账号密码登录） -->
            <div v-if="userNameAndPass"
                 class="loginview_input">

              <a-input type="text"
                       v-model="userName"
                       placeholder="邮箱/手机号"
                       @change="handleUserChange" />
              <a-input type="password"
                       v-model="password"
                       placeholder="密码"
                       @change="handlePassChange" />
              <div class="loginview_remember">
                <a-checkbox :checked="isRemember"
                            @change="handleChangeRemember">
                  记住密码
                </a-checkbox>
                <a href="">找回账号或密码</a>
              </div>
              <a-button :loading="loging"
                        class="loginview_loginbutton"
                        @click="login">登录</a-button>
            </div>
            <!-- 登录窗口内容（扫描二维码） -->
            <div v-else
                 class="loginview_qr">
              <!-- <vue-qr :text="downloadData.url"
                      :margin="0"
                      colorDark="#000"
                      colorLight="#fff"
                      :size="112"></vue-qr>
              <div class="loginview_qr_text">微信扫一扫登录</div> -->
              <!-- <wxlogin appid="wxa4e3127767adcc78"
                       scope="scope"
                       :redirect_uri="encodeURIComponent('http://osimdev.ibroadlink.com/mp')"></wxlogin>
              </wxlogin> -->
              <div>{{url}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import service from 'servicePath/index';
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
  const { appAsk } = service;
  export default {
    name: 'Login',
    components: {},
    props: {},
    data() {
      return {
        loging: false,
        userName: '',
        password: '',
        userNameAndPass: true,
        isRemember: false,
        downloadData: {
          url: '扫码访问的链接地址',
          icon: '随便一张图片的地址也行',
        },
        url: encodeURIComponent('https://osimdev.ibroadlink.com/mp'),
      };
    },
    computed: {
      ...mapState('app', ['userInfo']),
    },
    watch: {},
    created() {},
    mounted() {},
    methods: {
      ...mapMutations('app', ['setUserInfo']),
      // 清除错误提示
      handleUserChange(e) {
        console.log('handleUserChange', this.userName);
      },
      handlePassChange() {
        console.log('handlePassChange', this.password);
      },
      // 登录
      login() {
        const accountname = this.userName;
        const password = this.password;
        const params = {
          accountname,
          password,
          pid: this.GLOBAL.PID,
        };
        this.loging = true;
        appAsk
          .loginAccount(params)
          .then((result) => {
            const { errcode, data } = result;
            if (errcode === 200) {
              const { accountinfo, uid, token } = data;
              // 同步用户登录信息
              const auth = {
                token,
                expired: new Date(),
              };
              localStorage.setItem('auth', JSON.stringify(auth));
              localStorage.setItem('userInfo', JSON.stringify(accountinfo));
              this.setUserInfo(accountinfo);
              setTimeout(() => {
                this.loging = false;
                this.$router.push({ path: '/home' });
              }, 500);
            }
          })
          .catch((e) => {
            const { errcode } = e;
            if (errcode === 403) {
              this.isError = true;
            }
            this.loging = false;

            console.error(e);
          });
      },
      changeLoginType() {
        this.userNameAndPass = !this.userNameAndPass;
      },
      handleChangeRemember() {
        this.isRemember = !this.isRemember;
      },
    },
  };
</script>

<style lang="less" scoped>
  .title {
    width: 100%;
    height: 80px;
    background: white;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .title_icon {
    font-size: 40px;
  }
  .title_func_register {
  }
  .content {
    width: 100%;
    height: 100%;
  }
  .content_top {
    height: 340px;
  }
  .content_top_img {
    height: 100%;
    width: 100%;
    background-image: url(https://res.wx.qq.com/mpres/zh_CN/htmledition/pages/login/loginpage/images/bg_banner49d02a.png);
    background-position: 50% 0;
    position: relative;
  }
  .content_top_loginview {
    width: 380px;
    height: 270px;
    background: white;
    position: absolute;
    right: 20%;
    top: 30px;
  }
  .loginview_title {
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 16px;
  }
  .loginview_changetype {
    position: absolute;
    right: 0px;
    top: 0px;
  }
  .loginview_changetype_pass {
    margin: 20px 30px 0 0;
  }
  .loginview_input {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 20px;
  }

  .loginview_input input {
    border: 1px solid rgba(0, 0, 0, 0.2);
    width: 340px;
    height: 47px;
    padding-left: 10px;
  }
  .loginview_input input:nth-child(1) {
    border-bottom: none;
  }
  .loginview_remember {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .loginview_loginbutton {
    height: 36px;
    width: 122px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #08c261;
    color: white;
    border-radius: 3px;
    margin-top: 15px;
  }
  .loginview_qr {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    top: 70px;
  }
  .loginview_qr_text {
    margin-top: 20px;
  }
</style>
