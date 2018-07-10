import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';

import { Modal, Badge, notification, Col, Row } from 'antd';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import OssImg from '../OssImg';
import MediaElement from '../MediaElement';
// import TextButton from '../TextButton';
import eventServer from '../../services/event';
import { notifyRequestError } from '../../utils';
import { eventStateType, eventStateDescription, duration } from '../../utils/filter';
import styles from './index.less';


class EventPlayModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      session: undefined,
      loading: false,
    };

    this.hide = this.hide.bind(this);
  }
  componentDidMount() {
    this.startPlay();
  }

  async startPlay() {
    this.setState({ loading: true, session: undefined });
    const { data, errMsg } = await eventServer.createVodSession({
      projectName: this.props.info.project_name,
      eventId: this.props.info.event_id,
    });
    if (errMsg) {
      const status = errMsg.response && errMsg.response.status;
      if (420 === status) {
        notification.error({ message: '录像正在转码，播放失败' });
      } else {
        notifyRequestError(errMsg, '播放录像失败');
      }
    }
    this.setState({ loading: false, session: data || null });
  }
  hide() {
    this.setState({ visible: false, session: undefined });
    this.props.hide();
  }

  render() {
    const { info } = this.props;
    const { loading, session, visible } = this.state;
    return (
      <Modal
        visible={visible}
        width="80%"
        // style={{ top: '10%' }}
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
        title={info.desc}
        onOk={this.hide}
        onCancel={this.hide}
        footer={null}
        keyboard={false}
        maskClosable={false}
        destroyOnClose
      >
        <Row gutter={16}>
          <Col sm={24} md={16} lg={18} xl={20} xll={20}>
            <div className={styles.container}>
              <OssImg alt={info.desc} src={info.snapshot} action="/resize,m_fill,h_720,w_1280" />
              {session && <MediaElement id={info.event_id} src={session.url} type="application/x-mpegURL" />}
              {loading && <div>loading</div>}
              {(!session) && (!loading) && <div>startPlay</div>}
            </div>
          </Col>
          <Col sm={24} md={8} lg={6} xl={4} xll={4}>
            <DescriptionList size="small" col="1">
              <DescriptionList.Description term="状态">{<Badge text={eventStateDescription(info.state)} status={eventStateType(info.state)} />}</DescriptionList.Description>
              <DescriptionList.Description term="时间">{moment(info.start).format('YYYY-MM-DD HH:mm:ss')}</DescriptionList.Description>
              <DescriptionList.Description term="时长">{duration(info.duration)}</DescriptionList.Description>
              <DescriptionList.Description term="大小">{numeral(info.size).format('0.0 b')}</DescriptionList.Description>
            </DescriptionList>
          </Col>
        </Row>
      </Modal>
    );
  }
}

EventPlayModal.propTypes = {
  info: PropTypes.object,
  // onOk: PropTypes.func,
  hide: PropTypes.func,
};

export default EventPlayModal;
