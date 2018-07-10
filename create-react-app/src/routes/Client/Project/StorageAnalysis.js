import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import numeral from 'numeral';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';

import projectServer from '../../../services/project';

class ShowAnalysis extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { quota: undefined };
  }
  componentWillMount() {
    this.load();
  }
  async load() {
    const { data } = await projectServer.getStorageQuota({
      projectName: this.props.name,
    });
    if (data) {
      this.setState({ quota: data });
    } else {
      this.setState({ quota: null });
    }
  }
  render() {
    if (undefined === this.state.quota) {
      return null;
    } else if (null === this.state.quota) {
      return <Card>加载失败</Card>;
    }
    const quota = 0 === this.state.quota.quota ? this.state.quota.free_quota : this.state.quota.quota;
    return (
      <Card>
        <NumberInfo
          subTitle="存储空间"
          total={numeral(this.state.quota.used).format('0.0 b')}
          subTotal={numeral(quota).format('0.0 b')}
        />
      </Card>
    );
  }
}

ShowAnalysis.propTypes = {
  name: PropTypes.string,
};

export default ShowAnalysis;
