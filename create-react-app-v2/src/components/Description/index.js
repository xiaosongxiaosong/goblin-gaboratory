import React from 'react';
import PropTypes from 'prop-types';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from './index.less';

const NoneDesc = ({ style }) => {
  return <div className={styles.italic} style={style}>无描述信息</div>;
};

const Description = ({
  lines,
  children,
}) => {
  if (lines && 0 < lines) {
    const style = { minHeight: `${lines * 1.5}em` };
    if (!children || '' === children) {
      return <NoneDesc style={style} />;
    } else {
      return (<Ellipsis lines={lines} style={style}>
        <pre className={styles.desc}>{children}</pre>
      </Ellipsis>);
    }
  } else if (!children || '' === children) {
    return <NoneDesc />;
  } else {
    return (<pre className={styles.desc}>{children}</pre>);
  }
};

Description.propTypes = {
  children: PropTypes.string,
  lines: PropTypes.number,
};

export default Description;
