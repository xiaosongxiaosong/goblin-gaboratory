import dva from 'dva';
import 'babel-polyfill';
// import { useRouterHistory } from 'dva/router';
// import { createHashHistory } from 'history';
import createLoading from 'dva-loading';
import { message } from 'antd';

import './index.css';

// 1. Initialize
// const app = dva();
const app = dva({
  ...createLoading({
    effects: true,
  }),
  // history: useRouterHistory(createHashHistory)({ queryKey: false }),
  onError(error) {
    message.error(error.message);
  },
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
