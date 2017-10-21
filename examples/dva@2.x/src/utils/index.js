import config from './config';
import request from './request';
import resource from './resource';
import filter from './filter';
import storage from './storage';
import liveFormat from './liveFormat';
import liveQuality from './liveQuality';
import url from './url';
import watchPassword from './watchPassword';

const delay = (timeout) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, timeout);
  });
};

let idIndex = 1000;
const genId = (prefix = 'gened_id_') => {
  const id = `${prefix}${idIndex}`;
  idIndex += 1;
  return id;
};

const isInTimeRange = (start, end) => {
  const dt = new Date();
  const second = (dt.getHours() * 60 * 60) + (dt.getMinutes() * 60) + dt.getSeconds();
  if (start < end) {
    return second >= start && second < end;
  } else if (start > end) {
    return second >= start || second < end;
  } else {
    return true;
  }
};

export default {
  config,
  request,
  resource,
  delay,
  genId,
  filter,
  storage,
  liveFormat,
  liveQuality,
  url,
  isInTimeRange,
  watchPassword,
};
