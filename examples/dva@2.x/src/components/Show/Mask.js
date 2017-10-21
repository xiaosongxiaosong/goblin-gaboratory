import React from 'react';
// import PropTypes from 'prop-types';
import styles from './index.less';

const Mask = ({
  playingState,
}) => {
  if ('living' === playingState || 'replaying' === playingState) {
    return null;
  } else {
    return (
      <div className={styles.mask} />
    );
  }
};

// Info.propTypes = {
//   info: PropTypes.string,
// };

export default Mask;
