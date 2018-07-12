import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button } from 'antd';
import Result from 'ant-design-pro/lib/Result';
import styles from './index.less';
// import {  } from 'antd';
// import styles from './HeaderLayout.less';


const Finish = ({
  selected,
  projects,
}) => {
  const name = selected || projects[0].name;
  return (
    <Result
      className={styles.result}
      type="success"
      title="恭喜您，商户创建成功！"
      description=""
      actions={<Button href={`#/p/${name}/project`} type="primary">进入商户</Button>}
    />
  );
};

Finish.propTypes = {
  selected: PropTypes.string,
  projects: PropTypes.array,
};
export default connect(state => ({
  selected: state.client.selected,
  projects: state.client.projects,
}))(Finish);
// export default Finish;
