import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import moment from 'moment';
import { Link } from 'dva/router';
import { Button, Card, Form, Input, Switch, Row, Col } from 'antd';
import Exception from 'ant-design-pro/lib/Exception';
import Loading from '../../../Loading';

// import styles from './EventInfo.less';

const ProjectDetail = ({
  info,
  saving,
  form,
  dispatch,
}) => {
  if (undefined === info) {
    return <Loading />;
  } else if (null === info) {
    return (<Exception
      type="404"
      title="获取录像信息失败"
      desc=""
      actions={[<Link key="projects" replace to="/projects">查看所有商户</Link>]}
    />);
  }

  return (<Card bordered={false}>
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        form.validateFieldsAndScroll((errors, values) => {
          if (errors) {
            return;
          }
          dispatch({ type: 'projects/saveProjectInfo', payload: { projectName: info.name, ...values } });
        });
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="商户名称">
            {form.getFieldDecorator('title', {
              initialValue: info.title,
              rules: [{ required: true, message: '请输入商户名称' }],
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label="地址">
            {form.getFieldDecorator('desc', { initialValue: info.desc })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="详细描述" >
            {form.getFieldDecorator('long_desc', { initialValue: info.long_desc })(<Input.TextArea rows={5} />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="客服">
            {form.getFieldDecorator('csm', { initialValue: info.csm })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="客服电话">
            {form.getFieldDecorator('csm_phone', { initialValue: info.csm_phone })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="客服微信">
            {form.getFieldDecorator('csm_wechat', { initialValue: info.csm_wechat })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="是否公开">
            {form.getFieldDecorator('is_public', {
              valuePropName: 'checked',
              initialValue: info.is_public,
            })(<Switch />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="流并发数">
            {form.getFieldDecorator('max_media_sessions', { initialValue: info.max_media_sessions })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="媒体服务器">
            {form.getFieldDecorator('media_server', { initialValue: info.media_server })(<Input />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>保存</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Card>);
};
// class ProjectDetail extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.onSubmit = this.onSubmit.bind(this);
//   }
//   onSubmit(e) {
//     e.preventDefault();
//     this.props.form.validateFieldsAndScroll((errors, values) => {
//       if (errors) {
//         return;
//       }
//       this.props.dispatch({ type: 'projects/saveProjectInfo', payload: { projectName: this.props.info.name, ...values } });
//     });
//   }
//   render() {
//     const { info, saving } = this.props;
//     if (undefined === info) {
//       return <Loading />;
//     } else if (null === info) {
//       return (<Exception
//         type="404"
//         title="获取录像信息失败"
//         desc=""
//         actions={[<Link key="projects" replace to="/projects">查看所有商户</Link>]}
//       />);
//     }
//     const { getFieldDecorator } = this.props.form;

//     return (<Card bordered={false}>
//       <Form onSubmit={this.onSubmit}>
//         <Row gutter={16}>
//           <Col span={8}>
//             <Form.Item label="商户名称">
//               {getFieldDecorator('title', {
//                 initialValue: info.title,
//                 rules: [{ required: true, message: '请输入商户名称' }],
//               })(<Input />)}
//             </Form.Item>
//           </Col>
//           <Col span={16}>
//             <Form.Item label="地址">
//               {getFieldDecorator('desc', { initialValue: info.desc })(<Input />)}
//             </Form.Item>
//           </Col>
//           <Col span={24}>
//             <Form.Item label="详细描述" >
//               {getFieldDecorator('long_desc', { initialValue: info.long_desc })(<Input.TextArea rows={5} />)}
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item label="客服">
//               {getFieldDecorator('csm', { initialValue: info.csm })(<Input />)}
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item label="客服电话">
//               {getFieldDecorator('csm_phone', { initialValue: info.csm_phone })(<Input />)}
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item label="客服微信">
//               {getFieldDecorator('csm_wechat', { initialValue: info.csm_wechat })(<Input />)}
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item label="是否公开">
//               {getFieldDecorator('is_public', {
//                 valuePropName: 'checked',
//                 initialValue: info.is_public,
//               })(<Switch />)}
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item label="流并发数">
//               {getFieldDecorator('max_media_sessions', { initialValue: info.max_media_sessions })(<Input />)}
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item label="媒体服务器">
//               {getFieldDecorator('media_server', { initialValue: info.media_server })(<Input />)}
//             </Form.Item>
//           </Col>
//           <Col span={24}>
//             <Form.Item>
//               <Button type="primary" htmlType="submit" loading={saving}>保存</Button>
//             </Form.Item>
//           </Col>
//         </Row>
//       </Form>
//     </Card>);
//   }
// }


ProjectDetail.propTypes = {
  info: PropTypes.object,
  saving: PropTypes.bool,
};

// export default Show;
export default connect(state => ({
  info: state.projects.info,
}))(Form.create()(ProjectDetail));
