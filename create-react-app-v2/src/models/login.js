import queryString from 'query-string';
import storage from '../utils/storage';

// const { url, storage, delay, auth } = utils;

// const loginByCode = async ({ code }) => {
//   const expired = getWebLoginExpired();
//   const { data, errMsg } = userService.webLogin({ code, expired });
//   if (errMsg) {
//     await Modal.error({ title: '登录失败', content: '登录失败，请重试' });
//     debugger;
//     return null;
//   }
//   debugger;
//   return data;
// };

const replaceState = (searchObj) => {
  const search = queryString.stringify(searchObj);
  const newSearch = search ? `?${search}` : '';
  const href = window.location.href.replace(/^([^?#]+)(\?[^#]+)(#.*)?/, `$1${newSearch}$3`);
  window.history.replaceState({}, '', href);
};


export default {
  namespace: 'login',

  state: {
    search: undefined,
    code: undefined,
    from: 'client',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'init', payload: history.location });
      return history.listen(({ pathname, search }) => {
        // eslint-disable-next-line
        console.log(`pathname(${pathname}), search(${search})`);
        // if ('/' === pathname) {
        //   dispatch({ type: 'login', payload: search });
        // } else if ('register' === pathname) {
        //   dispatch({ type: 'register', payload: search });
        // } else if ('forget' === pathname) {
        //   dispatch({ type: 'forget', payload: search });
        // }
      });
    },
  },

  effects: {
    *init({ payload }, { put }) {
      // storage.setPrefix('client');
      const search = queryString.parse(payload.search || '');
      const from = search.from && decodeURIComponent(search.from).match(/^[^?#]+\/admin\.html([#?].+)?/) ? 'admin' : 'client';
      storage.setPrefix(from);
      const { code, ...parsed } = queryString.parse(window.location.search || '');
      if (code) {
        replaceState(parsed);
      }
      yield put({ type: 'save', payload: { search, code, from } });
    },
    *login({ payload }, { put }) {
      const search = queryString.parse(window.location.search || '');
      yield put({ type: 'save', payload: { search: search || {} } });
    },
    *register({ payload }, { put }) {
      const search = queryString.parse(window.location.search || '');
      yield put({ type: 'save', payload: { search: search || {} } });
    },
    *forget({ payload }, { put }) {
      const search = queryString.parse(window.location.search || '');
      yield put({ type: 'save', payload: { search: search || {} } });
    },
    *loginSucceed({ payload }, { select }) {
      const { search } = yield select(state => state.login);
      // TODO: 切换到 browseHistory 时需修改
      let from = search && search.from;
      if (from) {
        from = decodeURIComponent(from);
      } else {
        from = './#/';
      }
      if (-1 === from.indexOf('#')) {
        from += '#/';
      }
      const match = from.match(/^([^#]+#[^?]+)(\?.*)?$/);
      const parsed = queryString.parse((match && match[2]) || '');
      const newSearch = queryString.stringify({ ...parsed, loginInfo: encodeURIComponent(JSON.stringify(payload)) });
      const href = from.replace(/^([^#]+#[^?]+)(\?.*)?$/, `$1?${newSearch}`);
      window.location.replace(href);
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
