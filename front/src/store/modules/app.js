/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-10-15 17:04:45
 * @LastEditors: Please set LastEditors
 */
import service from 'servicePath/index';
import global from 'commonPath/global';
// import { router, asyncRoutes } from 'routerPath/index';
import { dynamicRoutes, constantRoutes, rootRoute } from '@/router';

const { appAsk, userManageAsk } = service;
const app = {
  namespaced: true,
  state: {
    window: {
      height: window.innerHeight,
      width: window.innerWidth,
    },
    projectInfo: {
      ...PROJECT,
    },
    userInfo: {},
    online: [
      {
        text: '全部状态',
        value: '-1',
        icon: '',
      },
      {
        text: '在线状态',
        value: '1',
        icon: '',
      },
      {
        text: '离线状态',
        value: '0',
        icon: '',
      },
    ],
    running: [
      {
        text: '全部状态',
        value: '-1',
        icon: '',
      },
      {
        text: '使用',
        value: '1',
        icon: '',
      },
      {
        text: '空闲',
        value: '0',
        icon: '',
      },
    ],
    roleUrl: [],
    urlSite: [],
    routes: []
  },

  mutations: {
    updateWindowSize(state, window) {
      state.window.height = window.innerHeight;
      state.window.width = window.innerWidth;
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
    // 更新用户权限
    updateRoleUrl(state, payload) {
      state.roleUrl = payload;
    },
    // 更新权限列表
    updateUrlSite(state, payload) {
      state.urlSite = payload;
    },
    // 更新项目信息
    updateProject(state, payload) {
      state.projectInfo = Object.assign({}, state.projectInfo, payload);
     },
    setRoutes: (state, routes) => {
      state.routes = routes;
    },
  },

  getters: {
    userPermission: state => {
      const { roleUrl, urlSite = [] } = state;
      let userPermission = [];
      // console.log(JSON.stringify(roleUrl));
      // console.log(JSON.stringify(urlSite));
      roleUrl.forEach(v => {
        const index = urlSite.findIndex(item => v.urlid === item.id);
        if (index > -1) {
          userPermission.push(urlSite[index].urlpath);
        }
      });
      userPermission = userPermission.length === 0 ? ['*'] : userPermission;
      return userPermission;
    },
    // 异步添加的路由
    // addRouters: state => {
    //   const { modules = [] } = state.projectInfo;
    //   const { children } = asyncRoutes[0].children[0];
    //   const newRouter = [];
    //   if (modules) {
    //     modules.forEach(v => {
    //       const pos = children.findIndex(item => v.urlpath === item.path);
    //       if (pos > -1) {
    //         children[pos].name = v.urlname;
    //         newRouter.push(children[pos]);
    //       }
    //     });
    //   }
    //   asyncRoutes[0].children[0] = {
    //     ...asyncRoutes[0].children[0],
    //     redirect: modules[0] && modules[0].urlpath || '/none',
    //     children: newRouter
    //   };

    //   return asyncRoutes;
    // }
  },

  actions: {
    async setUserInfo({ commit }, params) {
      const { errcode } = await appAsk.loginAccount(params);
      if (errcode === 200) {
        commit('setUserInfo', params);
      }
    },
    // 获取角色URL
    async getRoleUrl({ state, commit }, payload) {
      const { id, modules } = state.projectInfo;
      const userInfo = JSON.parse(localStorage[`userInfoB_${id}`] || '{}');
      const { roleid, pid } = userInfo;
      const params = {
        rid: roleid,
        pid,
      };
      const { errcode, data = [] } = await userManageAsk.getRU(params);
      if (errcode === 200) {
        
        const { alist = [] } = data;
        const blist = alist.filter(item => modules.findIndex(val => val.urlid === item.urlid) > -1)
        commit('updateRoleUrl', blist);
      }
    },
    // 获取权限列表
    async getUrlsite({ state, commit }, payload) {
      const { id } = state.projectInfo;
      const userInfo = JSON.parse(localStorage[`userInfoB_${id}`] || '{}');
      const { pid } = userInfo;
      const params = {
        pid,
        offset: 1,
        status: 2,
        limit: global.MAX_LEN,
      };
       const { errcode, data = [] } = await appAsk.getUrlsite(params);

      if (errcode === 200) {
        const { alist = [] } = data;
        commit('updateUrlSite', alist);
      }
    },
    // 获得项目详情
    async getInfoProject({ state, commit }, payload) {
      const params = {
        id: parseInt(state.projectInfo.id),
      };
      const { errcode, data = {} } = await appAsk.getInfoProject(params);
      if (errcode === 200) {
        const { project = {}, modules = [] } = data;
        commit('updateProject', { ...project, modules, isUpdate: true });
      }
    },
    async updateRoutes({ commit, rootState }) {
      const { userInfo, roleUrl, urlSite } = rootState.app;
      // const { roleid, pid } = userInfo;
      // const rures = await userManageAsk.getRU({ rid: roleid, pid });
      // if (rures.errcode !== 200) {
      //   return;
      // }
      // const urlsiteres = await appAsk.getUrlsite({ pid });
      // if (urlsiteres.errcode !== 200) {
      //   return;
      // }
      // let roleUrl = rures.alist || [];
      // let urlSite = urlsiteres.alist || [];

      const routelist = [];
      // constantRoutes.forEach(item => {
      //   routelist.push(item);
      // });

      let userPermission = [];
      console.log("roleurl", JSON.stringify(roleUrl));
      console.log("urlsite", JSON.stringify(urlSite));
      // console.log(roleUrl, urlSite)
      let all = false;
      roleUrl.forEach(v => {
        const index = urlSite.findIndex(item => v.urlid === item.id);
        if (index > -1) {
          userPermission.push(urlSite[index].urlpath);
          if (urlSite[index].urlpath == '*') {
            all = true;
          }
        }
      });
      console.log("routelist", dynamicRoutes, userPermission);

      if (all) {
        routelist.push(...dynamicRoutes);
      } else {
        dynamicRoutes.forEach(item => {

          userPermission.forEach(url => {
            if (item.path === url) {
              routelist.push(item);
            }
          });
        });
      }

      console.log("routelist", routelist);
      commit('setRoutes', routelist);
      rootRoute.children.push(...routelist);
      return [rootRoute];
    },
  },
};

export default app;
