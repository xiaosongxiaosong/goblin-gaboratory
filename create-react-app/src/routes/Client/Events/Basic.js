import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import LongDesc from '../../../components/LongDesc';
// import styles from './Basic.less';


class Basic extends React.PureComponent {
  // constructor(props) {
  //   super(props);

  //   this.onSearch = this.onSearch.bind(this);
  //   this.onRefresh = this.onRefresh.bind(this);
  //   this.onPageChange = this.onPageChange.bind(this);
  // }
  render() {
    const { info } = this.props;
    if (!info) {
      return null;
    }
    return (
      <Card bordered={false}>
        <DescriptionList size="large" title="描述信息" layout="vertical">
          <DescriptionList.Description term="">
            <LongDesc text={info.long_desc} />
          </DescriptionList.Description>
        </DescriptionList>
        {info.camera_id && <React.Fragment>
          <Divider />
          <DescriptionList size="large" title="视频设备" layout="vertical">
            <DescriptionList.Description term="">{info.camera_name}</DescriptionList.Description>
          </DescriptionList>
        </React.Fragment>}
      </Card>
    );
  }
}


Basic.propTypes = {
  // projectName: PropTypes.string,
  info: PropTypes.object,
  // dispatch: PropTypes.func,
};

// export default Show;
export default connect(state => ({
  // projectName: state.client.selected,
  info: state.events.info,
}))(Basic);
