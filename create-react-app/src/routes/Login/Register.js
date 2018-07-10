import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Form, Input, Icon, Button, notification } from 'antd';
// import { sjclPassword } from '../../utils/auth';
import userService from '../../services/user';
import loginInfoService from '../../services/loginInfo';
import styles from './Register.less';


class Register extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cellphone: '',
      validateStatus: '',
      help: '',
      username: '',
      nameValidateStatus: '',
      nameHelp: '',
      countdown: 0,
      loading: false,
    };
    this.intervalSeconds = 60;
    this.interval = undefined;

    this.onChange = this.onChange.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.getCode = this.getCode.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillUnmount() {
    this.stopInterval();
  }
  async onChange(e) {
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
    const { errMsg } = await userService.checkConflict({ cellphone: e.target.value });
    if (errMsg && errMsg.response && 409 === errMsg.response.status) {
      return this.setState({
        validateStatus: 'error',
        help: <Link to="/" replace>手机号已经注册，去登录</Link>,
      });
    } else {
      return this.setState({
        validateStatus: 'success',
        help: '手机号可以使用',
      });
    }
  }
  async onUsernameChange(e) {
    const username = e.target.value;
    this.setState({ username });
    if ('' === username) {
      return this.setState({ nameValidateStatus: 'success', nameHelp: '' });
    }
    if (null === username.match(/^[a-zA-X][-_\w]*$/)) {
      return this.setState({
        nameValidateStatus: 'error',
        nameHelp: '用户名必须字母开头，支持字母、数字、符号“-”和“_”，请检查',
      });
    }
    this.setState({ nameValidateStatus: 'validating', nameHelp: '正在检查用户名是否冲突' });
    const { errMsg } = await userService.checkConflict({ username });
    if (this.state.username !== username) {
      return;
    }
    if (errMsg && errMsg.response && 409 === errMsg.response.status) {
      return this.setState({ nameValidateStatus: 'error', nameHelp: '用户名已被占用' });
    } else {
      return this.setState({ nameValidateStatus: 'success', nameHelp: '用户名可以使用' });
    }
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if ((errors && errors.code) || 'success' !== this.state.validateStatus) {
        return;
      }
      this.register({ ...values, cellphone: this.state.cellphone });
    });
  }
  async getCode() {
    this.setState({ countdown: this.intervalSeconds });
    const { errMsg } = await userService.getRegisterCode({ cellphone: this.state.cellphone });
    if (errMsg) {
      notification.error({
        message: '获取验证码失败',
        description: '获取验证码失败，一个小时最多发送 5 条验证码，请稍候重试。',
      });
      this.stopInterval();
    } else {
      this.startInterval();
    }
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
  async register(values) {
    this.setState({ loading: true });
    const password = loginInfoService.sjclPassword(values.password);
    const { errMsg } = await userService.register({ ...values, password });
    this.setState({ loading: false });
    const status = errMsg && errMsg.response && errMsg.response.status;
    if (404 === status || 435 === status) {
      return notification.error({ message: '验证码已过期', description: '' });
    } else if (409 === status) {
      return notification.error({ message: '手机号已经注册', description: '' });
    } else if (410 === status) {
      return notification.error({ message: '用户名已被使用', description: '' });
    } else if (434 === status) {
      return notification.error({ message: '验证码错误', description: '' });
    }
    this.login({ ...values, password });
  }
  async login(values) {
    this.setState({ loading: true });
    const expired = loginInfoService.getLoginExpired();
    const { data, errMsg } = await userService.userLogin({ username: values.cellphone, password: values.password, expired });
    this.setState({ loading: false });
    if (errMsg) {
      notification.success({ message: '注册成功，请登录', description: '' });
      this.props.dispatch(routerRedux.replace('/'));
    } else {
      this.props.dispatch({ type: 'login/loginSucceed', payload: data });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <div className={`${styles.flex} ${styles.logo}`}>
          <div className={styles.hd}>
            <img alt="logo" src="//opensight-public.oss-cn-hangzhou.aliyuncs.com/img/logo40x40.png" />
          </div>
          <div className={styles.bd}>免费注册</div>
        </div>
        <Form onSubmit={this.onSubmit}>
          <Form.Item validateStatus={this.state.validateStatus} help={this.state.help} hasFeedback>
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
                    disabled={'success' !== this.state.validateStatus || 0 < this.state.countdown}
                  >
                    {0 < this.state.countdown ? `${this.state.countdown} 秒后重新获取` : '获取验证码'}
                  </Button>
                }
                placeholder="短信验证码"
              />,
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator('password', {
              // initialValue: password,
              rules: [{ required: true, message: '请填写密码' }],
            })(<Input prefix={<Icon type="lock" />} type="password" placeholder="密码" />)}
          </Form.Item>
          <Form.Item validateStatus={this.state.nameValidateStatus} help={this.state.nameHelp}>
            <Input
              prefix={<Icon type="user" />}
              placeholder="用户名"
              value={this.state.username}
              onChange={this.onUsernameChange}
              disabled={'validating' === this.state.nameValidateStatus}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginBtn} loading={this.state.loading}>免费注册</Button>
            <span>点击注册即表明你同意本</span>
            <a href="https://www.qulubo.net/tos.html" target="_blank" rel="noopener noreferrer">&nbsp;服务条款&nbsp;</a>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  }
}


// Basic.propTypes = {
//   // projectName: PropTypes.string,
//   info: PropTypes.object,
//   // dispatch: PropTypes.func,
// };

// // export default Show;
// export default connect(state => ({
//   // projectName: state.client.selected,
//   info: state.events.info,
// }))(Basic);
export default connect(() => ({}))(Form.create()(Register));

// export default Form.create()(Register);
