/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-29 14:07:01
 * @LastEditTime: 2019-08-16 15:37:29
 * @LastEditors: Please set LastEditors
 */
const path = require('path');

const extraPath = ''; // ./ |
const publicPath = '.';
const distRoot = path.resolve(__dirname, '../dist');
module.exports = {
  build: {
    env: 'production',
    distRoot,
    buildRoot: path.resolve(distRoot, extraPath),
    extraPath,
    browserslist: ['>= 5%', 'last 2 versions', 'ie >=9'],
    vueModule: 'vue/dist/vue.esm.js',
    publicPath: !publicPath && !extraPath ? '' : `${publicPath}${extraPath ? '/' : ''}${extraPath}`,
  },
  dev: {
    env: 'development',
  },
};
