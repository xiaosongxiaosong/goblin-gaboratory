import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import { Link, Switch, Redirect, Route } from 'dva/router';
import { Button, Dropdown, Icon, Menu, Row, Col, Tag, Modal, notification, DatePicker, Form } from 'antd';
import Exception from 'ant-design-pro/lib/Exception';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Loading from '../../Loading';
import OssImg from '../../../components/OssImg';
// import Description from '../../../components/Description';
import { getClientShowRoutes, getClientShowTabs } from '../../../common/client';
import showServer from '../../../services/show';
import { showState, showPublic } from '../../../utils/filter';
import { notifyRequestError } from '../../../utils';
import styles from './Show.less';
// import { gutter } from '../common';


const HeaderContent = ({
  info,
  tags,
}) => {
  return (
    <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
      <Col sm={24} md={12} lg={10} xl={8} xll={6}>
        <OssImg alt={info.name} src={info.cover_url} />
      </Col>
      <Col sm={24} md={12} lg={14} xl={16} xll={18}>
        <DescriptionList size="small" col="1">
          <DescriptionList.Description term="发布方式">{showPublic(info.is_public)}</DescriptionList.Description>
          <DescriptionList.Description term="最近上课时间">{moment(info.start).format('YYYY-MM-DD HH:mm:ss')}</DescriptionList.Description>
        </DescriptionList>
        <div className={styles.tags}>
          <Ellipsis lines={2}>
            {tags && tags.map((it) => {
              return <Tag key={it}>{it}</Tag>;
            })}
          </Ellipsis>
        </div>
      </Col>
    </Row>
  );
};

const getTabActiveKey = (location) => {
  const match = location.pathname.match(/^\/p\/[^/]+\/shows\/[^/]+\/([^/-]+)/);
  if (match) {
    return match[1];
  }
  return 'basic';
};

