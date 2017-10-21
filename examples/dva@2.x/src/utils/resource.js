import request from './request';

const generateUrl = (a, params) => {
  const pathname = [];
  const p = Object.assign({}, params);
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

  const search = [];
  for (const key in p) {
    if ({}.hasOwnProperty.call(p, key)) {
      search.push(`${key}=${p[key]}`);
    }
  }

  let url = pathname.join('/');
  if (0 !== search.length) {
    url += `?${search.join('&')}`;
  }
  return url;
};
export default function resource(res) {
  // res = '/projects/:project_name/user_roles/:username'
  const a = res.split('/');
  return {
    get(params) {
      const url = generateUrl(a, params);
      return request(url, {
        method: 'GET',
      });
    },
    post(params, data) {
      const url = generateUrl(a, params);
      return request(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    put(params, data) {
      const url = generateUrl(a, params);
      return request(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    remove(params, data) {
      const url = generateUrl(a, params);
      return request(url, {
        method: 'DELETE',
        body: JSON.stringify(data),
      });
    },
  };
}
