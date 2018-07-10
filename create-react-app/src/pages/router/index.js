import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';
// import { Modal } from 'antd';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import GuideLayout from '../../layouts/GuideLayout';
import ClientLayout from '../../layouts/ClientLayout';
import Loading from '../../routes/Loading';

dynamic.setDefaultLoadingComponent(() => {
  return <Loading />;
});

// const getUserConfirmation = (message, callback) => {
//   debugger;
//   Modal.confirm({
//     title: message,
//     content: '',
//     onOk() {
//       console.log('OK');
//       callback(true);
//     },
//     onCancel() {
//       console.log('Cancel');
//       callback(false);
//     },
//   });
// };

function RouterConfig({ history, app }) {
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Loading} />
          <Route path="/guide" render={props => <GuideLayout {...props} app={app} />} />
          <Route path="(.*)" render={props => <ClientLayout {...props} app={app} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
