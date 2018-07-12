import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Icon, Button, notification } from 'antd';
import userService from '../../../../services/user';
import styles from './index.less';


class User extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      validateStatus: '',
      help: '',
      countdown: 0,
      cellphone: '',
    };
    this.intervalSeconds = 60;
    this.interval = undefined;

    this.onChange = this.onChange.bind(this);
    this.getCode = this.getCode.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  async onChange(e) {
    // const value = e.target.value;
    this.setState({ cellphone: e.target.value });
    if (null === e.target.value.match(/^\d{11}$/)) {
      return this.setState({
        validateStatus: 'warning',
        help: '手机号必须为 11 位数字！',
      });
    }
    this.setState({
      validateStatus: 'validating',
      help: '正在检查手机号是否冲突',
    });
    const { err } = await userService.checkConflict({ cellphone: e.target.value });
    if (err && err.response && 409 === err.response.status) {
      return this.setState({
        validateStatus: 'error',
        help: '手机号已经注册！',
      });
    } else {
      return this.setState({
        validateStatus: 'success',
        help: '手机号可以使用',
      });
    }
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.completeRegister(values);
      }
    });
  }
  async getCode() {
    this.setState({ countdown: this.intervalSeconds });
    const { err } = await userService.getRegisterCode({ cellphone: this.state.cellphone });
    if (err) {
      notification.error({
        message: '获取验证码失败',
        description: '获取验证码失败，一个小时最多发送 5 条验证码，请稍候重试。',
      });
      return this.setState({ countdown: 0 });
    }
    this.startInterval();
  }
  async completeRegister(values) {
    const { err } = await userService.completeRegister({
      username: this.props.userInfo.username,
      cellphone: this.state.cellphone,
      ...values,
    });
    if (err) {
      return notification.error({
        message: '完善用户资料失败',
        description: '',
      });
    }
    this.props.dispatch({ type: 'client/jump2guideProject' });
  }
  startInterval() {
    this.stopInterval();
    this.setState({ countdown: this.intervalSeconds });
    this.interval = window.setInterval(() => {
      if (0 < this.state.countdown) {
        this.setState({ countdown: this.state.countdown - 1 });
      } else {
        this.stopInterval();
      }
    }, 1000);
  }
  stopInterval() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    this.setState({ countdown: 0 });
    this.interval = undefined;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSubmit} className={styles.form}>
        <Form.Item validateStatus={this.state.validateStatus} help={this.state.help}>
          <Input
            prefix={<Icon type="mobile" />}
            placeholder="请输入手机号"
            value={this.state.cellphone}
            onChange={this.onChange}
            disabled={'validating' === this.state.validateStatus}
          />
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('code', {
            rules: [{
              required: true, message: '请输入短信验证码！',
            }, {
              pattern: /^\d{6}$/, message: '短信验证码必须为 6 位数字！',
            }],
          })(
            <Input
              className={styles.sms}
              prefix={<Icon type="mail" />}
              addonAfter={
                <Button
                  className={styles.smsBtn}
                  type="primary"
                  onClick={this.getCode}
                  disabled={'success' !== this.state.validateStatus || 0 !== this.state.countdown}
                >
                  {0 < this.state.countdown ? `${this.state.countdown} 秒后重新获取` : '获取验证码'}
                </Button>
              }
              placeholder="短信验证码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入密码！',
            }],
          })(
            <Input type="password" prefix={<Icon type="lock" />} placeholder="设置密码" />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.blockBtn}>完善资料</Button>
        </Form.Item>
      </Form>
    );
  }
}

User.propTypes = {
  dispatch: PropTypes.func,
};
const WrappedUser = Form.create()(User);
// export default WrappedUser;
export default connect(state => ({
  userInfo: state.client.userInfo,
}))(WrappedUser);