class Show extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      start: undefined,
      guideModal: undefined,
    };

    this.onMenuClick = this.onMenuClick.bind(this);
    this.onStartChange = this.onStartChange.bind(this);
  }
  componentWillUnmount() {
    if (this.confirmHandle) {
      this.confirmHandle.destory();
    }
    this.confirmHandle = undefined;
  }
  onMenuClick({ key }) {
    switch (key) {
      case 'cancel':
        return this.changeState('reset', '取消直播预告');
      case 'pause':
        return this.changeState('pause', '继续直播');
      case 'stop':
        return this.changeState('stop', '停止直播');
      case 'notice':
        return this.showNoticeModal();
      default:
        return key;
    }
  }
  onStartChange(start) {
    this.setState({ start });
  }
  async start() {
    const data = await this.changeState('start', '开始直播');
    if (data && 2 === data.state) {
      this.showGuideModal();
    }
  }
  showNoticeModal() {
    const now = new Date().getTime();
    if (this.props.info.start < now) {
      this.setState({ start: moment(now + (2 * 60 * 60 * 1000)) });
    } else {
      this.setState({ start: moment(this.props.info.start) });
    }
  }
  hideNoticeModal() {
    this.setState({ start: undefined });
  }
  async notice() {
    const start = this.state.start.valueOf();
    if (start <= new Date().getTime()) {
      notification.error({ message: '预告时间太早' });
      return;
    }
    this.hideNoticeModal();
    try {
      const title = '预告直播';
      await this.updateShowInfo(start, title);
      const info = await this.changeShowState('reset', title);
      return info;
    } catch (error) {
      // debugger;
    }
  }
  async changeState(op, title) {
    try {
      await this.confirm({ title, content: `确认要 ${title} 吗？` });
      const info = await this.changeShowState(op, title);
      return info;
    } catch (error) {
      // debugger;
      return error;
    }
  }
  confirm({ title, content }) {
    if (this.confirmHandle) {
      this.confirmHandle.destory();
    }
    return new Promise((reslove, reject) => {
      this.confirmHandle = Modal.confirm({
        title,
        content,
        onOk: () => {
          this.confirmHandle = undefined;
          reslove(true);
        },
        onCancel: () => {
          this.confirmHandle = undefined;
          reject(false);
        },
      });
    });
  }
  async changeShowState(op, title) {
    const { data, errMsg } = await showServer.changeShowState({
      projectName: this.props.info.project_name,
      showId: this.props.info.uuid,
      op,
    });
    return new Promise((reslove, reject) => {
      if (errMsg) {
        const status = errMsg.response && errMsg.response.status;
        if (470 === status) {
          notification.error({ message: `${title}失败，视频设备正在直播` });
        } else if (474 === status) {
          // notification.error({ message: `${title}失败` });
          // debugger;
          this.showGuideModal();
        } else {
          notifyRequestError(errMsg, `${title}失败`);
        }
        // debugger;
        reject(errMsg);
      } else {
        this.props.dispatch({ type: 'shows/save', payload: { info: data } });
        notification.success({ message: `${title}成功` });
        reslove(data);
      }
    });
  }
  async updateShowInfo(start, title) {
    const { data, errMsg } = await showServer.updateShowInfo({
      projectName: this.props.info.project_name,
      showId: this.props.info.uuid,
      start,
    });
    return new Promise((reslove, reject) => {
      if (errMsg) {
        notifyRequestError(errMsg, `${title}失败`);
        reject(errMsg);
      } else {
        this.props.dispatch({ type: 'shows/save', payload: { info: { start, ...this.props.info } } });
        reslove(data);
      }
    });
  }
  showGuideModal() {
    // debugger;
    this.hideGuideModal();
    const content = this.props.info.camera_uuid ?
      (<div>
        <div>设备不在线，请检查设备工作状态及其网络连接。</div>
        <div>
          <a onClick={() => this.showCameraInfo()}>查看设备状态</a>
        </div>
      </div>)
      :
      (<div>
        <div>请使用手机或者电脑向平台推送实时视频，或者将课堂推流地址配置到第三方软硬件。</div>
        <div>您可以选择：</div>
        <div className={styles.guideBtns}>
          <Button onClick={() => this.showPusherCodeModal()} type="primary">手机直播（推荐）</Button>
          <Button onClick={() => this.showOBSGuideModal()}>电脑直播</Button>
          <Button onClick={() => this.showPushUrlModal()}>查看推流地址</Button>
        </div>
      </div>);
    const guideModal = Modal.warning({
      title: '直播已暂停',
      content,
    });
    this.setState({ guideModal });
  }
  async hideGuideModal() {
    if (this.state.guideModal) {
      this.state.guideModal.destroy();
      await this.setState({ guideModal: undefined });
    }
  }
  // eslint-disable-next-line
  showPusherCodeModal() {
    this.hideGuideModal();
  }
  // eslint-disable-next-line
  showOBSGuideModal() {
    this.hideGuideModal();
  }
  // eslint-disable-next-line
  showPushUrlModal() {
    this.hideGuideModal();
  }
  showCameraInfo() {
    this.hideGuideModal();
  }
  render() {
    const { app, match, info, tags, statistic, location } = this.props;
    if (undefined === info || undefined === tags || undefined === statistic) {
      return <Loading />;
    } else if (null === info) {
      return (<Exception
        type="404"
        title="获取课堂信息失败"
        desc=""
        actions={[<Link to={`/p/${match.params.name}/shows`}>查看所有课堂</Link>]}
      />);
    }
    return (
      <React.Fragment>
        <PageHeader
          title={info.name}
          action={
            <div>
              {(0 === info.state || 3 === info.state) && <Button type="primary" onClick={() => this.start()}>开始直播</Button>}
              {1 === info.state && <Button type="danger" onClick={() => this.changeState('stop', '停止直播')}>停止直播</Button>}
              {2 === info.state && <Button type="primary" onClick={() => this.changeState('resume', '继续直播')}>继续直播</Button>}
              <Button><Icon type="eye" />&nbsp;观看</Button>
              <Button><Icon type="edit" />&nbsp;编辑</Button>
              <Dropdown
                overlay={
                  <Menu onClick={this.onMenuClick}>
                    {0 === info.state && <Menu.Item key="cancel">取消预告</Menu.Item>}
                    {1 === info.state && <Menu.Item key="pause">暂停直播</Menu.Item>}
                    {2 === info.state && <Menu.Item key="stop">停止直播</Menu.Item>}
                    {3 === info.state && <Menu.Item key="notice">预告直播</Menu.Item>}
                    <Menu.Item key="tag">修改标签</Menu.Item>
                  </Menu>
                }
              >
                <Button><Icon type="ellipsis" /></Button>
              </Dropdown>
            </div>
          }
          content={<HeaderContent info={info} tags={tags} />}
          extraContent={
            <Row>
              <Col sm={24} md={12}>
                <div className={styles.extraContentTitle}>状态</div>
                <div className={styles.extraContentInfo}>{showState(info.state)}</div>
              </Col>
              <Col sm={24} md={12}>
                <div className={styles.extraContentTitle}>观看人次</div>
                <div className={styles.extraContentInfo}>{statistic && (statistic.total_session_count + statistic.total_vod_session_count)}</div>
              </Col>
            </Row>
          }
          tabList={getClientShowTabs().map((it) => {
            return {
              key: it.key,
              tab: <Link key={it.key} to={`/p/${match.params.name}/shows/${match.params.showId}/${it.key}`}>{it.name}</Link>,
            };
          })}
          tabActiveKey={getTabActiveKey(location)}
          breadcrumbList={[{ title: null }]}
        />
        <div className={styles.container}>
          <Switch>
            {getClientShowRoutes(app)}
            <Route
              exact path="/p/:name/shows/:showId/(.*)" render={props => (
                <Redirect to={`/p/${props.match.params.name}/shows/${props.match.params.showId}/basic`} />
              )}
            />
          </Switch>
        </div>
        {this.state.start && <Modal
          title="预告直播"
          visible
          onOk={() => this.notice()}
          onCancel={() => this.hideNoticeModal()}
        >
          <Form.Item label="预计开始时间" labelCol={{ sm: { span: 8 } }} wrapperCol={{ sm: { span: 16 } }}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" value={this.state.start} onChange={this.onStartChange} />
          </Form.Item>
        </Modal>}
        {/* {undefined !== this.state.guideModal && <Modal
          title="直播已暂停"
          visible={this.state.guideModal}
          onOk={() => this.hideGuideModal()}
          onCancel={() => this.hideGuideModal()}
        >

        </Modal>} */}
      </React.Fragment>
    );
  }
}

Show.propTypes = {
  app: PropTypes.object,
  match: PropTypes.object,
  info: PropTypes.object,
  tags: PropTypes.array,
  statistic: PropTypes.object,
};

export default connect(state => ({
  info: state.shows.info,
  tags: state.shows.tags,
  statistic: state.shows.statistic,
}))(Show);
