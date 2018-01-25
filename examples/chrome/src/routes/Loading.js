import React from 'react';
// import { connect } from 'dva';
import { Icon } from 'antd';
import { Link } from 'dva/router';

import styles from './Loading.less';


const Loading = () => {
  return (
    <div className={styles.loading}>
      <Icon type="loading" />
      <div>
        <Link to="/all">all</Link>
      </div>
    </div>
  );
};

export default Loading;
