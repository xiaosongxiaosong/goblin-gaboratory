import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const format = (imageSrc, action) => {
  // if (!url || '' === url) {
  //   return '//opensight-public.oss-cn-hangzhou.aliyuncs.com/img/logo.320x180.png';
  // }
  const src = decodeURIComponent(imageSrc);
  if (-1 === src.search('.aliyuncs.com')) {
    return src;
  }

  if (-1 === src.search(/x-oss-process=image\//)) {
    const pre = -1 === src.indexOf('?') ? '?' : '&';
    return `${src}${pre}x-oss-process=image${action}`;
  }
  const matchObj = action.match(/^(\/[^,/&=]+,)/);
  if (null === matchObj) {
    return src;
  }
  const actionType = matchObj[0];
  if (-1 === src.search(new RegExp(`x\\-oss\\-process=image[\\w,\\/]*${actionType}`))) {
    return src.replace(/(x-oss-process=image\/[\w-_,]+)/, `$1${action}`);
  }
  return src.replace(new RegExp(`${actionType}[^\\/&=]+`), action);
};

/**
 * @param {*} src
 * @param {*} size 'lg' 'sm', default is 'sm';
 */
const OssImg = ({
  src,
  action = '/resize,m_fill,h_180,w_320',
  alt = '',
}) => {
  // const action = 'lg' === size ? '/resize,m_fill,h_720,w_1280' : '/resize,m_fill,h_180,w_320';
  const imageSrc = !src || '' === src ? '//opensight-public.oss-cn-hangzhou.aliyuncs.com/img/logo.320x180.png' : src;
  return (
    <img alt={alt} src={format(imageSrc, action)} className={styles.preview} />
  );
};

OssImg.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  action: PropTypes.string,
};

export default OssImg;
