const path = require('path');
const {
  readFileSync
} = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const rimraf = require('rimraf');
const glob = require('glob');

const conf = require('../w-config');

const {
  NODE_ENV
} = process.env;
const CURRENT_ENV = {
  isProd: NODE_ENV === conf.build.env,
  isDev: NODE_ENV !== conf.build.env
};

exports.getEnv = function getEnv() {
  return CURRENT_ENV;
};

exports.postcssCfg = {
  config: {
    ctx: {
      autoprefixer: conf.build.browserslist
    }
  }
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    minimize: CURRENT_ENV.isProd
  }
};
const postcssLoader = {
  loader: 'postcss',
  options: exports.postcssCfg
};

exports.resolve = function resolve(...paths) {
  return path.resolve(...paths);
};
/**
 * 生成 css loaders
 * @param {Object} options
 * @prop {boolean} use - 加载器列表
 * @prop {boolean} isVueLoader - 是否使用vue-style-loader
 * @prop {boolean} isExtract - 是否提取 css
 * @return {Array}
 */
function generateCSSLoaders(options) {
  const opts = options || {};
  const use = opts.use || [];
  const isVueLoader = typeof opts.isVueLoader === 'undefined' ? true : opts.isVueLoader;
  const isExtract = opts.isExtract || false;
  const loaders = [cssLoader];

  let styleLoader = 'style-loader';
  if (isVueLoader) {
    styleLoader = 'vue-style-loader';
  }

  if (use.length > 0) {
    // cssLoader 会有前置加载器
    loaders[0].options.importLoaders = use.length;
    use.forEach(v => loaders.push({
      loader: `${v.loader}-loader`,
      options: Object.assign({}, v.options || {})
    }));
  }

  if (isExtract) {
    return ExtractTextPlugin.extract({
      fallback: styleLoader,
      use: loaders
    });
  }
  loaders.unshift(styleLoader);
  return loaders;
}

exports.vueCSSLoaders = function vueCSSLoaders(isExtract) {
  return {
    css: generateCSSLoaders({
      use: [postcssLoader],
      isExtract
    }),
    scss: generateCSSLoaders({
      use: [postcssLoader, {
        loader: 'sass'
      }],
      isExtract
    }),
  };
};

exports.scssLoader = function scssLoader(isExtract) {
  return generateCSSLoaders({
    use: [postcssLoader, {
      loader: 'sass'
    }],
    isVueLoader: false,
    isExtract
  });
};

exports.lessLoader = function scssLoader(isExtract) {
  return generateCSSLoaders({
    use: [{
      loader: 'less',
      options: {
        modifyVars: {
          // 'primary-color': '#f00',
        },
        javascriptEnabled: true,
      }
    }],
    isVueLoader: false,
    isExtract,
  });
};


exports.rmrfSync = function rmrf(globPath) {
  rimraf.sync(globPath);
};

exports.getEntries = function getEntries(globPath) {
  const filePaths = glob.sync(globPath);
  return filePaths.reduce((ret, filePath) => {
    const dir = path.parse(filePath).dir || '';
    const dirPaths = dir.split('/');
    const entryName = dirPaths[dirPaths.length - 1];
    ret[entryName] = filePath; // eslint-disable-line
    return ret;
  }, {});
};

exports.getAllFileNameByPath = function getAllFileNameByPath(globPath) {
  const filePaths = glob.sync(globPath);
  return filePaths.map(filePath => path.basename(filePath));
};

exports.readVendorManifest = function readVendorManifest(p) {
  let ret = null;
  const data = readFileSync(p, 'utf-8');
  if (!data) {
    throw new Error('Can\'t read venderMainifest file');
  }

  try {
    ret = JSON.parse(data);
  } catch (e) {
    throw e;
  }
  return ret;
};
