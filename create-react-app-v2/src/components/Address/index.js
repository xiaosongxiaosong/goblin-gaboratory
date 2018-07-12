import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './index.less';

const Address = ({
  children,
}) => {
  const node = (!children || '' === children) ? (<span className={styles.italic}>未登记地址</span>) : children;
  return (
    <div>
      <span className={styles.primaryIcon}><Icon type="environment" /></span>
      {node}
    </div>
  );
};

Address.propTypes = {
  children: PropTypes.string,
};

export default Address;
