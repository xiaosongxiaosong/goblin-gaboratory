import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import { Link } from 'dva/router';
import { Button, Icon, Row, Col, Badge, Card, Form, DatePicker, Input, notification, Switch } from 'antd';
import Exception from 'ant-design-pro/lib/Exception';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Loading from '../../Loading';
import OssImg from '../../../components/OssImg';
import PageBody from '../../../components/PageBody';
import playEventRecord from '../../../components/EventPlayModal/playEventRecord';
// import { getClientEventRouterData, getClientEventTabs } from '../../../common/client';
import { eventStateDescription, duration, eventStateType } from '../../../utils/filter';
import { notifyRequestError } from '../../../utils';
// import { eventStateType } from './common';
// import { gutter } from '../common';
import eventServer from '../../../services/event';
// import styles from './EventInfo.less';

// const gutter = { xs: 8, sm: 12, md: 16, lg: 24 };

const HeaderContent = ({
  info,
}) => {
  return (
    <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
      <Col sm={12} md={12} lg={8} xl={6} xll={4}>
        <OssImg alt={info.desc} src={info.snapshot} />
      </Col>
      <Col sm={12} md={12} lg={16} xl={18} xll={20}>
        <DescriptionList size="small" col="1">
          <DescriptionList.Description term="状态">{<Badge text={eventStateDescription(info.state)} status={eventStateType(info.state)} />}</DescriptionList.Description>
          <DescriptionList.Description term="时长">{duration(info.duration)}</DescriptionList.Description>
          <DescriptionList.Description term="大小">{numeral(info.size).format('0.0 b')}</DescriptionList.Description>
          {info.camera_id ? <DescriptionList.Description term="视频设备">{info.camera_name}</DescriptionList.Description> : <React.Fragment />}
        </DescriptionList>
      </Col>
    </Row>
  );
};

class EventInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.play = this.play.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      const { checked, start, delete_timestamp, ...info } = values;
      if (checked && delete_timestamp) {      // eslint-disable-line
        const min = moment(new Date().setHours(0, 0, 0, 0) + (32 * 24 * 60 * 60 * 1000));
        if (delete_timestamp.isBefore(min)) {
          notification.error({ message: `自动删除日期不能早于 ${min.format('YYYY-MM-DD')}` });
          return;
        }
        this.updateEventInfo({
          start: start.valueOf(),
          delete_timestamp: delete_timestamp.valueOf(),
          ...info,
        });
      } else {
        this.updateEventInfo({ start: start.valueOf(), ...info });
      }
    });
  }
  async updateEventInfo(values) {
    this.setState({ loading: true });
    const reqestParams = {
      projectName: this.props.match.params.name,
      eventId: this.props.match.params.eventId,
      ...values,
    };
    const { errMsg } = await eventServer.updateEventInfo(reqestParams);
    if (errMsg) {
      notifyRequestError(errMsg, '修改录像信息失败');
    } else {
      this.props.dispatch({ type: 'events/updateInfo', payload: reqestParams });
      notification.success({ message: '修改录像信息成功' });
    }
    this.setState({ loading: false });
  }
  play() {
    playEventRecord(this.props.info);
  }
  render() {
    const { match, info } = this.props;
    if (undefined === info) {
      return <Loading />;
    } else if (null === info) {
      return (<Exception
        type="404"
        title="获取录像信息失败"
        desc=""
        actions={[<Link key="events" to={`/p/${match.params.name}/events`}>查看所有录像</Link>]}
      />);
    }
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 6 },
        lg: { span: 4 },
        xl: { span: 3 },
        xxl: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 18 },
        lg: { span: 20 },
        xl: { span: 21 },
        xxl: { span: 22 },
      },
    };

    return (
      <Form onSubmit={this.onSubmit}>
        <PageHeader
          title="修改录像信息"
          action={[
            <Button key="play" onClick={this.play}><Icon type="caret-right" />&nbsp;播放</Button>,
            <Button key="basic" href={`#/p/${info.project_name}/events/${info.event_id}/basic`}>详情</Button>,
          ]}
          content={<HeaderContent info={info} />}
          breadcrumbList={[{ title: null }]}
        />
        <PageBody>
          <Card bordered={false}>
            <Form.Item {...formItemLayout} label="录像名称">
              {getFieldDecorator('desc', {
                initialValue: info.desc,
                rules: [{
                  required: true, message: '请输入录像名称！',
                }],
              })(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="时间">
              {getFieldDecorator('start', {
                initialValue: moment(info.start),
                rules: [{ type: 'object', required: true, message: '请选择开始时间！' }],
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="详细描述" >
              {getFieldDecorator('long_desc', { initialValue: info.long_desc })(<Input.TextArea rows={6} />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="自动删除">
              {getFieldDecorator('checked', {
                valuePropName: 'checked',
                initialValue: 0 !== info.delete_timestamp,
              })(<Switch />)}
            </Form.Item>
            {getFieldValue('checked') && <Form.Item {...formItemLayout} label="自动删除日期">
              {getFieldDecorator('delete_timestamp', {
                initialValue: moment(info.delete_timestamp),
                // rules: [{ type: 'object', required: true, message: '请选择自动删除时间！' }],
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>}
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
                md: { span: 18, offset: 6 },
                lg: { span: 20, offset: 4 },
                xl: { span: 21, offset: 3 },
                xxl: { span: 22, offset: 2 },
              }}
            >
              <Button type="primary" htmlType="submit" loading={this.state.loading}>保存</Button>
            </Form.Item>
          </Card>
        </PageBody>
      </Form>
    );
  }
}


EventInfo.propTypes = {
  info: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
};

const WrappedEventInfo = Form.create()(EventInfo);
// export default Show;
export default connect(state => ({
  info: state.events.info,
}))(WrappedEventInfo);
