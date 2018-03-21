import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { List, Avatar, Icon } from 'antd';
import IssueDetail from './IssueDetail';

import styles from './Issue.less';


class Issue extends React.PureComponent {
  render() {
    // eslint-disable-next-line
    const {
      issue,
      expanded,
      toggle,
      toggleStar,
    } = this.props;
    return (
      <List.Item className={styles.issue}>
        <Avatar size="small" src={issue.user.avatar_url} />
        <div className={styles.user}>{issue.user.login}</div>
        <div onClick={() => toggle(issue)} className={styles.title}>{issue.title}</div>
        <div className={styles.time}>{moment(issue.created_at).format('YYYY年M月D日')}</div>
        <div className={styles.actions}>
          <Icon onClick={() => toggleStar(issue)} type="heart-o" />
          <Icon onClick={() => toggleStar(issue)} type="heart" />
          <Icon type="enter" />
        </div>
        {expanded === issue.html_url && <IssueDetail issue={issue} />}
      </List.Item>
    );
  }
}

Issue.propTypes = {
  issue: PropTypes.object,
  expanded: PropTypes.string,
  toggle: PropTypes.func,
  toggleStar: PropTypes.func,
};

export default Issue;
