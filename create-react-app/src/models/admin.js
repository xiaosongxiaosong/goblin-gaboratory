// import React from 'react';
import { Modal } from 'antd';
import { routerRedux } from 'dva/router';
// import UA from 'ua-device';
import queryString from 'query-string';
// import url from '../utils/url';
import storage from '../utils/storage';
import userService from '../services/user';
import loginInfoService from '../services/loginInfo';
import { delay } from '../utils';

// eslint-disable-next-line
// 登录成功 url：http://localhost:8000/#/?loginInfo=%257B%2522jwt%2522%253A%2522eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJsNllPVkdYSG9OcWxwUFotcTk1OCIsImF1ZCI6InVfS01jdm15ZGxVUW5jV2pQOSIsImV4cCI6MTUzMDc4NDExNX0.8IQMODOEGCF2Zy_K_Uoz7RWGbTzveNCZRhbvcBCkPiw%2522%257D
// 登录测试 url： http://localhost:8000/?pathname=/p/JWmwP8luxpQ08rsR/shows#/?page=3&pathname=%2Fp%2Fopensight_internal%2Fevents
// const { storage, url, auth, delay } = utils;

// const userAgentDetect = () => {
//   const output = new UA(window.navigator.userAgent);
//   if ('mobile' !== output.device.type) {
//     // PC与平板不跳转
//     return;
//   }

//   if ('微信' === output.browser.name) {
//     // TODO: 手机如果是微信浏览器跳转到code login地址，访问wx管理端，使用binding更新jwt
//   } else {
//     // TODO: 其他手机浏览器跳转到手机管理端，使用用户名密码更新jwt
//   }
// };

const aliveInterval = 10 * 60 * 1000;

function* keepalive({ call, put }) {
  // eslint-disable-next-line
  while (true) {
    yield call(delay, aliveInterval);
    const jwt = loginInfoService.getJwt();
    const resolved = yield put.resolve({ type: 'updateJwt', payload: { jwt } });
    if (!resolved) {
      return;
    }
  }
}

const getUpdateJwtHandle = ({ put }) => {
  // eslint-disable-next-line
  return function* () {
    // eslint-disable-next-line
    debugger;
    // eslint-disable-next-line
    console.log('Update Jwt Handle 被调用');
    const jwt = loginInfoService.getJwt();
    return yield put.resolve({ type: 'updateJwt', payload: { jwt } });
  };
};

// const updateJwt = async () => {
//   const loginInfo = loginInfoService.loadLoginInfo();
//   if (!loginInfo) {
//     return false;
//   }
//   const { data } = await getJwtByLoginInfo(loginInfo);
//   if (!data) {
//     return false;
//   }
//   loginInfoService.setJwt(data.jwt);
//   return true;
// };

const getJwtByLoginInfo = (loginInfo) => {
  const username = loginInfoService.getAudByLoginInfo(loginInfo);
  const expired = loginInfoService.getJwtExpired();
  return userService.getJwt({ jwt: loginInfo.jwt, username, expired });
};

// const getOriginAndPathname = (href) => {
//   const match = href.match(originAndPathnameReg);
//   return match ? match[0] : '';
// };

// const getLoginUrl = (href, login = '/login.html') => {
//   const search = `?from=${encodeURIComponent(href)}`;
//   const originAndPathname = getOriginAndPathname(href);
//   const url = originAndPathname.replace(/^http:/, 'https:').replace(/\/[^/]*$/, login);
//   return `${url}${search}`;
// };

const showErrorModal = (content = '登录已过期，请重新登录') => {
  return new Promise((reslove) => {
    Modal.error({ title: '提示', content, onOk: reslove });
  });
};
const showLogoutModal = (content = '是否退出登录？') => {
  return new Promise((reslove) => {
    Modal.confirm({
      title: '注销',
      content,
      onOk() {
        reslove(true);
      },
      onCancel() {
        reslove(false);
      },
    });
  });
};

