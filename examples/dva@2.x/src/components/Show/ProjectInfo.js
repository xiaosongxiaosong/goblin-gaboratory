import React from 'react';
// import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import styles from './index.less';


const ProjectInfo = ({
  info,
}) => {
  if (null === info) {
    return null;
  }
  return (
    <div className={styles.projectInfo}>
      <div className={styles.projectLogo}>
        <Avatar shape="square" size="large" src={info.logo_url} />
      </div>
      <div className={styles.projectDesc}>
        <h3>{info.title}</h3>
        <pre className={styles.descContiner}>{info.desc}</pre>
        {/* <p>{info.desc}</p> */}
      </div>
    </div>
  );
};

// Info.propTypes = {
//   info: PropTypes.string,
// };

export default ProjectInfo;
