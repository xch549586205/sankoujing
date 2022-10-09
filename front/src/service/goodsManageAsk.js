/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2021-08-04 11:13:39
 * @LastEditors: Please set LastEditors
 */
import { HTTP_METHOD } from 'configPath/index';
import { reqHandle } from 'commonPath/ajax';

export default {
  /* 站点 */
  // 查询站点
  goodsList: reqHandle('http://10.10.30.70:8000/goods/list', {
    method: HTTP_METHOD.POST,
  }),

  newGoods: reqHandle('/goods/new', {
    method: HTTP_METHOD.POST,
  }),

  modGoods: reqHandle('/goods/mod', {
    method: HTTP_METHOD.POST,
  }),

  delGoods: reqHandle('/goods/del', {
    method: HTTP_METHOD.POST,
  }),

  deviceList: reqHandle('/goods/device/list', {
    method: HTTP_METHOD.POST,
  }),

  bindDevice: reqHandle('/goods/device/bind', {
    method: HTTP_METHOD.POST,
  }),

  unbindDevice: reqHandle('/goods/device/unbind', {
    method: HTTP_METHOD.POST,
  }),

  modDevice: reqHandle('/goods/device/mod', {
    method: HTTP_METHOD.POST,
  }),
}