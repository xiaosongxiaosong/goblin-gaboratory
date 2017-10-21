import React from 'react';
import PropTypes from 'prop-types';
import { loadEmptySrcAfterClick } from '../Player';
import { StartPlayButton } from '../Common';

const StartPlayBtn = ({
  playingState,
  bInPublicTimeRange,
  info,
  dispatch,
}) => {
  if (null === info || info === undefined || 0 === info.is_online || false === bInPublicTimeRange || 'inited' !== playingState) {
    return null;
  }
  const handleClick = () => {
    loadEmptySrcAfterClick();
    dispatch({ type: 'live/startPlay' });
  };

  return (
    <StartPlayButton handleClick={handleClick} />
  );
};

StartPlayBtn.propTypes = {
  playingState: PropTypes.string,
  info: PropTypes.object,
  bInPublicTimeRange: PropTypes.bool,
  dispatch: PropTypes.func,
};

export default StartPlayBtn;
