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
  wechatuserList: reqHandle('/wechatuser/list', {
    method: HTTP_METHOD.POST,
  }),

  newWechatUser: reqHandle('/wechatuser/new', {
    method: HTTP_METHOD.POST,
  }),

  changeRoletype: reqHandle('/wechatuser/roletype/mod', {
    method: HTTP_METHOD.POST,
  }),

  delWechatUser: reqHandle('/wechatuser/del', {
    method: HTTP_METHOD.POST,
  }),

 
}