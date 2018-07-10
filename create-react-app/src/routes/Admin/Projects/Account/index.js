import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import { Button, Card, Form, Input, Row, Col, Radio, Checkbox, DatePicker, InputNumber, Select } from 'antd';
import Loading from '../../../Loading';
import { projectState, accountType, parseOnOff, parseEnableDisable } from '../../../../utils/filter';
import styles from './index.less';

const ProjectStateForm = Form.create()(({
  info,
  form,
  onSubmit,
}) => {
  return (<Form
    onSubmit={(e) => {
      e.preventDefault();
      form.validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          onSubmit(values);
        }
      });
    }}
  >
    <Form.Item label="商户状态">
      {form.getFieldDecorator('state', {
        initialValue: info.state,
      })(<Radio.Group>
        {[0, 1, 2].map(it => <Radio key={it} value={it}>{projectState(it)}</Radio>)}
      </Radio.Group>)}
    </Form.Item>
    <div className="ant-row ant-form-item">
      <div className="ant-form-item-label">
        <span title="异常原因">异常原因:</span>
      </div>
      <div className="ant-form-item-control-wrapper">
        <div className="ant-form-item-control">
          <span className="ant-form-item-children">
            {form.getFieldDecorator('exception_policy_violation', {
              valuePropName: 'checked',
              initialValue: info.exception_policy_violation,
            })(<Checkbox>违规</Checkbox>)}
            {form.getFieldDecorator('exception_session_duration_quota_run_out', {
              valuePropName: 'checked',
              initialValue: info.exception_session_duration_quota_run_out,
            })(<Checkbox>欠费</Checkbox>)}
            {form.getFieldDecorator('exception_unauthenticated', {
              valuePropName: 'checked',
              initialValue: info.exception_unauthenticated,
            })(<Checkbox>未认证</Checkbox>)}
            {form.getFieldDecorator('exception_expired', {
              valuePropName: 'checked',
              initialValue: info.exception_expired,
            })(<Checkbox>服务过期</Checkbox>)}
          </span>
        </div>
      </div>
    </div>
    <Form.Item>
      <Button type="primary" htmlType="submit">保存</Button>
    </Form.Item>
  </Form>);
});

const ProjectAccountForm = Form.create()(({
  account,
  form,
  onSubmit,
}) => {
  return (<Form
    onSubmit={(e) => {
      debugger;
      e.preventDefault();
      form.validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          onSubmit(values);
        }
      });
    }}
  >
    <Form.Item label="商户等级">
      {form.getFieldDecorator('account_type', {
        initialValue: account.account_type,
      })(<Radio.Group>
        {[2, 0, 1].map(it => <Radio key={it} value={it}>{accountType(it)}</Radio>)}
      </Radio.Group>)}
    </Form.Item>
    <Form.Item label="年费(元/年)">
      {form.getFieldDecorator('annual_price', {
        initialValue: account.annual_price,
        rules: [{ required: true, message: '请输入年费' }],
      })(<InputNumber />)}
    </Form.Item>
    <Form.Item label="是否过期">
      {form.getFieldDecorator('due_enabled', {
        valuePropName: 'checked',
        initialValue: '1970-01-01T08:00:00' !== account.due_time,
      })(<Checkbox>永不过期</Checkbox>)}
    </Form.Item>
    <Form.Item label="过期时间">
      {form.getFieldDecorator('due_time', {
        initialValue: moment(account.due_time),
      })(<DatePicker allowClear={false} showTime={false} />)}
    </Form.Item>
    <Form.Item label="计费信息" >
      {form.getFieldDecorator('price_info', { initialValue: account.price_info })(<Input.TextArea rows={5} />)}
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">保存</Button>
    </Form.Item>
  </Form>);
});

