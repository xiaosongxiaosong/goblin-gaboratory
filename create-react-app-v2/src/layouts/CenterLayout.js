import React from 'react';
import PropTypes from 'prop-types';
import styles from './CenterLayout.less';


const CenterLayout = ({
  children,
}) => {
  return (
    <div className={styles.center}>{children}</div>
  );
};

CenterLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

export default CenterLayout;
