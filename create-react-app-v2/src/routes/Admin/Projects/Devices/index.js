import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import UA from 'ua-device';
// import numeral from 'numeral';
import moment from 'moment';
// antd & ant-design-pro 组件
// import { Table, notification, List, Popconfirm, Card, Badge } from 'antd';
import { Table, notification, Card, Button, Modal, Form, Input, Select, Divider, Popconfirm } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
// import { MiniProgress } from 'ant-design-pro/lib/Charts';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import NumberInfo from 'ant-design-pro/lib/NumberInfo';
// 业务组件
// import FilterForm from '../../../components/FilterForm';
// import PageBody from '../../../components/PageBody';
// import OssImg from '../../../components/OssImg';
// severs
import projectServer from '../../../../services/project';
// filter
import { cameraOnlineState, userRole } from '../../../../utils/filter';
import { notifyRequestError } from '../../../../utils';
// import { eventStateType } from './common';
// import StorageQuota from './StorageQuota';
import styles from './index.less';


const AddUserForm = Form.create()(({
  confirmLoading,
  form,
  onOk,
  onCancel,
}) => {
  const onSubmit = () => {
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        onOk(values);
      }
    });
  };
  return (
    <Modal
      title="增加用户"
      visible
      destroyOnClose
      onOk={onSubmit}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <Form onSubmit={e => e.preventDefault()}>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
          {form.getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(<Input placeholder="请输入用户名" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
          {form.getFieldDecorator('role', {
            initialValue: 0,
            // rules: [{ required: true, message: '请输入 用户名/手机号' }],
          })(<Select>{[0, 1, 2, 3].map(it => <Select.Option key={it} value={it}>{userRole(it)}</Select.Option>)}</Select>)}
        </Form.Item>
      </Form>
    </Modal>
  );
});

