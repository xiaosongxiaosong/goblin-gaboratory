import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import styles from './index.less';

class All extends React.PureComponent {
  render() {
    return (
      <div>
        {this.props.repos && this.props.repos.map(it => <div>{it}</div>) }
        {this.props.issues && this.props.issues.map(it => <div>{it.title}</div>) }
      </div>
    );
  }
}

All.propTypes = {
  repos: PropTypes.array,
  issues: PropTypes.array,
};

export default connect(state => ({
  repos: state.app.repos,
  issues: state.app.issues,
}))(All);
