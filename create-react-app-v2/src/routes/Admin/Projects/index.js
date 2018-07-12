import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import queryString from 'query-string';
// import numeral from 'numeral';
import moment from 'moment';
// antd & ant-design-pro 组件
import { Button, notification, List, Popconfirm, Card, Badge } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
// import { MiniProgress } from 'ant-design-pro/lib/Charts';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import NumberInfo from 'ant-design-pro/lib/NumberInfo';
// 业务组件
import FilterForm from '../../../components/FilterForm';
import PageBody from '../../../components/PageBody';
import OssImg from '../../../components/OssImg';
// severs
import eventServer from '../../../services/event';
// filter
import { projectState, projectStateType } from '../../../utils/filter';
import { notifyRequestError } from '../../../utils';
// import { eventStateType } from './common';
// import StorageQuota from './StorageQuota';
import styles from './index.less';


class Projects extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.remove = this.remove.bind(this);
  }
  onSearch(values) {
    const search = values.filterKey && values.filterValue ? { k: values.filterKey, v: values.filterValue } : {};
    this.props.dispatch(routerRedux.push({
      pathname: this.props.location.pathname,
      search: queryString.stringify(search),
    }));
  }
  onRefresh() {
    this.props.dispatch(routerRedux.push({
      pathname: this.props.location.pathname,
      search: this.props.location.search,
    }));
  }
  onPageChange(page) {
    const parsed = queryString.parse(this.props.location.search);
    this.props.dispatch(routerRedux.push({
      pathname: this.props.location.pathname,
      search: queryString.stringify({ ...parsed, page: (1 === page ? undefined : page) }),
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
  render() {
    const {
      filterKey,
      filterValue,
      loading,
      total,
      list,
      page,
      pageSize,
    } = this.props;
    return (
      <React.Fragment>
        <PageHeader
          title={<FilterForm
            filterKey={filterKey}
            filterValue={filterValue}
            options={[{
              value: 'title',
              text: '商户名称',
            }, {
              value: 'name',
              text: 'name',
            }, {
              value: 'desc',
              text: '地址',
            }, {
              value: 'long_desc',
              text: '详细描述',
            }, {
              value: 'state',
              text: '状态',
            }]}
            onSubmit={this.onSearch}
          />}
          action={<React.Fragment>
            <Button className={styles.actionButton} type="default" disabled={loading} onClick={this.onRefresh}>刷新</Button>,
            <Button className={styles.actionButton} type="primary" disabled={loading} onClick={this.onRefresh}>新建</Button>,
          </React.Fragment>}
        />
        <PageBody>
          <Card bordered={false}>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={{
                current: page,
                showQuickJumper: true,
                pageSize,
                total,
                showTotal: t => `共 ${t} 项`,
                onChange: this.onPageChange,
              }}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Link to={`/projects/${item.name}`}>详情</Link>,
                    <Popconfirm placement="topLeft" title="确认删除商户？" onConfirm={() => this.remove(item)}>
                      <a>删除</a>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<OssImg alt={item.logo_url} src={item.logo_url} action="/resize,m_fill,h_45,w_45" />}
                    title={<Ellipsis lines={2}>
                      <Link className={styles.projectTitle} to={`/projects/${item.name}/`}>{item.title}</Link>
                    </Ellipsis>}
                    description={<Ellipsis lines={1}>{item.desc}</Ellipsis>}
                  />
                  <div className={styles.desc}>
                    <div>状态</div>
                    <div className={styles.listItemValue}><Badge text={projectState(item.state)} status={projectStateType(item.state)} /></div>
                  </div>
                  <div className={styles.ctime}>
                    <div>创建时间</div>
                    <div className={styles.listItemValue}>{moment(item.ctime).format('YYYY-MM-DD HH:mm:ss')}</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </PageBody>
      </React.Fragment>
    );
  }
}

Projects.propTypes = {
  list: PropTypes.array,
  total: PropTypes.number,
  loading: PropTypes.bool,
};

export default connect(state => state.projects)(Projects);