const UpdateUserRoleForm = Form.create()(({
  info,
  confirmLoading,
  form,
  onOk,
  onCancel,
}) => {
  const onSubmit = () => {
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        onOk({ ...values, username: info.username });
      }
    });
  };
  return (
    <Modal
      title="修改角色"
      visible
      destroyOnClose
      onOk={onSubmit}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <Form onSubmit={e => e.preventDefault()}>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
          {form.getFieldDecorator('username', {
            initialValue: info.username,
          })(<Input readOnly />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="昵称">
          {form.getFieldDecorator('title', {
            initialValue: info.title,
          })(<Input readOnly />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
          {form.getFieldDecorator('role', {
            initialValue: info.role,
            // rules: [{ required: true, message: '请输入 用户名/手机号' }],
          })(<Select>{[0, 1, 2, 3].map(it => <Select.Option key={it} value={it}>{userRole(it)}</Select.Option>)}</Select>)}
        </Form.Item>
      </Form>
    </Modal>
  );
});

class Devices extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      adding: false,
      info: false,
      saving: false,
    };

    this.onSearch = this.onSearch.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.handleModal = this.handleModal.bind(this);
    // this.addProjectUser = this.addProjectUser.bind(this);
    this.removeProjectUser = this.removeProjectUser.bind(this);
    this.handleRoleModal = this.handleRoleModal.bind(this);
  }
  onSearch(values) {
    const search = values.filterKey && values.filterValue ? { k: values.filterKey, v: values.filterValue } : {};
    this.props.dispatch(routerRedux.push({
      pathname: this.props.location.pathname,
      search: queryString.stringify(search),
    }));
  }
  onRefresh() {
    this.props.dispatch(routerRedux.push({
      pathname: this.props.location.pathname,
      search: this.props.location.search,
    }));
  }
  onPageChange(page) {
    const parsed = queryString.parse(this.props.location.search);
    this.props.dispatch(routerRedux.push({
      pathname: this.props.location.pathname,
      search: queryString.stringify({ ...parsed, page: (1 === page ? undefined : page) }),
    }));
  }
  handleModal(modal) {
    this.setState({ modal });
  }
  // eslint-disable-next-line
  async addProjectUser(values) {
    this.setState({ adding: true });
    const { errMsg } = await projectServer.addProjectUser({
      projectName: this.props.match.params.projectName,
      ...values,
    });
    this.setState({ adding: false });
    if (errMsg) {
      notifyRequestError(errMsg, '添加失败');
    } else {
      this.handleModal(false);
      notification.success({ message: '添加成功' });
      this.onRefresh();
    }
  }
  async removeProjectUser(item) {
    const { errMsg } = await projectServer.removeProjectUser({
      projectName: this.props.match.params.projectName,
      username: item.username,
    });
    if (errMsg) {
      notifyRequestError(errMsg, '删除失败');
    } else {
      notification.success({ message: '删除成功' });
      this.onRefresh();
    }
  }
  handleRoleModal(item) {
    this.setState({ info: item });
  }
  async updateUserRole(values) {
    this.setState({ saving: true });
    const { errMsg } = await projectServer.updateProjectUserRole({
      projectName: this.props.match.params.projectName,
      ...values,
    });
    this.setState({ saving: false });
    if (errMsg) {
      notifyRequestError(errMsg, '修改失败');
    } else {
      this.handleRoleModal(false);
      notification.success({ message: '修改成功' });
      this.props.dispatch({ type: 'project-users/save', payload: { roles: undefined } });
      this.onRefresh();
    }
  }
  render() {
    const {
      page,
      pageSize,
      loading,
      total,
      list,
      // match,
    } = this.props;
    return (
      <Card bordered={false}>
        <div className={styles.tableListOperator}>
          <Button icon="plus" onClick={() => this.handleModal(true)}>增加</Button>
        </div>
        <Table
          size="large"
          rowKey="uuid"
          loading={loading}
          pagination={{
            current: page,
            showQuickJumper: true,
            pageSize,
            total,
            showTotal: t => `共 ${t} 项`,
            onChange: this.onPageChange,
          }}
          dataSource={list}
          columns={[{
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '设备类型',
            dataIndex: 'type',
            key: 'type',
          }, {
            title: '状态',
            key: 'is_online',
            render: (text, record) => <React.Fragment>{cameraOnlineState(record.is_online)}</React.Fragment>,
          }, {
            title: '最后心跳时间',
            // dataIndex: 'ctime',
            key: 'ltime',
            render: (text, record) => <React.Fragment>{moment(record.ltime).format('YYYY-MM-DD HH:mm:ss')}</React.Fragment>,
          }, {
            title: '厂家',
            dataIndex: 'vendor',
            key: 'vendor',
          }, {
            title: '操作',
            key: 'action',
            render: (text, record) => <React.Fragment>
              {/* <Link to={`/projects/${match.params.projectName}/users/${record.username}`}>详细</Link> */}
              <a onClick={() => this.handleRoleModal(record)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm placement="topRight" title="确认删除用户？" onConfirm={() => this.removeProjectUser(record)}>
                <a>删除</a>
              </Popconfirm>
            </React.Fragment>,
          }]}
          expandedRowRender={(record) => {
            const ua = record.register_user_agent && new UA(record.register_user_agent);
            return (<React.Fragment>
              <DescriptionList size="large" layout="vertical" col={1} className={styles.descriptionList}>
                <DescriptionList.Description term="用户来源">{record.register_referer || '未知'}</DescriptionList.Description>
                <DescriptionList.Description term="用户代理">{record.register_user_agent || '未知'}</DescriptionList.Description>
              </DescriptionList>
              {ua && <DescriptionList size="large" layout="vertical" col={4} className={styles.descriptionList}>
                <DescriptionList.Description term="设备类型">{ua.device.type}</DescriptionList.Description>
                <DescriptionList.Description term="操作系统">{ua.os.name}</DescriptionList.Description>
                <DescriptionList.Description term="浏览器">{ua.browser.name}&nbsp;{ua.browser.version.original}</DescriptionList.Description>
                <DescriptionList.Description term="内核">{ua.engine.name}</DescriptionList.Description>
              </DescriptionList>}
            </React.Fragment>);
          }}
        />
        {this.state.modal && <AddUserForm
          confirmLoading={this.state.adding}
          onOk={values => this.addProjectUser(values)}
          onCancel={() => this.handleModal(false)}
        />}
        {this.state.info && <UpdateUserRoleForm
          info={this.state.info}
          confirmLoading={this.state.saving}
          onOk={values => this.updateUserRole(values)}
          onCancel={() => this.handleRoleModal(false)}
        />}
      </Card>
    );
  }
}

Devices.propTypes = {
  page: PropTypes.number,
  pageSize: PropTypes.number,
  loading: PropTypes.bool,
  list: PropTypes.array,
  total: PropTypes.number,
};

export default connect(state => ({
  page: state['project-devices'].page,
  pageSize: state['project-devices'].pageSize,
  loading: state['project-devices'].loading,
  list: state['project-devices'].list,
  total: state['project-devices'].total,
}))(Devices);
