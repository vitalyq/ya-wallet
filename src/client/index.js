import React from 'react';
import {hydrate as reactHydrate} from 'react-dom';
import {hydrate as emotionHydrate} from 'emotion';
import {App} from '../client/components';

//const {ids, appData} = window.__data;
//emotionHydrate(ids);

reactHydrate(<App data={{}} />, document.getElementById('root'));
