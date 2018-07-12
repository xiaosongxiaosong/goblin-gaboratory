// import { message } from 'antd';
import { Modal } from 'antd';
// import { routerRedux } from 'dva/router';
// import { auth } from '../utils/auth';
import { storage, url, auth, delay } from '../utils';
import { user } from '../services';


const aliveInterval = 10 * 60 * 1000;
// const aliveInterval = 10 * 1000;
const decodeUrlUserInfo = (str) => {
  return JSON.parse(decodeURIComponent(str));
};
const storeUserInfo = (str) => {
  const userInfo = decodeUrlUserInfo(str);
  if (false === (userInfo instanceof Object)) {
    return null;
  }
  if ('user_login' === userInfo.type && true === userInfo.remember) {
    // const expired = auth.getRemberedExpired();
    userInfo.expired = auth.getRemberedExpired();
  }

  storage.set('userInfo', JSON.stringify(userInfo));
  return userInfo;
};
const loadUserInfo = () => {
  const str = storage.get('userInfo');
  if (null === str) {
    return null;
  }
  const userInfo = JSON.parse(str);
  if (userInfo && 'user_login' === userInfo.type && false === auth.checkRemberedExpired(userInfo.expired)) {
    return null;
  }
  return userInfo;
};

// const getKeepAliveHandle = ({ put, call }) => {
//   function* keepalive() {
//     yield put({ type: 'keepalive' });
//     while (true) {
//       // debugger;
//       yield call(delay, aliveInterval);
//       yield put({ type: 'keepalive' });
//     }
//   }
//   return keepalive;
// };
function* keepalive({ call, put }) {
  // auth.setUpdateJwtHandle(updateJwt);
  while (true) {
    const timeLeft = auth.getJwtTimeLeft();
    if (timeLeft < aliveInterval) {
      const res = yield call(updateJwt, { call, put });
      if (false === res) {
        return yield put({ type: 'loginFaild' });
      }
    }
    yield call(delay, aliveInterval);
  }
}

const updateJwt = async () => {
  const userInfo = loadUserInfo();
  if (null === userInfo || 'user_login' !== userInfo.type) {
    return false;
  }
  const expired = auth.getUserLoginExpired();
  const response = await user.userLogin({ username: userInfo.username, password: userInfo.password, expired });
  if (response.data) {
    storage.set('jwt', response.data.jwt);
    return true;
  }
  if (response.err) {
    return false;
  }
};

const jump2login = () => {
  const href = url.getLoginUrl(window.location.href);
  window.location.replace(href);
};


export default {
  namespace: 'share',

  state: {
    loginStatus: null,
    userInfo: undefined,
  },

  subscriptions: {
    setup({ dispatch }) {
      return dispatch({ type: 'init' });
    },
  },

  effects: {
    *init({ payload }, { put }) {
      storage.setPrefix('client');
      const search = url.getUrlSearch(window.location.href);
      const obj = url.search2obj(search);
      if (obj && obj.userInfo) {
        return yield put({ type: 'login', payload: obj });
      }
      return yield put({ type: 'loginFromStorage' });
    },
    *login({ payload }, { put }) {
      const { userInfo, jwt, ...obj } = payload;
      // const str = decodeURIComponent(userInfo);
      storeUserInfo(userInfo);
      // storage.set('userInfo', str);
      storage.set('jwt', jwt);

      const search = url.obj2search(obj);
      const href = window.location.href.replace(/\?[^#?]+/, search);
      window.history.replaceState({}, '', href);

      const str = decodeURIComponent(userInfo);
      yield put({ type: 'loginSucceed', payload: JSON.parse(str) });
    },
    *loginFromStorage({ payload }, { put, call }) {
      const timeLeft = auth.getJwtTimeLeft();
      const userInfo = loadUserInfo();
      if (0 < timeLeft) {
        yield put({ type: 'loginSucceed', payload: userInfo });
      } else if (userInfo) {
        // yield put({ type: 'loginFaild' });
        const res = yield call(updateJwt, { put, call });
        if (res) {
          yield put({ type: 'loginSucceed', payload: userInfo });
        } else {
          return yield put({ type: 'loginFaild' });
        }
      } else {
        return yield put({ type: 'loginFaild', payload: { tip: '用户未登录，请登录。' } });
      }
    },
    *loginSucceed({ payload }, { put, fork, take, cancel, call }) {
      yield put({ type: 'getUserInfo', payload });
      if (payload && 'user_login' === payload.type) {
        // 定时检查jwt是否过期
        // const keepalive = getKeepAliveHandle({ put, call });
        const task = yield fork(keepalive, { put, call });
        auth.setUpdateJwtHandle(updateJwt);
        yield take(['logout', 'loginFaild']);
        auth.setUpdateJwtHandle(null);
        yield cancel(task);
      } else {
        auth.setUpdateJwtHandle(null);
        const timeLeft = auth.getJwtTimeLeft();
        yield call(delay, timeLeft);
        yield put({ type: 'loginFromStorage' });
      }
    },
    *getUserInfo({ payload }, { put, call }) {
      const aud = auth.getAudFromJwt();
      if (aud) {
        const response = yield call(user.getUserInfo, aud);
        if (response.data) {
          yield put({ type: 'saveUserInfo', payload: response.data });
          return;
        }
      }
      yield put({ type: 'saveUserInfo', payload: null });
    },
    *loginFaild({ payload }, { put }) {
      yield put({ type: 'saveUserInfo', payload: null });
      // storage.remove('userInfo');
      // storage.remove('jwt');
      // yield put({ type: 'saveUserInfo', payload: null });
      const content = payload.tip || '登录已经过期，请重新登录。';
      Modal.error({
        title: '提示',
        content,
        closable: false,
        maskClosable: false,
        okText: '确定',
        onOk: jump2login,
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    setLoginStauts(state, action) {
      return { ...state, loginStatus: action.payload };
    },
    saveUserInfo(state, action) {
      return { ...state, userInfo: action.payload };
    },
  },
};
