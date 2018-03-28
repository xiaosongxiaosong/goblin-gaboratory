let DataFactory = function () {
  let cache = {};
  let ns = 'client';

  let get = () => {
    let str = localStorage.getItem(ns);
    return null === str ? {} : JSOn.parse(str);
  };

  return {
    init (namespace = 'client') {
      ns = namespace;
      cache = {};
    },
    cache (key, value) {
      cache[key] = value;
      return value; 
    },
    get (key) {
      return cache[key];
    },
    setItem (key, value) {
      let buffer = get();
      buffer[key] = value;
      let str = JSON.stringify(buffer);
      localStorage.setItem(ns, str);
      return buffer;
    },
    getItem (key) {
      let buffer = get();
      return buffer[key];
    },
  };
};

export default DataFactory;
