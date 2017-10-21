import React from 'react';
// import PropTypes from 'prop-types';
import { Menu, Dropdown, Button, Icon } from 'antd';
import { loadEmptySrcAfterClick } from '../Player';
import styles from './index.less';

// const getClickHandle = (dispatch, format, playingState) => {
//   return () => {
//     if ('waiting' !== playingState && 'waitingForSession' !== playingState) {
//       dispatch({ type: 'show/startWithFormat', payload: format });
//     }
//   };
// };

const renderMenu = (selected, list, handle) => {
  return (
    <Menu selectedKeys={[selected.value]} onClick={handle}>
      {list.map((it) => {
        return (<Menu.Item key={it.value}>{it.value}</Menu.Item>);
      })}
    </Menu>
  );
};

const ButtonGroup = Button.Group;
const LiveBtnGroup = ({
  playingState,
  info,
  supportedFormats,
  selectedFormat,
  dispatch,
}) => {
  if (undefined === info || null === info || 1 !== info.state) {
    return null;
  }
  if (undefined === selectedFormat || null === selectedFormat) {
    return null;
  }
  if (undefined === supportedFormats || null === supportedFormats) {
    return null;
  }
  // let disabled = '';
  // if ('waiting' === playingState || 'waitingForSession' === playingState) {
  //   disabled = 'disabled';
  // }
  const disabled = ('waiting' === playingState || 'waitingForSession' === playingState) ? 'disabled' : '';
  const switchFormatDisabled = ('disabled' === disabled || 'replaying' === playingState) ? 'disabled' : '';
  const type = 'living' === playingState ? 'primary' : '';

  const handleClick = () => {
    loadEmptySrcAfterClick();
    if ('waiting' !== playingState && 'waitingForSession' !== playingState) {
      dispatch({ type: 'show/restartPlay' });
    }
  };
  const handleMenuClick = (e) => {
    loadEmptySrcAfterClick();
    if ('waiting' === playingState || 'waitingForSession' === playingState) {
      return;
    }
    const format = supportedFormats.find((it) => {
      return it.value === e.key;
    });
    if (format) {
      dispatch({ type: 'show/startWithFormat', payload: format });
    }
  };
  const menu = renderMenu(selectedFormat, supportedFormats, handleMenuClick);
  return (
    // <Dropdown.Button onClick={handleButtonClick} overlay={menu} trigger={['click']}>
    //   Dropdown
    // </Dropdown.Button>
    <ButtonGroup className={styles.bottomBtn}>
      <Button type={type} disabled={disabled} size="large" onClick={handleClick}><Icon type="caret-right" />&nbsp;直播</Button>
      <Dropdown overlay={menu} trigger={['click']} placement="topLeft">
        <Button type={type} disabled={switchFormatDisabled} size="large">{selectedFormat.value}&nbsp;<Icon type="up" /></Button>
      </Dropdown>
      {/* {supportedFormats && selectedFormat && supportedFormats.map((it) => {
        const type = it.value === selectedFormat.value ? 'primary' : '';
        const clickHandle = getClickHandle(dispatch, it, playingState);
        return (<Button type={type} disabled={disabled} onClick={clickHandle} key={it.value} size="large">{it.value}</Button>);
      })} */}
    </ButtonGroup>
  );
};

// Info.propTypes = {
//   qrcode: PropTypes.string,
// };

export default LiveBtnGroup;
