/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:43
 * @LastEditTime: 2019-06-22 11:51:43
 * @LastEditors: your name
 */
import {
  HTTP_METHOD,
  DEFAULT_REQ_METHOD,
  URL_DEFAULT_PREFIXER,
  IS_SERIALIZER_PARAMS,
  REQ_TIME_OUT,
} from 'configPath/index';
import sha1 from 'sha1';
import moment from 'moment';
import { paramsSerializer, isPlainObject } from 'commonPath/utils';
import axiosInstance from './axios';
import jsonp from './jsonp';
import { ajaxFulFilledHandle, ajaxRejectedHandle } from './ajaxErrorHandle';

function reqJSONP(url = '', params = {}, opts = {}) {
  return jsonp(url, params, opts).then(
    ({ data, options }) => ajaxFulFilledHandle(data, { type: 'jsonp', options }),
    ajaxRejectedHandle
  );
}

let payload;

// 设置请求token
function setAxiosCfg() {
  const auth = JSON.parse(localStorage.getItem(`authB_${PROJECT.id}`) || '{}');
  const { token, expired } = auth;
  const client = 'web';
  const timestamp = `${moment().unix()}`;
  let sign = `${client}${timestamp}${token}`;
  sign = payload === '{}' ? sign : `${sign}${payload}`;
  const signSha1 = sha1(sign.replace(/\s/g, ''));
  return {
    paramsSerializer,
    timeout: REQ_TIME_OUT,
    headers: {
      interfaceVersion: '1',
      client,
      timestamp,
      sign: signSha1,
      token,
    },
    validateStatus: (status) => true,
  };
}

export function getAxiosInstance() {
  return axiosInstance(setAxiosCfg());
}

export const AJAX = {
  get(url = '', params = {}, opts = {}) {
    return getAxiosInstance().get(url, {
      params,
      ...opts,
    });
  },
  post(url = '', params = {}, opts = {}) {
    return getAxiosInstance().post(url, params, {
      ...opts,
    });
  },
  jsonp(url, params, opts) {
    return reqJSONP(url, params, opts);
  },
};

const defaultPrefixer = URL_DEFAULT_PREFIXER;

/**
 * @param {String} path
 * @param {Object} opts
 * @prop {GET|POST} method - 请求类型
 * @prop {String} prefixer - url前缀
 * @prop {Boolean} isSerializerParams - 是否序列化提交数据
 */
export function reqHandle(
  path = '',
  {
    method = DEFAULT_REQ_METHOD,
    prefixer = defaultPrefixer,
    isSerializerParams = IS_SERIALIZER_PARAMS,
    ...props
  } = {
    method: DEFAULT_REQ_METHOD,
    prefixer: defaultPrefixer,
    isSerializerParams: IS_SERIALIZER_PARAMS,
  }
) {
  const reqPath = path.indexOf('/') === 0 ? path.slice(1) : path;
  const reqUrl = /http(s)?:\/\//.test(reqPath) ? reqPath : `${prefixer}/${reqPath}`;

  return (params) => {
    let reqParams = params;
    if (
      isSerializerParams &&
      method.toUpperCase() === HTTP_METHOD.POST &&
      (isPlainObject(reqParams) || Array.isArray(reqParams))
    ) {
      reqParams = paramsSerializer(reqParams);
    }
    payload = JSON.stringify(reqParams);
    console.log(JSON.stringify(reqParams));
    return AJAX[method.toLowerCase()](reqUrl, reqParams, {
      ...props,
    });
  };
}
