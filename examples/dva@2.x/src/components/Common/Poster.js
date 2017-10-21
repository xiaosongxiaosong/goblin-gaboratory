import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

const Poster = ({
  url,
}) => {
  return (
    <div>
      <div className={styles.poster} style={{ backgroundImage: `url(${url})` }} />
      <div className={styles.posterMask} />
    </div>
  );
};

Poster.propTypes = {
  url: PropTypes.string,
};

export default Poster;
