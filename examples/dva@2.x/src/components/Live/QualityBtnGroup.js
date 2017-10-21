import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Button } from 'antd';
import { loadEmptySrcAfterClick } from '../Player';
import styles from './index.less';

const renderMenu = (selected, list, handle) => {
  return (
    <Menu selectedKeys={[selected.value]} onClick={handle}>
      {list.map((it) => {
        return (<Menu.Item key={it.value}>{it.name}</Menu.Item>);
      })}
    </Menu>
  );
};

const QualityBtnGroup = ({
  playingState,
  info,
  bInPublicTimeRange,
  supportedQualitys,
  selectedQuality,
  dispatch,
}) => {
  if (null === info || info === undefined || 0 === info.is_online || true !== bInPublicTimeRange) {
    return null;
  }
  if (undefined === selectedQuality || null === selectedQuality || undefined === supportedQualitys || null === supportedQualitys) {
    return null;
  }
  const disabled = ('waiting' === playingState || 'waitingForSession' === playingState) ? 'disabled' : '';

  const handleMenuClick = (e) => {
    if ('waiting' === playingState || 'waitingForSession' === playingState) {
      return;
    }
    loadEmptySrcAfterClick();
    const quality = supportedQualitys.find((it) => {
      return it.value === e.key;
    });
    if (quality) {
      dispatch({ type: 'live/startWithQuality', payload: quality });
    }
  };
  const menu = renderMenu(selectedQuality, supportedQualitys, handleMenuClick);

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="topLeft">
      <Button className={styles.bottomBarBtn} disabled={disabled} size="large">{selectedQuality.name}</Button>
    </Dropdown>
  );
};

QualityBtnGroup.propTypes = {
  playingState: PropTypes.string,
  info: PropTypes.object,
  bInPublicTimeRange: PropTypes.bool,
  supportedQualitys: PropTypes.array,
  selectedQuality: PropTypes.object,
  dispatch: PropTypes.func,
};

export default QualityBtnGroup;
