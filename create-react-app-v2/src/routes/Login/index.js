import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Form, Input, Icon, notification, Checkbox, Modal } from 'antd';
import Loading from '../Loading';
import userService from '../../services/user';
import loginInfoService from '../../services/loginInfo';
// import { getWebLoginExpired, getUserLoginExpired, sjclPassword, getRemberExpired } from '../../utils/auth';
import { getScript } from '../../utils';
import styles from './index.less';
// import { Loadmore } from '../../components'


const getRememberedUsername = () => {
  const loginInfo = loginInfoService.getRememberedLoginInfo();
  if (loginInfo) {
    return loginInfo.username;
  } else {
    return '';
  }
};

class Login extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: props.code,
      type: 'web_login',
      qrcodeContainerId: 'qrcode',
      validateStatus: '',
      help: '',
      countdown: 0,
      cellphone: '',
      loading: false,
    };
    if ('admin' === props.from) {
      this.state.type = 'user_login';
    }

    this.intervalSeconds = 60;
    this.interval = undefined;

    this.onChange = this.onChange.bind(this);
    this.getCode = this.getCode.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onUserLogin = this.onUserLogin.bind(this);
    this.changeLoginType = this.changeLoginType.bind(this);
  }
  componentDidMount() {
    if (this.state.code) {
      this.loginByCode();
    } else {
      this.showQrcode();
    }
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if ((errors && errors.code) || 'success' !== this.state.validateStatus) {
        return;
      }
      this.loginBySms(values);
    });
  }
  onUserLogin(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors && (errors.username || errors.password)) {
        return;
      }
      this.loginByUser(values);
      // dispatch({ type: 'login/userLogin', payload: values });
    });
  }
  async onChange(e) {
    this.setState({ cellphone: e.target.value });
    if (null === e.target.value.match(/^\d{11}$/)) {
      return this.setState({
        validateStatus: 'warning',
        help: '手机号必须为 11 位数字！',
      });
    } else {
      return this.setState({
        validateStatus: 'success',
        help: '手机号可以使用',
      });
    }
  }
  async getCode() {
    this.setState({ countdown: this.intervalSeconds });
    const { errMsg } = await userService.getRegisterCode({ cellphone: this.state.cellphone });
    if (errMsg) {
      notification.error({
        message: '获取验证码失败',
        description: '获取验证码失败，一个小时最多发送 5 条验证码，请稍候重试。',
      });
      return this.setState({ countdown: 0 });
    }
    this.startInterval();
  }
  async loginByCode() {
    if (!this.state.code) {
      this.showQrcode();
      return;
    }
    if (this.state.loading) {
      return;
    }
    await this.setState({ loading: true });
    const expired = loginInfoService.getLoginExpired();
    const { data, errMsg } = await userService.webLogin({ code: this.state.code, expired });
    if (errMsg) {
      Modal.error({ title: '登录失败', content: '登录失败，请重试' });
      await this.setState({ code: '' });
      this.showQrcode();
    } else {
      this.props.dispatch({ type: 'login/loginSucceed', payload: { ...data, search: this.props.search } });
    }
    await this.setState({ loading: false });
  }
  async loginByUser({ username, password, remember }) {
    if (this.state.loading) {
      return;
    }
    await this.setState({ loading: true });
    const expired = loginInfoService.getLoginExpired();
    const { data, errMsg } = await userService.userLogin({ username, password: loginInfoService.sjclPassword(password), expired });
    if (errMsg) {
      Modal.error({ title: '登录失败', content: '手机号/用户名 或密码错误' });
    } else {
      if (remember) {
        // TODO: 记住用户名
        loginInfoService.rememberLoginInfo({ username, expired: loginInfoService.getRemberExpired() });
      } else {
        // TODO: 删除记住的用户名
        loginInfoService.forgetLoginInfo();
      }
      this.props.dispatch({ type: 'login/loginSucceed', payload: { ...data, search: this.props.search } });
    }
    await this.setState({ loading: false });
  }
  async loginBySms({ username, password }) {
    if (this.state.loading) {
      return;
    }
    await this.setState({ loading: true });
    // TODO: 手机号 / 短信验证码 登录
    const expired = loginInfoService.getLoginExpired();
    const { data, errMsg } = await userService.userLogin({ username, password: loginInfoService.sjclPassword(password), expired });
    if (errMsg) {
      Modal.error({ title: '登录失败', content: '手机号/用户名 或密码错误' });
    } else {
      this.props.dispatch({ type: 'login/loginSucceed', payload: { ...data, search: this.props.search } });
    }
    await this.setState({ loading: false });
  }
  async showQrcode() {
    try {
      if (!global.WxLogin) {
        await getScript('//res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js');
      }
      return new global.WxLogin({
        id: this.state.qrcodeContainerId,
        appid: 'wx22ec3170662b11a5',
        scope: 'snsapi_login',
        redirect_uri: encodeURIComponent(window.location.href),
      });
    } catch (errMsg) {
      notification.error({ message: '加载二维码失败，请刷新页面重试' });
    }
  }
  changeLoginType() {
    const type = 'web_login' === this.state.type ? 'user_login' : 'web_login';
    this.setState({ type });
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
      <React.Fragment>
        <div className={`${styles.flex} ${styles.logo}`}>
          <div className={styles.hd}>
            <img alt="logo" src="//opensight-public.oss-cn-hangzhou.aliyuncs.com/img/logo40x40.png" />
          </div>
          <div className={styles.bd}>{'admin' === this.props.from ? '登录管理端' : '趣录播'}</div>
        </div>
        <Form onSubmit={this.onSubmit} className={`${'sms_login' !== this.state.type ? styles.hidden : ''}`}>
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
                    disabled={'success' !== this.state.validateStatus || 0 < this.state.countdown}
                  >
                    {0 < this.state.countdown ? `${this.state.countdown} 秒后重新获取` : '获取验证码'}
                  </Button>
                }
                placeholder="短信验证码"
              />,
            )}
          </Form.Item>
          <div>
            <Button type="primary" htmlType="submit" className={styles.loginBtn} loading={this.state.loading}>登录</Button>
            {'admin' !== this.props.from && <div>
              <span>没有账号？&nbsp;&nbsp;</span>
              <a onClick={this.changeLoginType}>使用微信登录</a>
              <span>&nbsp;或者&nbsp;</span>
              <Link to="/register">注册账户</Link>
            </div>}
          </div>
        </Form>
        <Form onSubmit={this.onUserLogin} className={`${'user_login' !== this.state.type ? styles.hidden : ''}`}>
          <Form.Item hasFeedback>
            {getFieldDecorator('username', {
              initialValue: getRememberedUsername(),
              rules: [{ required: true, message: '请填写 手机号/用户名' }],
            })(<Input prefix={<Icon type="user" />} placeholder="手机号/用户名" />)}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator('password', {
              // initialValue: password,
              rules: [{ required: true, message: '请填写密码' }],
            })(<Input prefix={<Icon type="lock" />} type="password" placeholder="密码" />)}
          </Form.Item>
          <div>
            <div className={styles.flex}>
              <div className={styles.bd}>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(<Checkbox>30天内记住我</Checkbox>)}
              </div>
              <div className={styles.ft}>
                {'admin' !== this.props.from && <Link to="/fotget">忘记密码</Link>}
              </div>
            </div>
            <Button type="primary" id="userLoginSubmit" htmlType="submit" className={styles.loginBtn} loading={this.state.loading}>登录</Button>
            {'admin' !== this.props.from && <div>
              <span>没有账号？&nbsp;&nbsp;</span>
              <a onClick={this.changeLoginType}>使用微信登录</a>
              <span>&nbsp;或者&nbsp;</span>
              <Link to="/register">注册账户</Link>
            </div>}
          </div>
        </Form>
        <Form className={`${'web_login' !== this.state.type ? styles.hidden : ''}`}>
          <Form.Item>
            <div id={this.state.qrcodeContainerId} className={styles.qrcodeContainer}>
              {this.state.code && <Loading />}
            </div>
          </Form.Item>
          {!this.state.code && <div>
            <a id="changeToUserLogin" onClick={this.changeLoginType}>使用&nbsp;手机号/用户名&nbsp;登录</a>
          </div>}
        </Form>
      </React.Fragment >
    );
  }
}


export default connect(state => state.login)(Form.create()(Login));
