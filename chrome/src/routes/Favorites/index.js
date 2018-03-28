import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import styles from './index.less';

class Favorites extends React.PureComponent {
  render() {
    return (
      <div>Favorites</div>
    );
  }
}

Favorites.propTypes = {
  repos: PropTypes.array,
};

export default connect(state => ({
  repos: state.app.repos,
}))(Favorites);
