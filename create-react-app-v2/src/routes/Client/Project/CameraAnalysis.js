import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';

import cameraServer from '../../../services/camera';

class CameraAnalysis extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { total: undefined, offline: undefined };
  }
  componentWillMount() {
    this.load('total');
    this.load('offline', 0);
  }
  async load(key, filterValue) {
    const defaultParams = {
      projectName: this.props.name,
      start: 0,
      limit: 0,
    };
    const params = undefined === filterValue ? defaultParams : { ...defaultParams, filter_key: 'is_online', filter_value: filterValue };
    const { data } = await cameraServer.getCameras(params);
    if (data) {
      this.setState({ [key]: data.total });
    } else {
      this.setState({ [key]: null });
    }
  }
  render() {
    if (undefined === this.state.total || undefined === this.state.offline) {
      return null;
    } else if (null === this.state.total || null === this.state.offline) {
      return <Card>加载失败</Card>;
    }
    return (
      <Card>
        <NumberInfo
          subTitle="在线摄像机"
          total={this.state.total - this.state.offline}
          subTotal={this.state.total}
        />
      </Card>
    );
  }
}

CameraAnalysis.propTypes = {
  name: PropTypes.string,
};

export default CameraAnalysis;
