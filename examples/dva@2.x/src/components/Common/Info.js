import React from 'react';
// import PropTypes from 'prop-types';
import { Spin } from 'antd';
import styles from './index.less';


const renderLongDesc = (longDesc) => {
  if ('' === longDesc) {
    return (<p className={styles.italic}>无描述信息</p>);
  } else {
    return (<pre className={styles.descContiner}>{longDesc}</pre>);
  }
};

const Info = ({
  info,
}) => {
  if (null === info || info === undefined) {
    return <Spin />;
  }
  return (
    <div>
      <h3>{info.name}</h3>
      {renderLongDesc(info.long_desc)}
    </div>
  );
};

// Info.propTypes = {
//   info: PropTypes.string,
// };

export default Info;
