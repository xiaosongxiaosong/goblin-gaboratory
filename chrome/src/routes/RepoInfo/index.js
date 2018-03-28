import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import styles from './index.less';

class RepoInfo extends React.PureComponent {
  render() {
    return (
      <div>RepoInfo</div>
    );
  }
}

RepoInfo.propTypes = {
  repos: PropTypes.array,
};

export default connect(state => ({
  repos: state.app.repos,
}))(RepoInfo);