const StorageQuotaForm = Form.create()(({
  storageQuota,
  form,
  onSubmit,
}) => {
  return (<Form
    onSubmit={(e) => {
      debugger;
      e.preventDefault();
      form.validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          onSubmit(values);
        }
      });
    }}
  >
    <div className="ant-row ant-form-item">
      <div className="ant-form-item-label">
        <span title="已使用空间">已使用空间:</span>
      </div>
      <div className="ant-form-item-control-wrapper">
        <div className="ant-form-item-control has-success">
          <span className="ant-form-item-children">{numeral(storageQuota.used).format('0.0 b')}</span>
        </div>
      </div>
    </div>
    <Form.Item
      label="存储配额(GB)"
      extra={<React.Fragment>
        <span className={styles.badge}>10 GB</span>
        <span className={styles.badge}>100 GB</span>
        <span className={styles.badge}>200 GB</span>
        <span className={styles.badge}>1 TB</span>
      </React.Fragment>}
    >
      {form.getFieldDecorator('quota', {
        initialValue: storageQuota.quota / 1000000000,
        rules: [{ required: true, message: '请输入存储配额' }],
      })(<InputNumber />)}
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">保存</Button>
    </Form.Item>
  </Form>);
});

const QuotaForm = Form.create()(({
  quota,
  form,
  onSubmit,
}) => {
  return (<Form
    onSubmit={(e) => {
      debugger;
      e.preventDefault();
      form.validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          onSubmit(values);
        }
      });
    }}
  >
    <Form.Item
      label="最大报名学员数量"
      extra={<span>默认50，0表示没有上限</span>}
    >
      {form.getFieldDecorator('application_user_count', {
        initialValue: quota.application_user_count,
        rules: [{ required: true, message: '请输入最大报名学员数量' }],
      })(<InputNumber />)}
    </Form.Item>
    <Form.Item
      label="最大教员数量"
      extra={<span>默认10，0表示没有上限</span>}
    >
      {form.getFieldDecorator('user_count', {
        initialValue: quota.user_count,
        rules: [{ required: true, message: '请输入最大教员数量' }],
      })(<InputNumber />)}
    </Form.Item>
    <Form.Item
      label="最大课堂日增量"
      extra={<span>默认10，0表示没有上限</span>}
    >
      {form.getFieldDecorator('live_show_incr_daily', {
        initialValue: quota.live_show_incr_daily,
        rules: [{ required: true, message: '请输入最大课堂日增量' }],
      })(<InputNumber />)}
    </Form.Item>
    <Form.Item label="回放并发参数">
      {form.getFieldDecorator('vp_param', {
        initialValue: quota.vp_param,
        rules: [{ required: true, message: '请输入回放并发参数' }],
      })(<InputNumber />)}
    </Form.Item>
    <Form.Item label="回放会话参数">
      {form.getFieldDecorator('vs_param', {
        initialValue: quota.vs_param,
        rules: [{ required: true, message: '请输入回放会话参数' }],
      })(<InputNumber step={0.01} />)}
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">保存</Button>
    </Form.Item>
  </Form>);
});

const QuotaAccountingForm = Form.create()(({
  quota,
  form,
  onSubmit,
}) => {
  return (<Form
    onSubmit={(e) => {
      debugger;
      e.preventDefault();
      form.validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          onSubmit(values);
        }
      });
    }}
  >
    <Form.Item label="计费方式">
      {form.getFieldDecorator('session_mode', {
        initialValue: quota.session_mode,
      })(<Radio.Group>
        {[2, 0, 1].map(it => <Radio key={it} value={it}>{projectState(it)}</Radio>)}
      </Radio.Group>)}
    </Form.Item>
    <Form.Item
      label="最大并发"
      extra={<span>0 表示不限制</span>}
    >
      {form.getFieldDecorator('session_count', {
        initialValue: quota.session_count,
        rules: [{ required: true, message: '请输入最大并发' }],
      })(<InputNumber />)}
    </Form.Item>
    <div className="ant-row ant-form-item">
      <div className="ant-form-item-label">
        <span title="已使用空间">剩余观看时长（分钟）:</span>
      </div>
      <div className="ant-form-item-control-wrapper">
        <div className="ant-form-item-control has-success">
          <span className="ant-form-item-children">
            <span>{quota.last_top_up_session_duration}</span>
            <a>充值</a>
          </span>
        </div>
      </div>
    </div>
    <Form.Item label="自动充值">
      {form.getFieldDecorator('auto_session_duration_top_up_period', {
        initialValue: quota.auto_session_duration_top_up_period,
      })(<Radio.Group>
        {[0, -1, -2].map(it => <Radio key={it} value={it}>{projectState(it)}</Radio>)}
      </Radio.Group>)}
    </Form.Item>
    <Form.Item label="自动充值额度（分钟）">
      {form.getFieldDecorator('auto_session_duration_top_up_value', {
        initialValue: quota.auto_session_duration_top_up_value,
      })(<InputNumber />)}
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">保存</Button>
    </Form.Item>
  </Form>);
});

