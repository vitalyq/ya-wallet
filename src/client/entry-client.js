import React from 'react';
import { hydrate as reactHydrate } from 'react-dom';
import { hydrate as emotionHydrate } from 'emotion';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

const { ids, appData } = window.__data;
emotionHydrate(ids);

const render = (Component) => {
  reactHydrate(
    <AppContainer>
      <Component data={appData} />
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(App);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', () => { render(App); });
}
