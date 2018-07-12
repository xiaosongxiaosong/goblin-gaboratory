import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'dva';
import { Card, Table } from 'antd';
import moment from 'moment';
import numeral from 'numeral';
// import DescriptionList from 'ant-design-pro/lib/DescriptionList';
// import { showState } from '../../../utils/filter';
import showServer from '../../../services/show';
// import styles from './Records.less';


const columns = [{
  title: '名称',
  dataIndex: 'event',
  key: 'desc',
  render: event => event.desc,
}, {
  title: '状态',
  dataIndex: 'event',
  key: 'state',
  render: event => event.state,
}, {
  title: '开始时间',
  dataIndex: 'event',
  key: 'start',
  render: event => moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
}, {
  title: '时长',
  dataIndex: 'event',
  key: 'duration',
  render: event => numeral(event.duration / 1000).format('00:00:00'),
}, {
  title: '大小',
  dataIndex: 'event',
  key: 'size',
  render: event => numeral(event.size).format('0.0 b'),
}, {
  title: '操作',
  dataIndex: 'event',
  key: 'action',
  render: event => event.size,
}];


class Records extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      loading: false,
    };

    // this.onLoad = this.onLoad.bind(this);
    // this.onRefresh = this.onRefresh.bind(this);
    // this.onSearch = this.onSearch.bind(this);
  }
  componentDidMount() {
    this.load();
  }
  async load() {
    this.setState({ loading: true });
    const { data } = await showServer.getShowRecords({ projectName: this.props.match.params.name, showId: this.props.match.params.showId });
    this.setState({ loading: false, list: data.list });
  }
  // onLoad() {
  //   this.props.dispatch({ type: 'shows/load' });
  // }
  // onRefresh() {
  //   this.props.dispatch({ type: 'shows/reload' });
  // }
  // onSearch(keyword) {
  //   this.props.dispatch({ type: 'shows/search', payload: keyword });
  // }
  render() {
    // const { info } = this.props;
    // if (!info) {
    //   return null;
    // }

    return (
      <Card bordered={false}>
        <Table
          dataSource={this.state.list}
          loading={this.state.loading}
          columns={columns}
          pagination={false}
          rowKey={record => record.event_id}
        />
      </Card>
    );
  }
}

Records.propTypes = {
  match: PropTypes.object,
};

export default Records;
