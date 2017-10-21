import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover } from 'antd';
import { config, url } from '../../utils';
import styles from './index.less';

const { api } = config;

const MobileLink = ({
  info,
}) => {
  if (null === info || info === undefined) {
    return null;
  }
  const text = `${url.getWxUrl(window.location)}#/square-page/${info.project_name}/live/${info.uuid}`;
  const src = `${api}/qrcode?text=${encodeURIComponent(text)}&with_logo=false`;
  return (
    <Popover
      title="使用微信扫描二维码"
      content={<div className={styles.qrcode}><img src={src} alt="" /></div>}
      placement="topRight"
    >
      <span className={styles.qrcodeText}> <Icon type="mobile" />&nbsp;手机观看</span>
    </Popover>
  );
};

MobileLink.propTypes = {
  info: PropTypes.object,
};

export default MobileLink;
