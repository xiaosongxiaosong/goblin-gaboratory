

export default {
  set: (items) => {
    return new Promise((reslove, reject) => {
      try {
        chrome.storage.sync.set(items, () => {
          reslove(true);
        });
      } catch (errMsg) {
        reject({ errMsg });
      }
    });
  },
  get: (keys) => {
    return new Promise((reslove, reject) => {
      try {
        chrome.storage.sync.get(keys, (items) => {
          reslove({ items });
        });
      } catch (errMsg) {
        reject({ errMsg });
      }
    });
  },
};