const FeatureForm = Form.create()(({
  quota,
  onlineSchoolConfig,
  form,
  onSubmit,
}) => {
  return (<Form
    onSubmit={(e) => {
      debugger;
      e.preventDefault();
      form.validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          onSubmit(values);
        }
      });
    }}
  >
    <Form.Item label="页脚自定义">
      {form.getFieldDecorator('logo_customization_on', {
        initialValue: onlineSchoolConfig.logo_customization_on,
      })(<Radio.Group>
        {[true, false].map(it => <Radio key={it} value={it}>{parseOnOff(it)}</Radio>)}
      </Radio.Group>)}
    </Form.Item>
    <Form.Item label="录像剪辑">
      {form.getFieldDecorator('video_edit', {
        initialValue: quota.video_edit,
      })(<Radio.Group>
        {[true, false].map(it => <Radio key={it} value={it}>{parseOnOff(it)}</Radio>)}
      </Radio.Group>)}
    </Form.Item>
    <Form.Item label="显示学员信息">
      {form.getFieldDecorator('display_detailed_student_info', {
        initialValue: quota.display_detailed_student_info,
      })(<Radio.Group>
        {[true, false].map(it => <Radio key={it} value={it}>{parseOnOff(it)}</Radio>)}
      </Radio.Group>)}
    </Form.Item>
    <Form.Item
      label="广告布局方式"
      extra={<span>0 表示没有广告</span>}
    >
      {form.getFieldDecorator('ad_layout', {
        initialValue: onlineSchoolConfig.ad_layout,
        rules: [{ required: true, message: '请输入最大并发' }],
      })(<InputNumber />)}
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">保存</Button>
    </Form.Item>
  </Form>);
});

const WechatMerchantForm = Form.create()(({
  wechatMerchant,
  form,
  onSubmit,
}) => {
  return (<Form
    onSubmit={(e) => {
      debugger;
      e.preventDefault();
      form.validateFieldsAndScroll((errors, values) => {
        if (!errors) {
          onSubmit(values);
        }
      });
    }}
  >
    <Form.Item label="微信支付">
      {form.getFieldDecorator('wechat_pay', {
        initialValue: wechatMerchant.wechat_pay,
      })(<Radio.Group>
        {[true, false].map(it => <Radio key={it} value={it}>{parseEnableDisable(it)}</Radio>)}
      </Radio.Group>)}
    </Form.Item>
    <Form.Item label="商户类型">
      {form.getFieldDecorator('merchant_type', {
        initialValue: wechatMerchant.merchant_type,
        // rules: [{ required: true, message: '请选择商户类型' }],
      })(<Select>
        <Select.Option value={0}>不可用</Select.Option>
        <Select.Option value={1}>特约商户</Select.Option>
        <Select.Option value={2}>直接商户</Select.Option>
      </Select>)}
    </Form.Item>
    <Form.Item label="微信支付商户号">
      {form.getFieldDecorator('mch_id', {
        initialValue: wechatMerchant.mch_id,
        // rules: [{ required: true, message: '微信支付商户号' }],
      })(<Input />)}
    </Form.Item>
    <Form.Item label="开户银行">
      {form.getFieldDecorator('bank', {
        initialValue: wechatMerchant.bank,
        // rules: [{ required: true, message: '微信支付商户号' }],
      })(<Input />)}
    </Form.Item>
    <Form.Item label="银行账号">
      {form.getFieldDecorator('bank_account', {
        initialValue: wechatMerchant.bank_account,
        // rules: [{ required: true, message: '微信支付商户号' }],
      })(<Input />)}
    </Form.Item>
    <Form.Item label="银行账户名称">
      {form.getFieldDecorator('bank_account_name', {
        initialValue: wechatMerchant.bank_account_name,
        // rules: [{ required: true, message: '微信支付商户号' }],
      })(<Input />)}
    </Form.Item>
    <Form.Item label="App Id">
      {form.getFieldDecorator('appid', {
        initialValue: wechatMerchant.appid,
        // rules: [{ required: true, message: '微信支付商户号' }],
      })(<Input />)}
    </Form.Item>
    <Form.Item label="API Key">
      {form.getFieldDecorator('api_key', {
        initialValue: wechatMerchant.api_key,
        // rules: [{ required: true, message: '微信支付商户号' }],
      })(<Input />)}
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">保存</Button>
    </Form.Item>
  </Form>);
});

