/* eslint global-require: "off", import/no-unresolved: "off" */
// Note. This file is not added to nodemon watch list.
const router = require('koa-router')();

const PROD = process.env.NODE_ENV === 'production';
const ROUTE_PATH = '/';
const DATA = {
  user: {
    login: 'samuel_johnson',
    name: 'Samuel Johnson',
  },
};

module.exports = (koaApp) => {
  if (PROD) {
    // Check if server bundle is present
    let view;
    try {
      view = require('../../dist/bundle.server.js');
    } catch (error) {
      console.error('Server bundle is missing. Please, build the project.');
      process.exit(1);
    }

    // Render view from the server bundle
    router.get('/', async (ctx) => {
      ctx.body = view(DATA);
    });

    koaApp.use(router.routes());
  } else {
    const webpack = require('webpack');
    const { devMiddleware } = require('koa-webpack-middleware');
    const config = require('../../webpack.config');

    const compile = webpack(config);
    koaApp.use(devMiddleware(compile, {
      publicPath: ROUTE_PATH,
      stats: { colors: true },
    }));

    // TODO. Implement check for dist folder and alert if it's missing
    // Render view from the server bundle
    router.get('/', async (ctx) => {
      // Reload the server bundle on every request.
      // It can be superfluous to reload, but koa-webpack-middleware
      // doesn't support serverSideRender to obtain the build stats.
      let view;
      try {
        const resolvedPath = require.resolve('../../dist/bundle.server.js');
        delete require.cache[resolvedPath];
        view = require('../../dist/bundle.server.js');
      } catch (error) {
        console.error('Failed to reload the server bundle after rebuild.');
        console.error(error);
      }

      ctx.body = view(DATA);
    });

    koaApp.use(router.routes());
  }
};
