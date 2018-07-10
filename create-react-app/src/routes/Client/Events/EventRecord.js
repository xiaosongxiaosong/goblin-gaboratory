import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import { Link, Switch, Redirect, Route } from 'dva/router';
import { Button, Dropdown, Icon, Menu, Row, Col, Badge, notification } from 'antd';
import Exception from 'ant-design-pro/lib/Exception';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Loading from '../../Loading';
import OssImg from '../../../components/OssImg';
// import EventPlayModal from '../../../components/EventPlayModal';
import playEventRecord from '../../../components/EventPlayModal/playEventRecord';
import { getClientEventRoutes, getClientEventTabs } from '../../../common/client';
import eventServer from '../../../services/event';
import { eventStateDescription, duration, eventStateType } from '../../../utils/filter';
import { notifyRequestError, delay } from '../../../utils';
// import { eventStateType } from './common';
// import { gutter } from '../common';
import styles from './EventRecord.less';
// import { getEvent } from '../../../services/event';


const HeaderContent = ({
  info,
}) => {
  return (
    <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
      <Col sm={12} md={12} lg={8} xl={6} xll={4}>
        <OssImg alt={info.desc} src={info.snapshot} />
      </Col>
      <Col sm={12} md={12} lg={16} xl={18} xll={20}>
        <DescriptionList size="small" col="1">
          <DescriptionList.Description term="状态">{<Badge text={eventStateDescription(info.state)} status={eventStateType(info.state)} />}</DescriptionList.Description>
          <DescriptionList.Description term="开始时间">{moment(info.start).format('YYYY-MM-DD HH:mm:ss')}</DescriptionList.Description>
          <DescriptionList.Description term="时长">{duration(info.duration)}</DescriptionList.Description>
          <DescriptionList.Description term="大小">{numeral(info.size).format('0.0 b')}</DescriptionList.Description>
        </DescriptionList>
      </Col>
    </Row>
  );
};

const getTabActiveKey = (location) => {
  const match = location.pathname.match(/^\/p\/[^/]+\/events\/[^/]+\/([^/-]+)/);
  if (match) {
    return match[1];
  }
  return 'basic';
};


class EventRecord extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modal: undefined,
    };

    this.play = this.play.bind(this);
    this.onMenuClick = this.onMenuClick.bind(this);
  }
  onMenuClick({ key }) {
    if ('delete' === key) {
      this.remove();
    } else if ('download' === key) {
      this.download();
    }
  }
  play() {
    playEventRecord(this.props.info);
  }
  async remove() {
    const { errMsg } = await eventServer.removeEvent({
      projectName: this.props.info.project_name,
      eventId: this.props.info.event_id,
    });
    if (errMsg) {
      notifyRequestError(errMsg, '删除录像失败');
    } else {
      notification.success({ message: '删除录像成功' });
      await delay(2000);
      await this.props.dispatch({ type: 'events/save', payload: { info: undefined } });
      window.history.back();
    }
  }
  async download() {
    const { data, errMsg } = await eventServer.getTsUrl({
      projectName: this.props.info.project_name,
      eventId: this.props.info.event_id,
    });
    if (errMsg) {
      notifyRequestError(errMsg, '下载失败');
      return;
    }
    const a = document.createElement('a');
    const extension = this.props.info.extension || 'ts';
    a.href = data.url;
    a.download = `${this.props.info.desc}.${extension}`;
    if (document.all) {
      a.click();
    } else {
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      a.dispatchEvent(evt);
    }
  }
  render() {
    const { app, info, match, location } = this.props;
    if (undefined === info) {
      return <Loading />;
    } else if (null === info) {
      return (<Exception
        type="404"
        title="获取录像信息失败"
        desc=""
        actions={[<Link key="events" to={`/p/${match.params.name}/events`}>查看所有录像</Link>]}
      />);
    }
    return (
      <React.Fragment>
        <PageHeader
          title={info.desc}
          action={[
            <Button key="play" onClick={this.play}><Icon type="caret-right" />&nbsp;播放</Button>,
            <Button key="modify" href={`#/p/${info.project_name}/events/${info.event_id}/modify`}><Icon type="form" />&nbsp;编辑</Button>,
            <Dropdown
              key="more"
              overlay={<Menu onClick={this.onMenuClick}>
                <Menu.Item key="download"><Icon type="download" />&nbsp;下载</Menu.Item>
                <Menu.Item key="delete"><Icon type="delete" />&nbsp;删除</Menu.Item>
              </Menu>}
            >
              <Button><Icon type="ellipsis" /></Button>
            </Dropdown>,
          ]}
          content={<HeaderContent info={info} />}
          tabList={getClientEventTabs().map(it => ({
            key: it.key,
            tab: <Link key={it.key} to={`/p/${info.project_name}/events/${info.event_id}/${it.key}`}>{it.name}</Link>,
          }))}
          tabActiveKey={getTabActiveKey(location)}
          breadcrumbList={[{ title: null }]}
        />
        <div className={styles.container}>
          <Switch>
            {getClientEventRoutes(app)}
            <Route
              exact path="/p/:name/events/:eventId/(.*)" render={() => (
                <Redirect to={`/p/${info.project_name}/events/${info.event_id}/shows`} />
              )}
            />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

EventRecord.propTypes = {
  app: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object,
  info: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(state => ({
  info: state.events.info,
}))(EventRecord);