const Account = ({
  loading,
  info,
  account,
  storageQuota,
  quota,
  onlineSchoolConfig,
  wechatMerchant,
  // dispatch,
}) => {
  if (loading) {
    return <Loading />;
  }

  return (
    <Row gutter={16}>
      {info && <Col md={12} xl={8}>
        <Card bordered={false} title="商户状态" className={styles.formCard}>
          <ProjectStateForm
            info={info}
            onSubmit={() => {
              debugger;
            }}
          />
        </Card>
      </Col>}
      {account && <Col md={12} xl={8}>
        <Card bordered={false} title="账户信息" className={styles.formCard}>
          <ProjectAccountForm
            account={account}
            onSubmit={() => {
              debugger;
            }}
          />
        </Card>
      </Col>}
      {storageQuota && <Col md={12} xl={8}>
        <Card bordered={false} title="存储配额" className={styles.formCard}>
          <StorageQuotaForm
            storageQuota={storageQuota}
            onSubmit={() => {
              debugger;
            }}
          />
        </Card>
      </Col>}
      {quota && <Col md={12} xl={8}>
        <Card bordered={false} title="项目配额" className={styles.formCard}>
          <QuotaForm
            quota={quota}
            onSubmit={() => {
              debugger;
            }}
          />
        </Card>
      </Col>}
      {quota && <Col md={12} xl={8}>
        <Card bordered={false} title="计费配置" className={styles.formCard}>
          <QuotaAccountingForm
            quota={quota}
            onSubmit={() => {
              debugger;
            }}
          />
        </Card>
      </Col>}
      {quota && onlineSchoolConfig && <Col md={12} xl={8}>
        <Card bordered={false} title="功能开关" className={styles.formCard}>
          <FeatureForm
            quota={quota}
            onlineSchoolConfig={onlineSchoolConfig}
            onSubmit={() => {
              debugger;
            }}
          />
        </Card>
      </Col>}
      {wechatMerchant && <Col md={12} xl={8}>
        <Card bordered={false} title="支付配置" className={styles.formCard}>
          <WechatMerchantForm
            wechatMerchant={wechatMerchant}
            onSubmit={() => {
              debugger;
            }}
          />
        </Card>
      </Col>}
    </Row>);
};

Account.propTypes = {
  loading: PropTypes.bool,
  info: PropTypes.object,
  account: PropTypes.object,
  storageQuota: PropTypes.object,
  quota: PropTypes.object,
  onlineSchoolConfig: PropTypes.object,
  wechatMerchant: PropTypes.object,
};

// export default Show;
export default connect(state => ({
  loading: state['project-account'].loading,
  info: state.projects.info,
  account: state['project-account'].account,
  storageQuota: state['project-account'].storageQuota,
  quota: state['project-account'].quota,
  onlineSchoolConfig: state['project-account'].onlineSchoolConfig,
  wechatMerchant: state['project-account'].wechatMerchant,
}))(Account);
