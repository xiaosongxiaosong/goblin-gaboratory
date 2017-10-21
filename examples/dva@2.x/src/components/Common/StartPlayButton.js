import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const StartPlayButton = ({
  // url,
  handleClick,
}) => {
  return (
    <div onClick={handleClick} className={styles.startPlayButton} />
  );
};

StartPlayButton.propTypes = {
  // url: PropTypes.string,
  handleClick: PropTypes.func,
};

export default StartPlayButton;
