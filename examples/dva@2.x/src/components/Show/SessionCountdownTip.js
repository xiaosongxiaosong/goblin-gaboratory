import React from 'react';
// import PropTypes from 'prop-types';
import styles from './index.less';

const SessionCountdownTip = ({
  sessionCountdown,
  playingState,
}) => {
  if ('waitingForSession' !== playingState) {
    return null;
  } else {
    return (
      <div className={styles.mask}>
        <h1>{sessionCountdown} 秒之后直播开始</h1>
      </div>
    );
  }
};

// Info.propTypes = {
//   info: PropTypes.string,
// };

export default SessionCountdownTip;
