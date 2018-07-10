import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';

import ShowAnalysis from './ShowAnalysis';
import CameraAnalysis from './CameraAnalysis';
import EventAnalysis from './EventAnalysis';
import StorageAnalysis from './StorageAnalysis';
// import { gutter } from '../common/';
import styles from './ProjectAnalysis.less';

const ProjectAnalysis = ({
  name,
}) => {
  // const gutter = { xs: 8, sm: 12, md: 16, lg: 24 };
  const colResponsiveProps = { xs: 24, sm: 12, md: 12, lg: 12, xl: 6 };

  return (
    <div className={styles.analysisContainer}>
      <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }} className={styles.analysisRow}>
        <Col {...colResponsiveProps} className={styles.analysisCol}>
          <ShowAnalysis name={name} />
        </Col>
        <Col {...colResponsiveProps} className={styles.analysisCol}>
          <CameraAnalysis name={name} />
        </Col>
        <Col {...colResponsiveProps} className={styles.analysisCol}>
          <EventAnalysis name={name} />
        </Col>
        <Col {...colResponsiveProps} className={styles.analysisCol}>
          <StorageAnalysis name={name} />
        </Col>
      </Row>
    </div>
  );
};

ProjectAnalysis.propTypes = {
  name: PropTypes.string,
};

export default ProjectAnalysis;