const jump2login = () => {
  const url = window.location.href.match(/^[^#?]+/)[0];
  // TODO: 切换到 browseHistory 时需修改 login 的路径
  const loginUrl = url.replace(/^http:/, 'https:').replace(/\/[^/]*$/, '/login.html#/');
  const search = queryString.stringify({ from: window.location.href });
  window.location.replace(`${loginUrl}?${search}`);
};

// TODO: 切换到 browseHistory 时需修改
const replaceState = (parsedSearch) => {
  const search = queryString.stringify(parsedSearch);
  const newSearch = search ? `?${search}` : '';
  const href = window.location.href.replace(/^([^#]+#[^?]*)(\?.+)$/, `$1${newSearch}`);
  window.history.replaceState({}, '', href);
};

const loadingPagePathname = '/';
export default {
  namespace: 'admin',

  state: {
    userInfo: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'jump2loading', payload: history.location });
      return history.listen(({ pathname, search }) => {
        if (loadingPagePathname === pathname) {
          return dispatch({ type: 'load', payload: search });
        }
      });
    },
  },

  effects: {
    *jump2loading({ payload }, { put }) {
      if (loadingPagePathname === payload.pathname) {
        return;
      }
      const parsedSearch = queryString.parse(payload.search);
      const search = queryString.stringify({ ...parsedSearch, pathname: payload.pathname });
      yield put(routerRedux.replace({
        pathname: loadingPagePathname,
        search,
      }));
    },
    *load({ payload }, { put }) {
      // userAgentDetect();
      storage.setPrefix('admin');
      const { loginInfo, ...parsedSearch } = queryString.parse(payload);
      let info;
      if (loginInfo) {
        info = loginInfoService.saveLoginInfo(loginInfo);
        replaceState(parsedSearch);
      } else {
        info = loginInfoService.loadLoginInfo();
      }
      if (!info) {
        return yield put({ type: 'loginFaild', payload: info });
      }
      const jwt = loginInfoService.getJwt();
      const resolved = yield put.resolve({ type: 'updateJwt', payload: { jwt, loginInfo: info } });
      if (resolved) {
        yield put({ type: 'loginSucceed', payload: { search: parsedSearch } });
      }
    },
    *updateJwt({ payload }, { put, call }) {
      if (loginInfoService.isJwtExpired(payload.jwt, aliveInterval / 1000)) {
        const loginInfo = payload.loginInfo || loginInfoService.loadLoginInfo();
        const { data, errMsg } = yield call(getJwtByLoginInfo, loginInfo);
        if (errMsg) {
          yield put({ type: 'loginFaild', payload: null });
          return false;
        }
        loginInfoService.setJwt(data.jwt);
      }
      return true;
    },
    *loginSucceed({ payload }, { put, fork, take, cancel, call }) {
      yield put({ type: 'getUserResource', payload });
      const task = yield fork(keepalive, { put, call });
      loginInfoService.setUpdateJwtHandle(getUpdateJwtHandle(put));
      yield take(['logout', 'loginFaild']);
      loginInfoService.setUpdateJwtHandle(null);
      yield cancel(task);
    },
    *loginFaild({ payload }, { put, call }) {
      const tip = undefined === payload ? '用户未登录，请登录' : '登录已过期，请重新登录';
      yield call(showErrorModal, tip);
      yield put({ type: 'jump2login' });
    },
    *getUserResource({ payload }, { put, call }) {
      const info = loginInfoService.loadLoginInfo();
      const username = loginInfoService.getAudByLoginInfo(info);
      if (!username) {
        yield put({ type: 'save', payload: { userInfo: null } });
        yield put({ type: 'loginFaild', payload: null });
        return;
      }
      const { data } = yield call(userService.getUserInfo, username);
      if (data && 1 === data.user_type) {
        yield put({ type: 'save', payload: { userInfo: data } });
        yield put({ type: 'jump', payload: { userInfo: data, search: payload.search } });
      } else if (data && 1 !== data.user_type) {
        // 用户无权限
        yield put({ type: 'save', payload: { userInfo: null } });
        yield call(showErrorModal, '用户无权限，请更换用户登录');
        yield put({ type: 'jump2login' });
      } else {
        // 加载用户资源失败，刷新页面
        yield put({ type: 'save', payload: { userInfo: null } });
        yield call(showErrorModal, '加载用户资源失败，请刷新页面重试');
        window.location.reload();
      }
    },
    *jump({ payload }, { put }) {
      if (payload.search) {
        const { pathname, ...parsedSearch } = payload.search;
        if (pathname) {
          return yield put(routerRedux.replace({
            pathname,
            search: queryString.stringify(parsedSearch),
          }));
        }
      }
      return yield put(routerRedux.replace('/home'));
    },
    *logout({ payload }, { put, call }) {
      const res = yield call(showLogoutModal, '是否退出登录？');
      if (res) {
        yield put({ type: 'jump2login' });
      }
    },
    *jump2login({ payload }, { put }) {
      loginInfoService.removeLoginInfo();
      loginInfoService.removeJwt();
      yield put({ type: 'save', payload: { userInfo: null } });
      jump2login();
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
