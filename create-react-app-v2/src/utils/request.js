import fetch from 'dva/fetch';
// import { api } from './config';
import { getEffectiveJwt } from './auth';

// const { getEffectiveJwt } = auth;

function parseText(response) {
  return response.text();
}

function parseJSON(text) {
  return new Promise((resolve) => {
    const res = '' === text ? {} : JSON.parse(text);
    resolve(res);
  });
}

function checkStatus(response) {
  if (200 <= response.status && 300 > response.status) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function request(resource, opts) {
  // debugger;
  return getEffectiveJwt().then((jwt) => {
    return ajax(resource, opts, jwt);
  }).catch(errMsg => ({ errMsg }));
}

export function requestNotNecessaryJwt(resource, opts) {
  return getEffectiveJwt().then((jwt) => {
    return ajax(resource, opts, jwt);
  }).catch(() => {
    return ajax(resource, opts);
  });
}

export function requestWithoutJwt(resource, opts) {
  return ajax(resource, opts);
}

function ajax(resource, opts, jwt) {
  // const url = api + resource;

  const headers = {
    'Content-Type': 'application/json',
  };
  if (jwt) {
    headers.Authorization = `Bearer ${jwt}`;
  }
  const options = Object.assign({}, {
    method: 'GET',
    mode: 'cors',
    headers,
  }, opts);

  return fetch(resource, options)
    .then(checkStatus)
    .then(parseText)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(errMsg => ({ errMsg }));
}

// export default {
//   request,
//   requestNotNecessaryJwt,
//   requestWithoutJwt,
// };
