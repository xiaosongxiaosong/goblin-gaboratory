import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';


const PageBody = ({ children }) => {
  return (
    <div className={styles.container}>{children}</div>
  );
};

PageBody.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

export default PageBody;
