import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';


const LongDesc = ({
  text,
  emptyText = '无描述信息',
}) => {
  if (!text) {
    return <div className={styles.italic}>{emptyText}</div>;
  }
  return (<pre className={styles.desc}>{text}</pre>);
};

LongDesc.propTypes = {
  text: PropTypes.string,
  emptyText: PropTypes.string,
};

export default LongDesc;
