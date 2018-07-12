import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect } from 'dva/router';
import { Card, Steps } from 'antd';
import { getGuideRouters, getGuideMenu } from '../common/client';
// import {  } from 'antd';
// import styles from './HeaderLayout.less';


const GuideLayout = ({
  app,
  // match,
  location,
}) => {
  let current = 0;
  const steps = getGuideMenu().map((it, idx) => {
    if (it.path === location.pathname) {
      current = idx;
    }
    return <Steps.Step key={it.key} title={it.name} />;
  });
  return (
    <Card bordered={false}>
      <div>
        <Steps current={current}>{steps}</Steps>
        <Switch>
          {getGuideRouters(app)}
          <Redirect from="*" to="/guide/user" />
        </Switch>
      </div>
    </Card>
  );
};

GuideLayout.propTypes = {
  app: PropTypes.object,
  location: PropTypes.object,
};
// export default connect(state => ({
//   currentUser: state.user.currentUser,
//   collapsed: state.global.collapsed,
//   fetchingNotices: state.global.fetchingNotices,
//   notices: state.global.notices,
// }))(GuideLayout);
export default GuideLayout;
