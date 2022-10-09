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
  ticketList: reqHandle('/ticket/list', {
    method: HTTP_METHOD.POST,
  }),

  newTicket: reqHandle('/ticket/new', {
    method: HTTP_METHOD.POST,
  }),

  modTicket: reqHandle('/ticket/mod', {
    method: HTTP_METHOD.POST,
  }),

  delTicket: reqHandle('/ticket/del', {
    method: HTTP_METHOD.POST,
  }),

  ticketItemList: reqHandle('/ticket/item/list', {
    method: HTTP_METHOD.POST,
  }),

  newTicketItem: reqHandle('/ticket/item/new', {
    method: HTTP_METHOD.POST,
  }),

  modTicketItem: reqHandle('/ticket/item/mod', {
    method: HTTP_METHOD.POST,
  }),

  delTicketItem: reqHandle('/ticket/item/del', {
    method: HTTP_METHOD.POST,
  }),
}