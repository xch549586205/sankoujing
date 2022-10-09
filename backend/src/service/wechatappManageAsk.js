import { HTTP_METHOD } from 'configPath/index';
import { reqHandle } from 'commonPath/ajax';

export default {
  // 添加
  newApp: reqHandle('/wechatapp/new', {
    method: HTTP_METHOD.POST,
  }),
  modApp: reqHandle('/wechatapp/mod', {
    method: HTTP_METHOD.POST,
  }),
  delApp: reqHandle('/wechatapp/del', {
    method: HTTP_METHOD.POST,
  }),
  getApp: reqHandle('/wechatapp/list', {
    method: HTTP_METHOD.POST,
  }),
};
