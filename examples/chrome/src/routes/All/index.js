import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Button, Card, List, Avatar } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

import styles from './index.less';

class All extends React.PureComponent {
  render() {
    const { issues } = this.props;
    if (!issues) {
      return <div>loading</div>;
    }
    return (
      <React.Fragment>
        <PageHeader
          title="所有"
          action={<Button type="primary">刷新</Button>}
          breadcrumbList={[{ title: null }]}
        />
        <div className={styles.container}>
          <Card bordered={false}>
            <List
              size="large"
              itemLayout="vertical"
              rowKey="id"
              dataSource={issues}
              renderItem={item => (
                <List.Item
                  key={item.url}
                  actions={[
                    <a>阅读全文</a>,
                    <a>收藏/取消收藏</a>,
                    <a>原文链接</a>,
                  ]}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={<div><Avatar size="small" src={item.user.avatar_url} />{item.user.login}</div>}
                  />
                  <Ellipsis lines={5}>{item.body}</Ellipsis>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

All.propTypes = {
  // repos: PropTypes.array,
  // issues: PropTypes.array,
};

export default connect(state => ({
  repos: state.app.repos,
  issues: state.app.issues,
}))(All);
