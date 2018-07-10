import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Row, Col } from 'antd';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import moment from 'moment';
import numeral from 'numeral';
// import DescriptionList from 'ant-design-pro/lib/DescriptionList';
// import { showState } from '../../../utils/filter';
import showServer from '../../../services/show';
import styles from './Statistics.less';


const columns = [{
  title: '开始时间',
  dataIndex: 'start',
  key: 'start',
  render: start => moment(start).format('YYYY-MM-DD HH:mm:ss'),
}, {
  title: '直播时长',
  dataIndex: 'duration',
  key: 'duration',
  render: duration => numeral(duration / 1000).format('00:00:00'),
}, {
  title: '最大并发',
  dataIndex: 'max_concurrent_sessions',
  key: 'max_concurrent_sessions',
  // render: max_concurrent_sessions => event.state,
}, {
  title: '观看次数',
  dataIndex: 'total_session_count',
  key: 'total_session_count',
  // render: record => (record.total_session_count),
}, {
  title: '观看时长',
  dataIndex: 'total_session_duration',
  key: 'total_session_duration',
  render: duration => numeral(duration * 60).format('00:00:00'),
}, {
  title: '操作',
  dataIndex: 'uuid',
  key: 'action',
  // render: event => event.size,
}];


class Statistics extends React.PureComponent {
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
    const { data } = await showServer.getLiveStatistics({ projectName: this.props.match.params.name, showId: this.props.match.params.showId });
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
      <React.Fragment>
        <Card bordered={false} className={styles.card}>
          <Row>
            <Col sm={8} xs={24}>
              <NumberInfo
                // title="并发"
                subTitle="观看次数"
                total={this.props.statistic.total_session_count}
                subTotal={` / ${this.props.statistic.total_vod_session_count}`}
              />
            </Col>
            <Col sm={8} xs={24}>
              <NumberInfo
                // title="观看时长"
                subTitle="观看时长"
                total={this.props.statistic.total_session_duration}
                subTotal={` / ${this.props.statistic.total_vod_session_duration}`}
              />
            </Col>
            <Col sm={8} xs={24}>
              <NumberInfo
                subTitle="并发"
                total={this.props.statistic.max_concurrent_sessions}
                // subTotal={` / ${this.props.statistic.total_vod_session_count}`}
              />
            </Col>
          </Row>
        </Card>
        <Card bordered={false} className={styles.card}>
          <Table
            dataSource={this.state.list}
            loading={this.state.loading}
            columns={columns}
            pagination={false}
            rowKey={record => record.uuid}
          />
        </Card>
      </React.Fragment>
    );
  }
}

Statistics.propTypes = {
  match: PropTypes.object,
  statistic: PropTypes.object,
};

// export default Statistics;
export default connect(state => ({
  // info: state.shows.selected,
  // tags: state.shows.tags,
  statistic: state.shows.statistic,
}))(Statistics);
