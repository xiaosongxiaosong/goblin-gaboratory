// import 'flv.js';
// import mejs from 'mediaelement';
import storage from './storage';

const key = 'watchPassword';

const checkWatchPassword = (passwd) => {
  const pwd = parseInt(passwd, 10);
  return false === isNaN(pwd) && 100000 <= pwd && 1000000 > pwd;
};

const getWatchPassword = () => {
  const passwd = storage.get(key);
  if (checkWatchPassword(passwd)) {
    return parseInt(passwd, 10);
  } else {
    return null;
  }
};

const setWatchPassword = (passwd) => {
  if (checkWatchPassword(passwd)) {
    storage.set(key, passwd);
    return true;
  } else {
    return false;
  }
};

export default {
  checkWatchPassword,
  getWatchPassword,
  setWatchPassword,
};
