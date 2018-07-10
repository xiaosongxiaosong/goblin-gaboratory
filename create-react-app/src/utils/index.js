import { notification } from 'antd';
// import config from './config';
// import {request, requestWithoutJwt} from './request';
// import resource from './resource';
// import filter from './filter';
// import storage from './storage';
// import liveFormat from './liveFormat';
// import liveQuality from './liveQuality';
// import url from './url';
// import auth from './auth';
// import watchPassword from './watchPassword';

export function delay(timeout) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, timeout);
  });
}

let idIndex = 1000;
export function genId(prefix = 'gened_id_') {
  const id = `${prefix}${idIndex}`;
  idIndex += 1;
  return id;
}

export function isInTimeRange(start, end) {
  const dt = new Date();
  const second = (dt.getHours() * 60 * 60) + (dt.getMinutes() * 60) + dt.getSeconds();
  if (start < end) {
    return second >= start && second < end;
  } else if (start > end) {
    return second >= start || second < end;
  } else {
    return true;
  }
}

export function notifyRequestError(errMsg, msg) {
  let message = msg;
  const status = errMsg.response && errMsg.response.status;
  if (403 === status) {
    message = `权限不足，${msg}`;
  } else if (421 === status) {
    message = `套餐已过期，${msg}`;
  } else if (422 === status) {
    message = `存储配额已用完，${msg}`;
  }
  message = message.replace(/，$/, '。');
  return notification.error({ message });
}

export function generateUUID() {
  let d = new Date().getTime();
  let str = '';
  for (let i = 0; 16 > i; i += 1) {
    const r = (d + (Math.random() * 256)) % 256;
    d = Math.floor(d / 4);
    str += String.fromCharCode(r);
  }
  const uuid = window.btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/==$/, '');
  return uuid;
}

export function getScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    document.body.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    script.src = src;
  });
}

// export {
//   config,
//   resource,
//   filter,
//   storage,
//   liveFormat,
//   liveQuality,
//   url,
//   auth,
//   watchPassword,
// };
