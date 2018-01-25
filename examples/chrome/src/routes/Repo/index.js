import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import styles from './index.less';

class Repo extends React.PureComponent {
  render() {
    return (
      <div>Repo</div>
    );
  }
}

Repo.propTypes = {
  repos: PropTypes.array,
};

export default connect(state => ({
  repos: state.app.repos,
}))(Repo);
