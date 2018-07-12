import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';

import showServer from '../../../services/show';

// TODO: ant-design-pro@0.3.0 NumberInfo issue 解决后升级版本后确认一下
class ShowAnalysis extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { total: undefined };
  }
  componentWillMount() {
    this.load();
  }
  async load() {
    const { data } = await showServer.getShows({
      projectName: this.props.name,
      start: 0,
      limit: 0,
    });
    if (data) {
      this.setState({ total: data.total });
    } else {
      this.setState({ total: null });
    }
  }
  render() {
    if (undefined === this.state.total) {
      return null;
    } else if (null === this.state.total) {
      return <Card>加载失败</Card>;
    }
    return (
      <Card>
        <NumberInfo subTitle="课堂总数" total={this.state.total} />
      </Card>
    );
  }
}

ShowAnalysis.propTypes = {
  name: PropTypes.string,
};

export default ShowAnalysis;
