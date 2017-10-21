import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import { filter } from '../../utils';

const PublicInfo = ({
  info,
}) => {
  if (info) {
    let tip = '';
    if (info.is_public) {
      const start = filter.dateFormat((info.public_start + (16 * 60 * 60)) * 1000, 'HH:mm:ss');
      const end = filter.dateFormat((info.public_end + (16 * 60 * 60)) * 1000, 'HH:mm:ss');
      if (info.public_start < info.public_end) {
        tip = `${start} - ${end} 公开`;
      } else if (info.public_start > info.public_end) {
        tip = `${start} - 次日 ${end} 公开`;
      } else {
        tip = '全天公开';
      }
    } else {
      tip = '未公开';
    }
    return (<span className={styles.bottomBarBtn}>{tip}</span>);
  } else {
    return null;
  }
};

PublicInfo.propTypes = {
  info: PropTypes.object,
};

export default PublicInfo;
