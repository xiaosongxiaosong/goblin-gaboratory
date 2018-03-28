import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import moment from 'moment';
import { Button, Card, List } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
// import { MarkdownPreview } from 'react-marked-markdown';
// import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import Loading from '../Loading';
import Issue from '../Issue';

import styles from './index.less';


class All extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: undefined,
    };
    this.toggle = this.toggle.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }
  toggle(item) {
    if (this.state.opened === item.url) {
      this.setState({ opened: undefined });
    } else {
      if (!item.read) {
        this.props.dispatch({ type: 'app/markAsRead', payload: item });
      }
      this.setState({ opened: item.url });
    }
  }
  toggleFavorite(item) {
    this.props.dispatch({ type: 'app/toggleFavorite', payload: item });
  }
  render() {
    const { issues } = this.props;
    const { opened } = this.state;
    if (!issues) {
      return <Loading />;
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
              // itemLayout="vertical"
              // rowKey="id"
              className={styles.list}
              dataSource={issues}
              renderItem={item => <Issue issue={item} opened={opened} toggle={this.toggle} toggleFavorite={this.toggleFavorite} />}
            />
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

All.propTypes = {
  issues: PropTypes.array,
  dispatch: PropTypes.func,
};

export default connect(state => ({
  // repos: state.app.repos,
  issues: state.app.issues,
}))(All);
