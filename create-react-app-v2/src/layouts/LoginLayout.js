import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Switch, Redirect, Route } from 'dva/router';
import { Card } from 'antd';
import Login from '../routes/Login/';
import Register from '../routes/Login/Register';
// import Forget from '../routes/Login/Forget';
// import {  } from 'antd';
import styles from './LoginLayout.less';


const LoginLayout = ({
  // app,
  // match,
  // location,
  search,
}) => {
  if (!search) {
    return null;
  }
  return (
    <div className={styles.center}>
      <Card bordered={false} className={styles.form}>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/register" component={Register} />
          {/* <Route path="/forget" component={Forget} /> */}
          <Redirect from="(.*)" to="/" />
        </Switch>
      </Card>
    </div>
  );
};

LoginLayout.propTypes = {
  // app: PropTypes.object,
  // location: PropTypes.object,
  search: PropTypes.object,
};
export default connect(state => state.login)(LoginLayout);
// export default LoginLayout;
