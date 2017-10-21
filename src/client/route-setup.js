/* eslint global-require: "off", import/no-unresolved: "off" */
// Note. This file is not added to nodemon watch list.
// In order for development build to work, run the production build once
// to copy the assets.
const router = require('koa-router')();
const logger = require('../utils/logger');

const PROD = process.env.NODE_ENV === 'production';
const DATA = {
  user: {
    login: 'samuel_johnson',
    name: 'Samuel Johnson',
  },
};

module.exports = (app) => {
  if (!PROD) {
    const webpack = require('webpack');
    const koaWebpack = require('koa-webpack');
    const hotServerMiddleware = require('webpack-hot-server-middleware');
    const config = require('../../webpack.config');

    const compiler = webpack(config);
    const devHot = koaWebpack({
      compiler,
      dev: {
        publicPath: '/',
        serverSideRender: true,
        stats: { colors: true },
      },
    });
    const hotServer = hotServerMiddleware(compiler, {
      createHandler: hotServerMiddleware.createKoaHandler,
      serverRendererOptions: DATA,
    });

    // Render view from the server bundle
    router.get('/', hotServer);
    app.use(devHot);
    app.use(router.routes());
  } else {
    // Check if server bundle is present
    let serverRenderer;
    try {
      serverRenderer = require('../../dist/server').default;
    } catch (error) {
      logger.error('Server bundle is missing. Please, build the project.');
    }

    // Render view from the server bundle
    router.get('/', serverRenderer(DATA));
    app.use(router.routes());
  }
};
