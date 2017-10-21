import React from 'react';
// import PropTypes from 'prop-types';
import { loadEmptySrcAfterClick } from '../Player';
import styles from './index.less';

const StartPlayBtn = ({
  playingState,
  info,
  dispatch,
}) => {
  const handleClick = () => {
    // console.log('handleClick');
    loadEmptySrcAfterClick();
    if (1 === info.state) {
      dispatch({ type: 'show/startPlay' });
    } else if (0 !== info.state) {
      dispatch({ type: 'show/startReplay' });
    }
  };

  if ('inited' !== playingState || null === info || 0 === info.state || (1 !== info.state && false === info.record_enabled)) {
    return null;
  } else {
    return (
      <div className={styles.startPlayBtn} onClick={handleClick} />
    );
  }
};

// Info.propTypes = {
//   info: PropTypes.string,
// };

export default StartPlayBtn;
