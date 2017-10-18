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
    const PassThrough = require('stream').PassThrough;
    const webpack = require('webpack');
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');
    const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
    const config = require('../../webpack.config');

    const compiler = webpack(config);
    const dev = devMiddleware(compiler, {
      serverSideRender: true,
      publicPath: '/',
      stats: { colors: true },
    });
    const hot = hotMiddleware(compiler);
    const hotServer = webpackHotServerMiddleware(compiler, {
      createHandler: webpackHotServerMiddleware.createKoaHandler,
      serverRendererOptions: DATA,
    });

    app.use(async (ctx, next) => {
      await new Promise((resolve) => {
        dev(ctx.req, {
          end: (content) => {
            ctx.body = content;
            resolve();
          },
          setHeader: ctx.set.bind(ctx),
          locals: ctx.state,
        }, () => resolve(next()));
      });
    });

    // TODO: Fix Hot Middleware Wrapper
    // app.use(async (ctx, next) => {
    //   const stream = new PassThrough();
    //   await hot(ctx.req, {
    //     write: stream.write.bind(stream),
    //     writeHead: (status, headers) => {
    //       stream.pipe(ctx.res);
    //       ctx.status = status;
    //       ctx.set(headers);
    //     },
    //   }, next);
    // });

    // Render view from the server bundle
    router.get('/', hotServer);
    app.use(router.routes());
  } else {
    // Check if server bundle is present
    let serverRenderer;
    try {
      serverRenderer = require('../../dist/server.js').default;
    } catch (error) {
      logger.error('Server bundle is missing. Please, build the project.');
    }

    // Render view from the server bundle
    router.get('/', serverRenderer(DATA));
    app.use(router.routes());
  }
};
