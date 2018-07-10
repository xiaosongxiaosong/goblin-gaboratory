import queryString from 'query-string';
import { request, requestNotNecessaryJwt } from '../utils/request';
import config from './config';

// const { request, requestNotNecessaryJwt } = requestUtils;
const { api } = config;


const generateUrl = (a, params) => {
  const pathname = [];
  const p = { ...params };
  for (let i = 0, l = a.length; i < l; i += 1) {
    if (-1 === a[i].search(/:/)) {
      pathname.push(a[i]);
    } else {
      const key = a[i].substr(1);
      if (undefined === p[key]) {
        break;
      } else {
        pathname.push(p[key]);
        delete p[key];
      }
    }
  }

  const search = queryString.stringify(p);
  // for (const key in p) {
  //   if (undefined !== p[key] && null !== p[key]) {
  //     search.push(`${key}=${p[key]}`);
  //   }
  // }

  const url = pathname.join('/');
  if (search) {
    return `${url}?${search}`;
  } else {
    return url;
  }
  // if (0 !== search.length) {
  //   url += `?${search}`;
  // }
  // return url;
};
// const encode = (data) => {
//   const obj = { ...data };
//   for (const key in obj) {
//     if (undefined === obj[key] || null === obj[key]) {
//       delete obj[key];
//     }
//   }
//   return JSON.stringify(obj);
// };

export default function resource(res, opts = {}) {
  // res = '/projects/:project_name/user_roles/:username'
  // const opts = {
  //   notNecessaryJwt: false,
  //   api: api,
  // };
  const apiurl = opts.api || api;
  const requestHandle = opts.notNecessaryJwt ? requestNotNecessaryJwt : request;
  const a = res.split('/');
  return {
    get(params) {
      const url = apiurl + generateUrl(a, params);
      return requestHandle(url, {
        method: 'GET',
      });
    },
    post(params, data) {
      const url = apiurl + generateUrl(a, params);
      return requestHandle(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    put(params, data) {
      const url = apiurl + generateUrl(a, params);
      return requestHandle(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    remove(params, data) {
      const url = apiurl + generateUrl(a, params);
      return requestHandle(url, {
        method: 'DELETE',
        body: JSON.stringify(data),
      });
    },
  };
}
