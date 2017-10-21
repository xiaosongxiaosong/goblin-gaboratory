import React from 'react';
import PropTypes from 'prop-types';
import { Poster } from '../Common';

const getPreviewUrl = (obj, key) => {
  if (obj && '' !== obj[key]) {
    return obj[key];
  } else {
    return 'http://opensight-public.oss-cn-hangzhou.aliyuncs.com/img/logo320x180.png';
  }
};

const Preview = ({
  info,
  playingState,
}) => {
  if ('living' === playingState) {
    return null;
  }
  const url = getPreviewUrl(info, 'preview');
  return (
    <Poster url={url} />
  );
};

Preview.propTypes = {
  info: PropTypes.object,
  playingState: PropTypes.string,
};

export default Preview;
