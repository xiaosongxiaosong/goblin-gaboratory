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
      opened,
      toggle,
      toggleFavorite,
    } = this.props;
    // debugger;
    return (
      <List.Item className={styles.issue}>
        <Avatar size="small" src={issue.user.avatar_url} />
        <div className={styles.user}>{issue.user.login}</div>
        <div onClick={() => toggle(issue)} className={issue.read ? styles.title : styles.unreadTitle}>{issue.title}</div>
        <div className={styles.time}>{moment(issue.created_at).format('YYYY年M月D日')}</div>
        <div className={styles.actions}>
          {(!issue.favorite) && <Icon onClick={() => toggleFavorite(issue)} type="heart-o" />}
          {issue.favorite && <Icon onClick={() => toggleFavorite(issue)} type="heart" />}
          <Icon type="enter" />
        </div>
        {opened === issue.url && <IssueDetail issue={issue} />}
      </List.Item>
    );
  }
}

Issue.propTypes = {
  issue: PropTypes.object,
  opened: PropTypes.string,
  toggle: PropTypes.func,
  toggleFavorite: PropTypes.func,
};

export default Issue;
