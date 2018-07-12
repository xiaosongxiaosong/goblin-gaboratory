import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './index.less';

const Phone = ({
  children,
}) => {
  const node = (!children || '' === children) ? (<span className={styles.italic}>未登记电话</span>) : children;
  return (
    <div>
      <span className={styles.primaryIcon}><Icon type="phone" /></span>
      {node}
    </div>
  );
};

Phone.propTypes = {
  children: PropTypes.string,
};

export default Phone;
