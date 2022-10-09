/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-08-26 15:13:34
 * @LastEditors: Please set LastEditors
 */
import { HTTP_METHOD } from 'configPath/index';
import { reqHandle } from 'commonPath/ajax';

export default {
  // 获得产品属性
  getInfo: reqHandle('/project/getinfo', {
    method: HTTP_METHOD.POST,
  }),
};
