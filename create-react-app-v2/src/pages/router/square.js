import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { Spin } from 'antd';
import dynamic from 'dva/dynamic';

import styles from './index.less';

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});


function getLayout(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null;
  }
  const route = navData.filter(item => item.layout === path)[0];
  return {
    component: route.component,
    layout: route.layout,
    name: route.name,
    path: route.path,
  };
}

function RouterConfig({ history, app }) {
  const navData = getNavData(app);
  const UserLayout = getLayout(navData, 'UserLayout').component;
  const BasicLayout = getLayout(navData, 'BasicLayout').component;

  const passProps = {
    app,
    navData,
    getRouteData: (path) => {
      return getRouteData(navData, path);
    },
  };

  return (
    <Router history={history}>
      <Switch>
        <Route path="/user" render={props => <UserLayout {...props} {...passProps} />} />
        <Route path="/" render={props => <BasicLayout {...props} {...passProps} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
