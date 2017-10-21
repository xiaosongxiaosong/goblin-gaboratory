import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Button } from 'antd';
import { loadEmptySrcAfterClick } from '../Player';
import styles from './index.less';

const renderMenu = (selected, list, handle) => {
  return (
    <Menu selectedKeys={[selected.value]} onClick={handle}>
      {list.map((it) => {
        return (<Menu.Item key={it.value}>{it.value}</Menu.Item>);
      })}
    </Menu>
  );
};

const FormatBtnGroup = ({
  playingState,
  info,
  bInPublicTimeRange,
  supportedFormats,
  selectedFormat,
  dispatch,
}) => {
  if (null === info || info === undefined || 0 === info.is_online || true !== bInPublicTimeRange) {
    return null;
  }
  if (undefined === selectedFormat || null === selectedFormat || undefined === supportedFormats || null === supportedFormats) {
    return null;
  }

  const disabled = ('waiting' === playingState || 'waitingForSession' === playingState) ? 'disabled' : '';

  const handleMenuClick = (e) => {
    if ('waiting' === playingState || 'waitingForSession' === playingState) {
      return;
    }
    loadEmptySrcAfterClick();
    const format = supportedFormats.find((it) => {
      return it.value === e.key;
    });
    if (format) {
      dispatch({ type: 'live/startWithFormat', payload: format });
    }
  };
  const menu = renderMenu(selectedFormat, supportedFormats, handleMenuClick);

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="topLeft">
      <Button className={styles.bottomBarBtn} disabled={disabled} size="large">{selectedFormat.value}</Button>
    </Dropdown>
  );
};

FormatBtnGroup.propTypes = {
  playingState: PropTypes.string,
  info: PropTypes.object,
  bInPublicTimeRange: PropTypes.bool,
  supportedFormats: PropTypes.array,
  selectedFormat: PropTypes.object,
  dispatch: PropTypes.func,
};

export default FormatBtnGroup;
