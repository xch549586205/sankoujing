/*
 * @Author: your name
 * @Date: 2020-11-30 12:24:51
 * @LastEditTime: 2021-01-29 16:00:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backend\src\config\index.js
 */
/**
 * @namespace
 * @readonly
 * @prop {String} GET - GET
 * @prop {String} POST - POST
 * @prop {String} JSONP - JSONP
 */
export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  JSONP: 'JSONP',
};

/**
 * 默认请求方法
 * @const
 * @type {String}
 * @default
 */
export const DEFAULT_REQ_METHOD = HTTP_METHOD.GET;
/**
 * 请求url默认前缀
 * @const
 * @type {String}
 * @default
 */
export const BASE_URL = 'http://10.10.30.60:8283/'; // 服务器ip
export const URL_DEFAULT_PREFIXER = '/v1'; // 默认请求前缀，发布时，前后端为不同服务器使用 http://10.10.30.70:8282

/**
 * 请求默认超时时间
 * @const
 * @type {Number}
 * @default
 */
export const REQ_TIME_OUT = 50000; // 5000

export const DEFAULT_ERR_MSG = '系统出了点小问题，请稍后重试!';

/**
 * 是否序列化post,put,patch时的数据
 * 此参数在使用axios时会确定Content-Type的值
 * ture: application/x-www-form-urlencoded, false:application/json;charset=utf-8
 */
export const IS_SERIALIZER_PARAMS = false;
