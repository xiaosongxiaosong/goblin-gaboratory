import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import { Card, List, Badge, Button, Icon, Popconfirm, notification } from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import OssImg from '../../../components/OssImg';
import TextButton from '../../../components/TextButton';
import MutiSelectShowModal from '../../../components/MutiSelectShowModal';
import showServer from '../../../services/show';
import { notifyRequestError } from '../../../utils';
import { showState, showPublic, showStateType } from '../../../utils/filter';
import styles from './Shows.less';


class Shows extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      loading: false,
      modal: false,
      modalVisible: true,
      selected: [],
    };

    this.remove = this.remove.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.add = this.add.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
  }
  componentDidMount() {
    this.load();
  }
  async load() {
    this.setState({ loading: true, list: [] });
    const { data } = await showServer.getShowsByEvent({
      projectName: this.props.match.params.name,
      eventId: this.props.match.params.eventId,
    });
    this.setState({ loading: false, list: data || [] });
  }
  async remove(item) {
    const { errMsg } = await showServer.removeShowRecord({
      projectName: this.props.match.params.name,
      showId: item.live_show_uuid,
      eventId: this.props.match.params.eventId,
    });
    if (errMsg) {
      notifyRequestError(errMsg, '删除关联失败');
    } else {
      notification.success({ message: '删除关联成功' });
      const list = this.state.list.filter(it => it.live_show_uuid !== item.live_show_uuid);
      this.setState({ list });
    }
  }
  async add(selected) {
    if (!selected || 0 === selected.length) {
      notification.error({ message: '请选择课堂' });
      return false;
    }
    const { errMsg } = await showServer.addShowRecords({
      projectName: this.props.match.params.name,
      showId: selected[0],
      events: [this.props.match.params.eventId],
    });
    if (errMsg) {
      const status = errMsg.response && errMsg.response.status;
      if (410 === status) {
        notification.success({ message: '添加课堂成功' });
        this.load();
        return true;
      } else if (431 === status) {
        notification.success({ message: '课堂录像数超出限制，添加课堂失败' });
      } else {
        notifyRequestError(errMsg, '添加课堂失败');
      }
      return false;
    } else {
      notification.success({ message: '添加课堂成功' });
      this.load();
      return true;
    }
  }
  showModal() {
    if (this.state.modal) {
      this.setState({ modalVisible: true });
    } else {
      this.setState({ modal: true, modalVisible: true });
    }
  }
  hideModal() {
    this.setState({ modalVisible: false });
  }
  isDisabled(showId) {
    return -1 !== this.state.list.findIndex((it) => {
      return showId === it.live_show_uuid;
    });
  }

  render() {
    return (<Card
      bordered={false}
      extra={<Button type="primary" onClick={this.showModal} disabled={this.state.loading}><Icon type="plus" />&nbsp;添加</Button>}
    >
      <List
        size="large"
        rowKey="live_show_uuid"
        loading={this.state.loading}
        pagination={false}
        dataSource={this.state.list}
        renderItem={item => (
          <List.Item
            actions={[
              <Link to={`/p/${item.live_show.project_name}/shows/${item.live_show_uuid}/`}>详情</Link>,
              // <a>删除</a>
              <Popconfirm placement="topLeft" title="确认取消课堂与录像的关联吗？" onConfirm={() => this.remove(item)} okText="确定" cancelText="取消">
                <TextButton>删除</TextButton>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={<OssImg alt={item.live_show.name} src={item.live_show.cover_url} action="/resize,m_fill,h_45,w_80" />}
              title={<Ellipsis lines={2} tooltip>{item.live_show.name}</Ellipsis>}
              description={<Badge text={`直播${showState(item.live_show.state)}`} status={showStateType(item.live_show.state)} />}
            />
            <div className={styles.isPublic}>
              <div>发布方式</div>
              <div className={styles.listItemValue}>{showPublic(item.live_show.is_public)}</div>
            </div>
            <div className={styles.showTime}>
              <div>最近上课时间</div>
              <div className={styles.listItemValue}>{moment(item.live_show.start).format('YYYY-MM-DD HH:mm:ss')}</div>
            </div>
          </List.Item>
        )}
      />
      {this.state.modal && <MutiSelectShowModal
        visible={this.state.modalVisible}
        projectName={this.props.match.params.name}
        max={1}
        isDisabled={this.isDisabled}
        onOk={this.add}
        hide={this.hideModal}
      />}
    </Card>);
  }
}


Shows.propTypes = {
  // projectName: PropTypes.string,
  // info: PropTypes.object,
  // dispatch: PropTypes.func,
};

// export default Show;
export default connect(state => ({
  // projectName: state.client.selected,
  info: state.events.info,
}))(Shows);
