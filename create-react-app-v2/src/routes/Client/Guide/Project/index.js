import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Button, notification } from 'antd';
import userServer from '../../../../services/user';
import projectServer from '../../../../services/project';
import styles from './index.less';


class Project extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.createProject(values);
      }
    });
  }
  async createProject(values) {
    const { data, err } = await userServer.createProject({
      username: this.props.userInfo.username,
      ...values,
    });
    if (err) {
      return notification.error({ message: '创建商户失败', description: '' });
    }
    if (data) {
      await projectServer.addVirtualCamera({ projectName: data.name, name: '默认视频源' });
    }
    this.props.dispatch({ type: 'client/jump2guideFinish', payload: data });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSubmit} className={styles.form}>
        <Form.Item label="商户名称">
          {getFieldDecorator('title', {
            rules: [{
              required: true, message: '请输入商户名称！',
            }],
          })(
            <Input placeholder="商户名称" />,
          )}
        </Form.Item>
        <Form.Item label="商户地址">
          {getFieldDecorator('desc', {})(
            <Input placeholder="商户地址" />,
          )}
        </Form.Item>
        <Form.Item label="商户描述">
          {getFieldDecorator('longDesc', {})(
            <Input.TextArea placeholder="商户描述" autosize={{ minRows: 3 }} />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.blockBtn}>创建商户</Button>
        </Form.Item>
      </Form>
    );
  }
}

Project.propTypes = {
  dispatch: PropTypes.func,
};
const WrappedProject = Form.create()(Project);
// export default WrappedUser;
export default connect(state => ({
  userInfo: state.client.userInfo,
}))(WrappedProject);

