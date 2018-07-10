
import storage from '../utils/storage';
import {
  parse,
  isJwtExpired,
  setJwt,
  getJwt,
  removeJwt,
  setUpdateJwtHandle,
  sjclPassword,
} from '../utils/auth';

const decode = (str) => {
  try {
    return JSON.parse(decodeURIComponent(str));
  } catch (errMsg) {
    return null;
  }
};

export default {
  saveLoginInfo(str) {
    const loginInfo = decode(str);
    if (!loginInfo || !loginInfo.jwt) {
      storage.remove('loginInfo');
      return undefined;
    }
    if (isJwtExpired(loginInfo.jwt, 12 * 60 * 60)) {
      return null;
    }
    storage.set('loginInfo', JSON.stringify(loginInfo));
    return loginInfo;
  },
  loadLoginInfo() {
    const str = storage.get('loginInfo');
    if (!str) {
      return undefined;
    }
    const loginInfo = JSON.parse(str);
    if (!loginInfo || !loginInfo.jwt) {
      return undefined;
    }
    if (isJwtExpired(loginInfo.jwt, 12 * 60 * 60)) {
      return null;
    }
    return loginInfo;
  },
  removeLoginInfo() {
    return storage.remove('loginInfo');
  },
  getAudByLoginInfo(loginInfo) {
    if (!loginInfo || !loginInfo.jwt) {
      return;
    }
    const claim = parse(loginInfo.jwt);
    if (!claim) {
      return;
    }
    return claim.aud;
  },
  setJwt(jwt) {
    return setJwt(jwt);
  },
  getJwt() {
    return getJwt();
  },
  removeJwt() {
    return removeJwt();
  },
  rememberLoginInfo({ username, expired }) {
    // const str = storage.get('remembered');
    if (username && expired) {
      storage.set('remembered', JSON.stringify({ username, expired }));
    }
  },
  forgetLoginInfo() {
    storage.remove('remembered');
  },
  getRememberedLoginInfo() {
    const str = storage.get('remembered');
    if (!str) {
      return null;
    }
    try {
      const info = JSON.parse(str);
      if (info && info.expired && info.expired > (new Date().getTime() / 1000)) {
        return info;
      } else {
        return null;
      }
    } catch (errMsg) {
      return null;
    }
  },
  isJwtExpired(jwt, expired) {
    return isJwtExpired(jwt, expired);
  },
  setUpdateJwtHandle(updateJwtHandle) {
    return setUpdateJwtHandle(updateJwtHandle);
  },
  getLoginExpired() {
    return Math.ceil(new Date().getTime() / 1000) + (30 * 24 * 60 * 60);
  },
  getJwtExpired() {
    return Math.ceil(new Date().getTime() / 1000) + (2 * 60 * 60);
  },
  getRemberExpired() {
    return Math.ceil(new Date().getTime() / 1000) + (30 * 24 * 60 * 60);
  },
  sjclPassword(password) {
    return sjclPassword(password);
  },
};
