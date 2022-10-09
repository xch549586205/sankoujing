import { HTTP_METHOD } from 'configPath/index';
import { reqHandle } from 'commonPath/ajax';

export default {
  // 添加
  addProject: reqHandle('/project/add', {
    method: HTTP_METHOD.POST,
  }),
  // 删除
  delProject: reqHandle('/project/del', {
    method: HTTP_METHOD.POST,
  }),
  // 修改
  modProject: reqHandle('/project/mod', {
    method: HTTP_METHOD.POST,
  }),
  // 查询项目详情
  getInfoProject: reqHandle('/project/getinfo', {
    method: HTTP_METHOD.POST,
  }),
  // 查询
  getProject: reqHandle('/project/get', {
    method: HTTP_METHOD.POST,
  }),

  // 查询绑定的平台信息
  getProjectPlatform: reqHandle('/project/getplatform', {
    method: HTTP_METHOD.POST,
  }),

  // 添加绑定的平台信息
  addProjectPlatform: reqHandle('/project/addplatform', {
    method: HTTP_METHOD.POST,
  }),

  // 修改绑定的平台信息
  modProjectPlatform: reqHandle('/project/modplatform', {
    method: HTTP_METHOD.POST,
  }),

  // 删除绑定的平台信息
  delProjectPlatform: reqHandle('/project/delplatform', {
    method: HTTP_METHOD.POST,
  }),

  // 保存apk地址
  setapk: reqHandle('/project/setapk', {
    method: HTTP_METHOD.POST,
  }),

  // 保存apk地址
  getProgress: reqHandle('/project/progress', {
    method: HTTP_METHOD.POST,
  }),
};
