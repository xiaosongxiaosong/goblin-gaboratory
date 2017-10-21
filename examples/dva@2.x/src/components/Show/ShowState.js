import React from 'react';
import PropTypes from 'prop-types';
import { filter } from '../../utils';

const ShowState = ({
  info,
  countdown,
}) => {
  if (null === info) {
    return null;
  }
  let tip = '';
  if (1 === info.state) {
    tip = '正在直播';
  } else if (2 === info.state) {
    tip = '公开课暂停中';
  } else if (3 === info.state) {
    tip = '公开课已结束';
  } else if (null !== countdown && 0 <= countdown) {
    tip = `${filter.duration(countdown)} 之后公开课开始`;
  } else {
    tip = '公开课未开始';
  }
  return (
    <span>{tip}</span>
  );
};

ShowState.propTypes = {
  info: PropTypes.object,
  countdown: PropTypes.number,
};

export default ShowState;
