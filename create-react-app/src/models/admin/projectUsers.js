import queryString from 'query-string';
import { notification } from 'antd';
import projectService from '../../services/project';
import { notifyRequestError } from '../../utils';


export default {
  namespace: 'project-users',
  state: {
    roles: undefined,
    pageSize: 20,
    list: [],
    page: 1,
    total: undefined,
    loading: false,
    info: undefined,
    role: undefined,
    saving: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const match = pathname.match(/^\/projects\/([\w-]+)\/users$/);
        if (match) {
          return dispatch({ type: 'init', payload: { projectName: match[1], search } });
        }
        const matchObj = pathname.match(/^\/projects\/([\w-]+)\/users\/([\w-]+)$/);
        if (matchObj && 'add' !== matchObj[2]) {
          return dispatch({ type: 'getUserInfo', payload: { projectName: match[1], username: match[2] } });
        }
      });
    },
  },

  effects: {
    *init({ payload }, { put }) {
      const parsed = queryString.parse(payload.search);
      const page = parseInt(parsed.page || 1, 10);
      yield put({ type: 'save', payload: { page, list: [], total: undefined } });
      yield put({ type: 'getUserRoles', payload });
      yield put({ type: 'load', payload });
    },
    *getUserRoles({ payload }, { call, put, select }) {
      const { roles } = yield select(state => state['project-users']);
      if (roles && 0 < roles.length && payload.projectName === roles[0].project_name) {
        return;
      }
      yield put({ type: 'save', payload: { roles: undefined } });
      const { data, errMsg } = yield call(projectService.getProjectUserRoles, { projectName: payload.projectName });
      yield put({ type: 'save', payload: { roles: data || null } });
      if (errMsg) {
        notifyRequestError(errMsg, '获取用户角色列表失败');
      } else {
        yield put({ type: 'mergeUserRoles' });
      }
    },
    *load({ payload }, { call, put, select }) {
      const { page, pageSize, loading } = yield select(state => state['project-users']);
      if (loading) {
        return;
      }
      yield put({ type: 'save', payload: { loading: true } });
      const { data, errMsg } = yield call(projectService.getProjectUsers, {
        start: (page - 1) * pageSize,
        limit: pageSize,
        projectName: payload.projectName,
      });
      yield put({ type: 'save', payload: { loading: false, list: (data && data.list) || null, total: (data && data.total) } });
      if (errMsg) {
        notifyRequestError(errMsg, '获取用户列表失败');
      } else {
        yield put({ type: 'mergeUserRoles' });
      }
    },
    *mergeUserRoles({ payload }, { put, select }) {
      const { roles, list } = yield select(state => state['project-users']);
      if (!roles || !list || 0 === roles.length || 0 === list.length) {
        return;
      }
      yield put({
        type: 'save',
        payload: {
          list: list.map((it) => {
            const info = roles.find(item => item.username === it.username);
            return { ...it, role: info && info.role };
          }),
        },
      });
    },
    *getUserInfo({ payload }, { put, select }) {
      const { info, role } = yield select(state => state.projects);
      if (!info || payload.username !== info.username) {
        yield put({ type: 'refreshProjectInfo', payload });
      }
      if (!role || payload.projectName !== role.projectName || payload.username !== role.username) {
        yield put({ type: 'refreshUserRole', payload });
      }
    },
    *refreshUserInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { info: undefined } });
      const { data } = yield call(projectService.getProjectUserInfo, payload);
      yield put({ type: 'save', payload: { info: data || null } });
    },
    *refreshUserRole({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { role: undefined } });
      const { data } = yield call(projectService.getProjectUserRole, payload);
      yield put({ type: 'save', payload: { role: data || null } });
    },
    *saveUserInfo({ payload }, { put, call }) {
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
    *updateUserInfo({ payload }, { put, select }) {
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
