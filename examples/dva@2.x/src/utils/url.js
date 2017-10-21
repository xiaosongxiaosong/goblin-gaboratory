const root = 'www.opensight.cn';

const getOrigin = (l) => {
  if (l.origin) {
    return l.origin;
  } else {
    return `${l.protocol}//${l.host}`;
  }
};

const isLocal = (hostname) => {
  return 'localhost' === hostname || 0 === hostname.search(/^[0-9.]+$/);
};

const getWxUrl = (l) => {
  if (isLocal(l.hostname)) {
    return `${l.protocol}//${root}/wx/`;
  } else {
    const pathname = l.pathname.replace(/\/[\w-]+\/[\w-]+\/$/, '/wx/');
    return `${l.protocol}//${l.host}${pathname}`;
  }
};

export default {
  getOrigin,
  getWxUrl,
};
