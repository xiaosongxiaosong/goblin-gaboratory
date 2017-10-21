import React from 'react';
// import PropTypes from 'prop-types';
import { Button } from 'antd';
import { loadEmptySrcAfterClick } from '../Player';
import styles from './index.less';

const PlayBackBtn = ({
  playingState,
  info,
  dispatch,
}) => {
  const handleClick = () => {
    loadEmptySrcAfterClick();
    dispatch({ type: 'show/startReplay' });
  };

  if (null === info || 1 !== info.state || false === info.record_enabled) {
    return null;
  }
  let disabled = '';
  let type = '';
  if ('waiting' === playingState || 'waitingForSession' === playingState) {
    disabled = 'disabled';
  } else if ('replaying' === playingState) {
    type = 'primary';
  }

  return (
    <Button className={styles.bottomBtn} type={type} disabled={disabled} size="large" onClick={handleClick}>
      <i className="fa fa-film" />&nbsp;回放
      </Button>
  );
};

// Info.propTypes = {
//   info: PropTypes.string,
// };

export default PlayBackBtn;
