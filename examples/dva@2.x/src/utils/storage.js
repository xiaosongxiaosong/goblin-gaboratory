let prefix = 'sharepage';
const separator = '--';
// let storage = {};

const getRealPrefix = () => {
  return `${prefix}${separator}`;
};
const getRealKey = (key) => {
  return `${getRealPrefix()}${key}`;
};

const checkPrefix = (pre) => {
  const mat = pre.match(/^[\w]+$/);
  return (null !== mat);
};

export default {
  getPrefix() {
    return prefix;
  },
  setPrefix(pre = 'sharepage') {
    if (checkPrefix(pre)) {
      prefix = pre;
      return prefix;
    } else {
      return prefix;
    }
  },
  get(key) {
    const k = getRealKey(key);
    return window.localStorage.getItem(k);
  },
  set(key, value) {
    const k = getRealKey(key);
    return window.localStorage.setItem(k, value);
  },
  remove(key) {
    const k = getRealKey(key);
    return window.localStorage.removeItem(k);
  },
  clear() {
    const realPrefix = getRealPrefix();
    for (let i = window.localStorage.length - 1; 0 <= i; i -= 1) {
      const key = window.localStorage.key(i);
      if (0 === key.indexOf(realPrefix)) {
        window.localStorage.removeItem(key);
      }
    }
  },
};
