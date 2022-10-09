/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-06-22 11:51:44
 * @LastEditors: your name
 */
import { HTTP_METHOD } from 'configPath/index';
import { reqHandle } from 'commonPath/ajax';

export default {
  /* 站点 */
  // 查询站点
  getExchanger: reqHandle('/exchanger/get', {
    method: HTTP_METHOD.POST,
  }),
  queryExchanger: reqHandle('/exchanger/query', {
    method: HTTP_METHOD.POST,
  }),

  newExchanger: reqHandle('/exchanger/new', {
    method: HTTP_METHOD.POST,
  }),

  modExchanger: reqHandle('/exchanger/mod', {
    method: HTTP_METHOD.POST,
  }),

  delExchanger: reqHandle('/exchanger/del', {
    method: HTTP_METHOD.POST,
  }),
  getExchangerCell: reqHandle('/exchanger/cell/get', {
    method: HTTP_METHOD.POST,
  }),
  bindGoods: reqHandle('/exchanger/cell/bind', {
    method: HTTP_METHOD.POST,
  }),

  unbindGoods: reqHandle('/exchanger/cell/unbind', {
    method: HTTP_METHOD.POST,
  }),

  putOnSale: reqHandle('/exchanger/put', {
    method: HTTP_METHOD.POST,
  }),
  pay: reqHandle('/exchanger/pay', {
    method: HTTP_METHOD.POST,
  }),

  deviceList: reqHandle('/exchanger/device/list', {
    method: HTTP_METHOD.POST,
  }),

  bindDevice: reqHandle('/exchanger/device/bind', {
    method: HTTP_METHOD.POST,
  }),

  unbindDevice: reqHandle('/exchanger/device/unbind', {
    method: HTTP_METHOD.POST,
  }),

  modDevice: reqHandle('/exchanger/device/mod', {
    method: HTTP_METHOD.POST,
  }),
}