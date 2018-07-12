import React from 'react';
import PropTypes from 'prop-types';

import Description from '../../../components/Description';
import Phone from '../../../components/Phone';
import Address from '../../../components/Address';

const ProjectInfo = ({
  info,
}) => {
  if (!info) {
    return null;
  }
  return (
    <div>
      <Phone>{info.phone}</Phone>
      <Address>{info.desc}</Address>
      <Description lines={2}>{info.long_desc}</Description>
    </div>
  );
};

ProjectInfo.propTypes = {
  info: PropTypes.object,
};

export default ProjectInfo;
