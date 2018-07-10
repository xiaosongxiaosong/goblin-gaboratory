import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link, Switch, Redirect, Route } from 'dva/router';
// import { Link } from 'dva/router';
import { Button, Badge, notification } from 'antd';
import Exception from 'ant-design-pro/lib/Exception';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

import PageBody from '../../../../components/PageBody';
import Loading from '../../../Loading';
import OssImg from '../../../../components/OssImg';
import { getAdminProjectRoutes, getAdminProjectTabs } from '../../../../common/admin';
import eventServer from '../../../../services/event';
import { projectState, projectStateType } from '../../../../utils/filter';
import { notifyRequestError, delay } from '../../../../utils';
import styles from './index.less';


const getTabActiveKey = (location) => {
  const match = location.pathname.match(/^\/projects\/[^/]+\/([^/]+)(\/.+)?/);
  if (match) {
    return match[1];
  }
  return 'detail';
};


class Project extends React.PureComponent {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     modal: undefined,
  //   };
  // }
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
        actions={[<Link key="events" replace to={`/p/${match.params.name}/events`}>查看所有录像</Link>]}
      />);
    }
    return (
      <React.Fragment>
        <PageHeader
          logo={<div className={styles.porjectLogo}>
            <OssImg alt={info.logo_url} src={info.logo_url} action="/resize,m_fill,h_96,w_96" />
          </div>}
          title={info.title}
          action={<Button onClick={this.play}>删除</Button>}
          content={<DescriptionList size="small" col="2">
            <DescriptionList.Description term="状态">
              <Badge text={projectState(info.state)} status={projectStateType(info.state)} />
            </DescriptionList.Description>
            <DescriptionList.Description term="name">{info.name}</DescriptionList.Description>
            <DescriptionList.Description term="地址">
              <Ellipsis lines={1}>{info.desc}</Ellipsis>
            </DescriptionList.Description>
          </DescriptionList>}
          tabList={getAdminProjectTabs().map(it => ({
            key: it.key,
            tab: <Link key={it.key} to={`/projects/${info.name}/${it.key}`}>{it.name}</Link>,
          }))}
          tabActiveKey={getTabActiveKey(location)}
        />
        <PageBody>
          <Switch>
            {getAdminProjectRoutes(app)}
            <Route
              exact path="/projects/:name/(.*)" render={() => (
                <Redirect to={`/projects/${info.name}/detail`} />
              )}
            />
          </Switch>
        </PageBody>
      </React.Fragment>
    );
  }
}

Project.propTypes = {
  match: PropTypes.object,
  info: PropTypes.object,
};

export default connect(state => ({
  info: state.projects.info,
}))(Project);
