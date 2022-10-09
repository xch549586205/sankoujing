/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-12 11:27:59
 * @LastEditTime: 2021-02-23 19:19:15
 * @LastEditors: Please set LastEditors
 */
/**
 *  @module app
 *  @requires vue
 *  @requires vuex-router-sync
 *  @requires store/index
 *  @requires router/index
 */
import 'stylesPath/css';
import 'babel-polyfill';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import { router, whiteList } from 'routerPath/index';
import I18n from 'vue-i18n';
import store from 'storePath/index';
import App from 'viewsPath/App.vue';
import 'commonPath/polyfill';
import { isHasPermission } from 'commonPath/utils';
import Message from 'ant-design-vue/lib/message';
import EN from './locale/en_US';
import libs from './libs';
import plugins from './plugins';
import taskEvent from 'commonPath/taskevent.js';
import moment from 'moment';
import ControlModal from 'viewsPath/components/ControlModal';

Message.config({
  duration: 5,
  maxCount: 5,
});

libs(Vue);
plugins(Vue);
Vue.use(I18n);
Vue.use(ControlModal);

Vue.prototype.taskEvent = taskEvent;

const i18n = new I18n({
  locale: EN.locale,
  messages: { [EN.locale]: EN },
});

/* 计算屏幕高度 */
window.addEventListener('resize', () => {
  store.commit('app/updateWindowSize', window);
});

// 标志首次进入界面
let initRoute;

/**
 *判断是否有路由权限
 *
 * @param {*} path 目标路由
 * @returns
 */
async function isPermissionValid(path) {
  // 角色权限
  const { urlSite } = store.state.app;
  if (!urlSite) {
    await Promise.all([store.dispatch('app/getRoleUrl'), store.dispatch('app/getUrlsite')]);
  }
  const userPermission = store.getters['app/userPermission'];
  // 角色权限控制
  if (!isHasPermission(userPermission, path)) {
    Message.error('请联系管理员添加权限！');
    return false;
  }
  return true;
}

/**
 *初始化可以进入的首个路由
 *
 * @param {*} next  路由跳转钩子
 * @returns
 */
// async function initPermissionRoute(next) {
//   const asyncRoutes = store.getters['app/addRouters'];
//   const { children } = asyncRoutes[0].children[0];
//   for (let i = 0; i < children.length; i += 1) {
//     const perssion = await isPermissionValid(children[i].path);
//     if (perssion) {
//       initRoute = children[i].path;
//       next(initRoute);
//       return;
//     }
//   }
// }

/**
 *动态加载路由
 *
 * @param {*} to 目标路由
 * @param {*} from 当前路由
 * @param {*} next 进入下个路由钩子
 */
// async function dynamicRoutes(to, from, next) {
//   const asyncRoutes = store.getters['app/addRouters'];
//   if (!asyncRoutes || asyncRoutes.length == 0) {

//   await store.dispatch('app/getInfoProject');
//   router.addRoutes(asyncRoutes);
//   const childrenRoutes = asyncRoutes[0].children[0];
//   const { redirect } = childrenRoutes;
//   // 界面刷新
//   if (!from.name) {
//     if (to.path === '/none') {
//       if (redirect === '/none') {
//         Message.error('请联系管理员添加模块！');
//       } else {
//         initPermissionRoute(next);
//       }
//     }
//   }
//   }
// }

// router.beforeEach((to, from, next) => {
//   const { projectInfo } = store.state.app;
//   const auth = JSON.parse(localStorage[`authB_${projectInfo.id}`] || '{}');
//   if (to.name !== 'login') {
//     if (!auth.token) {
//       next('/login');
//     }
//     // 项目模块显示
//     // const { isUpdate } = projectInfo;
//     // if (!isUpdate) {
//       // 动态加载路由
//       dynamicRoutes(to, from, next);
//     // }
//     console.log('from: ', from, 'to: ', to);
//     if (whiteList.includes(to.path)) {
//       next();
//     } else {
//       // 从登录进入,循环进入任意模块
//       // if (!initRoute) {
//       //   if (from.path === '/login' || from.path === '/home') {
//       //     initPermissionRoute(next);
//       //   }
//       // }
//       initRoute = '';
//       // 权限判断
//       isPermissionValid(to.path).then(result => {
//         const perssion = result;
//         if (perssion) {
//           if (!isUpdate) {
//             next(to.path);
//           } else {
//             // 防止进入死循环
//             next();
//           }
//         } else {
//           next(false);
//         }
//       }).catch(error => {
//         next(false)
//       });
//     }
//   } else {
//     next();
//   }
// });

router.beforeEach(async (to, from, next) => {
  const { projectInfo } = store.state.app;
  const auth = JSON.parse(localStorage[`authB_${projectInfo.id}`] || '{}');
  const userInfo = JSON.parse(localStorage[`userInfoB_${projectInfo.id}`] || '{}');
  const userPermission = store.getters['app/userPermission'];
  const routes = store.getters.routes;
  // console.log(store.getters['app/userPermission']);
  if (to.name !== 'login') {
    if (!auth.token) {
      return next('/login');
    }
    if (userInfo && userInfo.roleid) {
      console.log('routes pre', routes);
      if (!routes || routes.length == 0) {
        try {
          await store.dispatch('app/getInfoProject');

          // 检查项目是不是在有效期内
          if (!checkValidityTime()) {
            console.error('route not valid');
            return next('/login');
          }

          const { roleid, pid } = userInfo;
          await store.dispatch('app/getRoleUrl', { rid: roleid, pid });
          await store.dispatch('app/getUrlsite', { pid });
          let routes = await store.dispatch('app/updateRoutes');
          const urlroutes = store.getters.routes;
          if (!urlroutes || urlroutes.length == 0) {
            Message.error('没有权限');
            return;
          }
          if (routes[0].children.length == 0) {
            next('/login');
            return;
          }
          router.addRoutes(routes);
        } catch (error) {
          console.error(error);
          next(`/login?redirect=${to.path}`);
          return;
        }
        const redirect = decodeURIComponent(from.query.redirect || to.path);
        if (to.path === redirect) {
          // set the replace: true so the navigation will not leave a history record
          next({ ...to, replace: true });
        } else {
          // 跳转到目的路由
          next({ path: redirect });
        }
        // taskEvent.open()
        return;
      }

      // if (!isHasPermission(userPermission, to.path)) {
      //   Message.error('请联系管理员添加权限！');
      //   return next(false);
      // }
    } else {
      next(`/login`);
    }
  }
  next();
  return true;
});

function checkValidityTime() {
  const project = store.state.app.projectInfo;
  console.log('projectInfo', project);
  if (project.ispermanent == 1) {
    return true;
  }
  if (project.starttime) {
    const newTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const prePass = moment(project.starttime, 'YYYY-MM-DD HH:mm:ss').isBefore(newTime);
    const sufPass = moment(project.endtime, 'YYYY-MM-DD HH:mm:ss').isAfter(newTime);

    console.log('prePass', prePass);
    console.log('sufPass', sufPass);

    if (!prePass || !sufPass) {
      Message.error('项目未在使用有效期范围内！请联系管理员');
      return false;
    }
    return true;
  }
}

// 使用vuex管理 router状态
// 会在store上注册 `store.state.route`
sync(store, router);

new Vue({
  i18n,
  store,
  router,
  ...App,
}).$mount('#app');
