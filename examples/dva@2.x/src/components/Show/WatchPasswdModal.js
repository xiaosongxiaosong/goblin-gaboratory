import React from 'react';
import PropTypes from 'prop-types';
import { Modal, InputNumber, message } from 'antd';
import { watchPassword } from '../../utils';
import styles from './index.less';

const WatchPasswdModal = ({
  type,
  dispatch,
}) => {
  if (undefined === type || null === type) {
    return null;
  }
  let passwd;
  let visible = true;
  const handleOk = () => {
    if (watchPassword.checkWatchPassword(passwd)) {
      dispatch({ type, payload: passwd.toString() });
      visible = false;
      // handleCancel();
    } else {
      message.error('密码不正确', 5);
    }
  };
  const onChange = (value) => {
    passwd = value;
  };
  const handleCancel = () => {
    dispatch({ type: 'show/setPasswdModalType', payload: null });
  };
  return (
    <Modal
      visible={visible}
      title="请输入观看密码"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <InputNumber className={styles.blockInput} size="large" min={100000} max={999999} onChange={onChange} />
    </Modal>
  );
};

WatchPasswdModal.propTypes = {
  type: PropTypes.string,
};

export default WatchPasswdModal;
