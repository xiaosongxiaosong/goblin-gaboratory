import React from 'react';
// import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './Loading.less';


const Loading = () => {
  return (
    <div className={styles.loading}>
      <Icon type="loading" />
    </div>
  );
};

// function mapStateToProps(state) {
//   return { ...state.client };
// }

// export default Show;
export default Loading;
