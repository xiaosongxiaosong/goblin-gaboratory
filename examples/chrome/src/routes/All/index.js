import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import styles from './index.less';

class All extends React.PureComponent {
  render() {
    return (
      <div>All</div>
    );
  }
}

All.propTypes = {
  repos: PropTypes.array,
};

export default connect(state => ({
  repos: state.app.repos,
}))(All);
