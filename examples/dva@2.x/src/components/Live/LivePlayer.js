import React from 'react';
import PropTypes from 'prop-types';
import { MediaElement, PrismFlashplayer, NativeHLSPlayer } from '../Player/';

const LivePlayer = ({
  playingState,
  src,
  format,
}) => {
  if (mejs.Features.isiOS || mejs.Features.isAndroid) {
    const type = 'application/x-mpegURL';
    return <NativeHLSPlayer src={src} type={type} />;
  }

  if (undefined === src || null === src) {
    return null;
  }

  if ('living' === playingState) {
    const type = format.type;
    if ('rtmp' === format.protocol) {
      return <PrismFlashplayer src={src} type={type} />;
    } else {
      return <MediaElement src={src} type={type} foucelive={format.foucelive} />;
    }
  } else {
    return null;
  }
};

LivePlayer.propTypes = {
  playingState: PropTypes.string,
  src: PropTypes.string,
  format: PropTypes.object,
};

export default LivePlayer;
