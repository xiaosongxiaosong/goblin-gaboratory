import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modal, List, Badge, notification, Alert, Checkbox } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

import OssImg from '../OssImg';
import TextButton from '../TextButton';
import showServer from '../../services/show';
import { showState, showPublic, showStateType } from '../../utils/filter';
import styles from './index.less';


class MutiSelectShowModal extends React.PureComponent {
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
    }
  }
  onPageChange(page) {
    this.setState({ page });
    this.load();
  }
  async load() {
    this.setState({ loading: true, list: [] });
    const { data } = await showServer.getShows({
      projectName: this.props.projectName,
      start: (this.state.page - 1) * this.state.pageSize,
      limit: this.state.pageSize,
    });
    this.setState({ loading: false, list: (data && data.list) || [], total: (data && data.total) || undefined });
  }
  change(item) {
    if (this.props.isDisabled(item.uuid)) {
      return;
    }
    const selected = this.state.selected.filter((it) => {
      return item.uuid !== it;
    });
    if (selected.length === this.state.selected.length) {
      if (this.state.selected.length >= this.props.max) {
        notification.warning({ message: `最多选择 ${this.props.max} 个课堂` });
      } else {
        this.setState({ selected: [...selected, item.uuid] });
      }
    } else {
      this.setState({ selected });
    }
  }
  isChecked(showId) {
    return -1 !== this.state.selected.findIndex((it) => {
      return showId === it;
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
          rowKey="uuid"
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
            const disabled = this.props.isDisabled(item.uuid);
            const checked = disabled || this.isChecked(item.uuid);
            return (<List.Item onClick={() => this.change(item)}>
              <Checkbox checked={checked} disabled={disabled} />
              <List.Item.Meta
                avatar={<OssImg alt={item.name} src={item.cover_url} action="/resize,m_fill,h_45,w_80" />}
                title={<Ellipsis lines={2} tooltip>{item.name}</Ellipsis>}
                description={<Badge text={`直播${showState(item.state)}`} status={showStateType(item.state)} />}
              />
              <div className={styles.isPublic}>
                <div>发布方式</div>
                <div className={styles.listItemValue}>{showPublic(item.is_public)}</div>
              </div>
              <div className={styles.showTime}>
                <div>最近上课时间</div>
                <div className={styles.listItemValue}>{moment(item.start).format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
            </List.Item>);
          }}
        />
      </Modal>
    );
  }
}

MutiSelectShowModal.propTypes = {
  visible: PropTypes.bool,
  projectName: PropTypes.string,
  max: PropTypes.number,
  isDisabled: PropTypes.func,
  // onOk: PropTypes.func,
  hide: PropTypes.func,
};

export default MutiSelectShowModal;
