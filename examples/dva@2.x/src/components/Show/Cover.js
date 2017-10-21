import React from 'react';
// import PropTypes from 'prop-types';
import styles from './index.less';

const Cover = ({
  info,
  playingState,
}) => {
  if ('living' === playingState || 'replaying' === playingState || null === info) {
    return null;
  } else {
    return (
      <div className={styles.cover} style={{ backgroundImage: `url(${info.cover_url})` }} />
    );
  }
};

// Info.propTypes = {
//   info: PropTypes.string,
// };

export default Cover;
