

export default {
  set: (key, value) => {
    return new Promise((reslove) => {
      try {
        const str = JSON.stringify(value);
        localStorage.setItem(key, str);
        reslove({ data: value });
      } catch (errMsg) {
        reslove({ errMsg });
      }
    });
  },
  get: (key) => {
    return new Promise((reslove) => {
      try {
        const str = localStorage.getItem(key);
        const data = JSON.parse(str);
        reslove({ data });
      } catch (errMsg) {
        reslove({ errMsg });
      }
    });
  },
};
