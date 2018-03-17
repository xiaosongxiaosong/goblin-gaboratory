import { routerRedux } from 'dva/router';
import storage from '../utils/storage';
import githubServices from '../services/github';

export default {

  namespace: 'app',

  state: {
    repos: [],
    issues: undefined,
    owners: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      dispatch({ type: 'loading' });
      // return history.listen(({ pathname }) => {
      //   if ('/all' === pathname) {
      //     return dispatch({ type: 'getAllIssues' });
      //   }
      //   const match = pathname.match(/^\/repo\//);
      //   if (match) {
      //     dispatch({ type: 'selectProject', payload: match[1] });
      //   }
      // });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *loading({ payload }, { put, call }) {
      try {
        const { items } = yield call(storage.get, 'repos');
        yield put({ type: 'save', payload: { repos: JSON.parse(items) } });
      } catch (errMsg) {
        yield put({
          type: 'save',
          payload: {
            repos: [
              'https://github.com/sorrycc/blog',
              'https://github.com/dwqs/blog',
            ],
          },
        });
      }
      yield put({ type: 'getOwners' });
      yield put({ type: 'getIssues' });
      yield put(routerRedux.push('/all'));
    },
    *getOwners({ payload }, { put, call, select }) {
      const { repos } = yield select(state => state.app);
      const list = yield repos.map(it => call(githubServices.getUserInfo, it));
      const owners = list.map(({ data }, index) => {
        const matchObj = repos[index].match(/https:\/\/github.com\/(\w+)\/(\w+)(\/.*)?/);
        if (data) {
          return { ...data, repo: matchObj[2], repo_url: repos[index] };
        } else if (matchObj) {
          return { login: matchObj[1], name: matchObj[1], repo: matchObj[2], repo_url: repos[index] };
        } else {
          return null;
        }
      });
      yield put({ type: 'save', payload: { owners } });
    },
    *getIssues({ payload }, { put, call, select }) {
      const { repos } = yield select(state => state.app);
      const list = yield repos.map(it => call(githubServices.getIssues, it));
      // const issues = list.map(({ data }) => (data || []));
      // debugger;
      const issues = list.map(({ data }) => (data || []));
      // [].concat(...issues)
      // reduce((accumulator, currentValue) => [...accumulator, ...currentValue]);
      yield put({ type: 'save', payload: { issues: [].concat(...issues).sort((a, b) => a.created_at - b.created_at) } });
    },
    // *getOwners({ payload }, { put, call }) {},
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
