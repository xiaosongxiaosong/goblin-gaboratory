// import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import projectService from '../../services/project';
import { notifyRequestError } from '../../utils';


export default {
  namespace: 'project-devices',
  state: {
    pageSize: 20,
    list: [],
    page: 1,
    total: undefined,
    loading: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const match = pathname.match(/^\/projects\/([\w-]+)\/devices$/);
        if (match) {
          return dispatch({ type: 'init', payload: { projectName: match[1], search } });
        }
      });
    },
  },

  effects: {
    *init({ payload }, { put }) {
      const parsed = queryString.parse(payload.search);
      const page = parseInt(parsed.page || 1, 10);
      yield put({ type: 'save', payload: { page, list: [], total: undefined } });
      yield put({ type: 'load', payload });
    },
    *load({ payload }, { call, put, select }) {
      const { page, pageSize, loading } = yield select(state => state['project-users']);
      if (loading) {
        return;
      }
      yield put({ type: 'save', payload: { loading: true } });
      const { data, errMsg } = yield call(projectService.getProjectDevices, {
        start: (page - 1) * pageSize,
        limit: pageSize,
        projectName: payload.projectName,
      });
      yield put({ type: 'save', payload: { loading: false, list: (data && data.list) || null, total: (data && data.total) } });
      if (errMsg) {
        notifyRequestError(errMsg, '获取设备列表失败');
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
