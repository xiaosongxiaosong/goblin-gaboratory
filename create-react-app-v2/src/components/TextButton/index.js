import React from 'react';
import PropTypes from 'prop-types';
// import { Spin } from 'antd';
import styles from './index.less';


const TextButton = ({
  children,
  onClick,
}) => {
  return (
    <button type="button" className={styles.textButton} onClick={onClick}>{children}</button>
  );
};

TextButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  onClick: PropTypes.func,
};

export default TextButton;
