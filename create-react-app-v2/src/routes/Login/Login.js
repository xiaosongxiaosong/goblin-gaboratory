import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Form, Input, Icon, Checkbox } from 'antd';
// import { config } from '../../utils';
import TextButton from '../../components/TextButton';
import styles from './index.less';
// import { Loadmore } from '../../components'


const FormItem = Form.Item;

const getSubmitHandle = (dispatch, validateFieldsAndScroll) => {
  return (e) => {
    e.preventDefault();
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'login/userLogin', payload: values });
    });
  };
};

const getSwitchHandle = (dispatch, loginType) => {
  return () => {
    dispatch({ type: 'login/saveLoginType', payload: loginType });
  };
};

const Login = ({
  login,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  // debugger;
  const { logging, loginType, userInfo, qrcodeContainerId } = login;
  const { username, password } = userInfo || { username: '', password: '' };


  const handleOk = getSubmitHandle(dispatch, validateFieldsAndScroll);
  const switch2UserLogin = getSwitchHandle(dispatch, 'user_login');
  const switch2WebLogin = getSwitchHandle(dispatch, 'web_login');

  return (
    <div className={styles.form}>
      <div className={`${styles.flex} ${styles.logo}`}>
        <div className={styles.hd}>
          <img alt="logo" src="//opensight-public.oss-cn-hangzhou.aliyuncs.com/img/logo40x40.png" />
        </div>
        <div className={styles.bd}>趣录播</div>
      </div>
      <Form onSubmit={handleOk} className={`${'user_login' !== loginType ? styles.hidden : ''}`}>
        <FormItem hasFeedback>
          {getFieldDecorator('username', {
            initialValue: username,
            rules: [
              {
                required: true,
                message: '请填写 手机号/用户名',
              },
            ],
          })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} size="large" placeholder="手机号/用户名" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            initialValue: password,
            rules: [
              {
                required: true,
                message: '请填写密码',
              },
            ],
          })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} size="large" type="password" placeholder="密码" />)}
        </FormItem>
        <FormItem>
          <div className={styles.flex}>
            <div className={styles.bd}>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>30天内记住我</Checkbox>,
              )}
            </div>
            <div className={styles.ft}>
              <Link to="/fotget">忘记密码</Link>
            </div>
          </div>
          <Button type="primary" htmlType="submit" className={styles.loginBtn} loading={logging}>登录</Button>
          <span>没有账号？&nbsp;&nbsp;</span>
          <TextButton onClick={switch2WebLogin}>
            <span>使用微信登录</span>
          </TextButton>
          <span>&nbsp;或者&nbsp;</span>
          <Link to="/register">注册账户</Link>
        </FormItem>
      </Form>
      <Form className={`${'web_login' !== loginType ? styles.hidden : ''}`}>
        <FormItem><div id={qrcodeContainerId} className={styles.qrcodeContainer} /></FormItem>
        <FormItem>
          <span>趣录播内部用户？&nbsp;&nbsp;</span>
          {/* <a href="">使用手机号/用户名登录</a> */}
          <TextButton onClick={switch2UserLogin}>
            <span>使用&nbsp;手机号/用户名&nbsp;登录</span>
          </TextButton>
        </FormItem>
      </Form>
    </div>
  );
};

// function mapStateToProps(state) {
//   return { ...state.app };
// }

// export default connect(mapStateToProps)(Login);
export default connect(({ login }) => ({ login }))(Form.create()(Login));
