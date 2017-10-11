/* eslint global-require: "off", import/no-unresolved: "off" */
const PROD = process.env.NODE_ENV === 'production';
const ROUTE_PATH = '/';
const DATA = {
  user: {
    login: 'samuel_johnson',
    name: 'Samuel Johnson',
  },
};

module.exports = (koaApp) => {
  if (!PROD) {
    const webpack = require('webpack');
    const { devMiddleware } = require('koa-webpack-middleware');
    const config = require('../../webpack.config');

    const compile = webpack(config);
    koaApp.use(devMiddleware(compile, {
      publicPath: ROUTE_PATH,
    }));
  } else {
    const view = require('../../dist/bundle.server.js');

    koaApp.use(async (ctx, next) => {
      if (ctx.path === ROUTE_PATH) {
        ctx.body = view(DATA);
      } else {
        await next();
      }
    });
  }
};
