import { HTTP_METHOD } from 'configPath/index';
import { reqHandle } from 'commonPath/ajax';

export default {
  // 添加
  addPlatform: reqHandle('/platform/add', {
    method: HTTP_METHOD.POST,
  }),
  // 删除
  delPlatform: reqHandle('/platform/del', {
    method: HTTP_METHOD.POST,
  }),
  // 修改
  modPlatform: reqHandle('/platform/mod', {
    method: HTTP_METHOD.POST,
  }),
  // 查询
  getPlatform: reqHandle('/platform/get', {
    method: HTTP_METHOD.POST,
  }),
};
