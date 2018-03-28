import dva from 'dva';
import { createBrowserHistory } from 'history';
import 'antd/dist/antd.less';
import 'ant-design-pro/dist/ant-design-pro.css';

import './index.less';

// 1. Initialize
const app = dva({
  history: createBrowserHistory(),
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/app').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
