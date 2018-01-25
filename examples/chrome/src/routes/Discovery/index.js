import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import styles from './index.less';

class Discovery extends React.PureComponent {
  render() {
    return (
      <div>Discovery</div>
    );
  }
}

Discovery.propTypes = {
  repos: PropTypes.array,
};

export default connect(state => ({
  repos: state.app.repos,
}))(Discovery);
