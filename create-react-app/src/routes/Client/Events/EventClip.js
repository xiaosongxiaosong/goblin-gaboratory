import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Input, List, Button, Badge, notification, Dropdown, Menu, Icon, Popconfirm } from 'antd';

import PageHeader from 'ant-design-pro/lib/PageHeader';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// 业务组件
import OssImg from '../../../components/OssImg';
import PageBody from '../../../components/PageBody';
import MutiSelectEventModal from '../../../components/MutiSelectEventModal';

import eventServer from '../../../services/event';
import { eventStateDescription, duration, eventStateType } from '../../../utils/filter';
import { notifyRequestError } from '../../../utils';

import EventClipModal from './EventClipModal';

import styles from './EventClip.less';


class EventClip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      selectModal: false,
      selectModalVisible: false,
      info: undefined,
      loading: false,
    };
    this.index = 0;

    this.onSubmit = this.onSubmit.bind(this);
    // 选择录像
    this.showSelectModal = this.showSelectModal.bind(this);
    this.hideSelectModal = this.hideSelectModal.bind(this);
    this.addSegments = this.addSegments.bind(this);

    // 剪切录像
    this.showClipModal = this.showClipModal.bind(this);
    this.hideClipModal = this.hideClipModal.bind(this);
    this.modifySegment = this.modifySegment.bind(this);
    // this.onRefresh = this.onRefresh.bind(this);
    // this.onPageChange = this.onPageChange.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      if (0 === this.state.list.length) {
        notification.error({ message: '请选择录像' });
        return;
      }
      this.save(values);
    });
  }
  getKey() {
    const index = this.index;
    this.index += 1;
    return index;
  }
  async save(values) {
    this.setState({ loading: true });
    const segments = this.state.list.map((it) => {
      return { event_id: it.event_id, start: it.clip_start, end: it.clip_end };
    });
    const { errMsg } = await eventServer.mergeEvents({
      projectName: this.props.match.params.name,
      ...values,
      segments,
    });
    if (errMsg) {
      notifyRequestError(errMsg, '视频剪辑失败');
    } else {
      notification.success({ message: '视频剪辑成功' });
    }
    this.setState({ loading: false });
    window.history.back();
  }
  showSelectModal() {
    if (this.state.selectModal) {
      this.setState({ selectModalVisible: true });
    } else {
      this.setState({ selectModal: true, selectModalVisible: true });
    }
  }
  hideSelectModal() {
    this.setState({ selectModalVisible: false });
  }
  addSegments(selected) {
    if (!selected || 0 === selected.length) {
      notification.error({ message: '请选择录像' });
      return false;
    }
    const list = selected.map((it) => {
      return { ...it, clip_start: 0, clip_end: it.duration, key: this.getKey() };
    });
    this.setState({ list: [...this.state.list, ...list] });
    this.showClipModal(list[list.length - 1]);
    return true;
  }
  showClipModal(info) {
    // debugger;
    this.setState({ info });
  }
  hideClipModal() {
    this.setState({ info: undefined });
  }
  modifySegment(segment) {
    const list = this.state.list.map((item) => {
      if (item.key === segment.key) {
        return { ...item, ...segment };
      } else {
        return item;
      }
    });
    this.setState({ list });
    return true;
  }
  remove(segment) {
    const list = [...this.state.list];
    const index = list.findIndex(item => item.key === segment.key);
    if (-1 !== index) {
      list.splice(index, 1);
      this.setState({ list });
    }
  }
  swap(x, y) {
    const list = [...this.state.list];
    list[x] = list.splice(y, 1, list[x])[0];
    this.setState({ list });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 6 },
        lg: { span: 4 },
        xl: { span: 3 },
        xxl: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 18 },
        lg: { span: 20 },
        xl: { span: 21 },
        xxl: { span: 22 },
      },
    };
    return (
      <Form onSubmit={this.onSubmit}>
        <PageHeader title="录像剪辑" breadcrumbList={[{ title: null }]} />
        <PageBody>
          <Card bordered={false} className={styles.card}>
            <Form.Item label="录像名称" {...formItemLayout}>
              {getFieldDecorator('desc', {
                initialValue: '',
                rules: [{
                  required: true, message: '请输入录像名称！',
                }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="详细描述" {...formItemLayout}>
              {getFieldDecorator('long_desc', { initialValue: '' })(<Input.TextArea rows={5} />)}
            </Form.Item>
            {/* <Divider />
            <Table dataSource={this.state.list} columns={columns} />
            <Divider /> */}
          </Card>
          <Card bordered={false} className={styles.card}>
            <List
              size="small"
              header="录像片段"
              footer={<Button
                style={{ width: '100%' }}
                type="dashed"
                onClick={this.showSelectModal}
                icon="plus"
              >添加录像</Button>}
              rowKey="key"
              // loading={loading}
              pagination={false}
              dataSource={this.state.list}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <span>{0 === index ? '上移' : <a onClick={() => this.swap(index - 1, index)}>上移</a>}</span>,
                    <span>{(this.state.list.length - 1) === index ? '下移' : <a onClick={() => this.swap(index, index + 1)}>下移</a>}</span>,
                    // <a>上移</a>,
                    // <a>下移</a>,
                    <Dropdown
                      overlay={<Menu>
                        <Menu.Item key="edit">
                          <a onClick={() => this.showClipModal(item)}><Icon type="form" />&nbsp;编辑</a>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item key="delete">
                          <Popconfirm placement="topLeft" title="确认删除该录像？" onConfirm={() => this.remove(item)} okText="确定" cancelText="取消">
                            <Icon type="delete" />&nbsp;删除
                          </Popconfirm>
                        </Menu.Item>
                      </Menu>} trigger={['click']}
                    >
                      <a className="ant-dropdown-link">更多&nbsp;<Icon type="down" /></a>
                    </Dropdown>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<OssImg alt={item.snapshot} src={item.snapshot} action="/resize,m_fill,h_45,w_80" />}
                    title={<Ellipsis lines={2} tooltip>
                      <a onClick={() => this.showClipModal(item)}>{item.desc}</a>
                    </Ellipsis>}
                    description={<Badge text={eventStateDescription(item.state)} status={eventStateType(item.state)} />}
                  />
                  <div className={styles.duration}>
                    <div>原始长度</div>
                    <div className={styles.listItemValue}>{duration(item.duration)}</div>
                  </div>
                  <div className={styles.duration}>
                    <div>开始位置</div>
                    <div className={styles.listItemValue}>{moment(item.clip_start + (16 * 60 * 60 * 1000)).format('HH:mm:ss')}</div>
                  </div>
                  <div className={styles.duration}>
                    <div>结束位置</div>
                    <div className={styles.listItemValue}>{moment(item.clip_end + (16 * 60 * 60 * 1000)).format('HH:mm:ss')}</div>
                  </div>
                  <div className={styles.duration}>
                    <div>截取长度</div>
                    <div className={styles.listItemValue}>{duration(item.clip_end - item.clip_start)}</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
          <FooterToolbar>
            <Button type="primary" htmlType="submit">保存</Button>
          </FooterToolbar>
        </PageBody>
        {this.state.selectModal && <MutiSelectEventModal
          visible={this.state.selectModalVisible}
          projectName={this.props.match.params.name}
          max={1}
          params={{ state: 1 }}
          isDisabled={() => false}
          onOk={this.addSegments}
          hide={this.hideSelectModal}
        />}
        {this.state.info && <EventClipModal
          info={this.state.info}
          onOk={this.modifySegment}
          hide={this.hideClipModal}
        />}
      </Form>
    );
  }
}


EventClip.propTypes = {
  // projectName: PropTypes.string,
  // info: PropTypes.object,
  // dispatch: PropTypes.func,
};

// export default Show;
// export default connect(state => ({
//   projectName: state.client.selected,
//   info: state.events.info,
// }))(EventClip);
// const WrappedEventInfo = Form.create()(EventInfo);
export default Form.create()(EventClip);
