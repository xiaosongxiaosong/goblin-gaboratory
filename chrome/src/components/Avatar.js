import React from 'react';
import PropTypes from 'prop-types';
import Image from './Image';
import styles from './Avatar.less';

class Avatar extends React.PureComponent {
  render() {
    return (
      <span className={styles.avatar}>
        <Image src={this.props.src} alt={this.props.alt} />
      </span>
    );
  }
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

export default Avatar;
