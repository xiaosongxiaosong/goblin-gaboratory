import React from 'react';
// import PropTypes from 'prop-types';
import { MediaElement, PrismFlashplayer, NativeHLSPlayer } from '../Player/';

const ShowPlayer = ({
  playingState,
  src,
  format,
  params,
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
    if ('rtmp' === format.protocol || (params && params.fouceFlash)) {
      const isLive = true;
      return <PrismFlashplayer src={src} type={type} isLive={isLive} />;
    } else {
      return <MediaElement src={src} type={type} foucelive={format.foucelive} />;
    }
  } else if ('replaying' === playingState) {
    const type = 'application/x-mpegURL';
    if (params && params.fouceFlash) {
      const isLive = false;
      return <PrismFlashplayer src={src} type={type} isLive={isLive} />;
    } else {
      return <MediaElement src={src} type={type} />;
    }
  } else {
    return null;
  }
};

// ShowPlayer.propTypes = {
//   info: PropTypes.string,
// };

export default ShowPlayer;
