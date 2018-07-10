import queryString from 'query-string';
import { notification } from 'antd';
import projectService from '../../services/project';
import { notifyRequestError } from '../../utils';


export default {
  namespace: 'projects',
  state: {
    pageSize: 20,
    list: [],
    page: 1,
    total: undefined,
    filterKey: 'title',
    filterValue: '',
    loading: false,
    info: undefined,
    saving: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if ('/projects' === pathname) {
          return dispatch({ type: 'init', payload: { search } });
        }
        const match = pathname.match(/^\/projects\/([\w-]+)\//);
        if (match) {
          return dispatch({ type: 'getProjectInfo', payload: { projectName: match[1] } });
        }
      });
    },
  },

  effects: {
    *init({ payload }, { put }) {
      const parsed = queryString.parse(payload.search);
      const page = parseInt(parsed.page || 1, 10);
      yield put({ type: 'save', payload: { filterKey: parsed.k || 'title', filterValue: parsed.v || '', page } });
      yield put({ type: 'save', payload: { list: [], total: undefined } });
      yield put({ type: 'load', payload });
    },
    *load({ payload }, { call, put, select }) {
      const { page, pageSize, filterKey, filterValue, loading } = yield select(state => state.projects);
      if (loading) {
        return;
      }
      yield put({ type: 'save', payload: { loading: true } });
      const params = filterValue ? { filter_key: filterKey, filter_value: filterValue } : {};
      const { data, errMsg } = yield call(projectService.getProjects, {
        start: (page - 1) * pageSize,
        limit: pageSize,
        ...params,
      });
      yield put({ type: 'save', payload: { loading: false, list: (data && data.list) || null, total: (data && data.total) } });
      if (errMsg) {
        // TODO: 获取商户列表失败提示
      }
    },
    *getProjectInfo({ payload }, { put, select }) {
      const { info } = yield select(state => state.projects);
      if (info && payload.projectName === info.name) {
        return;
      }
      yield put({ type: 'refreshProjectInfo', payload });
    },
    *refreshProjectInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { info: undefined } });
      const { data } = yield call(projectService.getProjectInfo, payload);
      yield put({ type: 'save', payload: { info: data || null } });
    },
    *saveProjectInfo({ payload }, { put, call }) {
      yield put({ type: 'save', payload: { saving: true } });
      const { errMsg } = yield call(projectService.updateProjectInfo, payload);
      yield put({ type: 'save', payload: { saving: false } });
      if (errMsg) {
        notifyRequestError(errMsg, '修改商户信息失败');
      } else {
        yield put({ type: 'saveProjectInfo', payload });
        notification.success({ message: '修改录像信息成功' });
      }
    },
    *updateProjectInfo({ payload }, { put, select }) {
      const { info } = yield select(state => state.projects);
      const { projectName, ...newData } = payload;
      if (info && projectName === info.name) {
        yield put({ type: 'save', payload: { info: { ...info, ...newData } } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
