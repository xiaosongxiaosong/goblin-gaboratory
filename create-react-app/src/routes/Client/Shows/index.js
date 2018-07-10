import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import queryString from 'query-string';
import moment from 'moment';
import { Card, Button, Input, Icon, List, Dropdown, Menu, Popconfirm, Badge, notification } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

import PageBody from '../../../components/PageBody';
import OssImg from '../../../components/OssImg';
// import Description from '../../../components/Description';
// import Loading from '../../Loading';
import eventServices from '../../../services/event';
import { notifyRequestError } from '../../../utils';
import { showState, showPublic, showStateType } from '../../../utils/filter';

// import ListWrapper from '../common/ListWrapper';
import styles from './index.less';

// const ShowCard = ({ info }) => {
//   const url = `/p/${info.project_name}/shows/${info.uuid}`;
//   // const actions = [
//   //   <Link to={`${url}/show`}><Icon type="setting" /></Link>,
//   //   <Link to={`${url}/records`}><Icon type="edit" /></Link>,
//   // ];
//   return (
//     <Card
//       className={styles.showCard}
//       hoverable
//       cover={<OssImg alt={info.name} src={info.cover_url} />}
//       actions={[<Link to={`${url}/show`}><Icon type="setting" /></Link>, <Icon type="edit" />, <Icon type="ellipsis" />]}
//     >
//       <Card.Meta
//         title={info.name}
//         description={
//           <div>
//             <div>
//               <Tag className={0 !== info.is_public ? styles.primaryTag : ''}>{showPublic(info.is_public)}</Tag>
//               <Tag className={(1 === info.state || 2 === info.state) ? styles.successTag : ''}>{showState(info.state)}</Tag>
//             </div>
//             <div>{moment(info.start).format('MM-DD HH:mm:ss')}</div>
//           </div>
//         }
//       />
//     </Card>
//   );
// };


const ShowAction = ({
  projectName,
  loading,
  onRefresh,
}) => {
  return (
    <div>
      <Button type="default" href={`#/p/${projectName}/shows-new`}>创建</Button>
      <Button type="default" disabled={loading} onClick={onRefresh}>刷新</Button>
    </div>
  );
};

// const LoadMore = ({
//   list,
//   total,
//   loading,
//   onLoad,
// }) => {
//   if (loading) {
//     return <Loading />;
//   }
//   if (total > list.length) {
//     return <Button onClick={onLoad}>加载更多</Button>;
//   }
//   return null;
// };

// const renderItem = (info) => {
//   return <ShowCard info={info} />;
// };


class Shows extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
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
    const { errMsg } = await eventServices.removeEvent({
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
      keyword,
      loading,
      projectName,
      total,
      list,
      page,
      pageSize,
      // selected,
    } = this.props;
    return (
      <div>
        <PageHeader
          title={<Input.Search defaultValue={keyword} onSearch={this.onSearch} disabled={loading} enterButton />}
          action={<ShowAction projectName={projectName} loading={loading} onRefresh={this.onRefresh} />}
          breadcrumbList={[{ title: null }]}
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
                showTotal: (t, range) => `${range[0]}-${range[1]} of ${t} items`,
                onChange: this.onPageChange,
              }}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Link to={`/p/${item.project_name}/shows/${item.uuid}/`}>详情</Link>,
                    <Dropdown
                      overlay={<Menu>
                        <Menu.Item key="modify">
                          <Link to={`/p/${item.project_name}/shows/${item.uuid}/edit`}>
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
                    avatar={<OssImg alt={item.name} src={item.cover_url} action="/resize,m_fill,h_45,w_80" />}
                    title={<Ellipsis lines={2} tooltip>
                      <Link to={`/p/${item.project_name}/shows/${item.uuid}/`}>{item.name}</Link>
                    </Ellipsis>}
                    description={<Badge text={showState(item.state)} status={showStateType(item.state)} />}
                  />
                  {/* <div className={styles.duration}>
                  <div>时长</div>
                  <div className={styles.listItemValue}>{duration(item.duration)}</div>
                </div> */}
                  <div className={styles.public}>
                    <div>发布方式</div>
                    <div className={styles.listItemValue}>{showPublic(item.is_public)}</div>
                  </div>
                  <div className={styles.startTime}>
                    <div>最近上课时间</div>
                    <div className={styles.listItemValue}>{moment(item.start).format('YYYY-MM-DD HH:mm:ss')}</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </PageBody>
      </div>
    );
  }
}

Shows.propTypes = {
  projectName: PropTypes.string,
  keyword: PropTypes.string,
  list: PropTypes.array,
  total: PropTypes.number,
  loading: PropTypes.bool,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  // selected: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(state => ({
  // projectName: state.client.selected,
  // keyword: state.shows.keyword,
  // list: state.shows.list,
  // total: state.shows.total,
  // loading: state.shows.loading,
  projectName: state.client.selected,
  keyword: state.shows.keyword,
  list: state.shows.list,
  total: state.shows.total,
  page: state.shows.page,
  pageSize: state.shows.pageSize,
  loading: state.shows.loading,
}))(Shows);
