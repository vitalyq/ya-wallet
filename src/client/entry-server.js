import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { extractCritical } from 'emotion-server';
import { App } from './components';

module.exports = (appData) => {
  const app = renderToString(<App data={appData} />);
  const { html, ids, css } = extractCritical(app);
  const viewData = `window.__data=${JSON.stringify({ ids, appData })};`;

  const template = (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="Кошелёк" />
        <title>Кошелёк</title>
        <link rel="stylesheet" href="/index.css" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: html }} />
        <script dangerouslySetInnerHTML={{ __html: viewData }} />
        <script src="bundle.client.js" />
      </body>
    </html>
  );

  return renderToStaticMarkup(template);
};
