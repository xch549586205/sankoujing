<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 11:51:43
 * @LastEditTime: 2019-10-09 11:43:59
 * @LastEditors: Please set LastEditors
 -->
前台：https://www.xiaopiu.com/web/byId?type=project&id=6136ceeb0ebd5041566f092c
后台：https://www.xiaopiu.com/web/byId?type=project&id=614014071cad555178dcb16e

## 行业服务业务平台

## 安装依赖

npm install

## 运行系统

npm run start

## 编译代码

npm run build

## server 配置

配置文件：w-build/webpack.server.config

请求配置：context：路径前缀 | target：服务器地址

## 发布配置

真实服务器地址：src/config/index | URL_DEFAULT_PREFIXER

发布路径：w-config/index | publicPath

## 服务器 API

文件路径：src/service/appAsk

## 路由配置

文件路径: src/router/app

## 备注

用户登录前，需要先在后台管理系统配置项目模块，并添加用户权限；
