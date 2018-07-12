import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
// import queryString from 'query-string';
import numeral from 'numeral';
// import moment from 'moment';
// import momentDurationFormatSetup from 'moment-duration-format';
import { Button, Row, Card, Col, Tooltip, List } from 'antd';
// antd & ant-design-pro 组件
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import PageBody from '../../../components/PageBody';
import Loading from '../../Loading';
// import { MiniProgress } from 'ant-design-pro/lib/Charts';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// 业务组件
// import OssImg from '../../../components/OssImg';
// import playEventRecord from '../../../components/EventPlayModal/playEventRecord';
// severs
// import eventServer from '../../../services/event';
// filter
// import { eventStateDescription, duration, eventStateType } from '../../../utils/filter';
// import { notifyRequestError } from '../../../utils';
// import { eventStateType } from './common';
// import StorageQuota from './StorageQuota';
import styles from './index.less';

const Dashboard = ({
  loading,
  working,
  userSessionProjects,
  eventSizeProjects,
  vodDurtionProjects,
  liveDurtionProjects,
  projectCount,
  userCount,
  location,
  dispatch,
}) => {
  // if (loading) {
  //   return <Loading />;
  // }
  return (<React.Fragment>
    <PageHeader
      title="系统概况"
      action={<Button onClick={() => dispatch(routerRedux.replace(location.pathname))}>刷新</Button>}
      content={!loading && <DescriptionList size="small" col={3} >
        <DescriptionList.Description term="用户总数">{numeral(userCount).format('0,0')} 名</DescriptionList.Description>
        <DescriptionList.Description term="商户总数">{numeral(projectCount).format('0,0')} 个</DescriptionList.Description>
      </DescriptionList>}
    />
    {loading && <Loading />}
    <PageBody>
      {working && <Card bordered={false} className={styles.workingCard}>
        <Row gutter={16}>
          <Col span={6} className={styles.bordered}>
            <NumberInfo
              subTitle="录像统计"
              total={working.camera_record.recording_count + working.camera_record.error_count}
              subTotal={<Tooltip title="异常个数">{working.camera_record.error_count}台异常</Tooltip>}
            />
          </Col>
          <Col span={6} className={styles.bordered}>
            <NumberInfo
              subTitle="直播统计"
              total={working.live_show.ongoing_count + working.live_show.paused_count}
              subTotal={<Tooltip title="暂停中">{working.live_show.paused_count}个暂停中</Tooltip>}
            />
          </Col>
          <Col span={6} className={styles.bordered}>
            <NumberInfo subTitle="在线用户数" total={working.live_show_user_session.count} />
          </Col>
          <Col span={6}>
            <NumberInfo subTitle="直播总观看" total={working.live_session.count} />
          </Col>
        </Row>
      </Card>}
      <Row gutter={16}>
        {vodDurtionProjects && <Col xl={12} xxl={6}>
          <Card bordered={false} title="回放观看量排行" className={styles.leaderboard}>
            <List
              pagination={false}
              size="small"
              split={false}
              dataSource={vodDurtionProjects}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta title={item.project_title} />
                  <div>{numeral(item.duration).format('0,0')}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>}
        {liveDurtionProjects && <Col xl={12} xxl={6}>
          <Card bordered={false} title="直播观看量排行" className={styles.leaderboard}>
            <List
              pagination={false}
              size="small"
              split={false}
              dataSource={liveDurtionProjects}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta title={item.project_title} />
                  <div>{numeral(item.duration).format('0,0')}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>}
        {userSessionProjects && <Col xl={12} xxl={6}>
          <Card bordered={false} title="在线人数排行" className={styles.leaderboard}>
            <List
              pagination={false}
              size="small"
              split={false}
              dataSource={userSessionProjects}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta title={item.project_title} />
                  <div>{item.user_session_count}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>}
        {eventSizeProjects && <Col xl={12} xxl={6}>
          <Card bordered={false} title="录像库增长排行" className={styles.leaderboard}>
            <List
              pagination={false}
              size="small"
              split={false}
              dataSource={eventSizeProjects}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta title={item.project_title} />
                  <div>{numeral(item.size).format('0.0 b')}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>}
      </Row>
    </PageBody>
  </React.Fragment>);
};

Dashboard.propTypes = {
  // projectName: PropTypes.string,
  // keyword: PropTypes.string,
  // total: PropTypes.number,
  // loading: PropTypes.bool,
  // storageQuota: PropTypes.object,
  // // selected: PropTypes.object,
  // dispatch: PropTypes.func,
};

// export default Show;
export default connect(state => state.dashboard)(Dashboard);
