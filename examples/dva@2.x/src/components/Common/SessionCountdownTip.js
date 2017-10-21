import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const SessionCountdownTip = ({
  sessionCountdown,
  playingState,
}) => {
  // return (
  //   <div className={styles.sessionCountdown}>
  //     <div>10 秒之后直播开始</div>
  //   </div>
  // );
  if ('waitingForSession' !== playingState) {
    return null;
  } else {
    return (
      <div className={styles.sessionCountdown}>
        <div>{sessionCountdown} 秒之后直播开始</div>
      </div>
    );
  }
};

SessionCountdownTip.propTypes = {
  sessionCountdown: PropTypes.number,
  playingState: PropTypes.string,
};

export default SessionCountdownTip;
