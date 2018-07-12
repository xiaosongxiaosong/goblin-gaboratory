import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import LongDesc from '../../../components/LongDesc';
import { showState } from '../../../utils/filter';
import styles from './Show.less';

class Basic extends React.PureComponent {
  // constructor(props) {
  //   super(props);

  //   this.onLoad = this.onLoad.bind(this);
  //   this.onRefresh = this.onRefresh.bind(this);
  //   this.onSearch = this.onSearch.bind(this);
  // }
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
    const { info } = this.props;
    if (!info) {
      return null;
    }
    return (
      <Card bordered={false}>
        <DescriptionList size="large" title="直播信息" >
          <DescriptionList.Description term="视频源">
            {'' === info.camera_uuid ? <span className={styles.italic}>未设置</span> : info.camera_name}
          </DescriptionList.Description>
          <DescriptionList.Description term="直播是否录像">{info.record_enabled ? '开启' : '关闭'}</DescriptionList.Description>
          <DescriptionList.Description term="直播状态">{showState(info.state)}</DescriptionList.Description>
        </DescriptionList>
        <Divider />
        <DescriptionList size="large" title="观看链接" col="1">
          <DescriptionList.Description term="观看链接">{`${info.project_name}/${info.uuid}`}</DescriptionList.Description>
          <DescriptionList.Description term="观看链接二维码">观看链接二维码</DescriptionList.Description>
        </DescriptionList>
        <Divider />
        <DescriptionList size="large" title="描述信息" col="1">
          <DescriptionList.Description term="详细描述">
            <LongDesc text={info.long_desc} />
          </DescriptionList.Description>
          <DescriptionList.Description term="备注信息">
            <LongDesc text={info.comment} emptyText="无备注信息" />
          </DescriptionList.Description>
        </DescriptionList>
      </Card>
    );
  }
}

Basic.propTypes = {
  info: PropTypes.object,
};

export default connect(state => ({
  info: state.shows.info,
}))(Basic);
