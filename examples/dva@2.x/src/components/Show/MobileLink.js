import React from 'react';
// import PropTypes from 'prop-types';
import { Icon, Popover, message } from 'antd';
import { config } from '../../utils';
import styles from './index.less';

const { api } = config;

class MobileLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcode: null,
    };
  }

  componentWillUnmount() {
    this.setState({ qrcode: null });
  }

  loadQrcode() {
    if (null !== this.state.qrcode) {
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('get', `${api}/qrcode?text=${encodeURIComponent(this.props.text)}&with_logo=false`, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (200 === xhr.status) {
        this.setState({ qrcode: window.URL.createObjectURL(xhr.response) });
      } else {
        message.error('获取二维码失败');
      }
    };
    xhr.onerror = () => {
      message.error('获取二维码失败');
    };
    xhr.send();
  }

  render() {
    return (
      <Popover
        title="使用微信扫描二维码"
        content={<div className={styles.qrcode}><img src={this.state.qrcode} alt="" /></div>}
        placement="topRight"
      >
        <span className={styles.qrcodeText} onMouseEnter={e => this.loadQrcode(e)}>
          <Icon type="mobile" />&nbsp;手机观看
        </span>
      </Popover>
    );
  }
}

// Info.propTypes = {
//   qrcode: PropTypes.string,
// };

export default MobileLink;
