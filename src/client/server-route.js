/* eslint global-require: "off", import/no-unresolved: "off" */
// Note. This file is not added to nodemon watch list.
// In order for development build to work, run the production build once
// to copy the assets.

const PROD = process.env.NODE_ENV === 'production';

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

    app.use(webpackHotServerMiddleware(compiler, {
      createHandler: webpackHotServerMiddleware.createKoaHandler,
    }));
  } else {
    // Check if server bundle is present
    let serverRenderer;
    try {
      serverRenderer = require('../../dist/server.js').default;
    } catch (error) {
      console.log(error);
      console.error('Server bundle is missing. Please, build the project.');
      process.exit(1);
    }

    // Render view from the server bundle
    const router = require('koa-router')();
    router.get('/', serverRenderer());
    app.use(router.routes());
  }
};
