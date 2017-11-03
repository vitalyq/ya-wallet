/* eslint global-require: "off", import/no-unresolved: "off" */
// In order for development build to work, run the production build once
// to copy the assets.
const { isProduction, renderClient } = require('../config');
const router = require('koa-router')();

const DATA = {
  user: {
    login: 'samuel_johnson',
    name: 'Samuel Johnson',
  },
  cards: [{
    _id: '59f1b35532c12a7e01dc5afb',
    cardNumber: '5469257385340236',
    balance: 231310,
  },
  {
    _id: '59f1b35532c12a7e01dc5aff',
    cardNumber: '4058705341084454',
    balance: 700,
  }],
  transactions: [],
};

module.exports = (app) => {
  if (isProduction) {
    const serverRenderer = require('../../dist/server').default;
    router.get('/', serverRenderer(DATA));
    app.use(router.routes());
  } else if (renderClient) {
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
  }
};
