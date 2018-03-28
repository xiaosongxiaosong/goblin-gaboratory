import { routerRedux } from 'dva/router';
// import storage from '../utils/storage';
import githubServices from '../services/github';
import userServices from '../services/user';

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
      const [repos, records, favorites] = yield [
        call(userServices.getLocalRepos),
        call(userServices.getLocalReadRecords),
        call(userServices.getLocalFavorites),
      ];
      yield put({ type: 'save', payload: { repos, records, favorites } });
      yield put({ type: 'getOwners', payload: repos });
      yield put({ type: 'getIssues', payload: repos });
      yield put(routerRedux.push('/all'));
    },
    *getOwners({ payload }, { put, call }) {
      // const { repos } = yield select(state => state.app);
      const list = yield payload.map(it => call(githubServices.getUserInfo, it));
      const owners = list.map(({ data }, index) => {
        const matchObj = payload[index].match(/https:\/\/github.com\/(\w+)\/(\w+)(\/.*)?/);
        if (data) {
          return { ...data, repo: matchObj[2], repo_url: payload[index] };
        } else if (matchObj) {
          return { login: matchObj[1], name: matchObj[1], repo: matchObj[2], repo_url: payload[index] };
        } else {
          return null;
        }
      });
      yield put({ type: 'save', payload: { owners } });
    },
    *getIssues({ payload }, { put, call, select }) {
      // const { repos } = yield select(state => state.app);
      const list = yield payload.map(it => call(githubServices.getIssues, it));
      // const issues = list.map(({ data }) => (data || []));
      const { records, favorites } = yield select(state => state.app);
      const issues = list.map(({ data }) => (data || [])).reduce((accumulator, currentValue) => {
        return [...accumulator, ...currentValue];
      }).map((it) => {
        return { ...it, read: records.includes(it.url), favorite: favorites.includes(it.url) };
      });
      yield put({
        type: 'save',
        payload: {
          issues: issues.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          }),
        },
      });
    },
    *routerReduxPush({ payload }, { put }) {
      yield put(routerRedux.push(payload));
    },
    *markAsRead({ payload }, { call }) {
      payload.read = true;    // eslint-disable-line
      yield call(userServices.markAsLocalRead, payload.url);
      // yield put(routerRedux.push(payload));
    },
    *toggleFavorite({ payload }, { call }) {
      payload.favorite = !payload.favorite;    // eslint-disable-line
      if (payload.favorite) {
        yield call(userServices.markAsLocalFavorite, payload.url);
      } else {
        yield call(userServices.unmarkAsLocalFavorite, payload.url);
      }
    },
    // *getOwners({ payload }, { put, call }) {},
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
