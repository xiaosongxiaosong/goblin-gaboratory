import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Avatar } from 'antd';
import Marked from '../components/Marked';

import styles from './IssueDetail.less';

class IssueDetail extends React.PureComponent {
  render() {
    // eslint-disable-next-line
    const { issue } = this.props;
    return (
      <div className={styles.issue}>
        <div className={styles.context}>
          <h1>{issue.title}</h1>
          <p>
            <span className={styles.user}><Avatar size="small" src={issue.user.avatar_url} />{issue.login}</span>
            <span className={styles.time}>{moment(issue.created_at).format('YYYY年M月D日')}</span>
          </p>
          <Marked context={issue.body} />
        </div>
      </div>
    );
  }
}

IssueDetail.propTypes = {
  issue: PropTypes.object,
};

export default IssueDetail;
