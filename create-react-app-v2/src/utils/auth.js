import sjcl from 'sjcl';
// import { call } from 'dva/saga';

import storage from './storage';

// const getJwtFromCookie = () => {
//   const jwt = $.cookie('jwtinfo');
//   return jwt;
// };
const salt = 'opensight.cn';
let updateJwtHandle = null;

// const parse = (jwt) => {
//   const a = jwt.split('.');
//   if (2 > a.length) {
//     return null;
//   }
//   const claim = JSON.parse(window.atob(a[1]));
//   if (undefined === claim.aud || undefined === claim.exp) {
//     return null;
//   }
//   return claim;
// };

export function parse(jwt) {
  const a = jwt.split('.');
  if (2 > a.length) {
    return null;
  }
  const claim = JSON.parse(window.atob(a[1]));
  if (undefined === claim.aud || undefined === claim.exp) {
    return null;
  }
  return claim;
}

export function isJwtExpired(jwt, expired = 0) {
  if (!jwt) {
    return true;
  }
  const claim = parse(jwt);
  if (null === claim) {
    return true;
  }
  if ((claim.exp - expired) * 1000 <= new Date().getTime()) {
    return true;
  }
  return false;
}

export function getJwt() {
  const jwt = storage.get('jwt');
  return isJwtExpired(jwt) ? null : jwt;
}

export function setJwt(jwt) {
  return storage.set('jwt', jwt);
}

export function removeJwt() {
  return storage.remove('jwt');
}

export function setUpdateJwtHandle(handle) {
  updateJwtHandle = handle;
}

export function getEffectiveJwt() {
  // debugger;
  return new Promise((resolve, reject) => {
    const errMsg = new Error('Unauthorized');
    errMsg.response = { status: 401 };
    const jwt = getJwt();
    if (jwt) {
      return resolve(jwt);
    } else if (!updateJwtHandle) {
      return reject(errMsg);
    }
    // debugger;
    updateJwtHandle().then(() => {
      // debugger;
      return resolve(storage.get('jwt'));
    }).catch(() => {
      // debugger;
      return reject(errMsg);
    });
  });
}

export function getJwtTimeLeft() {
  const current = new Date().getTime();
  const jwt = storage.get('jwt');
  if (jwt) {
    const claim = parse(jwt);
    if (claim) {
      return ((parseInt(claim.exp, 10) * 1000) - current);
    }
  }
  return (0 - current);
}

const hour = 60 * 60 * 1000;

export function getUserLoginExpired() {
  return Math.ceil((new Date().getTime() + (30 * 24 * hour)) / 1000);
}

export function getWebLoginExpired() {
  return Math.ceil((new Date().getTime() + (30 * 24 * hour)) / 1000);
}

export function getRemberExpired() {
  return Math.ceil((new Date().getTime() + (30 * 24 * hour)) / 1000);
}

export function sjclPassword(password) {
  return sjcl.codec.hex.fromBits(sjcl.misc.pbkdf2(password, salt, 10000));
}

const getTime = (input) => {
  return input ? new Date().getTime(input) : new Date().getTime();
};
export function getRemberedExpired() {
  return (getTime() + (30 * 24 * hour));
}

export function checkRemberedExpired(expired) {
  if (isNaN(expired)) {
    return false;
  }
  return (expired > getTime());
}

export function getAudFromJwt() {
  const jwt = getJwt();
  if (jwt) {
    const claim = parse(jwt);
    if (claim && claim.aud) {
      return claim.aud;
    }
  }
  return null;
}
