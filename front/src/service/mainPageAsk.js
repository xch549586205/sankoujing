/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:44
 * @LastEditTime: 2019-09-29 16:27:57
 * @LastEditors: Please set LastEditors
 */
import { HTTP_METHOD } from 'configPath/index';
import { reqHandle } from 'commonPath/ajax';

export default {
  //历史数据
  getDevtasklog: reqHandle('/openproxy/getdevtasklog', {
    method: HTTP_METHOD.POST,
  }),
  //实时数据
  getReportLog: reqHandle('/openproxy/getreportlog', {
    method: HTTP_METHOD.POST,
  }),
};
