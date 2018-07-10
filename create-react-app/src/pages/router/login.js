import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import LoginLayout from '../../layouts/LoginLayout';

// import Login from '../../routes/Login/';
// import Register from '../../routes/Login/Register';
// import Forget from '../../routes/Login/Forget';

function RouterConfig({ history, app }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          {/* <Route path="/" exact component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forget" component={Forget} />
          <Redirect from="(.*)" to="/" /> */}
          <Route path="(.*)" render={props => <LoginLayout {...props} app={app} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
// export default RouterConfig;
