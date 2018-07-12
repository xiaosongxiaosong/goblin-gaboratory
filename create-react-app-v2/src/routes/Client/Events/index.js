import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import queryString from 'query-string';
import numeral from 'numeral';
import moment from 'moment';
// import momentDurationFormatSetup from 'moment-duration-format';
// antd & ant-design-pro 组件
import { Input, Button, Card, List, Badge, Popconfirm, notification, Icon, Dropdown, Menu } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import { MiniProgress } from 'ant-design-pro/lib/Charts';
// import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// 业务组件
import OssImg from '../../../components/OssImg';
import playEventRecord from '../../../components/EventPlayModal/playEventRecord';
// severs
import eventServer from '../../../services/event';
// filter
import { eventStateDescription, duration, eventStateType } from '../../../utils/filter';
import { notifyRequestError } from '../../../utils';
// import { eventStateType } from './common';
// import StorageQuota from './StorageQuota';
import styles from './index.less';


// momentDurationFormatSetup(moment);
const Action = ({
  projectName,
  loading,
  onRefresh,
}) => {
  return (
    <React.Fragment>
      <Button className={styles.actionButton} type="default" href={`#/p/${projectName}/events/upload`}><Icon type="upload" />&nbsp;上传</Button>
      <Button className={styles.actionButton} type="default" disabled={loading} onClick={onRefresh}>刷新</Button>
      <Button className={styles.actionButton} type="default" href={`#/p/${projectName}/events/clip`}>剪辑</Button>
    </React.Fragment>
  );
};


class Events extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.remove = this.remove.bind(this);
  }
  onSearch(keyword) {
    const obj = { keyword: '' === keyword ? undefined : keyword };
    const str = queryString.stringify(obj);
    this.props.dispatch(routerRedux.push({
      pathname: this.props.location.pathname,
      search: ('' === str ? undefined : `?${str}`),
    }));
  }
  onRefresh() {
    const obj = { keyword: ('' === this.props.keyword ? undefined : this.props.keyword), page: (1 === this.props.page ? undefined : this.props.page) };
    const str = queryString.stringify(obj);
    this.props.dispatch(routerRedux.push({
      pathname: this.props.location.pathname,
      search: ('' === str ? undefined : `?${str}`),
    }));
  }
  onPageChange(page) {
    const obj = { keyword: ('' === this.props.keyword ? undefined : this.props.keyword), page: (1 === page ? undefined : page) };
    const str = queryString.stringify(obj);
    this.props.dispatch(routerRedux.push({
      pathname: this.props.location.pathname,
      search: ('' === str ? undefined : `?${str}`),
    }));
  }
  async remove(item) {
    const { errMsg } = await eventServer.removeEvent({
      projectName: item.project_name,
      eventId: item.event_id,
    });
    if (errMsg) {
      notifyRequestError(errMsg, '删除录像失败');
    } else {
      notification.success({ message: '删除录像成功' });
      this.onRefresh();
    }
  }
  expand() {
    this.props.dispatch({
      type: 'client/showCsmModal',
      payload: {
        projectName: this.props.match.params.name,
        title: '商户扩容',
        content: '暂不支持自行开通 “商户扩容” 功能，请联系客服开通',
      },
    });
  }
  render() {
    const {
      keyword,
      loading,
      projectName,
      total,
      storageQuota,
      list,
      page,
      pageSize,
      // selected,
    } = this.props;
    // debugger;
    return (
      <React.Fragment>
        <PageHeader
          title="存储空间"
          action={<Button type="primary" onClick={() => this.expand()}>我要扩容</Button>}
          content={storageQuota && <React.Fragment>
            <MiniProgress target={80} strokeWidth={8} percent={(storageQuota.used / storageQuota.quota) * 100} />
            <div>已使用：{numeral(storageQuota.used).format('0.0 b')}，总容量：{numeral(storageQuota.quota).format('0.0 b')}</div>
          </React.Fragment>}
          breadcrumbList={[{ title: null }]}
        />
        <div className={styles.container}>
          <Card
            bordered={false}
            title={<Input.Search className={styles.searchInput} defaultValue={keyword} onSearch={this.onSearch} disabled={loading} enterButton />}
            extra={<Action projectName={projectName} loading={loading} onRefresh={this.onRefresh} />}
          >
            <List
              size="large"
              rowKey="id"
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
              renderItem={item => (
                <List.Item
                  actions={[
                    <a onClick={() => playEventRecord(item)}>播放</a>,
                    <Link to={`/p/${item.project_name}/events/${item.event_id}/`}>详情</Link>,
                    <Dropdown
                      overlay={<Menu>
                        <Menu.Item key="modify">
                          <Link to={`/p/${item.project_name}/events/${item.event_id}/modify`}>
                            <Icon type="form" />&nbsp;编辑
                          </Link>
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
                      <Link to={`/p/${item.project_name}/events/${item.event_id}/`}>{item.desc}</Link>
                    </Ellipsis>}
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
                  <div className={styles.size}>
                    <div>占用空间</div>
                    <div className={styles.listItemValue}>{numeral(item.size).format('0.0 b')}</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </div>
        {/* {selected && <div className={styles.right}>测试</div>} */}
      </React.Fragment>
    );
  }
}


Events.propTypes = {
  projectName: PropTypes.string,
  keyword: PropTypes.string,
  // list: PropTypes.array,
  total: PropTypes.number,
  loading: PropTypes.bool,
  storageQuota: PropTypes.object,
  // selected: PropTypes.object,
  dispatch: PropTypes.func,
};

// export default Show;
export default connect(state => ({
  projectName: state.client.selected,
  keyword: state.events.keyword,
  list: state.events.list,
  total: state.events.total,
  page: state.events.page,
  pageSize: state.events.pageSize,
  loading: state.events.loading,
  storageQuota: state.events.storageQuota,
  // selected: state.events.selected,
}))(Events);
