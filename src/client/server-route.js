/* eslint global-require: "off", import/no-unresolved: "off" */
// Note. This file is not added to nodemon watch list.
// In order for development build to work, run the production build once
// to copy the assets.
const router = require('koa-router')();

const PROD = process.env.NODE_ENV === 'production';

module.exports = (app) => {
  if (!PROD) {
    const webpack = require('webpack');
    const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
    const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
    const config = require('../../webpack.config');
    const compiler = webpack(config);
    const devMiddlewareInstance = devMiddleware(compiler, {
      // serverSideRender is conflicting with koa-webpack-middleware
      // serverSideRender: true,
      publicPath: '/',
      stats: { colors: true },
    });
    app.use(devMiddlewareInstance);

    // app.use(hotMiddleware(compiler.compilers.find(c => c.name === 'client')));
    app.use(webpackHotServerMiddleware(compiler, {
      createHandler: webpackHotServerMiddleware.createKoaHandler,
    }));
  } else {
    // Check if server bundle is present
    let serverRenderer;
    try {
      serverRenderer = require('../../dist/bundle.server.js').default;
    } catch (error) {
      console.log(error);
      console.error('Server bundle is missing. Please, build the project.');
      process.exit(1);
    }

    // Render view from the server bundle
    router.get('/', serverRenderer());
    app.use(router.routes());
  }
};
