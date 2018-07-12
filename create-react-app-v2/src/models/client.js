import React from 'react';
import { Modal } from 'antd';
import { routerRedux } from 'dva/router';
import UA from 'ua-device';
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

const userAgentDetect = () => {
  const output = new UA(window.navigator.userAgent);
  if ('mobile' !== output.device.type) {
    // PC与平板不跳转
    return;
  }

  if ('微信' === output.browser.name) {
    // TODO: 手机如果是微信浏览器跳转到code login地址，访问wx管理端，使用binding更新jwt
  } else {
    // TODO: 其他手机浏览器跳转到手机管理端，使用用户名密码更新jwt
  }
};

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
  namespace: 'client',

  state: {
    // loginStatus: null,
    userInfo: undefined,
    projects: [],
    // user: [],
    selected: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'jump2loading', payload: history.location });
      return history.listen(({ pathname, search }) => {
        if (loadingPagePathname === pathname) {
          return dispatch({ type: 'load', payload: search });
        }
        const match = pathname.match(/^\/p\/([\w-]+)/);
        if (match) {
          dispatch({ type: 'selectProject', payload: match[1] });
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
      userAgentDetect();
      storage.setPrefix('client');
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
      // if (loginInfoService.isJwtExpired(jwt, aliveInterval / 1000)) {
      //   const { data, errMsg } = yield call(getJwtByLoginInfo, info);
      //   if (errMsg) {
      //     return yield put({ type: 'loginFaild', payload: null });
      //   }
      //   loginInfoService.setJwt(data.jwt);
      // }
      // yield put({ type: 'loginSucceed', payload: { search: parsedSearch } });
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
      // yield put({ type: 'getProjects', payload });
      const task = yield fork(keepalive, { put, call });
      loginInfoService.setUpdateJwtHandle(getUpdateJwtHandle(put));
      yield take(['logout', 'loginFaild']);
      loginInfoService.setUpdateJwtHandle(null);
      yield cancel(task);
    },
    *loginFaild({ payload }, { put, call }) {
      loginInfoService.removeLoginInfo();
      loginInfoService.removeJwt();
      yield put({ type: 'save', payload: { userInfo: null, projects: null } });
      const tip = undefined === payload ? '用户未登录，请登录' : '登录已过期，请重新登录';
      yield call(showErrorModal, tip);
      jump2login();
    },
    *getUserResource({ payload }, { put, call }) {
      const info = loginInfoService.loadLoginInfo();
      const username = loginInfoService.getAudByLoginInfo(info);
      if (!username) {
        yield put({ type: 'save', payload: { userInfo: null, projects: null } });
        yield put({ type: 'loginFaild', payload: null });
        return;
      }
      const [userInfo, projects] = yield [
        call(userService.getUserInfo, username),
        call(userService.getUserProjects, username),
      ];
      if (userInfo.data && projects.data) {
        yield put({ type: 'save', payload: { userInfo: userInfo.data, projects: projects.data } });
        yield put({ type: 'jump', payload: { userInfo: userInfo.data, projects: projects.data, search: payload.search } });
      } else {
        // 加载用户资源失败，刷新页面
        yield put({ type: 'save', payload: { userInfo: null, projects: null } });
        yield call(showErrorModal, '加载用户资源失败，请刷新页面重试');
        window.location.reload();
      }
    },
    *jump({ payload }, { put }) {
      if (!payload.userInfo.cellphone) {
        // DONE: 未完善用户资料的用户跳转到完善资料引导页面
        return yield put(routerRedux.replace('/guide/user'));
      }
      if (0 === payload.projects.length) {
        // DONE: 没有创建商户的用户跳转到创建商户引导页面
        return yield put({ type: 'jump2guideProject' });
      }

      if (payload.search) {
        const { pathname, ...parsedSearch } = payload.search;
        if (pathname) {
          return yield put(routerRedux.replace({
            pathname,
            search: queryString.stringify(parsedSearch),
          }));
        }
      }
      const selectedProjectName = storage.get('selectedProjectName');
      if (selectedProjectName) {
        const selectedProject = payload.projects.filter((it) => {
          return selectedProjectName === it.name;
        });
        if (0 < selectedProject.length) {
          return yield put(routerRedux.replace(`/p/${selectedProjectName}/project`));
        }
      }
      return yield put({ type: 'jump2defaultProject', payload });
    },
    *jump2guideProject({ payload }, { put }) {
      return yield put(routerRedux.replace('/guide/project'));
    },
    *jump2guideFinish({ payload }, { put }) {
      yield put({ type: 'updateProject', payload });
      yield put({ type: 'selectProject', payload: payload.name });
      return yield put(routerRedux.replace('/guide/finish'));
    },
    *jump2defaultProject({ payload }, { put, select }) {
      const { projects } = yield select(state => state.client);
      if (0 < projects.length) {
        return yield put(routerRedux.replace(`/p/${projects[0].name}/project`));
      } else {
        return yield put({ type: 'jump2guideProject' });
      }
    },
    *selectProject({ payload }, { put, select }) {
      const { projects, selected } = yield select(state => state.client);
      if (selected !== payload) {
        const i = projects.findIndex((it) => { return payload === it.name; });
        if (-1 !== i) {
          storage.set('selectedProjectName', payload);
          return yield put({ type: 'save', payload: { selected: payload } });
        } else {
          return yield put({ type: 'jump2defaultProject' });
        }
      }
    },
    *updateProject({ payload }, { put, select }) {
      const { projects } = yield select(state => state.client);
      const i = projects.findIndex((it) => {
        return it.name === payload.name;
      });
      if (-1 === i) {
        projects.push(payload);
      } else {
        projects[i] = { ...projects[i], payload };
      }
      return yield put({ type: 'save', payload: { projects } });
    },
    *showCsmModal({ payload }, { select }) {
      const { projects } = yield select(state => state.client);
      const i = projects.findIndex((it) => {
        return it.name === payload.projectName;
      });
      if (-1 === i) {
        return;
      }
      Modal.info({
        title: payload.title,
        content: (<div>
          <p>{payload.content}</p>
          {projects[i].csm_phone && <div>
            <p>客&nbsp;&nbsp;&nbsp;&nbsp;服：{projects[i].csm}</p>
            <p>电&nbsp;&nbsp;&nbsp;&nbsp;话：{projects[i].csm_phone}</p>
            <p>微信号：{projects[i].csm_wechat}</p>
          </div>}
          {!projects[i].csm_phone && <div>
            <p>客服电话：15557169910</p>
          </div>}
        </div>),
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    // setLoginStauts(state, action) {
    //   return { ...state, loginStatus: action.payload };
    // },
    // saveUserInfo(state, action) {
    //   return { ...state, userInfo: action.payload };
    // },
    // saveProjects(state, action) {
    //   return { ...state, projects: action.payload };
    // },
  },
};
