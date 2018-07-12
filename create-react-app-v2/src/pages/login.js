// import '@babel/polyfill';
// import 'url-polyfill';
import dva from 'dva';
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import { createLogger } from 'redux-logger';

// import { message } from 'antd';
import 'antd/dist/antd.less';

import './index.less';
// import router from './router/login';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
// app.use({});
app.use(createLoading());
app.use({ onAction: createLogger() });

// 3. Register global model
app.model(require('../models/login').default);

// 4. Router
// app.router(router);
app.router(require('./router/login').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
