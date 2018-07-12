import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modal, List, Badge, notification, Alert, Checkbox } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

import OssImg from '../OssImg';
import TextButton from '../TextButton';
import eventServer from '../../services/event';
import { eventStateDescription, duration, eventStateType } from '../../utils/filter';
import styles from './index.less';


class MutiSelectEventModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      loading: false,
      pageSize: 10,
      page: 1,
      total: undefined,
      confirmLoading: false,
      selected: [],
    };

    this.onOk = this.onOk.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.change = this.change.bind(this);
    this.clear = this.clear.bind(this);
  }
  componentDidMount() {
    this.load();
  }

  async onOk() {
    this.setState({ confirmLoading: true });
    const res = await this.props.onOk(this.state.selected);
    if (res) {
      this.setState({ confirmLoading: false, selected: [] });
      this.props.hide();
    } else {
      this.setState({ confirmLoading: false });
    }
  }
  onPageChange(page) {
    this.setState({ page });
    this.load();
  }
  async load() {
    this.setState({ loading: true, list: [] });
    const { data } = await eventServer.getEvents({
      projectName: this.props.projectName,
      // keyword,
      start: (this.state.page - 1) * this.state.pageSize,
      limit: this.state.pageSize,
      ...this.props.params,
    });
    this.setState({ loading: false, list: (data && data.list) || [], total: (data && data.total) || undefined });
  }
  change(e, item) {
    if (this.props.isDisabled(item.event_id) || 'INPUT' === e.target.tagName) {
      return;
    }
    const selected = this.state.selected.filter((it) => {
      return item.event_id !== it.event_id;
    });
    if (selected.length === this.state.selected.length) {
      if (this.state.selected.length >= this.props.max) {
        notification.warning({ message: `最多选择 ${this.props.max} 个课堂` });
      } else {
        this.setState({ selected: [...selected, item] });
      }
    } else {
      this.setState({ selected });
    }
  }
  isChecked(eventId) {
    return -1 !== this.state.selected.findIndex((it) => {
      return eventId === it.event_id;
    });
  }
  clear() {
    this.setState({ selected: [] });
  }

  render() {
    const {
      loading,
      list,
      page,
      pageSize,
      total,
      confirmLoading,
    } = this.state;
    return (
      <Modal
        visible={this.props.visible}
        width="80%"
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        title="选择课堂"
        confirmLoading={confirmLoading}
        onOk={this.onOk}
        onCancel={this.props.hide}
        keyboard={false}
        maskClosable={false}
      >
        <List
          size="small"
          className={styles.mutiSelectList}
          header={<Alert
            type="info"
            showIcon
            message={<React.Fragment>
              <span>已选择</span>
              <span className={styles.selectedNum}>&nbsp;{this.state.selected.length}&nbsp;</span>
              <span>项，最大选择&nbsp;{this.props.max}&nbsp;项&nbsp;&nbsp;</span>
              <TextButton onClick={this.clear}>清空</TextButton>
            </React.Fragment>}
          />}
          rowKey="event_id"
          loading={loading}
          pagination={{
            current: page,
            showQuickJumper: true,
            pageSize,
            total,
            showTotal: (t, range) => `${range[0]}-${range[1]} of ${t} items`,
            onChange: this.onPageChange,
          }}
          dataSource={list}
          renderItem={(item) => {
            const disabled = this.props.isDisabled(item.event_id);
            const checked = disabled || this.isChecked(item.event_id);
            return (<List.Item onClick={e => this.change(e, item)}>
              <Checkbox checked={checked} disabled={disabled} />
              <List.Item.Meta
                avatar={<OssImg alt={item.name} src={item.snapshot} action="/resize,m_fill,h_45,w_80" />}
                title={<Ellipsis lines={2} tooltip>{item.desc}</Ellipsis>}
                description={<Badge text={eventStateDescription(item.state)} status={eventStateType(item.state)} />}
              />
              <div className={styles.startTime}>
                <div>开始时间</div>
                <div className={styles.listItemValue}>{moment(item.start).format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
              <div className={styles.duration}>
                <div>时长</div>
                <div className={styles.listItemValue}>{duration(item.duration)}</div>
              </div>
            </List.Item>);
          }}
        />
      </Modal>
    );
  }
}

MutiSelectEventModal.propTypes = {
  visible: PropTypes.bool,
  // projectName: PropTypes.string,
  max: PropTypes.number,
  isDisabled: PropTypes.func,
  // onOk: PropTypes.func,
  hide: PropTypes.func,
};

export default MutiSelectEventModal;
