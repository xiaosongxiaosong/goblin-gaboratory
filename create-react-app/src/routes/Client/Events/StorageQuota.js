import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import { Divider } from 'antd';
import { MiniProgress } from 'ant-design-pro/lib/Charts';
// import NumberInfo from 'ant-design-pro/lib/NumberInfo';

import projectServer from '../../../services/project';

class StorageQuota extends React.PureComponent {
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
    // debugger;
    if (!this.state.quota) {
      return null;
    }

    // const quota = this.state.quota.quota;
    return (
      <React.Fragment>
        <MiniProgress target={80} strokeWidth={8} percent={(this.state.quota.used * 100) / this.state.quota.quota} />
        <Divider />
        <div>已使用：{numeral(this.state.quota.used).format('0.0 b')}，总容量：{numeral(this.state.quota.quota).format('0.0 b')}</div>
      </React.Fragment>
    );
  }
}

StorageQuota.propTypes = {
  name: PropTypes.string,
};

export default StorageQuota;
