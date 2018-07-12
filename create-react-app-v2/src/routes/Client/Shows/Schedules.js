import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'dva';
import { Card, Table } from 'antd';
import moment from 'moment';
// import numeral from 'numeral';
// import DescriptionList from 'ant-design-pro/lib/DescriptionList';
// import { showState } from '../../../utils/filter';
import showServer from '../../../services/show';
// import styles from './Records.less';


const columns = [{
  title: '时间段',
  dataIndex: 'start',
  key: 'start',
  render: (text, record) => {
    return `${moment((record.start + 57600) * 1000).format('HH:mm')} - ${moment((record.end + 57600) * 1000).format('HH:mm')}`;
  },
}, {
  title: '重复',
  dataIndex: 'weekday_bits',
  key: 'weekday_bits',
  // render: weekday_bits => event.state,
}, {
  title: '状态',
  dataIndex: 'state',
  key: 'state',
  // render: event => moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
}, {
  title: '操作',
  dataIndex: 'live_enabled',
  key: 'live_enabled',
  // render: event => numeral(event.duration / 1000).format('00:00:00'),
}, {
  title: 'action',
  dataIndex: 'uuid',
  key: 'uuid',
  // render: event => event.size,
}];


class Schedules extends React.PureComponent {
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
    const { data } = await showServer.getShowSchedules({
      projectName: this.props.match.params.name,
      start: this.state.list.length,
      limit: 100,
    });
    const list = data.list.concat(this.state.list);
    this.setState({ loading: false, list });
    if (list.length < data.total && 0 < data.list.length) {
      this.load();
    }
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
          rowKey={record => record.uuid}
        />
      </Card>
    );
  }
}

Schedules.propTypes = {
  match: PropTypes.object,
};

export default Schedules;
